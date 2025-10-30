import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Layout from "../../components/Layout";
import Helment from "../../components/Helment";
import MyDataTable from "../../components/MyDataTable";
import Loader from "../../components/Loader";
import GetAPI from "../../utilities/GetAPI";
import RedButton, { EditButton } from "../../utilities/Buttons";
import { useNavigate } from "react-router-dom";
import Switch from "react-switch";
import { PostAPI } from "../../utilities/PostAPI";
import { info_toaster, success_toaster } from "../../utilities/Toaster";
import Select from "react-select";

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

export default function Zones() {
  const { t } = useTranslation();
  const filterOptions = GetAPI("admin/filterOptions");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  const [filterData, setFilterData] = useState({
    city: null,
  });

  // Get zones data with filters
  const getZonesData = async () => {
    
    try {
      let res = await PostAPI("admin/getAllZoneOfCity", {
        cityId: filterData?.city?.value || null,
      });
      if (res?.data?.status === "1") {
        setData(res?.data);
      } else {
        setData({ data: [] });
      }
    } catch (error) {
      console.error("Error fetching zones data:", error);
      setData({ data: [] });
    }
    setLoading(false);
  };

  const zonesData = () => {
    const filteredData = data?.data?.filter((dat) => {
      return (
        search === "" ||
        (dat?.id && dat?.id.toString().includes(search.toLowerCase())) ||
        (dat?.name && dat?.name.toLowerCase().includes(search.toLowerCase()))
      );
    });
    return filteredData;
  };

  const updateZoneField = async (zoneId, field, status) => {
    const res = await PostAPI("admin/updateZoneField", {
      zoneId,
      field,
      status,
    });

    if (res?.data?.status === "1") {
      getZonesData();
      success_toaster(res?.data?.message);
    } else {
      info_toaster(res?.data?.message);
    }
  };

  // City options for filter
  let cityOptions = [
    {
      value: null,
      label: "All Cities",
    },
  ];
    
  filterOptions?.data?.data?.city?.map((city) => {
    cityOptions.push({
      value: city.id,
      label: city.name,
    });
  });

  useEffect(() => {
    getZonesData();
  }, [filterData?.city?.value]);

  const columns = [
    { field: "sn", header: t("Serial No") },
    { field: "id", header: t("Zone Id") },
    {
      field: "name",
      header: t("Business Zone Name"),
    },
    {
      field: "baseCharges",
      header: t("Base Charges"),
    },
    {
      field: "maxDeliveryCharges",
      header: t("Max Delivery Charges"),
    },
    {
      field: "vendors",
      header: t("Vendors"),
    },
    {
      field: "deliveryman",
      header: t("Deliveryman"),
    },
    {
      field: "status",
      header: t("Status"),
    },
    {
      field: "digitalPayment",
      header: t("Digital Payment"),
    },
    {
      field: "cod",
      header: t("COD"),
    },
    {
      field: "action",
      header: t("Action"),
    },
  ];

  const datas = [];
  const csv = [];
  zonesData()?.map((values, index) => {
    csv.push({
      sn: index + 1,
      id: values?.id,
      name: values?.name,
      restaurantName: values?.restaurant?.businessName,
      baseCharges: values?.zoneDetail?.baseCharges,
      maxDeliveryCharges: values?.zoneDetail?.maxDeliveryCharges,
    });
    return datas.push({
      sn: index + 1,
      id: values?.id,
      name: values?.name,
      restaurantName: values?.restaurant?.businessName,
      baseCharges: values?.zoneDetail?.baseCharges,
      maxDeliveryCharges: values?.zoneDetail?.maxDeliveryCharges,
      vendors: values?.zoneRestaurants?.length,
      deliveryman: values?.driverZones?.length,
      status: (
        <label>
          <Switch
            onChange={() => {
              updateZoneField(
                values?.id,
                "status",
                values?.status ? false : true
              );
            }}
            checked={values?.status}
            uncheckedIcon={false}
            checkedIcon={false}
            onColor="#139013"
            onHandleColor="#fff"
            className="react-switch"
            boxShadow="none"
          />
        </label>
      ),
      digitalPayment: (
        <label>
          <Switch
            onChange={() => {
              updateZoneField(
                values?.id,
                "digitalPayment",
                values?.digitalPayment ? false : true
              );
            }}
            checked={values?.digitalPayment}
            uncheckedIcon={false}
            checkedIcon={false}
            onColor="#139013"
            onHandleColor="#fff"
            className="react-switch"
            boxShadow="none"
          />
        </label>
      ),
      cod: (
        <label>
          <Switch
            onChange={() => {
              updateZoneField(values?.id, "COD", values?.COD ? false : true);
            }}
            checked={values?.COD}
            uncheckedIcon={false}
            checkedIcon={false}
            onColor="#139013"
            onHandleColor="#fff"
            className="react-switch"
            boxShadow="none"
          />
        </label>
      ),
      action: (
        <div className="flex items-center gap-1">
          <RedButton
            text={t("Update")}
            onClick={() => {
              navigate("/update-zone", {
                state: {
                  zoneData: values,
                },
              });
            }}
          />
          {/* <EditButton
            text={t("View Details")}
            onClick={() => {
              viewDetails(values?.id);
            }}
          /> */}
        </div>
      ),
    });
  });

  return loading ? (
    <Loader />
  ) : (
    <Layout
      content={
        <div className="bg-themeGray p-5">
          <div className="bg-white rounded-lg p-5">
            <div className="flex justify-between items-center flex-wrap gap-5">
              <h2 className="text-themeRed text-lg font-bold font-norms">
                {t("All Zones")}
              </h2>
              <div className="flex gap-3 items-center flex-wrap relative z-10">
                <div>
                  <Select
                    styles={customStyles}
                    placeholder="All Cities"
                    name=""
                    options={cityOptions}
                    onChange={(e) => {
                      setFilterData({ ...filterData, city: e });
                    }}
                    value={filterData?.city}
                  />
                </div>
                <Helment
                  search={true}
                  searchOnChange={(e) => setSearch(e.target.value)}
                  searchValue={search}
                  csvdata={csv}
                />
                <div className="flex gap-2">
                  <RedButton
                    text={t("Add New Zone")}
                    onClick={() => {
                      navigate("/add-new-zone");
                    }}
                  />
                </div>
              </div>
            </div>

            <div>
              <MyDataTable columns={columns} data={datas} />
            </div>
          </div>
        </div>
      }
    />
  );
}
