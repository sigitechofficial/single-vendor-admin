import React, { useState } from "react";
import Layout from "../../components/Layout";
import Helment from "../../components/Helment";
import RedButton, { BlackButton } from "../../utilities/Buttons";
import { useTranslation } from "react-i18next";
import MyDataTable from "../../components/MyDataTable";
import { LiaFilterSolid } from "react-icons/lia";
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
import Select from "react-select";
import GetAPI from "../../utilities/GetAPI";
import { PostAPI } from "../../utilities/PostAPI";
import dayjs from "dayjs";
import { info_toaster, success_toaster } from "../../utilities/Toaster";
import { MiniLoader } from "../../components/Loader";

const PayoutTable = () => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loader, setLoader] = useState(false);
  const [driverSearch, setDriverSearch] = useState("");
  const [modalData, setModalData] = useState({ item: "", type: "" });

  const { data, reFetch } = GetAPI("admin/getPayouts");

  const filterDriverData = () => {
    const searchTerm = driverSearch?.toString().trim().toLowerCase();

    if (!searchTerm) return data?.data?.driverList || [];

    const filteredData = data?.data?.driverList?.filter((item) => {
      return (
        item?.id?.toString().toLowerCase().includes(searchTerm) ||
        item?.userId?.toString().toLowerCase().includes(searchTerm) ||
        item?.restaurantId?.toString().toLowerCase().includes(searchTerm) ||
        item?.amount?.toString().toLowerCase().includes(searchTerm) ||
        item?.accountNo?.toString().toLowerCase().includes(searchTerm) ||
        item?.user?.firstName?.toLowerCase().includes(searchTerm) ||
        item?.user?.lastName?.toLowerCase().includes(searchTerm) ||
        item?.user?.id?.toString().toLowerCase().includes(searchTerm)
      );
    });

    return filteredData;
  };

  const acceptPayouts = async (id, amount, status, type) => {
    const url =
      type === "restaurant"
        ? "admin/acceptRestaurantPayout"
        : "admin/acceptDriverPayout";

    setLoader(true);

    let res = await PostAPI(url, { id, amount, status });
    if (res?.data?.status === "1") {
      setLoader(false);
      success_toaster(res?.data?.message);
      reFetch();
      onClose();
    } else {
      setLoader(false);
      info_toaster(res?.data?.message);
    }
  };

  var columns = [
    { field: "userId", header: "User Id" },
    { field: "userName", header: "User Name" },
    { field: "role", header: "Type" },
    {
      field: "dueAmount",
      header: "Amount",
    },
    {
      field: "manualReqAmount",
      header: "Note",
    },
    {
      field: "nextPayoutDate",
      header: "Created at",
    },
    {
      field: "status",
      header: "Status",
    },
    {
      field: "action",
      header: "Action",
    },
  ];
  var restColumns = [
    { field: "userId", header: "Restaurant Id" },
    { field: "userName", header: "Business Name" },
    {
      field: "dueAmount",
      header: "Amount",
    },
    {
      field: "manualReqAmount",
      header: "Note",
    },
    {
      field: "nextPayoutDate",
      header: "Created at",
    },
    {
      field: "status",
      header: "Status",
    },
    {
      field: "action",
      header: "Action",
    },
  ];

  let datas = [];
  let restDatas = [];

  filterDriverData()?.map((item) => {
    datas.push({
      userId: item?.user?.id,
      userName: item?.user?.firstName + " " + item?.user?.lastName,
      role: item?.restaurantId ? "Restaurant" : "Freelancer",
      dueAmount: item?.amount,
      manualReqAmount: item?.note,
      nextPayoutDate: dayjs(item?.createdAt)?.format("DD/MM/YYYY"),
      status: (
        <span
          className={`${
            item?.status === "success"
              ? "text-green-600 bg-green-100"
              : item?.status === "reject"
              ? "text-red-600 bg-red-200"
              : "text-orange-500 bg-orange-100 "
          }   px-4 py-2.5 rounded-sm cursor-pointer`}
        >
          {item?.status}
        </span>
      ),
      action:
        item?.status === "success" || item?.status === "reject" ? (
          "--"
        ) : (
          <div className="flex gap-x-2 [&>button]:rounded-md font-normal font-norms [&>button]:border-[1px] [&>button]:px-4 [&>button]:py-1.5">
            <button
              onClick={() => {
                acceptPayouts(
                  item?.id,
                  parseFloat(item?.amount),
                  "success",
                  "driver"
                );
              }}
              className={`text-green-600 border-green-600`}
            >
              Accept
            </button>
            <button
              onClick={() => {
                setModalData({ ...modalData, item: item, type: "driver" });
                onOpen();
              }}
              className="text-orange-400 border-orange-400"
            >
              Adjust
            </button>
            <button
              onClick={() => {
                acceptPayouts(item?.id, parseFloat(item?.amount), "reject");
              }}
              className={`text-red-500 border-red-500 `}
            >
              Reject
            </button>
          </div>
        ),
    });
  });
  data?.data?.restList?.map((item) => {
    restDatas.push({
      userId: item?.restaurant?.id,
      userName: item?.restaurant?.businessName,
      dueAmount:
        item?.restaurant?.zoneRestaurant?.zone?.zoneDetail?.currencyUnit
          ?.symbol +
        " " +
        item?.amount,
      manualReqAmount: item?.note,
      nextPayoutDate: dayjs(item?.createdAt)?.format("DD/MM/YYYY"),
      status: (
        <span
          className={`${
            item?.status === "success"
              ? "text-green-600 bg-green-100"
              : item?.status === "reject"
              ? "text-red-600 bg-red-200"
              : "text-orange-500 bg-orange-100 "
          }  px-4 py-2.5 rounded-sm cursor-pointer`}
        >
          {item?.status}
        </span>
      ),
      action:
        item?.status === "success" || item?.status === "reject" ? (
          "--"
        ) : (
          <div className="flex gap-x-2 [&>button]:rounded-md font-normal font-norms [&>button]:border-[1px] [&>button]:px-4 [&>button]:py-1.5">
            <button
              onClick={() => {
                acceptPayouts(
                  item?.id,
                  parseFloat(item?.amount),
                  "success",
                  "restaurant"
                );
              }}
              className={`text-green-600 border-green-600`}
            >
              Accept
            </button>
            <button
              onClick={() => {
                setModalData({ ...modalData, item: item, type: "restaurant" });
                onOpen();
              }}
              className="text-orange-400 border-orange-400"
            >
              Adjust
            </button>
            <button
              onClick={() => {
                acceptPayouts(
                  item?.id,
                  parseFloat(item?.amount),
                  "reject",
                  "restaurant"
                );
              }}
              className={`text-red-500 border-red-500 `}
            >
              Reject
            </button>
          </div>
        ),
    });
  });

  return (
    <Layout
      content={
        <div className="p-5">
          {loader || !data?.data ? (
            <MiniLoader />
          ) : (
            <div className="bg-white rounded-lg p-5 min-h-screen">
              <div className="flex justify-between items-center flex-wrap gap-5">
                <h2 className="text-themeRed text-lg font-bold font-norms">
                  {t("Payout")}
                </h2>
                <div className="flex gap-x-2 items-center flex-wrap">
                  <Helment
                    search={true}
                    searchOnChange={(e) => setDriverSearch(e.target.value)}
                    searchValue={driverSearch}
                    csvdata={[{ a: "s", c: "d" }]}
                  />
                  <div
                    onClick={onOpen}
                    className="flex gap-x-1 items-center justify-center border border-themeBorderGray rounded-md px-2 py-1 h-9 cursor-pointer hover:bg-theme hover:text-white text-sm duration-100"
                  >
                    <LiaFilterSolid size={18} />
                    <p>Filter</p>
                  </div>
                </div>
              </div>
              <div className="mt-10">
                <h2 className="text-lg font-bold font-norms">
                  {t("Drivers Payouts")}
                </h2>
                <MyDataTable columns={columns} data={datas} />
              </div>
              <div className="mt-10">
                <h2 className="text-lg font-bold font-norms">
                  {t("Restaurants Payouts")}
                </h2>
                <MyDataTable columns={restColumns} data={restDatas} />
              </div>
            </div>
          )}

          <Modal isOpen={isOpen} onClose={onClose} size={"sm"} isCentered>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader padding={0}>
                <h4 className="font-normal font-norms pl-4 py-2 border-gray-300 border-b-2">
                  Adjust
                </h4>
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody padding={4}>
                {loader ? (
                  <div className="relative h-32">
                    <MiniLoader />
                  </div>
                ) : (
                  <div className="py-2 px-2 font-norms">
                    <input
                      className="bg-gray-100 rounded-md py-2 px-4 w-full"
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          item: {
                            ...modalData?.item,
                            amount: e.target.value,
                          },
                        })
                      }
                      value={modalData?.item?.amount}
                      type="number"
                    />
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <RedButton
                  onClick={() => {
                    acceptPayouts(
                      modalData?.item?.id,
                      parseFloat(modalData?.item?.amount),
                      "success",
                      modalData?.type
                    );
                  }}
                  text="Done"
                />
              </ModalFooter>
            </ModalContent>
          </Modal>
        </div>
      }
    />
  );
};

export default PayoutTable;
