import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { FaArrowLeft } from "react-icons/fa6";
import { TabButton } from "../../utilities/Buttons";
import ReportsCard from "../../components/ReportsCard";
import Loader from "../../components/Loader";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import ReportsRedCard from "../../components/ReportsRedCard";
import Barchart from "../../components/Barchart";
import Dounut from "../../components/Dounut";
import Helment from "../../components/Helment";
import MyDataTable from "../../components/MyDataTable";
import { Calendar } from "primereact/calendar";
import GetAPI from "../../utilities/GetAPI";
import { FaEye } from "react-icons/fa";
import { PostAPI } from "../../utilities/PostAPI";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { getDateRange } from "../../utilities/dateRangefilterfunction";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { IoClose } from "react-icons/io5";

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

const ReportsByStore = () => {
  const navigate = useNavigate();
  const [data, setData] = useState("");
  const [orderReports, setOrderReports] = useState("");
  const filterOptions = GetAPI("admin/filterOptions");
  const [search, setSearch] = useState("");
  const [dates, setDates] = useState(null);
  const { t } = useTranslation();
  const [tab, setTab] = useState("Summary Report");
  const [modal, setModal] = useState(false);
  const [filterData, setFilterData] = useState({
    zone: "",
    restaurant: "",
    from: "",
    to: "",
    dateType: "",
  });

  const label = data?.data?.graphData?.map((obj) => Object.keys(obj)[0]);
  const values = data?.data?.graphData?.map((obj) => Object.values(obj)[0]);

  const getOrderReports = async () => {
    let res = await PostAPI("admin/restOrderReports", {
      businessType: 3,
      zoneId: filterData?.zone?.value,
      restaurantId: filterData?.restaurant?.value,
      from: filterData?.from,
      to: filterData?.to,
    });

    if (res?.data?.status === "1") {
      setOrderReports(res?.data?.data);
    } else {
      setOrderReports("");
    }
  };

  const getData = async () => {
    let res = await PostAPI("admin/storeAnalytics", {
      businessType: "store",
      zoneId: filterData?.zone?.value,
      restaurantId: filterData?.restaurant?.value,
      from: filterData?.from,
      to: filterData?.to,
    });

    if (res?.data?.status === "1") {
      setData(res?.data);
    } else {
      setData("");
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

  const restList = [{ value: null, label: "All Stores" }];
  const getRest = GetAPI("admin/getallrestaurants/store");
  getRest?.data?.data?.map((el) => {
    restList.push({
      ...restList,
      value: el.id,
      label: el.businessName,
    });
  });

  const datas = [];
  if (tab === "Summary Report") {
    var columns = [
      { field: "sn", header: t("SL") },
      {
        field: "storeName",
        header: t("storeName"),
      },
      {
        field: "totalOrders",
        header: t("Total Orders"),
      },
      {
        field: "totaldeliveredOrders",
        header: t("Delivered Orders"),
      },
      {
        field: "totalAmount",
        header: t("Total Amount"),
      },
      {
        field: "completionRate",
        header: t("Completion Rate"),
      },
      {
        field: "deliveryOrders",
        header: t("Delivery Orders"),
      },
      {
        field: "ongoingRate",
        header: t("Ongoing Rate"),
      },
      {
        field: "delivered",
        header: t("Delivered %"),
      },
      {
        field: "cancelation",
        header: t("Cancelation Order"),
      },
      {
        field: "refundRequest",
        header: t("Refund Request"),
      },
    ];

    data?.data?.summary?.map((item, idx) => {
      datas.push({
        sn: idx + 1,
        storeName: item?.restaurantName,
        totalOrders: item?.totalOrders,
        totaldeliveredOrders: item?.deliveredOrders,
        totalAmount: "",
        completionRate: "",
        deliveryOrders: item?.deliveryOrders,
        ongoingRate: "",
        delivered: item?.deliveredOrders,
        cancelation: item?.cancelledOrders,
        refundRequest: "",
      });
    });
  } else if (tab === "Sales Reports") {
    var columns = [
      { field: "sn", header: t("serialNo") },
      {
        field: "product",
        header: t("Product"),
      },
      {
        field: "qty",
        header: t("quantity"),
      },
      {
        field: "grossSale",
        header: t("Gross Sale"),
      },
      {
        field: "discountGiven",
        header: t("Discount Given"),
      },

      {
        field: "action",
        header: t("Action"),
      },
    ];
    data?.data?.salesReport?.products?.map((item, idx) => {
      const currencyUnit =
        item?.R_MCLink?.restaurant?.zoneRestaurant?.zone.zoneDetail
          ?.currencyUnit?.symbol;
      datas.push({
        sn: idx + 1,
        product: item?.name,
        qty: item?.sold,
        grossSale:
          currencyUnit +
          " " +
          parseFloat(item?.originalPrice) * parseFloat(item?.sold),
        discountGiven: currencyUnit + " " + item?.discountValue,
        action: (
          <FaEye
            size={25}
            className="cursor-pointer hover:text-red-500"
            onClick={() =>
              navigate("/product-detail", { state: { id: item?.id } })
            }
          />
        ),
      });
    });
  } else {
    var columns = [
      { field: "sn", header: t("serialNo") },
      {
        field: "orderId",
        header: t("Order Id"),
      },
      {
        field: "orderDate",
        header: t("Order Date"),
      },
      {
        field: "customerInfo",
        header: t("Customer Info"),
      },

      {
        field: "totalAmount",
        header: t("Total Amount"),
      },
      {
        field: "discount",
        header: t("Discount"),
      },
      {
        field: "tax",
        header: t("Tax"),
      },
      {
        field: "deliveryCharge",
        header: t("Delivery Charge"),
      },
      {
        field: "additionalCharge",
        header: t("Additional Charge"),
      },
      {
        field: "paymentMethod",
        header: t("Payment Method"),
      },
    ];

    orderReports?.orders?.map((item, index) => {
      const currency =
        item?.restaurant.zoneRestaurant.zone.zoneDetail.currencyUnit.symbol;
      datas.push({
        sn: index + 1,
        orderId: item.id,
        orderDate: dayjs(item.createdAt).format("DD/MM/YYYY"),
        customerInfo: item?.user?.firstName + " " + item?.user?.lastName,
        averageorderValue: "N/A",
        totalAmount: currency + " " + item?.orderCharge?.basketTotal,
        discount: currency + " " + item?.bannerDiscount,
        tax: "N/A",
        deliveryCharge: currency + " " + item?.orderCharge?.deliveryFees,
        additionalCharge: currency + " " + item?.orderCharge?.extraCharges,
        paymentMethod: item?.paymentMethodName,
      });
    });
  }

  useEffect(() => {
    getData();
    getOrderReports();
  }, [filterData?.zone?.value, filterData?.restaurant?.value, filterData?.to]);

  return (
    <Layout
      content={
        <div className="bg-themeGray p-5 space-y-5">
          <div className="flex gap-5 items-center">
            <button
              className="bg-white p-2 rounded-full"
              onClick={() => window.history.back()}
            >
              <FaArrowLeft />
            </button>
            <div className="w-full flex justify-between items-center">
              <div>
                <h2 className="text-themeRed text-lg font-bold font-norms">
                  {t("Store Reports")}
                </h2>
                <p>Monitor Store's business analytics & reports</p>
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
                    placeholder="All Stores"
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
                    placeholder="All time"
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
          </div>

          <div className="space-y-1.5">
            <ul className="flex flex-wrap items-center gap-8">
              <TabButton
                title={t("Summary Report")}
                tab={tab}
                onClick={() => setTab("Summary Report")}
              />
              <TabButton
                title={t("Sales Reports")}
                tab={tab}
                onClick={() => setTab("Sales Reports")}
              />
              <TabButton
                title={t("Order Reports")}
                tab={tab}
                onClick={() => setTab("Order Reports")}
              />
            </ul>
            <div className={`w-full bg-[#00000033] h-[1px]`}></div>
          </div>

          {tab === "Summary Report" ? (
            <>
              <div className="grid grid-cols-12 gap-5">
                {!filterData?.restaurant?.value && (
                  <div className="col-span-3 space-y-5">
                    <ReportsRedCard
                      total={data?.data?.totalStores}
                      title={t("Total Registered")}
                      image="store"
                      tab={tab}
                    />
                  </div>
                )}
                <div
                  className={
                    filterData?.restaurant?.value ? "col-span-6" : `col-span-3`
                  }
                >
                  <ReportsRedCard
                    // total={graphData?.data?.data?.summary_reports?.newItems}
                    title={t("New Items")}
                    image="store"
                    tab={tab}
                  />
                </div>
                <div className="col-span-6 grid grid-cols-12 gap-5  bg-red-200 rounded-md">
                  <div className="col-span-6 flex items-center">
                    <div className="flex-1 flex justify-center">
                      <img
                        className="w-20 h-20 object-contain"
                        src="/images/report.webp"
                        alt="reports"
                      />
                    </div>
                    <div className="flex-1 flex flex-col gap-y-4">
                      <div className="text-3xl font-medium text-center font-norms">
                        {data?.data?.totalOrders}
                      </div>
                      <div className="text-lg font-medium text-center font-norms">
                        Total Orders
                      </div>
                    </div>
                  </div>
                  <div className="col-span-6 grid grid-cols-2 py-4 items-center justify-items-center [&>div]:text-center  [&>div]:font-norms [&>div]:font-medium  [&>div>p]:text-2xl">
                    <div>
                      <p className="text-green-500">
                        {" "}
                        {data?.data?.deliveredCount}
                      </p>
                      <h4 className="text-sm">Completed</h4>
                    </div>
                    <div>
                      <p className="text-blue-600">
                        {data?.data?.incompleteCount}
                      </p>
                      <h4 className="text-sm">Incompleted</h4>
                    </div>
                    <div>
                      <p className="text-red-500">
                        {data?.data?.rejectedCount}
                      </p>
                      <h4 className="text-sm">Rejected</h4>
                    </div>
                    <div>
                      <p className="text-orange-600">
                        {data?.data?.scheduledCount}
                      </p>
                      <h4 className="text-sm">Schedule</h4>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-12 gap-x-5">
                <div className="col-span-9 bg-red-100 rounded-md p-10">
                  <Barchart label={label} value={values} />
                </div>
                <div className="col-span-3 bg-red-100 rounded-md p-10 font-norms">
                  <h4 className="text-xl font-bold">
                    Completed Payment Statistics
                  </h4>
                  <p className="font-medium text-sm my-3">
                    See how your customer paid you
                  </p>
                  <div className="my-10">
                    <Dounut />
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold font-norms text-xl text-themeRed">
                    Total Stores
                  </h4>
                  <div>
                    <Helment
                      search={true}
                      searchOnChange={(e) => setSearch(e.target.value)}
                      searchValue={search}
                      csvdata={[{ a: "sd", s: "ffs" }]}
                    />
                  </div>
                </div>
                <div>
                  <MyDataTable columns={columns} data={datas} />
                </div>
              </div>
            </>
          ) : tab === "Sales Reports" ? (
            <>
              <div className="grid grid-cols-12 gap-5">
                <div className="col-span-4 space-y-5">
                  <ReportsRedCard
                    total={data?.data?.salesReport?.grossSale}
                    title={t("Gross Sale")}
                    image="home-1"
                    tab={tab}
                  />
                </div>
                <div className="col-span-4 space-y-5">
                  <ReportsRedCard
                    total="10.00CHF"
                    title={t("Total Tax")}
                    image="home-1"
                    tab={tab}
                  />
                </div>
                <div className="col-span-4 space-y-5">
                  <ReportsRedCard
                    total="67.00CHF"
                    title={t("Total Commission")}
                    image="home-1"
                    tab={tab}
                  />
                </div>
              </div>

              <div className="grid grid-cols-12 gap-x-5">
                <div className="col-span-9 bg-red-100 rounded-md p-10">
                  <Barchart label={label} value={values} />
                </div>
                <div className="col-span-3 bg-red-100 rounded-md p-10 font-norms">
                  <h4 className="text-xl font-bold">Total Store Earnings</h4>
                  <p className="font-medium text-sm my-3">
                    See your store earning statistics
                  </p>
                  <div className="my-10">
                    <Dounut />
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold font-norms text-xl text-themeRed">
                    Total Sales ( Product )
                  </h4>
                  <div>
                    <Helment
                      search={true}
                      searchOnChange={(e) => setSearch(e.target.value)}
                      searchValue={search}
                      csvdata={[{ a: "sd", s: "ffs" }]}
                    />
                  </div>
                </div>
                <div>
                  <MyDataTable columns={columns} data={datas} />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-12 gap-5">
                <div className="col-span-4 space-y-5">
                  <ReportsRedCard
                    total={orderReports?.reports?.totalOrders}
                    title={t("Total Orders")}
                    image="home-1"
                    tab={tab}
                  />
                </div>
                <div className="col-span-4 flex flex-col justify-center items-between bg-red-200 rounded-md px-6 gap-y-6">
                  {/* <ReportsRedCard
                                        total="10.00CHF"
                                        title={t("Total Order Amount")}
                                        image="home-1"
                                        tab={tab}
                                    /> */}
                  <div className="flex w-full justify-center items-center">
                    <div className="w-24">
                      <img
                        className="object-contain"
                        src="/images/home-1.webp"
                        alt=""
                      />
                    </div>
                    <div className="text-center w-full space-y-2">
                      <p className="text-3xl font-medium text-center font-norms">
                        {orderReports?.reports?.totalOrderAmount}
                      </p>
                      <p className="text-lg font-medium text-center font-norms">
                        Total Order Amount
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center [&>div]:font-medium [&>div]:text-center [&>div]:font-norms">
                    <div>
                      <p className="text-green-600">0</p>
                      <p>Complete</p>
                    </div>
                    <div>
                      <p className="text-blue-600">0</p>
                      <p>Incomplete</p>
                    </div>
                    <div>
                      <p className="text-red-500">0</p>
                      <p>Cancelled</p>
                    </div>
                  </div>
                </div>
                <div className="col-span-4 flex flex-col justify-center items-between bg-red-200 rounded-md px-6 gap-y-6">
                  {/* <ReportsRedCard
                                        total="10.00CHF"
                                        title={t("Total Order Amount")}
                                        image="home-1"
                                        tab={tab}
                                    /> */}
                  <div className="flex w-full justify-center items-center">
                    <div className="w-24">
                      <img
                        className="object-contain"
                        src="/images/home-1.webp"
                        alt=""
                      />
                    </div>
                    <div className="text-center w-full space-y-2">
                      <p className="text-3xl font-medium text-center font-norms">
                        {orderReports?.reports?.totalDiscount}
                      </p>
                      <p className="text-lg font-medium text-center font-norms">
                        Total Discount Given
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center [&>div]:font-medium [&>div]:text-center [&>div]:font-norms">
                    <div>
                      <p className="text-green-600">0</p>
                      <p>Coupon Discount</p>
                    </div>

                    <div>
                      <p className="text-blue-600">0</p>
                      <p>Product Discount</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-x-5">
                <div className="col-span-9 bg-red-100 rounded-md p-10">
                  <Barchart label={label} value={values} />
                </div>
                <div className="col-span-3 bg-red-100 rounded-md p-10 font-norms">
                  <h4 className="text-xl font-bold">Order Types</h4>
                  <p className="font-medium text-sm my-3">
                    Distribution of all successfull orders for both pickup and
                    delivery
                  </p>
                  <div className="my-10">
                    <Dounut />
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold font-norms text-xl text-themeRed">
                    Total Sales
                  </h4>
                  <div>
                    <Helment
                      search={true}
                      searchOnChange={(e) => setSearch(e.target.value)}
                      searchValue={search}
                      csvdata={[{ a: "sd", s: "ffs" }]}
                    />
                  </div>
                </div>
                <div>
                  <MyDataTable columns={columns} data={datas} />
                </div>
              </div>
            </>
          )}

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
                      setFilterSearch({
                        ...filterSearch,
                        // dateType: { value: "allTime", label: "All time" },
                        startDate: null,
                        endDate: null,
                      });

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
};

export default ReportsByStore;
