import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import { FaArrowLeft } from "react-icons/fa6";
import ReportsCard from "../../components/ReportsCard";
import { DonutChart } from "../../components/DonutChart";
import MyDataTable from "../../components/MyDataTable";
import GetAPI from "../../utilities/GetAPI";
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

export default function OrderMetrics() {
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

  // Filter state
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
  const [data, setData] = useState("");

  // Fetch filter options
  const filterOptions = GetAPI("admin/filterOptions");
  const getRest = GetAPI("admin/getallrestaurants/restaurant");

  // Prepare zone options with "All zones" default
  const zoneOptions = [{ value: null, label: "All zones" }];
  filterOptions?.data?.data?.zones?.forEach((zone) => {
    zoneOptions.push({
      value: zone.id,
      label: zone.name,
    });
  });

  // Prepare restaurant options with "All Restaurant" default
  const restList = [{ value: null, label: "All Restaurant" }];
  getRest?.data?.data?.forEach((el) => {
    restList.push({
      value: el.id,
      label: el.businessName,
    });
  });

  // Handle date filter changes (including custom date modal)
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

  // Confirm custom date modal
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

  // Fetch order metrics data based on filters
  const getData = async () => {
    let res = await PostAPI("admin/orderMetrics", {
      zoneId: filterData.zone?.value || null,
      restaurantId: filterData.restaurant?.value || null,
      startDate: filterData.from || null,
      endDate: filterData.to || null,
    });

    if (res?.data?.status === "1") {
      setData(res.data.data);
    } else {
      setData("");
    }
  };

  useEffect(() => {
    getData();
  }, [filterData.zone, filterData.restaurant, filterData.from, filterData.to]);

  // Calculate percentages for donut chart
  const preparingOrders =
    (parseInt(data?.PreparingOrders) * 100) / parseInt(data?.totalOrders) || 0;
  const pickOrders =
    (parseInt(data?.pickOrders) * 100) / parseInt(data?.totalOrders) || 0;
  const placedOrders =
    (parseInt(data?.PlacedOrders) * 100) / parseInt(data?.totalOrders) || 0;

  const OrderMetricsData = {
    labels: [
      `Preparing Orders - ${preparingOrders.toFixed(2)}%`,
      `Ready for Pick Up - ${pickOrders.toFixed(2)}%`,
      `Order Placed - ${placedOrders.toFixed(2)}%`,
    ],
    datasets: [
      {
        label: "# of Orders",
        data: [preparingOrders, pickOrders, placedOrders],
        backgroundColor: ["#FF5329", "#79E0AC", "#379465"],
        borderColor: ["#FF5329", "#79E0AC", "#379465"],
        borderWidth: 1,
      },
    ],
  };

  const columns = [
    { field: "sn", header: "Serial. No" },
    { field: "moduleType", header: t("Module Type") },
    { field: "totalOrders", header: t("Total Orders") },
    { field: "completedOrders", header: t("Completed Orders") },
    { field: "pendingOrders", header: t("Pending Orders") },
    { field: "cancelledOrders", header: t("Cancelled Orders") },
    { field: "averageOrder", header: t("Average Order Value") },
  ];

  const datas = [
    {
      sn: "1",
      moduleType: "Restaurant",
      totalOrders: data?.restTotalOrders,
      completedOrders: data?.restCompleteOrders,
      pendingOrders: data?.restPendingOrders,
      cancelledOrders: data?.restCancelledOrders,
      averageOrder: data?.restAverageOrder
        ? data.restAverageOrder.toFixed(2)
        : "0.00",
    },
    {
      sn: "2",
      moduleType: "Store",
      totalOrders: data?.storeTotalOrders,
      completedOrders: data?.storeCompleteOrders,
      pendingOrders: data?.storePendingOrders,
      cancelledOrders: data?.storeCancelledOrders,
      averageOrder: data?.storeAverageOrder
        ? data.storeAverageOrder.toFixed(2)
        : "0.00",
    },
  ];

  return (
    <Layout
      content={
        <div className="bg-themeGray p-5 space-y-5">
          <div className="flex gap-5 items-center">
            <button
              className="bg-white p-2 rounded-full"
              onClick={() => window.history.back()}
              data-testid="ordermetrics-back-btn"
            >
              <FaArrowLeft />
            </button>
            <div className="w-full flex justify-between items-center">
              <div>
                <h2 className="text-themeRed text-lg font-bold font-norms">
                  {t("Customer Analytics")}
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
                    data-testid="ordermetrics-zone-select-input"
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
                    data-testid="ordermetrics-restaurant-select-input"
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
                    data-testid="ordermetrics-datefilter-select-input"
                  />
                </div>
                <button className="bg-[#f4f4f4] rounded-md border-gray-300 border-[1px] px-4 py-1.5 text-gray-500" data-testid="ordermetrics-download-btn">
                  Download
                </button>
              </div>
            </div>
          </div>

          {/* Filters */}

          {/* Modal for Custom Date */}
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
            <div className="grid grid-cols-3 col-span-8 gap-5">
              <ReportsCard
                total={data?.totalOrders}
                title={t("Total Orders")}
                image="home-3"
              />
              <ReportsCard
                total={data?.deliveryOrders}
                title={t("Delivery Order")}
                image="home-3"
              />
              <ReportsCard
                total={data?.selfPickupOrders}
                title={t("Pickup Order")}
                image="home-3"
              />
              <ReportsCard
                total={data?.scheduleOrders}
                title={t("Schedule Orders")}
                image="home-3"
              />
              <ReportsCard
                total={data?.completeOrders}
                title={t("Completed Orders")}
                image="home-3"
              />
              <ReportsCard
                total={data?.cancelOrders}
                title={t("Cancelled Orders")}
                image="home-3"
              />
            </div>

            <div className="bg-white p-2.5 rounded-md shadow-lg space-y-10 col-span-4">
              <div className="space-y-2">
                <h3 className="text-xl text-black font-semibold font-norms text-center">
                  {t("Overview Of Order Statuses")}
                </h3>
                <p className="text-themeBorderGray font-medium font-switzer text-sm text-center">
                  {t("Of all orders till today")}
                </p>
              </div>

              <div>
                <DonutChart data={OrderMetricsData} />
              </div>
            </div>
          </div>

          <div className="bg-white p-2.5 rounded-md shadow-lg">
            <MyDataTable columns={columns} data={datas} />
          </div>
        </div>
      }
    />
  );
}
