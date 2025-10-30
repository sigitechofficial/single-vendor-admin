import React, { useState } from "react";
import Layout from "../../components/Layout";
import Helment from "../../components/Helment";
import RedButton, { BlackButton, EditButton } from "../../utilities/Buttons";
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
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import GetAPI from "../../utilities/GetAPI";
import { PutAPI } from "../../utilities/PutAPI";
import { PostAPI } from "../../utilities/PostAPI";
import Loader, { MiniLoader } from "../../components/Loader";
import Switch from "react-switch";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { error_toaster, success_toaster } from "../../utilities/Toaster";

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    minHeight: "40px",
    backgroundColor: "#f4f4f4",
    border: 0,
  }),
};

export default function Payoutrequest() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data, reFetch } = GetAPI("admin/allpayoutrequest");
  const { data: allRestaurants } = GetAPI("admin/getallrestaurants");
  const { data: allDrivers } = GetAPI("admin/activeDrivers");
  const [modal, setModal] = useState(false);
  const [loader, setLoader] = useState(false);
  const [search, setSearch] = useState("");
  const [payoutRequestData, setPayoutRequestData] = useState({
    userType: "",
    id: "",
    note: "",
    amount: "",
    user: "",
  });

  const businessOptions = [];
  const business =
    payoutRequestData?.userType?.value === 1 ? allRestaurants : allDrivers;

  business?.data?.map((item) => {
    businessOptions.push({
      value: item?.id,
      label:
        payoutRequestData?.userType?.value === 1
          ? item?.businessName
          : item?.firstName + " " + item?.lastName,
    });
  });

  const addOnCollectionData = () => {
    const filteredData = data?.data?.list?.filter((dat) => {
      return (
        search === "" ||
        (dat?.id && dat?.id.toString().includes(search.toLowerCase())) ||
        (dat?.restaurant &&
          dat?.restaurant.toLowerCase().includes(search.toLowerCase())) ||
        (dat?.title && dat?.title.toLowerCase().includes(search.toLowerCase()))
      );
    });
    return filteredData;
  };

  const handleStatus = async (id, status) => {
    const details = {
      id: id,
      status: status ? false : true,
    };
    const res = await PutAPI("admin/changeCollectionStatus", details);
    if (res.data.status === "1") {
      reFetch("admin/addOnCategoryRest");
      toast.success(res.data.message);
    } else {
      toast.error(res.data.message);
    }
  };

  const createPayoutRequest = async () => {
    setLoader(true);
    let res = await PostAPI("admin/createDriverPayout", {
      userType:
        payoutRequestData?.userType?.value == 1 ? "restaurant" : "driver",
      id: payoutRequestData?.user?.value,
      note: payoutRequestData?.note,
      amount: payoutRequestData?.amount,
    });

    if (res?.data?.status === "1") {
      success_toaster(res?.data?.message);
      setLoader(false);
      setModal(false);
    } else {
      error_toaster(res?.data?.message);
      setLoader(false);
    }
  };

  const columns = [
    { field: "sn", header: t("Serial No") },
    { field: "amount", header: t("Amount") },
    { field: "transactionId", header: t("Transaction ID") },
    { field: "CreatedAt", header: t("Created At") },
    { field: "status", header: t("Status") },
    { field: "action", header: t("Action") },
  ];

  const datas = [];
  addOnCollectionData()?.map((values, index) => {
    return datas.push({
      sn: index + 1,
      amount: values?.title,
      transactionId: values?.restaurant,
      minAllowed: values?.minAllowed,
      maxAllowed: values?.maxAllowed,
      status: (
        <div>
          {values?.status ? (
            <div
              className="bg-[#21965314] text-themeGreen font-semibold p-2 rounded-md flex 
              justify-center"
            >
              {t("Active")}
            </div>
          ) : (
            <div
              className="bg-[#EE4A4A14] text-themeRed font-semibold p-2 rounded-md flex 
              justify-center"
            >
              {t("Inactive")}
            </div>
          )}
        </div>
      ),
      action: (
        <div className="flex items-center gap-3">
          <label>
            <Switch
              onChange={() => {
                handleStatus(values?.id, values.status);
              }}
              checked={values?.status}
              uncheckedIcon={false}
              checkedIcon={false}
              onColor="#139013"
              onHandleColor="#fff"
              className="react-switch"
              boxShadow="none"
            />
          </label>
          {/* <EditButton text={t("View Details")} /> */}
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
          <div className="bg-white rounded-lg p-5 h-screen">
            <div className="flex justify-between items-center flex-wrap gap-5">
              <h2 className="text-themeRed text-lg font-bold font-norms">
                {t("Payout")}
              </h2>
              <div className="flex gap-2 items-center flex-wrap">
                <Helment
                  search={true}
                  searchOnChange={(e) => setSearch(e.target.value)}
                  searchValue={search}
                  csvdata={datas}
                />
                <div className="flex gap-2">
                  {/* <BlackButton text={t("Roles & Permissions")} /> */}
                  <RedButton text={t("+ Payout Request")} onClick={onOpen} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 [&>div]:bg-gray-100 [&>div]:rounded-md [&>div]:p-4 [&>div]:cursor-pointer font-norms gap-5 mt-10">
              <div
                className="relative before:hidden hover:before:block before:content-['click'] before:text-white before:w-10 before:h-10 before:absolute before:pt-2 before:pl-1 before:opacity-40 before:bottom-3 before:rounded-full before:right-3 before:bg-red-400 before:z-[1] "
                onClick={() => navigate("/payout-table")}
              >
                <p className="text-gray-600 text-lg">
                  Total Payout Requests Due
                </p>
                <h4 className="text-4xl font-medium my-8">20</h4>
              </div>
              <div
                className="relative before:hidden hover:before:block before:content-['click'] before:text-white before:w-10 before:h-10 before:absolute before:pt-2 before:pl-1 before:opacity-40 before:bottom-3 before:rounded-full before:right-3 before:bg-red-400 before:z-[1] "
                onClick={() => navigate("/manual-request")}
              >
                <p className="text-gray-600 text-lg">Pending Manual Requests</p>
                <h4 className="text-4xl font-medium my-8">5</h4>
              </div>
              <div
                className="relative before:hidden hover:before:block before:content-['click'] before:text-white before:w-10 before:h-10 before:absolute before:pt-2 before:pl-1 before:opacity-40 before:bottom-3 before:rounded-full before:right-3 before:bg-red-400 before:z-[1] "
                onClick={() => navigate("/auto-request")}
              >
                <p className="text-gray-600 text-lg">
                  Pending Automatic Requests
                </p>
                <h4 className="text-4xl font-medium my-8">10</h4>
              </div>
              <div>
                <p className="text-gray-600 text-lg">Next Automatic Payout</p>
                <h4 className="text-4xl font-medium my-8">Sunday 8, 2024</h4>
              </div>
              <div>
                <p className="text-gray-600 text-lg">Total Due Payout Amount</p>
                <h4 className="text-4xl font-medium my-8">CHF 2000</h4>
              </div>
              <div>
                <p className="text-gray-600 text-lg">
                  Pending Manual Requests Amount
                </p>
                <h4 className="text-4xl font-medium my-8">CHF 5000</h4>
              </div>
              <div>
                <p className="text-gray-600 text-lg">
                  Pending Automatic Requests Amount
                </p>
                <h4 className="text-4xl font-medium my-8">CHF 1000</h4>
              </div>
            </div>
          </div>

          <Modal isOpen={isOpen} onClose={onClose} size={"xl"} isCentered>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader padding={0}>
                <div className="border-b-2 border-b-[#0000001F] px-5 py-2.5 text-lg font-norms font-medium">
                  {t("Payout Request")}
                </div>
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody padding={4}>
                {loader ? (
                  <div className="relative h-32">
                    <MiniLoader />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-1">
                      <label
                        htmlFor="firstName"
                        className="text-black font-switzer font-semibold"
                      >
                        {t("User Type")}
                      </label>
                      <div>
                        <Select
                          styles={customStyles}
                          placeholder="Restaurant/Driver"
                          name="userType"
                          options={[
                            {
                              value: 1,
                              label: "Restaurant",
                            },
                            {
                              value: 2,
                              label: "Driver",
                            },
                          ]}
                          onChange={(e) => {
                            setPayoutRequestData({
                              ...payoutRequestData,
                              userType: e,
                            });
                          }}
                          value={payoutRequestData?.userType}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label
                        htmlFor="lastName"
                        className="text-black font-switzer font-semibold"
                      >
                        {t("Amount")}
                      </label>
                      <input
                        type="number"
                        name="lastName"
                        id="lastName"
                        className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                        onChange={(e) => {
                          setPayoutRequestData({
                            ...payoutRequestData,
                            amount: e.target.value,
                          });
                        }}
                        value={payoutRequestData?.amount}
                      />
                    </div>

                    <div className="space-y-1">
                      <label
                        htmlFor="note"
                        className="text-black font-switzer font-semibold"
                      >
                        {t("Note")}
                      </label>
                      <input
                        type="text"
                        name="note"
                        id="note"
                        className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                        onChange={(e) => {
                          setPayoutRequestData({
                            ...payoutRequestData,
                            note: e.target.value,
                          });
                        }}
                        value={payoutRequestData?.note}
                      />
                    </div>

                    <div className="space-y-1">
                      <label
                        htmlFor="firstName"
                        className="text-black font-switzer font-semibold"
                      >
                        {t(
                          `${
                            payoutRequestData?.userType?.value === 1
                              ? "Restaurant"
                              : payoutRequestData?.userType?.value === 2
                              ? "Driver"
                              : "Restaurant/Driver"
                          }`
                        )}
                      </label>
                      <div>
                        <Select
                          styles={customStyles}
                          placeholder="Restaurant/Driver"
                          name="userType"
                          options={businessOptions}
                          onChange={(e) => {
                            setPayoutRequestData({
                              ...payoutRequestData,
                              user: e,
                            });
                          }}
                          value={payoutRequestData?.user}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter padding={4}>
                <div className="flex gap-2">
                  <BlackButton text={t("Cancel")} onClick={onClose} />
                  <RedButton
                    text={t("Create")}
                    onClick={() => {
                      createPayoutRequest();
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
