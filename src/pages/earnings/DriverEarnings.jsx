import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Layout from "../../components/Layout";
import GetAPI from "../../utilities/GetAPI";
import { PostAPI } from "../../utilities/PostAPI";
import EarningCards from "../../components/EarningCards";
import Loader from "../../components/Loader";
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
import { info_toaster } from "../../utilities/Toaster";
import { IoClose } from "react-icons/io5";
import { getDateRange } from "../../utilities/dateRangefilterfunction";

const dateFilters = [
  { value: "allTime", label: "All time" },
  { value: "currentYear", label: "Current Year" },
  { value: "currentMonth", label: "Current Month" },
  { value: "currentWeek", label: "Current Week" },
  { value: "customDate", label: "Custom Date" },
];

const customStyles = {
  control: (base, state) => ({
    ...base,
    background: "#f4f4f4",
    borderRadius: state.isFocused ? "0 0 0 0" : 7,
    boxShadow: state.isFocused ? null : null,
  }),
  menu: (base) => ({
    ...base,
    borderRadius: 0,
    marginTop: 0,
  }),
  menuList: (base) => ({
    ...base,
    padding: 0,
  }),
  indicatorSeparator: (base) => ({
    ...base,
    display: "none",
  }),
};

export default function DriverEarnings() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState("");
  const filterOptions = GetAPI("admin/filterOptions");
  const [dates, setDates] = useState(null);
  const [modal, setModal] = useState(false);
  const [filterData, setFilterData] = useState({
    zone: "",
    driverType: "",
    from: "",
    to: "",
    dateType: "",
  });

  const getData = async () => {
    let res = await PostAPI("admin/driver_earnings", {
      driverType: filterData?.driverType?.value || "",
      zoneId: filterData?.zone?.value,
      from: filterData?.from,
      to: filterData?.to,
    });
    if (res?.data?.status === "1") {
      setData(res?.data);
      setLoading(false);
    } else {
      info_toaster(res?.data?.message);
      setLoading(false);
    }
  };

  let zoneOptions = [
    {
      value: null,
      label: "All zones",
    },
  ];
  filterOptions?.data?.data?.zones?.map((zone) => {
    zoneOptions.push({
      ...zoneOptions,
      value: zone.id,
      label: zone.name,
    });
  });



  const handleDateFilterChange = (e) => {
    if (e.value === "customDate") {
      setModal(true);
      setFilterData({
        ...filterData,
        dateType: e,
      });
      setDates("");
    } else {
      const { startDate, endDate } = getDateRange(e.value, []);

      setFilterData({
        ...filterData,
        dateType: e,
        from: startDate,
        to: endDate,
      });
    }
  };

  const handleCustomDateConfirm = (e) => {
    if (dates.startDate && dates?.endDate) {
      setFilterData({
        ...filterData,
        from: dates.startDate,
        to: dates?.endDate,
      });
      setModal(false);
    }
  };



  useEffect(() => {
    getData();
  }, [
    filterData?.zone?.value,
    filterData?.driverType?.value,
    filterData?.to,
  ]);

  return data?.data?.length === 0 ? (
    <Loader />
  ) : (
    <Layout
      content={
        <div className="bg-themeGray p-5 space-y-5">
          <div className="w-full flex justify-between items-center">
            <div>
              <h2 className="text-themeRed text-lg font-bold font-norms">
                {t("Driver Earnings")}
              </h2>
            </div>
            <div className="flex gap-x-3 items-center">
              <div>
                <Select
                  styles={customStyles}
                  placeholder="All Zone"
                  name=""
                  options={zoneOptions}
                  onChange={(e) => {
                    setFilterData({ ...filterData, zone: e });
                  }}
                  value={filterData?.zone}
                />
              </div>
              <div>
                <Select
                  styles={customStyles}
                  placeholder="Driver Type"
                  name=""
                  options={[
                    { value: "", label: "All Driver Types" },
                    { value: "Restaurant", label: "Restaurant" },
                    { value: "Freelance", label: "Freelance" },
                  ]}
                  onChange={(e) => {
                    setFilterData({ ...filterData, driverType: e });
                  }}
                  value={filterData?.driverType}
                />
              </div>
              <div>
                <Select
                  styles={customStyles}
                  className={
                    dates?.startDate && dates?.endDate ? "w-max" : `w-[150px]`
                  }
                  placeholder="Date Filter"
                  options={dateFilters}
                  value={
                    dates?.startDate &&
                    dates?.endDate &&
                    filterData?.dateType?.value === "customDate"
                      ? {
                          value: "customDate",
                          label: dates?.startDate + "-" + dates?.endDate,
                        }
                      : filterData?.dateType
                  }
                  onChange={(e) => {
                    handleDateFilterChange(e);
                  }}
                />
              </div>
              <button className="bg-[#f4f4f4] rounded-md border-gray-300 border-[1px] px-4 py-1.5 text-gray-500">
                Download
              </button>
            </div>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <h4 className="text-black text-lg font-bold font-norms">
                {t("Overall Delivery Charges")}
              </h4>
              <div className="grid grid-cols-3 gap-5">
                <EarningCards
                  title={t("Total Revenue Overview")}
                  earning={data?.data?.overall_driver_earnings}
                />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-black text-lg font-bold font-norms">
                {t("Components of Drivers Earnings")}
              </h4>

              <div className="grid grid-cols-3 gap-5">
                <EarningCards
                  title={t("Earning from Deliveries")}
                  earning={data?.data?.overall_delivery_fees}
                />
                <EarningCards
                  title={t("Tip Collected")}
                  earning={data?.data?.tip_earning}
                />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-black text-lg font-bold font-norms">
                {t("Drivers Earning Breakdown (gross earning includes tips)")}
              </h4>

              <div className="grid grid-cols-3 gap-5">
                <EarningCards
                  title={t("Drivers Earning (Store Employee)")}
                  earning={data?.data?.store_driver_earning}
                />
                <EarningCards
                  title={t("Freelance Drivers Earning")}
                  earning={data?.data?.freelance_earnings}
                />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-black text-lg font-bold font-norms">
                {t("Cost and Deductions")}
              </h4>

              <div className="grid grid-cols-3 gap-5">
                <EarningCards
                  title={t("Total Admin Commission from Deliveries")}
                  earning={data?.data?.earning_from_delivery_charges}
                />
                <EarningCards
                  title={t(
                    "Admin Commission on Deliveries Done by Store Driver"
                  )}
                  earning={data?.data?.adminCommision_from_restaurant_driver}
                />
                <EarningCards
                  title={t(
                    "Admin Commission on Deliveries Done by Freelance Drivers"
                  )}
                  earning={data?.data?.adminCommision_from_freelancer_driver}
                />
              </div>
            </div>
          </div>
          <Modal
            onClose={() => {
              setModal(false);
            }}
            isOpen={modal}
            size={"lg"}
            isCentered
          >
            <ModalOverlay />
            <ModalContent borderRadius="20px" overflow="hidden">
              <ModalHeader padding={0}></ModalHeader>
              <div
                onClick={() => {
                  setModal(false);
                }}
                className="bg-themeGray hover:bg-gray-200 rounded-full cursor-pointer duration-150 size-10 absolute top-3 right-3 z-20 flex justify-center items-center text-2xl text-black font-black"
              >
                <IoClose size={30} />
              </div>
              <ModalBody padding={4}>
                <div className="w-full">
                  <div className="space-y-3 px-2 mt-14">
                    <p className="font-semibold font-switzer">Start Date</p>
                    <input
                      className="w-full h-[56px] bg-gray-100 px-4 rounded-lg"
                      type="date"
                      value={dates?.startDate}
                      onChange={(e) =>
                        setDates({
                          ...dates,
                          startDate: e.target.value,
                        })
                      }
                    />
                    <p className="font-semibold font-switzer">End Date</p>
                    <input
                      className="w-full h-[56px] bg-gray-100 px-4 rounded-lg"
                      type="date"
                      value={dates?.endDate}
                      onChange={(e) =>
                        setDates({
                          ...dates,
                          endDate: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter padding={0}>
                <div className="grid grid-cols-2 px-6 pb-5 gap-x-3 [&>div]:py-2.5 [&>div]:border w-full [&>div]:rounded-md [&>div]:cursor-pointer text-center font-semibold text-xl">
                  <div
                    className="border-black hover:bg-black hover:text-white duration-150"
                    onClick={() => {
                      setModal(false);
                    }}
                  >
                    {t("Cancel")}
                  </div>
                  <div
                    onClick={() => {
                      handleCustomDateConfirm();
                    }}
                    className="border-red-500 bg-red-500 text-white hover:bg-white hover:text-red-500 duration-150"
                  >
                    {t("Confirm")}
                  </div>
                </div>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </div>
      }
    />
  );
}
