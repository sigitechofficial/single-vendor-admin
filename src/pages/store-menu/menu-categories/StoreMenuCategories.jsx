import React, { useState } from "react";
import { useTranslation } from 'react-i18next'; // Import useTranslation
import Layout from "../../../components/Layout";
import Helment from "../../../components/Helment";
import RedButton, { BlackButton, EditButton } from "../../../utilities/Buttons";
import MyDataTable from "../../../components/MyDataTable";
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
import { PutAPI } from "../../../utilities/PutAPI";
import Loader from "../../../components/Loader";
import { BASE_URL } from "../../../utilities/URL";
import dayjs from "dayjs";
import Switch from "react-switch";
import { toast } from "react-toastify";

export default function StoreMenuCategories() {
  const { t } = useTranslation(); // Initialize useTranslation
  const { data, reFetch } = GetAPI("admin/getmenucategory");
  const [modal, setModal] = useState(false);
  const [search, setSearch] = useState("");

  const menuCategoryData = () => {
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

  const handleStatus = async (status, id) => {
    let dets = {
      status: status ? false : true,
      id: id,
    };
    let res = await PutAPI("admin/changestatusmenucategory", dets);
    if (res.data.status === "1") {
      reFetch("admin/getmenucategory");
      toast.success(res.data.message);
    } else {
      toast.error(res.data.message);
    }
  };

  const columns = [
    { field: "sn", header: t('serialNo') },
    { field: "id", header: t('id') },
    { field: "name", header: t('name') },
    { field: "createdAt", header: t('createdAt') },
    { field: "updatedAt", header: t('updatedAt') },
    { field: "status", header: t('status') },
    { field: "action", header: t('action') },
  ];

  const datas = [];
  const csv = [];
  menuCategoryData()?.map((values, index) => {
    csv.push({
      sn: index + 1,
      id: values?.id,
      name: values?.name,
      createdAt: values?.createdAt,
      updatedAt: values?.updatedAt,
      status: values?.status ? t('active') : t('inactive'),
      action: values?.status,
    });
    return datas.push({
      sn: index + 1,
      id: values?.id,
      name: values?.name,
      image: (
        <div>
          <img
            src={`${BASE_URL}${values?.image}`}
            alt={t('image')}
            className="w-24 h-24"
          />
        </div>
      ),
      createdAt: dayjs(values?.createdAt).format("DD-MM-YYYY h:mm:ss A"),
      updatedAt: dayjs(values?.updatedAt).format("DD-MM-YYYY h:mm:ss A"),
      status: (
        <div>
          {values?.status ? (
            <div
              className="bg-[#21965314] text-themeGreen font-semibold p-2 rounded-md flex 
                justify-center"
            >
              {t('active')}
            </div>
          ) : (
            <div
              className="bg-[#EE4A4A14] text-themeRed font-semibold p-2 rounded-md flex 
                justify-center"
            >
              {t('inactive')}
            </div>
          )}
        </div>
      ),
      action: (
        <div className="flex items-center gap-3">
          <label>
            <Switch
              onChange={() => {
                handleStatus(values?.status, values?.id);
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
          {/* <EditButton text={t('viewDetails')} /> */}
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
                {t('menuCategories')}
              </h2>
              <div className="flex gap-2 items-center flex-wrap">
                <Helment
                  search={true}
                  searchOnChange={(e) => setSearch(e.target.value)}
                  searchValue={search}
                  csvdata={csv}
                />
                <div className="flex gap-2">
                  {/* <RedButton text={t('addNewCategory')} onClick={openModal} /> */}
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
                  {t('addNewEmployee')}
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
                      {t('firstName')}
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
                      {t('lastName')}
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
                      {t('email')}
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
                      {t('phoneNo')}
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
                      {t('password')}
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
                    text={t('cancel')}
                    onClick={() => {
                      setModal(false);
                    }}
                  />
                  <RedButton text={t('add')} />
                </div>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </div>
      }
    />
  );
}
