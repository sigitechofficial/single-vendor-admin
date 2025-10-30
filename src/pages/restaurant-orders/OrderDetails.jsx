import React, { useEffect, useRef, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import Layout from "../../components/Layout";
import Loader from "../../components/Loader";
import { PostAPI } from "../../utilities/PostAPI";
import { error_toaster } from "../../utilities/Toaster";
import { PiPrinterDuotone } from "react-icons/pi";
import { LiaMapSolid } from "react-icons/lia";
import { FaCheck } from "react-icons/fa6";
import { IoMailOutline } from "react-icons/io5";
import { LuPhone } from "react-icons/lu";
import dayjs from "dayjs";
import { BASE_URL, googleApiKey } from "../../utilities/URL";
import { useTranslation } from "react-i18next";
import { TiLocationOutline } from "react-icons/ti";
import {
  GoogleMap,
  InfoWindow,
  useJsApiLoader,
  MarkerF,
} from "@react-google-maps/api";
import timezone from "dayjs/plugin/timezone";
import localizedFormat from "dayjs/plugin/localizedFormat";
import utc from "dayjs/plugin/utc";
import { getDriverLocation } from "../../firebase/firebaseDatabase";
import { useNavigate, useParams } from "react-router-dom";
dayjs.extend(localizedFormat);
dayjs.extend(timezone);
dayjs.extend(utc);

export default function OrderDetails() {
  const [libraries] = useState(["places", "drawing"]);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {orderId} = useParams()
  const [data, setData] = useState("");
  const [driverLocations, setDriverLocations] = useState();
  const mapRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const timetaken = "";
  const driverLatLng = {};
  const [center, setCenter] = useState({ lat: 31.5497, lng: 74.3436 });
  const [driverCurrent, setDriverCurrent] = useState(null);
  const [redMarker, setRedMarker] = useState(null);
  const [showingInfoWindow, setShowingInfoWindow] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [activeMarker, setActiveMarker] = useState();
  const currencySign =
    data?.restaurant?.zoneRestaurant?.zone?.zoneDetail?.currencyUnit?.symbol;
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: googleApiKey,
    libraries,
  });

  const onMarkerClick = (place, marker) => {
    setSelectedPlace(place);
    setActiveMarker(marker);
    setShowingInfoWindow(true);
  };
  const onInfoWindowClose = () => {
    setActiveMarker(null);
    setShowingInfoWindow(false);
  };
  const customerMarker = {
    lat: Number(data?.dropOffID?.lat),
    lng: Number(data?.dropOffID?.lng),
  };
  const restaurantMarker = {
    lat: Number(data?.restaurant?.lat),
    lng: Number(data?.restaurant?.lng),
  };
  const driverMarker = {
    lat: Number(driverLocations?.lat),
    lng: Number(driverLocations?.lng),
  };

  const containerStyle = {
    width: "100%",
    height: "400px",
  };

  const pickedUpTime = data?.orderHistories?.find(
    (itm) => itm?.orderStatus?.name === "Food Pickedup"
  )?.time;
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const today = new Date().getDay();
  const todaysTime = data?.restaurant?.times?.find(
    (time) => parseInt(time.day) === today
  );

  useEffect(() => {
    const getDetails = async () => {
      const res = await PostAPI("admin/orderdetailbyid", {
        orderId: orderId,
      });
      if (res?.data?.status === "1") {
        setData({
          ...res?.data?.data,
          timeTaken: res?.data?.timeTaken,
          driverLatLng: res?.data?.driverLatLng,
        });
        setDriverCurrent(res?.data?.driverLatLng);
      } else {
        error_toaster(res?.data?.message);
      }
    };
    getDetails();
  }, [orderId]);

  // get driver location from firebase
  useEffect(() => {
    const unsubscribe = getDriverLocation((dr) => {
      if (dr) {
        setDriverLocations(dr[data?.driverId]);
      }
    });

    return () => unsubscribe();
  }, [data?.driverId]);

  useEffect(() => {
    if (mapInstance && data) {
      const bounds = new window.google.maps.LatLngBounds();

      if (customerMarker.lat && customerMarker.lng) {
        bounds.extend(
          new window.google.maps.LatLng(customerMarker.lat, customerMarker.lng)
        );
      }

      if (restaurantMarker.lat && restaurantMarker.lng) {
        bounds.extend(
          new window.google.maps.LatLng(
            restaurantMarker.lat,
            restaurantMarker.lng
          )
        );
      }

      if (driverMarker.lat && driverMarker.lng) {
        bounds.extend(
          new window.google.maps.LatLng(driverMarker.lat, driverMarker.lng)
        );
      }

      // Fit the map to the bounds of the markers
      mapInstance.fitBounds(bounds);
    }
  }, [data, mapInstance]);

  const handleMapLoad = (map) => {
    setMapInstance(map);
  };

  return data?.length === 0 ? (
    <Loader />
  ) : (
    <Layout
      content={
        <div className="bg-themeGray p-5 mb-[200px] font-switzer">
          <div className="bg-white rounded-lg p-5 space-y-5">
            <div className="flex gap-5 items-center">
              <button
                className="bg-themeGray p-2 rounded-full"
                onClick={() => window.history.back()}
              >
                <FaArrowLeft />
              </button>
              <div className="flex flex-col">
                <h2 className="text-themeRed text-lg font-bold font-norms">
                  {t("Order Details")}
                </h2>
                {/* <p className="font-medium text-[#00000099]">
                  Order # {data?.orderNum}
                </p> */}
              </div>
            </div>

            <div className="w-full flex gap-x-5">
              <div className="w-[55%] shadow-cardShadow rounded-lg p-5">
                <div className="flex justify-between">
                  <h4 className="font-medium text-xl flex items-center">
                    Order#
                    <span className="font-medium text-base text-themeBorderGray">
                      {data?.orderNum ? data?.orderNum : "N/A"}
                    </span>
                  </h4>
                  <div className="flex gap-3">
                    <button className="flex items-center gap-1 font-medium border border-gray-300 rounded-md px-2 py-1.5 h-9 hover:bg-theme hover:text-white duration-100">
                      <LiaMapSolid size={19} />
                      <p
                        onClick={() => {
                          setRedMarker(driverCurrent?.id);
                          setCenter({
                            lat: driverCurrent?.lat,
                            lng: driverCurrent?.lng,
                          });
                     window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
                        }}
                      >
                        {t("Show Location On Map")}
                      </p>
                    </button>
                    <button className="flex items-center gap-1 text-white bg-red-500 font-medium border border-gray-300 rounded-md px-2 py-1.5 h-9 hover:bg-theme hover:text-white duration-100">
                      <PiPrinterDuotone size={19} />
                      <p>{t("Print Invoice")}</p>
                    </button>{" "}
                  </div>
                </div>
                <div className="mt-5 flex flex-col gap-3">
                  <div className="flex">
                    <p className="font-medium text-themeBorderGray">
                      {t("Order created")}:&nbsp;
                    </p>{" "}
                    <p className="font-medium">
                      {data?.createdAt
                        ? dayjs(data?.createdAt)
                            .local()
                            .format("DD-MM-YYYY HH:mm:ss")
                        : "N/A"}
                    </p>
                  </div>
                  <div className="flex">
                    <p className="font-medium text-themeBorderGray">
                      {t("Order Delivered")}:&nbsp;
                    </p>{" "}
                    <p className="font-medium">
                      {dayjs(data?.orderHistories.at(-1)?.time)
                        .local()
                        .format("DD-MM-YYYY HH:mm:ss")}
                    </p>
                  </div>
                  {data?.orderMode?.name.includes("Schedule") && (
                    <div className="flex">
                      <p className="font-medium text-themeBorderGray">
                        {t("Schedule Date")}:&nbsp;
                      </p>{" "}
                      <p className="font-medium">
                        {dayjs(data?.restaurant?.scheduleDate)
                          .local()
                          .format("DD-MM-YYYY HH:mm:ss")}
                      </p>
                    </div>
                  )}
                  <div className="flex">
                    <p className="font-medium text-themeBorderGray">
                      {t("Delivery Address")}:&nbsp;
                    </p>{" "}
                    <p className="font-medium line-clamp-2">
                      {data?.dropOffID?.streetAddress}
                    </p>
                  </div>
                  <div className="flex">
                    <p className="font-medium text-themeBorderGray">
                      {t("Approximate Delivery Time")}:&nbsp;
                    </p>{" "}
                    <p className="font-medium">
                      {data?.restaurant?.approxDeliveryTime + " mins"}
                    </p>
                  </div>
                  <div className="flex">
                    <p className="font-medium text-themeBorderGray">
                      {t("Time Taken")}:&nbsp;
                    </p>{" "}
                    <p className="font-medium">{data?.timeTaken}</p>
                  </div>
                  <div className="flex">
                    <p className="font-medium text-themeBorderGray">
                      {t("Payment Method")}:&nbsp;
                    </p>{" "}
                    <p className="font-medium">
                      {data?.paymentMethod ? data?.paymentMethod.name : "N/A"}
                    </p>
                  </div>
                  <div className="flex">
                    <p className="font-medium text-themeBorderGray">
                      {t("Payment Status")}:&nbsp;
                    </p>{" "}
                    <p>
                      {" "}
                      {data?.orderStatus?.name === t("Reject") ||
                      data?.orderStatus?.name === t("Cancelled") ? (
                        <div className="font-medium px-3 bg-gray-500 rounded-md text-white">
                          {t("void")}
                        </div>
                      ) : data?.paymentRecieved ? (
                        <div className="font-medium px-3 bg-green-500 rounded-md text-white">
                          {t("Paid")}
                        </div>
                      ) : (
                        <div className="font-medium px-3 bg-red-200 rounded-md text-red-600">
                          {t("Unpaid")}
                        </div>
                      )}
                    </p>
                  </div>
                  <div className="flex">
                    <p className="font-medium text-themeBorderGray">
                      {t("Order Mode")}:&nbsp;
                    </p>{" "}
                    <p className="font-medium px-3 bg-gray-200 rounded-md text-red-600">
                      {data?.orderMode.name ? data?.orderMode.name : "N/A"}
                    </p>
                  </div>
                  <div className="flex">
                    <p className="font-medium text-themeBorderGray">
                      {t("Order Type")}:&nbsp;
                    </p>{" "}
                    <p className="font-medium">
                      {data?.deliveryType.name
                        ? data?.deliveryType.name
                        : "N/A"}
                    </p>
                  </div>
                  <div className="flex">
                    <p className="font-medium text-themeBorderGray">
                      {t("Delivery by")}:&nbsp;
                    </p>{" "}
                    <p className="font-medium">
                      {data?.DriverId?.driverType
                        ? data?.DriverId?.driverType
                        : data?.orderStatus?.name.includes("Delivered")
                        ? "Fomino"
                        : "--"}
                    </p>
                  </div>
                  {data?.orderStatus?.name.includes("Reject") && (
                    <div className="flex">
                      <p className="font-medium text-themeBorderGray">
                        {t("Rejected by")}:&nbsp;
                      </p>{" "}
                      <p className="font-medium">{"Retailer"}</p>
                    </div>
                  )}
                  {data?.orderStatus?.name.includes("Cancelled") && (
                    <div className="flex">
                      <p className="font-medium text-themeBorderGray">
                        {t("Cancelled by")}:&nbsp;
                      </p>{" "}
                      <p className="font-medium">{"Customer"}</p>
                    </div>
                  )}
                  {data?.orderCharge?.fine && (
                    <div className="flex">
                      <p className="font-medium text-themeBorderGray">
                        {t("Fine")}:&nbsp;
                      </p>{" "}
                      <p className="font-medium">
                        {data?.orderCharge?.fine
                          ? currencySign + data?.orderCharge?.fine
                          : "00"}
                      </p>
                    </div>
                  )}
                </div>
                <hr className="bg-gray-300 h-[1px] my-5" />

                {data?.orderItems.map((items, index) => (
                  <>
                    <div className="flex gap-3 mt-6">
                      <div className="flex w-[180px] h-[120px] shrink-0">
                        <img
                          className="w-full h-full rounded-md object-cover shrink-0"
                          src={`${BASE_URL}${items?.R_PLink?.image}`}
                          alt="image"
                        />
                      </div>
                      <div className="w-full">
                        <div className="flex justify-between">
                          <h4 className="font-bold text-xl ">
                            {items?.quantity}x {items?.R_PLink?.name}
                          </h4>

                          <p className="font-bold text-xl whitespace-nowrap ">
                            {currencySign} {items?.total}
                          </p>
                        </div>

                        <div className="font-medium text-themeBorderGray text-sm flex flex-col justify-between">
                          {items?.orderAddOns.length > 0
                            ? items?.orderAddOns?.map((item, idx) => {
                                return (
                                  <div className="flex flex-wrap w-full">
                                    <div className="font-semibold">
                                      {
                                        item?.addOn?.collectionAddon?.collection
                                          ?.title
                                      }
                                    </div>{" "}
                                    &nbsp;:{item?.qty}x &nbsp;{" "}
                                    <div className="font-light">
                                      {item?.addOn?.name
                                        ? item?.addOn?.name
                                        : "No AddOn"}
                                      &nbsp;
                                    </div>
                                    <p className="font-bold text-sm flex justify-end ml-auto">
                                      {currencySign} {item?.total}
                                    </p>
                                  </div>
                                );
                              })
                            : "No addOns from backend"}
                        </div>
                      </div>
                    </div>
                  </>
                ))}
                {data?.orderCulteries.map((items, index) => (
                  <>
                    <h4 className="font-bold text-xl mt-3">Cutlery</h4>
                    <div className="flex gap-3 mt-2">
                      <div className="flex w-[180px] h-[120px] shrink-0">
                        <img
                          className="w-full h-full rounded-md object-cover shrink-0"
                          src={`${BASE_URL}${items?.cutlery.image}`}
                          alt="image"
                        />
                      </div>
                      <div className="">
                        <h4 className="font-bold text-xl ">
                          {items?.cutlery?.orderApplicationId}x{" "}
                          {items?.cutlery?.name}
                        </h4>
                        <div className="font-medium text-themeBorderGray text-sm mt-2z` w-full">
                          <p>{items?.cutlery?.description}</p>
                        </div>
                      </div>
                      <div className="flex-1 text-end">
                        <p className="font-bold text-xl whitespace-nowrap ">
                          {currencySign} {items?.cutlery?.price}
                        </p>
                      </div>
                    </div>
                  </>
                ))}

                <div className="flex justify-between text-lg font-medium text-themeBorderGray mt-6">
                  <div className="flex justify-between w-1/3">
                    <div className="flex flex-col gap-2 whitespace-nowrap">
                      <p>{t("Subtotal")}</p>
                      <p>{t("Delivery Fee")}</p>
                      <p>{t("Service Charge")}</p>
                      <p>{t("Packing Fee")}</p>
                      <p>{t("Credits")}</p>
                      <p>{t("Tip")}</p>
                    </div>

                    <div className="flex flex-col gap-2 whitespace-nowrap">
                      <p>
                        {data?.orderItems?.length === 1 ? (
                          <div>
                            {data?.orderItems?.length} {t("Item")}
                          </div>
                        ) : (
                          <div>
                            {data?.orderItems?.length} {t("Items")}
                          </div>
                        )}
                      </p>
                      <p>{""}</p>
                      <p>{""}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 whitespace-nowrap">
                    <p>
                      {data?.subTotal
                        ? `${currencySign} ${data?.subTotal}`
                        : "N/A"}
                    </p>
                    <p>
                      {data?.orderCharge?.deliveryFees
                        ? `${currencySign} ${data?.orderCharge?.deliveryFees}`
                        : `${currencySign} 0.00`}
                    </p>
                    <p>
                      {data?.orderCharge?.serviceCharges
                        ? `${currencySign} ${data?.orderCharge?.serviceCharges}`
                        : `${currencySign} 0.00`}{" "}
                    </p>
                    <p>
                      {data?.orderCharge?.packingFee
                        ? `${currencySign} ${data?.orderCharge?.packingFee}`
                        : `${currencySign} 0.00`}
                    </p>
                    <p>{data?.credits ? `${data?.credits}` : "0.00"}</p>
                    <p>
                      {data?.orderCharge?.tip
                        ? `${currencySign} ${data?.orderCharge?.tip}`
                        : `${currencySign} 0.00`}
                    </p>
                  </div>
                </div>

                <hr className="bg-gray-300 h-[1px] my-2" />
                <div className="font-bold text-xl flex justify-between mt-2">
                  <p>{t("Total")}</p>
                  <p>
                    {currencySign} {data?.total}
                  </p>
                </div>
              </div>

              <div className="w-[45%] font-switzer shadow-cardShadow rounded-lg p-5">
                <div className="flex flex-col justify-center gap-3 items-center bg-red-500 rounded-xl text-white py-6">
                  <h4 className="text-xl font-bold">{`${
                    data?.orderHistories
                      ?.at(-1)
                      ?.orderStatus?.name.includes("Delivered")
                      ? "DELIVERED"
                      : "ON DELIVERY"
                  }`}</h4>
                  <p>
                    {dayjs(data?.orderHistories.at(-1)?.time)
                      .local()
                      .format("DD-MM-YYYY HH:mm:ss")}
                  </p>
                </div>

                <div className="space-y-4 pl-3 min-h-[100px] relative">
                  {data?.orderHistories?.map((his, ind) => (
                    <div className="flex items-center mt-6 before:w-[2px] before:h-full before:absolute before:top-0 before:left-[27px] before:bg-red-400 before:z-[1] last:bg-white last:relative last:z-10 last:before:w-0">
                      <div className="flex justify-center items-center font-semibold w-8 h-[30px] bg-themeRed rounded-full text-white -mt-5 relative z-10">
                        <FaCheck />
                      </div>
                      <div className="flex flex-col w-full">
                        <div className="font-switzer ml-3">
                          <p> {his?.orderStatus?.name}</p>
                          {his?.time
                            ? dayjs(his?.time)
                                .local()
                                .format("DD-MM-YYYY HH:mm:ss")
                            : "N/A"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ====================== */}
            <div className="pb-14 space-y-5">
              <div className="w-full grid 2xl:grid-cols-3 md:grid-cols-2 gap-6 [&>div]:p-5 [&>div]:rounded-lg [&>div]:shadow-cardShadow [&>div]:cursor-pointer">
                {data?.DriverId && (
                  <div
                    className="w-full relative"
                    onClick={() => {
                      setCenter({
                        lat: parseFloat(data?.driverLatLng?.lat),
                        lng: parseFloat(data?.driverLatLng?.lng),
                      });
                      setRedMarker("driver");
                      navigate("/driver-details", {
                        state: {
                          id: data?.driverId,
                        },
                      });
                    }}
                  >
                    <h4 className="text-red-500 font-semibold text-lg mb-4">
                      Driver Details
                    </h4>
                    {driverLocations?.lat ? (
                      <p className="absolute top-6 right-4 text-themeGreen text-sm">
                        Online
                      </p>
                    ) : (
                      <p className="absolute top-6 right-4 text-red-500 text-sm">
                        Offline
                      </p>
                    )}
                    <div className="flex gap-x-3">
                      <img
                        className="w-[150px] h-[120px] rounded-lg bg-gray-500 text-red-500"
                        src={BASE_URL + data?.DriverId?.image}
                        alt=""
                      />
                      <div className="[&>div]:flex [&>div]:gap-x-2 [&>div]:items-center [&>div>p]:text-gray-500 space-y-1 [&>div>p]:w-full  [&>div>p]:break-all">
                        <h4 className="text-xl font-semibold text-red-500">
                          #{data?.vehicleTypeId ? data?.vehicleTypeId : "N/A"}
                        </h4>
                        <h3 className="text-lg font-semibold">
                          {" "}
                          {data?.DriverId?.firstName || data?.DriverId?.lastName
                            ? `${data?.DriverId?.firstName} ${data?.DriverId?.lastName}`
                            : "N/A"}
                        </h3>
                        <div>
                          <LuPhone className="text-red-500 text-lg" />
                          <p>
                            {" "}
                            {data?.DriverId?.countryCode ||
                            data?.DriverId?.phoneNum
                              ? `${data?.DriverId?.countryCode}${data?.DriverId?.phoneNum}`
                              : "N/A"}
                          </p>
                        </div>
                        <div>
                          <IoMailOutline className="text-red-500 text-lg font-bold" />
                          <p>
                            {" "}
                            {data?.DriverId?.email
                              ? data?.DriverId?.email
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-10 [&>div]:flex [&>div]:justify-between [&>div]:items-center [&>div>p]:text-gray-500 [&>div>p]:font-light [&>div>span]:font-semibold">
                      <div>
                        <p>Order Number : </p>
                        <span>#{data?.orderNum || "N/A"}</span>
                      </div>
                      <div>
                        <p>Pickup Time : </p>
                        <span>
                          {dayjs(pickedUpTime)?.local()?.format("h:mm:ss a")}
                        </span>
                      </div>
                      <div>
                        <p>Delivery Time : </p>
                        <span>
                          {dayjs(data?.orderHistories.at(-1)?.time)
                            .local()
                            .format("h:mm:ss a")}
                        </span>
                      </div>
                      <div>
                        <p>Distance Covered : </p>
                        <span>{data?.distance} Km</span>
                      </div>
                      <div>
                        <p>Earning : </p>
                        <span>
                          {currencySign} {data?.orderCharge?.driverEarnings}
                        </span>
                      </div>

                      <div>
                        <p className="font-semibold">Rating:</p>
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <span
                              key={index}
                              className={
                                index <
                                Math.round(
                                  data?.driverRatings &&
                                    data?.driverRatings[0]?.value / 2
                                )
                                  ? "text-yellow-500"
                                  : "text-gray-400"
                              }
                            >
                              &#9733;
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div
                  className=""
                  onClick={() => {
                    setCenter({
                      lat: parseFloat(data?.dropOffID?.lat),
                      lng: parseFloat(data?.dropOffID?.lng),
                    });
                    setRedMarker("user");
                    navigate("/user-details", {
                      state: {
                        id: data?.userId,
                      },
                    });
                  }}
                >
                  <h4 className="text-red-500 font-semibold text-lg mb-4">
                    User Details
                  </h4>
                  <div className="flex gap-x-3">
                    <img
                      className="w-[150px] h-[120px] rounded-lg object-cover bg-gray-500"
                      src={BASE_URL + data?.user?.image}
                      alt=""
                    />
                    <div className="[&>div]:flex [&>div]:gap-x-2 [&>div]:items-center [&>div>p]:text-gray-500 space-y-1 [&>div>p]:break-all">
                      <h3 className="text-lg font-semibold">
                        {data?.user?.userName ? data?.user?.userName : "N/A"}
                      </h3>
                      <div>
                        <LuPhone className="text-red-500 text-lg" />
                        <p>
                          {data?.user?.countryCode}
                          {data?.user?.phoneNum}
                        </p>
                      </div>
                      <div>
                        <IoMailOutline className="text-red-500 text-lg font-bold" />
                        <p>{data?.user?.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-10 [&>div]:flex [&>div]:justify-between [&>div]:items-center [&>div>p]:text-gray-500 [&>div>p]:font-light [&>div>span]:font-semibold">
                    <div>
                      <p>Order Number : </p>
                      <span>#{data?.orderNum || "N/A"}</span>
                    </div>
                    <div>
                      <p>Order created Time : </p>
                      <span>
                        {data?.createdAt
                          ? dayjs(data?.createdAt).local().format("HH:mm:ss")
                          : "N/A"}
                      </span>
                    </div>
                    <div>
                      <p>Address : </p>
                      <span className="line-clamp-2">
                        {data?.dropOffID?.streetAddress}
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  className="md:col-span-2 2xl:col-span-1"
                  onClick={() => {
                    setCenter({
                      lat: Number(data?.restaurant?.lat),
                      lng: Number(data?.restaurant?.lng),
                    });
                    setRedMarker("restaurant");
                    navigate("/edit-restaurant", {
                      state: {
                        resId: data?.restaurantId,
                      },
                    });
                  }}
                >
                  <h4 className="text-red-500 font-semibold text-lg mb-4">
                    Restaurant Details
                  </h4>
                  <div className="flex gap-x-3">
                    <img
                      className="w-[150px] h-[120px] rounded-lg object-cover bg-gray-500"
                      src={BASE_URL + data?.restaurant?.image}
                      alt=""
                    />
                    <div className="[&>div]:flex [&>div]:gap-x-2 [&>div]:items-center [&>div>p]:text-gray-500 space-y-1 [&>div>p]:break-all">
                      <h3 className="text-lg font-semibold">
                        {data?.restaurant?.businessName}
                      </h3>
                      <div>
                        <LuPhone className="text-red-500 text-lg" />
                        <p>
                          {data?.restaurant?.countryCode}
                          {data?.restaurant?.phoneNum}
                        </p>
                      </div>
                      <div>
                        <TiLocationOutline className="text-red-500 text-xl font-bold" />
                        <p>{data?.restaurant?.address}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-10 [&>div]:flex [&>div]:justify-between [&>div]:items-center [&>div>p]:text-gray-500 [&>div>p]:font-light [&>div>span]:font-semibold">
                    <div>
                      <p>Current status : </p>
                      <span>
                        {data?.restaurant?.isOpen ? "Open" : "Closed"}
                      </span>
                    </div>
                    <div>
                      <p>Operating Time : </p>
                      <span>
                        {daysOfWeek[today]} - {todaysTime?.startAt?.trim()} -{" "}
                        {todaysTime?.endAt?.trim()}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold">Rating:</p>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <span
                            key={index}
                            className={
                              index < Math.round(data?.restaurant?.rating / 2)
                                ? "text-yellow-500"
                                : "text-gray-400"
                            }
                          >
                            &#9733;
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-2 2xl:col-span-1">
                  <h4 className="text-red-500 font-semibold text-lg mb-4">
                    Banner Details
                  </h4>
                  <h4 className="font-semibold text-md mb-4">
                    Overall Discount : {currencySign + " " + data?.bannerDiscount}
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
                    {data?.bannerOrders?.map((item, idx) => {
                      return (
                        <div
                          key={idx}
                          className="border rounded-lg p-4  [&>div>p]:text-gray-500 [&>div>p]:font-light"
                        >
                          <h4 className="text-red-500">
                            {item?.restaurantBanner?.bannerType}
                          </h4>
                          <h3 className="">{item?.restaurantBanner?.title}</h3>
                          <div>
                            <p>Discount : {currencySign + " " + item?.amount}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex-1 w-full bg-white shadow-cardShadow rounded-lg p-5">
                {isLoaded ? (
                  <GoogleMap
                    // center={center}
                    mapContainerStyle={containerStyle}
                    zoom={10}
                    ref={mapRef}
                    center={customerMarker}
                    onLoad={handleMapLoad}
                  >
                    {/* Customer Marker */}
                    {data?.dropOffID?.lat && (
                      <MarkerF
                        position={customerMarker}
                        icon={{
                          url: "/images/customer.png",
                          scaledSize: new window.google.maps.Size(45, 50),
                        }}
                        onClick={() =>
                          onMarkerClick(
                            { name: "Customer location" },
                            {
                              position: {
                                lat: parseFloat(data?.dropOffID?.lat),
                                lng: parseFloat(data?.dropOffID?.lng),
                              },
                            }
                          )
                        }
                      />
                    )}

                    {/* Restaurant Marker */}
                    {data?.restaurant?.lat && data?.restaurant?.lng && (
                      <MarkerF
                        position={restaurantMarker}
                        icon={{
                          url: "/images/rest.png",
                          scaledSize: new window.google.maps.Size(45, 50),
                        }}
                        onClick={() =>
                          onMarkerClick(
                            { name: "Restaurant location" },
                            {
                              position: {
                                lat: parseFloat(data?.restaurant?.lat),
                                lng: parseFloat(data?.restaurant?.lng),
                              },
                            }
                          )
                        }
                      />
                    )}

                    {/* Driver Marker */}
                    {data?.driverLatLng && (
                      <MarkerF
                        position={driverMarker}
                        icon={{
                          url: "/images/driver.png",
                          scaledSize: new window.google.maps.Size(45, 50),
                        }}
                        onClick={() =>
                          onMarkerClick(
                            { name: "Driver location" },
                            {
                              position: {
                                lat: data?.driverLatLng.lat,
                                lng: data?.driverLatLng.lng,
                              },
                            }
                          )
                        }
                      />
                    )}

                    {/* Info Window */}
                    {showingInfoWindow && (
                      <InfoWindow
                        position={activeMarker.position}
                        onCloseClick={onInfoWindowClose}
                      >
                        <div>
                          <h1>{selectedPlace.name}</h1>
                        </div>
                      </InfoWindow>
                    )}
                  </GoogleMap>
                ) : (
                  "Map is loading..."
                )}
              </div>
            </div>
          </div>
        </div>
      }
    />
  );
}
