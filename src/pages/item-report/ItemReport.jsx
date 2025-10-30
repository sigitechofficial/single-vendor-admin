import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import RedButton, { BlackButton } from "../../utilities/Buttons";
import Helment from "../../components/Helment";
import MyDataTable from "../../components/MyDataTable";
import { FaEye } from "react-icons/fa";
import { MiniLoader } from "../../components/Loader";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { info_toaster, success_toaster } from "../../utilities/Toaster";
import { PostAPI } from "../../utilities/PostAPI";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import GetAPI from "../../utilities/GetAPI";
import { BASE_URL } from "../../utilities/URL";
dayjs.extend(isBetween);

const ItemReport = () => {
  const { t } = useTranslation();
  const [data, setData] = useState("");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [modType, setModType] = useState("info");
  const [loader, setLoader] = useState(false);
  const [customRange, setCustomRange] = useState({ start: null, end: null });
  const [filters, setFilters] = useState({
    businessType: null,
    zoneId: null,
    restaurantId: null,
    categoryId: null,
    selectedFilter: null,
    filterApplied: false,
  });

  const { data: zonesList } = GetAPI("admin/getAllZones");
  const { data: categoryList } = GetAPI("admin/getmenucategory");
  const { data: allStores } = GetAPI("admin/getAllStores");
  const { data: allRestaurants } = GetAPI("admin/getallrestaurants");

  let zoneOptions = [];
  zonesList?.data?.forEach((z) => {
    zoneOptions.push({
      value: z?.zoneDetail?.zoneId,
      label: z?.name,
    });
  });

  let categoryOptions = [];
  categoryList?.data?.map((item) => {
    categoryOptions.push({
      value: item?.RMCLink,
      label: item?.name,
    });
  });
  const businessOptions = [];
  const business =
    filters?.businessType?.value === 1 ? allRestaurants : allStores;

  business?.data?.map((item) => {
    businessOptions.push({
      value: item?.id,
      label: item?.businessName,
    });
  });
  const timeOptions = [
    {
      value: 1,
      label: "All Time",
    },
    {
      value: 2,
      label: "This Year",
    },
    {
      value: 3,
      label: "Previous Year",
    },
    {
      value: 4,
      label: "This Month",
    },
    {
      value: 5,
      label: "This Week",
    },
    {
      value: 6,
      label: "Custom",
    },
  ];

  const moduleOptions = [
    { value: 1, label: "Restaurant" },
    { value: 3, label: "Store" },
  ];

  const getItemReportData = async () => {
    let res = await PostAPI("admin/itemReports", {
      businessType: filters?.businessType?.value || null,
      zoneId: filters?.zoneId?.value || null,
      restaurantId: filters?.restaurantId?.value || null,
      categoryId: filters?.categoryId?.value || null,
      startDate: customRange?.start || null,
      endDate: customRange?.end || null,
    });
    if (res?.data?.status === "1") {
      setData(res?.data);
    } else {
      info_toaster(res?.data?.message);
    }
  };

  const searchData = () => {
    const filteredData = data?.data?.transformedData?.filter((item, idx) => {
      return (
        search === "" ||
        (item?.id && item?.id.toString().includes(search.toLowerCase())) ||
        (item?.productName &&
          item?.productName.toLowerCase().includes(search.toLowerCase())) ||
        (item?.restaurantName &&
          item?.restaurantName.toLowerCase().includes(search.toLowerCase()))
      );
    });

    return filteredData;
  };

  const columns = [
    { field: "sn", header: t("SN") },
    { field: "image", header: t("Image") },
    { field: "name", header: t("Name") },
    { field: "module", header: t("Module") },
    { field: "store", header: t("store") },
    { field: "stock", header: t("stock") },
    { field: "price", header: t("price") },
    { field: "totalSold", header: t("Total Sold") },
    { field: "totalDiscountgiven", header: t("Total Discount Given") },
    { field: "averageSaleValue", header: t("Average sale value") },
  ];

  const datas = [];
  searchData()?.map((item, idx) => {
    datas.push({
      sn: idx + 1,
      image: (
        <div className="flex items-center gap-x-2">
          <img
            className="rounded-md shrink-0 w-20 h-14 object-cover"
            src={BASE_URL + item?.image}
            alt={item?.productName}
          />
        </div>
      ),
      name: item?.productName,
      module: item?.module,
      store: item?.restaurantName,
      stock: item?.qty,
      sellCount: item?.totalSold,
      price: item?.units?.currencyUnit?.symbol + " " + item?.price,
      totalSold: item?.totalSold,
      totalDiscountgiven:
        item?.units?.currencyUnit?.symbol + " " + item?.totalDiscount,
      averageSaleValue:
        item?.units?.currencyUnit?.symbol + " " + item?.averageSaleValue,
    });
  });

  useEffect(() => {
    let startDate = null;
    let endDate = dayjs();

    switch (filters?.selectedFilter?.value) {
      case 2: // This Year
        startDate = dayjs().startOf("year");
        break;
      case 3: // Previous Year
        startDate = dayjs().subtract(1, "year").startOf("year");
        endDate = dayjs().subtract(1, "year").endOf("year");
        break;
      case 4: // This Month
        startDate = dayjs().startOf("month");
        break;
      case 5: // This Week
        startDate = dayjs().startOf("week");
        break;
      case 6: // Custom
        break;
      default: // All Time
        startDate = null;
        endDate = null;
    }

    setCustomRange({
      start: startDate ? startDate.format("YYYY-MM-DD") : null,
      end: endDate ? endDate.format("YYYY-MM-DD") : null,
    });
  }, [filters?.selectedFilter]);

  useEffect(() => {
    getItemReportData();
  }, []);

  return (
    <Layout
      content={
        <div className="bg-themeGray p-5">
          <div className="bg-white rounded-lg p-5">
            <div className="flex justify-between items-center flex-wrap gap-5">
              <h2 className="text-themeRed text-lg font-bold font-norms">
                <span className="text-2xl">💰</span> {t("Item Report")}
              </h2>
            </div>

            <div className="grid grid-cols-3 gap-5 mt-10">
              <div className="space-y-1">
                <Select
                  placeholder="All Modules"
                  name="type"
                  options={moduleOptions}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      businessType: e,
                    })
                  }
                  value={filters.businessType}
                  className="relative z-20"
                />
              </div>
              <div className="space-y-1">
                <Select
                  placeholder="All zones"
                  name="type"
                  options={zoneOptions}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      zoneId: e,
                    })
                  }
                  className="relative z-20"
                />
              </div>
              <div className="space-y-1">
                <Select
                  placeholder={
                    filters?.businessType?.value === 1
                      ? "All Restaurants"
                      : "All Stores"
                  }
                  name="type"
                  options={businessOptions}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      restaurantId: e,
                    })
                  }
                  value={filters?.restaurantId}
                  className="relative z-20"
                />
              </div>
              <div className="space-y-1">
                <Select
                  placeholder="All categories"
                  name="type"
                  options={categoryOptions}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      categoryId: e,
                    })
                  }
                  value={filters.categoryId}
                  className="relative z-10"
                />
              </div>
              <div className="space-y-1">
                <Select
                  placeholder="All time"
                  name="type"
                  options={timeOptions}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      selectedFilter: e,
                    })
                  }
                  value={filters?.selectedFilter}
                  className="relative z-10"
                />
              </div>

              {filters?.selectedFilter?.value === 6 && (
                <div className="w-full">
                  <input
                    className="bg-gray-100 rounded-md px-4 py-2.5 w-full"
                    type="date"
                    name="startDate"
                    id="startDate"
                    onChange={(e) => {
                      setCustomRange({ ...customRange, start: e.target.value });
                    }}
                  />
                </div>
              )}
              {filters?.selectedFilter?.value === 6 && (
                <div className="w-full">
                  <input
                    className="bg-gray-100 rounded-md px-4 py-2.5 w-full"
                    type="date"
                    name="endDate"
                    id="endDate"
                    onChange={(e) => {
                      setCustomRange({ ...customRange, end: e.target.value });
                    }}
                    value={customRange.end}
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-x-2 my-7">
              <RedButton
                text="Apply Filter"
                onClick={() => {
                  if (customRange.start > customRange.end) {
                    info_toaster("Start date can't greater than end date");
                  } else {
                    setFilters({ ...filters, filterApplied: true });
                    getItemReportData();
                  }
                }}
              />
            </div>
            <div className="flex justify-between items-center flex-wrap gap-5">
              <h2 className="text-themeRed text-lg font-bold font-norms">
                {t("Item Report Table")}
              </h2>
              <div className="flex gap-2 items-center flex-wrap">
                <Helment
                  search={true}
                  searchOnChange={(e) => {
                    setSearch(e.target.value);
                    searchData();
                  }}
                  searchValue={search}
                  csvdata={[]}
                />
              </div>

              <div className="w-full">
                {!filters?.filterApplied && datas?.length === 0 ? (
                  <div className="w-full h-96  flex justify-center items-center relative">
                    <MiniLoader />
                  </div>
                ) : filters?.filterApplied && datas?.length === 0 ? (
                  <div className="flex justify-center items-center text-2xl font-semibold">
                    <p>No data found</p>
                  </div>
                ) : (
                  <MyDataTable data={datas} columns={columns} />
                )}
              </div>
            </div>
          </div>

          <Modal
            onClose={() => setModal(false)}
            isOpen={modal}
            size={"lg"}
            isCentered
          >
            <ModalOverlay />
            <ModalContent>
              <ModalCloseButton />
              <ModalBody padding={4}>
                {loader ? (
                  <div className="h-[450px]">
                    <MiniLoader />
                  </div>
                ) : modType === "info" ? (
                  <div className="w-full space-y-4 my-8">
                    <h4 className="text-xl font-semibold text-center">
                      Account Transaction Information
                    </h4>
                    <div className="flex flex-col items-center">
                      <p>Method: ssl_commerz</p>
                      <p>Amount: $8768</p>
                      <p>Request time: 27 Nov 2023 12:43:pm</p>
                      <p>Reference: Deliveryman collect cash payments</p>
                    </div>

                    <div className="flex flex-col items-center">
                      <h4 className="text-lg font-semibold">
                        DeliveryMan Info
                      </h4>
                      <p>Name: Jhon Doe</p>
                      <p>Phone: 98786887</p>
                      <p>Address: R9PG+XCH, Dhaka District, BD</p>
                    </div>
                  </div>
                ) : (
                  // <div className="w-full flex justify-center gap-x-5 py-10 px-2">
                  //   <div className="w-full space-y-1">
                  //     <label className="font-semibold ml-1" htmlFor="startDate">
                  //       Start date
                  //     </label>
                  //     <input
                  //       className="bg-gray-100 rounded-md px-4 py-2 w-full"
                  //       type="date"
                  //       name="startDate"
                  //       id="startDate"
                  //       onChange={(e) => {
                  //         setCustomRange({ start: e.target.value });
                  //       }}
                  //     />
                  //   </div>
                  //   <div className="w-full space-y-1">
                  //     <label className="font-semibold ml-1" htmlFor="endDate">
                  //       Start date
                  //     </label>
                  //     <input
                  //       className="bg-gray-100 rounded-md px-4 py-2 w-full"
                  //       type="date"
                  //       name="endDate"
                  //       id="endDate"
                  //       onChange={(e) => {
                  //         setCustomRange({ end: e.target.value });
                  //       }}
                  //       value={customRange.end}
                  //     />
                  //   </div>
                  // </div>
                  ""
                )}
              </ModalBody>
            </ModalContent>
          </Modal>
        </div>
      }
    />
  );
};

export default ItemReport;
