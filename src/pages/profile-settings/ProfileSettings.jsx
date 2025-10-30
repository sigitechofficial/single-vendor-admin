import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { BlackButton } from "../../utilities/Buttons";
import Loader, { MiniLoader } from "../../components/Loader";
import axios from "axios";
import { BASE_URL } from "../../utilities/URL";
import { PostAPI } from "../../utilities/PostAPI";
import {
  error_toaster,
  info_toaster,
  success_toaster,
} from "../../utilities/Toaster";
import { useTranslation } from "react-i18next";

export default function ProfileSettings() {
  const { t } = useTranslation();
  const [loader, setLoader] = useState(false);
  const [miniLoader, setMiniLoader] = useState(false);
  const [userData, setUserData] = useState({
    userId: "",
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "",
    phoneNum: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const config = {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      };
      setLoader(true);
      try {
        const response = await axios.get(
          `${BASE_URL}admin/get_profile`,
          config
        );

        if (response) {
          setLoader(false);
          setUserData({
            userId: response?.data?.data?.userData?.id || "",
            firstName: response?.data?.data?.userData?.firstName || "",
            lastName: response?.data?.data?.userData?.lastName || "",
            email: response?.data?.data?.userData?.email || "",
            countryCode: response?.data?.data?.userData?.countryCode || "",
            phoneNum: response?.data?.data?.userData?.phoneNum || "",
          });
        }
      } catch (error) {
        setLoader(false);
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  const reFetch = async () => {
    var config = {
      headers: {
        accessToken: localStorage.getItem("accessToken"),
      },
    };
    try {
      await axios.get(`${BASE_URL}admin/get_profile`, config).then((dat) => {
        setUserData({
          userId: dat?.data?.data?.userData?.id || "",
          firstName: dat?.data?.data?.userData?.firstName || "",
          lastName: dat?.data?.data?.userData?.lastName || "",
          email: dat?.data?.data?.userData?.email || "",
          countryCode: dat?.data?.data?.userData?.countryCode || "",
          phoneNum: dat?.data?.data?.userData?.phoneNum || "",
        });
      });
    } catch (err) {
      info_toaster(err);
    }
  };

  const handleOnChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const update = async () => {
    setMiniLoader(true);
    const res = await PostAPI("admin/update_profile", {
      userId: userData?.userId,
      firstName: userData?.firstName,
      password: userData?.password,
      lastName: userData?.lastName,
      countryCode: userData?.countryCode,
      phoneNum: userData?.phoneNum,
      email: userData?.email,
    });
    if (res?.data?.status === "1") {
      success_toaster(res?.data?.message);
      setMiniLoader(false);
      reFetch();
    } else {
      error_toaster(res?.data?.message);
      setMiniLoader(false);
    }
  };

  return loader ? (
    <Loader />
  ) : (
    <Layout
      content={
        <div className="bg-themeGray p-5">
          <div className="bg-white rounded-lg p-5 h-screen space-y-3">
            <h2 className="text-themeRed text-lg font-bold font-norms">
              {t("Profile Settings")}
            </h2>

            {miniLoader ? (
              <MiniLoader />
            ) : (
              <div className="md:grid grid-cols-2 gap-5">
                <div className="space-y-1">
                  <label
                    htmlFor="firstName"
                    className="text-black font-switzer font-semibold"
                  >
                    {t("First Name")}
                  </label>
                  <input
                    value={userData?.firstName}
                    type="text"
                    name="firstName"
                    id="firstName"
                    className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                    onChange={handleOnChange}
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
                    value={userData?.lastName}
                    type="text"
                    name="lastName"
                    id="lastName"
                    className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                    onChange={handleOnChange}
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
                    value={userData?.email}
                    type="email"
                    name="email"
                    id="email"
                    className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                    onChange={handleOnChange}
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="phone"
                    className="text-black font-switzer font-semibold"
                  >
                    {t("Phone No")}
                  </label>
                  <div className="grid grid-cols-5 gap-1">
                    <div className="col-span-1">
                      <PhoneInput
                        value={userData?.countryCode}
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
                        onChange={(code) =>
                          setUserData({ ...userData, countryCode: code })
                        }
                      />
                    </div>
                    <div className="col-span-4">
                      <input
                        value={userData?.phoneNum}
                        type="number"
                        name="phoneNum"
                        className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                        onChange={handleOnChange}
                      />
                    </div>
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
                    type="password"
                    name="password"
                    id="password"
                    className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 col-span-2 justify-end">
                  {/* <RedButton text="Block Driver" /> */}
                  <BlackButton text={t("Update")} onClick={update} />
                </div>
              </div>
            )}
          </div>
        </div>
      }
    />
  );
}
