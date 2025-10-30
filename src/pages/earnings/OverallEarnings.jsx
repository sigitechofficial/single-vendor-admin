import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next"; // Import useTranslation
import Layout from "../../components/Layout";
import GetAPI from "../../utilities/GetAPI";
import { PostAPI } from "../../utilities/PostAPI";
import EarningCards from "../../components/EarningCards";
import Loader from "../../components/Loader";
import { IoMdSwap } from "react-icons/io";
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
import RedButton, { BlackButton } from "../../utilities/Buttons";
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
    // borderColor: state.isFocused ? "green" : "gray",
    boxShadow: state.isFocused ? null : null,
    // "&:hover": {
    //     borderColor: state.isFocused ? "red" : "blue",
    // },
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
    display: "none", // Hide the vertical line between the indicator and the control
  }),
};

export default function OverallEarnings() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [apply, setApply] = useState("");
  const [data, setData] = useState("");
  const filterOptions = GetAPI("admin/filterOptions");
  const [dates, setDates] = useState(null);
  const [modal, setModal] = useState(false);
  const [filterData, setFilterData] = useState({
    zone: "",
    restaurant: "",
    businessType: "",
    from: "",
    to: "",
    dateType: "",
  });
  const [selected, setSelected] = useState({
    city: "",
    country: "",
    storeTypes: "",
    zones: { value: null, label: "All Zones" },
    from: "",
    to: "",
  });

  const getData = async () => {
    let res = await PostAPI("admin/all_earnings", {
      businessType: filterData?.businessType?.value || "",
      zoneId: filterData?.zone?.value,
      restaurantId: filterData?.restaurant?.value,
      from: filterData?.from,
      to: filterData?.to,
    });
    if (res?.data?.status === "1") {
      setData(res?.data);
      setLoading(false);
      onClose();
    } else {
      info_toaster(res?.data?.message);
      setLoading(false);
      onClose();
    }
  };

  const cityOptions = [];
  const countryOptions = [];
  const storeTypesOptions = [];
  const zonesOptions = [{ value: null, label: "All Zones" }];
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
    filterOptions?.data?.data?.storeTypes?.map((el, i) => {
      storeTypesOptions.push({
        value: i,
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

  // Fetch restaurants/stores based on both zone and business type
  const fetchRestaurantsStores = async () => {
    const options = [];

    if (
      filterData?.businessType?.value &&
      filterData?.businessType?.value !== ""
    ) {
      // If specific business type is selected, use GetAPI
      const getRest = await fetch(
        `/api/admin/getallrestaurants/${filterData?.businessType?.label}`
      );
      // For now, let's use zone-wise API with business type filter
      try {
        const res = await PostAPI("admin/zoneWiseRestaurants", {
          zoneId: filterData?.zone?.value || null,
          businessType: filterData?.businessType?.value,
        });

        if (res?.data?.status === "1") {
          const businesses = res.data.data?.data || [];
          businesses.forEach((business) => {
            options.push({
              value: business.id,
              label: business.businessName,
            });
          });
        }
      } catch (error) {
        console.error("Error fetching zone-wise businesses:", error);
      }
    } else {
      // If "All Business Types" is selected, fetch both restaurants and stores zone-wise
      try {
        // Fetch restaurants
        const restaurantRes = await PostAPI("admin/zoneWiseRestaurants", {
          zoneId: filterData?.zone?.value || null,
          businessType: "1", // restaurant type
        });

        if (restaurantRes?.data?.status === "1") {
          const restaurants = restaurantRes.data.data?.data || [];
          restaurants.forEach((restaurant) => {
            options.push({
              value: restaurant.id,
              label: restaurant.businessName,
            });
          });
        }

        // Fetch stores
        const storeRes = await PostAPI("admin/zoneWiseRestaurants", {
          zoneId: filterData?.zone?.value || null,
          businessType: "2", // store type
        });

        if (storeRes?.data?.status === "1") {
          const stores = storeRes.data.data?.data || [];
          stores.forEach((store) => {
            options.push({
              value: store.id,
              label: store.businessName,
            });
          });
        }
      } catch (error) {
        console.error("Error fetching zone-wise businesses:", error);
      }
    }

    setRestList(options);
  };

  useEffect(() => {
    fetchRestaurantsStores();
  }, [filterData?.zone?.value, filterData?.businessType?.value]);

  const handleDateFilterChange = (e) => {
    if (e.value === "customDate") {
      setModal(true);
      setFilterData({
        ...filterData,
        dateType: e,
      });
      setDates("");
    } else {
      // Calculate date range for other types
      const { startDate, endDate } = getDateRange(e.value, []);

      setFilterData({
        ...filterData,
        dateType: e,
        from: startDate,
        to: endDate,
      });
    }
  };

  // Confirm handler for custom date modal
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
    // Clear restaurant selection when zone or business type changes
    setFilterData((prev) => ({
      ...prev,
      restaurant: null,
    }));
  }, [filterData?.zone?.value, filterData?.businessType?.value]);

  const handleChange = (e, type) => {
    setSelected({
      ...selected,
      [type]: e,
    });
  };

  const handleSubmit = () => {
    setApply(true);
    toast.success("filter applied");
    setSelected("");
    onClose();
  };

  useEffect(() => {
    getData();
  }, [
    filterData?.zone?.value,
    filterData?.restaurant?.value,
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
                {t("Overall Earnings")}
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
                    { value: "1", label: "restaurant" },
                    { value: "3", label: "store" },
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
                  placeholder={
                    filterData?.businessType?.label === "restaurant"
                      ? "All Restaurants"
                      : filterData?.businessType?.label === "store"
                      ? "All Stores"
                      : "All Restaurants/Stores"
                  }
                  name=""
                  options={restList}
                  onChange={(e) => {
                    setFilterData({ ...filterData, restaurant: e });
                  }}
                  value={filterData?.restaurant}
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
                          label: dates?.startDate + "  /  " + dates?.endDate,
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
                {t("Platform Revenue Breakdown by Payment Method")}
              </h4>

              <div className="grid grid-cols-3 gap-5">
                <EarningCards
                  title={t("Total COD Revenue Collected")}
                  earning={data?.data?.codRevenue}
                />
                <EarningCards
                  title={t("Platform's Earning from COD")}
                  earning={data?.data?.platFormEarningCOD}
                />
                <EarningCards
                  title={t("Total Online Payment Collected")}
                  earning={data?.data?.onlinePaymentCollected}
                />
                <EarningCards
                  title={t("Platform's Earning From Online Payments")}
                  earning={data?.data?.platFormEarningOnline}
                />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-black text-lg font-bold font-norms">
                {t("Admin Revenue Breakdown by Payment Method")}
              </h4>

              <div className="grid grid-cols-3 gap-5">
                <EarningCards
                  title={t("Earning From Online Payment")}
                  earning={data?.data?.adminEarningOnline ?? 0}
                />
                <EarningCards
                  title={t("Earning From COD")}
                  earning={data?.data?.adminEarningCOD}
                />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-black text-lg font-bold font-norms">
                {t("Commission from Store Item Sales")}
              </h4>

              <div className="grid grid-cols-3 gap-5">
                <EarningCards
                  title={t("Subtotal of Items Sales")}
                  earning={data?.data?.admin_Total_deliveryFees}
                />
                <EarningCards
                  title={t("Admin Commissions from Items Sales")}
                  earning={data?.data?.adminComssionFromItemSales}
                />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-black text-lg font-bold font-norms">
                {t("Platform Earnings From Delivery Charges")}
              </h4>

              <div className="grid grid-cols-3 gap-5">
                <EarningCards
                  title={t("Total Delivery Charges Collected")}
                  earning={data?.data?.admin_Total_deliveryFees}
                />
                <EarningCards
                  title={t("Total Delivery Fee Paid to Drivers")}
                  earning={data?.data?.admin_Total_deliveryFees}
                />
                <EarningCards
                  title={t("Admin commission From Delivery fee")}
                  earning={data?.data?.adminDeliveryCharges}
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
                <EarningCards
                  title={t("Packaging Fee (Stores)")}
                  earning={data?.data?.packingFee}
                />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-black text-lg font-bold font-norms">
                {t("Cost")}{" "}
                <span className="text-gray-500 text-sm">
                  &#40;{t("Deduction from Admin's Earning")}&#41;
                </span>
              </h4>

              <div className="grid grid-cols-3 gap-5">
                <EarningCards
                  title={t("Discounts and Promotional Costs")}
                  earning={parseFloat(data?.data?.cost)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-black text-lg font-bold font-norms">
                {t("Driver Earnings")}
              </h4>

              <div className="grid grid-cols-3 gap-5">
                <EarningCards
                  title={t("Total Earnings of Drivers")}
                  earning={data?.data?.driverEarnings}
                />
                <EarningCards
                  title={t("Earning Made by Store through Drivers")}
                  earning={data?.data?.admin_Total_deliveryFees}
                />
                <EarningCards
                  title={t("Earnings of Freelance-Drivers")}
                  earning={data?.data?.freelanceDriverEarnings}
                />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-black text-lg font-bold font-norms">
                {t("Payment Owed by Store to Admin")}
              </h4>

              <div className="grid grid-cols-3 gap-5">
                <EarningCards
                  title={t("Net Amount Owed to Restaurants")}
                  earning={data?.data?.StoreToAdmin}
                />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-black text-lg font-bold font-norms">
                {t("Payment Owned by Admin to Store")}
              </h4>

              <div className="grid grid-cols-3 gap-5">
                <EarningCards
                  title={t("Net Amount Owned to Admin")}
                  earning={data?.data?.adminToStore}
                />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-black text-lg font-bold font-norms">
                {t("COD Commission and Payments to Platform")}
              </h4>

              <div className="grid grid-cols-3 gap-5">
                <EarningCards
                  title={t("Total Commissions from COD")}
                  earning={data?.data?.admin_Total_deliveryFees}
                />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-black text-lg font-bold font-norms">
                {t("Gross Store Earnings")}
              </h4>

              <div className="grid grid-cols-3 gap-5">
                <EarningCards
                  title={t("Overall Store Earnings")}
                  earning={data?.data?.grossStoreEarning}
                />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-black text-lg font-bold font-norms">
                {t("Store Earning Breakdown by Payment Method")}
              </h4>

              <div className="grid grid-cols-3 gap-5">
                <EarningCards
                  title={t("Earning Through COD")}
                  earning={data?.data?.admin_Total_deliveryFees}
                />
                <EarningCards
                  title={t("Earning Through Online Payment")}
                  earning={data?.data?.admin_Total_deliveryFees}
                />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-black text-lg font-bold font-norms">
                {t("Breakdown of Store Earning by Revenue Component")}
              </h4>

              <div className="grid grid-cols-3 gap-5">
                <EarningCards
                  title={t("Item Sales")}
                  earning={data?.data?.admin_Total_deliveryFees}
                />
                <EarningCards
                  title={t("Packing fee")}
                  earning={data?.data?.admin_Total_deliveryFees}
                />
                <EarningCards
                  title={t("Self Delivery")}
                  earning={data?.data?.admin_Total_deliveryFees}
                />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-black text-lg font-bold font-norms">
                {t("Commission from Stores Earnings")}
              </h4>

              <div className="grid grid-cols-3 gap-5">
                <EarningCards
                  title={t("Item Sales")}
                  earning={data?.data?.admin_Total_deliveryFees}
                />
                <EarningCards
                  title={t("Packing fee")}
                  earning={data?.data?.admin_Total_deliveryFees}
                />
                <EarningCards
                  title={t("Self Delivery")}
                  earning={data?.data?.admin_Total_deliveryFees}
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
              <ModalBody padding={4}>
                <div className="grid grid-cols-2 gap-x-5 gap-y-8 py-2 px-2 overflow-auto [&>div>h4]:font-semibold [&>div]:space-y-2">
                  <div>
                    <h4>Country</h4>
                    <Select
                      styles={customStyles}
                      placeholder="Select"
                      name="country"
                      options={countryOptions}
                      // onChange={(e) => {setSelected({ ...selected, country: { value: e?.value, label: e?.label } });}}
                      onChange={(e) => handleChange(e, "country")}
                      value={selected?.country}
                      isDisabled={true}
                    />
                  </div>
                  <div>
                    <h4>City</h4>
                    <Select
                      styles={customStyles}
                      placeholder="Select"
                      name="city"
                      options={cityOptions}
                      // onChange={(e) => {setSelected({ ...selected, city: { value: e?.value, label: e?.label } });}}
                      onChange={(e) => handleChange(e, "city")}
                      value={selected?.city}
                      isDisabled={true}
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
                      //   options={zonesOptions}
                      // onChange={(e) => { setSelected({ ...selected, zones: { value: e?.value, label: e?.label } }); }}
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
                      // onChange={(e) => {setSelected({ ...selected, storeTypes: { value: e?.value, label: e?.label } });}}
                      onChange={(e) => handleChange(e, "storeTypes")}
                      value={selected?.storeTypes}
                      isDisabled={true}
                    />
                  </div>
                  {/* <div>
                    <h4>Food cusines</h4>
                    <Select
                      styles={customStyles}
                      placeholder="Select"
                      name="distanceUnitId"
                      options={[{
                        value: 1,
                        label: "Current Year",
                      }]}
                    />
                  </div>
                  <div>
                    <h4>Store categories</h4>
                    <Select
                      styles={customStyles}
                      placeholder="Select"
                      name="distanceUnitId"
                      options={[{
                        value: 2,
                        label: "Current Month",
                      }]}
                    />
                  </div> */}
                  <div>
                    <h4>From</h4>
                    <input
                      className="bg-[#f4f4f4] outline-none px-3 h-14 w-full rounded-lg"
                      type="date"
                      // onChange={(e) => { setSelected({ ...selected, from: e?.target?.value }); }}
                      onChange={(e) => handleChange(e.target.value, "from")}
                      disabled={true}
                    />
                  </div>
                  <div>
                    <h4>To</h4>
                    <input
                      className="bg-[#f4f4f4] outline-none px-3 h-14 w-full rounded-lg"
                      type="date"
                      // onChange={(e) => { setSelected({ ...selected, to: e?.target?.value });}}
                      onChange={(e) => handleChange(e.target.value, "to")}
                      disabled={true}
                    />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter padding={4}>
                <div className="flex gap-1">
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
