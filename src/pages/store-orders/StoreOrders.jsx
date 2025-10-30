import React, { useState } from "react";
import Layout from "../../components/Layout";
import Helment from "../../components/Helment";
import MyDataTable from "../../components/MyDataTable";
import Loader from "../../components/Loader";
import GetAPI from "../../utilities/GetAPI";
import RedButton, { BlackButton, EditButton } from "../../utilities/Buttons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { PostAPI } from "../../utilities/PostAPI";
import { success_toaster } from "../../utilities/Toaster";

export default function AllOrders() {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data, setData } = GetAPI("admin/storeAllOrders");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filterOptions = GetAPI("admin/filterOptions");
  const [selected, setSelected] = useState({
    city: "",
    country: "",
    storeTypes: "",
    zones: "",
    from: "",
    to: "",
  });

  const cityOptions = [];
  const countryOptions = [];
  const zonesOptions = [];

  if (filterOptions) {
    filterOptions?.data?.data?.city?.map((el) => {
      cityOptions.push({
        value: el?.id,
        label: el?.name,
      });
    });
    filterOptions?.data?.data?.country?.map((el) => {
      countryOptions.push({
        value: el?.id,
        label: el?.name,
      });
    });
    filterOptions?.data?.data?.zones?.map((el) => {
      zonesOptions.push({
        value: el?.id,
        label: el?.name,
      });
    });
  }

  const handleChange = (e, type, str) => {
    setSelected({
      ...selected,
      [type]: e,
    });
  };

  const handleCearFilter = () => {
    setSelected({
      city: "",
      country: "",
      storeTypes: "",
      zones: "",
      from: "",
      to: "",
    });
  };

  const handleSubmit = async () => {
    let res = await PostAPI("admin/filterOrders", {
      city: selected?.city?.label,
      country: selected?.country?.label,
      zoneId: selected?.zones?.value,
      businessType: 3,
      startDate: selected?.from,
      endDate: selected?.to,
      driverType: selected?.driverType?.label,
    });
    if (res?.data?.status === "1") {
      setData(res?.data);
      success_toaster("filter applied");
      setSelected("");
      onClose();
    }
  };

  const orderData = () => {
    const filteredData = data?.data?.orders?.filter((dat) => {
      return (
        search === "" ||
        (dat?.id && dat?.id.toString().includes(search.toLowerCase())) ||
        (dat?.orderNum &&
          dat?.orderNum.toString().includes(search.toLowerCase())) ||
        (dat?.restaurant?.businessName &&
          dat?.restaurant?.businessName
            .toLowerCase()
            .includes(search.toLowerCase())) ||
        (dat?.user?.userName &&
          dat?.user?.userName.toLowerCase().includes(search.toLowerCase())) ||
        (dat?.orderCharge &&
          dat?.orderCharge?.id
            ?.toString()
            ?.toLowerCase()
            .includes(search.toLowerCase())) ||
        (dat?.orderStatus &&
          dat?.orderStatus?.name
            ?.toLowerCase()
            .includes(search.toLowerCase())) ||
        (dat?.deliveryType &&
          dat?.deliveryType?.name
            ?.toLowerCase()
            .includes(search.toLowerCase())) ||
        (dat?.orderMode &&
          dat?.orderMode?.name?.toLowerCase().includes(search.toLowerCase())) ||
        (dat?.orderType &&
          dat?.orderType?.type?.toLowerCase().includes(search.toLowerCase()))
      );
    });
    return filteredData;
  };

  const viewDetails = (orderId) => {
    navigate(`/restaurant/order-details/${orderId}`);
  };

  const columns = [
    { field: "sn", header: t("serialNo") },
    { field: "id", header: t("id") },
    { field: "orderNum", header: t("orderNumber") },
    { field: "storeName", header: t("storeName") },
    { field: "customerInfo", header: t("customerInfo") },
    { field: "driverEarnings", header: t("driverEarnings") },
    { field: "storeEarnings", header: t("storeEarnings") },
    { field: "discount", header: t("discount") },
    { field: "deliveryFees", header: t("deliveryFees") },
    { field: "serviceFees", header: t("serviceFees") },
    { field: "packingFees", header: t("packingFees") },
    { field: "commission", header: t("adminCommission") },
    { field: "orderMode", header: t("orderMode") },
    { field: "status", header: t("orderStatus") },
    { field: "action", header: t("action") },
  ];

  const datas = [];
  const csv = [];
  orderData()?.map((values, index) => {
    csv.push({
      sn: index + 1,
      id: values?.id,
      orderNum: values?.orderNum,
      storeName: values?.restaurant?.businessName,
      customerInfo: values?.user?.userName,
      storeEarnings: values?.orderCharge?.restaurantEarnings,
      driverEarnings: values?.orderCharge?.driverEarnings,
      restaurantEarnings: values?.orderCharge?.restaurantEarnings,
      discount: values?.orderCharge?.discount,
      deliveryFees: values?.orderCharge?.deliveryFees,
      serviceFees: values?.orderCharge?.serviceCharges,
      packingFees: values?.restaurant?.packingFee,
      commission: values?.orderCharge?.adminDeliveryCharges,
      orderMode: values?.orderMode?.name,
      status: values?.orderStatus?.name,
    });

    const currencyUnit =
      values?.restaurant?.zoneRestaurant?.zone?.zoneDetail?.currencyUnit
        ?.symbol;
    return datas.push({
      sn: index + 1,
      id: values?.id,
      orderNum: values?.orderNum,
      storeName: values?.restaurant?.businessName,
      customerInfo: values?.user?.userName,
      storeEarnings:
        currencyUnit + " " + values?.orderCharge?.restaurantEarnings,
      driverEarnings: currencyUnit + " " + values?.orderCharge?.driverEarnings,
      restaurantEarnings:
        currencyUnit + " " + values?.orderCharge?.restaurantEarnings,
      discount: currencyUnit + " " + values?.orderCharge?.discount,
      deliveryFees: currencyUnit + " " + values?.orderCharge?.deliveryFees,
      serviceFees: currencyUnit + " " + values?.orderCharge?.serviceCharges,
      packingFees: currencyUnit + " " + values?.restaurant?.packingFee,
      commission:
        currencyUnit + " " + values?.orderCharge?.adminDeliveryCharges,
      orderMode: values?.orderMode?.name,
      status: (
        <div>
          {values?.orderStatus?.name === "Delivered" ? (
            <div
              className="bg-[#21965314] text-themeGreen font-semibold p-2 rounded-md flex 
              justify-center"
            >
              {t("delivered")}
            </div>
          ) : values?.orderStatus?.name === "Cancelled" ? (
            <div
              className="bg-[#EE4A4A14] text-themeRed font-semibold p-2 rounded-md flex 
              justify-center"
            >
              {t("cancelled")}
            </div>
          ) : values?.orderStatus?.name === "Rejected" ? (
            <div
              className="bg-[#1860CC33] text-[#1860CC] font-semibold p-2 rounded-md flex 
              justify-center"
            >
              {t("rejected")}
            </div>
          ) : values?.orderStatus?.name === "Placed" ? (
            <div
              className="bg-[#faff7533] text-yellow-400 font-semibold p-2 rounded-md flex 
              justify-center"
            >
              {t("placed")}
            </div>
          ) : values?.orderStatus?.name === "Preparing" ? (
            <div
              className="bg-[#75caff33] text-[#75caff] font-semibold p-2 rounded-md flex 
              justify-center"
            >
              {t("preparing")}
            </div>
          ) : (
            <div
              className="bg-[#EC6C3033] text-[#EC6C30] font-semibold p-2 rounded-md flex 
              justify-center"
            >
              {t("scheduled")}
            </div>
          )}
        </div>
      ),
      action: (
        <div className="flex items-center gap-3">
          <EditButton
            text={t("viewDetails")}
            onClick={() => {
              viewDetails(values?.id);
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
                {t("allOrders")}
              </h2>

              <div className="flex gap-x-2">
                <div>
                  <Helment
                    search={true}
                    searchOnChange={(e) => setSearch(e.target.value)}
                    searchValue={search}
                    csvdata={csv}
                  />
                </div>

                <div
                  className="flex items-center gap-1 text-sm border bg-red-500 text-white rounded-md px-2 py-1.5 h-9 cursor-pointer"
                  onClick={onOpen}
                >
                  {t("Apply Filter")}
                </div>
              </div>
            </div>

            <div>
              <MyDataTable columns={columns} data={datas} />
            </div>
          </div>

          <Modal isOpen={isOpen} onClose={onClose} size={"4xl"} isCentered>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader padding={0}>
                <p className="font-normal pl-6 py-2 border-b-[1px] border-gray-400">
                  {t("Filters")}
                </p>
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody padding={4}>
                <div className="grid grid-cols-2 gap-x-5 gap-y-8 py-2 px-2 overflow-auto">
                  <div>
                    <h4>Country</h4>
                    <Select
                      placeholder="Select"
                      name="country"
                      options={countryOptions}
                      onChange={(e) => handleChange(e, "country")}
                      value={selected?.country}
                    />
                  </div>
                  <div>
                    <h4>City</h4>
                    <Select
                      placeholder="Select"
                      name="city"
                      options={cityOptions}
                      onChange={(e) => handleChange(e, "city")}
                      value={selected?.city}
                    />
                  </div>
                  <div>
                    <h4>Zone</h4>
                    <Select
                      placeholder="Select"
                      name="zones"
                      options={zonesOptions}
                      onChange={(e) => handleChange(e, "zones")}
                      value={selected?.zones}
                    />
                  </div>
                  {/* <div>
                              <h4>Business Type</h4>
                              <Select
                                placeholder="Select"
                                name="storeTypes"
                                options={[
                                  { value: 1, label: "Restaurant" },
                                  { value: 2, label: "Store" },
                                ]}
                                onChange={(e) => handleChange(e, "storeTypes")}
                                value={selected?.storeTypes}
                              />
                            </div> */}

                  <div>
                    <h4>From</h4>
                    <input
                      className="bg-[#f4f4f4] outline-none p-3 w-full rounded-md"
                      type="date"
                      onChange={(e) => handleChange(e.target.value, "from")}
                    />
                  </div>
                  <div>
                    <h4>To</h4>
                    <input
                      className="bg-[#f4f4f4] outline-none p-3 w-full rounded-md"
                      type="date"
                      onChange={(e) => handleChange(e.target.value, "to")}
                    />
                  </div>
                  <div>
                    <h4>Delivery by</h4>
                    <Select
                      placeholder="Select"
                      name="driverType"
                      options={[
                        { value: 1, label: "Restaurant" },
                        { value: 2, label: "Freelancer" },
                      ]}
                      onChange={(e) => handleChange(e, "driverType")}
                    />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter padding={4}>
                <div className="flex gap-2">
                  <BlackButton text={t("Clear filter")} onClick={()=>{handleCearFilter();onClose()}} />

                  <RedButton
                    text={t("Apply filter")}
                    onClick={() => {
                      handleSubmit();
                    }}
                  />
                </div>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </div>
      }
    />
  );
}
