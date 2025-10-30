import React, { useState } from "react";
import Layout from "../../components/Layout";
import Helment from "../../components/Helment";
import RedButton, { BlackButton, EditButton } from "../../utilities/Buttons";
import MyDataTable from "../../components/MyDataTable";
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
import GetAPI from "../../utilities/GetAPI";
import Loader from "../../components/Loader";
import Switch from "react-switch";
import { BASE_URL } from "../../utilities/URL";
import { useNavigate } from "react-router-dom";
import { error_toaster, success_toaster } from "../../utilities/Toaster";
import { PutAPI } from "../../utilities/PutAPI";
import { useTranslation } from "react-i18next";

export default function Stores() {
  const { t } = useTranslation();
  const { data, reFetch } = GetAPI("admin/getAllStores");
  const [modal, setModal] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const restaurantData = () => {
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

  const edit = (resId) => {
    navigate(`/edit-store/${resId}`, {
      state: {
        resId: resId,
      },
    });
  };

  const updateStatus = async (resId, userStatus) => {
    if (userStatus === true) {
      let res = await PutAPI("admin/changerestaurantstatus", {
        status: false,
        id: resId,
      });
      if (res?.data?.status === "1") {
        success_toaster(res?.data?.message);
        reFetch();
      } else {
        error_toaster(res?.data?.message);
      }
    } else {
      let res = await PutAPI("admin/changerestaurantstatus", {
        status: true,
        id: resId,
      });
      if (res?.data?.status === "1") {
        success_toaster(res?.data?.message);
        reFetch();
      } else {
        error_toaster(res?.data?.message);
      }
    }
  };

  const columns = [
    { field: "sn", header: t("Serial No") },
    { field: "id", header: t("Id") },
    {
      field: "logo",
      header: t("Logo"),
    },
    {
      field: "name",
      header: t("Store Name"),
    },
    {
      field: "city",
      header: t("City"),
    },
    {
      field: "ownerName",
      header: t("Owner Name"),
    },
    {
      field: "operatingTime",
      header: t("Operating Time"),
    },
    {
      field: "joinedAt",
      header: t("Joined At"),
    },
    {
      field: "status",
      header: t("Status"),
    },
    {
      field: "action",
      header: t("Action"),
    },
  ];

  const datas = [];
  const csv = [];
  restaurantData()?.map((values, index) => {
    csv.push({
      sn: index + 1,
      id: values?.id,
      logo: t("Image"),
      name: values?.businessName,
      city: values?.city,
      ownerName: values?.ownerName,
      operatingTime: values?.operatingTime,
      joinedAt: values?.joinedAt.split("/").join("--"),
      status: values?.status ? t("Active") : t("Inactive"),
      action: values?.status,
    });
    return datas.push({
      sn: index + 1,
      id: values?.id,
      logo: (
        <div>
          <img
            src={`${BASE_URL}${values?.logo}`}
            alt="image"
            className="w-24 h-24"
          />
        </div>
      ),
      name: values?.businessName,
      city: values?.city,
      ownerName: values?.ownerName,
      operatingTime: values?.operatingTime,
      joinedAt: values?.joinedAt,
      status: (
        <div>
          {values?.status ? (
            <div
              className="bg-[#21965314] text-themeGreen font-semibold p-2 rounded-md flex 
              justify-center"
            >
              {t("Active")}
            </div>
          ) : (
            <div
              className="bg-[#EE4A4A14] text-themeRed font-semibold p-2 rounded-md flex 
              justify-center"
            >
              {t("Inactive")}
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
              checked={values?.status}
              uncheckedIcon={false}
              checkedIcon={false}
              onColor="#139013"
              onHandleColor="#fff"
              className="react-switch"
              boxShadow="none"
            />
          </label>

          <EditButton
            text={t("Edit")}
            onClick={() => {
              edit(values?.id);
            }}
          />
        </div>
      ),
    });
  });

  return data?.length === 0 ? (
    <Loader />
  ) : (
    <Layout
      content={
        <div className="bg-themeGray p-5">
          <div className="bg-white rounded-lg p-5">
            <div className="flex justify-between items-center flex-wrap gap-5">
              <h2 className="text-themeRed text-lg font-bold font-norms">
                {t("All Stores")}
              </h2>
              <div className="flex gap-2 items-center flex-wrap">
                <Helment
                  search={true}
                  searchOnChange={(e) => setSearch(e.target.value)}
                  searchValue={search}
                  csvdata={csv}
                />
                <div className="flex gap-2">
                  <RedButton
                    text={t("Add New Store")}
                    onClick={() => {
                      navigate("/add-store");
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
            onClose={() => setModal(false)}
            isOpen={modal}
            size={"2xl"}
            isCentered
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader padding={0}>
                <div className="border-b-2 border-b-[#0000001F] px-5 py-2.5 text-lg font-norms font-medium">
                  {t("Add New Store")}
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
                      {t("First Name")}
                    </label>
                    <input
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
                  <div className="space-y-1 col-span-2">
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
                </div>
              </ModalBody>
              <ModalFooter padding={4}>
                <div className="flex gap-2">
                  <BlackButton
                    text={t("Cancel")}
                    onClick={() => {
                      setModal(false);
                    }}
                  />

                  <RedButton text={t("Add")} />
                </div>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </div>
      }
    />
  );
}
