import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Layout from "../../../components/Layout";
import Helment from "../../../components/Helment";
import MyDataTable from "../../../components/MyDataTable";
import Loader, { MiniLoader } from "../../../components/Loader";
import GetAPI from "../../../utilities/GetAPI";
import { useNavigate } from "react-router-dom";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  border,
} from "@chakra-ui/react";
import PhoneInput from "react-phone-input-2";
import Select from "react-select";
import RedButton, { BlackButton, HelmetBtn } from "../../../utilities/Buttons";
import { error_toaster, info_toaster, success_toaster } from "../../../utilities/Toaster";
import { PostAPI } from "../../../utilities/PostAPI";
import "react-phone-input-2/lib/style.css";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import CustomCheckbox from "../../../components/CustomCheckbox";
import Switch from "react-switch";
import { PutAPI } from "../../../utilities/PutAPI";
import { FaEye, FaEyeSlash } from "react-icons/fa";
const customStyles = {
  control: (provided, state) => ({
    ...provided,
    minHeight: "40px",
    backgroundColor: "#f4f4f4",
    border: 0,
  }),
};

export default function Admin() {
  const { t } = useTranslation();
  const { data } = GetAPI("admin/getAllZones");
  const { data: permissions } = GetAPI("admin/get_permissions");
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [filterModal, setFilterModal] = useState(false);
  const [modal, setModal] = useState({
    isOpen: false,
    loader: false,
    mod: "add",
  });

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

  // Filter options
  const { data: filterOptions, reFetch: refetchFilterOptions } = GetAPI(
    "admin/filterOptions"
  );
  const { data: CountryList } = GetAPI("admin/getAllCountries");

  const [permissionDat, setPermissionDat] = useState({
    roleId: "",
    permissions: [],
  });

  const navigate = useNavigate();
  const [zone, setZone] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "",
    phoneNum: "",
    password: "",
    zoneId: {},
    permission: [],
  });

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

  // Fetch admin data with filters
  const getAdminData = async () => {
    const requestPayload = {
      countryId: filterData?.country?.value || null,
      cityId: filterData?.city?.value || null,
      zoneId: filterData?.zone?.value || null,
    };

    try {
      let res = await PostAPI(
        "admin/getAllAdminsFilter",
        requestPayload
      );
      if (res?.data?.status === "1") {
        setAdminData(res?.data);
      } else {
        setAdminData({ data: { admins: [] } });
        info_toaster(res?.data?.message || "No data found");
      }
    } catch (error) {
      console.error("Error fetching admins:", error);
      setAdminData({ data: { admins: [] } });
      error_toaster("Failed to fetch admins");
    }
    setLoading(false);
  };

  // Update status function
  const reFetch = () => {
    getAdminData();
  };

  const adminFilteredData = () => {
    const filteredData = adminData?.data?.admins?.filter((dat) => {
      return (
        search === "" ||
        (dat?.id &&
          dat?.id?.toString().includes(search?.toLowerCase().trim())) ||
        (dat?.zoneId &&
          dat?.zoneId?.toString().includes(search?.toLowerCase().trim())) ||
        (dat?.zone?.name &&
          dat?.zone?.name
            ?.toLowerCase()
            .includes(search?.toLowerCase().trim())) ||
        (dat?.userType?.name &&
          dat?.userType?.name
            .toLowerCase()
            .includes(search?.toLowerCase().trim())) ||
        (dat?.email &&
          dat?.email?.toLowerCase().includes(search?.toLowerCase().trim())) ||
        (dat?.phoneNum && dat?.phoneNum?.includes(search?.toLowerCase().trim()))
      );
    });
    return filteredData;
  };

  let adminZoneOptions = [];

  data?.data?.forEach((z) => {
    adminZoneOptions.push({
      value: z?.zoneDetail?.zoneId,
      label: z?.name,
    });
  });

  const addAdmin = async () => {
    if (!zone.firstName) {
      info_toaster("First Name is required");
    } else if (!zone.lastName) {
      info_toaster("Last Name is required");
    } else if (!zone.email) {
      info_toaster("Email is required");
    } else if (!zone.countryCode) {
      info_toaster("Country Code is required");
    } else if (!zone.phoneNum) {
      info_toaster("Phone Number is required");
    } else if (!zone.password) {
      info_toaster("Password is required");
    } else if (!zone.zoneId?.value) {
      info_toaster("Zone is required");
    } else {
      setModal({ ...modal, loader: true });

      let res = await PostAPI("admin/addZoneAdmin", {
        firstName: zone.firstName,
        lastName: zone.lastName,
        email: zone.email,
        countryCode: "+" + zone.countryCode,
        phoneNum: zone.phoneNum.slice(zone.countryCode.length),
        password: zone.password,
        zoneId: zone.zoneId.value,
        permissionsList: zone?.permission,
      });

      if (res?.data?.status === "1") {
        setModal({ ...modal, loader: false, isOpen: false });

        success_toaster(res?.data?.message);

        setZone({
          firstName: "",
          lastName: "",
          email: "",
          countryCode: "",
          phoneNum: "",
          password: "",
          zoneId: {},
          permission: [],
        });

        getAdminData();
      } else {
        setModal({ ...modal, loader: false });
        info_toaster(res?.data?.message);
      }
    }
  };

  const updateAdmin = async () => {
    // Input validation
    if (!zone.firstName) {
      info_toaster("First Name is required");
    } else if (!zone.lastName) {
      info_toaster("Last Name is required");
    } else if (!zone.email) {
      info_toaster("Email is required");
    } else if (!zone.countryCode) {
      info_toaster("Country Code is required");
    } else if (!zone.phoneNum) {
      info_toaster("Phone Number is required");
    } else if (!zone.password) {
      info_toaster("Password is required");
    } else if (!zone.zoneId?.value) {
      info_toaster("Zone is required");
    } else {
      setModal({ ...modal, loader: true });
      let res = await PostAPI("admin/updateZoneAdmin", {
        id: zone.id,
        firstName: zone.firstName,
        lastName: zone.lastName,
        email: zone.email,
        countryCode: "+" + zone.countryCode,
        phoneNum: zone?.phoneNum.slice(zone.countryCode.length),
        password: zone?.password,
        zoneId: zone?.zoneId?.value,
        permissionsList: zone?.permission,
      });
      if (res?.data?.status === "1") {
        setModal({ ...modal, loader: false, isOpen: false });
        success_toaster(res?.data?.message);
        setZone({
          firstName: "",
          firstName: "",
          email: "",
          countryCode: "",
          phoneNum: "",
          password: "",
          zoneId: {},
          permission: [],
        });
        reFetch();
      } else {
        setModal({ ...modal, loader: false });
        info_toaster(res?.data?.message);
      }
    }
  };

  const deleteAdmin = async () => {
    setModal({ ...modal, loader: true });
    let res = await PostAPI("admin/deleteZoneAdmin", {
      id: zone.id,
    });

    if (res?.data?.status === "1") {
      setModal({ ...modal, loader: false, isOpen: false });
      success_toaster(res?.data?.message);

      // Reset zone state using setZone
      setZone({
        firstName: "",
        lastName: "",
        email: "",
        countryCode: "",
        phoneNum: "",
        password: "",
        zoneId: {},
        permission: [],
      });

      // Re-fetch the data after deletion
      getAdminData();
    } else {
      setModal({ ...modal, loader: false });
      info_toaster(res?.data?.message);
    }
  };

  const handleChange = (e, type, code) => {
    setZone((prevDriver) => ({
      ...prevDriver,
      [type]: e,
      countryCode: code?.dialCode || prevDriver.countryCode,
    }));
  };

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    setZone((prevState) => ({
      ...prevState,
      permission: isChecked ? permissions?.data?.map((item) => item?.id) : [],
    }));
    setSelectAll(isChecked);
  };

  const updateStatus = async (userId, userStatus) => {
    if (userStatus) {
      let res = await PutAPI(`admin/banuser/${userId}`);
      if (res?.data?.status === "1") {
        success_toaster(res?.data?.message);
        getAdminData();
      } else {
        error_toaster(res?.data?.message);
      }
    } else {
      let res = await PutAPI(`admin/approveuser/${userId}`);
      if (res?.data?.status === "1") {
        success_toaster(res?.data?.message);
        getAdminData();
      } else {
        error_toaster(res?.data?.message);
      }
    }
  };

  const columns = [
    { field: "id", header: t("id") },
    { field: "name", header: t("Name") },
    { field: "email", header: t("Email") },
    { field: "phoneNum", header: t("Phone No") },
    { field: "userType", header: t("UserType") },
    { field: "zone", header: t("zone") },
    { field: "status", header: t("status") },
    { field: "action", header: t("Action") },
  ];

  const datas = [];
  const csv = [];

  adminFilteredData()?.map((val, idx) => {
    return datas.push({
      id: val?.id,
      name: val?.firstName + " " + val?.lastName,
      email: val?.email,
      phoneNum: val?.countryCode + val?.phoneNum,
      userType: val?.userType?.name,
      zone: val?.zone?.name,
      status: (
        <label>
          <Switch
            onChange={() => {
              updateStatus(val?.id, val?.status);
            }}
            checked={val?.status}
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
        <div className="flex gap-x-2">
          <FaRegEdit
            size={25}
            className="cursor-pointer text-black"
            onClick={() => {
              setZone({
                id: val?.id,
                firstName: val?.firstName,
                lastName: val?.lastName,
                email: val?.email,
                countryCode: val?.countryCode,
                phoneNum: val?.countryCode + val?.phoneNum,
                permission: [],
              });
              setModal({ ...modal, mod: "update", isOpen: true });
            }}
          />
          <RiDeleteBin6Line
            size={27}
            className="cursor-pointer text-red-500"
            onClick={() => {
              setZone({ ...zone, id: val?.id });
              setModal({ ...modal, mod: "delete", isOpen: true });
            }}
          />
        </div>
      ),
    });
  });

  // Effect to fetch data when filters change
  useEffect(() => {
    getAdminData();
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

  useEffect(() => {
    if (zone?.permission.length === permissions?.data?.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [zone?.permission.length]);

  return loading ? (
    <Loader />
  ) : (
    <Layout
      content={
        <div className="bg-themeGray p-5">
          <div className="bg-white rounded-lg p-5">
            <div className="flex justify-between items-center flex-wrap gap-5">
              <h2 className="text-themeRed text-lg font-bold font-norms">
                {t("Admin")}
              </h2>
              <div className="flex gap-x-2">
                <div data-testid="admin-helment">
                  <Helment
                    search={true}
                    searchOnChange={(e) => setSearch(e.target.value)}
                    searchValue={search}
                    csvdata={csv}
                    filterButton={true}
                    onFilterClick={() => setFilterModal(true)}
                  />
                </div>
                <div data-testid="admin-addadmin-btn">
                  <HelmetBtn
                    text="Add Admin"
                    onClick={() => {
                      setZone({
                        firstName: "",
                        lastName: "",
                        email: "",
                        countryCode: "",
                        phoneNum: "",
                        password: "",
                        zoneId: {},
                        permission: [],
                      });
                      setModal({ ...modal, mod: "add", isOpen: true });
                    }}
                  />
                </div>
              </div>
            </div>

            <div>
              <MyDataTable columns={columns} data={datas} />
            </div>
          </div>

          <Modal
            onClose={() => setModal({ ...modal, isOpen: false })}
            isOpen={modal.isOpen}
            size={modal.mod === "delete" ? "lg" : "2xl"}
            isCentered
            motionPreset="slideInBottom"
          >
            <ModalOverlay />
            <ModalContent
              className="overflow-y-auto hide-scroll"
              borderRadius={"20px"}
              sx={{
                "@media screen and (max-width: 500px)": {
                  borderRadius: "20px",
                  borderBottomRadius: 0,
                  mb: 0,
                  height: "calc(100vh - 18vh)",
                },
              }}
            >
              <ModalHeader padding={0}>
                <div className="border-b-2 border-b-[#0000001F] px-5 py-2.5 text-lg font-norms font-medium">
                  {modal.mod === "add"
                    ? t("Add Admin")
                    : modal.mod === "update"
                    ? t("Update")
                    : t("Delete")}
                </div>
                <ModalCloseButton />
              </ModalHeader>
              <ModalBody padding={0}>
                {!modal?.loader ? (
                  modal.mod === "add" || modal.mod === "update" ? (
                    <>
                      <div className="grid grid-cols-2 gap-5 overflow-auto px-6 py-4 max-sm:px-0 h-[calc(100vh-30vh)]">
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
                            data-testid="admin-modal-firstname-input"
                            className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                            onChange={(e) =>
                              handleChange(e.target.value, "firstName")
                            }
                            value={zone?.firstName}
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
                            data-testid="admin-modal-lastname-input"
                            value={zone?.lastName}
                            className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                            onChange={(e) =>
                              handleChange(e.target.value, "lastName")
                            }
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
                            data-testid="admin-modal-email-input"
                            value={zone?.email}
                            className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                            onChange={(e) =>
                              handleChange(e.target.value, "email")
                            }
                          />
                        </div>
                        <div className="space-y-1">
                          <label
                            htmlFor="phone"
                            className="text-black font-switzer font-semibold"
                          >
                            {t("phone")}
                          </label>
                          <div data-testid="admin-modal-countrycode-input">
                            <PhoneInput
                              country={"pk"}
                              onChange={(value, code) =>
                                handleChange(value, "phoneNum", code)
                              }
                              inputStyle={{
                                width: "100%",
                                height: "40px",
                                borderRadius: "6px",
                                outline: "none",
                                border: "none",
                                background: "#F4F4F4",
                              }}
                              value={zone?.phoneNum}
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <h4 className="text-black font-switzer font-semibold">
                            Zone
                          </h4>
                          <Select
                            data-testid="admin-modal-zone-select-input"
                            placeholder="Select"
                            name="zone"
                            options={adminZoneOptions}
                            value={zone?.zoneId}
                            onChange={(e) => {
                              setZone({
                                ...zone,
                                zoneId: adminZoneOptions?.find(
                                  (el) => el.value === e?.value
                                ),
                              });
                            }}
                            styles={customStyles}
                          />
                        </div>

                        <div className="space-y-1 relative">
                          <label
                            htmlFor="password"
                            className="text-black font-switzer font-semibold"
                          >
                            {t("password")}
                          </label>
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            id="password"
                            data-testid="admin-modal-password-input"
                            className="bg-themeInput w-full h-10 px-3 rounded-md outline-none pr-10"
                            onChange={(e) =>
                              handleChange(e.target.value, "password")
                            }
                            value={zone.password}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-7 translate-y-1/2 text-gray-500"
                            tabIndex={-1}
                            aria-label={
                              showPassword ? "Hide password" : "Show password"
                            }
                            data-testid="admin-modal-password-toggle-btn"
                          >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                        <p className="text-black font-switzer font-semibold ">
                          Permissiosns
                        </p>

                        <div className="flex items-center gap-x-2 col-span-2">
                          <CustomCheckbox
                            id="#selectAll"
                            onChange={handleSelectAll}
                            type="checkbox"
                            checked={selectAll}
                            data-testid="admin-modal-selectall-chk"
                          />
                          <label
                            className=" cursor-pointer"
                            htmlFor="#selectAll"
                          >
                            Select ALL
                          </label>
                        </div>

                        <div className="grid grid-cols-3 gap-y-5 col-span-2">
                          {permissions?.data?.map((item, idx) => (
                            <div className="flex gap-x-2 items-center">
                              {" "}
                              <CustomCheckbox
                                type="checkbox"
                                id={item?.id}
                                value={item?.title}
                                name={item?.title}
                                onChange={(e) => {
                                  const permissionId = parseInt(e.target.id);

                                  setZone((prevZone) => {
                                    let updatedPermissions;

                                    if (e.target.checked) {
                                      updatedPermissions = [
                                        ...prevZone?.permission,
                                        permissionId,
                                      ];
                                    } else {
                                      updatedPermissions =
                                        prevZone?.permission.filter(
                                          (perm) => perm !== permissionId
                                        );
                                    }

                                    return {
                                      ...prevZone,
                                      permission: updatedPermissions,
                                    };
                                  });
                                }}
                                checked={zone?.permission?.includes(item.id)}
                                data-testid={`admin-permission-${item?.id}-chk`}
                              />
                              <label htmlFor={item?.id}>{item?.title}</label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col justify-center items-center gap-y-5">
                      <IoIosCloseCircleOutline size={100} color="red" />
                      <h4 className="mx-auto text-center text-3xl text-gray-500">
                        Are you sure?
                      </h4>
                      <p className="max-w-96 text-center text-gray-500 font-norms">
                        Do you really want to delete this admin?This process
                        cannot be undone.
                      </p>
                    </div>
                  )
                ) : (
                  <div className="w-full h-[40vh]">
                    <MiniLoader />
                  </div>
                )}
              </ModalBody>
              <ModalFooter
                pb={4}
                px={6}
                className="sticky bottom-0 z-10 bg-white"
              >
                <div className="flex gap-1">
                  <div data-testid="admin-modal-cancel-btn">
                    <BlackButton
                      text={t("cancel")}
                      onClick={() => {
                        setModal({ ...modal, isOpen: false });
                      }}
                    />
                  </div>

                  {modal.mod === "add" ? (
                    <div data-testid="admin-modal-add-btn">
                      <RedButton
                        text={t("Add Admin")}
                        onClick={() => {
                          addAdmin();
                        }}
                      />
                    </div>
                  ) : modal.mod === "update" ? (
                    <div data-testid="admin-modal-update-btn">
                      <RedButton
                        text={t("Update")}
                        onClick={() => {
                          updateAdmin();
                        }}
                      />
                    </div>
                  ) : (
                    <div data-testid="admin-modal-delete-btn">
                      <RedButton
                        text={t("Delete")}
                        onClick={() => {
                          deleteAdmin();
                        }}
                      />
                    </div>
                  )}
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
                      data-testid="admin-filter-country-select-input"
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
                      data-testid="admin-filter-city-select-input"
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
                      data-testid="admin-filter-zone-select-input"
                      placeholder="All Zones"
                      options={zoneOptions}
                      onChange={(e) => {
                        setTempFilterData({ ...tempFilterData, zone: e });
                      }}
                      value={tempFilterData?.zone}
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <div data-testid="admin-filter-clear-btn">
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
                    <div data-testid="admin-filter-apply-btn">
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
