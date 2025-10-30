import React, { useState, useRef } from "react";
import { FaArrowLeft } from "react-icons/fa";
import Layout from "../../components/Layout";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { BiImageAdd } from "react-icons/bi";
import { PostAPI } from "../../utilities/PostAPI";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Select } from "@chakra-ui/react";
import GetAPI from "../../utilities/GetAPI";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";
import { googleApiKey } from "../../utilities/URL";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function AddStore() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const getcountr = GetAPI("users/getCountriesAndCities");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    CountryCode: "+92",
    phoneNum: "",
    country: "",
    password: "",
    confirmPassword: "",
    businessType: "store",
    businessName: "",
    businessEmail: "",
    code: "+92",
    businessPhone: "",
    description: "",
    deliveryTime: null,
    address: "",
    city: "",
    zipCode: "",
    deviceToken: "deviceToken",
    lat: "31.4914",
    lng: "74.2385",
    logo: null,
    coverImage: null,
  });
  console.log(formData, "formData without post");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e, type) => {
    let files = e.target.files[0];
    if (files && type === "coverImage") {
      const coverUrl = URL.createObjectURL(files);
      setFormData({
        ...formData,
        coverImage: files,
        coverUrl,
      });
    }
    if (files && type === "logo") {
      let logoUrl = URL.createObjectURL(files);
      setFormData({
        ...formData,
        logo: files,
        logoUrl,
      });
    }
  };

  const handleSubmit = async (e) => {
    const data = new FormData();
    data.append("firstName", formData.firstName);
    data.append("lastName", formData.lastName);
    data.append("email", formData.email);
    data.append("CountryCode", formData.CountryCode);
    data.append("phoneNum", formData.phoneNum);
    data.append("country", formData.country);
    data.append("password", formData.password);
    data.append("confirmPassword", formData.confirmPassword);
    data.append("businessType", formData.businessType);
    data.append("businessName", formData.businessName);
    data.append("businessEmail", formData.businessEmail);
    data.append("code", formData.code);
    data.append("businessPhone", formData.businessPhone);
    data.append("description", formData.description);
    data.append("address", formData.address);
    data.append("city", formData.city);
    data.append("zipCode", formData.zipCode);
    data.append("deviceToken", formData.deviceToken);
    data.append("lat", formData.lat);
    data.append("lng", formData.lng);
    data.append("logo", formData.logo);
    data.append("coverImage", formData.coverImage);

    try {
      let res = await PostAPI("retailer/signup", data);
      if (res.data.status === "1") {
        toast.success(res.data.message);
        navigate("/all-stores");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: googleApiKey,
    libraries: ["places"],
  });

  const [slide, setSlide] = useState(2);
  const [loader, setLoader] = useState(false);
  const [country, setCountry] = useState({
    countryName: null,
    selectedCountryShortName: null,
  });
  console.log(country, "country");
add
  const countriesRestriction =
    country.selectedCountryShortName &&
    country.selectedCountryShortName !== "null"
      ? {
          componentRestrictions: {
            country: country.selectedCountryShortName.toLowerCase(), 
          },
        }
      : {};
  const countriesData = getcountr?.data?.data?.countries || [];
  const countryShortName = country.selectedCountryShortName;
  const filteredCountry = getcountr?.data?.data?.countries?.find(
    (c) => c.shortName === countryShortName
  );
  const filteredCities = filteredCountry?.cities || [];
  const handleCountryChange = (e) => {
    const selectedCountryId = parseInt(e.target.value);
    const selectedCountry = countriesData.find(
      (c) => c.id === selectedCountryId
    );

    if (selectedCountry) {
      setCountry({
        countryName: selectedCountry.name.trim(),
        selectedCountryShortName: selectedCountry.shortName.trim(),
      });
      setFormData((prev) => ({
        ...prev,
        country: selectedCountry.name.trim(),
      }));
    } else {
      setCountry({
        countryName: null,
        selectedCountryShortName: null,
      });
      setFormData((prev) => ({
        ...prev,
        country: "",
      }));
    }
  };

  const [address, setAddress] = useState({
    id: "",
    lat: "",
    lng: "",
    building: "",
    city: "",
    AddressType: "",
    locationType: "",
    state: "",
    streetAddress: "",
    zipCode: "",
    entrance: "",
    door: "",
    instructions: "",
    other: false,
  });
  const autocompleteRef = useRef(null);

  return (
    <Layout
      content={
        <>
          <div className="bg-themeGray p-5">
            <div className="bg-white rounded-lg p-5">
              <div className="flex gap-5 items-center">
                <button
                  className="bg-themeGray p-2 rounded-full"
                  onClick={() => window.history.back()}
                >
                  <FaArrowLeft />
                </button>
                <h2 className="text-themeRed text-lg font-bold font-norms">
                  {t("Add Store")}
                </h2>
              </div>
              {/* =======0========= */}
              <div className="w-full flex overflow-hidden relative">
                <div
                  className={`w-full py-10 mx-auto flex flex-col items-center shrink-0 ${
                    slide === 0 ? "" : "hidden"
                  }`}
                >
                  <h4 className="text-3xl font-bold">
                    {t("Create a new store")}
                  </h4>
                  <div className="flex flex-col mt-8 w-1/3 items-center justify-center gap-8">
                    <div className="flex gap-4 mt-8 w-full items-center justify-center">
                      <div className="w-full">
                        <input
                          className="bg-slate-100 outline-none py-4 px-3 w-full"
                          placeholder="First Name"
                          name="firstName"
                          type="text"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="w-full">
                        <input
                          className="bg-slate-100 outline-none py-4 px-3 w-full"
                          placeholder="Last Name"
                          name="lastName"
                          type="text"
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="w-full">
                      <input
                        className="bg-slate-100 outline-none py-4 px-3 w-full"
                        placeholder="Email"
                        name="email"
                        type="text"
                        onChange={handleChange}
                      />
                    </div>

                    <div className="flex w-full gap-4">
                      <div className="w-32">
                        <PhoneInput
                          country={"pk"}
                          inputStyle={{
                            width: "100%",
                            height: "54px",
                            borderRadius: "6px",
                            outline: "none",
                            border: "none",
                            background: "#F1F5F9",
                          }}
                          inputProps={{
                            id: "CountryCode",
                            name: "CountryCode",
                          }}
                          onChange={(CountryCode) =>
                            setFormData({
                              ...formData,
                              CountryCode: CountryCode,
                            })
                          }
                          value={formData?.CountryCode}
                        />
                      </div>
                      <div className="w-full">
                        <input
                          type="number"
                          name="phoneNum"
                          className="bg-slate-100 w-full py-4 px-3 rounded-md outline-none"
                          placeholder="Phone"
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="w-full relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="bg-slate-100 outline-none py-4 px-4 w-full pr-10"
                        name="password"
                        placeholder="Create Password"
                        onChange={handleChange}
                      />
                      <button
                        type="button"
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

                    <div className="w-full relative mt-4">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        className="bg-slate-100 outline-none py-4 px-4 w-full pr-10"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                        tabIndex={-1}
                        aria-label={
                          showConfirmPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    <div className="w-full">
                      <button
                        className="bg-green-700 text-white font-semibold w-full block py-4 rounded-md"
                        onClick={() => {
                          if (!formData?.firstName) {
                            toast.error("Enter first name");
                          } else if (!formData?.lastName) {
                            toast.error("Enter last name");
                          } else if (!formData?.email) {
                            toast.error("Enter email");
                          } else if (!formData?.phoneNum) {
                            toast.error("Enter phone number");
                          } else if (!formData?.password) {
                            toast.error("Enter password");
                          } else if (!formData?.confirmPassword) {
                            toast.error("Enter confirm password");
                          } else if (
                            formData?.password !== formData?.confirmPassword
                          ) {
                            toast.error("Password do not match");
                          } else {
                            setSlide((prev) => (prev = prev + 1));
                          }
                        }}
                      >
                        {t("Sign Up Free")}
                      </button>
                    </div>
                  </div>
                </div>

                {/* =========1=========== */}

                <div
                  className={`w-full py-10 mx-auto flex flex-col items-center shrink-0 ${
                    slide === 1 ? "" : "hidden"
                  }`}
                >
                  <div
                    className={`absolute top-12 left-2 text-3xl cursor-pointer ${
                      slide === 0 ? "hidden" : ""
                    }`}
                    onClick={() => setSlide((prev) => (prev = prev - 1))}
                  >
                    <MdOutlineArrowBackIosNew />
                  </div>{" "}
                  <h4 className="text-3xl font-bold">
                    {t("Store Information")}
                  </h4>
                  <div className="flex flex-col mt-8 w-1/3 items-center justify-center gap-8">
                    <div className="flex flex-col gap-4 mt-8 w-full relative">
                      <div
                        className={`w-full h-[200px] bg-slate-100  rounded-sm`}
                      >
                        <label
                          className="w-full h-full flex flex-col justify-center items-center text-gray-600 cursor-pointer"
                          htmlFor="coverImage"
                        >
                          {formData.coverUrl ? (
                            <img
                              className="w-full h-full object-cover rounded"
                              src={`${formData?.coverUrl}`}
                              alt=""
                            />
                          ) : (
                            <BiImageAdd size={40} />
                          )}
                          {formData.coverUrl ? (
                            ""
                          ) : (
                            <p>{t("Upload cover image")}</p>
                          )}
                        </label>
                        <input
                          className="bg-slate-100 outline-none py-4 px-3 w-full"
                          id="coverImage"
                          name="coverImage"
                          hidden
                          type="file"
                          onChange={(e) => handleFileChange(e, "coverImage")}
                        />
                      </div>
                      <div className="w-32 h-32 rounded-md bg-slate-100 shadow-md border-gray-200 border-[1px] absolute bottom-[-70px] left-6">
                        <label
                          className="h-full flex flex-col font-semibold justify-center items-center text-gray-600 cursor-pointer"
                          htmlFor="logo"
                        >
                          {formData.logoUrl ? (
                            <img
                              className="w-full h-full object-cover rounded"
                              src={`${formData?.logoUrl}`}
                              alt=""
                            />
                          ) : (
                            <BiImageAdd size={40} />
                          )}
                          {formData.logoUrl ? "" : <p>{t("Upload logo")}</p>}
                        </label>
                        <input
                          className="bg-slate-100 outline-none py-4 px-3 w-full"
                          id="logo"
                          name="logo"
                          hidden
                          type="file"
                          onChange={(e) => handleFileChange(e, "logo")}
                        />
                      </div>
                    </div>

                    <div className="w-full mt-32">
                      <button
                        className="bg-green-700 text-white text-lg font-semibold w-full block py-4 rounded-md"
                        onClick={() => {
                          if (!formData?.coverImage) {
                            toast.error("Upload Cover image");
                          } else if (!formData?.logo) {
                            toast.error("Upload Logo");
                          } else {
                            setSlide((prev) => (prev = prev + 1));
                          }
                        }}
                      >
                        {t("Next")} 2/3
                      </button>
                      <button
                        className="bg-white text-gray-500 border-gray-400 border-[1px] text-lg font-semibold w-full block py-4 rounded-md mt-5"
                        onClick={() => navigate("/all-stores")}
                      >
                        {t("I'll do this later")}
                      </button>
                    </div>
                  </div>
                </div>

                {/* =========2=========== */}
                <div className="w-full py-10 mx-auto flex flex-col justify-center items-center shrink-0">
                  <div
                    className={`absolute top-12 left-2 text-3xl cursor-pointer ${
                      slide === 0 ? "hidden" : ""
                    }`}
                    onClick={() => setSlide((prev) => (prev = prev - 1))}
                  >
                    <MdOutlineArrowBackIosNew />
                  </div>{" "}
                  <h4 className="text-3xl font-bold">
                    {t("Store Information")}
                  </h4>
                  <div className="flex flex-col mt-8 w-1/3 items-center justify-center gap-4">
                    <div className="w-full">
                      <input
                        className="bg-slate-100 outline-none py-4 px-3 w-full"
                        placeholder="Store Name"
                        name="businessName"
                        type="text"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="w-full">
                      <input
                        className="bg-slate-100 outline-none py-4 px-3 w-full"
                        placeholder="Business Email"
                        name="businessEmail"
                        type="text"
                        onChange={handleChange}
                      />
                    </div>

                    <div className="flex w-full gap-4">
                      <div className="w-32">
                        <PhoneInput
                          country={"pk"}
                          inputStyle={{
                            width: "100%",
                            height: "54px",
                            borderRadius: "6px",
                            outline: "none",
                            border: "none",
                            background: "#F1F5F9",
                          }}
                          inputProps={{
                            id: "code",
                            name: "code",
                          }}
                          onChange={(code) =>
                            setFormData({ ...formData, code: code })
                          }
                          value={formData?.code}
                        />
                      </div>
                      <div className="w-full">
                        <input
                          type="number"
                          name="businessPhone"
                          className="bg-slate-100 w-full py-4 px-3 rounded-md outline-none"
                          placeholder="Business Phone"
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="w-full">
                      <textarea
                        className="bg-slate-100 outline-none py-4 px-4 w-full min-h-[100px]"
                        onResize="none"
                        placeholder="Description (Optional)"
                        name="description"
                        id="description"
                        onChange={handleChange}
                      ></textarea>
                    </div>
                    <div className="w-full">
                      <input
                        type="number"
                        className="bg-slate-100 outline-none py-4 px-4 w-full"
                        name="deliveryTime"
                        placeholder="Default Delivery Time Minutes"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="w-full">
                      <Select
                        placeholder="Select Country"
                        name="country"
                        id="country"
                        onChange={handleCountryChange}
                        value={
                          countriesData.findIndex(
                            (c) => c.name.trim() === country.countryName
                          ) !== -1
                            ? countriesData.find(
                                (c) => c.name.trim() === country.countryName
                              ).id
                            : ""
                        }
                        sx={{
                          bg: "#f1f5f9", // same bg color
                          outline: "none",
                          py: "16px", // py-4 = 16px vertical padding
                          px: "12px",
                          w: "100%",
                          borderRadius: "6px",
                          border: "none",
                          _focus: { outline: "none", boxShadow: "none" }, // remove focus ring
                          height: "56px", // same height as PhoneInput
                        }}
                      >
                        {countriesData.map((country) => (
                          <option key={country.id} value={country.id}>
                            {country.name.trim()}
                          </option>
                        ))}
                      </Select>
                    </div>

                    <div className="w-full">
                      <Select
                        placeholder="Select City"
                        name="city"
                        id="city"
                        onChange={handleChange}
                        value={formData.city}
                        sx={{
                          bg: "#f1f5f9", // same bg color
                          outline: "none",
                          py: "16px", // py-4 = 16px vertical padding
                          px: "12px",
                          w: "100%",
                          borderRadius: "6px",
                          border: "none",
                          _focus: { outline: "none", boxShadow: "none" }, // remove focus ring
                          height: "56px", // same height as PhoneInput
                        }}
                      >
                        {filteredCities.map((city) => (
                          <option key={city.id} value={city.name}>
                            {city.name}
                          </option>
                        ))}
                      </Select>
                    </div>

                    <div className="w-full">
                      {isLoaded && (
                        <Autocomplete
                          onLoad={(autocomplete) =>
                            (autocompleteRef.current = autocomplete)
                          }
                          onPlaceChanged={() => {
                            if (!autocompleteRef.current) return;
                            const place = autocompleteRef.current.getPlace();

                            if (!place.geometry) {
                              console.log("No geometry found for this place");
                              return;
                            }

                            const lat = place.geometry.location.lat();
                            const lng = place.geometry.location.lng();

                            // Set lat and lng in formData
                            const formattedAddress =
                              place.formatted_address || "";

                            // Set lat, lng and address in formData
                            setFormData((prev) => ({
                              ...prev,
                              lat: lat.toString(),
                              lng: lng.toString(),
                              address: formattedAddress,
                            }));
                          }}
                          options={countriesRestriction}
                        >
                          <input
                            placeholder="Street Address"
                            className="bg-slate-100 outline-none py-4 px-4 w-full"
                          />
                        </Autocomplete>
                      )}
                    </div>
                    <div className="w-full">
                      <input
                        className="bg-slate-100 outline-none py-4 px-3 w-full"
                        placeholder="Zip"
                        name="zipCode"
                        type="text"
                        onChange={handleChange}
                      />
                    </div>

                    <div className="w-full">
                      <button
                        className="bg-green-700 text-white font-semibold w-full block py-4 rounded-md"
                        onClick={() => {
                          if (!formData?.businessName) {
                            toast.error("Enter Store Name");
                          } else if (!formData?.businessEmail) {
                            toast.error("Enter Business Email");
                          } else if (!formData?.businessPhone) {
                            toast.error("Enter Business Phone");
                          } else if (!formData?.address) {
                            toast.error("Enter Street Address");
                          } else if (!formData?.city) {
                            toast.error("Enter City");
                          } else if (!formData?.zipCode) {
                            toast.error("Enter Zip Code");
                          } else {
                            handleSubmit();
                          }
                        }}
                      >
                        {t("Finish")} 3/3
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      }
    />
  );
}
