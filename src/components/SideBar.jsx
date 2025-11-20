import React, { useContext, useEffect, useState } from "react";
import {
  MdAddBox,
  MdCancel,
  MdDashboard,
  MdRestaurant,
  MdTableRestaurant,
  MdOutlineTableRestaurant,
  MdReport,
  MdLocalOffer,
} from "react-icons/md";
import { PiPackage, PiTicketFill } from "react-icons/pi";
import { FaPowerOff, FaRegBell, FaUserGear, FaBell } from "react-icons/fa6";
import { IoMenu, IoSettings, IoStorefront, IoFastFood } from "react-icons/io5";
import { IoIosAddCircle, IoIosCheckbox, IoIosPricetags } from "react-icons/io";
import { TbWorld } from "react-icons/tb";
import { GrSend } from "react-icons/gr";
import { GiCardboardBoxClosed, GiPostStamp } from "react-icons/gi";
import { useSocket } from "../utilities/SocketContext";
import { IoMdCloseCircle } from "react-icons/io";
import FloatingLabelInput from "../components/FloatingLabelInput";
import {
  FaAngleDown,
  FaUserEdit,
  FaAngleUp,
  FaUser,
  FaUsersCog,
  FaUserNurse,
  FaUsers,
  FaUserFriends,
  FaCity,
  FaCogs,
  FaMapMarkedAlt,
} from "react-icons/fa";
import {
  RiBus2Fill,
  RiCouponFill,
  RiMoneyDollarBoxFill,
  RiUserSettingsFill,
  RiAddFill,
} from "react-icons/ri";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ListHead from "./ListHead";
import ListItems from "./ListItems";
import { info_toaster } from "../utilities/Toaster";
import { BsCashCoin, BsFillCartCheckFill, BsBoxSeamFill } from "react-icons/bs";
import { SiVectorlogozone } from "react-icons/si";
import { ToggleContext } from "../utilities/ContextApi";
import { useTranslation } from "react-i18next";
import { PiHandDepositFill } from "react-icons/pi";
import { MdOutlinePercent } from "react-icons/md";

export default function SideBar() {
  const { isToggled, setIsToggled, show } = useContext(ToggleContext);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchTab, setSearchTab] = useState("");
  const navigate = useNavigate();
  const location = useLocation().pathname;
  const { disconnectSocket } = useSocket();
  const { t } = useTranslation();
  const permissions = JSON.parse(localStorage.getItem("permissions")) || [];
  const email = localStorage.getItem("userEmail");

  const hasPermission = (tabTitle) => {
    if (email === "admin@gmail.com") {
      return true;
    } else {
      return permissions?.some(
        (permission) =>
          permission.title.toLowerCase() === tabTitle.toLowerCase()
      );
    }
  };

  useEffect(() => {
    if (
      location.includes("/user-management") ||
      location.includes("/user-details") ||
      location.includes("/driver-details") ||
      location.includes("/customers") ||
      location.includes("/branch-owners") ||
      location.includes("/drivers") ||
      location === "/admin" ||
      location.includes("/employees") ||
      location.includes("/roles") ||
      location.includes("/permissions") ||
      location.includes("/roles-and-permissions")
    ) {
      setActiveDropdown("user");
    } else if (
      location.includes("/restaurant/add-on-collections") ||
      location.includes("/restaurant/menu-categories") ||
      location.includes("/restaurant/add-on") ||
      location.includes("/restaurant/products") ||
      location.includes("/restaurant/cuisines") ||
      location.includes("/store/add-on-collections") ||
      location.includes("/store/menu-categories") ||
      location.includes("/store/add-on") ||
      location.includes("/store/products") ||
      location.includes("/store/cuisines")
    ) {
      setActiveDropdown("Food Management");
    } else if (
      location.includes("/notifications") ||
      location.includes("/vouchers") ||
      location.includes("/default-values") ||
      location.includes("/charges") ||
      location.includes("/notifications")
    ) {
      setActiveDropdown("Promotions");
    } else if (
      location.includes("/restaurant/all-orders") ||
      location.includes("/restaurant/delivered-orders") ||
      location.includes("/restaurant/cancelled-orders") ||
      location.includes("/restaurant/schedule-orders") ||
      location.includes("/order-details") ||
      location.includes("/rejected")
    ) {
      setActiveDropdown("Branches Orders");
    } else if (
      location.includes("/overall-earnings") ||
      location.includes("/admin-earnings") ||
      location.includes("/driver-earnings") ||
      location.includes("/restaurant-earnings") ||
      location.includes("/store-earnings")
    ) {
      setActiveDropdown("Earnings");
    } else if (
      location.includes("/deliveryman-list") ||
      location.includes("/new-deliveryman") ||
      location.includes("/rejected-deliveryman")
    ) {
      setActiveDropdown("Driver Management");
    } else if (
      location.includes("/reports-restaurant") ||
      location.includes("/reports-store")
    ) {
      setActiveDropdown("Reports & Analytics");
    } else if (location.includes("/stamp-cards")) {
      setActiveDropdown("Stamp Cards");
    } else if (
      location === "/manage-collection" ||
      location === "/manage-addOn" ||
      location === "/manage-categories" ||
      location === "/manage-products"
    ) {
      setActiveDropdown("Food Management");
    } else if (
      location === "/payout-failure-manage" ||
      location === "/payout-reports" ||
      location === "/payout-request" ||
      location === "/payout-table" ||
      location === "/manual-request" ||
      location === "/auto-request" ||
      location === "/restaurant-payouts" ||
      location === "/driver-payouts"
    ) {
      setActiveDropdown("Payout Request");
    }
  }, [location]);

  const handleActive = (dropdownId) => {
    if (activeDropdown === dropdownId) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(dropdownId);
    }
  };

  const isDropdownActive = (dropdownId) => {
    return activeDropdown === dropdownId;
  };

  const logout = () => {
    localStorage.clear();
    disconnectSocket();
    navigate("/login");
    info_toaster("Successfully Logged out!");
  };

  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [show]);

  return (
    <nav
      className={`${
        isToggled ? "hidden" : "w-[280px]"
      }  float-left fixed h-full flex bg-theme flex-col
      border-r-[1.5px] border-r-themeBorder duration-500 ease-[cubic-bezier(0.68,-0.6,0.32,1.6)] ${
        show ? "fixed left-0 z-10" : "max-lg:w-0"
      }`}
    >
      <div
        className={` flex justify-center col-span-2 border-b-[1.5px] border-b-themeBorder py-2.5 px-10`}
      >
        <Link to="/" data-testid="sidebar-logo-link">
          <img
            src="/images/logo.webp"
            alt="logo"
            className="w-24 object-contain"
            data-testid="sidebar-logo-img"
          />
        </Link>
      </div>
      <ul className="flex flex-col gap-y-1 overflow-auto pb-3 hide-scroll pt-20">
        <li className="w-[280px] h-20 px-3 pb-2 fixed top-[65px] pt-4 left-0 bg-theme z-10">
          <FloatingLabelInput
            id="sidebar-search"
            name="sidebar-search"
            onChange={(e) => setSearchTab(e.target.value)}
            placeholder="search..."
          />
        </li>
        <ListHead
          hasPermission={hasPermission}
          searchTab={searchTab}
          title={t("Dashboard")}
          to="/"
          Icon={MdDashboard}
          active={
            location === "/store-reports" ||
            location === "/restaurant-reports" ||
            location === "/customer-analytics" ||
            location === "/order-metrics" ||
            location === "/sale-reports"
          }
        />
        <ListHead
          hasPermission={hasPermission}
          searchTab={searchTab}
          title={t("User")}
          Icon={FaUser}
          active={
            location === "/user-management" ||
            location === "/user-details" ||
            location === "/driver-details" ||
            location === "/customers" ||
            location === "/restaurant-owners" ||
            location === "/store-owners" ||
            location === "/drivers" ||
            location === "/admin" ||
            location === "/employees" ||
            location === "/permissions" ||
            location === "/roles-and-permissions"
          }
          Angle={isDropdownActive("user") ? FaAngleUp : FaAngleDown}
          onClick={() => handleActive("user")}
          nestedItems={[
            "User Management",
            "Customer",
            "Branches Owner",
            "Drivers",
            "Admin",
            "Staff",
          ]}
        />
        {isDropdownActive("user") && (
          <>
            <div className="px-3 relative space-y-1">
              <ListItems
                title={t("User Management")}
                to="/user-management"
                // active={location === "/user-details"}
                Icon={FaUserGear}
              />
              <ListItems
                title={t("Customer")}
                to="/customers"
                // active={location === "/user-details"}
                Icon={FaUserFriends}
              />
              <ListItems
                title={t("Branches Owner")}
                to="/branch-owners"
                // active={location === "/user-details"}
                Icon={FaUsersCog}
              />
              <ListItems
                title={t("Drivers")}
                to="/drivers"
                Icon={FaUserNurse}
                // active={location === "/user-details"}
              />
              <ListItems
                title={t("Admin")}
                to="/admin"
                Icon={FaUserNurse}
                // active={location === "/user-details"}
              />
              <ListItems
                title={t("Staff")}
                to="/employees"
                // active={location === "/user-details"}
                Icon={FaUsers}
              />
              {/* <ListItems title={t("Roles")} to="/roles" Icon={RiCouponFill} />
              <ListItems
                title={t("Permissions")}
                to="/permissions"
                Icon={FaUserEdit}
              /> */}
              <ListItems
                title={t("Role & Permisssions")}
                to="/roles-and-permissions"
                Icon={FaUserEdit}
              />
              <hr className="w-full opacity-25" />
            </div>
          </>
        )}

        <ListHead
          hasPermission={hasPermission}
          searchTab={searchTab}
          title={t("Driver Management")}
          Icon={FaUser}
          active={
            location === "/deliveryman-list" ||
            location === "/new-deliveryman" ||
            location === "/rejected-deliveryman"
          }
          Angle={
            isDropdownActive("Driver Management") ? FaAngleUp : FaAngleDown
          }
          onClick={() => handleActive("Driver Management")}
          nestedItems={[
            "Delivery Man List",
            "New Delivery Man",
            "Rejected Delivery Man",
          ]}
        />
        {isDropdownActive("Driver Management") && (
          <>
            <div className="px-3 relative space-y-1">
              <ListItems
                title={t("Delivery Man List")}
                to="/deliveryman-list"
                // active={location === "/user-details"}
                Icon={FaUserGear}
              />
              <ListItems
                title={t("New Delivery Man")}
                to="/new-deliveryman"
                // active={location === "/user-details"}
                Icon={FaUserFriends}
              />
              <ListItems
                title={t("Rejected Delivery Man")}
                to="/rejected-deliveryman"
                // active={location === "/user-details"}
                Icon={FaUsersCog}
              />

              <hr className="w-full opacity-25" />
            </div>
          </>
        )}
        {/* ===========Reports And Analytics=============== */}
        <ListHead
          hasPermission={hasPermission}
          searchTab={searchTab}
          title={t("Reports & Analytics")}
          Icon={FaUser}
          active={location === "/reports-restaurant"}
          Angle={
            isDropdownActive("Reports & Analytics") ? FaAngleUp : FaAngleDown
          }
          onClick={() => handleActive("Reports & Analytics")}
          nestedItems={["Branches Report"]}
        />
        {isDropdownActive("Reports & Analytics") && (
          <>
            <div className="px-3 relative space-y-1">
              <ListItems
                title={t("Branches Report")}
                to="/reports-restaurant"
                active={location === "/reports-restaurant"}
                Icon={FaUserGear}
              />
              {/* <ListItems
                title={t("Rejected Delivery Man")}
                to="/rejected-deliveryman"
                active={location === "/user-details"}
                Icon={FaUsersCog}
              /> */}

              <hr className="w-full opacity-25" />
            </div>
          </>
        )}

        <ListHead
          hasPermission={hasPermission}
          searchTab={searchTab}
          title={t("Branches Orders")}
          Icon={BsBoxSeamFill}
          active={
            location === "/restaurant/all-orders" ||
            location === "/restaurant/delivered-orders" ||
            location === "/restaurant/cancelled-orders" ||
            location === "/restaurant/schedule-orders" ||
            location === "/order-details" ||
            location === "/rejected"
          }
          Angle={isDropdownActive("Branches Orders") ? FaAngleUp : FaAngleDown}
          onClick={() => handleActive("Branches Orders")}
          nestedItems={[
            "All Orders",
            "Delivered",
            "Cancelled",
            "Schedule",
            "Rejected",
          ]}
        />
        {isDropdownActive("Branches Orders") && (
          <>
            <div className="mx-3 relative space-y-1">
              <ListItems
                title={t("All Orders")}
                to="/restaurant/all-orders"
                Icon={BsBoxSeamFill}
              />
              <ListItems
                title={t("Delivered")}
                to="/restaurant/delivered-orders"
                Icon={IoIosCheckbox}
              />
              <ListItems
                title={t("Cancelled")}
                to="/restaurant/cancelled-orders"
                Icon={MdCancel}
              />
              <ListItems
                title={t("Schedule")}
                to="/restaurant/schedule-orders"
                Icon={IoIosCheckbox}
              />
              <ListItems
                title={t("Rejected")}
                to="/restaurant/rejected"
                Icon={MdCancel}
              />
              {/* <ListItems
                title={t("Table Bookings")}
                to="/restaurant/table-booking"
                Icon={MdTableRestaurant}
              /> */}
              {/* <ListItems
                title="Rejected by Store"
                to="/completed-rides"
                Icon={MdCancel}
              /> */}
              <hr className="w-full opacity-25" />
            </div>
          </>
        )}

        <ListHead
          hasPermission={hasPermission}
          searchTab={searchTab}
          title={t("Stamp Cards")}
          Icon={GiPostStamp}
          active={location === "/stamp-cards"}
          Angle={isDropdownActive("Stamp Cards") ? FaAngleUp : FaAngleDown}
          onClick={() => handleActive("Stamp Cards")}
          nestedItems={["All Stamp Card"]}
        />
        {isDropdownActive("Stamp Cards") && (
          <>
            <div className="mx-3 relative space-y-1">
              <ListItems
                title={t("All Stamp Card")}
                to="/stamp-cards"
                Icon={IoIosAddCircle}
              />
              <hr className="w-full opacity-25" />
            </div>
          </>
        )}

        <ListHead
          hasPermission={hasPermission}
          searchTab={searchTab}
          to="/collect-cash"
          title={t("Collect Cash")}
          Icon={RiMoneyDollarBoxFill}
          active={location === "/collect-cash"}
          onClick={() => handleActive("Collect Cash")}
        />
        <ListHead
          hasPermission={hasPermission}
          searchTab={searchTab}
          to="/item-report"
          title={t("Item Report")}
          Icon={RiMoneyDollarBoxFill}
          active={location === "/item-report"}
          onClick={() => handleActive("Item Report")}
        />

        <ListHead
          hasPermission={hasPermission}
          searchTab={searchTab}
          title={t("Active Orders")}
          Icon={BsBoxSeamFill}
          to="/active-orders"
          active={location === "/active-orders"}
          onClick={() => handleActive("Active Orders")}
        />

        <ListHead
          hasPermission={hasPermission}
          searchTab={searchTab}
          title={t("Table Bookings")}
          Icon={BsBoxSeamFill}
          to="/table-booking"
          active={
            location === "/table-booking" || location === "/booking-details"
          }
        />
        <ListHead
          hasPermission={hasPermission}
          searchTab={searchTab}
          title={t("Deposits")}
          Icon={PiHandDepositFill}
          to="/deposit"
          active={location === "/deposit" || location === "/deposit-details"}
        />
        <ListHead
          hasPermission={hasPermission}
          searchTab={searchTab}
          title={t("VAT Categories")}
          Icon={MdOutlinePercent}
          to="/vat-categories"
          active={location === "/vat-categories"}
        />

        <ListHead
          hasPermission={hasPermission}
          searchTab={searchTab}
          title={t("Promotions")}
          Icon={GrSend}
          active={
            location === "/notifications" ||
            location === "/vouchers" ||
            location === "/charges"
          }
          Angle={isDropdownActive("Promotions") ? FaAngleUp : FaAngleDown}
          onClick={() => handleActive("Promotions")}
          nestedItems={["Vouchers", "Charges Section", "Push Notification"]}
        />
        {isDropdownActive("Promotions") && (
          <>
            <div className="mx-3 relative space-y-1">
              <ListItems
                title={t("Vouchers")}
                to="/vouchers"
                Icon={PiTicketFill}
              />
              <ListItems
                title={t("Charges Section")}
                to="/charges"
                Icon={RiMoneyDollarBoxFill}
              />
              <ListItems
                title={t("Push Notification")}
                to="/notifications"
                Icon={FaBell}
              />
              <hr className="w-full opacity-25" />
            </div>
          </>
        )}

        <ListHead
          hasPermission={hasPermission}
          searchTab={searchTab}
          title={t("Earnings")}
          Icon={BsCashCoin}
          active={
            location === "/overall-earnings" ||
            location === "/admin-earnings" ||
            location === "/driver-earnings" ||
            location === "/restaurant-earnings" ||
            location === "/store-earnings"
          }
          Angle={isDropdownActive("Earnings") ? FaAngleUp : FaAngleDown}
          onClick={() => handleActive("Earnings")}
          nestedItems={[
            "Overall Earnings",
            "Admin Earnings",
            "Driver Earnings",
            "Restaurant Earnings",
            "Store Earnings",
          ]}
        />
        {isDropdownActive("Earnings") && (
          <>
            <div className="mx-3 relative space-y-1">
              <ListItems
                title={t("Overall Earnings")}
                to="/overall-earnings"
                Icon={RiMoneyDollarBoxFill}
              />
              <ListItems
                title={t("Admin Earnings")}
                to="/admin-earnings"
                Icon={RiMoneyDollarBoxFill}
              />
              <ListItems
                title={t("Driver Earnings")}
                to="/driver-earnings"
                Icon={RiMoneyDollarBoxFill}
              />
              <ListItems
                title={t("Restaurant Earnings")}
                to="/restaurant-earnings"
                Icon={RiMoneyDollarBoxFill}
              />
              <ListItems
                title={t("Store Earnings")}
                to="/store-earnings"
                Icon={RiMoneyDollarBoxFill}
              />
              <hr className="w-full opacity-25" />
            </div>
          </>
        )}
        <ListHead
          hasPermission={hasPermission}
          searchTab={searchTab}
          title={t("Food Management")}
          Icon={IoFastFood}
          active={
            location === "/manage-collection" ||
            location === "/manage-addOn" ||
            location === "/manage-categories" ||
            location === "/manage-products"
          }
          Angle={isDropdownActive("Food Management") ? FaAngleUp : FaAngleDown}
          onClick={() => handleActive("Food Management")}
          nestedItems={[
            "Add On Collection",
            "Add On",
            "Menu Categories",
            "Products",
          ]}
        />
        {isDropdownActive("Food Management") && (
          <>
            <div className="mx-3 relative space-y-1">
              <ListItems
                title={t("Add On Collection")}
                to="/manage-collection"
                Icon={MdAddBox}
              />
              <ListItems
                title={t("Add On")}
                to="/manage-addOn"
                Icon={RiAddFill}
              />
              <ListItems
                title={t("Menu Categories")}
                to="/manage-categories"
                Icon={IoMenu}
              />
              <ListItems
                title={t("Products")}
                to="/manage-products"
                Icon={BsBoxSeamFill}
              />
              <hr className="w-full opacity-25" />
            </div>
          </>
        )}

        <ListHead
          hasPermission={hasPermission}
          searchTab={searchTab}
          title={t("Refund Management")}
          Icon={IoFastFood}
          to="/refund-management"
          // active={
          //   location === "/manage-collection" ||
          //   location === "/manage-addOn" ||
          //   location === "/manage-categories" ||
          //   location === "/manage-products"
          // }
          // Angle={isDropdownActive("Food Management") ? FaAngleUp : FaAngleDown}
          onClick={() => handleActive("Food Management")}
        />

        <ListHead
          hasPermission={hasPermission}
          searchTab={searchTab}
          title={t("Zones")}
          to="/all-zones"
          active={location === "/add-new-zone" || location === "/update-zone"}
          Icon={SiVectorlogozone}
        />

        <ListHead
          hasPermission={hasPermission}
          searchTab={searchTab}
          title={t("Branches")}
          to="/all-restaurants"
          active={
            location === "/edit-restaurant" || location === "/add-restaurant"
          }
          Icon={MdTableRestaurant}
        />

        <ListHead
          hasPermission={hasPermission}
          searchTab={searchTab}
          title={t("Live Map")}
          to="/live-map"
          Icon={FaMapMarkedAlt}
        />
        <ListHead
          hasPermission={hasPermission}
          searchTab={searchTab}
          title={t("Countries")}
          to="/all-countries"
          Icon={TbWorld}
        />
        <ListHead
          hasPermission={hasPermission}
          searchTab={searchTab}
          title={t("Cities")}
          to="/all-cities"
          Icon={FaCity}
        />

        <ListHead
          hasPermission={hasPermission}
          searchTab={searchTab}
          title={t("Vehicle Management")}
          to="/vehicle-management"
          Icon={RiBus2Fill}
        />

        <ListHead
          hasPermission={hasPermission}
          searchTab={searchTab}
          title={t("Header Design")}
          to="/header-design"
          Icon={IoSettings}
        />
        <ListHead
          hasPermission={hasPermission}
          searchTab={searchTab}
          title={t("Current Orders")}
          to="/current-orders"
          Icon={BsFillCartCheckFill}
        />
        <ListHead
          hasPermission={hasPermission}
          searchTab={searchTab}
          title={t("Dispute Orders")}
          to="/dispute-orders"
          Icon={BsFillCartCheckFill}
        />

        <ListHead
          hasPermission={hasPermission}
          searchTab={searchTab}
          title={t("Banners")}
          to="/banners"
          Icon={MdLocalOffer}
        />

        {/* Payout Request */}
        <ListHead
          hasPermission={hasPermission}
          searchTab={searchTab}
          title={t("Payouts")}
          Icon={FaCogs}
          active={
            location === "/payout-failure-manage" ||
            location === "/payout-reports" ||
            location === "/payout-request" ||
            location === "/payout-table" ||
            location === "/manual-request" ||
            location === "/auto-request" ||
            location === "/driver-payouts" ||
            location === "/restaurant-payouts"
          }
          Angle={isDropdownActive("Payout Request") ? FaAngleUp : FaAngleDown}
          onClick={() => handleActive("Payout Request")}
          nestedItems={["Restaurant", "Driver"]}
        />
        {isDropdownActive("Payout Request") && (
          <>
            <div className="mx-3 relative space-y-1">
              {/* <ListItems
                title={t("Payout Request")}
                to="/payout-request"
                Icon={FaCogs}
              />
              <ListItems
                title={t("Payout Failure")}
                to="/payout-failure-manage"
                Icon={IoMdCloseCircle}
              />
              <ListItems
                title={t("Reports & Logs")}
                to="/payout-reports"
                Icon={MdReport}
              /> */}
              <ListItems
                title={t("Restaurant")}
                to="/restaurant-payouts"
                Icon={MdReport}
              />
              <ListItems
                title={t("Driver")}
                to="/driver-payouts"
                Icon={MdReport}
              />
              <hr className="w-full opacity-25" />
            </div>
          </>
        )}

        <ListHead
          hasPermission={hasPermission}
          searchTab={searchTab}
          title={t("Profile Setting")}
          to="/profile-settings"
          Icon={RiUserSettingsFill}
        />

        <li className="px-3">
          <button
            className="w-full flex gap-x-1.5 items-center py-1.5 lg:py-3 px-2 rounded-md text-themeLightGray hover:bg-themeRed hover:text-white duration-200"
            onClick={logout}
            data-testid="sidebar-logout-btn"
          >
            <FaPowerOff size={20} />
            <span data-testid="sidebar-logout-text">{t("Logout")}</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}
