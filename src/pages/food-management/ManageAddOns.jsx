import React, { useState } from "react";
import { useTranslation } from "react-i18next"; // Import useTranslation
import Layout from "../../components/Layout";
import Helment from "../../components/Helment";
import RedButton, { BlackButton } from "../../utilities/Buttons";
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
import Select from "react-select";
import "react-phone-input-2/lib/style.css";
import GetAPI from "../../utilities/GetAPI";
import { PutAPI } from "../../utilities/PutAPI";
import { PostAPI } from "../../utilities/PostAPI";
import Loader from "../../components/Loader";
import Switch from "react-switch";
import { toast } from "react-toastify";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";

const ManageAddOns = () => {
  const { t } = useTranslation(); // Use the t function
  const { data, reFetch } = GetAPI("admin/restAddOns");
  const [modal, setModal] = useState(false);
  const [modType, setModType] = useState("add");
  const [search, setSearch] = useState("");
  const [addAddOn, setAddAddOn] = useState({});

  const addOnData = () => {
    const query = search.trim().toLowerCase() || "";
    const filteredData = data?.data?.filter((dat) => {
      return (
        dat?.id?.toString().includes(query) ||
        dat?.restaurant?.businessName?.toLowerCase().includes(query) ||
        dat?.name?.toLowerCase().includes(query)
      );
    });
    return filteredData;
  };

  const handleStatus = async (id, status) => {
    console.log(id, status, "ifd");
    const res = await PutAPI(`admin/statusaddon/${id}`, {
      status: status ? 0 : 1,
    });
    console.log("🚀 ~ handleStatus ~ res:", res);
    if (res.data.status === "1") {
      reFetch();
      toast.success(res.data.message);
    } else {
      toast.error(res.data.message);
    }
  };

  const handleUpdate = async () => {
    let res = await PutAPI(`admin/updateaddon/${addAddOn?.id}`, {
      name: addAddOn?.name,
    });
    if (res?.data?.status === "1") {
      toast.success(res?.data?.message);
      setModType("add");
      setModal(false);
      reFetch();
    } else {
      toast.error(res?.data?.message);
    }
  };
  const restList = [];
  const collectionList = [];
  const getCollectionList = GetAPI(
    `admin/getAllAddOnCategories/${addAddOn?.restaurant?.value}`
  );
  const getRest = GetAPI("admin/getallrestaurants");

  getCollectionList?.data?.data?.map((el) => {
    collectionList.push({
      value: el?.addonCategory?.id,
      label: el?.addonCategory?.name,
    });
  });

  getRest?.data?.data?.map((el) => {
    restList.push({
      value: el.id,
      label: el.businessName,
    });
  });

  const handleChange = (e, type) => {
    setAddAddOn({
      ...addAddOn,
      [type]: e,
    });
  };
  const handleAdd = async () => {
    let res = await PostAPI("retailer/addAddOns", {
      name: addAddOn?.addonName,
      price: addAddOn?.price,
      addOnCategoryId: addAddOn?.collection?.value,
      isPaid: addAddOn?.itemType?.value,
      maxAllowed: 5,
      minAllowed: 1,
      restaurantId: addAddOn?.restaurant?.value,
    });
    if (res?.data?.status === "1") {
      toast.success(res.data.message);
      reFetch();
      setAddAddOn({});
      setModal(false);
    } else {
      toast.error(res.data.message);
      setModal(false);
    }
  };

  const deleteAddon = async () => {
    let res = await PostAPI("admin/deleteAddon", {
      addonId: addAddOn?.id,
    });

    if (res?.data?.status === "1") {
      toast.success(res.data.message);
      reFetch();
      setAddAddOn({});
      setModal(false);
    } else {
      toast.error(res.data.message);
      setModal(false);
    }
  };

  const columns = [
    { field: "sn", header: t("serialNo") },
    { field: "name", header: t("Name") },
    { field: "collName", header: t("Collection Name") },
    { field: "resName", header: t("restaurantName") },
    { field: "type", header: t("Type") },
    { field: "price", header: t("Price") },
    // { field: "status", header: t("status") },
    // { field: "action", header: t("Action") },
  ];

  const datas = [];
  const csv = [];
  addOnData()?.map((values, index) => {
    csv.push({
      sn: index + 1,
      name: values?.name,
      collName: values?.collectionAddon?.collection?.name,
      resName: values?.restaurant?.businessName,
      type: "yjg",
      price:
        values?.price +
        values?.restaurant?.zoneRestaurant?.zone?.zoneDetail?.currencyUnit
          ?.symbol,
      // status: values?.status ? t("active") : t("inactive"),
      // action: values.status,
    });
    return datas.push({
      sn: index + 1,
      name: values?.name,
      collName: values?.collectionAddon?.collection?.title,
      resName: values?.restaurant?.businessName,
      type: values?.restaurant?.businessType === "1" ? "Restaurant" : "Store",
      price:
        values?.price +
        " " +
        values?.restaurant?.zoneRestaurant?.zone?.zoneDetail?.currencyUnit
          ?.symbol,
      // action: (
      //   <div className="flex gap-x-2">
      //     <FaRegEdit
      //       size={25}
      //       className="cursor-pointer text-black"
      //       onClick={() => {
      //         setModType("update");
      //         setModal(true);
      //         setAddAddOn({ ...addAddOn, id: values?.id, name: values?.name });
      //       }}
      //     />
      //     <RiDeleteBin6Line
      //       size={27}
      //       className="cursor-pointer text-red-500"
      //       onClick={() => {
      //         setModType("delete");
      //         setModal(true);
      //         setAddAddOn({ ...addAddOn, id: values?.id });
      //       }}
      //     />
      //   </div>
      // ),
      // status: (
      //   <div className="flex items-center gap-3">
      //     <label>
      //       <Switch
      //         onChange={() => {
      //           handleStatus(values?.id, values.status);
      //         }}
      //         checked={values?.status}
      //         uncheckedIcon={false}
      //         checkedIcon={false}
      //         onColor="#139013"
      //         onHandleColor="#fff"
      //         className="react-switch"
      //         boxShadow="none"
      //       />
      //     </label>
      //   </div>
      // ),
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
                {t("Addons")}
              </h2>
              <div className="flex gap-2 items-center flex-wrap">
                <Helment
                  search={true}
                  searchOnChange={(e) => setSearch(e.target.value)}
                  searchValue={search}
                  csvdata={csv}
                />
                {/* <div
                  onClick={() => {
                    setModType("add");
                    setModal(true);
                  }}
                  className="flex border items-center text-sm rounded-md px-2 py-1.5 h-9 bg-red-500 text-white hover:bg-white hover:border-black hover:text-black duration-100 cursor-pointer"
                >
                  {t("Add New Addon")}
                </div> */}
              </div>
            </div>

            <div>
              <MyDataTable columns={columns} data={datas} />
            </div>
          </div>

          {modType === "add" ? (
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
                    {t("Add AddOns")}
                  </div>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody padding={4}>
                  <div className="grid grid-cols-2 gap-x-3 px-5 pt-5 [&>div]:my-3">
                    <div className="space-y-1">
                      <label
                        htmlFor="collectionName"
                        className="text-black font-switzer font-semibold"
                      >
                        {t("Name")}
                      </label>
                      <input
                        type="text"
                        name="addonName"
                        id="addonName"
                        className="bg-themeInput w-full h-[46px] px-3 rounded-md outline-none"
                        placeholder="Addon name"
                        onChange={(e) =>
                          handleChange(e.target.value, "addonName")
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <label
                        htmlFor="Collection"
                        className="text-black font-switzer font-semibold"
                      >
                        {t("Collection")}
                      </label>
                      <Select
                        // styles={customStyles}
                        placeholder="Select Collection"
                        name="Collection"
                        options={collectionList}
                        onChange={(e) => handleChange(e, "collection")}
                        // value={zoneData?.zone}
                      />
                    </div>
                    <div className="space-y-1">
                      <label
                        htmlFor="itemType"
                        className="text-black font-switzer font-semibold"
                      >
                        {t("Item Type")}
                      </label>
                      <Select
                        // styles={customStyles}
                        placeholder="Select Type"
                        name="itemType"
                        options={[
                          { value: "1", label: "Paid" },
                          { value: "0", label: "UnPaid" },
                        ]}
                        onChange={(e) => handleChange(e, "itemType")}
                        // value={zoneData?.zone}
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
                        type="number"
                        name="price"
                        id="price"
                        className="bg-themeInput w-full h-[46px] px-3 rounded-md outline-none"
                        onChange={(e) => handleChange(e.target.value, "price")}
                      />
                    </div>
                    <div className="space-y-1">
                      <label
                        htmlFor="restaurant"
                        className="text-black font-switzer font-semibold"
                      >
                        {t("Restaurant")}
                      </label>
                      <Select
                        // styles={customStyles}
                        placeholder="Select restaurant"
                        name="restaurant"
                        options={restList}
                        onChange={(e) => handleChange(e, "restaurant")}
                        // value={zoneData?.zone}
                      />
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
                    <RedButton text={t("Confirm")} onClick={handleAdd} />
                  </div>
                </ModalFooter>
              </ModalContent>
            </Modal>
          ) : modType === "update" ? (
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
                    <div className="w-full my-5">
                      <label htmlFor="">Name</label>
                      <input
                        className="border-black border rounded-md px-2 py-1.5 outline-none w-full"
                        value={addAddOn?.name}
                        onChange={(e) =>
                          setAddAddOn({ ...addAddOn, name: e.target.value })
                        }
                        type="text"
                      />
                    </div>
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
                      onClick={handleUpdate}
                    >
                      {t("Confirm")}
                    </div>
                  </div>
                </ModalFooter>
              </ModalContent>
            </Modal>
          ) : (
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
                      Are you sure you want to delete this banner?
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
                      onClick={deleteAddon}
                    >
                      {t("Confirm")}
                    </div>
                  </div>
                </ModalFooter>
              </ModalContent>
            </Modal>
          )}
        </div>
      }
    />
  );
};

export default ManageAddOns;
