import React, { useContext } from "react";
import { PiUserBold } from "react-icons/pi";
import { FaRegBell } from "react-icons/fa";
import { Link } from "react-router-dom";
import { ToggleContext } from "../utilities/ContextApi";
import { useTranslation } from "react-i18next";
import { FaGlobe } from "react-icons/fa";
import { VscMenu } from "react-icons/vsc";

export default function Header() {
  const { isToggled, show, setShow } = useContext(ToggleContext);
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header
      className={`${
        isToggled ? "w-[calc(100%)] ml-0" : "w-[calc(100%-280px)] ml-[280px]"
      }  bg-theme border-b border-themeLightGray fixed z-40 duration-500 ease-[cubic-bezier(0.68,-0.6,0.32,1.6)] ${
        show ? "max-lg:ml-[280px]" : "max-lg:ml-0 max-lg:w-full"
      } max-lg:flex max-lg:justify-between max-lg:items-center`}
    >
      <div
        className="lg:hidden ml-5 cursor-pointer"
        onClick={() => setShow(!show)}
      >
        <VscMenu size="30" color="white" />
      </div>
      <div className="flex justify-end items-center py-[9px] px-10 gap-x-5">
        <div className="text-white">
          <details className="relative list-none">
            <summary className="flex cursor-pointer">
              <FaGlobe size={25} />
            </summary>
            <div className="absolute top-8 left-0 bg-white text-red-500 px-5 py-5 space-y-2 rounded-md w-[150px]">
              <div
                className="flex gap-1 cursor-pointer items-center font-semibold"
                onClick={() => handleLanguageChange("gr")}
              >
                <img
                  className="w-5 h-5 rounded-full object-cover"
                  src="/images/gr.jpg"
                  alt=""
                />
                <p>German</p>
              </div>
              <div
                className="flex gap-1 cursor-pointer items-center font-semibold"
                onClick={() => handleLanguageChange("en")}
              >
                <img
                  className="w-5 h-5 rounded-full object-cover"
                  src="/images/en.jpg"
                  alt=""
                />
                <p>English</p>
              </div>
              <div
                className="flex gap-1 cursor-pointer items-center font-semibold"
                onClick={() => handleLanguageChange("sw")}
              >
                <img
                  className="w-5 h-5 rounded-full object-cover"
                  src="/images/sw.png"
                  alt=""
                />
                <p>Swiss</p>
              </div>
            </div>
          </details>
        </div>
        <div>
          <FaRegBell size={26} color="white" />
        </div>
        <div className="w-12 h-12 bg-[#222222] rounded-full flex items-center justify-center">
          <PiUserBold size={28} color="white" />
        </div>
        <div>
          <p className="text-white text-sm font-normal font-workSans">
            {t("Admin")}
          </p>
        </div>
      </div>
    </header>
  );
}
