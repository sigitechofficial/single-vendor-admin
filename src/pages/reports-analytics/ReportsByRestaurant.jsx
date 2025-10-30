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
import { HiOutlineDocumentDownload } from "react-icons/hi";
import { Calendar } from "primereact/calendar";
import GetAPI from "../../utilities/GetAPI";
import { PostAPI } from "../../utilities/PostAPI";
import axios from "axios";
import { BASE_URL } from "../../utilities/URL";
import dayjs from "dayjs";
import { FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
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

const ReportsByRestaurant = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [data, setData] = useState("");
  const [orderReports, setOrderReports] = useState("");
  const filterOptions = GetAPI("admin/filterOptions");
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("Summary Report");
  const [filterSearch, setFilterSearch] = useState({
    zone: { value: 0, label: "All Zones" },
    rest: { value: 0, label: "All Restautants" },
    startDate: null,
    endDate: null,
    dateType: { value: "allTime", label: "All time" },
  });

  const [dates, setDates] = useState({
    startDate: null,
    endDate: null,
  });
  console.log("🚀 ~ ReportsByRestaurant ~ dates:", dates);

  const [modal, setModal] = useState({
    modType: false,
    loader: false,
    applyFilter: false,
  });

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
  if (tab === "Summary Report") {
    var columns = [
      { field: "sn", header: t("serialNo") },
      {
        field: "restaurantName",
        header: t("restaurantName"),
      },
      {
        field: "totalOrders",
        header: t("Total Orders"),
      },
      {
        field: "deliveredOrders",
        header: t("Delivered Orders"),
      },
      {
        field: "cancelledOrders",
        header: t("Cancelled Orders"),
      },
      {
        field: "deliveryOrders",
        header: t("Delivery Orders"),
      },
      {
        field: "pickupOrders",
        header: t("Pickup Orders"),
      },
      {
        field: "delivered",
        header: t("Delivered %"),
      },
      {
        field: "cancelled",
        header: t("Cancelled %"),
      },
      {
        field: "delivery",
        header: t("Delivery %"),
      },
      {
        field: "pickup",
        header: t("Pickup %"),
      },
      {
        field: "totalSales",
        header: t("Total Sales"),
      },
      {
        field: "resEarning",
        header: t("Restaurant Earning"),
      },
      {
        field: "adminEarning",
        header: t("Admin Earning"),
      },
      {
        field: "revenue",
        header: t("Revenue"),
      },
    ];
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
        field: "averageorderValue",
        header: t("Average Order Value"),
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
        field: "paymentMethod",
        header: t("Payment Method"),
      },
    ];
  }
  const datas = [];
  if (tab === "Summary Report") {
    data?.data?.summary?.map((item, index) => {
      datas.push({
        sn: index + 1,
        restaurantName: item.restaurantName,
        totalOrders: item.totalOrders,
        deliveredOrders: item.deliveredOrders,
        cancelledOrders: item.cancelledOrders,
        deliveryOrders: item.deliveryOrders,
        pickupOrders: item.pickupOrders,
        delivered: Math.round((item.deliveredOrders / item.totalOrders) * 100),
        cancelled: Math.round((item.cancelledOrders / item.totalOrders) * 100),
        delivery: Math.round((item.deliveryOrders / item.totalOrders) * 100),
        pickup: Math.round((item.pickupOrders / item.totalOrders) * 100),
        totalSales: item?.totalSale,
        resEarning: item?.restaurantEarnings,
        adminEarning: item?.adminEarnings,
        revenue: item?.revenue,
      });
    });
  } else if (tab === "Sales Reports") {
    // data?.data?.sales?.map((item, index) => {
    //   datas.push({
    //     sn: index + 1,
    //     category: item.category,
    //     totalOrders: item.totalOrders,
    //     revenue: item.revenue,
    //     averageorderValue: item.averageOrderValue,
    //     completionRate: Math.round(item.completionRate * 100),
    //     rating: item.rating,
    //     avgDeliveryTime: item.avgDeliveryTime,
    //     newCustomers: item.newCustomers,
    //     cancellation: item.cancellation,
    //   });
    // });

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
    orderReports?.orders?.map((item, index) => {
      datas.push({
        sn: index + 1,
        orderId: item.id,
        orderDate: dayjs(item.createdAt).format("DD/MM/YYYY"),
        customerInfo: item?.userId,
        averageorderValue: "N/A",
        totalAmount: item?.orderCharge?.basketTotal,
        discount: item?.bannerDiscount,
        tax: "N/A",
        deliveryCharge: item?.orderCharge?.deliveryFees,
        paymentMethod: item?.paymentMethodName,
      });
    });
  }

  let gmonths = [];
  let gval = [];
  data?.data?.graphData?.map((month) => {
    gmonths.push(Object.keys(month)[0].slice(0, 3));
    gval.push(Object.values(month)[0]);
  });

  let label = Object.keys(orderReports?.reports?.monthlyEarnings || []);
  let values = Object.values(orderReports?.reports?.monthlyEarnings || []);

  const gData = {
    labels: gmonths,
    datasets: [
      {
        label: "Total Earning (CHF)",
        data: gval,
        backgroundColor: "#f45353",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 0,
        barThickness: 8,
        borderRadius: 20,
      },
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

  const restList = [{ value: null, label: "All Restaurants" }];
  const getRest = GetAPI("admin/getallrestaurants/restaurant");
  getRest?.data?.data?.map((el) => {
    restList.push({
      ...restList,
      value: el.id,
      label: el.businessName,
    });
  });

  const getOrderReports = async () => {
    let res = await PostAPI("admin/restOrderReports", {
      businessType: 1,
      zoneId: null,
      restaurantId: null,
      from: null,
      to: null,
    });

    if (res?.data?.status === "1") {
      setOrderReports(res?.data?.data);
    } else {
      setOrderReports("");
    }
  };

  useEffect(() => {
    getOrderReports();
  }, []);

  useEffect(() => {
    var config = {
      headers: {
        accessToken: localStorage.getItem("accessToken"),
      },
    };

    if (
      filterSearch?.zone?.value ||
      filterSearch?.rest?.value ||
      filterSearch?.endDate
    ) {
      const getFilteredData = async () => {
        let res = await PostAPI("admin/zoneWiseRestaurantAnalytics", {
          zoneId: filterSearch.zone.value || null,
          restaurantId: filterSearch.rest.value,
          startDate: filterSearch?.startDate ?? null,
          endDate: filterSearch?.endDate ?? null,
        });

        if (res?.data?.status == "1") {
          setData(res?.data);
        }
      };
      getFilteredData();
    } else {
      const fetchData = () => {
        axios
          .get(BASE_URL + "admin/restaurantAnalytics", config)
          .then((dat) => {
            setData(dat.data);
          });
      };

      fetchData();
    }
  }, [filterSearch.zone.value, filterSearch.rest.value, filterSearch?.endDate]);

  useEffect(() => {
    const { startDate, endDate } = getDateRange(filterSearch?.dateType?.value, [
      filterSearch?.startDate,
      filterSearch?.endDate,
    ]);

    setFilterSearch({ ...filterSearch, startDate, endDate });
  }, [filterSearch?.dateType?.value]);

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
                  {t("Restaurant Reports")}
                </h2>
                <p>Monitor Restaurant's business analytics & reports</p>
              </div>
              <div className="flex gap-x-3 items-center">
                <div>
                  <Select
                    styles={customStyles}
                    placeholder="All Zone"
                    name="zones"
                    options={zoneOptions}
                    onChange={(e) => {
                      setFilterSearch({
                        ...filterSearch,
                        zone: zoneOptions.find((el) => el.value === e?.value),
                      });
                    }}
                    value={filterSearch?.zone}
                  />
                </div>
                <div>
                  <Select
                    styles={customStyles}
                    placeholder="All Restaurant"
                    name=""
                    options={restList}
                    onChange={(e) => {
                      setFilterSearch({
                        ...filterSearch,
                        rest: restList.find((el) => el.value === e?.value),
                      });
                    }}
                    value={filterSearch?.rest}
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
                      filterSearch?.dateType?.value === "customDate"
                        ? {
                            value: "customDate",
                            label: dates?.startDate + "-" + dates?.endDate,
                          }
                        : filterSearch?.dateType
                    }
                    onChange={(e) => {
                      if (e?.value === "customDate") {
                        // Only open modal; don't apply filter yet
                        setModal({ ...modal, modType: true });
                        setFilterSearch({
                          ...filterSearch,
                          dateType: e,
                        });
                      } else {
                        // For other types, apply immediately
                        setFilterSearch({
                          ...filterSearch,
                          dateType: e,
                        });
                      }
                    }}
                  />
                </div>
                <button className="bg-[#f4f4f4] rounded-md border-gray-300 border-[1px] px-4 py-1.5 text-gray-500 flex items-center gap-x-1">
                  <HiOutlineDocumentDownload /> Download
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
                {!filterSearch?.rest?.value && (
                  <div className="col-span-3 space-y-5">
                    <ReportsRedCard
                      total={data?.data?.totalRestaurants}
                      title={t("Total Registered")}
                      image="store"
                      tab={tab}
                    />
                  </div>
                )}
                <div
                  className={`${
                    filterSearch?.rest?.value ? "col-span-6" : "col-span-3"
                  } relative`}
                >
                  <ReportsRedCard
                    total={data?.data?.totalItems}
                    title={t("Total Items")}
                    subtitle={`New Items : ${data?.data?.newItems ?? 0}`}
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
                  <div className="col-span-6 grid grid-cols-2 py-4 items-center justify-items-center [&>div]:text-center  [&>div]:font-norms [&>div]:font-medium [&>div>p]:text-2xl">
                    <div>
                      <p className="text-green-500">
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
                  <Barchart data={gData} />
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
                    Total Restaurant
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
                    total={data?.data?.salesReport?.grossSale?.toFixed(2)}
                    title={t("Gross Sale")}
                    image="home-1"
                    tab={tab}
                  />
                </div>
                <div className="col-span-4 space-y-5">
                  <ReportsRedCard
                    total="10 static"
                    title={t("Total Tax")}
                    image="home-1"
                    tab={tab}
                  />
                </div>
                <div className="col-span-4 space-y-5">
                  <ReportsRedCard
                    total="67.00CHF static"
                    title={t("Total Commission")}
                    image="home-1"
                    tab={tab}
                  />
                </div>
              </div>

              <div className="grid grid-cols-12 gap-x-5">
                <div className="col-span-9 bg-red-100 rounded-md p-10">
                  <Barchart />
                </div>
                <div className="col-span-3 bg-red-100 rounded-md p-10 font-norms">
                  <h4 className="text-xl font-bold">
                    Total Restaurant Earnings
                  </h4>
                  <p className="font-medium text-sm my-3">
                    See your store earning statistics
                  </p>
                  <div className="my-10">
                    <Dounut
                      dataList={[
                        data?.data?.salesReport?.earnings?.onlineEarnings,
                        data?.data?.salesReport?.earnings?.codEarnings,
                      ]}
                      text={0}
                    />
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
                      <p className="text-green-600">100.00CHF</p>
                      <p>Completed</p>
                    </div>
                    <div>
                      <p className="text-blue-600">100.00CHF</p>
                      <p>In progress</p>
                    </div>
                    <div>
                      <p className="text-red-500">100.00CHF</p>
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
                      <p className="text-green-600">100.00CHF</p>
                      <p>Coupon Discount</p>
                    </div>

                    <div>
                      <p className="text-blue-600">100.00CHF</p>
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
                  <div className="h-full flex items-center">
                    <Dounut
                      dataList={[
                        orderReports?.reports?.paymentMethods?.Adyen,
                        orderReports?.reports?.paymentMethods?.COD,
                      ]}
                      text={orderReports?.reports?.totalOrders}
                    />
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
              setFilterSearch({
                ...filterSearch,
                // dateType: { value: "allTime", label: "All time" },
                startDate: null,
                endDate: null,
              });

              setModal({ ...modal, modType: false });
            }}
            isOpen={modal.modType}
            size={"lg"}
            isCentered
          >
            <ModalOverlay />
            <ModalContent borderRadius="20px" overflow="hidden">
              <ModalHeader padding={0}></ModalHeader>
              <div
                onClick={() => {
                  setFilterSearch({
                    ...filterSearch,
                    dateType: { value: "allTime", label: "All time" },
                    startDate: null,
                    endDate: null,
                  });

                  setModal({ ...modal, modType: false });
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
                      setModal({ ...modal, modType: false });
                      setFilterSearch({
                        ...filterSearch,
                        startDate: dates?.startDate,
                        endDate: dates?.endDate,
                      });
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

export default ReportsByRestaurant;
