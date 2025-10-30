import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Layout from "../../components/Layout";
import Helment from "../../components/Helment";
import MyDataTable from "../../components/MyDataTable";
import RedButton, {
  BlackButton,
  EditButton,
  HelmetBtn,
} from "../../utilities/Buttons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import Select from "react-select";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import GetAPI from "../../utilities/GetAPI";
import Loader, { MiniLoader } from "../../components/Loader";
import Switch from "react-switch";
import { PutAPI } from "../../utilities/PutAPI";
import {
  error_toaster,
  success_toaster,
  info_toaster,
} from "../../utilities/Toaster";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../utilities/URL";
import { FaUserAlt } from "react-icons/fa";
import { PostAPI } from "../../utilities/PostAPI";
import { IoCamera } from "react-icons/io5";
import { BsThreeDotsVertical } from "react-icons/bs";

export default function DeliverymanList() {
  const { t } = useTranslation(); // Use the t function
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loader, setLoader] = useState(false);
  const [step, setStep] = useState(1);
  const [scrollValue, setScrollValue] = useState(0);
  const [modal, setModal] = useState(false);
  const [filterModal, setFilterModal] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const filterOptions = GetAPI("admin/filterOptions");

  // Filter state
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

  const [driver, setDriver] = useState({
    //Step1 variables
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "",
    phoneNum: "",
    lang: "",
    password: "",
    confirmPassword: "",
    dob: "",
    country: "",
    city: "",
    zone: "",
    image: null,
    //Step2 variables
    streetAddress: "",
    City: "",
    building: "",
    state: "",
    zipCode: "",
    //Step3 variables
    licIssueDate: "",
    licExpiryDate: "",
    licNum: "",
    licFrontPhoto: null,
    licBackPhoto: null,
    serviceTypeId: "",
    userId: "",
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
    { value: "Freelancer`", label: "Freelance" },
  ];

  // Fetch drivers data with filters
  const getDriversData = async () => {
    const requestPayload = {
      countryId: filterData?.country?.value || null,
      cityId: filterData?.city?.value || null,
      zoneId: filterData?.zone?.value || null,
      driverType: filterData?.driverType?.value || null,
    };

    try {
      let res = await PostAPI("admin/activeDriversFilter", requestPayload);
      if (res?.data?.status === "1") {
        setData(res?.data);
      } else {
        setData({ data: [] });
        info_toaster(res?.data?.message || "No data found");
      }
    } catch (error) {
      console.error("Error fetching drivers:", error);
      setData({ data: [] });
      error_toaster("Failed to fetch drivers");
    }
    setLoading(false);
  };

  // Update status function
  const reFetch = () => {
    getDriversData();
  };

  const updateStatus = async (userId, userStatus) => {
    if (userStatus === true) {
      let res = await PutAPI("admin/driverStatus", {
        driverId: userId,
        status: 0,
      });
      if (res?.data?.status === "1") {
        success_toaster(res?.data?.message);
        getDriversData();
      } else {
        error_toaster(res?.data?.message);
      }
    } else {
      let res = await PutAPI("admin/driverStatus", {
        driverId: userId,
        status: 1,
      });
      if (res?.data?.status === "1") {
        success_toaster(res?.data?.message);
        getDriversData();
      } else {
        error_toaster(res?.data?.message);
      }
    }
  };

  const addDriverCityOptions = [];
  const addDriverCountryOptions = [];
  const addDriverZonesOptions = [];
  if (filterOptions) {
    filterOptions?.data?.data?.city?.map((el) => {
      addDriverCityOptions.push({
        value: el?.id,
        label: el?.name,
      });
    });
    filterOptions?.data?.data?.country?.map((el) => {
      addDriverCountryOptions.push({
        value: el?.id,
        label: el?.name,
      });
    });
    filterOptions?.data?.data?.zones?.map((el) => {
      addDriverZonesOptions.push({
        value: el?.id,
        label: el?.name,
      });
    });
  }
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

  const openModal = () => {
    setModal(true);
  };

  const viewDetails = (id) => {
    navigate(`/driver-details/${id}`, {
      state: {
        id: id,
      },
    });
  };

  const columns = [
    { field: "sn", header: t("serialNo") },
    { field: "picture", header: t("Picture") },
    { field: "name", header: t("name") },
    { field: "email", header: t("email") },
    { field: "phone", header: t("phone") },
    { field: "balance", header: t("balance") },
    { field: "status", header: t("status") },
    { field: "action", header: t("action") },
  ];

  const datas = [];
  const csv = [];
  driverData()?.map((values, index) => {
    csv.push({
      sn: index + 1,
      id: values?.id,
      name: values?.firstName,
      email: values?.email,
      phone: values?.phoneNum,
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
      status: (
        <div>
          {values?.status === true ? (
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
              {t("blocked")}
            </div>
          )}
        </div>
      ),
      action: (
        <div className="flex items-center gap-3">
          <label>
            <Switch
              onChange={() => {
                updateStatus(values?.id, values?.status);
              }}
              checked={values?.status === true}
              uncheckedIcon={false}
              checkedIcon={false}
              onColor="#139013"
              onHandleColor="#fff"
              className="react-switch"
              boxShadow="none"
            />
          </label>
          <EditButton
            text={t("Details")}
            onClick={() => viewDetails(values?.id)}
          />
        </div>
      ),
    });
  });

  const handleChange = (e, type, code) => {
    setDriver((prevDriver) => ({
      ...prevDriver,
      [type]: e,
      countryCode: code?.dialCode || prevDriver.countryCode,
    }));
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file && type === "image") {
      const imageUrl = URL.createObjectURL(file);
      setDriver({
        ...driver,
        image: file,
        imageShow: imageUrl,
      });
    } else if (file && type === "licFrontPhoto") {
      const imageUrl = URL.createObjectURL(file);
      setDriver({
        ...driver,
        licFrontPhoto: file,
        licFrontPhotoShow: imageUrl,
      });
    } else if (file && type === "licBackPhoto") {
      const imageUrl = URL.createObjectURL(file);
      setDriver({
        ...driver,
        licBackPhoto: file,
        licBackPhotoShow: imageUrl,
      });
    }
  };
  const handleCreateDriver = async () => {
    if (step === 1) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (driver?.firstName === "") {
        error_toaster("First name is required");
      } else if (driver.lastName === "") {
        error_toaster("Last name is required");
      } else if (driver?.email === "") {
        error_toaster("Email is required");
      } else if (driver?.phoneNum === "") {
        error_toaster("Phone no is required");
      } else if (driver?.password === "") {
        error_toaster("Password is required");
      } else if (driver?.password !== driver?.confirmPassword) {
        error_toaster("Password and confirm password do not match");
      } else if (driver?.image === "" || driver?.image === null) {
        error_toaster("Image is required");
      } else if (driver?.dob === "") {
        error_toaster("Date of birth is required");
      } else if (driver?.country === "") {
        error_toaster("Country is required");
      } else if (driver?.city === "") {
        error_toaster("City is required");
      } else if (driver?.zone === "") {
        error_toaster("Zone is required");
      } else if (!emailRegex.test(driver.email.trim().toLowerCase())) {
        error_toaster("Enter a valid email");
      } else {
        setLoader(true);
        const formData = new FormData();
        formData.append("firstName", driver?.firstName);
        formData.append("lastName", driver?.lastName);
        formData.append("email", driver?.email);
        formData.append("password", driver?.password);
        formData.append("countryCode", driver?.countryCode);
        formData.append(
          "phoneNum",
          driver?.phoneNum.replace(driver?.countryCode, "").trim()
        );
        formData.append("profile_image", driver?.image);
        formData.append("cityId", driver?.city?.value);
        formData.append("countryId", driver?.country?.value);
        formData.append("zoneId", driver?.zone?.value);
        formData.append("dob", driver?.dob);
        formData.append("lang", driver?.lang.value);

        let res = await PostAPI("driver/register/profile", formData);
        if (res?.data?.status === "1") {
          setLoader(false);
          success_toaster(res?.data?.message);
          setStep(2);
          setDriver({ ...driver, userId: res?.data?.data?.userId });
        } else {
          error_toaster(res?.data?.message);
          setLoader(false);
        }
      }
    } else if (step === 2) {
      //step 2 code here
      if (driver?.building === "") {
        error_toaster("Building name is required");
        return;
      } else if (driver?.streetAddress === "") {
        error_toaster("Street address is required");
        return;
      } else if (driver?.city === "") {
        error_toaster("City is required");
        return;
      } else if (driver?.state === "") {
        error_toaster("State is required");
        return;
      } else if (driver?.zipCode === "") {
        error_toaster("Zip code is required");
        return;
      }

      setLoader(true);
      let res2 = await PostAPI("driver/addAddress", {
        streetAddress: driver?.streetAddress,
        building: driver?.building,
        city: driver?.City,
        state: driver?.state,
        zipCode: driver?.zipCode,
        userId: driver?.userId,
        lat: driver?.lat,
        lng: driver?.lng,
      });

      if (res2?.data?.status === "1") {
        setLoader(false);
        success_toaster(res2?.data?.message);
        setStep(3);
      } else {
        error_toaster(res2?.data?.message);
        setLoader(false);
      }
    } else {
      const issueDate = new Date(driver.licIssueDate);
      const expiryDate = new Date(driver.licExpiryDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (!driver?.licNum?.trim()) {
        error_toaster("License number is required");
      } else if (!driver?.licIssueDate) {
        error_toaster("License issue date is required");
      } else if (!driver?.licExpiryDate) {
        error_toaster("License expiry date is required");
      } else if (!driver?.licFrontPhoto) {
        error_toaster("License front photo is required");
      } else if (!driver?.licBackPhoto) {
        error_toaster("License back photo is required");
      } else if (issueDate > today) {
        error_toaster("License issue date cannot be in the future");
      } else if (expiryDate < today) {
        error_toaster("License expiry date cannot be in the past");
      } else if (issueDate >= expiryDate) {
        error_toaster("License expiry date must be after issue date");
      } else {
        //step 3 code here
        setLoader(true);
        let formData = new FormData();

        formData.append("licIssueDate", driver?.licIssueDate || "");
        formData.append("licExpiryDate", driver?.licExpiryDate || "");
        formData.append("licNum", driver?.licNum || "");
        formData.append("licFrontPhoto", driver?.licFrontPhoto || "");
        formData.append("licBackPhoto", driver?.licBackPhoto || "");
        formData.append("serviceTypeId", driver?.serviceTypeId || 1);
        formData.append("userId", driver?.userId);

        let res = await PostAPI("driver/register/step3/profile", formData);

        if (res?.data?.status === "1") {
          setLoader(false);
          success_toaster(res?.data?.message);
          setStep(1);
          setModal(false);
        } else {
          error_toaster(res?.data?.message);
          setLoader(false);
        }
      }
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setDriver({
            ...driver,
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting geolocation: ", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  // Effect to fetch data when filters change
  useEffect(() => {
    getDriversData();
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

  const handleScroll = (event) => {
    const scrollTop = event.target.scrollTop; // Get scroll position
    setScrollValue(scrollTop);
  };

  return loading ? (
    <Loader />
  ) : (
    <Layout
      content={
        <div className="bg-themeGray p-5">
          <div className="bg-white rounded-lg p-5">
            <div className="flex justify-between items-center flex-wrap gap-5">
              <h2 className="text-themeRed text-lg font-bold font-norms">
                {t("allDrivers")}
              </h2>
              <div className="flex gap-2 items-center flex-wrap max-md:hidden">
                <Helment
                  search={true}
                  searchOnChange={(e) => setSearch(e.target.value)}
                  searchValue={search}
                  csvdata={csv}
                  filterButton={true}
                  onFilterClick={() => setFilterModal(true)}
                />
                <div className="">
                  <HelmetBtn text={t("+ Add New Driver")} onClick={openModal} />
                </div>
              </div>
              <details className="relative list-none md:hidden">
                <summary className="flex cursor-pointer">
                  {" "}
                  <BsThreeDotsVertical size={25} color="red" />
                </summary>
                <div className="absolute z-10 top-0 right-8 bg-white border border-black-400 text-red-500 px-5 py-5 space-y-2 rounded-md w-[280px]">
                  <Helment
                    search={true}
                    searchOnChange={(e) => setSearch(e.target.value)}
                    searchValue={search}
                    csvdata={csv}
                    filterButton={true}
                    onFilterClick={() => setFilterModal(true)}
                  />
                  <div className="flex justify-end">
                    <HelmetBtn
                      text={t("+ Add New Driver")}
                      onClick={openModal}
                    />
                  </div>
                </div>
              </details>
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
            motionPreset="slideInBottom"
          >
            <ModalOverlay />
            <ModalContent
              onScroll={handleScroll}
              className="h-[calc(100vh-10vh)] overflow-y-auto hide-scroll"
              borderRadius={"20px"}
              sx={{
                "@media screen and (max-width: 500px)": {
                  borderRadius: "20px",
                  borderBottomRadius: 0,
                  mb: 0,
                  height: "calc(100vh - 18vh)",
                  // overflowY: "auto",
                  // overflowX: "hidden",
                  // scrollbarWidth: "none",
                  // "-ms-overflow-style": "none",
                },
              }}
            >
              <ModalHeader
                padding={0}
                className={
                  scrollValue > 100
                    ? `sticky top-0 z-10 bg-white duration-150`
                    : ""
                }
              >
                <div className="border-b-2 border-b-[#0000001F] px-5 py-2.5 text-lg font-norms font-medium">
                  {step === 1
                    ? t("addNewDriver")
                    : step === 2
                    ? t("Address Details")
                    : " Driving License"}
                </div>
                <ModalCloseButton />
              </ModalHeader>
              <ModalBody padding={4}>
                {!loader ? (
                  <>
                    {step === 1 ? (
                      <div className="grid grid-cols-2 gap-5 h-full hide-scroll px-2 max-sm:px-0">
                        <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-200 border-gray-200 border-[1px] col-span-2">
                          <label
                            className="h-full flex flex-col font-semibold justify-center items-center text-gray-600 cursor-pointer"
                            htmlFor="image"
                          >
                            {driver?.image ? (
                              <img
                                className="w-full h-full object-cover rounded"
                                src={driver?.imageShow}
                                alt="image"
                              />
                            ) : (
                              <FaUserAlt size={40} color="white" />
                            )}
                          </label>
                          <input
                            className="bg-slate-100 outline-none py-4 px-3 w-full"
                            id="image"
                            name="image"
                            hidden
                            type="file"
                            onChange={(e) => {
                              handleImageChange(e, "image");
                            }}
                          />
                        </div>
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
                            onChange={(e) =>
                              handleChange(e.target.value, "firstName")
                            }
                            value={driver?.firstName}
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
                            value={driver?.lastName}
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
                            value={driver?.email}
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
                          />
                        </div>
                        <div className="space-y-1">
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
                            value={driver?.password}
                            onChange={(e) =>
                              handleChange(e.target.value, "password")
                            }
                          />
                        </div>
                        <div className="space-y-1">
                          <label
                            htmlFor="confirmPassword"
                            className="text-black font-switzer font-semibold"
                          >
                            {t("Confirm Password")}
                          </label>
                          <input
                            type="password"
                            name="confirmPassword"
                            id="confirmPassword"
                            className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                            value={driver?.confirmPassword}
                            onChange={(e) =>
                              handleChange(e.target.value, "confirmPassword")
                            }
                          />
                        </div>
                        <div>
                          <h4 className="text-black font-switzer font-semibold">
                            Language
                          </h4>
                          <Select
                            // styles={customStyles}
                            placeholder="Select"
                            name="lang"
                            options={[
                              { value: "en", label: "English" },
                              { value: "de", label: "German" },
                              { value: "fr", label: "French" },
                              { value: "es", label: "Spanish" },
                              { value: "it", label: "Italian" },
                              { value: "pt", label: "Portuguese" },
                              { value: "ru", label: "Russian" },
                              { value: "ja", label: "Japanese" },
                              { value: "zh", label: "Chinese" },
                              { value: "ar", label: "Arabic" },
                              { value: "ko", label: "Korean" },
                              { value: "hi", label: "Hindi" },
                              { value: "tr", label: "Turkish" },
                              { value: "nl", label: "Dutch" },
                              { value: "pl", label: "Polish" },
                              { value: "sv", label: "Swedish" },
                              { value: "no", label: "Norwegian" },
                              { value: "fi", label: "Finnish" },
                              { value: "da", label: "Danish" },
                              { value: "cs", label: "Czech" },
                              { value: "ro", label: "Romanian" },
                              { value: "el", label: "Greek" },
                              { value: "he", label: "Hebrew" },
                              { value: "id", label: "Indonesian" },
                              { value: "th", label: "Thai" },
                              { value: "vi", label: "Vietnamese" },
                              { value: "ms", label: "Malay" },
                            ]}
                            onChange={(e) => {
                              setDriver({
                                ...driver,
                                lang: e,
                              });
                            }}
                            value={driver?.lang}
                          />
                        </div>
                        <div className="space-y-1">
                          <label
                            htmlFor="dob"
                            className="text-black font-switzer font-semibold"
                          >
                            {t("DOB")}
                          </label>
                          <input
                            type="date"
                            name="dob"
                            id="dob"
                            className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                            value={driver?.dob}
                            onChange={(e) =>
                              handleChange(e.target.value, "dob")
                            }
                          />
                        </div>
                        <div>
                          <h4 className="text-black font-switzer font-semibold">
                            Country
                          </h4>
                          <Select
                            // styles={customStyles}
                            placeholder="Select"
                            name="country"
                            options={addDriverCountryOptions}
                            onChange={(e) => {
                              setDriver({
                                ...driver,
                                country: addDriverCountryOptions.find(
                                  (el) => el.value === e?.value
                                ),
                              });
                            }}
                            value={driver?.country}
                          />
                        </div>
                        <div>
                          <h4 className="text-black font-switzer font-semibold">
                            City
                          </h4>
                          <Select
                            // styles={customStyles}
                            placeholder="Select"
                            name="distanceUnitId"
                            options={addDriverCityOptions}
                            onChange={(e) => {
                              setDriver({
                                ...driver,
                                city: addDriverCityOptions.find(
                                  (el) => el.value === e?.value
                                ),
                              });
                            }}
                            value={driver?.city}
                          />
                        </div>
                        <div>
                          <h4 className="text-black font-switzer font-semibold">
                            Zone
                          </h4>
                          <Select
                            // styles={customStyles}
                            placeholder="Select"
                            name="zone"
                            options={addDriverZonesOptions}
                            onChange={(e) => {
                              setDriver({
                                ...driver,
                                zone: addDriverZonesOptions.find(
                                  (el) => el.value === e?.value
                                ),
                              });
                            }}
                            value={driver?.zone}
                          />
                        </div>
                      </div>
                    ) : step === 2 ? (
                      <div className="grid grid-cols-2 gap-5 h-max hide-scroll px-2 max-sm:px-0">
                        <p className="text-black text-xl font-switzer font-bold col-span-2">
                          What is your address?
                        </p>
                        <div className="space-y-1">
                          <label
                            htmlFor="streetAddress"
                            className="text-black font-switzer font-semibold"
                          >
                            {t("Street Address")}
                          </label>
                          <input
                            type="text"
                            name="streetAddress"
                            id="streetAddress"
                            className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                            onChange={(e) =>
                              handleChange(e.target.value, "streetAddress")
                            }
                          />
                        </div>
                        <div className="space-y-1">
                          <label
                            htmlFor="building"
                            className="text-black font-switzer font-semibold"
                          >
                            {t("Building/Apt.")}
                          </label>
                          <input
                            type="text"
                            name="building"
                            id="building"
                            className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                            onChange={(e) =>
                              handleChange(e.target.value, "building")
                            }
                          />
                        </div>
                        <div className="space-y-1">
                          <label
                            htmlFor="City"
                            className="text-black font-switzer font-semibold"
                          >
                            {t("City")}
                          </label>
                          <input
                            type="text"
                            name="City"
                            id="City"
                            className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                            onChange={(e) =>
                              handleChange(e.target.value, "City")
                            }
                          />
                        </div>

                        <div className="space-y-1">
                          <label
                            htmlFor="state"
                            className="text-black font-switzer font-semibold"
                          >
                            {t("State")}
                          </label>
                          <input
                            type="text"
                            name="state"
                            id="state"
                            className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                            onChange={(e) =>
                              handleChange(e.target.value, "state")
                            }
                          />
                        </div>
                        <div className="space-y-1 col-span-2">
                          <label
                            htmlFor="zipCode"
                            className="text-black font-switzer font-semibold"
                          >
                            {t("Zip Code")}
                          </label>
                          <input
                            type="text"
                            name="zipCode"
                            id="zipCode"
                            className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                            onChange={(e) =>
                              handleChange(e.target.value, "zipCode")
                            }
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-5 hide-scroll px-2 max-sm:px-0">
                        <h4 className="text-black text-xl font-switzer font-bold col-span-2">
                          Upload your Driving License
                        </h4>
                        <label
                          for="pic1"
                          className="border border-gray-500 border-dashed rounded-md h-36 flex justify-center items-center cursor-pointer overflow-hidden"
                        >
                          {!driver?.licFrontPhotoShow ? (
                            <div className="w-20 h-20 rounded-full bg-red-600 flex justify-center items-center">
                              {" "}
                              <IoCamera size={25} color="white" />
                            </div>
                          ) : (
                            <img src={driver?.licFrontPhotoShow} alt="" />
                          )}
                        </label>
                        <input
                          type="file"
                          name="licFrontPhoto"
                          id="pic1"
                          hidden
                          onChange={(e) =>
                            handleImageChange(e, "licFrontPhoto")
                          }
                        />
                        <label
                          for="pic2"
                          className="border border-gray-500 border-dashed rounded-md h-36 flex justify-center items-center cursor-pointer overflow-hidden"
                        >
                          {!driver?.licBackPhotoShow ? (
                            <div className="w-20 h-20 rounded-full bg-red-600 flex justify-center items-center">
                              {" "}
                              <IoCamera size={25} color="white" />
                            </div>
                          ) : (
                            <img src={driver?.licBackPhotoShow} alt="" />
                          )}
                        </label>
                        <input
                          type="file"
                          name="licBackPhoto"
                          id="pic2"
                          hidden
                          onChange={(e) => handleImageChange(e, "licBackPhoto")}
                        />
                        <div className="space-y-1">
                          <label
                            htmlFor="licIssueDate"
                            className="text-black font-switzer font-semibold"
                          >
                            {t("License Issue Date")}
                          </label>
                          <input
                            type="date"
                            name="licIssueDate"
                            id="licIssueDate"
                            className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                            onChange={(e) =>
                              handleChange(e.target.value, "licIssueDate")
                            }
                          />
                        </div>
                        <div className="space-y-1">
                          <label
                            htmlFor="licExpiryDate"
                            className="text-black font-switzer font-semibold"
                          >
                            {t("License Expiry Date")}
                          </label>
                          <input
                            type="date"
                            name="licExpiryDate"
                            id="licExpiryDate"
                            className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                            onChange={(e) =>
                              handleChange(e.target.value, "licExpiryDate")
                            }
                          />
                        </div>
                        <div className="space-y-1 col-span-2">
                          <label
                            htmlFor="licNum"
                            className="text-black font-switzer font-semibold"
                          >
                            {t("License No.")}
                          </label>
                          <input
                            type="text"
                            name="licNum"
                            id="licNum"
                            className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                            onChange={(e) =>
                              handleChange(e.target.value, "licNum")
                            }
                          />
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-[40vh]">
                    <MiniLoader />
                  </div>
                )}
              </ModalBody>
              <ModalFooter
                padding={4}
                className="sticky bottom-0 z-10 bg-white"
              >
                {step === 1 ? (
                  <>
                    <div className="flex gap-2">
                      <BlackButton
                        text={t("cancel")}
                        onClick={() => {
                          setModal(false);
                        }}
                      />

                      <RedButton
                        text={t("Create account")}
                        onClick={() => {
                          handleCreateDriver();
                        }}
                      />
                    </div>
                  </>
                ) : step === 2 ? (
                  <div className="">
                    <RedButton
                      text={t("Save changes")}
                      onClick={() => {
                        handleCreateDriver();
                      }}
                    />
                  </div>
                ) : (
                  <RedButton
                    text={t("Submit for review")}
                    onClick={() => {
                      handleCreateDriver();
                    }}
                  />
                )}
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
