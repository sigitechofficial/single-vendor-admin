import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next"; // Import useTranslation
import Layout from "../../../components/Layout";
import Helment from "../../../components/Helment";
import MyDataTable from "../../../components/MyDataTable";
import GetAPI from "../../../utilities/GetAPI";
import Switch from "react-switch";
import Loader, { MiniLoader } from "../../../components/Loader";
import RedButton, {
  BlackButton,
  EditButton,
  HelmetBtn,
} from "../../../utilities/Buttons";
import { PutAPI } from "../../../utilities/PutAPI";
import {
  error_toaster,
  info_toaster,
  success_toaster,
} from "../../../utilities/Toaster";
import { useNavigate } from "react-router-dom";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import PhoneInput from "react-phone-input-2";
import Select from "react-select";
import { PostAPI } from "../../../utilities/PostAPI";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const customStyles = {
  control: (base, state) => ({
    ...base,
    background: "#f4f4f4",
    borderRadius: state.isFocused ? "8px" : 7,
    minWidth: "165px",
    maxWidth: "165px",
  }),
  menu: (base) => ({
    ...base,
    borderRadius: "8px",
    marginTop: 2,
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  }),
  menuList: (base) => ({
    ...base,
    padding: 0,
    borderRadius: "8px",
  }),
  indicatorSeparator: (base) => ({
    ...base,
    display: "none",
  }),
};

export default function RestaurantOwner() {
  const { t } = useTranslation(); // Use the t function
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [roleId, setRoleId] = useState("");
  const [modal, setModal] = useState(false);
  const [filterModal, setFilterModal] = useState(false);

  // Filter state
  const [filterData, setFilterData] = useState({
    country: null,
    city: null,
    zone: null,
  });
  const [tempFilterData, setTempFilterData] = useState({
    country: null,
    city: null,
    zone: null,
  });
  const [cities, setCities] = useState([]);
  const [zones, setZones] = useState([]);
  const [addUser, setAddUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "+92",
    phoneNum: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  // Filter options
  const { data: filterOptions, reFetch: refetchFilterOptions } = GetAPI(
    "admin/filterOptions"
  );
  const { data: CountryList } = GetAPI("admin/getAllCountries");

  const roles = GetAPI("admin/userType");
  const roleOptions = [{ value: 5, label: "Retailer" }];
  // roles.data?.data?.map((activeRoles, index) =>
  //   roleOptions.push({
  //     value: activeRoles?.id,
  //     label: activeRoles?.name,
  //   })
  // );

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
        setZones(res?.data?.data?.zones || []);
      } else {
        error_toaster(res?.data?.message || "Failed to fetch zones");
        setZones([]);
      }
    } catch (err) {
      console.error("Error fetching zones:", err);
      setZones([]);
    }
  };

  // Prepare filter options
  let countryOptions = [{ value: null, label: "All Countries" }];
  CountryList?.data?.countries?.forEach((country) => {
    if (country.status) {
      countryOptions.push({
        value: country.id,
        label: country.name.trim(),
      });
    }
  });

  const cityOptions = [{ value: null, label: "All Cities" }].concat(
    Array.isArray(cities)
      ? cities
        .filter((city) => city.status)
        .map((city) => ({
          value: city.id,
          label: city.name.trim(),
        }))
      : []
  );

  const zoneOptions = [{ value: null, label: "All Zones" }].concat(
    Array.isArray(zones)
      ? zones.map((zone) => ({
        value: zone.id,
        label: zone.name.trim(),
      }))
      : []
  );

  // Fetch restaurant owners data
  const getRestaurantOwners = async () => {
    const requestPayload = {
      countryId: filterData?.country?.value || null,
      cityId: filterData?.city?.value || null,
      zoneId: filterData?.zone?.value || null,
    };

    try {
      let res = await PostAPI(
        "admin/getZoneWiseRestaurantOwners",
        requestPayload
      );
      if (res?.data?.status === "1") {
        setData(res?.data);
      } else {
        setData({ data: [] });
        info_toaster(res?.data?.message || "No data found");
      }
    } catch (error) {
      console.error("Error fetching restaurant owners:", error);
      setData({ data: [] });
      error_toaster("Failed to fetch restaurant owners");
    }
    setLoading(false);
  };

  // Update status function
  const reFetch = () => {
    getRestaurantOwners();
  };

  const ownerData = () => {
    const filteredData = data?.data?.filter((dat) => {
      return (
        search === "" ||
        (dat?.user?.id &&
          dat?.user?.id.toString().includes(search.toLowerCase())) ||
        (dat?.user?.firstName &&
          dat?.user?.firstName.toLowerCase().includes(search.toLowerCase())) ||
        (dat?.user?.email &&
          dat?.user?.email.toLowerCase().includes(search.toLowerCase())) ||
        (dat?.user?.lastName &&
          dat.user?.lastName.toLowerCase().includes(search.toLowerCase())) ||
        (dat?.user?.phoneNum &&
          dat.user?.phoneNum.toLowerCase().includes(search.toLowerCase())) ||
        (dat?.businessName &&
          dat.businessName.toLowerCase().includes(search.toLowerCase())) ||
        (dat?.zoneRestaurant?.zoneId &&
          dat?.zoneRestaurant?.zoneId
            .toString()
            .toLowerCase()
            .includes(search.toLowerCase()))
      );
    });
    return filteredData;
  };

  const updateStatus = async (userId, userStatus) => {
    if (userStatus === true) {
      let res = await PutAPI(`admin/banuser/${userId}`);
      if (res?.data?.status === "1") {
        success_toaster(res?.data?.message);
        getRestaurantOwners();
      } else {
        error_toaster(res?.data?.message);
      }
    } else {
      let res = await PutAPI(`admin/approveuser/${userId}`);
      if (res?.data?.status === "1") {
        success_toaster(res?.data?.message);
        getRestaurantOwners();
      } else {
        error_toaster(res?.data?.message);
      }
    }
  };

  const viewDetails = (id) => {
    navigate(`/user-details/${id}`, {
      state: {
        id: id,
      },
    });
  };

  const openModal = () => {
    setModal(true);
  };

  const handleOnEventChange = (e) => {
    setAddUser({ ...addUser, [e.target.name]: e.target.value });
  };

  const outp = String(addUser?.email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );

  const addCustomer = async () => {
    if (addUser?.firstName === "") {
      info_toaster("Please Enter First Name");
    } else if (addUser?.lastName === "") {
      info_toaster("Please Enter Last Name");
    } else if (addUser?.email === "") {
      info_toaster("Please Enter Email");
    } else if (outp == null) {
      info_toaster("Email Format Incorrect");
    } else if (addUser?.countryCode === "") {
      info_toaster("Please Select Country Code");
    } else if (addUser?.phoneNum === "") {
      info_toaster("Please Enter Phone Number");
    } else if (addUser?.password === "") {
      info_toaster("Please Enter Password");
    } else if (roleId === "") {
      info_toaster("Please Select User Role");
    } else {
      setLoader(true);
      const res = await PostAPI("admin/adduser", {
        firstName: addUser?.firstName,
        lastName: addUser?.lastName,
        email: addUser?.email,
        countryCode: addUser?.countryCode,
        phoneNum: addUser?.phoneNum,
        password: addUser?.password,
        userTypeId: roleId?.value,
      });
      if (res?.data?.status === "1") {
        getRestaurantOwners();
        setLoader(false);
        setModal(false);
        setAddUser({
          firstName: "",
          lastName: "",
          email: "",
          countryCode: "",
          phoneNum: "",
          password: "",
        });
        success_toaster(res?.data?.message);
      } else {
        setLoader(false);
        error_toaster(res?.data?.message);
      }
    }
  };

  // Effect to fetch data when filters change
  useEffect(() => {
    getRestaurantOwners();
  }, [
    filterData?.country?.value,
    filterData?.city?.value,
    filterData?.zone?.value,
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
          setZones(zonesRes?.data?.data?.zones || []);
        } else {
          // Fallback to filterOptions if available
          if (filterOptions?.data?.zones) {
            setZones(filterOptions?.data?.zones);
          }
        }
      } catch (error) {
        console.error("Error initializing filters:", error);
        // Fallback to filterOptions
        if (filterOptions?.data) {
          setCities(filterOptions?.data?.city || []);
          setZones(filterOptions?.data?.zones || []);
        }
      }
    };

    // Initialize immediately when component mounts
    initializeFilters();
  }, []); // Empty dependency array to run only once on mount

  // Also initialize when filterOptions becomes available (fallback)
  useEffect(() => {
    if (filterOptions?.data && cities.length === 0 && zones.length === 0) {
      setCities(filterOptions?.data?.city || []);
      setZones(filterOptions?.data?.zones || []);
    }
  }, [filterOptions?.data, cities.length, zones.length]);

  const columns = [
    { field: "sn", header: t("serialNo") },
    { field: "id", header: t("ownerId") },
    { field: "name", header: t("name") },
    { field: "email", header: t("email") },
    { field: "phone", header: t("phone") },
    { field: "restaurant", header: t("restaurant") },
    { field: "status", header: t("status") },
    { field: "action", header: t("action") },
  ];

  const datas = [];
  const csv = [];
  ownerData()?.map((values, index) => {
    csv.push({
      sn: index + 1,
      id: values?.user?.id,
      name: `${values?.user?.firstName} ${values?.user?.lastName}`,
      email: values?.user?.email,
      phone: `${values?.user?.countryCode}${values?.user?.phoneNum}`,
      restaurant: values?.businessName,
      status: values?.user?.status ? t("active") : t("inactive"),
    });
    return datas.push({
      sn: index + 1,
      id: values?.user?.id,
      name: `${values?.user?.firstName} ${values?.user?.lastName}`,
      email: values?.user?.email,
      phone: `${values?.user?.countryCode}${values?.user?.phoneNum}`,
      restaurant: values?.businessName,
      status: (
        <div>
          {values?.user?.status ? (
            <div
              className="bg-[#21965314] text-themeGreen font-semibold p-2 rounded-md flex 
              justify-center"
            >
              {t("active")}
            </div>
          ) : (
            <div
              className="bg-[#EE4A4A14] text-themeRed font-semibold p-2 rounded-md flex 
              justify-center"
            >
              {t("inactive")}
            </div>
          )}
        </div>
      ),
      action: (
        <div className="flex items-center gap-3">
          <label>
            <Switch
              onChange={() => {
                updateStatus(values?.user?.id, values?.user?.status);
              }}
              checked={values?.user?.status}
              uncheckedIcon={false}
              checkedIcon={false}
              onColor="#139013"
              onHandleColor="#fff"
              className="react-switch"
              boxShadow="none"
            />
          </label>

          <EditButton
            text={t("viewDetails")}
            onClick={() => viewDetails(values?.user?.id)}
          />
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
                {t("All Branches Owners")}
              </h2>
              <div className="flex gap-x-2">
                <div data-testid="restaurantowner-helment">
                  <Helment
                    search={true}
                    searchOnChange={(e) => setSearch(e.target.value)}
                    searchValue={search}
                    csvdata={csv}
                    filterButton={true}
                    onFilterClick={() => setFilterModal(true)}
                  />
                </div>

                <div className="flex gap-2" data-testid="restaurantowner-addowner-btn">
                  <HelmetBtn
                    text={t("Add Branches Owner")}
                    onClick={openModal}
                  />
                </div>
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
                  {t("Add Branches Owner")}
                </div>
              </ModalHeader>
              <ModalCloseButton />

              {loader ? (
                <div className="h-[480px]">
                  <MiniLoader />
                </div>
              ) : (
                <ModalBody padding={4}>
                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-1">
                      <label
                        htmlFor="firstName"
                        className="text-black font-switzer font-semibold"
                      >
                        {t("First Name")}
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        id="firstName"
                        data-testid="restaurantowner-modal-firstname-input"
                        className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                        onChange={handleOnEventChange}
                        value={addUser?.firstName}
                      />
                    </div>

                    <div className="space-y-1">
                      <label
                        htmlFor="lastName"
                        className="text-black font-switzer font-semibold"
                      >
                        {t("Last Name")}
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        id="lastName"
                        data-testid="restaurantowner-modal-lastname-input"
                        className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                        onChange={handleOnEventChange}
                        value={addUser?.lastName}
                      />
                    </div>

                    <div className="space-y-1">
                      <label
                        htmlFor="email"
                        className="text-black font-switzer font-semibold"
                      >
                        {t("Email")}
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        data-testid="restaurantowner-modal-email-input"
                        className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                        onChange={handleOnEventChange}
                        value={addUser?.email}
                      />
                    </div>

                    <div className="space-y-1">
                      <label
                        htmlFor="phone"
                        className="text-black font-switzer font-semibold"
                      >
                        {t("Phone No")}
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-1">
                          <div data-testid="restaurantowner-modal-countrycode-input">
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
                              inputProps={{
                                id: "countryCode",
                                name: "countryCode",
                              }}
                              onChange={(code) =>
                                setAddUser({ ...addUser, countryCode: code })
                              }
                              value={addUser?.countryCode}
                            />
                          </div>
                        </div>
                        <div className="col-span-2">
                          <input
                            type="number"
                            name="phoneNum"
                            className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                            onChange={handleOnEventChange}
                            value={addUser?.phoneNum}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1 col-span-2 relative">
                      <label
                        htmlFor="password"
                        className="text-black font-switzer font-semibold"
                      >
                        {t("Password")}
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          id="password"
                          data-testid="restaurantowner-modal-password-input"
                          className="bg-themeInput w-full h-10 px-3 rounded-md outline-none pr-10"
                          onChange={handleOnEventChange}
                          value={addUser?.password}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                          tabIndex={-1}
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                          data-testid="restaurantowner-modal-password-toggle-btn"
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1 col-span-2">
                      <label
                        htmlFor="role"
                        className="text-black font-switzer font-semibold"
                      >
                        {t("Role")}
                      </label>
                      <Select
                        placeholder="Select"
                        options={roleOptions}
                        onChange={(e) => {
                          setRoleId(e);
                        }}
                        data-testid="restaurantowner-role-select-input"
                      />
                    </div>

                    <div className="flex justify-end col-span-2 gap-2">
                      <div data-testid="restaurantowner-modal-cancel-btn">
                        <BlackButton
                          text={t("Cancel")}
                          onClick={() => {
                            setModal(false);
                          }}
                        />
                      </div>

                      <div data-testid="restaurantowner-modal-add-btn">
                        <RedButton text={t("Add")} onClick={addCustomer} />
                      </div>
                    </div>
                  </div>
                </ModalBody>
              )}
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
                      data-testid="restaurantowner-filter-country-select-input"
                      placeholder="All Countries"
                      options={countryOptions}
                      onChange={async (e) => {
                        setTempFilterData({
                          ...tempFilterData,
                          country: e,
                          city: null,
                          zone: null,
                        });

                        // Reset zones when country changes
                        setZones([]);

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
                      data-testid="restaurantowner-filter-city-select-input"
                      placeholder="All Cities"
                      options={cityOptions}
                      onChange={async (e) => {
                        setTempFilterData({ ...tempFilterData, city: e, zone: null });

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
                              setZones(zonesRes?.data?.data?.zones || []);
                            } else {
                              // Fallback to filterOptions
                              setZones(filterOptions?.data?.zones || []);
                            }
                          } catch (error) {
                            console.error("Error fetching all zones:", error);
                            setZones(filterOptions?.data?.zones || []);
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
                      data-testid="restaurantowner-filter-zone-select-input"
                      placeholder="All Zones"
                      options={zoneOptions}
                      onChange={(e) => {
                        setTempFilterData({ ...tempFilterData, zone: e });
                      }}
                      value={tempFilterData?.zone}
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <div data-testid="restaurantowner-filter-clear-btn">
                      <BlackButton
                        text={t("Clear All")}
                        onClick={() => {
                          setTempFilterData({
                            country: null,
                            city: null,
                            zone: null,
                          });
                          // Reset to show all data
                          setCities(filterOptions?.data?.city || []);
                          setZones(filterOptions?.data?.zones || []);
                        }}
                      />
                    </div>
                    <div data-testid="restaurantowner-filter-apply-btn">
                      <RedButton
                        text={t("Apply Filter")}
                        onClick={() => {
                          setFilterData({
                            country: tempFilterData.country,
                            city: tempFilterData.city,
                            zone: tempFilterData.zone,
                          });
                          setFilterModal(false);
                        }}
                      />
                    </div>
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
