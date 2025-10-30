import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { FaArrowLeft } from "react-icons/fa6";
import { TabButton } from "../../utilities/Buttons";
import ReportsCard from "../../components/ReportsCard";
import { DonutChart } from "../../components/DonutChart";
import GetAPI from "../../utilities/GetAPI";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Select from "react-select";
import { Line } from "react-chartjs-2";
import Loader from "../../components/Loader";
import { useTranslation } from "react-i18next";
import { PostAPI } from "../../utilities/PostAPI";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
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

export default function StoreReport() {
  const filterOptions = GetAPI("admin/filterOptions");
  const [dates, setDates] = useState(null);
  const [modal, setModal] = useState(false);
  const [tab, setTab] = useState("Summary Report");
  const [graphData, setGraphData] = useState("");
  const [filterData, setFilterData] = useState({
    zone: "",
    restaurant: "",
    from: "",
    to: "",
    dateType: "",
  });
  // const graphData = GetAPI("admin/storeReports");
  const { t } = useTranslation();
  // Doughnut Chart Data
  const sumDelivery =
    (parseInt(graphData?.data?.data?.summary_reports?.deliveredOrders) * 100) /
    parseInt(graphData?.data?.data?.summary_reports?.totalOrders);

  const sumPickup =
    (parseInt(graphData?.data?.data?.summary_reports?.pickupOrders) * 100) /
    parseInt(graphData?.data?.data?.summary_reports?.totalOrders);

  const summaryChartData = {
    labels: [
      `Online - ${sumDelivery ? sumDelivery.toFixed(2) : "0"}%`,
      `Cash - ${sumPickup ? sumPickup.toFixed(2) : "0"}%`,
    ],
    datasets: [
      {
        label: "# of Votes",
        data: [sumDelivery, sumPickup],
        backgroundColor: ["#1448CD", "#EC6C30"],
        borderColor: ["#1448CD", "#EC6C30"],
        borderWidth: 1,
      },
    ],
  };

  const saleDelivery =
    (parseInt(graphData?.data?.data?.sales_reports?.deliveredOrders) * 100) /
    parseInt(graphData?.data?.data?.summary_reports?.totalOrders);

  const salePickup =
    (parseInt(graphData?.data?.data?.sales_reports?.pickupOrders) * 100) /
    parseInt(graphData?.data?.data?.summary_reports?.totalOrders);

  const salesChartData = {
    labels: [
      `Delivery - ${saleDelivery ? saleDelivery.toFixed(2) : "0"}%`,
      `Pickup - ${salePickup ? salePickup.toFixed(2) : "0"}%`,
    ],
    datasets: [
      {
        label: "# of Votes",
        data: [saleDelivery, salePickup],
        backgroundColor: ["#1448CD", "#EC6C30"],
        borderColor: ["#1448CD", "#EC6C30"],
        borderWidth: 1,
      },
    ],
  };

  const orderDelivery =
    (parseInt(graphData?.data?.data?.orderReports?.deliveredOrders) * 100) /
    parseInt(graphData?.data?.data?.orderReports?.totalOrders);

  const orderPickup =
    (parseInt(graphData?.data?.data?.orderReports?.pickupOrders) * 100) /
    parseInt(graphData?.data?.data?.orderReports?.totalOrders);

  const orderChartData = {
    labels: [
      `Delivery - ${orderDelivery ? orderDelivery.toFixed(2) : "0"}%`,
      `Pickup - ${orderPickup ? orderPickup.toFixed(2) : "0"}%`,
    ],
    datasets: [
      {
        label: "# of Votes",
        data: [orderDelivery, orderPickup],
        backgroundColor: ["#379465", "#4D7EFF"],
        borderColor: ["#379465", "#4D7EFF"],
        borderWidth: 1,
      },
    ],
  };

  // Line Chart Data
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: false,
        text: "Chart.js Line Chart",
        position: "bottom",
      },
    },
  };

  const labels = graphData?.data?.data?.monthlyData.map((item) => item.month);
  const ordersCount = graphData?.data?.data?.monthlyData.map(
    (item) => item.ordersCount
  );

  const data = {
    labels,
    datasets: [
      {
        label: "Average order value",
        data: ordersCount,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      // {
      //   label: "Average order value",
      //   data: ordersCount,
      //   borderColor: "rgb(53, 162, 235)",
      //   backgroundColor: "rgba(53, 162, 235, 0.5)",
      // },
    ],
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
  console.log("restList", restList);
  const fetchRestaurants = async (zoneId = null) => {
    const res = await PostAPI("admin/zoneWiseRestaurants", {
      zoneId: zoneId,
      businessType: 3, // assuming 3 is store type from your original code
    });

    if (res?.data?.status === "1") {
      const restaurants = res.data.data?.data || [];
      const options = [];
      restaurants.forEach((r) => {
        options.push({ value: r.id, label: r.businessName });
      });
      setRestList(options);
    } else {
      setRestList([{ value: null, label: "All Stores" }]);
    }
  };

  useEffect(() => {
    // Clear restaurant selection on zone change
    setFilterData((prev) => ({
      ...prev,
      restaurant: null,
    }));

    fetchRestaurants(filterData.zone?.value || null);
  }, [filterData.zone]);

  //   const restList = [{ value: null, label: "All Stores" }];
  //   const getRest = GetAPI("admin/getallrestaurants/store");
  //   getRest?.data?.data?.map((el) => {
  //     restList.push({
  //       ...restList,
  //       value: el.id,
  //       label: el.businessName,
  //     });
  //   });

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

  const getData = async () => {
    let res = await PostAPI("admin/storeReports", {
      businessType: "store",
      zoneId: filterData?.zone?.value,
      restaurantId: filterData?.restaurant?.value,
      from: filterData?.from,
      to: filterData?.to,
    });

    if (res?.data?.status === "1") {
      setGraphData(res);
    } else {
      // setData("");
    }
  };

  useEffect(() => {
    getData();
  }, [filterData?.zone?.value, filterData?.restaurant?.value, filterData?.to]);

  return graphData?.data?.length === 0 ? (
    <Loader />
  ) : (
    <Layout
      content={
        <div className="bg-themeGray p-5 space-y-5">
          <div className="flex gap-5 items-center">
            <button
              className="bg-white p-2 rounded-full"
              onClick={() => window.history.back()}
              data-testid="store-back-btn"
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
                    name=""
                    options={zoneOptions}
                    onChange={(e) => {
                      setFilterData({ ...filterData, zone: e });
                    }}
                    value={filterData?.zone}
                    data-testid="store-zone-select-input"
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
                    data-testid="store-restaurant-select-input"
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
                    data-testid="store-datefilter-select-input"
                  />
                </div>
                <button className="bg-[#f4f4f4] rounded-md border-gray-300 border-[1px] px-4 py-1.5 text-gray-500" data-testid="store-download-btn">
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
            <div className="grid grid-cols-12 gap-5">
              <div className="col-span-9 space-y-5">
                <div
                  className={`grid ${
                    filterData?.restaurant?.value
                      ? "grid-cols-2"
                      : "grid-cols-3 "
                  } gap-5`}
                >
                  {!filterData?.restaurant?.value && (
                    <ReportsCard
                      total={
                        graphData?.data?.data?.summary_reports
                          ?.totalRegisteredRestaurants
                      }
                      title={t("Total Registered")}
                      image="store"
                      tab={tab}
                    />
                  )}
                  <ReportsCard
                    total={graphData?.data?.data?.summary_reports?.newItems}
                    title={t("New Items")}
                    image="store"
                    tab={tab}
                  />
                  <ReportsCard
                    total={graphData?.data?.data?.summary_reports?.totalOrders}
                    title={t("Total Orders")}
                    image="report"
                    tab={tab}
                  />
                </div>

                <div className="bg-white p-2.5 rounded-md shadow-lg">
                  <Line options={options} data={data} />
                </div>
              </div>

              <div className="col-span-3 bg-white p-2.5 rounded-md shadow-lg space-y-10">
                <div className="space-y-2">
                  <h3 className="text-xl text-black font-semibold font-norms text-center">
                    {t("Completed Payment Statistics")}
                  </h3>
                  <p className="text-themeBorderGray font-medium font-switzer text-sm text-center">
                    {t("See how your customer paid you")}
                  </p>
                </div>

                <div>
                  <DonutChart data={summaryChartData} />
                </div>
              </div>
            </div>
          ) : tab === "Sales Reports" ? (
            <div className="grid grid-cols-12 gap-5">
              <div className="col-span-9 space-y-5">
                <div className="grid grid-cols-3 gap-5">
                  <ReportsCard
                    total={`$${graphData?.data?.data?.sales_reports?.gross_sales}`}
                    title={t("Gross Sale")}
                    image="home-1"
                    tab={tab}
                  />
                  <ReportsCard
                    total={`$${graphData?.data?.data?.sales_reports?.total_tax}`}
                    title={t("Total Tax")}
                    image="home-1"
                    tab={tab}
                  />

                  <ReportsCard
                    total={`$${graphData?.data?.data?.sales_reports?.total_commissions}`}
                    title={t("Total Commission")}
                    image="home-1"
                    tab={tab}
                  />
                </div>

                <div className="bg-white p-2.5 rounded-md shadow-lg">
                  <Line options={options} data={data} />
                </div>
              </div>

              <div className="col-span-3 bg-white p-2.5 rounded-md shadow-lg space-y-10">
                <div className="space-y-2">
                  <h3 className="text-xl text-black font-semibold font-norms text-center">
                    {t("Total Store Earnings")}
                  </h3>
                  <p className="text-themeBorderGray font-medium font-switzer text-sm text-center">
                    {t("See your store earning statistics")}
                  </p>
                </div>

                <div>
                  <DonutChart data={salesChartData} />
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-12 gap-5">
              <div className="col-span-9 space-y-5">
                <div className="grid grid-cols-3 gap-5">
                  <ReportsCard
                    total={graphData?.data?.data?.orderReports?.totalOrders}
                    title={t("Total Orders")}
                    image="home-1"
                  />

                  <div className="bg-white px-2.5 py-5 rounded-md shadow-lg space-y-3">
                    <div className="flex flex-col gap-3 justify-center items-center">
                      <div>
                        <img
                          src={`/images/home-1.webp`}
                          alt={`card-1`}
                          className="w-20 h-16 object-contain"
                        />
                      </div>
                      <div className="text-2xl font-medium text-center font-norms">
                        $
                        {graphData?.data?.data?.orderReports?.totalOrdersAmount}
                      </div>
                      <div className="text-base font-medium text-center font-norms">
                        {t("Total Order Amount")}
                      </div>
                    </div>

                    <div className="flex justify-center gap-5 flex-wrap">
                      <div className="">
                        <div className="text-themeGreen text-xl font-norms font-bold text-center">
                          $
                          {
                            graphData?.data?.data?.orderReports
                              ?.completeOrdersEarning
                          }
                        </div>
                        <div className="text-center font-medium">
                          {t("Completed")}
                        </div>
                      </div>
                      <div className="">
                        <div className="text-themeBlue text-xl font-norms font-bold text-center">
                          $
                          {
                            graphData?.data?.data?.orderReports
                              ?.notCompleteEarning
                          }
                        </div>
                        <div className="text-center font-medium">
                          {t("Incomplete")}
                        </div>
                      </div>
                      <div className="">
                        <div className="text-themeRed text-xl font-norms font-bold text-center">
                          $
                          {
                            graphData?.data?.data?.orderReports
                              ?.cancelledOrdersEarning
                          }
                        </div>
                        <div className="text-center font-medium">
                          {t("Rejected")}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white px-2.5 py-5 rounded-md shadow-lg space-y-3">
                    <div className="flex flex-col gap-3 justify-center items-center">
                      <div>
                        <img
                          src={`/images/home-1.webp`}
                          alt={`card-1`}
                          className="w-20 h-16 object-contain"
                        />
                      </div>
                      <div className="text-2xl font-medium text-center font-norms">
                        ${graphData?.data?.data?.orderReports?.discountAmount}
                      </div>
                      <div className="text-base font-medium text-center font-norms">
                        {t("Total Discount Given")}
                      </div>
                    </div>

                    <div className="flex justify-between gap-5">
                      <div className="">
                        <div className="text-themeGreen text-xl font-norms font-bold text-center">
                          $0
                        </div>
                        <div className="text-center font-medium">
                          {t("Coupon Discount")}
                        </div>
                      </div>

                      <div className="">
                        <div className="text-themeBlue text-xl font-norms font-bold text-center">
                          $0
                        </div>
                        <div className="text-center font-medium">
                          {t("Product Discount")}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-md shadow-lg">
                  <Line options={options} data={data} />
                </div>
              </div>

              <div className="col-span-3 bg-white p-2.5 rounded-md shadow-lg space-y-10">
                <div className="space-y-2">
                  <h3 className="text-xl text-black font-semibold font-norms text-center">
                    {t("Order Types")}
                  </h3>
                  <p className="text-themeBorderGray font-medium font-switzer text-sm text-center">
                    {t(
                      "Distribution of all successful orders for both pickup and delivery"
                    )}
                  </p>
                </div>

                <div>
                  <DonutChart data={orderChartData} />
                </div>
              </div>
            </div>
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
                data-testid="store-customdate-close-btn"
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
                    data-testid="store-customdate-cancel-btn"
                  >
                    {t("Cancel")}
                  </div>
                  <div
                    onClick={() => {
                      handleCustomDateConfirm();
                    }}
                    className="border-red-500 bg-red-500 text-white hover:bg-white hover:text-red-500 duration-150"
                    data-testid="store-customdate-confirm-btn"
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
