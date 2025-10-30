import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaWallet } from "react-icons/fa";
import Layout from "../../../components/Layout";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Helment from "../../../components/Helment";
import MyDataTable from "../../../components/MyDataTable";
import RedButton, { BlackButton, TabButton } from "../../../utilities/Buttons";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import GetAPI from "../../../utilities/GetAPI";
import Loader, { MiniLoader } from "../../../components/Loader";
import dayjs from "dayjs";
import { PutAPI } from "../../../utilities/PutAPI";
import { error_toaster, success_toaster } from "../../../utilities/Toaster";
import { BASE_URL } from "../../../utilities/URL";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import timezone from "dayjs/plugin/timezone";
import localizedFormat from "dayjs/plugin/localizedFormat";
import utc from "dayjs/plugin/utc";
dayjs.extend(localizedFormat);
dayjs.extend(timezone);
dayjs.extend(utc);

export default function DriverDetails() {
  const navigate = useNavigate();

  const { id } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const location = useLocation();
  const { data, reFetch } = GetAPI(`admin/driverdetails/${id}`);
  const [filter, setFilter] = useState("currentyear");
  var walletFilterData = GetAPI(
    `admin/driverTransaction/${id}?filterType=${filter}`
  );

  const customStyles = {
    control: (provided) => ({
      ...provided,
      padding: "2px 0",
      backgroundColor: "#F4F4F4",
      border: "none",
      "&:hover": {
        border: "none",
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "0 8px",
    }),
  };

  const [tab, setTab] = useState("User Detail");
  const [search, setSearch] = useState("");
  const [loader, setLoader] = useState(false);
  const [details, setDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "",
    phoneNum: "",
    password: "",
    dob: "",
    zoneName: "",
    driverType: "",
    language: "",
    city: "",
    country: "",
  });
  console.log("🚀 ~ DriverDetails ~ details:", details);
  const [licDetails, setLicDetails] = useState({
    licIssueDate: "",
    licExpiryDate: "",
    licNum: "",
    serviceType: "",
    licFrontPhoto: "",
    licBackPhoto: "",
  });
  const [customfilter, setCustomfilter] = useState({
    startDate: "",
    endDate: "",
  });

  const handleOnEventChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const updateUserDetails = async () => {
    setLoader(true);
    const res = await PutAPI(`admin/updateuserdetails/${id}`, {
      firstName: details?.firstName,
      lastName: details?.lastName,
      email: details?.email,
      countryCode: details?.countryCode?.includes("+")
        ? details?.countryCode
        : "+" + details?.countryCode,
      phoneNum: details?.phoneNum,
      password: details?.password,
      dob: details?.dob,
      zoneName: details?.zoneName,
      driverType: details?.driverType,
      language: details?.language,
      city: details?.city,
      country: details?.country,
    });
    if (res?.data?.status === "1") {
      reFetch();
      setLoader(false);
      success_toaster(res?.data?.message);
    } else {
      setLoader(false);
      error_toaster(res?.data?.message);
    }
  };

  useEffect(() => {
    const fetchData = () => {
      if (data && data?.data && data?.data) {
        setDetails({
          firstName: data?.data?.firstName || "",
          lastName: data?.data?.lastName || "",
          email: data?.data?.email || "",
          countryCode: data?.data?.countryCode || "",
          phoneNum: data?.data?.phoneNum || "",
          password: data?.data?.password || "",
          dob: data?.data?.dob || "",
          zoneName: data?.data?.zoneName || "",
          driverType: data?.data?.driverType || "",
          language: data?.data?.language || "",
          city: data?.data?.city || "",
          country: data?.data?.country || "",
        });
        setLicDetails({
          licIssueDate: dayjs(
            data?.data?.driverDetails[0]?.licIssueDate
          ).format("DD-MM-YYYY"),
          licExpiryDate: dayjs(
            data?.data?.driverDetails[0]?.licExpiryDate
          ).format("DD-MM-YYYY"),
          licNum: data?.data?.driverDetails[0]?.licNum,
          serviceType: data?.data?.driverDetails[0]?.serviceType?.name,
          licFrontPhoto: data?.data?.driverDetails[0]?.licFrontPhoto,
          licBackPhoto: data?.data?.driverDetails[0]?.licBackPhoto,
        });
      }
    };
    fetchData();
  }, [data, id, filter]);

  const orderData = () => {
    const filteredData = data?.data?.allOrders?.filter((dat) => {
      return (
        search === "" ||
        (dat?.id && dat?.id.toString().includes(search.toLowerCase())) ||
        (dat?.orderNum &&
          dat?.orderNum.toString().includes(search.toLowerCase())) ||
        (dat?.restaurant?.businessName &&
          dat?.restaurant?.businessName
            .toLowerCase()
            .includes(search.toLowerCase()))
      );
    });
    return filteredData;
  };

  const transactionData = () => {
    const filteredData = (
      walletFilterData?.data?.data?.length > 0
        ? walletFilterData?.data?.data
        : data?.data?.transactions
    )?.filter((dat) => {
      return (
        search === "" ||
        (dat?.id && dat?.id.toString().includes(search.toLowerCase())) ||
        (dat?.orderId &&
          dat?.orderId.toString().includes(search.toLowerCase())) ||
        (dat?.paymentType &&
          dat?.paymentType.toLowerCase().includes(search.toLowerCase()))
      );
    });
    return filteredData;
  };

  const vehicleData = () => {
    const filteredData = data?.data?.vehicleDetails?.filter((dat) => {
      return (
        search === "" ||
        (dat?.id && dat?.id.toString().includes(search.toLowerCase())) ||
        (dat?.make && dat?.make.toLowerCase().includes(search.toLowerCase())) ||
        (dat?.model &&
          dat?.model.toLowerCase().includes(search.toLowerCase())) ||
        (dat?.registrationNum &&
          dat?.registrationNum.toLowerCase().includes(search.toLowerCase()))
      );
    });
    return filteredData;
  };

  const viewDetails = (orderId) => {
    navigate(`/restaurant/order-details/${orderId}`);
  };

  if (tab === "Orders") {
    var columns = [
      { field: "sn", header: "Serial. No" },
      { field: "id", header: "Id" },
      {
        field: "restaurant",
        header: "Restaurant",
      },
      {
        field: "orderNumber",
        header: "Order Num",
      },
      {
        field: "date",
        header: "Schedule Date",
      },
      {
        field: "total",
        header: "Total",
      },
      {
        field: "status",
        header: "Order status",
      },
      {
        field: "action",
        header: "Action",
      },
    ];
  } else if (tab === "Wallet Transaction") {
    var columns = [
      { field: "sn", header: "Serial. No" },
      { field: "id", header: "Id" },
      {
        field: "orderId",
        header: "Order Id",
      },
      {
        field: "paymentType",
        header: "Payment Type",
      },
      {
        field: "amount",
        header: "Amount",
      },
      {
        field: "date",
        header: "Date",
      },
    ];
  } else {
    var columns = [
      { field: "sn", header: "Serial. No" },
      { field: "id", header: "Id" },
      { field: "picture", header: "Picture" },
      {
        field: "make",
        header: "Make",
      },
      {
        field: "model",
        header: "Model",
      },
      {
        field: "registrationNum",
        header: "Registration Num",
      },
      {
        field: "color",
        header: "Color",
      },
      {
        field: "type",
        header: "Vehicle Type ",
      },
    ];
  }

  const datas = [];
  if (tab === "Orders") {
    orderData()?.map((values, index) => {
      return datas.push({
        sn: index + 1,
        id: values?.id,
        restaurant: values?.restaurant?.businessName,
        orderNumber: values?.orderNum,
        date: dayjs(values?.scheduleDate)
          ?.local()
          .format("DD-MM-YYYY h:mm:ss A"),
        total: `${data?.data?.driverUnits?.currencyUnit?.symbol}${values?.total}`,
        status: values?.orderStatus?.name,
        action: (
          <RedButton
            text="View Details"
            onClick={() => viewDetails(values?.id)}
          />
        ),
      });
    });
  } else if (tab === "Wallet Transaction") {
    transactionData()?.map((values, index) => {
      return datas.push({
        sn: index + 1,
        id: values?.id,
        orderId: values?.orderId,
        paymentType: values?.paymentType,
        amount: values?.amount,
        date: dayjs(values?.at).format("DD-MM-YYYY h:mm:ss A"),
      });
    });
  } else {
    vehicleData()?.map((values, index) => {
      return datas.push({
        sn: index + 1,
        id: values?.id,
        picture: (
          <button
            className="bg-green-500 px-4 py-2 text-white font-semibold rounded-md outline-none"
            onClick={onOpen}
          >
            View
          </button>
        ),
        make: values?.make,
        model: values?.model,
        color: values?.color,
        registrationNum: values?.registrationNum,
        type: values?.vehicleType?.name,
      });
    });
  }

  const handlePhoneChange = (value, data) => {
    setDetails({
      ...details,
      countryCode: data.dialCode,
      phoneNum: value.slice(data.dialCode.length),
    });
  };

  return data?.length === 0 ? (
    <Loader />
  ) : (
    <Layout
      content={
        <div className="bg-themeGray p-5">
          <div className="bg-white rounded-lg p-5 min-h-screen">
            <div className="flex gap-5 items-center">
              <button
                className="bg-themeGray p-2 rounded-full"
                onClick={() => window.history.back()}
              >
                <FaArrowLeft />
              </button>
              <h2 className="text-themeRed text-lg font-bold font-norms">
                {tab === "User Detail" ? (
                  "User Detail"
                ) : tab === "User Role" ? (
                  "Role Management"
                ) : tab === "Wallet Transaction" ? (
                  "Wallet Transactions"
                ) : tab === "Orders" ? (
                  "Orders"
                ) : tab === "Vehicle details" ? (
                  "Vehicle Details"
                ) : tab === "License details" ? (
                  "License Details"
                ) : tab === "Reviews" ? (
                  "Reviews"
                ) : (
                  <></>
                )}
              </h2>
            </div>

            <div className="py-5 space-y-1.5">
              <ul className="flex flex-wrap items-center gap-8">
                <TabButton
                  title="User Detail"
                  tab={tab}
                  onClick={() => setTab("User Detail")}
                />
                <TabButton
                  title="User Role"
                  tab={tab}
                  onClick={() => setTab("User Role")}
                />
                <TabButton
                  title="Wallet Transaction"
                  tab={tab}
                  onClick={() => setTab("Wallet Transaction")}
                />
                <TabButton
                  title="Orders"
                  tab={tab}
                  onClick={() => setTab("Orders")}
                />
                <TabButton
                  title="Vehicle details"
                  tab={tab}
                  onClick={() => setTab("Vehicle details")}
                />
                <TabButton
                  title="License details"
                  tab={tab}
                  onClick={() => setTab("License details")}
                />
                <TabButton
                  title="Reviews"
                  tab={tab}
                  onClick={() => setTab("Reviews")}
                />
              </ul>
              <div className={`w-full bg-[#00000033] h-[1px]`}></div>
            </div>

            {tab === "User Detail" ? (
              loader ? (
                <MiniLoader />
              ) : (
                <div className="space-y-3">
                  {data?.data?.driverDetails?.[0]?.profilePhoto ? (
                    <div>
                      <img
                        src={`${BASE_URL}${data?.data?.driverDetails?.[0]?.profilePhoto}`}
                        alt="profile"
                        className="w-32 h-32 object-cover rounded-full"
                      />
                    </div>
                  ) : (
                    <div className="w-32 h-32 bg-gray-300 rounded-full flex justify-center items-center text-bold text-2xl font-switzer">
                      <p>
                        {data?.data?.firstName?.charAt(0).toUpperCase()}
                        {data?.data?.lastName?.charAt(0).toUpperCase()}
                      </p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-1">
                      <label
                        htmlFor="firstName"
                        className="text-black font-switzer font-semibFold"
                      >
                        First Name
                      </label>
                      <input
                        value={details?.firstName}
                        onChange={handleOnEventChange}
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
                        Last Name
                      </label>
                      <input
                        value={details?.lastName}
                        onChange={handleOnEventChange}
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
                        Email
                      </label>
                      <input
                        value={details?.email}
                        onChange={handleOnEventChange}
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
                        Phone No
                      </label>
                      <div className="">
                        <div className="col-span-1">
                          <PhoneInput
                            value={details?.countryCode + details?.phoneNum}
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
                        {/* <div className="col-span-4">
                          <input
                            value={details?.phoneNum}
                            onChange={handleOnEventChange}
                            type="number"
                            name="phoneNum"
                            className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                          />
                        </div> */}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label
                        htmlFor="country"
                        className="text-black font-switzer font-semibold"
                      >
                        Country
                      </label>
                      <input
                        value={details?.country}
                        onChange={handleOnEventChange}
                        type="text"
                        name="country"
                        id="country"
                        className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label
                        htmlFor="city"
                        className="text-black font-switzer font-semibold"
                      >
                        Delivery City
                      </label>
                      <input
                        value={details?.city}
                        onChange={handleOnEventChange}
                        type="text"
                        name="city"
                        id="city"
                        className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label
                        htmlFor="zoneName"
                        className="text-black font-switzer font-semibold"
                      >
                        Zone
                      </label>
                      <input
                        value={details?.zoneName}
                        onChange={handleOnEventChange}
                        type="text"
                        name="zoneName"
                        id="zoneName"
                        className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label
                        htmlFor="language"
                        className="text-black font-switzer font-semibold"
                      >
                        Language Spoken
                      </label>
                      <input
                        value={details?.language}
                        onChange={handleOnEventChange}
                        type="text"
                        name="language"
                        id="language"
                        className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label
                        htmlFor="dob"
                        className="text-black font-switzer font-semibold"
                      >
                        DOB
                      </label>
                      <input
                        value={details?.dob}
                        onChange={handleOnEventChange}
                        type="text"
                        name="dob"
                        id="dob"
                        className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label
                        htmlFor="driverType"
                        className="text-black font-switzer font-semibold"
                      >
                        Driver Type
                      </label>
                      <input
                        value={details?.driverType}
                        onChange={handleOnEventChange}
                        type="text"
                        name="driverType"
                        id="driverType"
                        className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                      />
                    </div>

                    <div className="space-y-1 col-span-2">
                      <label
                        htmlFor="password"
                        className="text-black font-switzer font-semibold"
                      >
                        Password
                      </label>
                      <input
                        onChange={handleOnEventChange}
                        type="password"
                        name="password"
                        id="password"
                        className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                      />
                    </div>
                    <div className="flex items-center gap-2 col-span-2 justify-end">
                      {/* <RedButton text="Block Driver" /> */}
                      <BlackButton
                        text="Update User"
                        onClick={updateUserDetails}
                      />
                    </div>
                  </div>
                </div>
              )
            ) : tab === "User Role" ? (
              <div className="flex gap-10 items-center">
                <h2 className="text-black font-switzer font-semibold">
                  Current Role :
                </h2>

                <div>
                  <RedButton text={data?.data?.userType} />
                </div>
              </div>
            ) : tab === "Wallet Transaction" ? (
              <div className="space-y-5">
                <div className="flex gap-5">
                  <div className="bg-themeGray w-72 h-40 p-3 rounded-lg flex flex-col gap-8">
                    <div className="flex justify-between items-center">
                      <h2 className="text-themeBorderGray font-switzer">
                        Available Balance
                      </h2>

                      <div className="w-12 h-12 rounded-full bg-white p-2 flex items-center justify-center">
                        <FaWallet size={20} color="#E13743" />
                      </div>
                    </div>

                    <div className="text-4xl font-norms font-medium">
                      {data?.data?.driverUnits?.currencyUnit?.symbol}{" "}
                      {data?.data?.availableBalance}
                    </div>
                  </div>

                  <div className="bg-themeGray w-72 h-40 p-3 rounded-lg flex flex-col gap-8">
                    <div className="flex justify-between items-center">
                      <h2 className="text-themeBorderGray font-switzer">
                        Total Earnings
                      </h2>
                      <div className="w-12 h-12 rounded-full bg-white p-2 flex items-center justify-center">
                        <FaWallet size={20} color="#E13743" />
                      </div>
                    </div>

                    <div className="text-4xl font-norms font-medium">
                      {data?.data?.driverUnits?.currencyUnit?.symbol}{" "}
                      {data?.data?.totalEarning}
                    </div>
                  </div>
                </div>
                <div className="w-full bg-[#00000033] h-[1.5px]"></div>
                <div className="space-y-5">
                  {/* <Helment
                    search={true}
                    searchOnChange={(e) => setSearch(e.target.value)}
                    searchValue={search}
                    csvdata={datas}
                  /> */}
                  <div className="grid grid-cols-6 gap-2 [&>button]:bg-themeRed [&>button]:text-white [&>button]:rounded-md [&>button]:py-3 [&>button]:font-semibold">
                    <button
                      className="hover:bg-black duration-75"
                      onClick={() => setFilter("last90days")}
                    >
                      Last 90 Days
                    </button>
                    <button
                      className="hover:bg-black duration-75"
                      onClick={() => setFilter("lastweek")}
                    >
                      Last week
                    </button>
                    <button
                      className="hover:bg-black duration-75"
                      onClick={() => setFilter("lastmonth")}
                    >
                      Last month
                    </button>
                    <button
                      className="hover:bg-black duration-75"
                      onClick={() => setFilter("lastyear")}
                    >
                      Last year
                    </button>
                    <button
                      className="hover:bg-black duration-75"
                      onClick={() => setFilter("currentyear")}
                    >
                      Current year
                    </button>
                    <button
                      className="hover:bg-black duration-75"
                      onClick={() => {
                        onOpen();
                      }}
                    >
                      Custom
                    </button>
                  </div>
                  <MyDataTable columns={columns} data={datas} />
                </div>
              </div>
            ) : tab === "Orders" ? (
              <div className="space-y-5">
                <Helment
                  search={true}
                  searchOnChange={(e) => setSearch(e.target.value)}
                  searchValue={search}
                  csvdata={datas}
                />
                <MyDataTable columns={columns} data={datas} />
              </div>
            ) : tab === "Vehicle details" ? (
              <div className="space-y-5">
                <Helment
                  search={true}
                  searchOnChange={(e) => setSearch(e.target.value)}
                  searchValue={search}
                  csvdata={datas}
                />
                <MyDataTable columns={columns} data={datas} />
              </div>
            ) : tab === "License details" ? (
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1">
                  <label
                    htmlFor="issueDate"
                    className="text-black font-switzer font-semibold"
                  >
                    License Issue Date
                  </label>
                  <input
                    type="text"
                    name="issueDate"
                    id="issueDate"
                    className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                    value={licDetails?.licIssueDate}
                  />
                </div>
                <div className="space-y-1">
                  <label
                    htmlFor="expiryDate"
                    className="text-black font-switzer font-semibold"
                  >
                    License Expiry Date
                  </label>
                  <input
                    type="text"
                    name="expiryDate"
                    id="expiryDate"
                    className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                    value={licDetails?.licExpiryDate}
                  />
                </div>
                <div className="space-y-1">
                  <label
                    htmlFor="licenseNumber"
                    className="text-black font-switzer font-semibold"
                  >
                    License Number
                  </label>
                  <input
                    type="number"
                    name="licenseNumber"
                    id="licenseNumber"
                    className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                    value={licDetails?.licNum}
                  />
                </div>
                <div className="space-y-1">
                  <label
                    htmlFor="type"
                    className="text-black font-switzer font-semibold"
                  >
                    Service Type
                  </label>
                  <input
                    type="text"
                    name="type"
                    id="type"
                    className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                    value={licDetails?.serviceType}
                  />
                </div>
                <div>
                  <label
                    htmlFor="frontImage"
                    className="text-black font-switzer font-semibold"
                  >
                    License Front image
                  </label>
                  <img
                    src={`${BASE_URL}${licDetails?.licFrontPhoto}`}
                    alt="Front Photo"
                    className="w-full h-96"
                  />
                </div>
                <div>
                  <label
                    htmlFor="backImage"
                    className="text-black font-switzer font-semibold"
                  >
                    License Back image
                  </label>
                  <img
                    src={`${BASE_URL}${licDetails?.licBackPhoto}`}
                    alt="Front Photo"
                    className="w-full h-96"
                  />
                </div>
              </div>
            ) : tab === "Reviews" ? (
              <div className="w-full font-norms">
                <div className="w-[80%] mx-auto pt-5 flex gap-x-5 justify-center [&>div]:text-center [&>div]:space-y-3 [&>div>p]:text-5xl [&>div]:font-semibold [&>div>h6]:text-xl">
                  <div>
                    <p>😫</p>
                    <h6>{data?.data?.countRating[2]}</h6>
                  </div>
                  <div>
                    <p>☹️</p>
                    <h6>{data?.data?.countRating[4]}</h6>
                  </div>
                  <div>
                    <p>😑</p>
                    <h6>{data?.data?.countRating[6]}</h6>
                  </div>
                  <div>
                    <p>😊</p>
                    <h6>{data?.data?.countRating[8]}</h6>
                  </div>
                  <div>
                    <p>😍</p>
                    <h6>{data?.data?.countRating[10]}</h6>
                  </div>
                </div>
                <h2 className="text-black font-switzer font-semibold">
                  Reviews &nbsp;{" "}
                  <span className="text-gray-500 text-sm">
                    {data?.data?.feedbacks?.length} ({data?.data?.avgRate}/10)
                  </span>
                </h2>
                <div className="w-full grid grid-cols-2 gap-4 pt-5 [&>div]:rounded-md [&>div]:bg-gray-100 [&>div]:p-3 [&>div]:cursor-pointer">
                  {data?.data?.feedbacks?.map((el, itm) => {
                    return (
                      <div>
                        <div className="flex gap-x-2 items-center font-semibold [&>p]:bg-white [&>p]:p-1 [&>p]:rounded-md">
                          <p>#{el?.order?.orderNum}</p>
                          <h6>{el?.userID?.userName}</h6>
                        </div>
                        <h5 className="bg-white rounded-md inline-flex my-4 px-2">
                          {el?.comment ? el?.comment : "no comments"}
                        </h5>
                        <div className="flex items-center justify-between pt-4 [&>p]:text-2xl">
                          <p>
                            {el?.value == 2
                              ? "😫"
                              : el?.value == 4
                              ? "☹️"
                              : el?.value == 6
                              ? "😑"
                              : el?.value == 8
                              ? "😊"
                              : el?.value == 10
                              ? "😍"
                              : "void"}
                          </p>

                          <div className="flex gap-x-2 [&>h6]:text-gray-500">
                            <p>{dayjs(el?.createdAt).format("YYYY-MM-DD")}</p>
                            <h6>{dayjs(el?.createdAt).format("h:mm A")}</h6>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <></>
            )}
            {tab === "Wallet Transaction" ? (
              <Modal isOpen={isOpen} onClose={onClose} size={"3xl"} isCentered>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader padding={0}>
                    <h4 className="font-normal pl-4 py-2 border-gray-400 border-b-2">
                      Filter
                    </h4>
                  </ModalHeader>
                  <ModalCloseButton />
                  <ModalBody padding={4}>
                    <div className="grid grid-cols-2 gap-x-5 py-8 [&>div>input]:w-full">
                      <div>
                        <p>Start Date</p>
                        <input
                          className="bg-gray-200 py-2 rounded-md px-2"
                          onChange={(e) =>
                            setCustomfilter({
                              ...customfilter,
                              startDate: e.target.value,
                            })
                          }
                          type="Date"
                        />
                      </div>
                      <div>
                        <p>End Date</p>
                        <input
                          className="bg-gray-200 py-2 rounded-md px-2"
                          onChange={(e) =>
                            setCustomfilter({
                              ...customfilter,
                              endDate: e.target.value,
                            })
                          }
                          type="Date"
                        />
                      </div>
                    </div>
                  </ModalBody>
                  <ModalFooter>
                    <div className="flex">
                      <BlackButton text="Clear filter" onClick={onClose} />
                      <RedButton
                        text="Apply filter"
                        onClick={() => {
                          setFilter(
                            `custom&startDate=${customfilter?.startDate}&endDate=${customfilter?.endDate}`
                          );
                          onClose();
                        }}
                      />
                    </div>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            ) : (
              <Modal isOpen={isOpen} onClose={onClose} size={"5xl"} isCentered>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader padding={0}></ModalHeader>
                  <ModalCloseButton />
                  <ModalBody padding={4}>
                    <div className="grid grid-cols-2 gap-x-5 h-[60vh] py-10 overflow-auto">
                      {data?.data?.vehicleDetails?.map((elem) =>
                        elem?.vehicleImages?.map((pic) => (
                          <div className="text-black mx-4">
                            <img
                              src={`${BASE_URL}${pic?.image}`}
                              alt="Vehicle image"
                            />
                          </div>
                        ))
                      )}
                    </div>
                  </ModalBody>
                </ModalContent>
              </Modal>
            )}
          </div>
        </div>
      }
    />
  );
}
