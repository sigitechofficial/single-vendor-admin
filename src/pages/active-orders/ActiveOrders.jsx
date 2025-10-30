import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Helment from "../../components/Helment";
import MyDataTable from "../../components/MyDataTable";
import Loader, { MiniLoader } from "../../components/Loader";
import GetAPI from "../../utilities/GetAPI";
import RedButton, { BlackButton, EditButton } from "../../utilities/Buttons";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../utilities/SocketContext";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import Select from "react-select";
import { PostAPI } from "../../utilities/PostAPI";
import { error_toaster, success_toaster } from "../../utilities/Toaster";
export default function ActiveOrders() {
  const { t } = useTranslation();
  const { data, reFetch } = GetAPI("admin/getActiveOrders");
  console.log("🚀 ~ ActiveOrders ~ data:", data);
  const statuses = GetAPI("admin/getOrderStatus");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { socket } = useSocket();
  const [loader, setLoader] = useState(false);
  const [modal, setModal] = useState(false);
  const [update, setUpdate] = useState({
    orderStatusId: "",
    orderId: "",
    current: "",
    to: "",
    reason: "",
  });
  const viewDetails = (orderId) => {
    localStorage.setItem("orderId", orderId);
    navigate("/restaurant/order-details");
  };

  const statusOptions = [];
  statuses?.data?.data?.status?.map((stat) => {
    statusOptions.push({ value: stat.id, label: stat.name });
  });

  const handleUpdate = async () => {
    if (update?.to?.label?.includes("Reject") && !update?.reason) {
      error_toaster("Please provide a reason");
    } else if (update?.to?.label?.includes("Cancelled") && !update?.reason) {
      error_toaster("Please provide a reason");
    } else {
      let res = await PostAPI("admin/updateStatus", {
        orderStatusId: update?.to?.value,
        orderId: update?.orderId,
      });

      if (res?.data?.status === "1") {
        success_toaster(res?.data?.message);
        reFetch();
        setModal(false);
        setUpdate({
          orderStatusId: "",
          orderId: "",
          current: "",
          to: "",
          reason: "",
        });
      } else {
        error_toaster(res?.data?.message);
        setModal(false);
      }
    }
  };

  const orderData = () => {
    return data?.data?.orders?.filter((dat) => {
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
    { field: "sn", header: t("Serial No") },
    { field: "id", header: t("Id") },
    { field: "orderNum", header: t("Order Number") },
    { field: "restaurantName", header: t("Restaurant Name") },
    { field: "customer", header: t("Customer") },
    { field: "paymentMethodName", header: t("Payment Method") },
    { field: "status", header: t("Order Status") },
    { field: "action", header: t("Action") },
  ];

  const datas = [];
  const csv = [];

  orderData()?.forEach((values, index) => {
    csv?.push({
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

    datas?.push({
      sn: index + 1,
      id: values?.id,
      orderNum: values?.orderNum,
      restaurantName: values?.restaurant?.businessName,
      customer:
        (values?.user?.firstName || "") + " " + (values?.user?.lastName || ""),
      paymentMethodName: values.paymentMethodName || "--",
      status: (
        <div>
          {values?.orderStatus?.name === "Delivered" ? (
            <div className="bg-[#21965314] text-themeGreen font-semibold p-2 rounded-md flex justify-center">
              {t("Delivered")}
            </div>
          ) : values?.orderStatus?.name === "Cancelled" ? (
            <div className="bg-[#EE4A4A14] text-themeRed font-semibold p-2 rounded-md flex justify-center">
              {t("Cancelled")}
            </div>
          ) : values?.orderStatus?.name === "Reject" ? (
            <div className="bg-[#1860CC33] text-[#1860CC] font-semibold p-2 rounded-md flex justify-center">
              {t("Rejected")}
            </div>
          ) : values?.orderStatus?.name === "Placed" ? (
            <div className="bg-[#faff7533] text-yellow-400 font-semibold p-2 rounded-md flex justify-center">
              {t("Placed")}
            </div>
          ) : values?.orderStatus?.name === "Accepted" ? (
            <div className="bg-green-300 text-green-700 font-semibold p-2 rounded-md flex justify-center">
              {t("Accepted")}
            </div>
          ) : values?.orderStatus?.name === "Preparing" ? (
            <div className="bg-[#75caff33] text-[#75caff] font-semibold p-2 rounded-md flex justify-center">
              {t("Preparing")}
            </div>
          ) : values?.orderStatus?.name === "Ready for delivery" ? (
            <div className="bg-[#EC6C3033] text-[#EC6C30] font-semibold p-2 rounded-md flex justify-center">
              {t("Ready for delivery")}
            </div>
          ) : values?.orderStatus?.name === "On the way" ? (
            <div className="bg-[#EC6C3033] text-[#EC6C30] font-semibold p-2 rounded-md flex justify-center">
              {t("On the way")}
            </div>
          ) : values?.orderStatus?.name === "Food Pickedup" ? (
            <div className="bg-[#EC6C3033] text-[#EC6C30] font-semibold p-2 rounded-md flex justify-center">
              {t("Food Pickedup")}
            </div>
          ) : values?.orderStatus?.name === "Accepted by Driver" ? (
            <div className="bg-[#EC6C3033] text-[#EC6C30] font-semibold p-2 rounded-md flex justify-center">
              {t("Accepted by Driver")}
            </div>
          ) : (
            ""
          )}
        </div>
      ),
      action: (
        <div className="flex items-center gap-3">
          <EditButton
            text={t("Update")}
            onClick={() => {
              setUpdate({
                ...update,
                current: values?.orderStatus?.name,
                orderStatusId: values.orderStatusId,
                orderId: values?.id,
              });
              setModal(true);
            }}
          />
        </div>
      ),
    });
  });

  useEffect(() => {
    if (!socket) return;

    socket.on("connect", () => {
      console.log("Connected");
      const map = {
        userId: localStorage.getItem("userId"),
        type: "connected",
      };
      socket.emit("message", JSON.stringify(map));
    });

    socket.on("placeOrder", (data) => {
      console.log(data);
      reFetch();
      toast.success(t("New Order Placed"));
    });

    socket.on("disconnect", () => {
      console.log("Disconnected");
    });

    socket.on("error", (error) => {
      console.error("Error:", error);
    });

    return () => {
      socket.off("connect");
      socket.off("placeOrder");
      socket.off("disconnect");
      socket.off("error");
    };
  }, [socket, reFetch, t]);

  return data?.length === 0 ? (
    <Loader />
  ) : (
    <Layout
      content={
        <div className="bg-themeGray p-5">
          <div className="bg-white rounded-lg p-5">
            <div className="flex justify-between items-center flex-wrap gap-5">
              <h2 className="text-themeRed text-lg font-bold font-norms">
                {t("All Active Orders")}
              </h2>
              <div>
                <div data-testid="activeorders-helment">
                  <Helment
                    search={true}
                    searchOnChange={(e) => setSearch(e.target.value)}
                    searchValue={search}
                    csvdata={csv}
                  />
                </div>
              </div>
            </div>

            <div>
              <MyDataTable columns={columns} data={datas} />
            </div>
          </div>

          <Modal
            onClose={() => setModal(false)}
            isOpen={modal}
            size={"xl"}
            isCentered
            motionPreset="slideInBottom"
          >
            <ModalOverlay />
            <ModalContent
              className="hide-scroll"
              borderRadius={"20px"}
              sx={{
                "@media screen and (max-width: 500px)": {
                  borderRadius: "20px",
                  borderBottomRadius: 0,
                  mb: 0,
                  height: "calc(100vh - 50vh)",
                  "-ms-overflow-style": "none",
                },
              }}
            >
              <ModalHeader padding={0}>
                <div className="border-b-2 border-b-[#0000001F] px-5 py-2.5 text-lg font-norms font-medium">
                  Update Status
                </div>
                <ModalCloseButton />
              </ModalHeader>
              <ModalBody padding={0}>
                {!loader ? (
                  <>
                    <div className="h-[300px] hide-scroll space-y-3 mt-5 font-switzer px-4">
                      <p className="">Current Status : {update?.current}</p>
                      <div>
                        <h4 className="text-black font-switzer font-semibold">
                          Change to
                        </h4>
                        <div data-testid="activeorders-status-select">
                          <Select
                          placeholder="Select"
                          name="lang"
                          options={statusOptions}
                          onChange={(e) => {
                            setUpdate({
                              ...update,
                              to: e,
                            });
                          }}
                          menuPortalTarget={document.body}
                          styles={{
                            menuPortal: (base) => ({
                              ...base,
                              zIndex: 9999,
                            }),
                            menu: (base) => ({
                              ...base,
                              zIndex: 9999,
                              maxHeight: "auto",
                              overflowY: "auto",
                            }),
                          }}
                          menuPlacement="auto"
                          menuPosition="fixed"
                          value={
                            update?.to || {
                              value: update?.id,
                              label: update.current,
                            }
                          }
                          />
                        </div>
                      </div>
                      {update?.to?.label?.includes("Cancelled") ||
                      update?.to?.label?.includes("Reject") ? (
                        <div className="space-y-1">
                          <label
                            htmlFor="reason"
                            className="text-black font-switzer font-semibold"
                          >
                            {t("Reason")}
                          </label>
                          <input
                            data-testid="activeorders-reason-input"
                            type="text"
                            name="reason"
                            id="reason"
                            className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                            onChange={(e) =>
                              setUpdate({ ...update, reason: e.target.value })
                            }
                          />
                        </div>
                      ) : null}
                    </div>
                  </>
                ) : (
                  <div className="w-full h-[40vh]">
                    <MiniLoader />
                  </div>
                )}
              </ModalBody>
              <ModalFooter paddingTop={0} className="sticky bottom-0 z-10">
                <div className="flex gap-1">
                  <BlackButton
                    text={t("cancel")}
                    onClick={() => {
                      setModal(false);
                    }}
                  />

                  <RedButton
                    text={t("Update")}
                    onClick={() => {
                      handleUpdate();
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
