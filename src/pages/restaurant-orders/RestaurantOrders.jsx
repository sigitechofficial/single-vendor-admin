import React, { useState } from "react";
import Layout from "../../components/Layout";
import Helment from "../../components/Helment";
import MyDataTable from "../../components/MyDataTable";
import Loader from "../../components/Loader";
import GetAPI from "../../utilities/GetAPI";
import { PostAPI } from "../../utilities/PostAPI";
import RedButton, { BlackButton, EditButton } from "../../utilities/Buttons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { toast } from "react-toastify";

export default function RestaurantOrders() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useTranslation();
  const { data, setData } = GetAPI("admin/restAllOrders");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const filterOptions = GetAPI("admin/filterOptions");
  const [selected, setSelected] = useState({
    city: "",
    country: "",
    storeTypes: "",
    zones: "",
    from: "",
    to: "",
  });

  const cityOptions = [];
  const countryOptions = [];
  const zonesOptions = [];

  if (filterOptions) {
    filterOptions?.data?.data?.city?.map((el) => {
      cityOptions.push({
        value: el?.id,
        label: el?.name,
      });
    });
    filterOptions?.data?.data?.country?.map((el) => {
      countryOptions.push({
        value: el?.id,
        label: el?.name,
      });
    });
    filterOptions?.data?.data?.zones?.map((el) => {
      zonesOptions.push({
        value: el?.id,
        label: el?.name,
      });
    });
  }

  const handleChange = (e, type, str) => {
    setSelected({
      ...selected,
      [type]: e,
    });
  };

  const handleSubmit = async () => {
    let res = await PostAPI("admin/filterOrders", {
      city: selected?.city?.label,
      country: selected?.country?.label,
      zoneId: selected?.zones?.value,
      businessType: 1,
      startDate: selected?.from,
      endDate: selected?.to,
      driverType: selected?.driverType?.label,
    });
    if (res?.data?.status === "1") {
      setData(res?.data);
      toast.success("filter applied");
      setSelected("");
      onClose();
    }
  };

  const viewDetails = (orderId) => {
    navigate(`/restaurant/order-details/${orderId}`);
  };

  const orderData = () => {
    const filteredData = data?.data?.orders?.filter((dat) => {
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
          dat?.user?.userName.toLowerCase().includes(search.toLowerCase())) ||
        (dat?.orderCharge &&
          dat?.orderCharge?.id?.toString()?.toLowerCase().includes(search.toLowerCase())) ||
        (dat?.orderStatus &&
          dat?.orderStatus?.name?.toLowerCase().includes(search.toLowerCase())) ||
        (dat?.deliveryType &&
          dat?.deliveryType?.name?.toLowerCase().includes(search.toLowerCase())) ||
        (dat?.orderMode &&
          dat?.orderMode?.name?.toLowerCase().includes(search.toLowerCase())) ||
        (dat?.orderType &&
          dat?.orderType?.type?.toLowerCase().includes(search.toLowerCase()))
      );
    });
    return filteredData;
  };

  const columns = [
    { field: "sn", header: t("serialNo") },
    { field: "id", header: t("id") },
    { field: "orderType", header: t("Order Type") },
    {
      field: "orderNum",
      header: t("orderNum"),
    },
    {
      field: "restaurantName",
      header: t("restaurantName"),
    },
    {
      field: "customerInfo",
      header: t("customerInfo"),
    },
    {
      field: "driverName",
      header: t("Driver Name"),
    },
    {
      field: "driverType",
      header: t("Driver Type"),
    },
    {
      field: "driverEarnings",
      header: t("driverEarnings"),
    },
    {
      field: "restaurantEarnings",
      header: t("restaurantEarnings"),
    },
    {
      field: "adminEarnings",
      header: t("Admin Earnings"),
    },
    {
      field: "discount",
      header: t("discount"),
    },
    {
      field: "stampPoints",
      header: t("Stamp Points"),
    },
    {
      field: "deliveryFees",
      header: t("deliveryFees"),
    },
    {
      field: "serviceFees",
      header: t("serviceFees"),
    },
    {
      field: "packingFees",
      header: t("packingFees"),
    },
    {
      field: "fine",
      header: t("Fine"),
    },
    {
      field: "processingFee",
      header: t("Processing Fee"),
    },
    {
      field: "cardFee",
      header: t("Card Fee"),
    },
    {
      field: "commission",
      header: t("commission"),
    },
    { field: "deliveryType", header: t("Delivery Type") },
    {
      field: "orderMode",
      header: t("orderMode"),
    },
    {
      field: "total",
      header: t("Total"),
    },
    {
      field: "status",
      header: t("status"),
    },
    {
      field: "action",
      header: t("action"),
    },
  ];

  const datas = [];
  const csv = [];
  orderData()?.map((values, index) => {
    csv.push({
      sn: index + 1,
      id: values?.id,
      orderNum: values?.orderNum,
      restaurantName: values?.restaurant?.businessName,
      customerInfo: values?.user?.userName,
      driverEarnings:
        values?.restaurant?.zoneRestaurant?.zone?.zoneDetail?.currencyUnit
          ?.symbol +
        " " +
        parseFloat(values?.orderCharge?.driverEarnings) +
        parseFloat(values?.orderCharge?.additionalTip) +
        parseFloat(values?.orderCharge?.tip),
      restaurantEarnings: values?.orderCharge?.restaurantEarnings,
      discount: values?.orderCharge?.discount,
      deliveryFees: values?.orderCharge?.deliveryFees,
      serviceFees: values?.orderCharge?.serviceCharges,
      packingFees: values?.restaurant?.packingFee,
      commission: values?.orderCharge?.adminDeliveryCharges,
      orderMode: values?.orderMode?.name,
      status:
        values?.orderStatus?.name === "Delivered"
          ? "delivered"
          : values?.orderStatus?.name === "Cancelled"
          ? "cancelled"
          : values?.orderStatus?.name === "Reject"
          ? "rejected"
          : values?.orderStatus?.name === "Placed"
          ? "placed"
          : values?.orderStatus?.name === "Preparing"
          ? "preparing"
          : "scheduled",
    });
    datas.push({
      sn: index + 1,
      id: values?.id,
      orderType: values?.orderType?.type,
      deliveryType: values?.deliveryType?.name,
      orderNum: values?.orderNum,
      restaurantName: values?.restaurant?.businessName,
      customerInfo: values?.user?.userName,
      driverName: values?.DriverId
        ? values?.DriverId?.firstName + " " + values?.DriverId?.lastName
        : "",
      driverType: values?.DriverId ? values?.DriverId?.driverType : "",
      driverEarnings:
        values?.restaurant?.zoneRestaurant?.zone?.zoneDetail?.currencyUnit
          ?.symbol +
        " " +
        (values?.DriverId?.driverType === "Freelancer"
          ? parseFloat(values?.orderCharge?.driverEarnings || 0)
          : 0 +
            parseFloat(values?.orderCharge?.additionalTip || 0) +
            parseFloat(values?.orderCharge?.tip || 0)
        ).toFixed(2),
      adminEarnings: values?.currencyUnitID?.symbol + " " + values?.orderCharge?.adminEarnings,
      restaurantEarnings:
        values?.restaurant?.zoneRestaurant?.zone?.zoneDetail?.currencyUnit
          ?.symbol +
        " " +
        values?.orderCharge?.restaurantEarnings,
      discount:
        values?.restaurant?.zoneRestaurant?.zone?.zoneDetail?.currencyUnit
          ?.symbol +
        " " +
        values?.bannerDiscount,
      stampPoints: values?.stampPoints,
      deliveryFees:
        values?.restaurant?.zoneRestaurant?.zone?.zoneDetail?.currencyUnit
          ?.symbol +
        " " +
        values?.orderCharge?.deliveryFees,
      serviceFees: values?.restaurant?.zoneRestaurant?.zone?.zoneDetail
        ?.currencyUnit?.symbol
        ? values?.restaurant?.zoneRestaurant?.zone?.zoneDetail?.currencyUnit
            ?.symbol +
          " " +
          values?.orderCharge?.serviceCharges
        : "0.00",
      packingFees:
        values?.restaurant?.zoneRestaurant?.zone?.zoneDetail?.currencyUnit
          ?.symbol +
        " " +
        values?.restaurant?.packingFee,
      fine:
        values?.restaurant?.zoneRestaurant?.zone?.zoneDetail?.currencyUnit
          ?.symbol +
        " " +
        (values?.orderCharge?.fine ? values?.orderCharge?.fine : "0.00"),
      processingFee:
        values?.restaurant?.zoneRestaurant?.zone?.zoneDetail?.currencyUnit
          ?.symbol +
          " " +
          values?.orderCharge?.processingFee || 0,
      cardFee:
        values?.restaurant?.zoneRestaurant?.zone?.zoneDetail?.currencyUnit
          ?.symbol +
          " " +
          values?.orderCharge?.cardFee || 0,
      commission:
        values?.restaurant?.zoneRestaurant?.zone?.zoneDetail?.currencyUnit
          ?.symbol +
        " " +
        values?.orderCharge?.adminDeliveryCharges,
      orderMode: values?.orderMode?.name,
      total:
        values?.restaurant?.zoneRestaurant?.zone?.zoneDetail?.currencyUnit
          ?.symbol +
        " " +
        values?.orderCharge?.total,
      status: (
        <div>
          {values?.orderStatus?.name === "Delivered" ? (
            <div
              className="bg-[#21965314] text-themeGreen font-semibold p-2 rounded-md flex 
              justify-center"
            >
              {t("delivered")}
            </div>
          ) : values?.orderStatus?.name === "Cancelled" ? (
            <div
              className="bg-[#EE4A4A14] text-themeRed font-semibold p-2 rounded-md flex 
              justify-center"
            >
              {t("cancelled")}
            </div>
          ) : values?.orderStatus?.name === "Reject" ? (
            <div
              className="bg-[#1860CC33] text-[#1860CC] font-semibold p-2 rounded-md flex 
              justify-center"
            >
              {t("rejected")}
            </div>
          ) : values?.orderStatus?.name === "Placed" ? (
            <div
              className="bg-[#faff7533] text-yellow-400 font-semibold p-2 rounded-md flex 
              justify-center"
            >
              {t("placed")}
            </div>
          ) : values?.orderStatus?.name === "Preparing" ? (
            <div
              className="bg-[#75caff33] text-[#75caff] font-semibold p-2 rounded-md flex 
              justify-center"
            >
              {t("preparing")}
            </div>
          ) : (
            <div
              className="bg-[#EC6C3033] text-[#EC6C30] font-semibold p-2 rounded-md flex 
              justify-center"
            >
              {t("scheduled")}
            </div>
          )}
        </div>
      ),
      action: (
        <div className="flex items-center gap-3">
          <EditButton
            text={t("viewDetails")}
            onClick={() => {
              viewDetails(values?.id);
            }}
          />
        </div>
      ),
    });
  });

  return data?.length === 0 ? (
    <Loader />
  ) : (
    <Layout
      content={
        <div className="bg-themeGray p-5">
          <div className="bg-white rounded-lg p-5">
            <div className="flex justify-between items-center flex-wrap gap-5">
              <h2 className="text-themeRed text-lg font-bold font-norms">
                {t("allOrders")}
              </h2>
              <div className="flex gap-x-2">
                <div>
                  <Helment
                    search={true}
                    searchOnChange={(e) => setSearch(e.target.value)}
                    searchValue={search}
                    csvdata={csv}
                  />
                </div>
                <div
                  className="flex items-center gap-1 text-sm border bg-red-500 text-white rounded-md px-2 py-1.5 h-9 cursor-pointer"
                  onClick={onOpen}
                >
                  {t("Apply Filter")}
                </div>
              </div>
            </div>

            <div>
              <MyDataTable columns={columns} data={datas} />
            </div>
          </div>

          <Modal isOpen={isOpen} onClose={onClose} size={"4xl"} isCentered>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader padding={0}>
                <p className="font-normal pl-6 py-2 border-b-[1px] border-gray-400">
                  {t("Filters")}
                </p>
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody padding={4}>
                <div className="grid grid-cols-2 gap-x-5 gap-y-8 py-2 px-2 overflow-auto">
                  <div>
                    <h4>Country</h4>
                    <Select
                      placeholder="Select"
                      name="country"
                      options={countryOptions}
                      onChange={(e) => handleChange(e, "country")}
                      value={selected?.country}
                    />
                  </div>
                  <div>
                    <h4>City</h4>
                    <Select
                      placeholder="Select"
                      name="city"
                      options={cityOptions}
                      onChange={(e) => handleChange(e, "city")}
                      value={selected?.city}
                    />
                  </div>
                  <div>
                    <h4>Zone</h4>
                    <Select
                      placeholder="Select"
                      name="zones"
                      options={zonesOptions}
                      onChange={(e) => handleChange(e, "zones")}
                      value={selected?.zones}
                    />
                  </div>
                  {/* <div>
                    <h4>Business Type</h4>
                    <Select
                      placeholder="Select"
                      name="storeTypes"
                      options={[
                        { value: 1, label: "Restaurant" },
                        { value: 2, label: "Store" },
                      ]}
                      onChange={(e) => handleChange(e, "storeTypes")}
                      value={selected?.storeTypes}
                    />
                  </div> */}

                  <div>
                    <h4>From</h4>
                    <input
                      className="bg-[#f4f4f4] outline-none p-3 w-full rounded-md"
                      type="date"
                      onChange={(e) => handleChange(e.target.value, "from")}
                    />
                  </div>
                  <div>
                    <h4>To</h4>
                    <input
                      className="bg-[#f4f4f4] outline-none p-3 w-full rounded-md"
                      type="date"
                      onChange={(e) => handleChange(e.target.value, "to")}
                    />
                  </div>
                  <div>
                    <h4>Delivery by</h4>
                    <Select
                      placeholder="Select"
                      name="driverType"
                      options={[
                        { value: 1, label: "Restaurant" },
                        { value: 2, label: "Freelancer" },
                      ]}
                      onChange={(e) => handleChange(e, "driverType")}
                    />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter padding={4}>
                <div className="flex gap-2">
                  <BlackButton text={t("Clear filter")} onClick={onClose} />

                  <RedButton
                    text={t("Apply filter")}
                    onClick={() => {
                      handleSubmit();
                    }}
                  />
                </div>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </div>
      }
    />
  );
}
