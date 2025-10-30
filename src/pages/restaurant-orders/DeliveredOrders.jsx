import React, { useState } from "react";
import Layout from "../../components/Layout";
import Helment from "../../components/Helment";
import MyDataTable from "../../components/MyDataTable";
import Loader, { MiniLoader } from "../../components/Loader";
import GetAPI from "../../utilities/GetAPI";
import { EditButton } from "../../utilities/Buttons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AiOutlineIssuesClose } from "react-icons/ai";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { PostAPI } from "../../utilities/PostAPI";
import { info_toaster, success_toaster } from "../../utilities/Toaster";

export default function DeliveredOrders() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data, reFetch } = GetAPI("admin/restAllDeliveredOrders");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [disputeData, setDisputeData] = useState({
    reason: "",
    id: "",
    loader: false,
  });

  const viewDetails = (orderId) => {
    navigate(`/restaurant/order-details/${orderId}`);
  };

  const deliveredOrderData = () => {
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

  const handleDispute = async () => {
    if (disputeData?.reason === "") {
      info_toaster("Please add reason for dispute order");
    } else {
      setDisputeData({ ...disputeData, loader: true });

      let res = await PostAPI("admin/addToDispute", {
        orderId: disputeData?.id,
        reason: disputeData?.reason,
      });
      if (res?.data?.status === "1") {
        setDisputeData({ ...disputeData, loader: false });
        success_toaster(res?.data?.message);
        setModal(false);
        setDisputeData({ ...disputeData, reason: "", id: "" });
        reFetch();
      } else {
        setDisputeData({ ...disputeData, loader: false });
        info_toaster(res?.data?.message);
      }
    }
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
  deliveredOrderData()?.map((values, index) => {
    csv.push({
      sn: index + 1,
      id: values?.id,
      orderNum: values?.orderNum,
      restaurantName: values?.restaurant?.businessName,
      customerInfo: values?.user?.userName,
      driverEarnings: `${
        values?.restaurant?.zoneRestaurant?.zone?.zoneDetail?.currencyUnit
          ?.symbol || ""
      }${
        values?.orderCharge?.driverEarnings != undefined
          ? values?.orderCharge?.driverEarnings
          : 0
      }`,

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
          <AiOutlineIssuesClose
            size={30}
            color="red"
            className="cursor-pointer"
            onClick={() => {
              setDisputeData({ ...disputeData, id: values?.id });
              setModal(true);
            }}
          />
        </div>
      ),
    });
  });

  return data?.length === 0 ? (
    <Loader />
  ) : (
    <>
      <Layout
        content={
          <div className="bg-themeGray p-5">
            <div className="bg-white rounded-lg p-5">
              <div className="flex justify-between items-center flex-wrap gap-5">
                <h2 className="text-themeRed text-lg font-bold font-norms">
                  {t("allDeliveredOrders")}
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

      <Modal
        onClose={() => setModal(false)}
        isOpen={modal}
        size={"md"}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader pl={6} pt={2} className="text-gray-600">
            Dispute Order
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody padding={4}>
            {disputeData?.loader ? (
              <div className="h-[150px]">
                <MiniLoader />
              </div>
            ) : (
              <div className="space-y-5 px-3 flex flex-col items-center font-norms font-semibold text-xl">
                <div className="w-full my-5">
                  <label htmlFor="">Reason</label>
                  <input
                    className="border-black border rounded-md px-2 py-1.5 outline-none w-full"
                    value={disputeData.reason}
                    onChange={(e) =>
                      setDisputeData({ ...disputeData, reason: e.target.value })
                    }
                    type="text"
                  />
                </div>
              </div>
            )}
          </ModalBody>
          <ModalFooter padding={0}>
            <div className="grid grid-cols-2 px-7 pb-6 gap-x-3 [&>div]:py-2.5 [&>div]:border w-full [&>div]:rounded-md [&>div]:cursor-pointer text-center font-semibold text-xl">
              <div
                className="border-black hover:bg-black hover:text-white duration-150"
                onClick={() => setModal(false)}
              >
                {t("Cancel")}
              </div>
              <div
                className="border-red-500 bg-red-500 text-white hover:bg-white hover:text-red-500 duration-150"
                onClick={handleDispute}
              >
                {t("Confirm")}
              </div>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
