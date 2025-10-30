import React, { useState } from "react";
import { useTranslation } from 'react-i18next'; // Import useTranslation
import Layout from "../../components/Layout";
import Helment from "../../components/Helment";
import MyDataTable from "../../components/MyDataTable";
import Loader, { MiniLoader } from "../../components/Loader";
import GetAPI from "../../utilities/GetAPI";
import Switch from "react-switch";
import RedButton, { BlackButton, EditButton } from "../../utilities/Buttons";
import { BASE_URL } from "../../utilities/URL";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { MdAddPhotoAlternate } from "react-icons/md";
import {
  error_toaster,
  info_toaster,
  success_toaster,
} from "../../utilities/Toaster";
import { PostAPI } from "../../utilities/PostAPI";

export default function Countries() {
  const { t } = useTranslation(); // Use useTranslation hook
  const { data, reFetch } = GetAPI("admin/getCountries");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [loader, setLoader] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [addCountry, setAddCountry] = useState({
    name: "",
    image: "",
    shortName: "",
  });
  const [updateCountry, setUpdateCountry] = useState({
    id: "",
    name: "",
    image: "",
    shortName: "",
  });

  const countryData = () => {
    const filteredData = data?.data?.countries?.filter((dat) => {
      return (
        search === "" ||
        (dat?.id && dat?.id.toString().includes(search.toLowerCase())) ||
        (dat?.name && dat?.name.toLowerCase().includes(search.toLowerCase()))
      );
    });
    return filteredData;
  };

  const openModal = (type, id, name, image, shortName) => {
    setModalType(type);
    setModal(true);
    setUpdateCountry({
      shortName: shortName,
      name: name,
      image: image,
      id: id,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAddCountry({
        ...addCountry,
        image: file,
        imgShow: imageUrl,
      });
    }
  };

  const handleUpdateImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUpdateCountry({
        ...updateCountry,
        image: file,
        imgShow: imageUrl,
      });
    }
  };

  const addNewCountry = async () => {
    if (addCountry?.image === "") {
      info_toaster(t("Please Add Country Image"));
    } else if (addCountry?.name === "") {
      info_toaster(t("Please Add Country Name"));
    } else if (addCountry?.shortName === "") {
      info_toaster(t("Please Add Country Short Name"));
    } else {
      setLoader(true);
      const formData = new FormData();
      formData.append("name", addCountry?.name);
      formData.append("image", addCountry?.image);
      formData.append("shortName", addCountry?.shortName);
      let res = await PostAPI("admin/addCountry", formData);
      if (res?.data?.status === "1") {
        reFetch();
        setLoader(false);
        setModal(false);
        success_toaster(res?.data?.message);
      } else {
        setLoader(false);
        error_toaster(res?.data?.message);
      }
    }
  };

  const update = async () => {
    setLoader(true);
    const formData = new FormData();
    formData.append("name", updateCountry?.name);
    formData.append("shortName", updateCountry?.shortName);
    formData.append("image", updateCountry?.image);
    formData.append("id", updateCountry?.id);
    let res = await PostAPI("admin/editCountry", formData);
    if (res?.data?.status === "1") {
      reFetch();
      setLoader(false);
      setModal(false);
      success_toaster(res?.data?.message);
    } else {
      setLoader(false);
      error_toaster(res?.data?.message);
    }
  };

  const updateStatus = async (counId, status) => {
    if (status === true) {
      let res = await PostAPI("admin/changeCountryStatus", {
        status: false,
        id: counId,
      });
      if (res?.data?.status === "1") {
        success_toaster(res?.data?.message);
        reFetch();
      } else {
        error_toaster(res?.data?.message);
      }
    } else {
      let res = await PostAPI("admin/changeCountryStatus", {
        status: true,
        id: counId,
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
    { field: "name", header: t("Name") },
    { field: "image", header: t("Image") },
    { field: "shortName", header: t("Short Name") },
    { field: "status", header: t("Status") },
    { field: "action", header: t("Action") },
  ];

  const datas = [];
  const csv = [];
  countryData()?.map((values, index) => {
    csv.push({
      sn: index + 1,
      id: values?.id,
      name: values?.name,
      image: "Image",
      shortName: values?.shortName,
      status: values?.status ? t("Active") : t("Inactive"),
      action: values?.status
    });
    return datas.push({
      sn: index + 1,
      id: values?.id,
      name: values?.name,
      image: (
        <div>
          <img
            src={`${BASE_URL}${values?.flag}`}
            alt="image"
            className="w-24 h-24"
          />
        </div>
      ),
      shortName: values?.shortName,
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
            text={t("Update")}
            onClick={() => {
              openModal(
                t("Update Country"),
                values?.id,
                values?.name,
                values?.flag,
                values?.shortName
              );
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
                {t("All Countries")}
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
                    text={t("Add New Country")}
                    onClick={() => openModal(t("Add New Country"))}
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
              <ModalCloseButton />
              <ModalBody padding={4}>
                {loader ? (
                  <div className="h-[400px]">
                    <MiniLoader />
                  </div>
                ) : modalType === t("Add New Country") ? (
                  <div className="space-y-5">
                    <div
                      className="border-b-2 border-b-[#0000001F] text-black text-lg 
                    font-norms font-medium"
                    >
                      {t("Add New Country")}
                    </div>
                    <div className="grid grid-cols-1 gap-5">
                      <div className="w-28">
                        <label htmlFor="image" className="space-y-1">
                          <span className="text-black font-switzer font-semibold">
                            {t("Upload Image")}
                          </span>
                          {addCountry?.image ? (
                            <img
                              src={addCountry?.imgShow}
                              alt="banner"
                              className="w-24 h-24"
                            />
                          ) : (
                            <div className="p-5 bg-themeInput w-24 h-24 rounded-md cursor-pointer flex justify-center items-center">
                              <MdAddPhotoAlternate
                                size={40}
                                color="#00000099"
                              />
                            </div>
                          )}
                        </label>

                        <input
                          onChange={handleImageChange}
                          type="file"
                          name="image"
                          id="image"
                          hidden
                        />
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor="name"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Country Name")}
                        </label>
                        <input
                          value={addCountry?.name}
                          type="text"
                          name="name"
                          id="name"
                          className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                          onChange={(e) =>
                            setAddCountry({
                              ...addCountry,
                              name: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor="shortName"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Country Short Name")}
                        </label>
                        <input
                          value={addCountry?.shortName}
                          type="text"
                          name="shortName"
                          id="shortName"
                          className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                          onChange={(e) =>
                            setAddCountry({
                              ...addCountry,
                              shortName: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <BlackButton
                        text={t("Cancel")}
                        onClick={() => {
                          setModal(false);
                        }}
                      />

                      <RedButton text={t("Add")} onClick={addNewCountry} />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div
                      className="border-b-2 border-b-[#0000001F] text-black text-lg 
                    font-norms font-medium"
                    >
                      {t("Update Country")}
                    </div>
                    <div className="grid grid-cols-1 gap-5">
                      <div className="w-28">
                        <label htmlFor="image" className="space-y-1">
                          <span className="text-black font-switzer font-semibold">
                            {t("Upload Image")}
                          </span>

                          <img
                            src={
                              updateCountry?.imgShow
                                ? updateCountry?.imgShow
                                : `${BASE_URL}${updateCountry?.image}`
                            }
                            alt="banner"
                            className="w-24 h-24"
                          />
                        </label>

                        <input
                          onChange={handleUpdateImageChange}
                          type="file"
                          name="image"
                          id="image"
                          hidden
                        />
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor="name"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Country Name")}
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                          onChange={(e) =>
                            setUpdateCountry({
                              ...updateCountry,
                              name: e.target.value,
                            })
                          }
                          value={updateCountry?.name}
                        />
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor="shortName"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Country Short Name")}
                        </label>
                        <input
                          value={updateCountry?.shortName}
                          type="text"
                          name="shortName"
                          id="shortName"
                          className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                          onChange={(e) =>
                            setUpdateCountry({
                              ...updateCountry,
                              shortName: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <BlackButton
                        text={t("Cancel")}
                        onClick={() => {
                          setModal(false);
                        }}
                      />

                      <RedButton text={t("Update")} onClick={update} />
                    </div>
                  </div>
                )}
              </ModalBody>
            </ModalContent>
          </Modal>
        </div>
      }
    />
  );
}
