import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import { FaArrowLeft } from "react-icons/fa6";
import ReportsCard from "../../components/ReportsCard";
import { DonutChart } from "../../components/DonutChart";
import GetAPI from "../../utilities/GetAPI";
import { Line } from "react-chartjs-2";
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
import { useTranslation } from "react-i18next";
import { PostAPI } from "../../utilities/PostAPI";
import Select from "react-select";
import { getDateRange } from "../../utilities/dateRangefilterfunction";

const dateFilters = [
  { value: "allTime", label: "All time" },
  { value: "currentYear", label: "Current Year" },
  { value: "currentMonth", label: "Current Month" },
  { value: "currentWeek", label: "Current Week" },
  { value: "customDate", label: "Custom Date" },
];

export default function SalesReport() {
  const { t } = useTranslation();

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

  // Filters state
  const [filterData, setFilterData] = useState({
    zone: null,
    restaurant: null,
    from: "",
    to: "",
    dateType: null,
  });

  const [dates, setDates] = useState({ startDate: "", endDate: "" });
  const [modal, setModal] = useState(false);

  // Data state
  const [graphData, setGraphData] = useState("");

  // Fetch filter options for zones and restaurants
  const filterOptions = GetAPI("admin/filterOptions");
  const getRest = GetAPI("admin/getallrestaurants/restaurant");

  // Prepare zone options (with "All zones" default)
  const zoneOptions = [{ value: null, label: "All zones" }];
  filterOptions?.data?.data?.zones?.forEach((zone) => {
    zoneOptions.push({
      value: zone.id,
      label: zone.name,
    });
  });

  // Prepare restaurant options (with "All Restaurant" default)
  const restList = [{ value: null, label: "All Restaurant" }];
  getRest?.data?.data?.forEach((el) => {
    restList.push({
      value: el.id,
      label: el.businessName,
    });
  });

  // Handle date filter changes (including showing modal for custom dates)
  const handleDateFilterChange = (e) => {
    if (e.value === "customDate") {
      setModal(true);
      setFilterData({
        ...filterData,
        dateType: e,
      });
      setDates({ startDate: "", endDate: "" });
    } else {
      const { startDate, endDate } = getDateRange(e.value, []);
      setFilterData({
        ...filterData,
        dateType: e,
        from: startDate,
        to: endDate,
      });
      setDates({ startDate: "", endDate: "" });
    }
  };

  // Confirm custom date selection modal
  const handleCustomDateConfirm = () => {
    if (dates.startDate && dates.endDate) {
      setFilterData({
        ...filterData,
        from: dates.startDate,
        to: dates.endDate,
      });
      setModal(false);
    }
  };

  // Fetch data when filters change
  const getData = async () => {
    let res = await PostAPI("admin/salesReports", {
      zoneId: filterData.zone?.value || null,
      restaurantId: filterData.restaurant?.value || null,
      startDate: filterData.from || null,
      endDate: filterData.to || null,
    });

    if (res?.data?.status === "1") {
      setGraphData(res?.data?.data);
    } else {
      setGraphData("");
    }
  };

  useEffect(() => {
    getData();
  }, [filterData.zone, filterData.restaurant, filterData.from, filterData.to]);

  const deliveryOrdersEarnings =
    (parseInt(graphData?.deliveryOrdersEarnings) * 100) /
    parseInt(graphData?.totalEarning);

  const selfpickupOrdersEarnings =
    (parseInt(graphData?.selfpickupOrdersEarnings) * 100) /
    parseInt(graphData?.totalEarning);

  const orderChartData = {
    labels: [
      `Delivery - ${deliveryOrdersEarnings.toFixed(2)}%`,
      `Pickup - ${selfpickupOrdersEarnings.toFixed(2)}%`,
    ],
    datasets: [
      {
        label: "# of Votes",
        data: [deliveryOrdersEarnings, selfpickupOrdersEarnings],
        backgroundColor: ["#1448CD", "#EC6C30"],
        borderColor: ["#1448CD", "#EC6C30"],
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
  const labels =
    graphData?.totalOrders?.map((item) => Object.keys(item)[0]) || [];
  const totalOrders =
    graphData?.totalOrders?.map((item) => Object.values(item)[0]) || [];
  const data = {
    labels,
    datasets: [
      {
        label: "Total Orders",
        data: totalOrders,
        borderColor: "#1448CD",
        backgroundColor: "#1448CD",
        fill: false,
        tension: 0.1, // smooth lines (optional)
      },
    ],
  };

  return (
    <Layout
      content={
        <div className="bg-themeGray p-5 space-y-5">
          <div className="flex gap-5 items-center">
            <button
              className="bg-white p-2 rounded-full"
              onClick={() => window.history.back()}
              data-testid="sales-back-btn"
            >
              <FaArrowLeft />
            </button>
            <div className="w-full flex justify-between items-center">
              <div>
                <h2 className="text-themeRed text-lg font-bold font-norms">
                  {t("Sales Report")}
                </h2>
              </div>
                <div className="flex gap-x-3 items-center">
                <div>
                  <Select
                    styles={customStyles}
                    placeholder="All Zone"
                    options={zoneOptions}
                    onChange={(e) => setFilterData({ ...filterData, zone: e })}
                    value={filterData.zone}
                    data-testid="sales-zone-select-input"
                  />
                </div>
                <div>
                  <Select
                    styles={customStyles}
                    placeholder="All Restaurants"
                    options={restList}
                    onChange={(e) =>
                      setFilterData({ ...filterData, restaurant: e })
                    }
                    value={filterData.restaurant}
                    data-testid="sales-restaurant-select-input"
                  />
                </div>
                <div>
                  <Select
                    styles={customStyles}
                    className={
                      dates.startDate && dates.endDate ? "w-max" : `w-[150px]`
                    }
                    placeholder="Date Filter"
                    options={dateFilters}
                    value={
                      dates.startDate &&
                      dates.endDate &&
                      filterData.dateType?.value === "customDate"
                        ? {
                            value: "customDate",
                            label: dates.startDate + "-" + dates.endDate,
                          }
                        : filterData.dateType
                    }
                    onChange={handleDateFilterChange}
                    data-testid="sales-datefilter-select-input"
                  />
                </div>
                <button className="bg-[#f4f4f4] rounded-md border-gray-300 border-[1px] px-4 py-1.5 text-gray-500" data-testid="sales-download-btn">
                  Download
                </button>
              </div>
            </div>
          </div>

          {/* Custom Date Modal */}
          {modal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white rounded-lg p-6 w-96 relative">
                <button
                  onClick={() => setModal(false)}
                  className="absolute top-2 right-2 text-black text-2xl font-bold"
                >
                  &times;
                </button>
                <div className="space-y-3">
                  <p className="font-semibold font-switzer">Start Date</p>
                  <input
                    className="w-full h-[56px] bg-gray-100 px-4 rounded-lg"
                    type="date"
                    value={dates.startDate}
                    onChange={(e) =>
                      setDates({ ...dates, startDate: e.target.value })
                    }
                  />
                  <p className="font-semibold font-switzer">End Date</p>
                  <input
                    className="w-full h-[56px] bg-gray-100 px-4 rounded-lg"
                    type="date"
                    value={dates.endDate}
                    onChange={(e) =>
                      setDates({ ...dates, endDate: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 mt-6">
                  <button
                    className="border border-black py-2 rounded-md font-semibold"
                    onClick={() => setModal(false)}
                  >
                    {t("Cancel")}
                  </button>
                  <button
                    className="bg-red-500 text-white py-2 rounded-md font-semibold"
                    onClick={handleCustomDateConfirm}
                  >
                    {t("Confirm")}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-9 space-y-5">
              <div className="grid grid-cols-3 gap-5">
                <ReportsCard
                  total={`$${graphData?.totalSales || 0}`}
                  title={t("Total Sales")}
                  image="home-1"
                />
                <ReportsCard
                  total={`$${
                    graphData?.totalRestaurantSales?.toFixed(2) || "0.00"
                  }`}
                  title={t("Total Sales (By Restaurant)")}
                  image="home-1"
                />
                <ReportsCard
                  total={`$${graphData?.totalStoreSales || 0}`}
                  title={t("Total Sales (By Stores)")}
                  image="home-1"
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
                <DonutChart data={orderChartData} />
              </div>
            </div>
          </div>
        </div>
      }
    />
  );
}
