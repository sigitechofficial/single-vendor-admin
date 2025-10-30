import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Helment from "../../components/Helment";
import MyDataTable from "../../components/MyDataTable";
import { HiOutlineDotsVertical } from "react-icons/hi";
import Loader, { MiniLoader } from "../../components/Loader";
import GetAPI from "../../utilities/GetAPI";
import RedButton, {
  BlackButton,
  EditButton,
  GreenButton,
  HelmetBtn,
} from "../../utilities/Buttons";
import { useNavigate } from "react-router-dom";
import Switch from "react-switch";
import { useTranslation } from "react-i18next";
import { BASE_URL } from "../../utilities/URL";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import localizedFormat from "dayjs/plugin/localizedFormat";
import utc from "dayjs/plugin/utc";
dayjs.extend(localizedFormat);
dayjs.extend(timezone);
dayjs.extend(utc);
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { FaUserAlt } from "react-icons/fa";
import PhoneInput from "react-phone-input-2";
import Select from "react-select";
import { MdAddPhotoAlternate } from "react-icons/md";
import { PostAPI } from "../../utilities/PostAPI";
import { info_toaster, success_toaster } from "../../utilities/Toaster";

export default function AddStampCard() {
  const { t } = useTranslation();
  const { data, reFetch } = GetAPI("admin/getStampCards");
  const [search, setSearch] = useState("");
  const [loader, setLoader] = useState(false);
  const [rstatus, setRstatus] = useState("");
  const [scrollValue, setScrollValue] = useState(0);
  const [modal, setModal] = useState(false);
  const [modType, setModType] = useState("add");
  const [stamp, setStamp] = useState({
    id: "",
    image: null,
    title: "",
    value: "10",
    cityId: "",
    description: "",
  });
console.log(stamp,"stampstampstamp")
  const [stampCardRest, setStampCardRest] = useState("");

  const filterOptions = GetAPI("admin/filterOptions");
  const cityOptions = [];
  if (filterOptions) {
    filterOptions?.data?.data?.city?.map((el) => {
      cityOptions.push({
        value: el?.id,
        label: el?.name,
      });
    });
  }

  const handleScroll = (event) => {
    const scrollTop = event.target.scrollTop; // Get scroll position
    setScrollValue(scrollTop);
  };

  const updateStatus = async (id, status, type) => {
    if (type === "rest") {
      let res = await PostAPI("admin/stampCardRestaurantStatus", {
        id,
        status: status ? false : true,
      });
      if (res?.data?.status === "1") {
        info_toaster(res?.data?.message);
        stampCardDetails(rstatus);
      } else {
        error_toaster(res?.data?.message);
      }
    } else {
      let res = await PostAPI("admin/stampCardStatus", {
        id,
        status: status ? false : true,
      });
      if (res?.data?.status === "1") {
        info_toaster(res?.data?.message);
        reFetch();
      } else {
        error_toaster(res?.data?.message);
      }
    }
  };

  const stampCardDetails = async (id) => {
    setLoader(true);
    let res = await PostAPI("admin/stampCardDetails", {
      id,
    });
    if (res?.data?.status === "1") {
      setLoader(false);
      setStampCardRest(res?.data?.data);
    } else {
      info_toaster(res?.data?.message);
      setLoader(false);
    }
  };

  const updateStampCard = async () => {
    setLoader(true);
    const formData = new FormData();
    formData.append("title", stamp?.title);
    formData.append("id", stamp?.id);
    formData.append("value", stamp?.value);
    formData.append("cityId", stamp?.cityId);
    formData.append("description", stamp?.description);
    formData.append("image", stamp?.image);
    let res = await PostAPI("admin/updateStampCard", formData);
    if (res?.data?.status === "1") {
      setLoader(false);
      setModal(false);
      success_toaster(res?.data?.message);
      reFetch();
    } else {
      info_toaster(res?.data?.message);
      setLoader(false);
    }
  };

  const cardData = () => {
    return stampCardRest?.data?.filter((dat) => {
      return (
        search === "" ||
        (dat?.id && dat?.id.toString().includes(search.toLowerCase())) ||
        (dat?.orderNum &&
          dat?.orderNum.toString().includes(search.toLowerCase())) ||
        (dat?.restaurant?.businessName &&
          dat?.restaurant?.businessName
            .toLowerCase()
            .includes(search.toLowerCase())) ||
        (dat?.user?.userName &&
          dat?.user?.userName.toLowerCase().includes(search.toLowerCase()))
      );
    });
  };

  const columns = [
    { field: "email", header: t("Email") },
    { field: "expiredDate", header: t("Expiry Date") },
    { field: "location", header: t("Location") },
    { field: "phone", header: t("Phone") },
    { field: "restaurantName", header: t("Restaurant Name") },
    { field: "totalSalesByStampCard", header: t("Total Sale") },
    { field: "totalStampCardIssues", header: t("Total Issue") },
    { field: "action", header: t("Action") },
  ];

  const getCityName = (cityId) => {
    const city = cityOptions.find((city) => city.value === cityId);
    return city?.label;
  };

  const datas = [];
  const csv = [];

  cardData()?.forEach((values, index) => {
    csv.push({
      sn: index + 1,
      id: values?.id,
      orderNum: values?.orderNum,
      restaurantName: values?.restaurant?.name,
      customerInfo: values?.user?.userName,
      driverEarnings: values?.orderCharge?.driverEarnings,
      restaurantEarnings: values?.orderCharge?.restaurantEarnings,
      discount: values?.orderCharge?.discount,
      deliveryFees: values?.orderCharge?.deliveryFees,
      serviceFees: values?.orderCharge?.serviceCharges,
      packingFees: values?.restaurant?.packingFee,
      commission: values?.orderCharge?.adminDeliveryCharges,
      orderMode: values?.orderMode?.name,
      status: values?.orderStatus?.name,
    });

    datas.push({
      email: values?.email,
      expiredDate: dayjs(values?.expiredDate)?.local().format("DD/MM/YYYY"),
      location: values?.location,
      phone: values?.phone,
      restaurantName: values?.restaurantName,
      totalSalesByStampCard:
        values?.units?.currencyUnit?.symbol +
        " " +
        values?.totalSalesByStampCard,
      totalStampCardIssues: values?.totalStampCardIssues,
      action: (
        <GreenButton
          text={values?.status ? "active" : "Inactive"}
          bg={values?.status ? "green-500" : "red-500"}
          onClick={() => {
            updateStatus(values?.id, values?.status, "rest");
          }}
        />
      ),
    });
  });

  const handleImageChange = (e, type) => {
    const file = e.target.files?.[0];

        const validImageTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/jpg",
    ];

    if (!validImageTypes.includes(file.type)) {
      info_toaster("Only images are allowed.");
      return;
    }


    if (file && type === "image") {
      const imageUrl = URL.createObjectURL(file);
      setStamp(() => ({
        ...stamp,
        image: file,
        imageShow: imageUrl,
      }));
    }
  };

  const handleChange = (e, type) => {
    setStamp(() => ({
      ...stamp,
      [type]: e,
    }));
  };

  const handleAddStampCard = async () => {
    if (stamp?.image === null || stamp.image === "") {
      info_toaster("please add image");
    } else if (stamp?.title === "") {
      info_toaster("please add title");
    } else if (stamp?.cityId === "") {
      info_toaster("please add city");
    } else if (stamp?.description === "") {
      info_toaster("please add description");
    } else {
      setLoader(true);
      const formData = new FormData();
      formData.append("title", stamp?.title);
      formData.append("value", stamp?.value);
      formData.append("cityId", stamp?.cityId?.value);
      formData.append("description", stamp?.description);
      formData.append("image", stamp?.image);

      let res = await PostAPI("admin/addStampCard", formData);
      if (res?.data?.status === "1") {
        setLoader(false);
        setModal(false);
        success_toaster(res?.data?.message);
        reFetch();
        setStamp({
          image: null,
          title: "",
          value: "10",
          cityId: "",
          description: "",
        });
      } else {
        info_toaster(res?.data?.message);
      }
    }
  };

  const groupedData = cardData()?.reduce((acc, item) => {
    if (item?.cityId) {
      // If the cityId is not already in the accumulator, initialize it
      if (!acc[item.cityId]) {
        acc[item.cityId] = {
          count: 0,
          name: cityOptions.find((city) => city.value === item.cityId)?.label,
          startDate: item?.startDate,
          discount: item?.value,
          status: item?.status,
          id: item?.id,
        };
      }

      // Increment the count and set the name (assuming the name is the same for the same cityId)
      acc[item.cityId].count += 1;
    }
    return acc;
  }, {});

  // Ensure groupedData is not undefined or null before proceeding
  const result = groupedData
    ? Object.keys(groupedData).map((cityId) => ({
        cityId: Number(cityId),
        name: groupedData[cityId]?.name,
        count: groupedData[cityId]?.count,
        startDate: groupedData[cityId]?.startDate,
        discount: groupedData[cityId]?.discount,
        status: groupedData[cityId]?.status,
        id: groupedData[cityId]?.id,
      }))
    : [];

  return data?.length === 0 ? (
    <Loader />
  ) : (
    <Layout
      content={
        <div className="bg-themeGray p-5">
          <div className="bg-white rounded-lg p-5 min-h-screen">
            <div className="flex justify-between items-center flex-wrap gap-5">
              <h2 className="text-themeRed text-lg font-bold font-norms">
                {t("Stamp Card")}
              </h2>
              <div className="flex gap-x-2">
                <div data-testid="stampcard-add-btn">
                  <HelmetBtn
                    text="+ Add Stamp Card"
                    onClick={() => {
                      setModType("add");
                      setModal(true);
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 cursor-pointer font-switzer mt-6">
              {data?.data?.cards?.map((item) => (
                <div
                  className="shadow-cardShadow rounded-md p-3"
                  data-testid={`stampcard-item-${item?.id}`}
                  onClick={() => {
                    stampCardDetails(item?.id);
                    setRstatus(item?.id);
                  }}
                >
                  {/* Stamp Card Image */}
                  {item?.image && (
                    <div className="w-full h-32 mb-3 rounded-md overflow-hidden bg-gray-100">
                      <img
                        src={BASE_URL + item?.image}
                        alt={item?.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-2xl font-bold line-clamp-1">
                      {item?.title}
                    </h2>
                    <HiOutlineDotsVertical
                      size="25"
                      data-testid={`stampcard-item-${item?.id}-menu`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setModType("update");
                        setModal(true);
                        setStamp({
                          ...stamp,
                          id: item?.id,
                          title: item?.title,
                          value: item?.value,
                          description: item?.description,
                          image: item?.image,
                          cityId: item?.cityId,
                        });
                      }}
                    />
                  </div>
                  <p className="text-gray-600">
                    Start Date:{" "}
                    {dayjs(item?.startDate)?.local().format("DD-MM-YYYY")}
                  </p>
                  <p className="text-gray-600">Discount: {item?.value}</p>
                  <p className="text-gray-600 mb-2">City: {getCityName(item?.cityId)}</p>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    Description: {item?.description}
                  </p>
                  <div className="flex justify-between text-gray-600 mb-1">
                    <p>Status: {item?.status ? "Active" : "Inactive"}</p>

                    <div className="flex items-center gap-3">
                      <label>
                        <Switch
                          onChange={() => {
                            updateStatus(item?.id, item?.status);
                          }}
                          checked={item?.status}
                          uncheckedIcon={false}
                          checkedIcon={false}
                          onColor="#139013"
                          onHandleColor="#fff"
                          className="react-switch"
                          boxShadow="none"
                          width={36}
                          height={20}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {stampCardRest && (
              <div className="mt-9">
                <div className="ml-auto">
                  <Helment
                    search={true}
                    searchOnChange={(e) => setSearch(e.target.value)}
                    searchValue={search}
                    csvdata={csv}
                  />
                </div>
                <div>
                  <MyDataTable columns={columns} data={datas} />
                </div>
              </div>
            )}
          </div>

          <Modal
            onClose={() => setModal(false)}
            isOpen={modal}
            size={"2xl"}
            isCentered
            motionPreset="slideInBottom"
          >
            <ModalOverlay />
            <ModalContent
              onScroll={handleScroll}
              className=" h-max-[70vh] overflow-y-auto hide-scroll"
              borderRadius={"20px"}
              sx={{
                "@media screen and (max-width: 500px)": {
                  borderRadius: "20px",
                  borderBottomRadius: 0,
                  mb: 0,
                  height: "calc(100vh - 18vh)",
                  // overflowY: "auto",
                  // overflowX: "hidden",
                  // scrollbarWidth: "none",
                  // "-ms-overflow-style": "none",
                },
              }}
            >
              <ModalHeader
                padding={0}
                className={
                  scrollValue > 100
                    ? `sticky top-0 z-10 bg-white duration-150`
                    : ""
                }
              >
                <div className="border-b-2 border-b-[#0000001F] px-5 py-2.5 text-lg font-norms font-medium">
                  {t(`${modType === "update" ? "Update" : "Add"} Stamp Card`)}
                </div>
                <ModalCloseButton />
              </ModalHeader>
              <ModalBody padding={4}>
                {!loader ? (
                  <>
                    <div className="grid grid-cols-2 gap-5 hide-scroll h-full px-2 pb-10 max-sm:px-0">
                      <div className="w-28 h-28 rounded-md overflow-hidden bg-gray-200 border-gray-200 border-[1px] col-span-2">
                        <label
                          className="h-full flex flex-col font-semibold justify-center items-center text-gray-600 cursor-pointer"
                          htmlFor="image"
                        >
                          {stamp?.image ? (
                            <img
                              className="w-full h-full object-cover rounded"
                              src={
                                modType === "update"
                                  ? stamp?.imageShow
                                    ? stamp?.imageShow
                                    : BASE_URL + stamp?.image
                                  : stamp?.imageShow
                              }
                              alt="image"
                            />
                          ) : (
                            <MdAddPhotoAlternate size={40} color="white" />
                          )}
                        </label>
                        <input
                          className="bg-slate-100 outline-none py-4 px-3 w-full"
                          id="image"
                          name="image"
                          hidden
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            handleImageChange(e, "image");
                          }}
                        />
                      </div>
                      <div className="space-y-1">
                        <label
                          htmlFor="title"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Title")}
                        </label>
                        <input
                          type="text"
                          name="title"
                          id="title"
                          className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                          onChange={(e) =>
                            handleChange(e.target.value, "title")
                          }
                          value={stamp?.title}
                        />
                      </div>
                      <div className="space-y-1">
                        <label
                          htmlFor="value"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Value")}
                        </label>
                        <input
                          type="text"
                          name="value"
                          id="value"
                          value={stamp?.value}
                          className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                          onChange={(e) =>
                            handleChange(e.target.value, "value")
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <label
                          htmlFor="description"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Description")}
                        </label>
                        <input
                          type="text"
                          name="description"
                          id="description"
                          value={stamp?.description}
                          className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                          onChange={(e) =>
                            handleChange(e.target.value, "description")
                          }
                        />
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-black font-switzer font-semibold">
                          {t("City")}
                        </h4>
                        <Select
                          // styles={customStyles}
                          placeholder="Select"
                          name="cityId"
                          options={cityOptions}
                          onChange={(e) => {
                            setStamp({
                              ...stamp,
                              cityId: e,
                            });
                          }}
                          value={modType === "update" 
                            ? cityOptions.find(city => city.value === stamp?.cityId) 
                            : stamp?.cityId
                          }
                          isDisabled={modType === "update"}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-[40vh]">
                    <MiniLoader />
                  </div>
                )}
              </ModalBody>
              <ModalFooter
                padding={4}
                className="sticky bottom-0 z-10 bg-white"
              >
                <div className="flex gap-2">
                  <BlackButton
                    text={t("cancel")}
                    onClick={() => {
                      setModal(false);
                    }}
                  />

                  {modType === "update" ? (
                    <RedButton
                      text={t("Update Stamp Card")}
                      onClick={() => {
                        updateStampCard();
                      }}
                    />
                  ) : (
                    <RedButton
                      text={t("Add Stamp Card")}
                      onClick={() => {
                        handleAddStampCard();
                      }}
                    />
                  )}
                </div>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </div>
      }
    />
  );
}
