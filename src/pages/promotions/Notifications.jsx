import React, { useState } from "react";
import { useTranslation } from "react-i18next"; // Import useTranslation
import Layout from "../../components/Layout";
import Helment from "../../components/Helment";
import RedButton, { BlackButton } from "../../utilities/Buttons";
import MyDataTable from "../../components/MyDataTable";
import GetAPI from "../../utilities/GetAPI";
import Loader, { MiniLoader } from "../../components/Loader";
import Select from "react-select";
import dayjs from "dayjs";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import {
  error_toaster,
  info_toaster,
  success_toaster,
} from "../../utilities/Toaster";
import { PostAPI } from "../../utilities/PostAPI";

export default function Notifications() {
  const { t } = useTranslation(); // Initialize useTranslation

  const { data, reFetch } = GetAPI("admin/getallpushnotifications");
  const [modal, setModal] = useState(false);
  const [loader, setLoader] = useState(false);
  const [search, setSearch] = useState("");
  const [addNotification, setAddNotification] = useState({
    to: "",
    title: "",
    body: "",
  });

  const notificationData = () => {
    const filteredData = data?.data?.filter((dat) => {
      return (
        search === "" ||
        (dat?.id && dat?.id.toString().includes(search.toLowerCase())) ||
        (dat?.to && dat?.to.toLowerCase().includes(search.toLowerCase()))
      );
    });
    return filteredData;
  };

  const openModal = () => {
    setModal(true);
  };

  const options = [
    { value: 1, label: t("All") },
    { value: 2, label: t("Retailer") },
    { value: 3, label: t("Driver") },
    { value: 4, label: t("Customer") },
  ];

  const addNewNotification = async () => {
    if (addNotification?.to === "") {
      info_toaster(t("Please Select User To Send Notification"));
    } else if (addNotification?.title === "") {
      info_toaster(t("Please Add Notification Title"));
    } else if (addNotification?.body === "") {
      info_toaster(t("Please Add Message"));
    } else {
      setLoader(true);
      const res = await PostAPI("admin/pushnotifications", {
        title: addNotification?.title,
        body: addNotification?.body,
        to: addNotification?.to,
      });
      if (res?.data?.status === "1") {
        reFetch();
        setLoader(false);
        setModal(false);
        success_toaster(res?.data?.message);
        setAddNotification({
          to: "",
          title: "",
          body: "",
        });
      } else {
        error_toaster(res?.data?.message);
        setLoader(false);
      }
    }
  };

  const columns = [
    { field: "sn", header: t("Serial. No") },
    { field: "id", header: t("Id") },
    { field: "to", header: t("To") },
    { field: "title", header: t("Title") },
    { field: "body", header: t("Body") },
    { field: "createdAt", header: t("Created At") },
  ];

  const datas = [];
  const csv = [];
  notificationData()?.map((values, index) => {
    csv.push({
      sn: index + 1,
      id: values?.id,
      to: values?.to,
      title: values?.title,
      body: values?.body,
      createdAt: values?.at,
    });
    return datas.push({
      sn: index + 1,
      id: values?.id,
      to: values?.to,
      title: values?.title,
      body: values?.body,
      createdAt: dayjs(values?.at).format("DD-MM-YYYY h:mm:ss A"),
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
                {t("All Notifications")}
              </h2>
              <div className="flex gap-2 items-center flex-wrap">
                <Helment
                  search={true}
                  searchOnChange={(e) => setSearch(e.target.value)}
                  searchValue={search}
                  csvdata={csv}
                />
                <div className="flex gap-2">
                  <RedButton text={t("Push New Notification")} onClick={openModal} />
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
                ) : (
                  <div className="space-y-5">
                    <div className="border-b-2 border-b-[#0000001F] text-lg font-norms font-medium">
                      {t("Create Notification")}
                    </div>

                    <div className="grid grid-cols-1 gap-5">
                      <div className="space-y-1">
                        <label
                          htmlFor="to"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Send To")}
                        </label>
                        <Select
                          placeholder={t("Select")}
                          name="to"
                          options={options}
                          onChange={(e) =>
                            setAddNotification({
                              ...addNotification,
                              to: e?.label,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <label
                          htmlFor="title"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Title")}
                        </label>
                        <input
                          type="text"
                          name="title"
                          id="title"
                          className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                          onChange={(e) =>
                            setAddNotification({
                              ...addNotification,
                              title: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="flex flex-col space-y-1">
                        <label
                          htmlFor="message"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Message")}
                        </label>
                        <textarea
                          name="body"
                          id="message"
                          cols="30"
                          rows="5"
                          placeholder={t("Write your message...")}
                          className="bg-themeInput p-3 rounded-md outline-none"
                          onChange={(e) =>
                            setAddNotification({
                              ...addNotification,
                              body: e.target.value,
                            })
                          }
                        ></textarea>
                      </div>
                    </div>

                    <div className="flex justify-end col-span-2 gap-2">
                      <BlackButton
                        text={t("Cancel")}
                        onClick={() => {
                          setModal(false);
                        }}
                      />
                      <RedButton text={t("Add")} onClick={addNewNotification} />
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
