import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import GetAPI from "../../utilities/GetAPI";
import HomeCards from "../../components/HomeCards";
import LineChart from "../../components/LineChart";
import { DonutChart } from "../../components/DonutChart";
import { TabButton } from "../../utilities/Buttons";
import { FaArrowUp } from "react-icons/fa6";
import { IoIosInformationCircleOutline } from "react-icons/io";
import AnalyticsCard from "../../components/AnalyticsCard";
import MyDataTable from "../../components/MyDataTable";
import Select from "react-select";
import axios from "axios";
import { BASE_URL } from "../../utilities/URL";
import { useTranslation } from "react-i18next";
import { Line } from "react-chartjs-2";

export default function Home() {
  const { data } = GetAPI("admin/statsadmin");
  let zones = GetAPI("admin/getZones");
  const [tab, setTab] = useState("Performance");
  const [innertab, setInnerTab] = useState("Orders");
  const [performanceTab, setPerformanceTab] = useState("General Performance");
  const [cxTab, setCxTab] = useState("General");
  const [restauarntDets, setRestaurantDets] = useState();
  const [zoneData, setZoneData] = useState({
    zone: "",
  });
  const { t } = useTranslation();

  let averageOrderValue = [];
  restauarntDets?.monthlyOrders?.map((elem) => {
    averageOrderValue.push(elem?.averageOrderValue);
  });
  console.log(restauarntDets, "restauarntDets");
  // =========DonutChart Data============
  const homeChartData = {
    labels: ["Delivery Orders", "Pick Up Order"],
    datasets: [
      {
        label: "# of Votes",
        data: [
          restauarntDets?.totalDeliveryOrders,
          restauarntDets?.totalSelfPickupOrders,
        ],
        backgroundColor: ["#FF5329", "#79E0AC"],
        borderColor: ["#FF5329", "#79E0AC"],
        borderWidth: 1,
      },
    ],
  };
  const PTG = {
    labels: ["Paid Online", "Paid in cash", "Others"],
    datasets: [
      {
        label: "# of Votes",
        data: [
          restauarntDets?.totalDeliveryOrders,
          restauarntDets?.totalSelfPickupOrders,
          15,
        ],
        backgroundColor: ["#FF5329", "#79E0AC", "#00000"],
        borderColor: ["#FF5329", "#79E0AC", "#00000"],
        borderWidth: 1,
      },
    ],
  };
  // =========End============
  const summaryChartData = {
    labels: ["Online", `Cash`],
    datasets: [
      {
        label: "# of Votes",
        data: [2, 3],
        backgroundColor: ["#1448CD", "#EC6C30"],
        borderColor: ["#1448CD", "#EC6C30"],
        borderWidth: 1,
      },
    ],
  };
  // =========Line Chart Data============
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
  const myData = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        label: "Average order value",
        data: [120, 150, 180, 200, 170, 160, 180, 190, 210, 220, 230, 240],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Average order value",
        data: [100, 130, 160, 180, 150, 140, 160, 170, 190, 200, 210, 220],
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };
  const AOVG = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        label: "Average order value",
        data: averageOrderValue,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };
  const OG = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        label: "Orders",
        data: averageOrderValue,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  const RG = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        label: "",
        data: [32, 1, 75, 6, 3, 2, 4, 85, 92, 61],
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
      {
        label: "",
        data: [53, 34, 45, 56, 63, 72, 84, 86, 97, 43],
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };
  const POIG = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        label: "",
        data: [32, 1, 75, 6, 3, 2, 4, 85, 92, 61],
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
      {
        label: "",
        data: [53, 34, 45, 56, 63, 72, 84, 86, 97, 43],
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  const myOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: false,
        text: "Custom Chart Title",
      },
    },
  };
  // ===========End==========
  // ==========Data Table===========
  const columns = [
    { field: "product", header: "Product" },
    {
      field: "itemSold",
      header: "Item Sold",
    },
    {
      field: "averagePrice",
      header: "Average Price",
    },
    {
      field: "revenue",
      header: "Revenue",
    },
  ];
  const datas = [
    {
      product: "Burger",
      itemSold: "28",
      averagePrice: "1%",
      revenue: "500CHF",
    },
    {
      product: "Burger",
      itemSold: "2",
      averagePrice: "4%",
      revenue: "2900CHF",
    },
    {
      product: "Burger",
      itemSold: "29",
      averagePrice: "5%",
      revenue: "230CHF",
    },
    {
      product: "Burger",
      itemSold: "20",
      averagePrice: "2%",
      revenue: "2500CHF",
    },
  ];
  // ==========Data Table===========
  // ==========Zones================

  let zoneOptions = [];
  zones?.data?.data?.map((z, i) => {
    zoneOptions.push({
      value: z?.id,
      label: z?.name,
    });
  });
  // ==========Get restauarnt list================
  const [restaurant, setRestaurant] = useState({ rest: "" });
  let restListOptions = [];
  const zoneRest = async () => {
    const res = await GetAPI(
      `admin/getZoneRestaurant/${zoneData?.zone?.value}`
    );
    if (res?.data?.status === "1") {
      res?.data?.data?.map((rest) => {
        restListOptions.push({
          value: rest?.restaurant?.id,
          label: rest?.restaurant?.businessName,
        });
      });
    }
  };
  zoneRest();

  // ==========Get restauarnt Details================

  const getdetailsRest = async () => {
    let restId = restaurant?.rest?.value;
    if (restId) {
      var config = {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      };
      let res = await axios.get(
        BASE_URL + `admin/getTotalOrdersByRestaurant/${restId}`,
        config
      );
      if (res?.data?.status === "1") {
        setRestaurantDets(res?.data?.data?.data);
      }
    }
  };
  useEffect(() => {
    getdetailsRest();
  }, [restaurant?.rest?.value]);

  return (
    <Layout
      content={
        <div className="bg-themeGray p-5 space-y-5">
          <div className="">
            <h2 className="text-themeRed text-lg font-bold font-norms">
              {t("Dashboard")}
            </h2>
          </div>

          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-12 space-y-5">
              <div className="grid grid-cols-3 gap-5">
                <HomeCards
                  title={t("Store Reports")}
                  image="1"
                  to="/store-reports"
                  dataTestId="home-store-reports-link-btn"
                />
                <HomeCards
                  title={t("Restaurant Reports")}
                  image="1"
                  to="/restaurant-reports"
                  dataTestId="home-restaurant-reports-link-btn"
                />
                <HomeCards
                  title={t("Customer Analytics")}
                  image="2"
                  to="/customer-analytics"
                  dataTestId="home-customer-analytics-link-btn"
                />
                <HomeCards
                  title={t("Order Metrics")}
                  image="3"
                  to="/order-metrics"
                  dataTestId="home-order-metrics-link-btn"
                />
                <HomeCards
                  title={t("Sales Reports")}
                  image="4"
                  to="/sale-reports"
                  dataTestId="home-sales-reports-link-btn"
                />
                {/* <HomeCards
                  title="User Feedback"
                  image="5"
                  to="/user-feedback"
                /> */}
              </div>
              {/* ============================== */}
              <div className=" grid grid-cols-12 p-2.5 gap-x-5 rounded-md">
                <div className="bg-white p-2.5 rounded-xl col-span-8">
                  <Line options={options} data={myData} />
                </div>

                <div className="bg-white p-2.5 rounded-xl col-span-4">
                  <DonutChart data={summaryChartData} />
                </div>
              </div>
              {/* ===============All Content Hidden Here because Change of design will see have to remove permanantly or keep some code partially============= */}
              <div className="bg-white p-2.5 rounded-md shadow-lg min-h-screen hidden">
                <div className="w-full flex gap-5 my-6">
                  <div className="w-[300px]">
                    <h4 className="font-norms font-semibold text-lg text-gray-500 pl-2 mb-2">
                      {t("Select Zone")}
                    </h4>
                    <Select
                      placeholder="Select"
                      name=""
                      options={zoneOptions}
                      onChange={(e) => {
                        setZoneData({
                          ...zoneData,
                          zone: zoneOptions.find((el) => el.value === e?.value),
                        });
                        setRestaurant({
                          ...restaurant,
                          rest: { value: "", label: "" },
                        });
                      }}
                      value={zoneData?.zone}
                      data-testid="home-zone-select-input"
                    />
                  </div>
                  <div className="w-[300px]">
                    <h4 className="font-norms font-semibold text-lg text-gray-500 pl-2 mb-2">
                      {t("Select Restaurant")}
                    </h4>
                    <Select
                      placeholder="Select"
                      name=""
                      options={restListOptions}
                      onChange={(e) => {
                        setRestaurant({
                          ...restaurant,
                          rest: restListOptions.find(
                            (el) => el.value === e?.value
                          ),
                        });
                      }}
                      value={restaurant?.rest}
                      data-testid="home-restaurant-select-input"
                    />
                  </div>
                </div>
                {restaurant?.rest?.value ? (
                  <>
                    <div className="space-y-1.5 mt-10">
                        <ul className="flex flex-wrap items-center gap-8">
                        <TabButton
                          title={t("Performance")}
                          tab={tab}
                          onClick={() => setTab("Performance")}
                          dataTestId="home-performance-tab-btn"
                        />
                        <TabButton
                          title={t("Order & Sales")}
                          tab={tab}
                          onClick={() => setTab("Order & Sales")}
                          dataTestId="home-order-sales-tab-btn"
                        />
                        <TabButton
                          title={t("Delivery & Menu")}
                          tab={tab}
                          onClick={() => setTab("Delivery & Menu")}
                          dataTestId="home-delivery-menu-tab-btn"
                        />
                        <TabButton
                          title={t("Customer Experience")}
                          tab={tab}
                          onClick={() => setTab("Customer Experience")}
                          dataTestId="home-customer-experience-tab-btn"
                        />
                      </ul>
                      <div className={`w-full bg-[#00000033] h-[1px]`}></div>
                    </div>
                    {tab === "Performance" ? (
                      <div className="w-full">
                        <div className="flex items-center gap-4 mt-10">
                          <p className="text-lg font-bold font-norms">
                            {t("Performance")}
                          </p>
                          <span className="text-xl text-red-500">
                            <IoIosInformationCircleOutline />
                          </span>
                        </div>
                        <p className="font-norms text-base my-4">
                          {t(
                            "You can use the date filter to see data from yesterday up to the last 90 days. Please note that from yesterday can be delayed up to 12 hours."
                          )}
                        </p>
                        <div className="flex gap-2 font-norms items-center">
                          <h4 className="text-lg font-semibold">
                            {t("Last Updated")}:{" "}
                          </h4>{" "}
                          <p className="text-gray-500 font-medium">
                            Sunday 4 february 2024
                          </p>
                        </div>
                        <div className="w-full rounded-2xl bg-[#36373B] flex flex-col justify-center items-center text-white py-20 my-5">
                          <img
                            className="w-40 object-cover"
                            src="/images/image70.png"
                            alt=""
                          />
                          <p className="font-norms text-base text-center my-5">
                            {t(
                              `We have not enough data to show your restaurant performance of February. please check again in next month.`
                            )}
                          </p>
                        </div>
                      </div>
                    ) : tab === "Order & Sales" ? (
                      <div className="font-norms">
                        <div className="flex gap-5 mt-10">
                          <div className="flex gap-4 items-center">
                            <p className="text-lg font-bold font-norms">
                              {t("Overview")}
                            </p>
                            <span className="text-xl text-red-500">
                              <IoIosInformationCircleOutline />
                            </span>
                          </div>
                          <div>
                            <p>{t("Date range picker")}</p>
                          </div>
                        </div>
                        <div>
                          <p>
                            {" "}
                            <p className="text-base my-5">
                              {t(
                                `You can use the date filter to see data from yesterday up to the last 90 days. Please note that from yesterday can be delayed up to 12 hours.`
                              )}
                            </p>
                          </p>
                        </div>

                        <div className="grid grid-cols-3 gap-4 my-10">
                          <AnalyticsCard
                            title={t("Total Revenue")}
                            value={`${restauarntDets?.orderAndSales?.totalEarning} CHF`}
                            percent="22%"
                            date="04/22 - 10/22"
                          />
                          <AnalyticsCard
                            title={t("Overall average order value")}
                            value={`${restauarntDets?.orderAndSales?.overallAverageOrderValue} CHF`}
                            percent="22%"
                            date="04/22 - 10/22"
                          />
                          <AnalyticsCard
                            title={t("Cancellation rate")}
                            value={`${restauarntDets?.orderAndSales?.cancellationRate} CHF`}
                            percent="100%"
                            date="04/22 - 10/22"
                          />
                        </div>

                        <div className="flex gap-4 mt-10">
                          <div className="w-[67%] rounded-xl">
                            <div className="flex gap-4 items-center">
                              <p className="text-2xl font-bold font-norms">
                                {t("Orders")}
                              </p>
                              <span className="text-2xl text-red-500">
                                <IoIosInformationCircleOutline />
                              </span>
                            </div>
                            <div className="font-norms flex gap-5 mt-5 mb-10">
                              <div className="flex items-center gap-4 text-lg text-gray-500 font-semibold">
                                <span className="w-5 h-5 bg-blue-700"></span>
                                <div>
                                  <div className="flex gap-2 items-center mt-8">
                                    <p className="leading-5">
                                      {t("Total")} <br />{" "}
                                      {t("Successfull orders")}
                                    </p>
                                  </div>
                                  <p className="text-black text-xl">
                                    {restauarntDets?.totalSuccessfulOrders}
                                  </p>
                                </div>
                              </div>
                              {/* ============ */}
                              <div className="flex items-center gap-4 text-lg text-gray-500 font-semibold">
                                <span className="w-5 h-5 bg-orange-500"></span>
                                <div>
                                  <div className="flex gap-2 items-center mt-8">
                                    <p className="leading-5">
                                      {t("Total")} <br />{" "}
                                      {t("Cancelled orders")}
                                      <br />{" "}
                                    </p>
                                  </div>
                                  <p className="text-black text-xl">
                                    {restauarntDets?.totalCanceledOrders}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <LineChart options={myOptions} data={OG} />
                          </div>
                          <div className="w-[33%] rounded-lg flex flex-col px-5 p">
                            <p className="font-bold text-2xl">
                              {t("Order Type")}
                            </p>
                            <p className="text-base my-5">
                              {t(
                                "Distribution of all successful orders for both"
                              )}{" "}
                              <br /> {t("pickup and delivery")}
                            </p>
                            <div className="w-full h-full flex justify-center">
                              <div className="w-[70%] mt-20">
                                <DonutChart data={homeChartData} />
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* =========================== */}
                        <div className="w-full rounded-xl my-10">
                          <div className="flex gap-4 items-center">
                            <p className="text-2xl font-bold font-norms">
                              {t("Average orders value")}
                            </p>
                            <span className="text-2xl text-red-500">
                              <IoIosInformationCircleOutline />
                            </span>
                          </div>
                          <div className="font-norms flex gap-5 mt-5 mb-10">
                            <div className="flex items-center gap-4 text-lg text-gray-500 font-semibold">
                              <span className="w-5 h-5 bg-blue-700"></span>
                              <div>
                                <div className="flex gap-2 items-center mt-8">
                                  <p className="leading-5">
                                    {t("Overall average")} <br />
                                    {t("orders value")} <br />{" "}
                                  </p>
                                </div>
                                <p className="text-black text-xl">
                                  {restauarntDets?.overallAverageOrderValue}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="">
                            <LineChart options={myOptions} data={AOVG} />
                          </div>
                        </div>
                        {/* =========================== */}
                        <div className="flex gap-4 mt-10">
                          <div className="w-[67%] rounded-xl">
                            <div className="flex gap-4 items-center">
                              <p className="text-2xl font-bold font-norms">
                                {t("Revenue")}
                              </p>
                              <span className="text-2xl text-red-500">
                                <IoIosInformationCircleOutline />
                              </span>
                            </div>
                            <div className="font-norms flex gap-5 mt-5 mb-10">
                              <div className="flex items-center gap-4 text-lg text-gray-500 font-semibold">
                                <span className="w-5 h-5 bg-blue-700"></span>
                                <div>
                                  <div className="flex gap-2 items-center mt-8">
                                    <p className="leading-5">
                                      {t("Total")} <br /> {t("Revenue")}{" "}
                                    </p>
                                  </div>
                                  <p className="text-black text-xl">5</p>
                                </div>
                              </div>
                              {/* ============ */}
                              <div className="flex items-center gap-4 text-lg text-gray-500 font-semibold">
                                <span className="w-5 h-5 bg-orange-500"></span>
                                <div>
                                  <div className="flex gap-2 items-center mt-8">
                                    <p className="leading-5">
                                      {t("Total")} <br /> {t("Revenue loss")}{" "}
                                    </p>
                                  </div>
                                  <p className="text-black text-xl">5</p>
                                </div>
                              </div>
                            </div>
                            <LineChart options={myOptions} data={RG} />
                          </div>
                          <div className="w-[33%] rounded-lg flex flex-col px-5 p">
                            <p className="font-bold text-2xl">
                              {t("Payment Type")}
                            </p>
                            <p className="text-base my-5">
                              {t(
                                "Distribution of all successful orders for both"
                              )}{" "}
                              <br /> {t("pickup and delivery")}
                            </p>
                            <div className="w-full h-full flex justify-center">
                              <div className="w-[70%] mt-20">
                                <DonutChart data={PTG} />
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* ================================= */}
                        <div>
                          <div className="flex items-center gap-4 mt-10">
                            <p className="text-2xl font-bold font-norms">
                              {t("Hourly Insights")}
                            </p>
                            <span className="text-2xl text-red-500">
                              <IoIosInformationCircleOutline />
                            </span>
                          </div>
                          <p className="font-norms text-base my-4">
                            {t(
                              "View a breakdown of orders and revenue throughout the day. You can use this data to adjust your opening hours."
                            )}
                          </p>
                        </div>

                        <div className="space-y-1.5 mt-10">
                          <ul className="flex flex-wrap items-center gap-8">
                            <TabButton
                              title={t("Orders")}
                              tab={innertab}
                              onClick={() => setInnerTab("Orders")}
                              dataTestId="home-orders-inner-tab-btn"
                            />
                            <TabButton
                              title={t("Revenue")}
                              tab={innertab}
                              onClick={() => setInnerTab("Revenue")}
                              dataTestId="home-revenue-inner-tab-btn"
                            />
                          </ul>
                          <div
                            className={`w-full bg-[#00000033] h-[1px]`}
                          ></div>
                        </div>
                        {/* ========================== */}
                        <div className="my-8">
                          <div className="w-full">
                            <div className="flex gap-2 w-full py-5">
                              <p className="w-14 text-center font-semibold">
                                {t("Scale")}
                              </p>
                              <div className="flex gap-2 w-full">
                                <div className="flex-1 w-full font-semibold">
                                  {" "}
                                  <p className="h-5 w-full bg-green-200"></p>
                                  <p>0</p>
                                </div>
                                <div className="flex-1 w-full font-semibold">
                                  {" "}
                                  <p className="h-5 w-full bg-green-200"></p>
                                  <p>1</p>
                                </div>
                                <div className="flex-1 w-full font-semibold">
                                  {" "}
                                  <p className="h-5 w-full bg-green-200"></p>
                                  <p>3</p>
                                </div>
                                <div className="flex-1 w-full font-semibold">
                                  {" "}
                                  <p className="h-5 w-full bg-green-200"></p>
                                  <p>4</p>
                                </div>
                                <div className="flex-1 w-full font-semibold">
                                  {" "}
                                  <p className="h-5 w-full bg-green-200"></p>
                                  <p>6</p>
                                </div>
                                <div className="flex-1 w-full font-semibold">
                                  {" "}
                                  <p className="h-5 w-full bg-green-200"></p>
                                  <p>7</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          {innertab === "Orders" ? (
                            <div className="w-full">
                              <div className="flex gap-2 w-full py-5">
                                <p className="w-14 text-center font-semibold"></p>
                                <div className="flex gap-2 w-full">
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full text-center font-semibold">
                                      {t("Mon")}
                                    </p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full text-center font-semibold">
                                      {t("Tue")}
                                    </p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full text-center font-semibold">
                                      {t("Wed")}
                                    </p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full text-center font-semibold">
                                      {t("Thu")}
                                    </p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full text-center font-semibold">
                                      {t("Fri")}
                                    </p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full text-center font-semibold">
                                      {t("Sat")}
                                    </p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full text-center font-semibold">
                                      {t("Sun")}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2 w-full py-5">
                                <p className="w-14 text-center font-semibold">
                                  00:00
                                </p>
                                <div className="flex gap-2 w-full">
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2 w-full py-5">
                                <p className="w-14 text-center font-semibold">
                                  01:00
                                </p>
                                <div className="flex gap-2 w-full">
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2 w-full py-5">
                                <p className="w-14 text-center font-semibold">
                                  02:00
                                </p>
                                <div className="flex gap-2 w-full">
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2 w-full py-5">
                                <p className="w-14 text-center font-semibold">
                                  03:00
                                </p>
                                <div className="flex gap-2 w-full">
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2 w-full py-5">
                                <p className="w-14 text-center font-semibold">
                                  04:00
                                </p>
                                <div className="flex gap-2 w-full">
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2 w-full py-5">
                                <p className="w-14 text-center font-semibold">
                                  05:00
                                </p>
                                <div className="flex gap-2 w-full">
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2 w-full py-5">
                                <p className="w-14 text-center font-semibold">
                                  06:00
                                </p>
                                <div className="flex gap-2 w-full">
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2 w-full py-5">
                                <p className="w-14 text-center font-semibold">
                                  07:00
                                </p>
                                <div className="flex gap-2 w-full">
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2 w-full py-5">
                                <p className="w-14 text-center font-semibold">
                                  08:00
                                </p>
                                <div className="flex gap-2 w-full">
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2 w-full py-5">
                                <p className="w-14 text-center font-semibold">
                                  09:00
                                </p>
                                <div className="flex gap-2 w-full">
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="w-full">
                              <div className="flex gap-2 w-full py-5">
                                <p className="w-14 text-center font-semibold"></p>
                                <div className="flex gap-2 w-full">
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full text-center font-semibold">
                                      {t("Mon")}
                                    </p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full text-center font-semibold">
                                      {t("Tue")}
                                    </p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full text-center font-semibold">
                                      {t("Wed")}
                                    </p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full text-center font-semibold">
                                      {t("Thu")}
                                    </p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full text-center font-semibold">
                                      {t("Fri")}
                                    </p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full text-center font-semibold">
                                      {t("Sat")}
                                    </p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full text-center font-semibold">
                                      {t("Sun")}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2 w-full py-5">
                                <p className="w-14 text-center font-semibold">
                                  00:00
                                </p>
                                <div className="flex gap-2 w-full">
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2 w-full py-5">
                                <p className="w-14 text-center font-semibold">
                                  01:00
                                </p>
                                <div className="flex gap-2 w-full">
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2 w-full py-5">
                                <p className="w-14 text-center font-semibold">
                                  02:00
                                </p>
                                <div className="flex gap-2 w-full">
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2 w-full py-5">
                                <p className="w-14 text-center font-semibold">
                                  03:00
                                </p>
                                <div className="flex gap-2 w-full">
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2 w-full py-5">
                                <p className="w-14 text-center font-semibold">
                                  04:00
                                </p>
                                <div className="flex gap-2 w-full">
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2 w-full py-5">
                                <p className="w-14 text-center font-semibold">
                                  05:00
                                </p>
                                <div className="flex gap-2 w-full">
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2 w-full py-5">
                                <p className="w-14 text-center font-semibold">
                                  06:00
                                </p>
                                <div className="flex gap-2 w-full">
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2 w-full py-5">
                                <p className="w-14 text-center font-semibold">
                                  07:00
                                </p>
                                <div className="flex gap-2 w-full">
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2 w-full py-5">
                                <p className="w-14 text-center font-semibold">
                                  08:00
                                </p>
                                <div className="flex gap-2 w-full">
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2 w-full py-5">
                                <p className="w-14 text-center font-semibold">
                                  09:00
                                </p>
                                <div className="flex gap-2 w-full">
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                  <div className="flex-1 w-full">
                                    {" "}
                                    <p className="h-5 w-full bg-gray-200"></p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : tab === "Delivery & Menu" ? (
                      <div className="w-full">
                        <div className="flex gap-5 mt-10">
                          <div className="flex gap-4 items-center">
                            <p className="text-lg font-bold font-norms">
                              {t("Overview")}
                            </p>
                            <span className="text-xl text-red-500">
                              <IoIosInformationCircleOutline />
                            </span>
                          </div>
                          <div>
                            <p>{t("Date range picker")}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-base my-5">
                            {t(
                              "You can use the date filter to see data from yesterday up to the last 90 days. Please note that from yesterday can be delayed up to 12 hours."
                            )}
                          </p>
                        </div>

                        <div className="grid grid-cols-3 gap-4 my-10">
                          <AnalyticsCard
                            title={t("Product with picture")}
                            value="4%"
                            percent="4"
                            date="04/22 - 10/22"
                          />
                          <AnalyticsCard
                            title={t("Product with description")}
                            value="71%"
                            percent="22"
                            date="04/22 - 10/22"
                          />
                          <AnalyticsCard
                            title={t("Order to accept duration")}
                            value="0 minute"
                            percent="100"
                            date="04/22 - 10/22"
                          />
                        </div>
                        {/* ===================== */}
                        <div className="flex gap-5 mt-20">
                          <div className="flex gap-4 items-center">
                            <p className="text-lg font-bold font-norms">
                              {t("Menu Performance")}
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-500 my-5">
                            {t(
                              "See how popular your products are and how much ravenue they bring."
                            )}
                          </p>
                        </div>
                        <div className="w-full">
                          <MyDataTable columns={columns} data={datas} />
                        </div>
                        {/* ===================== */}
                        <div className="flex gap-5 mt-20">
                          <div className="flex gap-4 items-center">
                            <p className="text-lg font-bold font-norms">
                              {t("Delivery areas performance")}
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-500 my-5">
                            {t(
                              "See your performance in different delivery areas."
                            )}
                          </p>
                        </div>
                        <div className="space-y-1.5">
                          <ul className="flex flex-wrap items-center gap-8">
                            <TabButton
                              title={t("General Performance")}
                              tab={performanceTab}
                              onClick={() =>
                                setPerformanceTab("General Performance")
                              }
                              dataTestId="home-general-performance-tab-btn"
                            />
                            <TabButton
                              title={t("Detailed Performance")}
                              tab={performanceTab}
                              onClick={() =>
                                setPerformanceTab("Detailed Performance")
                              }
                              dataTestId="home-detailed-performance-tab-btn"
                            />
                          </ul>
                          <div
                            className={`w-full bg-[#00000033] h-[1px]`}
                          ></div>
                        </div>
                        {performanceTab === "General Performance" ? (
                          <div className="w-full">
                            <div className="w-full">
                              <MyDataTable columns={columns} data={datas} />
                            </div>
                          </div>
                        ) : (
                          <div className="w-full">
                            <div className="w-full">
                              <MyDataTable columns={columns} data={datas} />
                            </div>
                          </div>
                        )}
                        {/* ===================== */}
                        <div className="w-full rounded-xl">
                          <div className="flex gap-4 items-center">
                            <p className="text-xl font-bold font-norms">
                              {t("Post ordering insights")}
                            </p>
                            <span className="text-2xl text-red-500">
                              <IoIosInformationCircleOutline />
                            </span>
                          </div>
                          <div className="font-norms flex gap-5 mt-5 mb-10">
                            <div className="flex items-center gap-4 text-lg text-gray-500 font-semibold">
                              <span className="w-5 h-5 bg-blue-700"></span>
                              <div>
                                <div className="flex gap-2 items-center">
                                  <p className="leading-5">
                                    {t("Order to accept")}{" "}
                                  </p>
                                </div>
                              </div>
                            </div>
                            {/* ============ */}
                            <div className="flex items-center gap-4 text-lg text-gray-500 font-semibold">
                              <span className="w-5 h-5 bg-orange-500"></span>
                              <div>
                                <div className="flex gap-2 items-center">
                                  <p className="leading-5">
                                    {t("Estimated delivery time")}{" "}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <LineChart options={myOptions} data={POIG} />
                        </div>
                      </div>
                    ) : tab === "Customer Experience" ? (
                      <div className="w-full">
                        <div className="flex gap-5 mt-10">
                          <div className="flex gap-4 items-center">
                            <p className="text-lg font-bold font-norms">
                              {t("Overview")}
                            </p>
                            <span className="text-xl text-red-500">
                              <IoIosInformationCircleOutline />
                            </span>
                          </div>
                          <div>
                            <p>{t("Date range picker")}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-base my-5">
                            {t(
                              "You can use the date filter to see data from yesterday up to the last 90 days. Please note that from yesterday can be delayed up to 12 hours."
                            )}
                          </p>
                        </div>

                        <div className="grid grid-cols-3 gap-4 my-10">
                          <AnalyticsCard
                            title={t("Product with picture")}
                            value="4%"
                            percent="4"
                            date="04/22 - 10/22"
                          />
                          <AnalyticsCard
                            title={t("Product with description")}
                            value="71%"
                            percent="22"
                            date="04/22 - 10/22"
                          />
                          <AnalyticsCard
                            title={t("Order to accept duration")}
                            value="0 minute"
                            percent="100"
                            date="04/22 - 10/22"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <ul className="flex flex-wrap items-center gap-8">
                            <TabButton
                              title={t("General")}
                              tab={cxTab}
                              onClick={() => setCxTab("General")}
                              dataTestId="home-cx-general-tab-btn"
                            />
                            <TabButton
                              title={t("Detailed")}
                              tab={cxTab}
                              onClick={() => setCxTab("Detailed")}
                              dataTestId="home-cx-detailed-tab-btn"
                            />
                          </ul>
                          <div
                            className={`w-full bg-[#00000033] h-[1px]`}
                          ></div>
                        </div>
                        {cxTab === "General" ? (
                          <div className="w-full">
                            <div className="flex gap-4 mt-10">
                              <div className="w-[67%] rounded-xl">
                                <div className="flex gap-4 items-center">
                                  <p className="text-2xl font-bold font-norms">
                                    {t("Review score")}
                                  </p>
                                  <span className="text-2xl text-red-500">
                                    <IoIosInformationCircleOutline />
                                  </span>
                                </div>
                                <div className="font-norms flex gap-5 mt-5 mb-10">
                                  <div className="flex items-center gap-4 text-lg text-gray-500 font-semibold">
                                    <span className="w-5 h-5 bg-blue-700"></span>
                                    <div>
                                      <div className="flex gap-2 items-center">
                                        <p className="leading-5">
                                          {t("Overall score")}{" "}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <LineChart options={myOptions} data={myData} />
                              </div>
                              <div className="w-[33%] rounded-lg flex flex-col px-5 p">
                                <p className="font-bold text-2xl">
                                  {t("Overall review score")}
                                </p>

                                <div className="w-full h-full flex flex-col justify-evenly">
                                  <div className="w-[100%] mt-20 text-center">
                                    <p className="font-semibold text-xl">
                                      9.8/10
                                    </p>
                                    <div className="my-4">
                                      <span className="text-3xl text-orange-500">
                                        &#9733;
                                      </span>
                                      <span className="text-3xl text-orange-500">
                                        &#9733;
                                      </span>
                                      <span className="text-3xl text-orange-500">
                                        &#9733;
                                      </span>
                                      <span className="text-3xl text-orange-500">
                                        &#9733;
                                      </span>
                                      <span className="text-3xl text-orange-500">
                                        &#9733;
                                      </span>
                                    </div>
                                    <p className="font-semibold text-xl">
                                      {t("Food & Courier")}
                                    </p>
                                  </div>
                                  <div className="mt-10 font-semibold">
                                    <div className="flex justify-between">
                                      <p>{t("Food")}</p>
                                      <div className="flex items-center">
                                        <p>
                                          9.5
                                          <span className="text-3xl text-orange-500">
                                            &#9733;
                                          </span>
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex justify-between">
                                      <p>{t("Courier")}</p>
                                      <div className="flex items-center">
                                        <p>
                                          8.0
                                          <span className="text-3xl text-orange-500">
                                            &#9733;
                                          </span>
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : cxTab === "Detailed" ? (
                          <div className="w-full">
                            <div className="flex gap-4 mt-10">
                              <div className="w-[67%] rounded-xl">
                                <div className="flex gap-4 items-center">
                                  <p className="text-2xl font-bold font-norms">
                                    {t("Review score")}
                                  </p>
                                  <span className="text-2xl text-red-500">
                                    <IoIosInformationCircleOutline />
                                  </span>
                                </div>
                                <div className="font-norms flex gap-5 mt-5 mb-10">
                                  <div className="flex items-center gap-4 text-lg text-gray-500 font-semibold">
                                    <span className="w-5 h-5 bg-blue-700"></span>
                                    <div>
                                      <div className="flex gap-2 items-center">
                                        <p className="leading-5">
                                          {t("Overall score")}{" "}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <LineChart options={myOptions} data={myData} />
                              </div>
                              <div className="w-[33%] rounded-lg flex flex-col px-5 p">
                                <p className="font-bold text-2xl">
                                  {t("Overall review score")}
                                </p>

                                <div className="w-full h-full flex flex-col justify-evenly">
                                  <div className="w-[100%] mt-20 text-center">
                                    <p className="font-semibold text-xl">
                                      9.8/10
                                    </p>
                                    <div className="my-4">
                                      <span className="text-3xl text-orange-500">
                                        &#9733;
                                      </span>
                                      <span className="text-3xl text-orange-500">
                                        &#9733;
                                      </span>
                                      <span className="text-3xl text-orange-500">
                                        &#9733;
                                      </span>
                                      <span className="text-3xl text-orange-500">
                                        &#9733;
                                      </span>
                                      <span className="text-3xl text-orange-500">
                                        &#9733;
                                      </span>
                                    </div>
                                    <p className="font-semibold text-xl">
                                      Food & Courier
                                    </p>
                                  </div>
                                  <div className="mt-10 font-semibold">
                                    <div className="flex justify-between">
                                      <p>{t("Food")}</p>
                                      <div className="flex items-center">
                                        <p>
                                          9.5
                                          <span className="text-3xl text-orange-500">
                                            &#9733;
                                          </span>
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex justify-between">
                                      <p>{t("Courier")}</p>
                                      <div className="flex items-center">
                                        <p>
                                          8.0
                                          <span className="text-3xl text-orange-500">
                                            &#9733;
                                          </span>
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                        {/* ========================= */}
                        <div className="flex gap-4 mt-10">
                          <div className="w-[67%] rounded-xl">
                            <div className="flex gap-4 items-center">
                              <p className="text-2xl font-bold font-norms">
                                {t("Orders by returning and new customers")}
                              </p>
                              <span className="text-2xl text-red-500">
                                <IoIosInformationCircleOutline />
                              </span>
                            </div>
                            <div className="font-norms flex gap-5 mt-5 mb-10">
                              <div className="flex items-center gap-4 text-lg text-gray-500 font-semibold">
                                <span className="w-5 h-5 bg-blue-700"></span>
                                <div>
                                  <div className="flex gap-2 items-center ">
                                    <p className="leading-5">
                                      {t("Order by returing")} <br />{" "}
                                      {t("customer")}{" "}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              {/* ============ */}
                              <div className="flex items-center gap-4 text-lg text-gray-500 font-semibold">
                                <span className="w-5 h-5 bg-orange-500"></span>
                                <div>
                                  <div className="flex gap-2 items-center ">
                                    <p className="leading-5">
                                      {t("Order by  new")} <br />{" "}
                                      {t("customers")}{" "}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <LineChart options={myOptions} data={myData} />
                          </div>
                          <div className="w-[33%] rounded-lg flex flex-col px-5 p">
                            <p className="font-bold text-2xl">
                              {t("Returning & new customer")}
                            </p>
                            <p className="text-base my-5">
                              {t(
                                "See how many successful order made by new and returning customer."
                              )}
                            </p>
                            <div className="w-full h-full flex justify-center">
                              <div className="w-[70%] mt-20">
                                <DonutChart data={homeChartData} />
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* ====================== */}
                        <div className="w-full my-10">
                          <div className="flex gap-4 items-center">
                            <p className="text-2xl font-bold font-norms">
                              {t("Customer visits")}
                            </p>
                            <span className="text-2xl text-red-500">
                              <IoIosInformationCircleOutline />
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-lg text-gray-500 font-semibold">
                            <span className="w-5 h-5 bg-blue-700"></span>
                            <div>
                              <div className="flex gap-2 items-center mt-8">
                                <p className="leading-5">
                                  {t("Total visits")}{" "}
                                </p>
                              </div>
                              <p className="text-black text-xl">5</p>
                            </div>
                          </div>
                          <div>
                            <LineChart options={myOptions} data={myData} />
                          </div>
                        </div>

                        <div className="w-full my-10">
                          <div className="flex gap-4 items-center">
                            <p className="text-2xl font-bold font-norms">
                              {t("Conversion ratio")}
                            </p>
                            <span className="text-2xl text-red-500">
                              <IoIosInformationCircleOutline />
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-lg text-gray-500 font-semibold">
                            <span className="w-5 h-5 bg-blue-700"></span>
                            <div>
                              <div className="flex gap-2 items-center mt-8">
                                <p className="leading-5">
                                  {t("Order to accept")}{" "}
                                </p>
                              </div>
                              <p className="text-black text-xl">5.78%</p>
                            </div>
                          </div>
                          <div>
                            <LineChart options={myOptions} data={myData} />
                          </div>
                        </div>

                        <div className="w-full my-10">
                          <div className="flex gap-4 items-center">
                            <p className="text-2xl font-bold font-norms">
                              {t("Tips")}
                            </p>
                            <span className="text-2xl text-red-500">
                              <IoIosInformationCircleOutline />
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-lg text-gray-500 font-semibold">
                            <span className="w-5 h-5 bg-blue-700"></span>
                            <div>
                              <div className="flex gap-2 items-center mt-8">
                                <p className="leading-5">{t("Total Tip")} </p>
                              </div>
                              <p className="text-black text-xl">5.78CHF</p>
                            </div>
                          </div>
                          <div>
                            <LineChart options={myOptions} data={myData} />
                          </div>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                  </>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
      }
    />
  );
}
