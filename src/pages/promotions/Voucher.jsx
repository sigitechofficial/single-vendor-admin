import React, { useState } from "react";
import Layout from "../../components/Layout";
import Helment from "../../components/Helment";
import RedButton, { BlackButton, EditButton } from "../../utilities/Buttons";
import MyDataTable from "../../components/MyDataTable";
import GetAPI from "../../utilities/GetAPI";
import Loader, { MiniLoader } from "../../components/Loader";
import Switch from "react-switch";
import dayjs from "dayjs";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
} from "@chakra-ui/react";
import {
  error_toaster,
  info_toaster,
  success_toaster,
} from "../../utilities/Toaster";
import { PostAPI } from "../../utilities/PostAPI";
import { PutAPI } from "../../utilities/PutAPI";

export default function Voucher() {

  const update = async () => {
  let store = [];
  updateVoucher?.storeApplicable.map((item) => store.push(item.value));
      const res = await PutAPI("admin/updatevoucher", {
        voucherId: updateVoucher?.voucherId,
        code: updateVoucher?.code,
        value: updateVoucher?.value,
        type: updateVoucher?.type?.label,
        from: updateVoucher?.from,
        to: updateVoucher?.to,
        storeApplicable: store,
        conditionalAmount: "2",
      });

      if (res?.data?.status === "1") {
        reFetch();
        setLoader(false);
        setModal(false);
        success_toaster(res?.data?.message);
      } else {
        error_toaster(res?.data?.message);
        setLoader(false);
      }
  };

  const updateStatus = async (id, status) => {
    let res = await PutAPI(`admin/changevoucherstatus`, {
      voucherId: id,
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
    { field: "code", header: t("Code") },
    { field: "discount", header: t("Discount") },
    { field: "conditionalAmount", header: t("Conditional Amount") },
    { field: "type", header: t("Type") },
    { field: "from", header: t("From") },
    { field: "to", header: t("To") },
    { field: "applicableStore", header: t("Applicable Store") },
    // { field: "associatedStore", header: t("Associated Store") },
    { field: "status", header: t("Status") },
    { field: "action", header: t("Action") },
  ];

  const datas = [];
  const csv = [];
  notificationData()?.map((values, index) => {
    csv.push({
      sn: index + 1,
      id: values?.id,
      code: values?.code,
      discount: values?.value ? values?.value : "0.00",
      conditionalAmount: values?.conditionalAmount,
      type: values?.type,
      // applicableStore: handleStoreApplicable(values?.storeApplicable, "get"),
      from: values?.from,
      to: values?.to,
      status: values?.status ? "Active" : "InActive",
      action: values?.status,
    });
    return datas.push({
      sn: index + 1,
      id: values?.id,
      code: values?.code,
      discount: values?.value ? values?.value : "0.00",
      conditionalAmount: values?.conditionalAmount
        ? values?.conditionalAmount
        : "0.00",
      type: values?.type,
      applicableStore: handleStoreApplicable(values?.storeApplicable, "get"),
      // associatedStore: (
      //   <p className="bg-blue-500 text-white px-4 py-1 rounded inline-block cursor-pointer  font-semibold ">
      //     {t("View")}
      //   </p>
      // ),
      from: dayjs(values?.from).format("DD-MM-YYYY h:mm:ss A"),
      to: dayjs(values?.to).format("DD-MM-YYYY h:mm:ss A"),
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
                "Update Voucher",
                values?.id,
                values?.code,
                values?.value,
                values?.from,
                values?.to,
                values?.storeApplicable,
                values?.type
              );
            }}
          />

          <RiDeleteBin6Line
            size={27}
            className="cursor-pointer text-red-500"
            onClick={() => {
              setDeleteModal(true);
              setSelectedVoucherId(values?.id);
            }}
          />
        </div>
      ),
    });
  });
  //   let zoneOptions = [];
  //   zonesList?.data?.forEach((z) => {
  //     zoneOptions.push({
  //       value: z?.zoneDetail?.zoneId,
  //       label: z?.name,
  //     });
  //   });
  let countryOptions = [];
  CountryList?.data?.countries?.forEach((country) => {
    if (country.status) {
      countryOptions.push({
        value: country.id,
        label: country.name.trim(), // trim to remove extra space like " Pakistan"
      });
    }
  });
  const cityOptions = Array.isArray(cities)
    ? cities
        .filter((city) => city.status)
        .map((city) => ({
          value: city.id,
          label: city.name.trim(),
        }))
    : [];
  const zoneOptions = Array.isArray(zones)
    ? zones.map((zone) => ({
        value: zone.id,
        label: zone.name.trim(),
      }))
    : [];

  return data?.length === 0 ? (
    <Loader />
  ) : (
    <Layout
      content={
        <div className="bg-themeGray p-5">
          <div className="bg-white rounded-lg p-5">
            <div className="flex justify-between items-center flex-wrap gap-5">
              <h2 className="text-themeRed text-lg font-bold font-norms">
                {t("All Vouchers")}
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
                    text={t("Add New Voucher")}
                    onClick={() => openModal("Add New Voucher")}
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
                  <div className="h-[450px]">
                    <MiniLoader />
                  </div>
                ) : modalType === "Add New Voucher" ? (
                  <div className="space-y-5">
                    <div className="border-b-2 border-b-[#0000001F] text-lg font-norms font-medium">
                      {t("Add Voucher")}
                    </div>
                    <div className="space-y-1">
                      <label
                        htmlFor="code"
                        className="text-black font-switzer font-semibold"
                      >
                        {t("Code")}
                      </label>
                      <input
                        value={addVoucher?.code}
                        type="text"
                        name="code"
                        id="code"
                        className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                        onChange={handleOnChange}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <div className="space-y-1">
                        <label
                          htmlFor="value"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Value")}
                        </label>
                        <input
                          value={addVoucher?.value}
                          type="number"
                          name="value"
                          id="value"
                          maxLength="3"
                          className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                          onChange={handleOnChange}
                        />
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor="type"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Flat")}
                        </label>
                        <Select
                          placeholder="Select"
                          name="type"
                          options={options}
                          onChange={(e) =>
                            setAddVoucher({
                              ...addVoucher,
                              type: e?.label,
                            })
                          }
                        />
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor="storeApplicable"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Select Country")}
                        </label>

                        <Select
                          value={countryOptions.find(
                            (opt) => opt.value === addVoucher.country
                          )}
                          placeholder="Select"
                          name="country"
                          options={countryOptions}
                          onChange={async (e) => {
                            const selectedCountryId = e?.value;

                            setAddVoucher((prev) => ({
                              ...prev,
                              country: selectedCountryId,
                              city: "", // optionally reset city
                            }));

                            await handleGetCitiesByCountry(selectedCountryId);
                          }}
                        />
                      </div>
                      <div className="space-y-1">
                        <label
                          htmlFor="storeApplicable"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Select City")}
                        </label>

                        <Select
                          value={cityOptions.find(
                            (opt) => opt.value === addVoucher.city
                          )}
                          placeholder="Select"
                          name="city"
                          options={cityOptions}
                          onChange={(e) => {
                            const selectedCityId = e?.value;

                            setAddVoucher((prev) => ({
                              ...prev,
                              city: selectedCityId,
                            }));

                            handleGetZoneByCity(selectedCityId);
                          }}
                        />
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor="storeApplicable"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Business Type")}
                        </label>
                        <Select
                          value={businessTypeOptions.find(
                            (opt) => opt.value === addVoucher.businessType
                          )}
                          placeholder="Select"
                          name="businessType"
                          options={businessTypeOptions}
                          onChange={(e) => {
                            setAddVoucher((prev) => ({
                              ...prev,
                              businessType: e?.value,
                            }));
                          }}
                        />
                      </div>
                      <div className="space-y-1">
                        <label
                          htmlFor="storeApplicable"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Select Zone")}
                        </label>
                        <Select
                          value={zoneOptions.find(
                            (opt) => opt.value === addVoucher.zone
                          )}
                          placeholder="Select"
                          name="zone"
                          options={zoneOptions}
                          onChange={(e) => {
                            setAddVoucher((prev) => ({
                              ...prev,
                              zone: e?.value,
                            }));
                            fetchRestaurants(e?.value);
                          }}
                        />
                      </div>
                      <div className="space-y-1">
                        <label
                          htmlFor="storeApplicable"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Select Restaurant")}
                        </label>
                        <Select
                          value={addVoucher?.applicableStore}
                          placeholder="Select"
                          name="storeApplicable"
                          options={restList}
                          isMulti
                          onChange={handleSelectChange}
                        />
                      </div>
                      <div className="space-y-1">
                        <label
                          htmlFor="storeApplicable"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Usage")}
                        </label>
                        <input
                          value={addVoucher?.useage}
                          type="number"
                          name="useage"
                          id="useage"
                          maxLength="3"
                          className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                          onChange={handleOnChange}
                        />
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor="from"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("From")}
                        </label>
                        <input
                          value={addVoucher?.from}
                          type="datetime-local"
                          name="from"
                          id="from"
                          className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                          onChange={handleOnChange}
                        />
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor="to"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("To")}
                        </label>
                        <input
                          value={addVoucher?.to}
                          type="datetime-local"
                          name="to"
                          id="to"
                          className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                          onChange={handleOnChange}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end col-span-2 gap-2">
                      <BlackButton
                        text={t("Cancel")}
                        onClick={() => {
                          setModal(false);
                        }}
                      />
                      <RedButton text={t("Add")} onClick={addNewVocher} />
                    </div>
                  </div>
                ) : modalType === "Delete Voucher" ? (
                  <>helo</>
                ) : (
                  <div className="space-y-5">
                    <div className="border-b-2 border-b-[#0000001F] text-lg font-norms font-medium">
                      {t("Update Voucher")}
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                      <div className="space-y-1">
                        <label
                          htmlFor="code"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Code")}
                        </label>
                        <input
                          value={updateVoucher?.code}
                          type="text"
                          name="code"
                          id="code"
                          className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                          onChange={handleUpdateOnChange}
                        />
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor="value"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Value")}
                        </label>
                        <input
                          value={updateVoucher?.value}
                          type="number"
                          name="value"
                          id="value"
                          className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                          onChange={handleUpdateOnChange}
                        />
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor="type"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Flat")}
                        </label>
                        <Select
                          placeholder="Select"
                          value={updateVoucher?.type}
                          name="type"
                          options={options}
                          onChange={(e) =>
                            setUpdateVoucher({
                              ...updateVoucher,
                              type: options.find((el) => el.label === e?.label),
                            })
                          }
                        />
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor="storeApplicable"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Select Restaurant")}
                        </label>
                        <Select
                          placeholder="Select"
                          value={updateVoucher?.storeApplicable}
                          name="storeApplicable"
                          options={restaurantList}
                          isMulti
                          onChange={handleUpdateSelectChange}
                        />
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor="from"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("From")}
                        </label>
                        <input
                          value={updateVoucher?.from}
                          type="datetime-local"
                          name="from"
                          id="from"
                          className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                          onChange={handleUpdateOnChange}
                        />
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor="to"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("To")}
                        </label>
                        <input
                          value={updateVoucher?.to}
                          type="datetime-local"
                          name="to"
                          id="to"
                          className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                          onChange={handleUpdateOnChange}
                        />
                      </div>
                    </div>
                    {/* <button></button> */}

                    <div className="flex justify-end col-span-2 gap-2">
                      <BlackButton
                        text={t("Cancel")}
                        onClick={() => {
                          setModal(false);
                        }}
                      />
                      <RedButton text={t("update")} onClick={update} />
                    </div>
                  </div>
                )}
              </ModalBody>
            </ModalContent>
          </Modal>

          <Modal
            onClose={() => setDeleteModal(false)}
            isOpen={deleteModal}
            size={"lg"}
            isCentered
          >
            <ModalOverlay />
            <ModalContent>
              <ModalCloseButton />
              <ModalBody padding={4}>
                {loader ? (
                  <div className="h-[450px]">
                    <MiniLoader />
                  </div>
                ) : (
                  <div className="flex flex-col justify-center items-center gap-y-5">
                    <IoIosCloseCircleOutline size={100} color="red" />
                    <h4 className="mx-auto text-center text-3xl text-gray-500">
                      Are you sure?
                    </h4>
                    <p className="max-w-96 text-center text-gray-500 font-norms">
                      Do you really want to delete this admin?This process
                      cannot be undone.
                    </p>
                  </div>
                )}
              </ModalBody>

              <ModalFooter
                pb={4}
                px={6}
                className="sticky bottom-0 z-10 bg-white"
              >
                <div className="flex gap-1">
                  <BlackButton
                    text={t("cancel")}
                    onClick={() => {
                      setDeleteModal(false);
                    }}
                  />
                  <RedButton
                    text={t("Delete")}
                    onClick={() => {
                      deleteVoucher();
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
