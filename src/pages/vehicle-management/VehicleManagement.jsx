import React, { useState } from "react";
import Layout from "../../components/Layout";
import Helment from "../../components/Helment";
import RedButton, { BlackButton, EditButton } from "../../utilities/Buttons";
import MyDataTable from "../../components/MyDataTable";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import "react-phone-input-2/lib/style.css";
import GetAPI from "../../utilities/GetAPI";
import Loader, { MiniLoader } from "../../components/Loader";
import Switch from "react-switch";
import { BASE_URL } from "../../utilities/URL";
import { MdAddPhotoAlternate } from "react-icons/md";
import {
  error_toaster,
  info_toaster,
  success_toaster,
} from "../../utilities/Toaster";
import { PostAPI } from "../../utilities/PostAPI";
import { useTranslation } from "react-i18next";

export default function Restaurants() {
  const { data, reFetch } = GetAPI("admin/allvehicletype");
  const [modal, setModal] = useState(false);
  const [loader, setLoader] = useState(false);
  const [search, setSearch] = useState("");
  const [modalType, setModalType] = useState(null);
  const { t } = useTranslation();

  const [addVehicle, setAddVehicle] = useState({
    name: "",
    image: "",
    baseRate: "",
    perUnitRate: "",
    minCoverageArea:"",
    maxCoverageArea:"",
  });

  const [updateVehicle, setUpdateVehicle] = useState({
    name: "",
    image: "",
    id: "",
    baseRate: "",
    perUnitRate: "",
  });

  console.log("🚀 ~ Restaurants ~ updateVehicle:", updateVehicle)

  const vehicleData = () => {
    const filteredData = data?.data?.filter((dat) => {
      return (
        search === "" ||
        (dat?.id && dat?.id.toString().includes(search.toLowerCase())) ||
        (dat?.name && dat?.name.toLowerCase().includes(search.toLowerCase()))
      );
    });
    return filteredData;
  };

  const openModal = (type, id, name, image, baseRate, perUnitRate,minCoverageArea,maxCoverageArea) => {
    setModalType(type);
    setModal(true);
    setUpdateVehicle({
      ...updateVehicle,
      name: name,
      image: image,
      id: id,
      baseRate,
      perUnitRate,
      minCoverageArea,
      maxCoverageArea
    });
  };
  console.log(updateVehicle, "updateVehicle")

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAddVehicle({
        ...addVehicle,
        image: file,
        imgShow: imageUrl,
      });
    }
  };

  const handleUpdateImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUpdateVehicle({
        ...updateVehicle,
        image: file,
        imgShow: imageUrl,
      });
    }
  };
  console.log(addVehicle, "addVehicle")
  const addNewVehicle = async () => {
    if (addVehicle?.name === "") {
      info_toaster("Please Add Vehicle Name");
    } else if (addVehicle?.image === "") {
      info_toaster("Please Add Vehicle Image");
    } else if (addVehicle?.baseRate === "") {
      info_toaster("Please Add Base Rate");
    } else if (addVehicle?.perUnitRate === "") {
      info_toaster("Please Add Per Unit Rate");
    } else {
      setLoader(true);
      const formData = new FormData();
      formData.append("name", addVehicle?.name);
      formData.append("image", addVehicle?.image);
      formData.append("baseRate", addVehicle?.baseRate);
      formData.append("perUnitRate", addVehicle?.perUnitRate);
      formData.append("maxCoverageArea", addVehicle?.maxCoverageArea);
      formData.append("minCoverageArea", addVehicle?.minCoverageArea);
      let res = await PostAPI("admin/addvehicletype", formData);
      if (res?.data?.status === "1") {
        reFetch();
        setLoader(false);
        setModal(false);
        success_toaster(res?.data?.message);
        setAddVehicle({
          name: "",
          image: "",
        });
      } else {
        setLoader(false);
        error_toaster(res?.data?.message);
      }
    }
  };

  const update = async () => {
    setLoader(true);
    const formData = new FormData();
    formData.append("name", updateVehicle?.name);
    formData.append("image", updateVehicle?.image);
    formData.append("id", updateVehicle?.id);
    formData.append("baseRate", updateVehicle?.baseRate);
    formData.append("perUnitRate", updateVehicle?.perUnitRate);

    let res = await PostAPI("admin/updateVehicleType", formData);

    if (res?.data?.status === "1") {
      reFetch();
      setLoader(false);
      setModal(false);
      success_toaster(res?.data?.message);
      setUpdateVehicle({
        ...updateVehicle,
        name: "",
        image: "",
        id: "",
        baseRate: "",
        perUnitRate: "",
        imgShow: ""
      });
    } else {
      setLoader(false);
      error_toaster(res?.data?.message);
    }
  };

  const updateStatus = async (id, status) => {
    let res = await PostAPI(`admin/changestatusvehicle`, {
      vehicleId: id,
      status: status ? "false" : "true",
    });
    if (res?.data?.status === "1") {
      success_toaster(res?.data?.message);
      reFetch();
    } else {
      error_toaster(res?.data?.message);
    }
  };

  const columns = [
    { field: "sn", header: t("Serial. No") },
    { field: "id", header: t("Id") },
    {
      field: "logo",
      header: t("Logo"),
    },
    {
      field: "name",
      header: t("Name"),
    },
    {
      field: "baseRate",
      header: t("Base rate"),
    },
    {
      field: "perUnitRate",
      header: t("Per Unit Rate"),
    },
    {
      field: "minCoverageArea",
      header: t("Minimum Coverage Area"),
    },
    {
      field: "maxCoverageArea",
      header: t("Maximum Coverage Area"),
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
  vehicleData()?.map((values, index) => {
    csv.push({
      sn: index + 1,
      id: values?.id,
      logo: "Logo image",
      name: values?.name,
      baseRate: values?.baseRate,
      perUnitRate: values?.perUnitRate,
      minCoverageArea:values?.minCoverageArea,
      maxCoverageArea: values?.minCoverageArea,
      status: values?.status ? "Active" : "InActive",
      action: values?.status
    })
    return datas.push({
      sn: index + 1,
      id: values?.id,
      logo: (
        <div>
          <img
            src={`${BASE_URL}${values?.image}`}
            alt="image"
            className="w-24 h-24"
          />
        </div>
      ),
      name: values?.name,
      baseRate: values?.baseRate,
      perUnitRate: values?.perUnitRate,
      minCoverageArea:values?.minCoverageArea,
      maxCoverageArea: values?.minCoverageArea,
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
            onClick={() =>
              openModal(
                "Update Vehicle",
                values?.id,
                values?.name,
                values?.image,
                values?.baseRate,
                values?.perUnitRate,
                values?.minCoverageArea,
                values?.maxCoverageArea,
              )
            }
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
                {t("Vehicle Management")}
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
                    text={t("Add New Vehicle")}
                    onClick={() => {
                      openModal("Add New Vehicle");
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
              <ModalCloseButton />
              <ModalBody padding={4}>
                {loader ? (
                  <div className="h-[350px]">
                    <MiniLoader />
                  </div>
                ) : modalType === "Add New Vehicle" ? (
                  <div className="space-y-5">
                    <div
                      className="border-b-2 border-b-[#0000001F] text-black text-lg 
                    font-norms font-medium"
                    >
                      {t("Add Vehicle")}
                    </div>

                    <div className="grid grid-cols-1 gap-5">
                      <div className="space-y-1">
                        <label
                          htmlFor="name"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Vehicle Name")}
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                          onChange={(e) =>
                            setAddVehicle({
                              ...addVehicle,
                              name: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="w-28">
                        <label htmlFor="image" className="space-y-1">
                          <span className="text-black font-switzer font-semibold">
                            {t("Vehicle Image")}
                          </span>
                          {addVehicle?.image ? (
                            <img
                              src={addVehicle?.imgShow}
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
                          htmlFor="minCoverageArea"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Minimum Coverage Area")}
                        </label>
                        <input
                          type="text"
                          name="minCoverageArea"
                          id="minCoverageArea"
                          className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                          onChange={(e) =>
                            setAddVehicle({
                              ...addVehicle,
                              minCoverageArea: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <label
                          htmlFor="minCoverageArea"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Maximum Coverage Area")}
                        </label>
                        <input
                          type="text"
                          name="maxCoverageArea"
                          id="maxCoverageArea"
                          className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                          onChange={(e) =>
                            setAddVehicle({
                              ...addVehicle,
                              maxCoverageArea: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor="name"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Base Rate")}
                        </label>
                        <input
                          type="text"
                          name="baseRate"
                          id="baseRate"
                          className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                          onChange={(e) =>
                            setAddVehicle({
                              ...addVehicle,
                              baseRate: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor="name"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Per Unit Rate")}
                        </label>
                        <input
                          type="text"
                          name="perUnitRate"
                          id="perUnitRate"
                          className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                          onChange={(e) =>
                            setAddVehicle({
                              ...addVehicle,
                              perUnitRate: e.target.value,
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

                      <RedButton text={t("Add")} onClick={addNewVehicle} />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div
                      className="border-b-2 border-b-[#0000001F] text-black text-lg 
                    font-norms font-medium"
                    >
                      {t("Update Vehicle")}
                    </div>

                    <div className="grid grid-cols-1 gap-5">
                      <div className="space-y-1">
                        <label
                          htmlFor="name"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Vehicle Name")}
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                          onChange={(e) =>
                            setUpdateVehicle({
                              ...updateVehicle,
                              name: e.target.value,
                            })
                          }
                          value={updateVehicle?.name}
                        />
                      </div>

                      <div className="w-28">
                        <label htmlFor="image" className="space-y-1">
                          <span className="text-black font-switzer font-semibold">
                            {t("Vehicle Image")}
                          </span>

                          <img
                            src={
                              updateVehicle?.imgShow
                                ? updateVehicle?.imgShow
                                : `${BASE_URL}${updateVehicle?.image}`
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
                    </div>
                    <div>
                      <div className="space-y-1">
                        <label
                          htmlFor="name"
                          className="text-black font-switzer font-semibold"
                        >
                          Base Rate
                        </label>
                        <input
                          type="number"
                          name="baseRate"
                          id="baseRate"
                          className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                          onChange={(e) =>
                            setUpdateVehicle({
                              ...updateVehicle,
                              baseRate: e.target.value,
                            })
                          }
                          value={updateVehicle?.baseRate}
                        />

                      </div>
                      <div className="space-y-1">
                        <label
                          htmlFor="name"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Per Unit Rate")}
                        </label>
                        <input
                          type="number"
                          name="perUnitRate"
                          id="perUnitRate"
                          className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                          onChange={(e) =>
                            setUpdateVehicle({
                              ...updateVehicle,
                              perUnitRate: e.target.value,
                            })
                          }
                          value={updateVehicle?.perUnitRate}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                        <label
                          htmlFor="minCoverageArea"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Minimum Coverage Area")}
                        </label>
                        <input
                          type="text"
                          name="minCoverageArea"
                          id="minCoverageArea"
                          className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                          onChange={(e) =>
                            setUpdateVehicle({
                              ...updateVehicle,
                              minCoverageArea: e.target.value,
                            })
                          }
                          value={updateVehicle?.minCoverageArea}
                        />
                      </div>
                      <div className="space-y-1">
                        <label
                          htmlFor="minCoverageArea"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Maximum Coverage Area")}
                        </label>
                        <input
                          type="text"
                          name="maxCoverageArea"
                          id="maxCoverageArea"
                          className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                          onChange={(e) =>
                            setUpdateVehicle({
                              ...updateVehicle,
                              maxCoverageArea: e.target.value,
                            })
                          }
                          value={updateVehicle?.maxCoverageArea}
                        />
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
