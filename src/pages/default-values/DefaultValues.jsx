import React, { useState } from "react";
import Layout from "../../components/Layout";
import Helment from "../../components/Helment";
import MyDataTable from "../../components/MyDataTable";
import Loader, { MiniLoader } from "../../components/Loader";
import GetAPI from "../../utilities/GetAPI";
import RedButton, { BlackButton, EditButton } from "../../utilities/Buttons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { error_toaster, success_toaster } from "../../utilities/Toaster";
import { PostAPI } from "../../utilities/PostAPI";
import { useTranslation } from "react-i18next";

export default function DefaultValues() {
  const { data, reFetch } = GetAPI("admin/getAllDefaultValues");
  console.log("🚀 ~ DefaultValues ~ data:", data);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [loader, setLoader] = useState(false);
  const [updateValue, setUpdateValue] = useState({
    id: "",
    value: "",
  });
  const { t } = useTranslation();

  const orderData = () => {
    const filteredData = data?.data?.filter((dat) => {
      return (
        search === "" ||
        (dat?.id && dat?.id.toString().includes(search.toLowerCase())) ||
        (dat?.name && dat?.name.toLowerCase().includes(search.toLowerCase()))
      );
    });
    return filteredData;
  };

  const openModal = (type, id, value) => {
    setModalType(type);
    setModal(true);
    setUpdateValue({
      id: id,
      value: value,
    });
  };

  const update = async () => {
    setLoader(true);
    let res = await PostAPI("admin/updateDefaultValue", {
      id: updateValue?.id,
      value: updateValue?.value,
    });
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

  const columns = [
    { field: "sn", header: t("Serial. No") },
    { field: "id", header: t("Id") },
    {
      field: "title",
      header: t("Title"),
    },
    {
      field: "value",
      header: t("Value"),
    },
    {
      field: "action",
      header: t("Action"),
    },
  ];
  const datas = [];
  orderData()?.map((values, index) => {
    return datas.push({
      sn: index + 1,
      id: values?.id,
      title: values?.name,
      value: values?.value,
      action: (
        <div className="flex items-center gap-3">
          <EditButton
            text="Update"
            onClick={() => {
              openModal("Update Value", values?.id, values?.value);
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
                {t("All Default Values")}
              </h2>
              <div>
                <Helment
                  search={true}
                  searchOnChange={(e) => setSearch(e.target.value)}
                  searchValue={search}
                  csvdata={datas}
                />
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
                  <div className="h-[250px]">
                    <MiniLoader />
                  </div>
                ) : modalType === "Add New Value" ? (
                  <div className="space-y-5">
                    <div className="border-b-2 border-b-[#0000001F] text-black text-lg font-norms font-medium">
                      Add New Value
                    </div>
                    {/* <div className="grid grid-cols-1 gap-5">
                      <div className="space-y-1">
                        <label
                          htmlFor="name"
                          className="text-black font-switzer font-semibold"
                        >
                          Cuisine Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                          onChange={(e) =>
                            setAddCuisine({
                              ...addCuisine,
                              name: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <BlackButton
                        text="Cancle"
                        onClick={() => {
                          setModal(false);
                        }}
                      />

                      <RedButton text="Add" onClick={addNewCuisines} />
                    </div> */}
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div className="border-b-2 border-b-[#0000001F] text-black text-lg font-norms font-medium">
                      Update Value
                    </div>
                    <div className="grid grid-cols-1 gap-5">
                      <div className="space-y-1">
                        <label
                          htmlFor="value "
                          className="text-black font-switzer font-semibold"
                        >
                          Value
                        </label>
                        <input
                          type="number"
                          name="value "
                          id="value "
                          className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                          onChange={(e) =>
                            setUpdateValue({
                              ...updateValue,
                              value: e.target.value,
                            })
                          }
                          value={updateValue?.value}
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
