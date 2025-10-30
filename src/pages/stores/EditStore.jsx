import React, { useCallback, useEffect, useRef, useState } from "react";
import { FaArrowLeft, FaStar } from "react-icons/fa";
import Layout from "../../components/Layout";
import "react-phone-input-2/lib/style.css";
import Loader, { MiniLoader } from "../../components/Loader";
import { BlackButton, TabButton } from "../../utilities/Buttons";
import Select from "react-select";
import { useLocation } from "react-router-dom";
import GetAPI from "../../utilities/GetAPI";
import { PostAPI } from "../../utilities/PostAPI";
import { error_toaster, success_toaster } from "../../utilities/Toaster";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { BASE_URL, googleApiKey } from "../../utilities/URL";
import { PutAPI } from "../../utilities/PutAPI";
import Switch from "react-switch";
import dayjs from "dayjs";
import {
  GoogleMap,
  useLoadScript,
  Autocomplete,
  MarkerF,
  Polygon,
} from "@react-google-maps/api";
import Helment from "../../components/Helment";
import MyDataTable from "../../components/MyDataTable";
import { useTranslation } from "react-i18next";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { toast } from "react-toastify";

export default function EditStore() {
  const location = useLocation();
  const { data, reFetch } = GetAPI(
    `admin/getmetadatarestaurant/${location?.state?.resId}`
  );
  const { data: restEarnings, reFetch: restEarningsRefetch } = GetAPI(
    `admin/restaurantEarnings/${location?.state?.resId}`
  );
  console.log("🚀 ~ EditStore ~ data:", data);
  const deliveryType = GetAPI("admin/activedeliverytype");
  const [tab, setTab] = useState("General");
  const [search, setSearch] = useState("");
  const [loader, setLoader] = useState(false);
  const [map, setMap] = useState(null);
  const [center, setCenter] = useState({ lat: 31.5204, lng: 74.3587 });
  const [markerPosition, setMarkerPosition] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);
  const drawnPolygonRef = useRef(null);
  const drawingManagerRef = useRef(null);
  const mapRef = useRef(null);
  const [polygonPath, setPolygonPath] = useState([]);
  const [coordinates, setCoordinates] = useState([]);
  const [draw, setDraw] = useState(false);
  const [libraries] = useState(["places", "drawing", "geometry"]);
  const { t } = useTranslation();
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: googleApiKey,
    libraries,
  });
  const containerStyle = {
    width: "100%",
    height: "350px",
  };

  const [general, setGeneral] = useState({
    id: "",
    businessName: "",
    businessEmail: "",
    description: "",
    countryCode: "+92",
    phoneNum: "",
    certificateCode: "",
    logo: "",
    coverImage: "",
    openingTime: "",
    closingTime: "",
  });
  console.log("🚀 ~ EditStore ~ general:", general);
  const [deliveryData, setDeliveryData] = useState({
    deliveryTypeId: "",
    deliveryFeeTypeId: "",
    deliveryFeeFixed: "0.00",
    baseCharge: "0.00",
    baseDistance: "0.00",
    chargePerExtraUnit: "0.00",
    extraUnitDistance: "0.00",
    restaurantId: "",
    id: "",
  });
  const [metaData, setMetaData] = useState({
    id: "",
    address: "",
    approxDeliveryTime: "",
    city: "",
    deliveryRadius: "",
    isFeatured: false,
    isPureVeg: false,
    lat: "",
    lng: "",
    zipCode: "",
  });
  const [chargesData, setChargesData] = useState({
    minOrderAmount: "",
    packingFee: "",
    comission: "",
    pricesIncludeVAT: "",
    VATpercent: "",
    id: "",
  });
  const [bankData, setBankData] = useState({
    id: "",
    firstName: "",
    lastName: "",
    bankName: "",
    accountHolderName: "",
    accountNo: "",
    IBAN: "",
    swiftCode: "",
    bankAddress: "",
    bankCountry: "",
    streetAddress: "",
    zip: "",
    city: "",
    country: "",
  });

  const deliveryTypeOptions = [];
  deliveryType?.data?.data?.map((del, ind) => {
    deliveryTypeOptions.push({
      value: del?.id,
      label: del?.name,
    });
  });

  const deliveryFeeOptions = [
    { value: 1, label: "Static" },
    { value: 2, label: "Dynamic" },
  ];

  const priceOptions = [
    { value: 1, label: "True" },
    { value: 2, label: "False" },
  ];

  const columnsDriver = [
    { field: "sn", header: t("Serial. No") },
    {
      field: "driverName",
      header: t("Driver Name"),
    },
    {
      field: "amount",
      header: t("Amount"),
    },

    {
      field: "email",
      header: t("Email"),
    },
  ];
  const [array, setArray] = useState([]);
  const [updateConfig, setUpdateConfig] = useState({});

  const handleOnEventChange = (e) => {
    setDeliveryData({ ...deliveryData, [e.target.name]: e.target.value });
  };

  const dataDriver = restEarnings?.data?.commissons?.map((item, idx) => ({
    sn: idx + 1,
    driverName: item?.user?.firstName + " " + item?.user?.lastName,
    amount:
      (item?.amount || 0) +
      " " +
      restEarnings?.data?.restaurantUnit?.currencyUnit?.symbol,
    email: item?.user?.email,
  }));
  useEffect(() => {
    const fetchData = () => {
      if (data && data?.data) {
        setDeliveryData({
          deliveryTypeId: data?.data?.deliveryData?.deliveryTypeId,
          deliveryFeeTypeId: data?.data?.deliveryData?.deliveryFeeTypeId,
          deliveryFeeFixed: data?.data?.deliveryData?.deliveryFeeFixed,
          baseCharge: data?.data?.deliveryData?.deliveryFeeValues?.baseCharge,
          baseDistance:
            data?.data?.deliveryData?.deliveryFeeValues?.baseDistance,
          chargePerExtraUnit:
            data?.data?.deliveryData?.deliveryFeeValues?.chargePerExtraUnit,
          extraUnitDistance:
            data?.data?.deliveryData?.deliveryFeeValues?.extraUnitDistance,
        });
        setGeneral({
          id: location?.state?.resId,
          businessName: data?.data?.general?.businessName,
          businessEmail: data?.data?.general?.businessEmail,
          description: data?.data?.general?.description,
          countryCode: data?.data?.general?.countryCode,
          phoneNum: data?.data?.general?.phoneNum,
          certificateCode: data?.data?.general?.certificateCode,
          logo: data?.data?.general?.logo,
          coverImage: data?.data?.general?.coverImage,
          openingTime: data?.data?.general?.openingTime,
          closingTime: data?.data?.general?.closingTime,
        });
        setMetaData({
          id: location?.state?.resId,
          address: data?.data?.metaData?.address,
          approxDeliveryTime: data?.data?.metaData?.approxDeliveryTime,
          city: data?.data?.metaData?.city,
          deliveryRadius: data?.data?.metaData?.deliveryRadius,
          isFeatured: data?.data?.metaData?.isFeatured,
          isPureVeg: data?.data?.metaData?.isPureVeg,
          lat: data?.data?.metaData?.lat,
          lng: data?.data?.metaData?.lng,
          zipCode: data?.data?.metaData?.zipCode,
        });
        setCenter({
          lat: parseFloat(data?.data?.metaData?.lat),
          lng: parseFloat(data?.data?.metaData?.lng),
        });
        setMarkerPosition({
          lat: parseFloat(data?.data?.metaData?.lat),
          lng: parseFloat(data?.data?.metaData?.lng),
        });

        setChargesData({
          id: location?.state?.resId,
          minOrderAmount: data?.data?.charges?.minOrderAmount,
          packingFee: data?.data?.charges?.packingFee,
          comission: data?.data?.charges?.comission,
          pricesIncludeVAT: data?.data?.charges?.pricesIncludeVAT,
          VATpercent: data?.data?.charges?.VATpercent,
        });
        setBankData({
          id: data?.data?.bankDetails?.bankDetails?.id,
          firstName: data?.data?.bankDetails?.bankDetails?.firstName,
          lastName: data?.data?.bankDetails?.bankDetails?.lastName,
          bankName: data?.data?.bankDetails?.bankDetails?.bankName,
          accountHolderName:
            data?.data?.bankDetails?.bankDetails?.accountHolderName,
          accountNo: data?.data?.bankDetails?.bankDetails?.accountNo,
          IBAN: data?.data?.bankDetails?.bankDetails?.IBAN,
          swiftCode: data?.data?.bankDetails?.bankDetails?.swiftCode,
          bankAddress: data?.data?.bankDetails?.bankDetails?.bankAddress,
          bankCountry: data?.data?.bankDetails?.bankDetails?.bankCountry,
          streetAddress: data?.data?.bankDetails?.bankDetails?.streetAddress,
          zip: data?.data?.bankDetails?.bankDetails?.zip,
          city: data?.data?.bankDetails?.bankDetails?.city,
          country: data?.data?.bankDetails?.bankDetails?.country,
        });
      }
    };
    fetchData();
  }, [data, location?.state?.resId]);

  const handleGeneralEventChange = (e) => {
    setGeneral({ ...general, [e.target.name]: e.target.value });
  };

  const handleMetaEventChange = (e) => {
    setMetaData({ ...metaData, [e.target.name]: e.target.value });
  };

  const handleChargeEventChange = (e) => {
    setChargesData({ ...chargesData, [e.target.name]: e.target.value });
  };

  const handleBankEventChange = (e) => {
    setBankData({ ...bankData, [e.target.name]: e.target.value });
  };
  // =========Handle button click================

  const handleButtonClick = (str) => {
    setArray((prevArray) => {
      let newArray;
      if (prevArray.includes(str)) {
        newArray = prevArray.filter((item) => item !== str);
      } else {
        newArray = [...prevArray, str];
      }
      return newArray;
    });
  };

  // =====updateConfigurations=========
  const handleSwitchConfigChange = async (checked, name) => {
    setUpdateConfig((prevConfig) => {
      const newConfig = { ...prevConfig, [name]: checked };
      updateConfigurations(newConfig);
    });
  };
  const updateConfigurations = async (config) => {
    try {
      const res = await PutAPI(
        `admin/updateConfiguration/${location?.state?.resId}`,
        config
      );
      if (res?.data?.status === "1") {
        toast.success(res?.data?.message);
        reFetch();
      }
    } catch (error) {
      toast.error("Failed to update configurations.");
    }
  };
  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file && type === "Cover Image") {
      const imageUrl = URL.createObjectURL(file);
      setGeneral({
        ...general,
        coverImage: file,
        coverImageShow: imageUrl,
      });
    }
    if (file && type === "Logo Image") {
      const imageUrl = URL.createObjectURL(file);
      setGeneral({
        ...general,
        logo: file,
        logoShow: imageUrl,
      });
    }
  };

  const updateGeneralData = async () => {
    setLoader(true);

    const formData = new FormData();
    formData.append("id", general?.id);
    formData.append("businessName", general?.businessName);
    formData.append("businessEmail", general?.businessEmail);
    formData.append("description", general?.description);
    formData.append("countryCode", general?.countryCode);
    formData.append("phoneNum", general?.phoneNum);
    formData.append("certificateCode", general?.certificateCode);
    formData.append("openingTime", general?.openingTime);
    formData.append("closingTime", general?.closingTime);
    formData.append("logo", general?.logo);
    formData.append("coverImage", general?.coverImage);

    let res = await PutAPI("admin/editrestaurantgeneral", formData);
    if (res?.data?.status === "1") {
      reFetch();
      setLoader(false);
      success_toaster(res?.data?.message);
    } else {
      setLoader(false);
      error_toaster(res?.data?.message);
    }
  };

  const updateMetaData = async () => {
    setLoader(true);
    let res = await PutAPI("admin/editrestaurantmetadata", {
      id: metaData?.id,
      address: metaData?.address,
      approxDeliveryTime: metaData?.approxDeliveryTime,
      city: metaData?.city,
      deliveryRadius: metaData?.deliveryRadius,
      isFeatured: metaData?.isFeatured,
      isPureVeg: metaData?.isPureVeg,
      lat: center?.lat,
      lng: center?.lng,
      zipCode: metaData?.zipCode,
    });
    if (res?.data?.status === "1") {
      reFetch();
      setLoader(false);
      success_toaster(res?.data?.message);
    } else {
      setLoader(false);
      error_toaster(res?.data?.message);
    }
  };

  const updateChargesData = async () => {
    setLoader(true);
    let res = await PutAPI("admin/editrestaurantcharges", {
      id: chargesData?.id,
      minOrderAmount: chargesData?.minOrderAmount,
      packingFee: chargesData?.packingFee,
      comission: chargesData?.comission,
      pricesIncludeVAT: chargesData?.pricesIncludeVAT,
      VATpercent: chargesData?.VATpercent,
    });
    if (res?.data?.status === "1") {
      reFetch();
      setLoader(false);
      success_toaster(res?.data?.message);
    } else {
      setLoader(false);
      error_toaster(res?.data?.message);
    }
  };

  const updateBankData = async () => {
    setLoader(true);
    const res = await PostAPI("admin/updateDirector", {
      id: bankData?.id,
      firstName: bankData?.firstName,
      lastName: bankData?.lastName,
      bankName: bankData?.bankName,
      accountHolderName: bankData?.accountHolderName,
      accountNo: bankData?.accountNo,
      IBAN: bankData?.IBAN,
      swiftCode: bankData?.swiftCode,
      bankAddress: bankData?.bankAddress,
      bankCountry: bankData?.bankCountry,
      streetAddress: bankData?.streetAddress,
      zip: bankData?.zip,
      city: bankData?.city,
      country: bankData?.country,
    });
    if (res?.data?.status === "1") {
      success_toaster(res?.data?.message);
      reFetch();
      setLoader(false);
    } else {
      error_toaster(res?.data?.message);
      setLoader(false);
    }
  };

  const updateDelivery = async () => {
    setLoader(true);
    const res = await PostAPI("admin/editrestaurantdeliverysettings", {
      deliveryTypeId: deliveryData?.deliveryTypeId,
      deliveryFeeTypeId: deliveryData?.deliveryFeeTypeId,
      deliveryFeeFixed: deliveryData?.deliveryFeeFixed,
      baseCharge: deliveryData?.baseCharge,
      baseDistance: deliveryData?.baseDistance,
      chargePerExtraUnit: deliveryData?.chargePerExtraUnit,
      extraUnitDistance: deliveryData?.extraUnitDistance,
      restaurantId: location?.state?.resId,
      id: location?.state?.resId,
    });
    if (res?.data?.status === "1") {
      success_toaster(res?.data?.message);
      reFetch();
      setLoader(false);
    } else {
      error_toaster(res?.data?.message);
      setLoader(false);
    }
  };

  const onMapLoad = useCallback(
    (map) => {
      setMap(map);
      map.setOptions({ draggableCursor: "grab" });

      if (data?.data?.metaData.coordinates?.coordinates[0]) {
        const formattedCoordinates =
          data.data.metaData.coordinates.coordinates[0].map(([lat, lng]) => ({
            lat,
            lng,
          }));

        setPolygonPath(formattedCoordinates);
        fitMapToPolygon(map, formattedCoordinates);

        // Create an editable polygon
        const editablePolygon = new window.google.maps.Polygon({
          paths: formattedCoordinates,
          strokeColor: "#FF0000",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#FF0000",
          fillOpacity: 0.35,
          clickable: false,
          editable: false,
          draggable: false,
          geodesic: false,
        });

        editablePolygon.setMap(map);
        updatePolygonListeners(editablePolygon);
      }
    },
    [data, map]
  );

  const fitMapToPolygon = (map, polygonPaths) => {
    if (!map || polygonPaths.length === 0) return;

    const bounds = new window.google.maps.LatLngBounds();
    polygonPaths.forEach(({ lat, lng }) =>
      bounds.extend(new window.google.maps.LatLng(lat, lng))
    );
    map.fitBounds(bounds);
  };

  const handlePathChanged = (polygon) => {
    const paths = polygon
      .getPath()
      .getArray()
      .map(({ lat, lng }) => ({ lat: lat(), lng: lng() }));
    setNewPolygon(paths);
    fitMapToPolygon(map, paths);
  };

  const updatePolygonListeners = (polygon) => {
    const path = polygon.getPath();
    window.google.maps.event.addListener(path, "set_at", () =>
      handlePathChanged(polygon)
    );
    window.google.maps.event.addListener(path, "insert_at", () =>
      handlePathChanged(polygon)
    );
    window.google.maps.event.addListener(path, "remove_at", () =>
      handlePathChanged(polygon)
    );
  };

  const handlePlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        const location = place.geometry.location;
        setCenter({ lat: location.lat(), lng: location.lng() });
        setMarkerPosition({ lat: location.lat(), lng: location.lng() });
        map.panTo(location);
        map.setZoom(15);
        const address = place.formatted_address;
        setMetaData({ ...metaData, address });
      }
    }
  };

  const handleSwitchChange = (checked, name) => {
    setMetaData({ ...metaData, [name]: checked });
  };

  const menuData = () => {
    return data?.data?.menuSetting?.rmc?.map((category) => {
      const searches = search[category.menuCategory.name] || "";
      return {
        ...category,
        R_PLinks: category.R_PLinks.filter((link) => {
          return (
            search === "" ||
            (link.id && link.id.toString().includes(searches.toLowerCase())) ||
            (link.name &&
              link.name.toLowerCase().includes(searches.toLowerCase()))
          );
        }),
      };
    });
  };

  const handleSearchChange = (categoryName, value) => {
    setSearch({
      ...search,
      [categoryName]: value,
    });
  };

  const columns = [
    { field: "sn", header: t("Serial. No") },
    { field: "id", header: t("Id") },
    {
      field: "image",
      header: t("Image"),
    },
    {
      field: "name",
      header: t("Name"),
    },
  ];

  const datas = menuData()?.map((category, catIndex) => ({
    header: category.menuCategory.name,
    data: category.R_PLinks.map((val, ind) => ({
      sn: ind + 1,
      id: val?.id,
      name: val?.name,
      image: (
        <div>
          <img
            src={`${BASE_URL}${val?.image}`}
            alt="image"
            className="w-24 h-24"
          />
        </div>
      ),
    })),
  }));

  const clearAll = () => {
    setCoordinates([]);
    setDraw(false);

    if (drawnPolygonRef.current) {
      drawnPolygonRef.current.setMap(null);
      drawnPolygonRef.current = null;
    }

    if (drawingManagerRef.current) {
      drawingManagerRef.current.setMap(null);
      drawingManagerRef.current = null;
    }
  };

  const undoLastPoint = () => {
    if (coordinates?.length > 1) {
      const updatedPath = [...coordinates?.slice(0, -1)];
      setCoordinates(updatedPath);
    }
  };

  const toggleDraw = () => {
    if (draw) {
      stopDrawing();
      setCoordinates([]);
      if (drawnPolygonRef.current) {
        drawnPolygonRef.current.setMap(null);
        drawnPolygonRef.current = null;
      }
    } else {
      startDrawing();
    }

    setDraw((prev) => !prev);
  };

  const addRestDeliveryArea = async () => {
    let coords = formatCoordinates(coordinates);
    let res = await PostAPI("admin/addRestaurantDeliveryArea", {
      restaurantId: location?.state?.resId,
      coordinates: coords,
    });

    if (res?.data?.status === "1") {
      success_toaster(res?.data?.message);
      clearAll();
    } else {
      info_toaster(res?.data?.message);
    }
  };

  const stopDrawing = () => {
    if (drawingManagerRef.current) {
      drawingManagerRef.current.setDrawingMode(null); // stop active drawing
      drawingManagerRef.current.setMap(null); // remove tool from map
      drawingManagerRef.current = null; // clear ref
    }

    // Reset map cursor if needed
    if (mapRef.current) {
      mapRef.current.setOptions({ draggableCursor: "grab" });
    }
  };

  const startDrawing = () => {
    // Prevent multiple instances
    if (drawingManagerRef.current) return;

    const google = window.google;
    const map = mapRef.current;

    if (!google || !map) return;

    const manager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [google.maps.drawing.OverlayType.POLYGON], // ✅ Only polygon tool
      },
      polygonOptions: {
        fillColor: "#2196F3",
        fillOpacity: 0.5,
        strokeWeight: 2,
        clickable: true,
        editable: true,
        draggable: true,
        geodesic: true,
      },
    });

    drawingManagerRef.current = manager;
    manager.setMap(map);

    // Register one-time listener
    google.maps.event.addListenerOnce(manager, "polygoncomplete", (polygon) => {
      const path = polygon
        .getPath()
        .getArray()
        .map((latLng) => ({
          lat: latLng.lat(),
          lng: latLng.lng(),
        }));

      setCoordinates(path);
      drawnPolygonRef.current = polygon;

      polygon.setMap(null); // remove live polygon
    });
  };

  const formatCoordinates = (points) => {
    if (!Array.isArray(points) || points.length < 3) return [];

    const coordinates = points.map((point) => [point.lat, point.lng]);

    // Ensure polygon is closed
    const first = coordinates[0];
    const last = coordinates[coordinates.length - 1];
    if (first[0] !== last[0] || first[1] !== last[1]) {
      coordinates.push(first);
    }

    return coordinates;
  };

  return data?.length === 0 ? (
    <Loader />
  ) : (
    <Layout
      content={
        <div className="bg-themeGray p-5">
          <div className="bg-white rounded-lg p-5">
            <div className="flex gap-5 items-center">
              <button
                className="bg-themeGray p-2 rounded-full"
                onClick={() => window.history.back()}
              >
                <FaArrowLeft />
              </button>
              <h2 className="text-themeRed text-lg font-bold font-norms">
                {tab === "General" ? (
                  "General"
                ) : tab === "Meta Data" ? (
                  "Meta Data"
                ) : tab === "Payment Setting" ? (
                  "Payment Setting"
                ) : tab === "Charges Setting" ? (
                  "Charges Setting"
                ) : tab === "Menu Settings" ? (
                  "Menu Settings"
                ) : tab === "Delivery" ? (
                  "Delivery"
                ) : tab === "Bank Details" ? (
                  "Bank Details"
                ) : tab === "Store Timings" ? (
                  "Store Timings"
                ) : tab === "Configurations" ? (
                  "Configurations"
                ) : tab === "Overall Earnings" ? (
                  "Overall Earnings"
                ) : tab === "Owner Details" ? (
                  "Owner Details"
                ) : tab === "Inventory" ? (
                  "Inventory"
                ) : (
                  <></>
                )}
              </h2>
            </div>

            <div className="py-5 space-y-1.5">
              <ul className="flex flex-wrap items-center gap-8">
                <TabButton
                  title={t("General")}
                  tab={tab}
                  onClick={() => setTab("General")}
                />
                <TabButton
                  title={t("Meta Data")}
                  tab={tab}
                  onClick={() => setTab("Meta Data")}
                />
                <TabButton
                  title={t("Delivery")}
                  tab={tab}
                  onClick={() => setTab("Delivery")}
                />
                <TabButton
                  title={t("Charges Setting")}
                  tab={tab}
                  onClick={() => setTab("Charges Setting")}
                />
                <TabButton
                  title={t("Menu Settings")}
                  tab={tab}
                  onClick={() => setTab("Menu Settings")}
                />
                <TabButton
                  title={t("Bank Details")}
                  tab={tab}
                  onClick={() => setTab("Bank Details")}
                />
                <TabButton
                  title={t("Store Timings")}
                  tab={tab}
                  onClick={() => setTab("Store Timings")}
                />
                <TabButton
                  title={t("Configurations")}
                  tab={tab}
                  onClick={() => setTab("Configurations")}
                />
                <TabButton
                  title={t("Overall Earnings")}
                  tab={tab}
                  onClick={() => setTab("Overall Earnings")}
                />
                <TabButton
                  title={t("Owner Details")}
                  tab={tab}
                  onClick={() => setTab("Owner Details")}
                />
                <TabButton
                  title={t("Inventory")}
                  tab={tab}
                  onClick={() => setTab("Inventory")}
                />
              </ul>
              <div className={`w-full bg-[#00000033] h-[1px]`}></div>

              {tab === "General" ? (
                loader ? (
                  <MiniLoader />
                ) : (
                  <div className="space-y-3 pt-4">
                    <div className="grid grid-cols-2 gap-5">
                      <div className="flex flex-col gap-4 w-full mb-16 col-span-2 relative">
                        <div
                          className={`w-full h-[300px] bg-slate-100  rounded-sm`}
                        >
                          <label
                            className="w-full h-full flex flex-col justify-center items-center text-gray-600 cursor-pointer"
                            htmlFor="coverImage"
                          >
                            {data?.data?.general?.coverImage ? (
                              <img
                                className="w-full h-full object-cover rounded"
                                src={
                                  general?.coverImageShow
                                    ? general?.coverImageShow
                                    : `${BASE_URL}${general?.coverImage}`
                                }
                                alt="Cover Image"
                              />
                            ) : (
                              <BiImageAdd size={40} />
                            )}
                            {data?.data?.general?.coverImage ? (
                              ""
                            ) : (
                              <p>{t("Upload cover image")}</p>
                            )}
                          </label>
                          <input
                            className="bg-slate-100 outline-none py-4 px-3 w-full"
                            id="coverImage"
                            name="coverImage"
                            hidden
                            type="file"
                            onChange={(e) => {
                              handleImageChange(e, "Cover Image");
                            }}
                          />
                        </div>
                        <div className="w-32 h-32 rounded-md bg-slate-100 shadow-md border-gray-200 border-[1px] absolute bottom-[-70px] left-6">
                          <label
                            className="h-full flex flex-col font-semibold justify-center items-center text-gray-600 cursor-pointer"
                            htmlFor="logo"
                          >
                            {data?.data?.general?.logo ? (
                              <img
                                className="w-full h-full object-contain rounded"
                                src={
                                  general?.logoShow
                                    ? general?.logoShow
                                    : `${BASE_URL}${general?.logo}`
                                }
                                alt="Logo"
                              />
                            ) : (
                              <BiImageAdd size={40} />
                            )}
                            {data?.data?.general?.logo ? (
                              ""
                            ) : (
                              <p>{t("Upload logo")}</p>
                            )}
                          </label>
                          <input
                            className="bg-slate-100 outline-none py-4 px-3 w-full"
                            id="logo"
                            name="logo"
                            hidden
                            type="file"
                            onChange={(e) => {
                              handleImageChange(e, "Logo Image");
                            }}
                          />
                        </div>
                      </div>

                      {/* <div className="space-y-2">
                                   <div>
                                     <img
                                       src={
                                         general?.coverImageShow
                                           ? general?.coverImageShow
                                           : `${BASE_URL}${general?.coverImage}`
                                       }
                                       alt="Cover Image"
                                       className="w-24 h-24"
                                     />
                                   </div>
                                   <div className="space-y-1">
                                     <label
                                       htmlFor="coverImage"
                                       className="text-black font-switzer font-semibold"
                                     >
                                       {t("Cover Image")}
                                     </label>
           
                                     <input
                                       type="file"
                                       id="coverImage"
                                       name="coverImage"
                                       className="bg-themeInput w-full h-10 px-3 py-1 rounded-md outline-none"
                                       onChange={(e) => {
                                         handleImageChange(e, "Cover Image");
                                       }}
                                     />
                                   </div>
                                 </div> */}
                      {/* 
                                 <div className="space-y-2">
                                   <img
                                     src={
                                       general?.logoShow
                                         ? general?.logoShow
                                         : `${BASE_URL}${general?.logo}`
                                     }
                                     alt="Logo"
                                     className="w-24 h-24"
                                   />
           
                                   <div className="space-y-1">
                                     <label
                                       htmlFor="logo"
                                       className="text-black font-switzer font-semibold"
                                     >
                                       {t("Logo")}
                                     </label>
           
                                     <input
                                       type="file"
                                       id="logo"
                                       name="logo"
                                       className="bg-themeInput w-full h-10 px-3 py-1 rounded-md outline-none"
                                       onChange={(e) => {
                                         handleImageChange(e, "Logo Image");
                                       }}
                                     />
                                   </div>
                                 </div> */}

                      <div className="space-y-1">
                        <label
                          htmlFor="businessName"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Business Name")}
                        </label>
                        <input
                          value={general?.businessName}
                          type="text"
                          name="businessName"
                          id="businessName"
                          className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                          onChange={handleGeneralEventChange}
                        />
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor="businessEmail"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Business Email")}
                        </label>
                        <input
                          value={general?.businessEmail}
                          type="email"
                          name="businessEmail"
                          id="businessEmail"
                          className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                          onChange={handleGeneralEventChange}
                        />
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor="description"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Description")}
                        </label>
                        {/* <input
                                     value={general?.description}
                                     type="text"
                                     name="description"
                                     id="description"
                                     className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                                     onChange={handleGeneralEventChange}
                                   /> */}
                        <textarea
                          name="description"
                          id="description"
                          value={general?.description}
                          type="text"
                          className="bg-themeInput w-full px-3 rounded-md outline-none"
                          onChange={handleGeneralEventChange}
                        ></textarea>
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor="phone"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Phone No")}
                        </label>
                        <div className="grid grid-cols-5 gap-1">
                          <div className="col-span-1">
                            <PhoneInput
                              value={general?.countryCode}
                              enableSearch
                              inputStyle={{
                                width: "100%",
                                height: "40px",
                                borderRadius: "6px",
                                outline: "none",
                                border: "none",
                                background: "#F4F4F4",
                              }}
                              inputProps={{
                                id: "countryCode",
                                name: "countryCode",
                              }}
                              onChange={(code) =>
                                setGeneral({ ...general, countryCode: code })
                              }
                            />
                          </div>
                          <div className="col-span-4">
                            <input
                              value={general?.phoneNum}
                              onChange={handleGeneralEventChange}
                              type="number"
                              name="phoneNum"
                              className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor="openingTime "
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Opening Time")}
                        </label>
                        <input
                          value={dayjs(general?.openingTime).format(
                            "YYYY-MM-DDTHH:mm"
                          )}
                          type="datetime-local"
                          name="openingTime"
                          id="openingTime"
                          className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                          onChange={handleGeneralEventChange}
                        />
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor="closingTime "
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Closing Time")}
                        </label>
                        <input
                          value={dayjs(general?.closingTime).format(
                            "YYYY-MM-DDTHH:mm"
                          )}
                          type="datetime-local"
                          name="closingTime"
                          id="closingTime"
                          className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                          onChange={handleGeneralEventChange}
                        />
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor="certificateCode "
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Certificate Code")}
                        </label>
                        <input
                          value={general?.certificateCode}
                          type="number"
                          name="certificateCode"
                          id="certificateCode"
                          className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                          onChange={handleGeneralEventChange}
                        />
                      </div>

                      <div className="flex items-center gap-2 col-span-2 justify-end">
                        <BlackButton
                          text={t("Update")}
                          onClick={updateGeneralData}
                        />
                      </div>
                    </div>
                  </div>
                )
              ) : tab === "Meta Data" ? (
                loader ? (
                  <MiniLoader />
                ) : (
                  <div className="space-y-5 pt-4">
                    <div className="grid grid-cols-2 gap-10">
                      <div>
                        {isLoaded && ( 
                          <div className="relative space-y-1">
                            <label
                              htmlFor="name"
                              className="text-black font-switzer font-semibold"
                            >
                              {t("Address")}
                            </label>
                            <Autocomplete
                              onLoad={(autocompleteInstance) =>
                                setAutocomplete(autocompleteInstance)
                              }
                              onPlaceChanged={handlePlaceChanged}
                            >
                              <input
                                defaultValue={metaData?.address}
                                type="search"
                                placeholder="Search location"
                                className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                              />
                            </Autocomplete>
                            <GoogleMap
                              mapContainerStyle={containerStyle}
                              center={center}
                              zoom={15}
                              onLoad={onMapLoad}
                            >
                              {markerPosition && (
                                <MarkerF position={markerPosition} />
                              )}
                            </GoogleMap>
                          </div>
                        )}
                      </div>

                      <div className="space-y-5">
                        <div className="space-y-1">
                          <label
                            htmlFor="city"
                            className="text-black font-switzer font-semibold"
                          >
                            {t("City")}
                          </label>
                          <input
                            value={metaData?.city}
                            type="text"
                            name="city"
                            id="city"
                            className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                            onChange={handleMetaEventChange}
                          />
                        </div>

                        <div className="space-y-1">
                          <label
                            htmlFor="zipCode"
                            className="text-black font-switzer font-semibold"
                          >
                            {t("Zip")}
                          </label>
                          <input
                            value={metaData?.zipCode}
                            type="number"
                            name="zipCode"
                            id="zipCode"
                            className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                            onChange={handleMetaEventChange}
                          />
                        </div>

                        <div className="space-y-1 relative">
                          <label
                            htmlFor="deliveryRadius"
                            className="text-black font-switzer font-semibold"
                          >
                            {t("Delivery Radius")}
                          </label>
                          <input
                            value={metaData?.deliveryRadius}
                            type="number"
                            name="deliveryRadius"
                            id="deliveryRadius"
                            className="bg-themeInput w-full h-10 pl-24 rounded-md outline-none"
                            onChange={handleMetaEventChange}
                          />
                          <div className="bg-[#B9B7B7] h-10 px-3 w-20 flex justify-center items-center rounded-md absolute top-6 left-0">
                            {t("Miles")}
                          </div>
                        </div>

                        <div className="space-y-1 relative">
                          <label
                            htmlFor="approxDeliveryTime"
                            className="text-black font-switzer font-semibold"
                          >
                            {t("Delivery Time")}
                          </label>
                          <input
                            value={metaData?.approxDeliveryTime}
                            type="number"
                            name="approxDeliveryTime"
                            id="approxDeliveryTime"
                            className="bg-themeInput w-full h-10 pl-24 rounded-md outline-none"
                            onChange={handleMetaEventChange}
                          />
                          <div className="bg-[#B9B7B7] h-10 px-3 w-20 flex justify-center items-center rounded-md absolute top-6 left-0">
                            {t("Min")}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <label
                            htmlFor="pure"
                            className="text-black font-switzer font-semibold"
                          >
                            {t("Pure Vegetarian")}
                          </label>
                          <Switch
                            checked={metaData?.isPureVeg}
                            onChange={(checked) =>
                              handleSwitchChange(checked, "isPureVeg")
                            }
                            uncheckedIcon={false}
                            checkedIcon={false}
                            onColor="#4e73df"
                            onHandleColor="#fff"
                            className="react-switch"
                            boxShadow="none"
                            width={36}
                            height={20}
                          />
                        </div>

                        <div className="flex items-center gap-3">
                          <label
                            htmlFor="pure"
                            className="text-black font-switzer font-semibold"
                          >
                            {t("Featured")}
                          </label>
                          <Switch
                            checked={metaData?.isFeatured}
                            onChange={(checked) =>
                              handleSwitchChange(checked, "isFeatured")
                            }
                            uncheckedIcon={false}
                            checkedIcon={false}
                            onColor="#4e73df"
                            onHandleColor="#fff"
                            className="react-switch"
                            boxShadow="none"
                            width={36}
                            height={20}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 col-span-2 justify-end">
                      <BlackButton
                        text={t("Update")}
                        onClick={updateMetaData}
                      />
                    </div>
                  </div>
                )
              ) : tab === "Charges Setting" ? (
                loader ? (
                  <MiniLoader />
                ) : (
                  <div className="space-y-5 pt-4">
                    <div className="grid grid-cols-2 gap-5">
                      <div className="space-y-1 relative">
                        <label
                          htmlFor="minOrderAmount"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Minimum Order Amount")}
                        </label>
                        <input
                          value={chargesData?.minOrderAmount}
                          type="number"
                          name="minOrderAmount"
                          id="minOrderAmount"
                          className="bg-themeInput w-full h-10 pl-24 rounded-md outline-none"
                          onChange={handleChargeEventChange}
                        />
                        <div className="bg-[#B9B7B7] h-10 px-3 w-20 flex justify-center items-center rounded-md absolute top-6 left-0">
                          {t("Unit")}
                        </div>
                      </div>

                      <div className="space-y-1 relative">
                        <label
                          htmlFor="packingFee"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Packing Fee")}
                        </label>
                        <input
                          value={chargesData?.packingFee}
                          type="number"
                          name="packingFee"
                          id="packingFee"
                          className="bg-themeInput w-full h-10 pl-24 rounded-md outline-none"
                          onChange={handleChargeEventChange}
                        />
                        <div className="bg-[#B9B7B7] h-10 px-3 w-20 flex justify-center items-center rounded-md absolute top-6 left-0">
                          {t("Unit")}
                        </div>
                      </div>

                      <div className="space-y-1 relative">
                        <label
                          htmlFor="comission"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Commission")}
                        </label>
                        <input
                          value={chargesData?.comission}
                          type="number"
                          name="comission"
                          id="comission"
                          className="bg-themeInput w-full h-10 pl-24 rounded-md outline-none"
                          onChange={handleChargeEventChange}
                        />
                        <div className="bg-[#B9B7B7] h-10 px-3 w-20 flex justify-center items-center rounded-md absolute top-6 left-0">
                          %
                        </div>
                      </div>

                      <div className="space-y-1 relative">
                        <label
                          htmlFor="VATpercent"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("VAT Percent")}
                        </label>
                        <input
                          value={chargesData?.VATpercent}
                          type="number"
                          name="VATpercent"
                          id="VATpercent"
                          className="bg-themeInput w-full h-10 pl-24 rounded-md outline-none"
                          onChange={handleChargeEventChange}
                        />
                        <div className="bg-[#B9B7B7] h-10 px-3 w-20 flex justify-center items-center rounded-md absolute top-6 left-0">
                          %
                        </div>
                      </div>

                      <div className="space-y-1 relative">
                        <label
                          htmlFor="pricesIncludeVAT"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Price Included VAT")}
                        </label>
                        <Select
                          placeholder="Select"
                          defaultValue={{
                            value:
                              data?.data?.charges?.pricesIncludeVAT === true
                                ? 1
                                : 2,
                            label:
                              data?.data?.charges?.pricesIncludeVAT === true
                                ? "True"
                                : "False",
                          }}
                          name="pricesIncludeVAT"
                          options={priceOptions}
                          onChange={(e) =>
                            setChargesData({
                              ...chargesData,
                              pricesIncludeVAT:
                                e?.label === "True" ? true : false,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 col-span-2 justify-end">
                      <BlackButton text="Update" onClick={updateChargesData} />
                    </div>
                  </div>
                )
              ) : tab === "Menu Settings" ? (
                loader ? (
                  <MiniLoader />
                ) : (
                  <div className="pt-10">
                    <div className="mt-10">
                      {data?.data?.menuSetting?.rmc.length > 0 ? (
                        data?.data?.menuSetting?.rmc.map(
                          (category, categoryIndex) => (
                            <div key={categoryIndex} className="mb-8">
                              <h2 className="font-norms font-extrabold text-2xl sm:text-3xl text-gray-800 mb-6 uppercase">
                                {category?.menuCategory?.name}
                              </h2>
                              <div className="grid grid-cols-3 gap-4">
                                {category?.R_PLinks?.length > 0 ? (
                                  category.R_PLinks.map(
                                    (product, productIndex) => (
                                      <div
                                        key={productIndex}
                                        className="font-switzer relative flex items-center rounded-2xl md:px-4 md:py-2 px-3 py-4 shadow-cardShadow h-full w-full cursor-pointer space-x-3 transition-all duration-500 hover:scale-[1.03] hover:shadow-cardShadowHover"
                                      >
                                        <div className="sm:w-[128px] sm:h-[128px] h-[92px] flex justify-center items-center rounded-2xl border-transparent">
                                          <span className="md:w-[124px] md:h-[124px] w-[100px] h-[100px] rounded-2xl relative">
                                            <img
                                              src={`${BASE_URL}${product?.image}`}
                                              alt="cutlery"
                                              className="w-full h-full object-cover rounded-2xl"
                                            />
                                            {product?.isNew && (
                                              <img
                                                className="absolute top-[-12px] right-[-12px] w-12 h-12"
                                                src="/images/new.gif"
                                                alt=""
                                              />
                                            )}
                                          </span>
                                        </div>
                                        <div className="pl-2">
                                          <h3 className="font-norms font-semibold md:text-xl text-md text-start text-ellipsis line-clamp-1 uppercase">
                                            {product?.name}
                                          </h3>

                                          {product?.description && (
                                            <p className="capitalize h-[32px] max-h-[32px] font-normal text-xs text-gray-500 mt-1 w-4/5 text-start line-clamp-2">
                                              {product.description}
                                            </p>
                                          )}

                                          <div className="flex items-center justify-between mt-3 w-full">
                                            <div className="flex items-center gap-x-1">
                                              <span className="font-semibold md:text-base text-sm">
                                                {
                                                  data?.data?.menuSetting
                                                    ?.currencyUnit
                                                }
                                                {product.originalPrice
                                                  ? product?.originalPrice
                                                  : "0"}
                                              </span>
                                              {product?.isPopular && (
                                                <div className="bg-theme-red text-yellow-400 px-2 py-[3px] rounded-3xl flex md:hidden lg:flex items-center gap-x-1">
                                                  <FaStar size={12} />
                                                  <span className="uppercase font-semibold text-[10px]">
                                                    Popular
                                                  </span>
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  )
                                ) : (
                                  <p className="font-semibold text-sm text-gray-500">
                                    No products available
                                  </p>
                                )}
                              </div>
                            </div>
                          )
                        )
                      ) : (
                        <p className="font-semibold text-lg text-gray-500">
                          N/A
                        </p>
                      )}
                    </div>

                    {/* {datas?.map((categoryData, index) => (
                                    <>
                                      <div key={index} className="space-y-5 mt-5">
                                        <h2 className="text-2xl font-semibold">
                                          {categoryData.header}
                                        </h2>
                                        <Helment
                                          search={true}
                                          csvdata={datas}
                                          searchOnChange={(e) =>
                                            handleSearchChange(
                                              categoryData.header,
                                              e.target.value
                                            )
                                          }
                                          searchValue={search[categoryData.header] || ""}
                                        />
              
                                        <MyDataTable
                                          columns={columns}
                                          data={categoryData?.data}
                                        />
                                      </div>
                                    </>
                                  ))} */}
                  </div>
                )
              ) : tab === "Store Timings" ? (
                loader ? (
                  <MiniLoader />
                ) : (
                  <div className="">
                    <p className="text-black text-xl font-switzer font-semibold mt-10">
                      {t("Store Timings")}
                    </p>
                    <div className="w-1/3 text-black text-xl font-switzer font-semibold space-y-2 pt-10">
                      {data?.data?.timeData?.times.length === 0
                        ? "No Timings Available"
                        : data?.data?.timeData?.times.map((item) => (
                            <div className="flex justify-between">
                              <p className="capitalize">{item?.name}</p>{" "}
                              <p>{`${item.startAt} - ${item.endAt}`}</p>
                            </div>
                          ))}
                    </div>
                  </div>
                )
              ) : tab === "Bank Details" ? (
                loader ? (
                  <MiniLoader />
                ) : (
                  <div className="space-y-3 pt-4">
                    <div className="grid grid-cols-2 gap-5">
                      <div className="space-y-1">
                        <label
                          htmlFor="firstName"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("First Name")}
                        </label>
                        <input
                          value={bankData?.firstName}
                          type="text"
                          name="firstName"
                          id="firstName"
                          className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                          onChange={handleBankEventChange}
                        />
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor="lastName"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Last Name")}
                        </label>
                        <input
                          value={bankData?.lastName}
                          type="text"
                          name="lastName"
                          id="lastName"
                          className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                          onChange={handleBankEventChange}
                        />
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor="bankName"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Bank Name")}
                        </label>
                        <input
                          value={bankData?.bankName}
                          type="text"
                          name="bankName"
                          id="bankName"
                          className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                          onChange={handleBankEventChange}
                        />
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor="accountHolderName"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Account Holder Name")}
                        </label>
                        <input
                          value={bankData?.accountHolderName}
                          type="text"
                          name="accountHolderName"
                          id="accountHolderName"
                          className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                          onChange={handleBankEventChange}
                        />
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor="accountNo"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Account Number")}
                        </label>
                        <input
                          value={bankData?.accountNo}
                          type="text"
                          name="accountNo"
                          id="accountNo"
                          className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                          onChange={handleBankEventChange}
                        />
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor="IBAN"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("IBAN")}
                        </label>
                        <input
                          value={bankData?.IBAN}
                          type="text"
                          name="IBAN"
                          id="IBAN"
                          className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                          onChange={handleBankEventChange}
                        />
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor="swiftCode"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Swift Code")}
                        </label>
                        <input
                          value={bankData?.swiftCode}
                          type="text"
                          name="swiftCode"
                          id="swiftCode"
                          className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                          onChange={handleBankEventChange}
                        />
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor="bankAddress"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Bank Address")}
                        </label>
                        <input
                          value={bankData?.bankAddress}
                          type="text"
                          name="bankAddress"
                          id="bankAddress"
                          className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                          onChange={handleBankEventChange}
                        />
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor="streetAddress"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Street Address")}
                        </label>
                        <input
                          value={bankData?.streetAddress}
                          type="text"
                          name="streetAddress"
                          id="streetAddress"
                          className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                          onChange={handleBankEventChange}
                        />
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor="city"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("City")}
                        </label>
                        <input
                          value={bankData?.city}
                          type="text"
                          name="city"
                          id="city"
                          className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                          onChange={handleBankEventChange}
                        />
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor="zip"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Zip Code")}
                        </label>
                        <input
                          value={bankData?.zip}
                          type="number"
                          name="zip"
                          id="zip"
                          className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                          onChange={handleBankEventChange}
                        />
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor="bankCountry"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Bank Country")}
                        </label>
                        <input
                          value={bankData?.bankCountry}
                          type="text"
                          name="bankCountry"
                          id="bankCountry"
                          className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                          onChange={handleBankEventChange}
                        />
                      </div>

                      <div className="flex items-center gap-2 col-span-2 justify-end">
                        <BlackButton text="Update" onClick={updateBankData} />
                      </div>
                    </div>
                  </div>
                )
              ) : tab === "Delivery" ? (
                loader ? (
                  <MiniLoader />
                ) : (
                  <div className="space-y-3 pt-4">
                    <div className="grid grid-cols-2 gap-5">
                      <div className="space-y-1">
                        <label
                          htmlFor="deliveryTypeId"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Delivery Type Name")}
                        </label>
                        <Select
                          placeholder="Select"
                          defaultValue={{
                            value: data?.data?.deliveryData?.deliveryTypeId,
                            label: data?.data?.deliveryData?.deliveryTypeName,
                          }}
                          name="deliveryTypeId"
                          options={deliveryTypeOptions}
                          onChange={(e) =>
                            setDeliveryData({
                              ...deliveryData,
                              deliveryTypeId: e?.value,
                            })
                          }
                        />
                      </div>

                      {(deliveryData?.deliveryTypeId ||
                        data?.data?.deliveryTypeId) !== 2 && (
                        <>
                          <div className="space-y-1">
                            <label
                              htmlFor="deliveryFeeTypeId"
                              className="text-black font-switzer font-semibold"
                            >
                              {t("Delivery Fee Type Name")}
                            </label>
                            <Select
                              placeholder="Select"
                              defaultValue={{
                                value:
                                  data?.data?.deliveryData?.deliveryFeeTypeId,
                                label:
                                  data?.data?.deliveryData?.deliveryFeeTypeName,
                              }}
                              name="deliveryFeeTypeId"
                              options={deliveryFeeOptions}
                              onChange={(e) =>
                                setDeliveryData({
                                  ...deliveryData,
                                  deliveryFeeTypeId: e?.value,
                                })
                              }
                            />
                          </div>

                          {(deliveryData?.deliveryFeeTypeId ||
                            data?.data?.deliveryFeeTypeId) === 1 ? (
                            <div className="space-y-1">
                              <label
                                htmlFor="deliveryFeeFixed"
                                className="text-black font-switzer font-semibold"
                              >
                                {t("Delivery Fee")}
                              </label>
                              <input
                                value={deliveryData?.deliveryFeeFixed}
                                onChange={handleOnEventChange}
                                type="number"
                                name="deliveryFeeFixed"
                                id="deliveryFeeFixed"
                                className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                              />
                            </div>
                          ) : (
                            <>
                              <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-1">
                                  <label
                                    htmlFor="baseCharge"
                                    className="text-black font-switzer font-semibold"
                                  >
                                    {t("Base Charges")}
                                  </label>
                                  <input
                                    value={deliveryData?.baseCharge}
                                    onChange={handleOnEventChange}
                                    type="number"
                                    name="baseCharge"
                                    id="baseCharge"
                                    className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label
                                    htmlFor="baseDistance"
                                    className="text-black font-switzer font-semibold"
                                  >
                                    {t("Base Distance")}
                                  </label>
                                  <input
                                    value={deliveryData?.baseDistance}
                                    onChange={handleOnEventChange}
                                    type="number"
                                    name="baseDistance"
                                    id="baseDistance"
                                    className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-1">
                                  <label
                                    htmlFor="chargePerExtraUnit"
                                    className="text-black font-switzer font-semibold"
                                  >
                                    {t("Charges per Extra Unit")}
                                  </label>
                                  <input
                                    value={deliveryData?.chargePerExtraUnit}
                                    onChange={handleOnEventChange}
                                    type="number"
                                    name="chargePerExtraUnit"
                                    id="chargePerExtraUnit"
                                    className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label
                                    htmlFor="extraUnitDistance"
                                    className="text-black font-switzer font-semibold"
                                  >
                                    {t("Extar Unit Distance")}
                                  </label>
                                  <input
                                    value={deliveryData?.extraUnitDistance}
                                    onChange={handleOnEventChange}
                                    type="number"
                                    name="extraUnitDistance"
                                    id="extraUnitDistance"
                                    className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                                  />
                                </div>
                              </div>
                            </>
                          )}
                        </>
                      )}

                      <div className="flex items-center gap-2 col-span-2 justify-end">
                        <BlackButton
                          text={t("Update")}
                          onClick={updateDelivery}
                        />
                      </div>
                    </div>

                    <div className="mt-20 space-y-5">
                      <h4 className="text-black text-xl font-switzer font-semibold">
                        {t("Store Delivery Radius")}
                      </h4>

                      <div className="flex gap-2 mb-4">
                        <button
                          onClick={toggleDraw}
                          className="px-4 py-2 bg-green-200 text-green-700 font-semibold rounded-md"
                        >
                          {draw ? "Stop Drawing" : "Start Drawing"}
                        </button>
                        <button
                          onClick={undoLastPoint}
                          className="px-4 py-2 bg-yellow-500 text-white rounded-md"
                        >
                          Undo
                        </button>
                        <button
                          onClick={clearAll}
                          className="px-4 py-2 bg-red-500 text-white rounded-md"
                        >
                          Clear All
                        </button>
                      </div>

                      <div className="w-full">
                        <GoogleMap
                          mapContainerStyle={containerStyle}
                          center={center}
                          zoom={15}
                          onLoad={(map) => {
                            mapRef.current = map;
                            map.setOptions({
                              draggableCursor: draw ? "crosshair" : "grab",
                            });
                          }}
                        >
                          {markerPosition && (
                            <MarkerF position={markerPosition} />
                          )}

                          {coordinates?.length > 2 && (
                            <Polygon
                              path={coordinates}
                              options={{
                                fillColor: "#2196F3",
                                fillOpacity: 0.4,
                                strokeColor: "#0D47A1",
                                strokeWeight: 2,
                                clickable: true,
                                editable: true,
                                draggable: true,
                                geodesic: true,
                              }}
                            />
                          )}
                        </GoogleMap>
                      </div>

                      <div className="flex items-center gap-2 col-span-2 justify-end">
                        <BlackButton
                          text={t("Update")}
                          onClick={addRestDeliveryArea}
                        />
                      </div>
                    </div>
                  </div>
                )
              ) : tab === "Payment Setting" ? (
                loader ? (
                  <MiniLoader />
                ) : (
                  <div className="space-y-3 pt-4">
                    <div className="grid grid-cols-2 gap-5">
                      <div className="space-y-1">
                        <label
                          htmlFor="deliveryTypeId"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Payment Method Name")}
                        </label>
                        <Select
                          placeholder="Select"
                          defaultValue={{
                            value: data?.data?.deliveryData?.deliveryTypeId,
                            label: "Method",
                          }}
                          name="paymentOptions"
                          options={paymentOptions}
                          // onChange={(e) =>
                          //   setDeliveryData({
                          //     ...deliveryData,
                          //     deliveryTypeId: e?.value,
                          //   })
                          // }
                        />
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor="deliveryFeeTypeId"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Currency Unit")}
                        </label>
                        <Select
                          placeholder="Select"
                          defaultValue={{
                            value: data?.data?.deliveryData?.deliveryFeeTypeId,
                            label: "CHF",
                          }}
                          name="deliveryFeeTypeId"
                          options={deliveryFeeOptions}
                          // onChange={(e) =>
                          //   setDeliveryData({
                          //     ...deliveryData,
                          //     deliveryFeeTypeId: e?.value,
                          //   })
                          // }
                        />
                      </div>
                      <div className="flex items-center gap-2 col-span-2 justify-end">
                        <BlackButton
                          text={t("Update")}
                          onClick={updateDelivery}
                        />
                      </div>
                    </div>
                  </div>
                )
              ) : tab === "Configurations" ? (
                loader ? (
                  <MiniLoader />
                ) : (
                  <div className="pt-4">
                    <p className="text-black text-lg font-switzer font-semibold">
                      {t("Settings")}
                    </p>
                    <div className="w-1/2 text-white font-semibold text-lg">
                      <ul>
                        <li className="bg-themeRed py-2">
                          {" "}
                          <div className="flex justify-between cursor-pointer px-4 text-xl font-bold">
                            <p>{t("Restaurant Status Management")}</p>{" "}
                            <p>{t("Status")}</p>
                          </div>
                        </li>
                        <li className="bg-[#1e1b1b] py-2 cursor-pointer">
                          {" "}
                          <div
                            className="flex justify-between px-4"
                            onClick={() => {
                              handleButtonClick("Open");
                            }}
                          >
                            <p>{t("Open")}</p>{" "}
                            <MdOutlineKeyboardArrowDown
                              className={`duration-200 ${
                                array.includes("Open") ? "rotate-180" : ""
                              }`}
                              size={29}
                            />
                          </div>
                        </li>
                        <ul
                          className={`${
                            array.includes("Open") ? "block" : "hidden"
                          } text-sm text-gray-300`}
                        >
                          <li className="bg-[#1e1b1b] py-2 border-gray-500 border-t-[2px] cursor-pointer">
                            {" "}
                            <div className="flex justify-between px-4 items-center">
                              <p>
                                {t(
                                  "The restaurant is accepting standard pickup orders"
                                )}
                              </p>{" "}
                              <Switch
                                checked={
                                  data?.data?.configuration?.isOpen_pickupOrders
                                }
                                onChange={(checked) => {
                                  handleSwitchConfigChange(
                                    checked,
                                    "isOpen_pickupOrders"
                                  );
                                }}
                                uncheckedIcon={false}
                                checkedIcon={false}
                                onColor="#e13743"
                                onHandleColor="#fff"
                                className="react-switch"
                                boxShadow="none"
                                width={36}
                                height={20}
                              />
                            </div>
                          </li>
                          <li className="bg-[#1e1b1b] py-2 cursor-pointer">
                            {" "}
                            <div className="flex justify-between px-4  items-center">
                              <p>
                                {t(
                                  "The restaurant is accepting standard Delivery orders"
                                )}
                              </p>{" "}
                              <Switch
                                checked={
                                  data?.data?.configuration
                                    ?.isOpen_deliveryOrders
                                }
                                onChange={(checked) =>
                                  handleSwitchConfigChange(
                                    checked,
                                    "isOpen_deliveryOrders"
                                  )
                                }
                                uncheckedIcon={false}
                                checkedIcon={false}
                                onColor="#e13743"
                                onHandleColor="#fff"
                                className="react-switch"
                                boxShadow="none"
                                width={36}
                                height={20}
                              />
                            </div>
                          </li>
                          <li className="bg-[#1e1b1b] py-2 cursor-pointer">
                            {" "}
                            <div className="flex justify-between px-4  items-center">
                              <p>
                                {t(
                                  "The restaurant is accepting Schedule pickup orders"
                                )}
                              </p>{" "}
                              <Switch
                                checked={
                                  data?.data?.configuration
                                    ?.isOpen_schedule_pickupOrders
                                }
                                onChange={(checked) =>
                                  handleSwitchConfigChange(
                                    checked,
                                    "isOpen_schedule_pickupOrders"
                                  )
                                }
                                uncheckedIcon={false}
                                checkedIcon={false}
                                onColor="#e13743"
                                onHandleColor="#fff"
                                className="react-switch"
                                boxShadow="none"
                                width={36}
                                height={20}
                              />
                            </div>
                          </li>
                          <li className="bg-[#1e1b1b] py-2 cursor-pointer">
                            {" "}
                            <div className="flex justify-between px-4  items-center">
                              <p>
                                {t(
                                  "The restaurant is accepting Schedule Delivery orders"
                                )}
                              </p>{" "}
                              <Switch
                                checked={
                                  data?.data?.configuration
                                    ?.isOpen_schedule_deliveryOrders
                                }
                                onChange={(checked) =>
                                  handleSwitchConfigChange(
                                    checked,
                                    "isOpen_schedule_deliveryOrders"
                                  )
                                }
                                uncheckedIcon={false}
                                checkedIcon={false}
                                onColor="#e13743"
                                onHandleColor="#fff"
                                className="react-switch"
                                boxShadow="none"
                                width={36}
                                height={20}
                              />
                            </div>
                          </li>
                        </ul>
                        <li
                          className="bg-[#1e1b1b] py-2 border-gray-500 border-t-[2px] cursor-pointer"
                          onClick={() => {
                            handleButtonClick("Close");
                          }}
                        >
                          {" "}
                          <div className="flex justify-between px-4">
                            <p>{t("Close")}</p>{" "}
                            <MdOutlineKeyboardArrowDown
                              className={`duration-200 ${
                                array.includes("Close") ? "rotate-180" : ""
                              }`}
                              size={29}
                            />
                          </div>
                        </li>
                        <ul
                          className={`${
                            array.includes("Close") ? "block" : "hidden"
                          } text-sm text-gray-300`}
                        >
                          <li className="bg-[#1e1b1b] py-2 border-gray-500 border-t-[2px] cursor-pointer">
                            {" "}
                            <div className="flex justify-between px-4 items-center">
                              <p>
                                {t(
                                  "The restaurant is accepting schedule pickup orders"
                                )}
                              </p>{" "}
                              <Switch
                                checked={
                                  data?.data?.configuration
                                    ?.isClose_schedule_pickupOrders
                                }
                                onChange={(checked) =>
                                  handleSwitchConfigChange(
                                    checked,
                                    "isClose_schedule_pickupOrders"
                                  )
                                }
                                uncheckedIcon={false}
                                checkedIcon={false}
                                onColor="#e13743"
                                onHandleColor="#fff"
                                className="react-switch"
                                boxShadow="none"
                                width={36}
                                height={20}
                              />
                            </div>
                          </li>
                          <li className="bg-[#1e1b1b] py-2 cursor-pointer">
                            {" "}
                            <div className="flex justify-between px-4  items-center">
                              <p>
                                {t(
                                  "The restaurant is accepting schedule Delivery orders"
                                )}
                              </p>{" "}
                              <Switch
                                checked={
                                  data?.data?.configuration
                                    ?.isClose_schedule_deliveryOrders
                                }
                                onChange={(checked) =>
                                  handleSwitchConfigChange(
                                    checked,
                                    "isClose_schedule_deliveryOrders"
                                  )
                                }
                                uncheckedIcon={false}
                                checkedIcon={false}
                                onColor="#e13743"
                                onHandleColor="#fff"
                                className="react-switch"
                                boxShadow="none"
                                width={36}
                                height={20}
                              />
                            </div>
                          </li>
                        </ul>
                        <li
                          className="bg-[#1e1b1b] py-2 border-gray-500 border-t-[2px] cursor-pointer"
                          onClick={() => {
                            handleButtonClick("Temporary Closed");
                          }}
                        >
                          {" "}
                          <div className="flex justify-between px-4">
                            <p>{t("Temporary Closed")}</p>{" "}
                            <MdOutlineKeyboardArrowDown
                              className={`duration-200 ${
                                array.includes("Temporary Closed")
                                  ? "rotate-180"
                                  : ""
                              }`}
                              size={29}
                            />
                          </div>
                        </li>
                        <ul
                          className={`${
                            array.includes("Temporary Closed")
                              ? "block"
                              : "hidden"
                          } text-sm text-gray-300`}
                        >
                          <li className="bg-[#1e1b1b] py-2 border-gray-500 border-t-[2px] cursor-pointer">
                            {" "}
                            <div className="flex justify-between px-4  items-center">
                              <p>
                                {t("The restaurant is accepting pickup orders")}
                              </p>{" "}
                              <Switch
                                checked={
                                  data?.data?.configuration
                                    ?.temporaryClose_pickupOrders
                                }
                                onChange={(checked) =>
                                  handleSwitchConfigChange(
                                    checked,
                                    "temporaryClose_pickupOrders"
                                  )
                                }
                                uncheckedIcon={false}
                                checkedIcon={false}
                                onColor="#e13743"
                                onHandleColor="#fff"
                                className="react-switch"
                                boxShadow="none"
                                width={36}
                                height={20}
                              />
                            </div>
                          </li>
                          <li className="bg-[#1e1b1b] py-2 cursor-pointer">
                            {" "}
                            <div className="flex justify-between px-4  items-center">
                              <p>
                                {t(
                                  "The restaurant is accepting schedule pickup orders"
                                )}
                              </p>{" "}
                              <Switch
                                checked={
                                  data?.data?.configuration
                                    ?.temporaryClose_schedule_pickupOrders
                                }
                                onChange={(checked) =>
                                  handleSwitchConfigChange(
                                    checked,
                                    "temporaryClose_schedule_pickupOrders"
                                  )
                                }
                                uncheckedIcon={false}
                                checkedIcon={false}
                                onColor="#e13743"
                                onHandleColor="#fff"
                                className="react-switch"
                                boxShadow="none"
                                width={36}
                                height={20}
                              />
                            </div>
                          </li>
                          <li className="bg-[#1e1b1b] py-2 cursor-pointer">
                            {" "}
                            <div className="flex justify-between px-4  items-center">
                              <p>
                                {t(
                                  "The restaurant is accepting schedule delivery orders"
                                )}
                              </p>{" "}
                              <Switch
                                checked={
                                  data?.data?.configuration
                                    ?.temporaryClose_schedule_deliveryOrders
                                }
                                onChange={(checked) =>
                                  handleSwitchConfigChange(
                                    checked,
                                    "temporaryClose_schedule_deliveryOrders"
                                  )
                                }
                                uncheckedIcon={false}
                                checkedIcon={false}
                                onColor="#e13743"
                                onHandleColor="#fff"
                                className="react-switch"
                                boxShadow="none"
                                width={36}
                                height={20}
                              />
                            </div>
                          </li>
                        </ul>
                        <li
                          className="bg-[#1e1b1b] py-2 border-gray-500 border-t-[2px] cursor-pointer"
                          onClick={() => {
                            handleButtonClick("Rush Mode");
                          }}
                        >
                          {" "}
                          <div className="flex justify-between px-4">
                            <p>{t("Rush Mode")}</p>{" "}
                            <MdOutlineKeyboardArrowDown
                              className={`duration-200 ${
                                array.includes("Rush Mode") ? "rotate-180" : ""
                              }`}
                              size={29}
                            />
                          </div>
                        </li>
                        <ul
                          className={`${
                            array.includes("Rush Mode") ? "block" : "hidden"
                          } text-sm text-gray-300`}
                        >
                          <li className="bg-[#1e1b1b] py-2 border-gray-500 border-t-[2px] cursor-pointer">
                            {" "}
                            <div className="flex justify-between px-4  items-center">
                              <p>
                                {t(
                                  "The restaurant is accepting standard pickup orders"
                                )}
                              </p>{" "}
                              <Switch
                                checked={
                                  data?.data?.configuration
                                    ?.isRushMode_pickupOrders
                                }
                                onChange={(checked) =>
                                  handleSwitchConfigChange(
                                    checked,
                                    "isRushMode_pickupOrders"
                                  )
                                }
                                uncheckedIcon={false}
                                checkedIcon={false}
                                onColor="#e13743"
                                onHandleColor="#fff"
                                className="react-switch"
                                boxShadow="none"
                                width={36}
                                height={20}
                              />
                            </div>
                          </li>
                          <li className="bg-[#1e1b1b] py-2 cursor-pointer">
                            {" "}
                            <div className="flex justify-between px-4  items-center">
                              <p>
                                {t(
                                  "The restaurant is accepting standard delivery orders"
                                )}
                              </p>{" "}
                              <Switch
                                checked={
                                  data?.data?.configuration
                                    ?.isRushMode_deliveryOrders
                                }
                                onChange={(checked) =>
                                  handleSwitchConfigChange(
                                    checked,
                                    "isRushMode_deliveryOrders"
                                  )
                                }
                                uncheckedIcon={false}
                                checkedIcon={false}
                                onColor="#e13743"
                                onHandleColor="#fff"
                                className="react-switch"
                                boxShadow="none"
                                width={36}
                                height={20}
                              />
                            </div>
                          </li>
                          <li className="bg-[#1e1b1b] py-2  cursor-pointer">
                            {" "}
                            <div className="flex justify-between px-4  items-center">
                              <p>
                                {t(
                                  "The restaurant is accepting schedule pickup orders"
                                )}
                              </p>{" "}
                              <Switch
                                checked={
                                  data?.data?.configuration
                                    ?.isRushMode_schedule_pickupOrders
                                }
                                onChange={(checked) =>
                                  handleSwitchConfigChange(
                                    checked,
                                    "isRushMode_schedule_pickupOrders"
                                  )
                                }
                                uncheckedIcon={false}
                                checkedIcon={false}
                                onColor="#e13743"
                                onHandleColor="#fff"
                                className="react-switch"
                                boxShadow="none"
                                width={36}
                                height={20}
                              />
                            </div>
                          </li>
                          <li className="bg-[#1e1b1b] py-2 cursor-pointer">
                            {" "}
                            <div className="flex justify-between px-4  items-center">
                              <p>
                                {t(
                                  "The restaurant is accepting schedule delivery orders"
                                )}
                              </p>{" "}
                              <Switch
                                checked={
                                  data?.data?.configuration
                                    ?.isRushMode_schedule_deliveryOrders
                                }
                                onChange={(checked) =>
                                  handleSwitchConfigChange(
                                    checked,
                                    "isRushMode_schedule_deliveryOrders"
                                  )
                                }
                                uncheckedIcon={false}
                                checkedIcon={false}
                                onColor="#e13743"
                                onHandleColor="#fff"
                                className="react-switch"
                                boxShadow="none"
                                width={36}
                                height={20}
                              />
                            </div>
                          </li>
                        </ul>
                      </ul>
                      <ul>
                        <li className="bg-themeRed py-2">
                          {" "}
                          <div className="flex justify-between px-4 cursor-pointer text-xl font-bold">
                            <p>{t("Additional Functions")}</p>{" "}
                            <p>{t("Status")}</p>
                          </div>
                        </li>
                        <li className="bg-[#1e1b1b] py-2">
                          {" "}
                          <div className="flex justify-between px-4 cursor-pointer items-center">
                            {" "}
                            <div>
                              <p>
                                {" "}
                                {t("Delivery")} &#40;{t("Delivery by Fomino")}
                                &#41;
                              </p>
                              <p className="text-sm text-gray-300">
                                {t(
                                  "Activate this option to allow delivery by other users"
                                )}
                              </p>{" "}
                            </div>{" "}
                            <Switch
                              checked={data?.data?.configuration?.delivery}
                              onChange={(checked) =>
                                handleSwitchConfigChange(checked, "delivery")
                              }
                              uncheckedIcon={false}
                              checkedIcon={false}
                              onColor="#e13743"
                              onHandleColor="#fff"
                              className="react-switch"
                              boxShadow="none"
                              width={36}
                              height={20}
                            />
                          </div>
                        </li>
                        <li className="bg-[#1e1b1b] py-2 border-gray-500 border-t-[2px] cursor-pointer ">
                          {" "}
                          <div className="flex justify-between px-4 items-center">
                            <div>
                              {" "}
                              <p>{t("Take Away")}</p>
                              <p className="text-sm text-gray-300">
                                {t("Enable or disable take away services")}
                              </p>
                            </div>{" "}
                            <Switch
                              checked={data?.data?.configuration?.takeAway}
                              onChange={(checked) =>
                                handleSwitchConfigChange(checked, "takeAway")
                              }
                              uncheckedIcon={false}
                              checkedIcon={false}
                              onColor="#e13743"
                              onHandleColor="#fff"
                              className="react-switch"
                              boxShadow="none"
                              width={36}
                              height={20}
                            />
                          </div>
                        </li>
                        <li className="bg-[#1e1b1b] py-2 border-gray-500 border-t-[2px] cursor-pointer">
                          {" "}
                          <div className="flex justify-between px-4 items-center">
                            <div>
                              <p>{t("Table Bookings")}</p>
                              <p className="text-sm text-gray-300">
                                {t("Enable or disable table booking services")}
                              </p>
                            </div>{" "}
                            <Switch
                              checked={data?.data?.configuration?.tableBooking}
                              onChange={(checked) =>
                                handleSwitchConfigChange(
                                  checked,
                                  "tableBooking"
                                )
                              }
                              uncheckedIcon={false}
                              checkedIcon={false}
                              onColor="#e13743"
                              onHandleColor="#fff"
                              className="react-switch"
                              boxShadow="none"
                              width={36}
                              height={20}
                            />
                          </div>
                        </li>
                        <li className="bg-[#1e1b1b] py-2 border-gray-500 border-t-[2px] cursor-pointer">
                          {" "}
                          <div className="flex justify-between px-4 items-center">
                            <div>
                              <p>{t("Stamp Cards")}</p>
                              <p className="text-sm text-gray-300">
                                {t("Enable or disable Stamp Card services")}
                              </p>{" "}
                            </div>{" "}
                            <Switch
                              checked={data?.data?.configuration?.stampCard}
                              onChange={(checked) =>
                                handleSwitchConfigChange(checked, "stampCard")
                              }
                              uncheckedIcon={false}
                              checkedIcon={false}
                              onColor="#e13743"
                              onHandleColor="#fff"
                              className="react-switch"
                              boxShadow="none"
                              width={36}
                              height={20}
                            />
                          </div>
                        </li>
                        <li className="bg-[#1e1b1b] py-2 border-gray-500 border-t-[2px] cursor-pointer">
                          {" "}
                          <div className="flex justify-between px-4 items-center">
                            <div>
                              <p>
                                {t("Payment")} &#40;{t("Cash")}&#41;
                              </p>
                              <p className="text-sm text-gray-300">
                                {t("Enable or disable cash payment services")}
                              </p>{" "}
                            </div>{" "}
                            <Switch
                              checked={data?.data?.configuration?.cod}
                              onChange={(checked) =>
                                handleSwitchConfigChange(checked, "cod")
                              }
                              uncheckedIcon={false}
                              checkedIcon={false}
                              onColor="#e13743"
                              onHandleColor="#fff"
                              className="react-switch"
                              boxShadow="none"
                              width={36}
                              height={20}
                            />
                          </div>
                        </li>
                        <li className="bg-[#1e1b1b] py-2 border-gray-500 border-t-[2px] cursor-pointer">
                          {" "}
                          <div className="flex justify-between px-4 items-center">
                            <div>
                              {" "}
                              <p>
                                {t("Currency")} &#40;{t("Euro")}&#41;{" "}
                              </p>
                              <p className="text-sm text-gray-300">
                                {t("Accept or decline cash Euro currency")}
                              </p>{" "}
                            </div>{" "}
                            <Switch
                              checked={data?.data?.configuration?.euro}
                              onChange={(checked) =>
                                handleSwitchConfigChange(checked, "euro")
                              }
                              uncheckedIcon={false}
                              checkedIcon={false}
                              onColor="#e13743"
                              onHandleColor="#fff"
                              className="react-switch"
                              boxShadow="none"
                              width={36}
                              height={20}
                            />
                          </div>
                        </li>
                        <li className="bg-[#1e1b1b] py-2 border-gray-500 border-t-[2px] cursor-pointer">
                          {" "}
                          <div className="flex justify-between px-4 items-center">
                            <div>
                              <p>{t("Print")}</p>{" "}
                              <p className="text-sm text-gray-300">
                                {t("Automatically prints receipts upon order")}
                              </p>{" "}
                            </div>{" "}
                            <Switch
                              checked={data?.data?.configuration?.print}
                              onChange={(checked) =>
                                handleSwitchConfigChange(checked, "print")
                              }
                              uncheckedIcon={false}
                              checkedIcon={false}
                              onColor="#e13743"
                              onHandleColor="#fff"
                              className="react-switch"
                              boxShadow="none"
                              width={36}
                              height={20}
                            />
                          </div>
                        </li>
                      </ul>
                      <ul>
                        <li className="bg-themeRed py-2">
                          {" "}
                          <div className="flex justify-between px-4 cursor-pointer text-xl font-bold">
                            <p>{t("Sound Settings")}</p> <p>{t("Status")}</p>
                          </div>
                        </li>
                        <li className="bg-[#1e1b1b] py-2">
                          {" "}
                          <div className="flex justify-between px-4 cursor-pointer items-center">
                            <div>
                              <p>{t("Incomming Order")}</p>
                              <p className="text-sm text-gray-300">
                                {t("Pikachu")}
                              </p>
                            </div>{" "}
                            <Switch
                              checked={true}
                              // onChange={(checked) =>
                              //   handleSwitchChange(checked, "isFeatured")
                              // }
                              uncheckedIcon={false}
                              checkedIcon={false}
                              onColor="#e13743"
                              onHandleColor="#fff"
                              className="react-switch"
                              boxShadow="none"
                              width={36}
                              height={20}
                            />
                          </div>
                        </li>
                        <li className="bg-[#1e1b1b] py-2 border-gray-500 border-t-[2px] cursor-pointer">
                          {" "}
                          <div className="flex justify-between px-4 items-center">
                            <div>
                              <p>{t("Ready Order")}</p>
                              <p className="text-sm text-gray-300">
                                {t("Pikachu")}
                              </p>
                            </div>{" "}
                            <Switch
                              checked={true}
                              // onChange={(checked) =>
                              //   handleSwitchChange(checked, "isFeatured")
                              // }
                              uncheckedIcon={false}
                              checkedIcon={false}
                              onColor="#e13743"
                              onHandleColor="#fff"
                              className="react-switch"
                              boxShadow="none"
                              width={36}
                              height={20}
                            />
                          </div>
                        </li>
                        <li className="bg-[#1e1b1b] py-2 border-gray-500 border-t-[2px] cursor-pointer">
                          {" "}
                          <div className="flex justify-between px-4 items-center">
                            <div>
                              <p>{t("Table Booking Order")}</p>
                              <p className="text-sm text-gray-300">
                                {t("Pikachu")}
                              </p>
                            </div>{" "}
                            <Switch
                              checked={true}
                              // onChange={(checked) =>
                              //   handleSwitchChange(checked, "isFeatured")
                              // }
                              uncheckedIcon={false}
                              checkedIcon={false}
                              onColor="#e13743"
                              onHandleColor="#fff"
                              className="react-switch"
                              boxShadow="none"
                              width={36}
                              height={20}
                            />
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                )
              ) : tab === "Overall Earnings" ? (
                loader ? (
                  <MiniLoader />
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 [&>div]:bg-gray-100 [&>div]:rounded-md [&>div]:p-4 [&>div]:cursor-pointer font-norms gap-5 mt-10">
                      <div className="">
                        <p className="text-gray-600 text-lg">Total Earnings</p>
                        <h4 className="text-4xl font-medium my-8">
                          {restEarnings?.data?.restEarnings?.totalEarning}
                        </h4>
                      </div>
                      <div className="">
                        <p className="text-gray-600 text-lg">
                          Available Balance
                        </p>
                        <h4 className="text-4xl font-medium my-8">
                          {restEarnings?.data?.restEarnings?.availableBalance}
                        </h4>
                      </div>
                    </div>
                    <div className="w-full pt-4">
                      <p className="text-black text-lg font-switzer font-semibold">
                        {t("Due Payments to Drivers")}
                      </p>
                      <MyDataTable columns={columnsDriver} data={dataDriver} />
                    </div>
                  </div>
                )
              ) : tab === "Owner Details" ? (
                <div className="space-y-4">
                  <p className="text-black text-lg font-switzer font-semibold mt-5">
                    {t("Owner Details")}
                  </p>
                  <div className="space-y-3">
                    <div>
                      <img
                        src={
                          BASE_URL + data?.data?.general?.owner?.image ||
                          "/images/profile.webp"
                        }
                        alt="profile"
                        className="w-32 h-32 object-cover rounded-full"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <div className="space-y-1">
                        <label
                          htmlFor="firstName"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("First Name")}
                        </label>
                        <input
                          value={data?.data?.general?.owner?.firstName}
                          // onChange={handleOnEventChange}
                          type="text"
                          name="firstName"
                          id="firstName"
                          className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label
                          htmlFor="lastName"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Last Name")}
                        </label>
                        <input
                          value={data?.data?.general?.owner?.lastName}
                          // onChange={handleOnEventChange}
                          type="text"
                          name="lastName"
                          id="lastName"
                          className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label
                          htmlFor="email"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Email")}
                        </label>
                        <input
                          value={data?.data?.general?.owner?.email}
                          // onChange={handleOnEventChange}
                          type="email"
                          name="email"
                          id="email"
                          className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor="phone"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Phone No")}
                        </label>
                        <div className="grid grid-cols-5 gap-1">
                          <div className="col-span-1">
                            <PhoneInput
                              value={data?.data?.general?.owner?.countryCode}
                              enableSearch
                              inputStyle={{
                                width: "100%",
                                height: "40px",
                                borderRadius: "6px",
                                outline: "none",
                                border: "none",
                                background: "#F4F4F4",
                              }}
                              inputProps={{
                                id: "countryCode",
                                name: "countryCode",
                              }}
                              // onChange={(code) =>
                              //   setDetails({ ...details, countryCode: code })
                              // }
                            />
                          </div>
                          <div className="col-span-4">
                            <input
                              value={data?.data?.general?.owner?.phoneNum}
                              // onChange={handleOnEventChange}
                              type="number"
                              name="phoneNum"
                              className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* <div className="space-y-1 col-span-2">
                                    <label
                                      htmlFor="password"
                                      className="text-black font-switzer font-semibold"
                                    >
                                      {t("Password")}
                                    </label>
                                    <input
                                      // onChange={handleOnEventChange}
                                      type="password"
                                      name="password"
                                      id="password"
                                      className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                                    />
                                  </div> */}
                      {/* <div className="flex items-center gap-2 col-span-2 justify-end">
                                    <BlackButton
                                      text={t("Update User")}
                                      // onClick={updateUserDetails}
                                    />
                                  </div> */}
                    </div>
                  </div>
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      }
    />
  );
}
