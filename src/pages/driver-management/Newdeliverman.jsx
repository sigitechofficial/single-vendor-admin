import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next"; // Import useTranslation
import Layout from "../../components/Layout";
import Helment from "../../components/Helment";
import MyDataTable from "../../components/MyDataTable";
import RedButton, { BlackButton, EditButton } from "../../utilities/Buttons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import GetAPI from "../../utilities/GetAPI";
import Loader from "../../components/Loader";
import Switch from "react-switch";
import { PutAPI } from "../../utilities/PutAPI";
import { PostAPI } from "../../utilities/PostAPI";
import { error_toaster, success_toaster } from "../../utilities/Toaster";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../utilities/URL";
import Select from "react-select";

export default function Newdeliverman() {
  const { t } = useTranslation(); // Use the t function
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [filterModal, setFilterModal] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const filterOptions = GetAPI("admin/filterOptions");

  const [filterData, setFilterData] = useState({
    country: null,
    city: null,
    zone: null,
    driverType: null,
  });
  const [tempFilterData, setTempFilterData] = useState({
    country: null,
    city: null,
    zone: null,
    driverType: null,
  });
  const [cities, setCities] = useState([]);
  const [filterZones, setFilterZones] = useState([]);

  // Filter options
  const { data: CountryList } = GetAPI("admin/getAllCountries");

  // Handle cascading filters
  const handleGetCitiesByCountry = async (selectedCountryId) => {
    try {
      const res = await PostAPI("admin/countryWiseCities", {
        countryId: selectedCountryId,
      });

      if (res?.data?.status === "1") {
        setCities(res?.data?.data?.cities || []);
      } else {
        error_toaster(res?.data?.message || "Failed to fetch cities");
        setCities([]);
      }
    } catch (err) {
      console.error("Error fetching cities:", err);
      setCities([]);
    }
  };

  const handleGetZoneByCity = async (cityId) => {
    try {
      const res = await PostAPI("admin/cityWiseZones", {
        cityId: cityId,
      });
      if (res?.data?.status === "1") {
        setFilterZones(res?.data?.data?.zones || []);
      } else {
        error_toaster(res?.data?.message || "Failed to fetch zones");
        setFilterZones([]);
      }
    } catch (err) {
      console.error("Error fetching zones:", err);
      setFilterZones([]);
    }
  };

  // Prepare filter options
  let countryFilterOptions = [{ value: null, label: "All Countries" }];
  CountryList?.data?.countries?.forEach((country) => {
    if (country.status) {
      countryFilterOptions.push({
        value: country.id,
        label: country.name.trim(),
      });
    }
  });

  const cityFilterOptions = [{ value: null, label: "All Cities" }].concat(
    Array.isArray(cities)
      ? cities
          .filter((city) => city.status)
          .map((city) => ({
            value: city.id,
            label: city.name.trim(),
          }))
      : []
  );

  const zoneFilterOptions = [{ value: null, label: "All Zones" }].concat(
    Array.isArray(filterZones)
      ? filterZones.map((zone) => ({
          value: zone.id,
          label: zone.name.trim(),
        }))
      : []
  );

  // Driver type options
  const driverTypeOptions = [
    { value: null, label: "All Driver Types" },
    { value: "restaurant", label: "Restaurant" },
    { value: "freelancer", label: "Freelance" },
  ];

  // Get driver data with filters
  const getDriverData = async () => {
    const requestPayload = {
      countryId: filterData?.country?.value || null,
      cityId: filterData?.city?.value || null,
      zoneId: filterData?.zone?.value || null,
      driverType: filterData?.driverType?.value || null,
    };

    try {
      let res = await PostAPI("admin/blockDrivers", requestPayload);
      if (res?.data?.status === "1") {
        setData(res?.data);
      } else {
        setData({ data: [] });
        info_toaster(res?.data?.message || "No data found");
      }
    } catch (error) {
      console.error("Error fetching driver data:", error);
      setData({ data: [] });
      error_toaster("Failed to fetch driver data");
    }
    setLoading(false);
  };

  // Update status function
  const reFetch = () => {
    getDriverData();
  };

  const driverData = () => {
    const filteredData = data?.data?.filter((dat) => {
      return (
        search === "" ||
        (dat?.id && dat?.id.toString().includes(search.toLowerCase())) ||
        (dat?.email &&
          dat?.email.toLowerCase().includes(search.toLowerCase())) ||
        (dat?.phoneNum &&
          dat?.phoneNum.toLowerCase().includes(search.toLowerCase())) ||
        (dat?.driverType &&
          dat?.driverType.toLowerCase().includes(search.toLowerCase())) ||
        (dat?.referalCode &&
          dat?.referalCode.toLowerCase().includes(search.toLowerCase())) ||
        (dat?.driverZone?.zoneId &&
          String(dat?.driverZone?.zoneId)
            ?.toLowerCase()
            .includes(search.toLowerCase()))
      );
    });
    return filteredData;
  };

  const updateStatus = async (userId, userStatus, type) => {
    if (type === "accept") {
      let res = await PutAPI("admin/driverStatus", {
        driverId: userId,
        status: 1,
      });
      if (res?.data?.status === "1") {
        success_toaster(res?.data?.message);
        reFetch();
      } else {
        error_toaster(res?.data?.message);
      }
    } else if (type === "reject") {
      let res = await PostAPI("admin/rejectDriver", {
        driverId: userId,
      });
      if (res?.data?.status === "1") {
        success_toaster(res?.data?.message);
        reFetch();
      } else {
        error_toaster(res?.data?.message);
      }
    } else {
      navigate(`/driver-details/${userId}`, { state: { id: userId } });
    }
  };

  const openModal = () => {
    setModal(true);
  };

  //   const viewDetails = (id) => {
  //     navigate("/driver-details", {
  //       state: {
  //         id: id,
  //       },
  //     });
  //   };

  const columns = [
    { field: "sn", header: t("serialNo") },
    { field: "picture", header: t("Picture") },
    { field: "name", header: t("name") },
    { field: "email", header: t("email") },
    { field: "phone", header: t("phone") },
    { field: "action", header: t("action") },
  ];

  const datas = [];
  const csv = [];
  driverData()?.map((values, index) => {
    csv.push({
      sn: index + 1,
      id: values?.id,
      name: values?.name,
      email: values?.email,
      phone: values?.countryCode + " " + values?.phoneNum,
      balance: values?.balance,
      status: values?.status,
      action: values?.status === "Active" ? true : false,
    });
    return datas.push({
      sn: index + 1,
      picture: (
        <img
          className="w-32 h-32 object-cover rounded-full"
          src={BASE_URL + values?.image}
          alt=""
        />
      ),
      id: values?.id,
      name: values?.firstName + " " + values?.lastName,
      email: values?.email,
      phone: values?.countryCode + " " + values?.phoneNum,
      balance: "--",
      action: (
        <div className="flex items-center gap-3">
          <EditButton
            text={t("Accept")}
            onClick={() => updateStatus(values?.id, values?.status, "accept")}
          />

          <RedButton
            text={t("Reject")}
            onClick={() => updateStatus(values?.id, values?.status, "reject")}
          />
          <EditButton
            text={t("Details")}
            onClick={() => updateStatus(values?.id, values?.status, "details")}
          />
        </div>
      ),
    });
  });

  // Effect to fetch data when filters change
  useEffect(() => {
    getDriverData();
  }, [
    filterData?.country?.value,
    filterData?.city?.value,
    filterData?.zone?.value,
    filterData?.driverType?.value,
  ]);

  // Initialize cities and zones when component loads
  useEffect(() => {
    const initializeFilters = async () => {
      try {
        // Get all cities by passing null as countryId to get all cities
        const citiesRes = await PostAPI("admin/countryWiseCities", {
          countryId: null,
        });

        if (citiesRes?.data?.status === "1") {
          setCities(citiesRes?.data?.data?.cities || []);
        } else {
          // Fallback to filterOptions if available
          if (filterOptions?.data?.city) {
            setCities(filterOptions?.data?.city);
          }
        }

        // Get all zones by passing null as cityId to get all zones
        const zonesRes = await PostAPI("admin/cityWiseZones", {
          cityId: null,
        });

        if (zonesRes?.data?.status === "1") {
          setFilterZones(zonesRes?.data?.data?.zones || []);
        } else {
          // Fallback to filterOptions if available
          if (filterOptions?.data?.zones) {
            setFilterZones(filterOptions?.data?.zones);
          }
        }
      } catch (error) {
        console.error("Error initializing filters:", error);
        // Fallback to filterOptions
        if (filterOptions?.data) {
          setCities(filterOptions?.data?.city || []);
          setFilterZones(filterOptions?.data?.zones || []);
        }
      }
    };

    // Initialize immediately when component mounts
    initializeFilters();
  }, []); // Empty dependency array to run only once on mount

  // Also initialize when filterOptions becomes available (fallback)
  useEffect(() => {
    if (
      filterOptions?.data &&
      cities.length === 0 &&
      filterZones.length === 0
    ) {
      setCities(filterOptions?.data?.city || []);
      setFilterZones(filterOptions?.data?.zones || []);
    }
  }, [filterOptions?.data, cities.length, filterZones.length]);

  return loading ? (
    <Loader />
  ) : (
    <Layout
      content={
        <div className="bg-themeGray p-5">
          <div className="bg-white rounded-lg p-5">
            <div className="flex justify-between items-center flex-wrap gap-5">
              <h2 className="text-themeRed text-lg font-bold font-norms">
                {t("Driver Requests")}
              </h2>
              <div className="flex gap-2 items-center flex-wrap">
                <Helment
                  search={true}
                  searchOnChange={(e) => setSearch(e.target.value)}
                  searchValue={search}
                  csvdata={csv}
                  filterButton={true}
                  onFilterClick={() => setFilterModal(true)}
                />
                {/* <div className="flex gap-2">
                  <RedButton text={t("addNewDriver")} onClick={openModal} />
                </div> */}
              </div>
            </div>

            <div>
              <MyDataTable columns={columns} data={datas} />
            </div>
          </div>

          <Modal
            onClose={() => setModal(false)}
            isOpen={modal}
            size={"2xl"}
            isCentered
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader padding={0}>
                <div className="border-b-2 border-b-[#0000001F] px-5 py-2.5 text-lg font-norms font-medium">
                  {t("addNewDriver")}
                </div>
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody padding={4}>
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label
                      htmlFor="firstName"
                      className="text-black font-switzer font-semibold"
                    >
                      {t("firstName")}
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      id="firstName"
                      className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label
                      htmlFor="lastName"
                      className="text-black font-switzer font-semibold"
                    >
                      {t("lastName")}
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      id="lastName"
                      className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label
                      htmlFor="email"
                      className="text-black font-switzer font-semibold"
                    >
                      {t("email")}
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label
                      htmlFor="phone"
                      className="text-black font-switzer font-semibold"
                    >
                      {t("phone")}
                    </label>
                    <PhoneInput
                      country={"pk"}
                      inputStyle={{
                        width: "100%",
                        height: "40px",
                        borderRadius: "6px",
                        outline: "none",
                        border: "none",
                        background: "#F4F4F4",
                      }}
                    />
                  </div>
                  <div className="space-y-1 col-span-2">
                    <label
                      htmlFor="password"
                      className="text-black font-switzer font-semibold"
                    >
                      {t("password")}
                    </label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                    />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter padding={4}>
                <div className="flex gap-2">
                  <BlackButton
                    text={t("cancel")}
                    onClick={() => {
                      setModal(false);
                    }}
                  />

                  <RedButton text={t("add")} />
                </div>
              </ModalFooter>
            </ModalContent>
          </Modal>

          {/* Filter Modal */}
          <Modal
            onClose={() => {
              // Reset temp filters to match current filters when modal is closed
              setTempFilterData({
                country: filterData.country,
                city: filterData.city,
                zone: filterData.zone,
                driverType: filterData.driverType,
              });
              setFilterModal(false);
            }}
            isOpen={filterModal}
            size={"xl"}
            isCentered
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader padding={0}>
                <div className="border-b-2 border-b-[#0000001F] px-5 py-2.5 text-lg font-norms font-medium">
                  {t("Filter Options")}
                </div>
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody padding={4}>
                <div className="space-y-5">
                  <div className="space-y-1">
                    <label className="text-black font-switzer font-semibold">
                      {t("Country")}
                    </label>
                    <Select
                      placeholder="All Countries"
                      options={countryFilterOptions}
                      onChange={async (e) => {
                        setTempFilterData({
                          ...tempFilterData,
                          country: e,
                          city: null,
                          zone: null,
                        });

                        // Reset zones when country changes
                        setFilterZones([]);

                        if (e && e.value !== null) {
                          // Fetch cities for selected country
                          await handleGetCitiesByCountry(e.value);
                        } else {
                          // If "All Countries" is selected, fetch all cities
                          try {
                            const citiesRes = await PostAPI(
                              "admin/countryWiseCities",
                              {
                                countryId: null,
                              }
                            );

                            if (citiesRes?.data?.status === "1") {
                              setCities(citiesRes?.data?.data?.cities || []);
                            } else {
                              // Fallback to filterOptions
                              setCities(filterOptions?.data?.city || []);
                            }
                          } catch (error) {
                            console.error("Error fetching all cities:", error);
                            setCities(filterOptions?.data?.city || []);
                          }
                        }
                      }}
                      value={tempFilterData?.country}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-black font-switzer font-semibold">
                      {t("City")}
                    </label>
                    <Select
                      placeholder="All Cities"
                      options={cityFilterOptions}
                      onChange={async (e) => {
                        setTempFilterData({
                          ...tempFilterData,
                          city: e,
                          zone: null,
                        });

                        if (e && e.value !== null) {
                          // Fetch zones for selected city
                          await handleGetZoneByCity(e.value);
                        } else {
                          // If "All Cities" is selected, fetch all zones
                          try {
                            const zonesRes = await PostAPI(
                              "admin/cityWiseZones",
                              {
                                cityId: null,
                              }
                            );

                            if (zonesRes?.data?.status === "1") {
                              setFilterZones(zonesRes?.data?.data?.zones || []);
                            } else {
                              // Fallback to filterOptions
                              setFilterZones(filterOptions?.data?.zones || []);
                            }
                          } catch (error) {
                            console.error("Error fetching all zones:", error);
                            setFilterZones(filterOptions?.data?.zones || []);
                          }
                        }
                      }}
                      value={tempFilterData?.city}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-black font-switzer font-semibold">
                      {t("Zone")}
                    </label>
                    <Select
                      placeholder="All Zones"
                      options={zoneFilterOptions}
                      onChange={(e) => {
                        setTempFilterData({ ...tempFilterData, zone: e });
                      }}
                      value={tempFilterData?.zone}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-black font-switzer font-semibold">
                      {t("Driver Type")}
                    </label>
                    <Select
                      placeholder="All Driver Types"
                      options={driverTypeOptions}
                      onChange={(e) => {
                        setTempFilterData({ ...tempFilterData, driverType: e });
                      }}
                      value={tempFilterData?.driverType}
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <BlackButton
                      text={t("Clear All")}
                      onClick={() => {
                        setTempFilterData({
                          country: null,
                          city: null,
                          zone: null,
                          driverType: null,
                        });
                        // Reset to show all data
                        setCities(filterOptions?.data?.city || []);
                        setFilterZones(filterOptions?.data?.zones || []);
                      }}
                    />
                    <RedButton
                      text={t("Apply Filter")}
                      onClick={() => {
                        // Apply the temporary filters to actual filter state
                        setFilterData({
                          country: tempFilterData.country,
                          city: tempFilterData.city,
                          zone: tempFilterData.zone,
                          driverType: tempFilterData.driverType,
                        });
                        setFilterModal(false);
                      }}
                    />
                  </div>
                </div>
              </ModalBody>
            </ModalContent>
          </Modal>
        </div>
      }
    />
  );
}
