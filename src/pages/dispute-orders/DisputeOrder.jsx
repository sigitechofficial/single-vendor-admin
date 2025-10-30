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
import { FaEye } from "react-icons/fa";

const DisputeOrder = () => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loader, setLoader] = useState(false);
  const [driverSearch, setDriverSearch] = useState("");
  const [modalData, setModalData] = useState({ item: "", type: "" });

  const { data, reFetch } = GetAPI("admin/dispute_orders");
  console.log("🚀 ~ DisputeOrder ~ data:", data);

  const filterData = () => {
    const searchTerm = driverSearch?.toString().trim().toLowerCase();

    if (!searchTerm) return data?.data?.orders || [];

    const filteredData = data?.data?.orders?.filter((item) => {
      return (
        item?.id?.toString().toLowerCase().includes(searchTerm) ||
        item?.orderId?.toString().toLowerCase().includes(searchTerm)
        // item?.restaurantId?.toString().toLowerCase().includes(searchTerm) ||
        // item?.amount?.toString().toLowerCase().includes(searchTerm) ||
        // item?.accountNo?.toString().toLowerCase().includes(searchTerm) ||
        // item?.user?.firstName?.toLowerCase().includes(searchTerm) ||
        // item?.user?.lastName?.toLowerCase().includes(searchTerm) ||
        // item?.user?.id?.toString().toLowerCase().includes(searchTerm)
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

  const columns = [
    { field: "disputeId", header: "disputeId" },
    { field: "orderId", header: "Order ID" },
    { field: "customerName", header: "Customer Name" },
    { field: "vendorName", header: "Restaurant" },
    { field: "createdAt", header: "Created" },
    { field: "issueType", header: "Issue Type" },
    { field: "description", header: "description" },
    { field: "evidence", header: "Evidence" },
    { field: "resolvedBy", header: "resolvedBy" },
    { field: "adminNote", header: "Admin Note" },
    { field: "status", header: "Status" },
    { field: "action", header: "Action" },
  ];

  let datas = [];

  filterData()?.map((item) => {
    datas.push({
      disputeId: item?.id,
      orderId: item?.orderId,
      customerName:
        item?.order?.user?.firstName + " " + item?.order?.user?.lastName,
      vendorName: item?.order?.restaurantId,
      createdAt: dayjs(item?.order?.createdAt).format("DD/MM/YYYY"),
      issueType: "",
      description: item?.reason,
      evidence: "",
      status: "",
      resolvedBy: "",
      adminNote: "",
      action: (
        <FaEye
          size={25}
          className="cursor-pointer hover:text-red-500"
          // onClick={() => setModal(!modal)}
        />
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
                  {t("Dispute Orders")}
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
                <MyDataTable columns={columns} data={datas} />
              </div>
            </div>
          )}

          {/* <Modal isOpen={isOpen} onClose={onClose} size={"sm"} isCentered>
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
          </Modal> */}
        </div>
      }
    />
  );
};

export default DisputeOrder;
