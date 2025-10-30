import React, { useState } from "react";
import Layout from "../../components/Layout";
import Helment from "../../components/Helment";
import MyDataTable from "../../components/MyDataTable";
import Loader from "../../components/Loader";
import GetAPI from "../../utilities/GetAPI";
import { EditButton } from "../../utilities/Buttons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; // Import useTranslation

export default function ScheduleOrders() {
  const { t } = useTranslation(); // Add this line
  const { data } = GetAPI("admin/restAllScheduleOrders");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const viewDetails = (orderId) => {
    navigate(`/restaurant/order-details/${orderId}`);
  };

  const scheduledOrderData = () => {
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
          dat?.user?.userName.toLowerCase().includes(search.toLowerCase()))
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
      field: "discount",
      header: t("discount"),
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
      field: "commission",
      header: t("commission"),
    },
    { field: "deliveryType", header: t("Delivery Type") },
    {
      field: "orderMode",
      header: t("orderMode"),
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
  scheduledOrderData()?.map((values, index) => {
    csv.push({
      sn: index + 1,
      id: values?.id,
      orderNum: values?.orderNum,
      restaurantName: values?.restaurant?.businessName,
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
    return datas.push({
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
        values?.orderCharge?.driverEarnings,
      restaurantEarnings:
        values?.restaurant?.zoneRestaurant?.zone?.zoneDetail?.currencyUnit
          ?.symbol +
        " " +
        values?.orderCharge?.restaurantEarnings,
      discount:
        values?.restaurant?.zoneRestaurant?.zone?.zoneDetail?.currencyUnit
          ?.symbol +
        " " +
        values?.orderCharge?.discount,
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
      commission:
        values?.restaurant?.zoneRestaurant?.zone?.zoneDetail?.currencyUnit
          ?.symbol +
        " " +
        values?.orderCharge?.adminDeliveryCharges,
      orderMode: values?.orderMode?.name,
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
          ) : values?.orderStatus?.name === "Delivered" ? (
            <div
              className="bg-[#75caff33] text-[#75caff] font-semibold p-2 rounded-md flex 
              justify-center"
            >
              {t("Delivered")}
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
                {t("allScheduledOrders")}
              </h2>
              <div>
                <Helment
                  search={true}
                  searchOnChange={(e) => setSearch(e.target.value)}
                  searchValue={search}
                  csvdata={csv}
                />
              </div>
            </div>

            <div>
              <MyDataTable columns={columns} data={datas} />
            </div>
          </div>
        </div>
      }
    />
  );
}
