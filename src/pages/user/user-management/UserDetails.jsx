import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaWallet } from "react-icons/fa";
import Layout from "../../../components/Layout";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Helment from "../../../components/Helment";
import MyDataTable from "../../../components/MyDataTable";
import RedButton, {
  BlackButton,
  EditButton,
  TabButton,
} from "../../../utilities/Buttons";
import { useNavigate, useParams } from "react-router-dom";
import GetAPI from "../../../utilities/GetAPI";
import Loader, { MiniLoader } from "../../../components/Loader";
import dayjs from "dayjs";
import { PutAPI } from "../../../utilities/PutAPI";
import { error_toaster, success_toaster } from "../../../utilities/Toaster";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { BASE_URL } from "../../../utilities/URL";

export default function UserDetails() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, reFetch } = GetAPI(`admin/userdetails/${id}`);
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
    image: null,
  });

  const viewDetails = (orderId) => {
    navigate(`/restaurant/order-details/${orderId}`);
  };

  const handleOnEventChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const outp = String(details?.email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );

  const updateUserDetails = async () => {
    if (outp == null) {
      toast.error(t("Email Format Incorrect"));
    } else {
      setLoader(true);
      const res = await PutAPI(`admin/updateuserdetails/${id}`, {
        firstName: details?.firstName,
        lastName: details?.lastName,
        email: details?.email,
        countryCode: details?.countryCode,
        phoneNum: details?.phoneNum,
        password: details?.password,
      });
      if (res?.data?.status === "1") {
        reFetch();
        setLoader(false);
        success_toaster(res?.data?.message);
      } else {
        setLoader(false);
        error_toaster(res?.data?.message);
      }
    }
  };

  const handlePhoneChange = (value, data) => {
    setDetails({
      ...details,
      countryCode: data.dialCode,
      phoneNum: value.slice(data.dialCode.length),
    });
  };

  useEffect(() => {
    const fetchData = () => {
      if (data && data?.data && data?.data?.userDetails) {
        setDetails({
          firstName: data?.data?.userDetails?.firstName || "",
          lastName: data?.data?.userDetails?.lastName || "",
          email: data?.data?.userDetails?.email || "",
          countryCode: data?.data?.userDetails?.countryCode || "",
          phoneNum: data?.data?.userDetails?.phoneNum || "",
          password: data?.data?.userDetails?.password || "",
          image: data?.data?.userDetails?.image || "",
        });
      }
    };
    fetchData();
  }, [data, id]);

  const transactionData = () => {
    const filteredData = data?.data?.transactions?.filter((dat) => {
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

  const creditUsers = () => {
    const filteredData = data?.data?.creditUsers?.filter((dat) => {
      console.log("🚀 ~ filteredData ~ dat:", dat);
      return (
        search === "" ||
        (dat?.id && dat?.id.toString().includes(search.toLowerCase())) ||
        (dat?.email && dat?.email.toString().includes(search.toLowerCase())) ||
        (dat?.phoneNum &&
          dat?.phoneNum.toLowerCase().includes(search.toLowerCase()))
      );
    });
    return filteredData;
  };

  const orderData = () => {
    const filteredData = data?.data?.orderData?.filter((dat) => {
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

  let columns = [];
  let column1 = [];
  if (tab === "Orders") {
    columns = [
      { field: "sn", header: t("Serial. No") },
      { field: "id", header: t("Id") },
      { field: "restaurant", header: t("Restaurant") },
      { field: "orderNumber", header: t("Order Num") },
      { field: "date", header: t("Schedule Date") },
      { field: "total", header: t("Total") },
      { field: "status", header: t("Order status") },
      { field: "action", header: t("Action") },
    ];
  } else if (tab === "Wallet Transaction") {
    columns = [
      { field: "sn", header: t("Serial. No") },
      { field: "id", header: t("Id") },
      { field: "orderId", header: t("Order Id") },
      { field: "paymentType", header: t("Payment Type") },
      { field: "amount", header: t("Amount") },
      { field: "date", header: t("Date") },
      { field: "action", header: t("Action") },
    ];
    column1 = [
      { field: "sn", header: t("Serial. No") },
      { field: "id", header: t("Id") },
      { field: "name", header: t("Name") },
      { field: "email", header: t("Email") },
      { field: "phoneNum", header: t("Phone") },
      { field: "action", header: t("Action") },
    ];
  }

  const datas = [];
  const datas1 = [];

  if (tab === "Wallet Transaction") {
    transactionData()?.map((values, index) => {
      return datas.push({
        sn: index + 1,
        id: values?.id,
        orderId: values?.orderId,
        paymentType: values?.paymentType,
        amount:
          values?.order?.restaurant?.zoneRestaurant?.zone?.zoneDetail
            ?.currencyUnit?.symbol +
          " " +
          values?.amount,
        date: dayjs(values?.at).format("DD-MM-YYYY h:mm:ss A"),
        action: (
          <div className="flex items-center gap-3">
            <EditButton
              text={t("viewDetails")}
              onClick={() => {
                viewDetails(values?.order?.id);
              }}
            />
          </div>
        ),
      });
    });

    creditUsers()?.map((val, idx) => {
      return datas1.push({
        sn: idx + 1,
        id: val?.id,
        name: `${val?.firstName || ""} ${val?.lastName || ""}`.trim(),
        email: val?.email || "",
        phoneNum: `${val?.countryCode} ${val?.phoneNum}`,
        action: (
          <div className="flex items-center gap-3">
            <EditButton
              text={t("viewDetails")}
              onClick={() => {
                navigate(
                  val?.userType?.name === "Driver"
                    ? `/driver-details${val?.id}`
                    : `/user-details/${val?.id}`,
                  {
                    state: {
                      id: val?.id,
                    },
                  }
                );
              }}
            />
          </div>
        ),
      });
    });
  } else {
    orderData()?.map((values, index) => {
      return datas.push({
        sn: index + 1,
        id: values?.id,
        restaurant: values?.restaurant?.businessName,
        orderNumber: values?.orderNum,
        date: dayjs(values?.scheduleDate).format("DD-MM-YYYY h:mm:ss A"),
        total: `${values?.restaurant.zoneRestaurant.zone.zoneDetail.currencyUnit.symbol} ${values?.total}`,
        status: values?.orderStatus?.name,
        action: (
          <div className="flex items-center gap-3">
            <EditButton
              text={t("viewDetails")}
              onClick={() => {
                viewDetails(values?.id);
              }}
            />
          </div>
        ),
      });
    });
  }

  return data?.length === 0 ? (
    <Loader />
  ) : (
    <Layout
      content={
        <div className="bg-themeGray p-5">
          <div className="bg-white rounded-lg p-5 h-screen">
            <div className="flex gap-5 items-center">
              <button
                className="bg-themeGray p-2 rounded-full"
                onClick={() => window.history.back()}
              >
                <FaArrowLeft />
              </button>
              <h2 className="text-themeRed text-lg font-bold font-norms">
                {tab === "User Detail" ? (
                  t("User Detail")
                ) : tab === "User Role" ? (
                  t("Role Management")
                ) : tab === "Wallet Transaction" ? (
                  t("Wallet Transactions")
                ) : tab === "Orders" ? (
                  t("Orders")
                ) : tab === "Vehicle details" ? (
                  t("Vehicle Details")
                ) : tab === "License details" ? (
                  t("License Details")
                ) : tab === "Reviews" ? (
                  t("Reviews")
                ) : (
                  <></>
                )}
              </h2>
            </div>

            <div className="py-5 space-y-1.5">
              <ul className="flex flex-wrap items-center gap-8">
                <TabButton
                  title={t("User Detail")}
                  tab={tab}
                  onClick={() => setTab("User Detail")}
                />
                {/* <TabButton
                  title={t("User Role")}
                  tab={tab}
                  onClick={() => setTab("User Role")}
                /> */}
                <TabButton
                  title={t("Wallet Transaction")}
                  tab={tab}
                  onClick={() => setTab("Wallet Transaction")}
                />
                <TabButton
                  title={t("Orders")}
                  tab={tab}
                  onClick={() => setTab("Orders")}
                />
              </ul>
              <div className={`w-full bg-[#00000033] h-[1px]`}></div>
            </div>

            {tab === "User Detail" ? (
              loader ? (
                <MiniLoader />
              ) : (
                <div className="space-y-3">
                  {details?.image ? (
                    <div>
                      <img
                        src={
                          details?.image
                            ? BASE_URL + details.image
                            : "/images/profile.webp"
                        }
                        alt="profile"
                        className="w-32 h-32 object-cover rounded-full"
                      />
                    </div>
                  ) : (
                    <div className="w-32 h-32 bg-gray-300 rounded-full flex justify-center items-center text-bold text-3xl font-switzer">
                      <p>
                        {details.firstName.charAt(0).toUpperCase()}
                        {details?.lastName.charAt(0).toUpperCase()}
                      </p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-1">
                      <label
                        htmlFor="firstName"
                        className="text-black font-switzer font-semibold"
                      >
                        {t("First Name")}
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
                        {t("Last Name")}
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
                        {t("Email")}
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
                        {t("Phone No")}
                      </label>
                      <div>
                        <div className="col-span-1">
                          <PhoneInput
                            value={details?.countryCode + details?.phoneNum}
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
                        htmlFor="password"
                        className="text-black font-switzer font-semibold"
                      >
                        {t("Password")}
                      </label>
                      <input
                        onChange={handleOnEventChange}
                        type="password"
                        name="password"
                        id="password"
                        className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-x-4">
                      <div>
                        <label
                          htmlFor="password"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Signed by")}
                        </label>
                        <input
                          onChange={handleOnEventChange}
                          type="text"
                          name="Signed"
                          id="Signed"
                          className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                          value={data?.data?.userDetails?.signedFrom}
                          readOnly
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="password"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("User Role")}
                        </label>
                        <input
                          onChange={handleOnEventChange}
                          type="text"
                          name="userRole"
                          id="userRole"
                          className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                          value={data?.data?.userDetails?.userType}
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 col-span-2 justify-end">
                      <BlackButton
                        text={t("Update User")}
                        onClick={updateUserDetails}
                      />
                    </div>
                  </div>
                </div>
              )
            ) : // : tab === "User Role" ? (
            //   <div className="flex gap-10 items-center">
            //     <h2 className="text-black font-switzer font-semibold">
            //       {t("Current Role")} :
            //     </h2>

            //     <div>
            //       <RedButton text={data?.data?.userDetails?.userType} />
            //     </div>
            //   </div>
            // )

            tab === "Wallet Transaction" ? (
              <div className="space-y-5">
                <div className="flex gap-5">
                  <div className="bg-themeGray w-72 h-40 p-3 rounded-lg flex flex-col gap-8">
                    <div className="flex justify-between items-center">
                      <h2 className="text-themeBorderGray font-switzer">
                        {t(
                          `${
                            data?.data?.userDetails?.userType === "Customer"
                              ? "Credits"
                              : "Available Balance"
                          }`
                        )}
                      </h2>

                      <div className="w-12 h-12 rounded-full bg-white p-2 flex items-center justify-center">
                        <FaWallet size={20} color="#E13743" />
                      </div>
                    </div>

                    <div className="text-4xl font-norms font-medium">
                      {data?.data?.userDetails?.userType === "Customer"
                        ? data?.data?.userDetails?.credit?.point ?? 0
                        : (data?.data?.userDetails?.units?.currencyUnit
                            ?.symbol || "") +
                          " " +
                          data?.data?.balance}
                    </div>
                  </div>
                </div>
                <div className="w-full bg-[#00000033] h-[1.5px]"></div>
                <div className="space-y-5">
                  <Helment
                    search={true}
                    searchOnChange={(e) => setSearch(e.target.value)}
                    searchValue={search}
                    csvdata={datas}
                  />
                  <h4 className="text-3xl font-norms font-medium">
                    Referrals{" "}
                  </h4>
                  <MyDataTable columns={column1} data={datas1} />
                  <h4 className="text-3xl font-norms font-medium">
                    Transactions{" "}
                  </h4>
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
            ) : (
              <></>
            )}
          </div>
        </div>
      }
    />
  );
}
