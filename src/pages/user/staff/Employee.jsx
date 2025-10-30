import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next"; // Import useTranslation
import Layout from "../../../components/Layout";
import Helment from "../../../components/Helment";
import MyDataTable from "../../../components/MyDataTable";
import GetAPI from "../../../utilities/GetAPI";
import Loader, { MiniLoader } from "../../../components/Loader";
import Switch from "react-switch";
import RedButton, {
  BlackButton,
  EditButton,
  HelmetBtn,
} from "../../../utilities/Buttons";
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
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import { PutAPI } from "../../../utilities/PutAPI";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Employee() {
  const { t } = useTranslation(); // Use the t function
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  let zones = GetAPI("admin/getZones");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [roleId, setRoleId] = useState("");
  const [modal, setModal] = useState(false);
  const [filterModal, setFilterModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
  const [filterZones, setFilterZones] = useState([]);

  // Filter options
  const { data: filterOptions, reFetch: refetchFilterOptions } = GetAPI(
    "admin/filterOptions"
  );
  const { data: CountryList } = GetAPI("admin/getAllCountries");

  const [addUser, setAddUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "",
    phoneNum: "",
    password: "",
    zone: "",
    role: "",
  });
  console.log("🚀 ~ Employee ~ addUser:", addUser);

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

  const filterZoneOptions = [{ value: null, label: "All Zones" }].concat(
    Array.isArray(filterZones)
      ? filterZones.map((zone) => ({
          value: zone.id,
          label: zone.name.trim(),
        }))
      : []
  );

  // Fetch employees data with filters
  const getEmployeesData = async () => {
    const requestPayload = {
      countryId: filterData?.country?.value || null,
      cityId: filterData?.city?.value || null,
      zoneId: filterData?.zone?.value || null,
    };

    try {
      let res = await PostAPI("admin/getAllEmployeesFilter", requestPayload);
      if (res?.data?.status === "1") {
        setData(res?.data);
      } else {
        setData({ data: [] });
        info_toaster(res?.data?.message || "No data found");
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      setData({ data: [] });
      error_toaster("Failed to fetch employees");
    }
    setLoading(false);
  };

  // Update status function
  const reFetch = () => {
    getEmployeesData();
  };

  const { data: dataRole, reFetch: roleRefetch } = GetAPI(
    "admin/allactiveroles"
  );

  const roleOptions = [];
  dataRole.data?.map((activeRoles, index) =>
    roleOptions.push({
      value: activeRoles?.id,
      label: activeRoles?.name,
    })
  );

  let zoneOptions = [];
  zones?.data?.data?.map((z, i) => {
    zoneOptions.push({
      value: z?.id,
      label: z?.name,
    });
  });

  const employeeData = () => {
    const filteredData = data?.data?.filter((dat) => {
      return (
        search === "" ||
        (dat?.id && dat?.id.toString().includes(search.toLowerCase())) ||
        (dat?.name && dat?.name.toLowerCase().includes(search.toLowerCase()))
      );
    });
    return filteredData;
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
    } else if (addUser?.role === "") {
      info_toaster("Please Select User Role");
    } else if (addUser?.zone === "") {
      info_toaster("Please add zone");
    } else {
      setLoader(true);
      const res = await PostAPI("admin/adduser", {
        firstName: addUser?.firstName,
        lastName: addUser?.lastName,
        email: addUser?.email,
        countryCode: addUser?.countryCode?.includes("+")
          ? addUser?.countryCode
          : "+" + addUser?.countryCode,
        phoneNum: addUser?.phoneNum,
        password: addUser?.password,
        userTypeId: roleId?.value,
        zoneId: addUser.zone.value,
        roleId: addUser.role.value,
        userTypeId: 4,
      });
      if (res?.data?.status === "1") {
        getEmployeesData();
        setLoader(false);
        setModal(false);
        setAddUser({
          firstName: "",
          lastName: "",
          email: "",
          countryCode: "",
          phoneNum: "",
          password: "",
          zone: "",
          role: "",
        });
        success_toaster(res?.data?.message);
      } else {
        setLoader(false);
        error_toaster(res?.data?.message);
      }
    }
  };

  const deleteUser = async (id) => {
    setLoader(true);
    const res = await PostAPI("admin/deleteUser", { userId: id });
    if (res?.data?.status === "1") {
      getEmployeesData();
      setLoader(false);
      success_toaster(res?.data?.message);
    } else {
      setLoader(false);
      error_toaster(res?.data?.message);
    }
  };

  const viewDetails = (id) => {
    navigate(`/user-details/${id}`, {
      state: {
        id: id,
      },
    });
  };

  const handlePhoneChange = (value, data) => {
    setAddUser({
      ...addUser,
      countryCode: data.dialCode,
      phoneNum: value.slice(data.dialCode.length),
    });
  };

  const updateStatus = async (userId, userStatus) => {
    if (userStatus === "Active") {
      let res = await PutAPI(`admin/banuser/${userId}`);
      if (res?.data?.status === "1") {
        success_toaster(res?.data?.message);
        getEmployeesData();
      } else {
        error_toaster(res?.data?.message);
      }
    } else {
      let res = await PutAPI(`admin/approveuser/${userId}`);
      if (res?.data?.status === "1") {
        success_toaster(res?.data?.message);
        getEmployeesData();
      } else {
        error_toaster(res?.data?.message);
      }
    }
  };

  const columns = [
    { field: "sn", header: t("serialNo") },
    { field: "id", header: t("employeeId") },
    { field: "name", header: t("name") },
    { field: "email", header: t("email") },
    { field: "phone", header: t("phone") },
    { field: "role", header: t("role") },
    { field: "zone", header: t("zone") },
    { field: "status", header: t("status") },
    { field: "action", header: t("action") },
  ];

  const datas = [];
  const csv = [];
  employeeData()?.map((values, index) => {
    csv.push({
      sn: index + 1,
      id: values?.id,
      name: values?.name,
      email: values?.email,
      phone: values?.phoneNum,
      role: values?.role,
      status: values?.status ? t("active") : t("inactive"),
      action: values?.status === "Active" ? "True" : "False",
    });
    return datas.push({
      sn: index + 1,
      id: values?.id,
      name: values?.name,
      email: values?.email,
      phone: values?.phoneNum,
      role: values?.role,
      zone: values?.zone?.name,
      status: (
        <div>
          {values?.status ? (
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
        <div className="flex items-center gap-3" data-testid={`employee-row-${values?.id}-actions`}>
          <label data-testid={`employee-row-${values?.id}-switch`}>
            <Switch
              onChange={() => {
                updateStatus(values?.id, values?.status);
              }}
              checked={values?.status === "Inactive" ? false : true}
              uncheckedIcon={false}
              checkedIcon={false}
              onColor="#139013"
              onHandleColor="#fff"
              className="react-switch"
              boxShadow="none"
            />
          </label>

          <FaRegEdit
            onClick={() => viewDetails(values?.id)}
            size={25}
            className="cursor-pointer text-black"
            data-testid={`employee-row-${values?.id}-view-btn`}
          />
          <RiDeleteBin6Line
            size={27}
            className="cursor-pointer text-red-500"
            onClick={() => deleteUser(values?.id)}
            data-testid={`employee-row-${values?.id}-delete-btn`}
          />
        </div>
      ),
    });
  });

  // Effect to fetch data when filters change
  useEffect(() => {
    getEmployeesData();
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
                {t("allEmployees")}
              </h2>
              <div className="flex gap-x-2">
                <div data-testid="employee-helment">
                  <Helment
                    search={true}
                    searchOnChange={(e) => setSearch(e.target.value)}
                    searchValue={search}
                    csvdata={csv}
                    filterButton={true}
                    onFilterClick={() => setFilterModal(true)}
                  />
                </div>

                <div className="flex gap-2" data-testid="employee-add-btn">
                  <HelmetBtn text={t("Add Employee")} onClick={openModal} />
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
                  {t("Add Employee")}
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
                        data-testid="employee-modal-firstname-input"
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
                        data-testid="employee-modal-lastname-input"
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
                        data-testid="employee-modal-email-input"
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
                      <div data-testid="employee-modal-phone-wrapper">
                        <div className="col-span-1">
                          <PhoneInput
                            value={addUser?.countryCode + addUser?.phoneNum}
                            country={"pk"}
                            enableSearch
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
                            onChange={handlePhoneChange}
                          />
                        </div>
                        {/* <div className="col-span-2">
                          <input
                            type="number"
                            name="phoneNum"
                            className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                            onChange={handleOnEventChange}
                            value={addUser?.phoneNum}
                          />
                        </div> */}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label
                        htmlFor="zone"
                        className="text-black font-switzer font-semibold"
                      >
                        {t("Zone")}
                      </label>
                      <div data-testid="employee-zone-select-input">
                        <Select
                          placeholder="Select"
                          options={zoneOptions}
                          onChange={(e) => {
                            setAddUser({ ...addUser, zone: e });
                          }}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label
                        htmlFor="role"
                        className="text-black font-switzer font-semibold"
                      >
                        {t("Role")}
                      </label>
                      <div data-testid="employee-role-select-input">
                        <Select
                          placeholder="Select"
                          options={roleOptions}
                          onChange={(e) => {
                            setAddUser({ ...addUser, role: e });
                          }}
                        />
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
                          data-testid="employee-modal-password-input"
                          type={showPassword ? "text" : "password"}
                          name="password"
                          id="password"
                          className="bg-themeInput w-full h-10 px-3 rounded-md outline-none pr-10"
                          onChange={handleOnEventChange}
                          value={addUser?.password}
                        />
                        <button
                          type="button"
                          data-testid="employee-modal-password-toggle-btn"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                          tabIndex={-1}
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-end col-span-2 gap-2">
                      <div data-testid="employee-modal-cancel-btn">
                        <BlackButton
                          text={t("Cancel")}
                          onClick={() => {
                            setModal(false);
                          }}
                        />
                      </div>

                      <div data-testid="employee-modal-save-btn">
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
                    <div data-testid="employee-filter-country-select-input">
                      <Select
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
                  </div>

                  <div className="space-y-1">
                    <label className="text-black font-switzer font-semibold">
                      {t("City")}
                    </label>
                    <div data-testid="employee-filter-city-select-input">
                      <Select
                      placeholder="All Cities"
                      options={cityOptions}
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
                  </div>

                  <div className="space-y-1">
                    <label className="text-black font-switzer font-semibold">
                      {t("Zone")}
                    </label>
                    <div data-testid="employee-filter-zone-select-input">
                      <Select
                      placeholder="All Zones"
                      options={filterZoneOptions}
                      onChange={(e) => {
                        setTempFilterData({ ...tempFilterData, zone: e });
                      }}
                      value={tempFilterData?.zone}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <div data-testid="employee-filter-clear-btn">
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
                          setFilterZones(filterOptions?.data?.zones || []);
                        }}
                      />
                    </div>
                    <div data-testid="employee-filter-apply-btn">
                      <RedButton
                        text={t("Apply Filter")}
                        onClick={() => {
                          // Apply the temporary filters to actual filter state
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
