import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next"; // Import useTranslation
import Layout from "../../../components/Layout";
import Helment from "../../../components/Helment";
import MyDataTable from "../../../components/MyDataTable";
import RedButton, { BlackButton, EditButton } from "../../../utilities/Buttons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import GetAPI from "../../../utilities/GetAPI";
import { PostAPI } from "../../../utilities/PostAPI";
import Loader from "../../../components/Loader";
import Switch from "react-switch";
import { PutAPI } from "../../../utilities/PutAPI";
import { error_toaster, success_toaster } from "../../../utilities/Toaster";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

const customStyles = {
  control: (base, state) => ({
    ...base,
    background: "#f4f4f4",
    borderRadius: state.isFocused ? "0 0 0 0" : 7,
    boxShadow: state.isFocused ? null : null,
  }),
  menu: (base) => ({
    ...base,
    borderRadius: 0,
    marginTop: 0,
  }),
  menuList: (base) => ({
    ...base,
    padding: 0,
  }),
  indicatorSeparator: (base) => ({
    ...base,
    display: "none",
  }),
};

export default function Drivers() {
  const { t } = useTranslation(); // Use the t function
  const [modal, setModal] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const filterOptions = GetAPI("admin/filterOptions");

  const [filterData, setFilterData] = useState({
    zone: null,
    driverType: null,
  });

  // Get driver data with filters
  const getDriverData = async () => {
    // setLoading(true);
    try {
      let res = await PostAPI("admin/getZoneDrivers", {
        zoneId: filterData?.zone?.value || null,
        driverType: filterData?.driverType?.value || null,
      });
      if (res?.data?.status === "1") {
        setData(res?.data);
      } else {
        setData({ data: [] });
      }
    } catch (error) {
      console.error("Error fetching driver data:", error);
      setData({ data: [] });
    }
    setLoading(false);
  };

  const driverData = () => {
    const filteredData = data?.data?.filter((dat) => {
      return (
        search === "" ||
        (dat?.id && dat?.id.toString().includes(search.toLowerCase())) ||
        (dat?.name && dat?.name.toLowerCase().includes(search.toLowerCase())) ||
        (dat?.phoneNum &&
          dat?.phoneNum.toLowerCase().includes(search.toLowerCase())) ||
        (dat?.email && dat?.email.toLowerCase().includes(search.toLowerCase()))
      );
    });
    return filteredData;
  };

  const updateStatus = async (userId, userStatus) => {
    if (userStatus === "Active") {
      let res = await PutAPI(`admin/banuser/${userId}`);
      if (res?.data?.status === "1") {
        success_toaster(res?.data?.message);
        getDriverData();
      } else {
        error_toaster(res?.data?.message);
      }
    } else {
      let res = await PutAPI(`admin/approveuser/${userId}`);
      if (res?.data?.status === "1") {
        success_toaster(res?.data?.message);
        getDriverData();
      } else {
        error_toaster(res?.data?.message);
      }
    }
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

  // Zone options
  let zoneOptions = [
    {
      value: null,
      label: "All zones",
    },
  ];
  filterOptions?.data?.data?.zones?.map((zone) => {
    zoneOptions.push({
      value: zone.id,
      label: zone.name,
    });
  });

  // Driver type options
  const driverTypeOptions = [
    { value: null, label: "All Driver Types" },
    { value: "Restaurant ", label: "Restaurant Driver" },
    { value: "Freelancer", label: "Freelance Driver" },
  ];

  useEffect(() => {
    getDriverData();
  }, [filterData?.zone?.value, filterData?.driverType?.value]);

  const columns = [
    { field: "sn", header: t("serialNo") },
    { field: "id", header: t("driverId") },
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
      name: values?.name,
      email: values?.email,
      phone: values?.phoneNum,
      balance: values?.balance,
      status: values?.status,
      action: values?.status === "Active" ? true : false,
    });
    return datas.push({
      sn: index + 1,
      id: values?.id,
      name: values?.name,
      email: values?.email,
      phone: values?.phoneNum,
      balance: values?.units?.currencyUnit?.symbol + values?.totalEarning,
      status: (
        <div>
          {values?.status === "Active" ? (
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
        <div className="flex items-center gap-3" data-testid={`drivers-row-${values?.id}-actions`}>
          <label data-testid={`drivers-row-${values?.id}-switch`}> 
            <Switch
              onChange={() => {
                updateStatus(values?.id, values?.status);
              }}
              checked={values?.status === "Active"}
              uncheckedIcon={false}
              checkedIcon={false}
              onColor="#139013"
              onHandleColor="#fff"
              className="react-switch"
              boxShadow="none"
            />
          </label>

          <div data-testid={`drivers-row-${values?.id}-view-btn`}>
            <EditButton
              text={t("viewDetails")}
              onClick={() => viewDetails(values?.id)}
            />
          </div>
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
                {t("allDrivers")}
              </h2>
              <div className="flex gap-3 items-center flex-wrap relative z-10">
                <div data-testid="drivers-zone-select">
                  <Select
                    styles={customStyles}
                    placeholder="All Zones"
                    name=""
                    options={zoneOptions}
                    onChange={(e) => {
                      setFilterData({ ...filterData, zone: e });
                    }}
                    value={filterData?.zone}
                    data-testid="drivers-zone-select-input"
                  />
                </div>
                <div data-testid="drivers-drivertype-select">
                  <Select
                    styles={customStyles}
                    placeholder="Driver Type"
                    name=""
                    options={driverTypeOptions}
                    onChange={(e) => {
                      setFilterData({ ...filterData, driverType: e });
                    }}
                    value={filterData?.driverType}
                    data-testid="drivers-drivertype-select-input"
                  />
                </div>
                <div data-testid="drivers-helment">
                  <Helment
                    search={true}
                    searchOnChange={(e) => setSearch(e.target.value)}
                    searchValue={search}
                    csvdata={csv}
                  />
                </div>
                {/* <div className="flex gap-2">
                  <RedButton text={t('addNewDriver')} onClick={openModal} />
                </div> */}
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
                  {t("addNewDriver")}
                </div>
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody padding={4}>
                <div className="grid grid-cols-2 gap-5">
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
                      data-testid="drivers-modal-firstname-input"
                      className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
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
                      data-testid="drivers-modal-lastname-input"
                      className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
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
                      data-testid="drivers-modal-email-input"
                      className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label
                      htmlFor="phone"
                      className="text-black font-switzer font-semibold"
                    >
                      {t("phone")}
                    </label>
                    <div data-testid="drivers-modal-countrycode-input">
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
                      />
                    </div>
                  </div>
                  <div className="space-y-1 col-span-2">
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
                      data-testid="drivers-modal-password-input"
                      className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                    />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter padding={4}>
                <div className="flex gap-2">
                  <div data-testid="drivers-modal-cancel-btn">
                    <BlackButton
                      text={t("cancel")}
                      onClick={() => {
                        setModal(false);
                      }}
                    />
                  </div>

                  <div data-testid="drivers-modal-add-btn">
                    <RedButton text={t("add")} />
                  </div>
                </div>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </div>
      }
    />
  );
}
