import React, { useState } from "react";
import { useTranslation } from "react-i18next"; // Import useTranslation
import Layout from "../../components/Layout";
import Helment from "../../components/Helment";
import RedButton, { BlackButton, EditButton } from "../../utilities/Buttons";
import MyDataTable from "../../components/MyDataTable";
import Select from "react-select";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import "react-phone-input-2/lib/style.css";
import GetAPI from "../../utilities/GetAPI";
import { PutAPI } from "../../utilities/PutAPI";
import { PostAPI } from "../../utilities/PostAPI";
import Loader from "../../components/Loader";
import Switch from "react-switch";
import { toast, ToastContainer } from "react-toastify";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import CustomCheckbox from "../../components/CustomCheckbox";
import { IoClose } from "react-icons/io5";

const customStyles = {
  control: (base, state) => ({
    ...base,
    background: "#f4f4f4",
    borderRadius: state.isFocused ? "0 0 0 0" : 7,
    boxShadow: state.isFocused ? null : null,
    height: "56px",
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

const ManageCollection = () => {
  const { t } = useTranslation(); // Use the t function
  const { data, reFetch } = GetAPI("admin/addOnCategoryRest");
  const [modal, setModal] = useState(false);
  const [modalScroll, setModalScroll] = useState(0);
  const [addColl, setAddColl] = useState({
    singleChoice: true,
    restId: "",
    minAllowed: 0,
    maxAllowed: 1,
    showOption: "",
    collectionTitle: "",
    addOnList: [
      {
        addONName: "",
        price: 0,
        addOnMinQuantity: 0,
        addOnMaxQuantity: 1,
        isAddOnAvailable: true,
        advanceOption: false,
      },
    ],
  });

  const handleCloseModal = () => {
    setAddColl({
      singleChoice: true,
      restId: "",
      minAllowed: 0,
      maxAllowed: 1,
      showOption: "",
      collectionTitle: "",
      addOnList: [
        {
          addONName: "",
          price: 0,
          addOnMinQuantity: 0,
          addOnMaxQuantity: 1,
          isAddOnAvailable: true,
          advanceOption: false,
        },
      ],
    });

    setModal("");
    setModType("");
  };

  const [updateCol, setUpdateColl] = useState({
    name: "",
    id: "",
    rest: "",
  });

  const [modType, setModType] = useState("add");
  const [search, setSearch] = useState("");
  const [permission, setPermission] = useState({
    del: "",
    id: "",
  });
  const [businessType, setBusinessType] = useState("restaurant");
  const restList = [];
  const getRest = GetAPI(`admin/getallrestaurants/${businessType}`);
  console.log("getRest", getRest);
  getRest?.data?.data?.map((el) => {
    restList.push({
      value: el.id,
      label: el.businessName,
    });
  });

  const addOnCollectionData = () => {
    const filteredData = data?.data?.list?.filter((dat) => {
      return (
        search === "" ||
        (dat?.id && dat?.id.toString().includes(search.toLowerCase())) ||
        (dat?.restaurant &&
          dat?.restaurant.toLowerCase().includes(search.toLowerCase())) ||
        (dat?.title && dat?.title.toLowerCase().includes(search.toLowerCase()))
      );
    });
    return filteredData;
  };

  const handleStatus = async (id, status) => {
    const details = {
      id: id,
      status: status ? false : true,
    };
    const res = await PutAPI("admin/changeCollectionStatus", details);
    if (res.data.status === "1") {
      reFetch("admin/addOnCategoryRest");
      toast.success(res.data.message);
    } else {
      toast.error(res.data.message);
    }
  };

  const columns = [
    { field: "sn", header: t("serialNo") },
    { field: "name", header: t("collectionName") },
    { field: "resName", header: t("restaurantName") },
    { field: "status", header: t("status") },
    { field: "action", header: t("Action") },
  ];

  const handleSubmit = async () => {
    let res = await PostAPI("admin/addAddOns", {
      collectionTitle: addColl?.collectionTitle,
      showOption: addColl?.showOption,
      maxAllowed: addColl?.maxAllowed,
      minAllowed: addColl?.minAllowed,
      addOnList: addColl?.addOnList,
      singleChoice: addColl?.singleChoice,
      restaurantId: addColl?.restId?.value,
    });
    if (res?.data?.status === "1") {
      toast.success(res?.data?.message);
      setAddColl({
        name: "",
        restId: "",
      });
      setModal(false);
      reFetch("admin/addOnCategoryRest");
    } else {
      toast.error(res?.data?.message);
      setModal(false);
    }
  };
  const handleUpdate = async () => {
    let res = await PostAPI(`admin/updateAddOns`, {
      collectionId: addColl?.collectionId,
      collectionTitle: addColl?.collectionTitle,
      showOption: addColl?.showOption,
      maxAllowed: addColl?.maxAllowed,
      minAllowed: addColl?.minAllowed,
      addOnList: addColl?.addOnList,
      singleChoice: addColl?.singleChoice,
      restaurantId: addColl?.restId?.value,
    });
    if (res?.data?.status === "1") {
      toast.success(res?.data?.message);
      setAddColl({});
      setModal(false);
      reFetch("admin/addOnCategoryRest");
    } else {
      toast.error(res?.data?.message);
      setModal(false);
    }
  };

  const helpertoUpdate = (addOn) => {
    setAddColl({
      collectionId: addOn?.id,
      singleChoice: addOn?.length < 2 ? true : false,
      restId: { value: addOn?.restaurantId, label: addOn?.restaurant },
      minAllowed: addOn?.minAllowed,
      maxAllowed: addOn?.maxAllowed,
      showOption: true,
      collectionTitle: addOn?.title,
      addOnList: addOn?.addons?.map((item) => {
        return {
          addonId: item?.addOn?.id,
          addONName: item?.addOn?.name,
          price: item?.addOn?.price,
          addOnMinQuantity: item?.addOn?.minAllowed,
          addOnMaxQuantity: item?.addOn?.maxAllowed,
          isAddOnAvailable: item?.addOn?.isAvaiable,
          advanceOption: false,
        };
      }),
      // {
      //   addONName: "",
      //   price: 0,
      //   addOnMinQuantity: 0,
      //   addOnMaxQuantity: 1,
      //   isAddOnAvailable: true,
      //   advanceOption: false,
      // },
    });
  };

  const handleDelete = async () => {
    let res = await PostAPI("admin/deleteCollection", {
      id: permission.id,
    });
    if (res?.data?.status === "1") {
      toast.success(res?.data?.message);
      reFetch("admin/addOnCategoryRest");
      setPermission({
        id: "",
      });
      setModal(false);
    } else {
      toast.error(res?.data?.message);
      setModal(false);
    }
  };

  const datas = [];
  const csv = [];
  addOnCollectionData()?.map((values, index) => {
    csv.push({
      sn: index + 1,
      name: values?.title,
      resName: values?.restaurant,
      status: values?.status ? t("active") : t("inactive"),
      action: values.status,
    });
    return datas.push({
      sn: index + 1,
      name: values?.title,
      resName: values?.restaurant,
      action: (
        <div className="flex gap-x-2">
          <FaRegEdit
            size={25}
            className="cursor-pointer text-black"
            onClick={() => {
              helpertoUpdate(values);
              setModType("update");
              setModal(true);
            }}
          />
          <RiDeleteBin6Line
            size={27}
            className="cursor-pointer text-red-500"
            onClick={() => {
              setPermission({ ...permission, id: values?.id });
              setModType("delete");
              setModal(true);
            }}
          />
        </div>
      ),
      status: (
        <div className="flex items-center gap-3">
          <label>
            <Switch
              onChange={() => {
                handleStatus(values?.id, values.status);
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
        </div>
      ),
    });
  });

  const addOption = () => {
    setAddColl((prev) => ({
      ...prev,
      addOnList: [
        ...prev?.addOnList,
        {
          addONName: "",
          price: 0,
          addOnMinQuantity: 0,
          addOnMaxQuantity: 1,
          isAddOnAvailable: true,
          advanceOption: false,
          editAdvanced: false,
        },
      ],
    }));
  };

  // Add this helper to remove an option
  const removeOption = (idx) => {
    setAddColl((prev) => ({
      ...prev,
      addOnList: prev.addOnList.filter((_, i) => i !== idx),
    }));
  };

  const updateOption = (idx, field, value) => {
    setAddColl((prev) => ({
      ...prev,
      addOnList: prev.addOnList.map((opt, i) =>
        i === idx ? { ...opt, [field]: value } : opt
      ),
    }));
  };

  // Add this helper to toggle advanced details for a specific option
  const toggleAdvanced = (idx) => {
    setAddColl((prev) => ({
      ...prev,
      addOnList: prev.addOnList.map((opt, i) =>
        i === idx ? { ...opt, advanceOption: !opt.advanceOption } : opt
      ),
    }));
  };

  const handleModalScroll = (event) => {
    const shouldShow = event.target.scrollTop > 100;

    if (modalScroll !== shouldShow) {
      setModalScroll(shouldShow);
    }
  };

  return data?.length === 0 ? (
    <Loader />
  ) : (
    <Layout
      content={
        <div className="bg-themeGray p-5">
          <div className="bg-white rounded-lg p-5">
            <div className="flex justify-between items-center flex-wrap gap-5">
              <h2 className="text-themeRed text-lg font-bold font-norms">
                {t("Collections")}
              </h2>
              <div className="flex gap-2 items-center flex-wrap">
                <Helment
                  search={true}
                  searchOnChange={(e) => setSearch(e.target.value)}
                  searchValue={search}
                  csvdata={csv}
                />
                <div
                  onClick={() => {
                    setModType("add");
                    setModal(true);
                  }}
                  className="flex border items-center text-sm rounded-md px-2 py-1.5 h-9 bg-red-500 text-white hover:bg-white hover:border-black hover:text-black duration-100 cursor-pointer"
                >
                  {t("Add New Collection")}
                </div>
              </div>
            </div>

            <div>
              <MyDataTable columns={columns} data={datas} />
            </div>
          </div>

          {["add", "update"].includes(modType) ? (
            <Modal
              onClose={handleCloseModal}
              isOpen={modal}
              size={"2xl"}
              isCentered
            >
              <ModalOverlay />
              <ModalContent borderRadius="20px" overflow="hidden">
                <ModalHeader
                  padding={0}
                  className={`absolute transition-all duration-300 ease-in-out font-sf h-16 flex items-center ${
                    modalScroll
                      ? "translate-y-0 opacity-100"
                      : "-translate-y-full opacity-0"
                  } top-0 left-0 z-20 bg-white w-full shadow-md`}
                >
                  <div className="flex justify-center items-center w-full h-8">
                    <h2
                      className={`text-lg font-semibold transition-all duration-500 ease-in-out 
                                      ${
                                        modalScroll
                                          ? "translate-y-0 opacity-100 delay-500"
                                          : "-translate-y-4 opacity-0 delay-0"
                                      }`}
                    >
                      {modType === "add"
                        ? "Add Collection"
                        : "Update Collection"}
                    </h2>
                  </div>
                </ModalHeader>

                <div
                  onClick={handleCloseModal}
                  className="bg-themeGray hover:bg-gray-200 rounded-full cursor-pointer duration-150 size-10 absolute top-3 right-3 z-20 flex justify-center items-center text-2xl text-black font-black"
                >
                  <IoClose size={30} />
                </div>
                <ModalCloseButton />
                <ModalBody padding={0}>
                  <div
                    onScroll={handleModalScroll}
                    className="space-y-7 p-5 pt-20 h-max max-h-[calc(100vh-200px)] overflow-auto scroll-modal"
                  >
                    <div className="space-y-1">
                      <label
                        htmlFor="restaurantName"
                        className="text-black font-switzer font-semibold"
                      >
                        {t("Business Type")}
                      </label>

                      <Select
                        placeholder="Select Business Type"
                        options={[
                          { value: "Restaurant", label: "Restaurant" },
                          { value: "Store", label: "Store" },
                        ]}
                        value={{ value: businessType, label: businessType }}
                        onChange={(e) => {
                          setBusinessType(e.value);
                          setAddColl({
                            singleChoice: true,
                            restId: "",
                            minAllowed: 0,
                            maxAllowed: 1,
                            showOption: "",
                            collectionTitle: "",
                            addOnList: [
                              {
                                addONName: "",
                                price: 0,
                                addOnMinQuantity: 0,
                                addOnMaxQuantity: 1,
                                isAddOnAvailable: true,
                                advanceOption: false,
                              },
                            ],
                          });
                        }}
                      />
                    </div>
                    <div className="space-y-1">
                      <label
                        htmlFor="restaurantName"
                        className="text-black font-switzer font-semibold"
                      >
                        {t("Business Name")}
                      </label>

                      <Select
                        styles={customStyles}
                        placeholder="Select"
                        name="restaurantName"
                        options={restList}
                        value={addColl?.restId}
                        onChange={(e) => setAddColl({ ...addColl, restId: e })}
                        // value={zoneData?.zone}
                      />
                    </div>
                    <div className="space-y-1">
                      <label
                        htmlFor="collectionName"
                        className="text-black font-switzer font-semibold"
                      >
                        {t("Collection Name")}
                      </label>
                      <input
                        value={addColl?.collectionTitle}
                        type="text"
                        name="name"
                        id="name"
                        className="w-full h-[56px] bg-gray-100 px-4 rounded-lg"
                        placeholder="Collection name"
                        onChange={(e) =>
                          setAddColl({
                            ...addColl,
                            collectionTitle: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <p className="text-black font-switzer font-semibold">
                        {t("Option Type")}
                      </p>

                      <div className="flex items-center gap-5 pt-4">
                        <div className="flex items-center gap-2">
                          <label
                            htmlFor="optionName"
                            className="font-switzer font-semibold text-gray-500"
                          >
                            {t("Single Choice")}
                          </label>
                          <CustomCheckbox
                            checked={addColl?.singleChoice}
                            onChange={() =>
                              setAddColl({
                                ...addColl,
                                singleChoice: !addColl?.singleChoice,
                              })
                            }
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <label
                            htmlFor="optionName"
                            className="font-switzer font-semibold text-gray-500"
                          >
                            {t("Multi Choice")}
                          </label>
                          <CustomCheckbox
                            checked={!addColl?.singleChoice}
                            onChange={() =>
                              setAddColl({
                                ...addColl,
                                singleChoice: !addColl?.singleChoice,
                              })
                            }
                          />
                        </div>
                      </div>

                      {!addColl?.singleChoice && (
                        <div className="flex gap-5 pt-4">
                          <div className="space-y-2">
                            <div className="space-y-1">
                              <label
                                htmlFor="maximumQuantity"
                                className="text-black font-switzer font-semibold"
                              >
                                {t("Maximum Quantity")}
                              </label>
                              <input
                                value={addColl?.maxAllowed}
                                type="number"
                                name="maximumQuantity"
                                id="maximumQuantity"
                                className="w-full h-[56px] bg-gray-100 px-4 rounded-lg"
                                onChange={(e) =>
                                  setAddColl({
                                    ...addColl,
                                    maxAllowed: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="space-y-1">
                              <label
                                htmlFor="minimumQuantity"
                                className="text-black font-switzer font-semibold"
                              >
                                {t("Minimum Quantity")}
                              </label>
                              <input
                                value={addColl?.minAllowed}
                                type="number"
                                name="minimumQuantity"
                                id="minimumQuantity"
                                className="w-full h-[56px] bg-gray-100 px-4 rounded-lg"
                                onChange={(e) =>
                                  setAddColl({
                                    ...addColl,
                                    minAllowed: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {addColl?.addOnList?.map((item, idx) => {
                      return (
                        <div key={idx} className="space-y-2">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label
                                htmlFor="optionName"
                                className="text-black font-switzer font-semibold"
                              >
                                {t("Option Name")}
                              </label>
                              <input
                                value={item?.addONName}
                                type="text"
                                name="optionName"
                                id="optionName"
                                className="w-full h-[56px] bg-gray-100 px-4 rounded-lg"
                                placeholder="Option name"
                                onChange={(e) =>
                                  updateOption(idx, "addONName", e.target.value)
                                }
                              />
                            </div>

                            <div className="space-y-1">
                              <label
                                htmlFor="price"
                                className="text-black font-switzer font-semibold"
                              >
                                {t("Price")}
                              </label>
                              <input
                                value={item?.price}
                                type="number"
                                name="price"
                                id="price"
                                className="w-full h-[56px] bg-gray-100 px-4 rounded-lg"
                                placeholder="Option price"
                                onChange={(e) =>
                                  updateOption(idx, "price", e.target.value)
                                }
                              />
                            </div>
                          </div>

                          <div className="flex gap-4 items-center pt-3">
                            <label
                              htmlFor={idx}
                              className="text-black font-switzer font-semibold"
                            >
                              Is Available
                            </label>
                            <CustomCheckbox
                              id={idx}
                              checked={item?.isAddOnAvailable}
                              onChange={(e) =>
                                updateOption(
                                  idx,
                                  "isAddOnAvailable",
                                  e.target.checked
                                )
                              }
                            />
                          </div>

                          <div className="flex justify-between items-center py-3">
                            <span
                              onClick={() => toggleAdvanced(idx)}
                              className="font-switzer text-green-800  cursor-pointer"
                            >
                              {item?.advanceOption
                                ? "Hide advance details"
                                : "Show advance details"}
                            </span>

                            {addColl?.addOnList?.length > 1 && idx >= 1 && (
                              <button
                                type="button"
                                className=" text-red-500"
                                onClick={() => removeOption(idx)}
                              >
                                Delete
                              </button>
                            )}
                          </div>

                          {item?.advanceOption && (
                            <div className="flex gap-5">
                              <div className="space-y-2">
                                <div className="space-y-1">
                                  <label
                                    htmlFor="maximumQuantity"
                                    className="text-black font-switzer font-semibold"
                                  >
                                    {t("Maximum Quantity")}
                                  </label>
                                  <input
                                    type="text"
                                    name="maximumQuantity"
                                    id="maximumQuantity"
                                    className="w-full h-[56px] bg-gray-100 px-4 rounded-lg"
                                    value={item?.addOnMaxQuantity}
                                    onChange={(e) =>
                                      updateOption(
                                        idx,
                                        "addOnMaxQuantity",
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>
                              </div>

                              <div className="space-y-2">
                                <div className="space-y-1">
                                  <label
                                    htmlFor="minimumQuantity"
                                    className="text-black font-switzer font-semibold"
                                  >
                                    {t("Minimum Quantity")}
                                  </label>
                                  <input
                                    type="text"
                                    name="minimumQuantity"
                                    id="minimumQuantity"
                                    className="w-full h-[56px] bg-gray-100 px-4 rounded-lg"
                                    value={item?.addOnMinQuantity}
                                    onChange={(e) =>
                                      updateOption(
                                        idx,
                                        "addOnMinQuantity",
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    <div className="">
                      <button
                        type="button"
                        className="text-green-800 font-semibold"
                        onClick={addOption}
                      >
                        + Add another option
                      </button>
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter padding={4}>
                  <div className="flex gap-1 pr-5">
                    <BlackButton
                      text={t("cancel")}
                      onClick={() => {
                        setModal(false);
                      }}
                    />
                    <RedButton
                      text={t(
                        modType === "add"
                          ? "Confirm"
                          : modType === "update"
                          ? "Update"
                          : "Delete"
                      )}
                      onClick={
                        modType === "add"
                          ? handleSubmit
                          : modType === "update"
                          ? handleUpdate
                          : ""
                      }
                    />
                  </div>
                </ModalFooter>
              </ModalContent>
            </Modal>
          ) : modType === "delete" ? (
            <Modal
              onClose={() => setModal(false)}
              isOpen={modal}
              size={"lg"}
              isCentered
            >
              <ModalOverlay />
              <ModalContent>
                <ModalHeader padding={0}></ModalHeader>
                <ModalCloseButton />
                <ModalBody padding={4}>
                  <div className="space-y-5 p-5 flex flex-col items-center font-norms font-semibold text-xl">
                    <div>
                      <img src="/images/npswitch.svg" alt="npswitch" />
                    </div>
                    <p className="w-[80%] text-center">
                      Are you sure you want to delete this collection?
                    </p>
                  </div>
                </ModalBody>
                <ModalFooter padding={0}>
                  <div className="grid grid-cols-2 px-8 pb-12 gap-x-3 [&>div]:py-2.5 [&>div]:border w-full [&>div]:rounded-md [&>div]:cursor-pointer text-center font-semibold text-xl">
                    <div
                      className="border-black hover:bg-black hover:text-white duration-150"
                      onClick={() => setModal(false)}
                    >
                      {t("Cancel")}
                    </div>
                    <div
                      className="border-red-500 bg-red-500 text-white hover:bg-white hover:text-red-500 duration-150"
                      onClick={() => handleDelete()}
                    >
                      {t("Confirm")}
                    </div>
                  </div>
                </ModalFooter>
              </ModalContent>
            </Modal>
          ) : (
            ""
          )}
        </div>
      }
    />
  );
};

export default ManageCollection;
