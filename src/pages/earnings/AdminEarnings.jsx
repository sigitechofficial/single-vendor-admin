import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Layout from "../../components/Layout";
import GetAPI from "../../utilities/GetAPI";
import { PostAPI } from "../../utilities/PostAPI";
import EarningCards from "../../components/EarningCards";
import Loader from "../../components/Loader";
import { info_toaster } from "../../utilities/Toaster";
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
    borderRadius: state.isFocused ? "8px" : 7,
    // boxShadow: state.isFocused ? "0 0 0 1px #ef4444" : null,
    // borderColor: state.isFocused ? "#ef4444" : base.borderColor,
    minWidth: "165px",
    maxWidth: "165px",
  }),
  menu: (base) => ({
    ...base,
    borderRadius: "8px",
    marginTop: 2,
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  }),
  menuList: (base) => ({
    ...base,
    padding: 0,
    borderRadius: "8px",
  }),
  indicatorSeparator: (base) => ({
    ...base,
    display: "none",
  }),
  valueContainer: (base) => ({
    ...base,
    overflow: "hidden",
    flexWrap: "nowrap",
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: "#e2e8f0",
    borderRadius: "4px",
    margin: "1px",
    fontSize: "12px",
    maxWidth: "80px",
  }),
  multiValueLabel: (base) => ({
    ...base,
    fontSize: "11px",
    padding: "2px 4px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "60px",
  }),
  placeholder: (base) => ({
    ...base,
    color: "#9ca3af",
    whiteSpace: "nowrap",
  }),
};

export default function AdminEarnings() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState("");
  const filterOptions = GetAPI("admin/filterOptions");
  const [dates, setDates] = useState(null);
  const [modal, setModal] = useState(false);
  const [dateError, setDateError] = useState("");
  const [filterData, setFilterData] = useState({
    zone: "",
    businessType: "",
    restaurant: [],
    from: "",
    to: "",
    dateType: "",
  });

  const getData = async () => {
    const requestPayload = {
      businessType: filterData?.businessType?.value || "",
      zoneId: filterData?.zone?.value,
      restaurantIds: filterData?.restaurant?.map((item) => item.value) || [],
      from: filterData?.from,
      to: filterData?.to,
    };

    console.log("API Request Payload:", requestPayload);

    let res = await PostAPI("admin/admin_earning", requestPayload);
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

  const [restList, setRestList] = useState([]);
  const [tempSelectedRestaurants, setTempSelectedRestaurants] = useState([]);
  const fetchRestaurants = async (zoneId = null) => {
    const res = await PostAPI("admin/zoneWiseRestaurants", {
      zoneId: zoneId,
      businessType: filterData?.businessType?.value || 1,
    });

    if (res?.data?.status === "1") {
      const restaurants = res.data.data?.data || [];
      const options = [];
      restaurants.forEach((r) => {
        options.push({ value: r.id, label: r.businessName });
      });
      setRestList(options);
    } else {
      setRestList([{ value: null, label: "All Restaurants" }]);
    }
  };

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
    if (dates.startDate && dates?.endDate && !dateError) {
      setFilterData({
        ...filterData,
        from: dates.startDate,
        to: dates?.endDate,
      });
      setDateError(""); // Clear error on successful confirmation
      setModal(false);
    }
  };

  useEffect(() => {
    setFilterData((prev) => ({
      ...prev,
      restaurant: [],
    }));
    setTempSelectedRestaurants([]);

    fetchRestaurants(filterData.zone?.value || null);
  }, [filterData.zone, filterData.businessType]);

  useEffect(() => {
    getData();
  }, [
    filterData?.zone?.value,
    filterData?.restaurant?.length,
    filterData?.businessType?.value,
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
                {t("Admin Earnings")}
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
                  placeholder="Business Type"
                  name=""
                  options={[
                    { value: "", label: "All Business Types" },
                    { value: 1, label: "Restaurant" },
                    { value: 3, label: "Store" },
                  ]}
                  onChange={(e) => {
                    setFilterData({ ...filterData, businessType: e });
                  }}
                  value={filterData?.businessType}
                />
              </div>
              <div>
                <Select
                  styles={customStyles}
                  placeholder="All Restaurants"
                  name="resturant"
                  options={restList}
                  onChange={(e) => {
                    setTempSelectedRestaurants(e);
                  }}
                  value={null}
                  isMulti
                  hideSelectedOptions={false}
                  closeMenuOnSelect={false}
                  //   menuIsOpen={false}
                  components={{
                    Option: ({ children, ...props }) => {
                      const { data, isSelected } = props;
                      const isCurrentlySelected = tempSelectedRestaurants.some(
                        (item) => item.value === data.value
                      );
                      return (
                        <div
                          {...props.innerProps}
                          className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            const isAlreadySelected =
                              tempSelectedRestaurants.some(
                                (item) => item.value === data.value
                              );
                            if (isAlreadySelected) {
                              // Remove from selection
                              setTempSelectedRestaurants(
                                tempSelectedRestaurants.filter(
                                  (item) => item.value !== data.value
                                )
                              );
                            } else {
                              // Add to selection
                              setTempSelectedRestaurants([
                                ...tempSelectedRestaurants,
                                data,
                              ]);
                            }
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isCurrentlySelected}
                            onChange={() => {}}
                            className="mr-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 flex-shrink-0 mt-0.5"
                          />
                          <span className="text-sm leading-relaxed">
                            {children}
                          </span>
                        </div>
                      );
                    },
                    MenuList: ({ children, ...props }) => {
                      return (
                        <div
                          {...props.innerProps}
                          style={{
                            ...props.getStyles("menuList", props),
                            maxHeight: "250px",
                            display: "flex",
                            flexDirection: "column",
                            padding: 0,
                          }}
                        >
                          <div
                            style={{
                              flex: 1,
                              overflowY: "auto",
                              maxHeight: "180px",
                            }}
                          >
                            {children}
                          </div>
                          <div className="border-t border-gray-200 p-2 bg-white sticky bottom-0">
                            <button
                              onClick={() => {
                                setFilterData({
                                  ...filterData,
                                  restaurant: tempSelectedRestaurants,
                                });
                                props.selectProps.onMenuClose();
                              }}
                              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-4 rounded transition duration-150"
                            >
                              Apply
                            </button>
                          </div>
                        </div>
                      );
                    },
                    MultiValueContainer: () => null,
                    Placeholder: ({ children, ...props }) => {
                      return (
                        <div
                          {...props.innerProps}
                          style={props.getStyles("placeholder", props)}
                        >
                          All Restaurants
                        </div>
                      );
                    },
                  }}
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
                          label: dates?.startDate + " to " + dates?.endDate,
                        }
                      : filterData?.dateType
                  }
                  onChange={(e) => {
                    handleDateFilterChange(e);
                  }}
                />
              </div>
              <button className="ms-4 bg-[#f4f4f4] rounded-md border-gray-300 border-[1px] px-4 py-1.5 text-gray-500">
                Download
              </button>
            </div>
          </div>

          {/* Selected Restaurant Tags */}
          {filterData?.restaurant?.length > 0 && (
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                Selected Restaurants ({filterData.restaurant.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {filterData.restaurant.map((restaurant, index) => (
                  <div
                    key={restaurant.value || index}
                    className="flex items-center bg-red-50 border border-red-200 rounded-full px-3 py-1 text-sm"
                  >
                    <span className="text-red-700 font-medium">
                      {restaurant.label}
                    </span>
                    <button
                      onClick={() => {
                        const updatedRestaurants = filterData.restaurant.filter(
                          (_, i) => i !== index
                        );
                        setFilterData({
                          ...filterData,
                          restaurant: updatedRestaurants,
                        });
                        setTempSelectedRestaurants(updatedRestaurants);
                      }}
                      className="ml-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full p-0.5 transition-colors duration-150"
                      title="Remove restaurant"
                    >
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
                {filterData.restaurant.length > 1 && (
                  <button
                    onClick={() => {
                      setFilterData({ ...filterData, restaurant: [] });
                      setTempSelectedRestaurants([]);
                    }}
                    className="flex items-center bg-gray-100 border border-gray-300 rounded-full px-3 py-1 text-sm text-gray-600 hover:bg-gray-200 transition-colors duration-150"
                    title="Clear all restaurants"
                  >
                    <span className="font-medium">Clear All</span>
                    <svg
                      className="w-3 h-3 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="space-y-5">
            <div className="space-y-2">
              <h4 className="text-black text-lg font-bold font-norms">
                {t("Overall Revenue")}
              </h4>
              <div className="grid grid-cols-3 gap-5">
                <EarningCards
                  title={t("Total Revenue Overview")}
                  earning={data?.data?.totalRevenue}
                />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-black text-lg font-bold font-norms">
                {t("Admin Revenue Breakdown by payment method")}
              </h4>

              <div className="grid grid-cols-3 gap-5">
                <EarningCards
                  title={t("Earning from Online Payment")}
                  earning={data?.data?.online}
                />
                <EarningCards
                  title={t("Earning from COD")}
                  earning={data?.data?.COD}
                />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-black text-lg font-bold font-norms">
                {t("Revenue From Service Charges")}
              </h4>

              <div className="grid grid-cols-3 gap-5">
                <EarningCards
                  title={t("Service Charges")}
                  earning={data?.data?.revenuFromServiceCharges}
                />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-black text-lg font-bold font-norms">
                {t("Platform Earnings from Delivery Charges")}
              </h4>

              <div className="grid grid-cols-3 gap-5">
                <EarningCards
                  title={t("Total Delivery Charges Collected")}
                  earning={data?.data?.adminDeliveryCharges}
                />
              </div>
            </div>
          </div>
          <Modal isOpen={isOpen} onClose={onClose} size={"3xl"} isCentered>
            <ModalOverlay />
            <ModalContent borderRadius="16px">
              <ModalHeader padding={0}>
                <p className="font-semibold pl-6 py-3 border-b-[1px] border-gray-400">
                  {t("Filters")}
                </p>
              </ModalHeader>
              <ModalCloseButton
                boxSize="40px"
                borderRadius="full"
                fontWeight="semibold"
                backgroundColor="#f3f4f6"
                _hover={{
                  bg: "gray.200",
                }}
              />
              {/* <ModalBody padding={4}>
                <div className="grid grid-cols-2 gap-x-5 gap-y-8 py-2 px-2 overflow-auto [&>div>h4]:font-semibold [&>div]:space-y-2">
                  <div>
                    <h4>Country</h4>
                    <Select
                      styles={customStyles}
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
                      styles={customStyles}
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
                      styles={{
                        ...customStyles,
                        menuPortal: (base) => ({
                          ...base,
                          zIndex: 1500,
                        }),
                      }}
                      placeholder="Select"
                      name="zones"
                      options={zonesOptions}
                      onChange={(e) => handleChange(e, "zones")}
                      value={selected?.zones}
                      menuPortalTarget={document.body}
                      menuPosition="fixed"
                      menuShouldBlockScroll={true}
                    />
                  </div>
                  <div>
                    <h4>Store Type</h4>
                    <Select
                      styles={customStyles}
                      placeholder="Select"
                      name="storeTypes"
                      options={storeTypesOptions}
                      onChange={(e) => handleChange(e, "storeTypes")}
                      value={selected?.storeTypes}
                      // isDisabled={true}
                    />
                  </div>
                  <div>
                    <h4>Restaurant/Store</h4>
                    <Select
                      styles={customStyles}
                      placeholder="Select"
                      name="restaurant"
                      options={restList}
                      onChange={(e) => handleChange(e, "restaurant")}
                      value={selected?.restaurant}
                    />
                  </div>

                  <div>
                    <h4>From</h4>
                    <input
                      className="bg-[#f4f4f4] outline-none px-3 h-14 w-full rounded-lg"
                      type="date"
                      // onChange={(e) => { setSelected({ ...selected, from: e?.target?.value }); }}
                      onChange={(e) => handleChange(e.target.value, "from")}
                    />
                  </div>
                  <div>
                    <h4>To</h4>
                    <input
                      className="bg-[#f4f4f4] outline-none px-3 h-14 w-full rounded-lg"
                      type="date"
                      // onChange={(e) => { setSelected({ ...selected, to: e?.target?.value });}}
                      onChange={(e) => handleChange(e.target.value, "to")}
                    />
                  </div>
                </div>
              </ModalBody> */}
              {/* <ModalFooter padding={4}>
                <div className="flex gap-1">
                  <BlackButton text={t("Clear filter")} onClick={onClose} />

                  <RedButton text={t("Apply filter")} onClick={getData} />
                </div>
              </ModalFooter> */}
            </ModalContent>
          </Modal>
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
                      max={dates?.endDate || undefined}
                      onChange={(e) => {
                        const selectedStartDate = e.target.value;
                        setDateError(""); // Clear error when user starts typing

                        // Always update the date, don't clear anything
                        setDates({
                          ...dates,
                          startDate: selectedStartDate,
                        });

                        // Only validate if both dates are complete (YYYY-MM-DD format)
                        if (
                          selectedStartDate.length === 10 &&
                          dates?.endDate &&
                          dates.endDate.length === 10 &&
                          selectedStartDate > dates.endDate
                        ) {
                          setDateError(
                            "Start date cannot be later than end date"
                          );
                        }
                      }}
                    />
                    <p className="font-semibold font-switzer">End Date</p>
                    <input
                      className="w-full h-[56px] bg-gray-100 px-4 rounded-lg"
                      type="date"   
                      value={dates?.endDate}
                      min={dates?.startDate || undefined}
                      onChange={(e) => {
                        const selectedEndDate = e.target.value;
                        setDateError(""); // Clear error when user starts typing

                        // Always update the date, don't clear anything
                        setDates({
                          ...dates,
                          endDate: selectedEndDate,
                        });

                        // Only validate if both dates are complete (YYYY-MM-DD format)
                        if (
                          selectedEndDate.length === 10 &&
                          dates?.startDate &&
                          dates.startDate.length === 10 &&
                          selectedEndDate < dates.startDate
                        ) {
                          setDateError(
                            "End date cannot be earlier than start date"
                          );
                        }
                      }}
                    />
                    {dateError && (
                      <p className="text-red-500 text-sm mt-2 font-medium">
                        {dateError}
                      </p>
                    )}
                  </div>
                </div>
              </ModalBody>
              <ModalFooter padding={0}>
                <div className="grid grid-cols-2 px-6 pb-5 gap-x-3 [&>div]:py-2.5 [&>div]:border w-full [&>div]:rounded-md [&>div]:cursor-pointer text-center font-semibold text-xl">
                  <div
                    className="border-black hover:bg-black hover:text-white duration-150"
                    onClick={() => {
                      setDateError(""); // Clear error message on cancel
                      setModal(false);
                    }}
                  >
                    {t("Cancel")}
                  </div>
                  <div
                    onClick={() => {
                      if (!dateError) {
                        handleCustomDateConfirm();
                      }
                    }}
                    className={`border-red-500 text-white hover:bg-white hover:text-red-500 duration-150 ${
                      dateError
                        ? "bg-gray-400 border-gray-400 cursor-not-allowed hover:bg-gray-400 hover:text-white"
                        : "bg-red-500 cursor-pointer"
                    }`}
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
