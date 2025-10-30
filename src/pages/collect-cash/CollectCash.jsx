import React, { useState } from "react";
import Layout from "../../components/Layout";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import RedButton, { BlackButton } from "../../utilities/Buttons";
import Helment from "../../components/Helment";
import MyDataTable from "../../components/MyDataTable";
import { FaEye } from "react-icons/fa";
import { MiniLoader } from "../../components/Loader";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import GetAPI from "../../utilities/GetAPI";

const CollectCash = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [loader, setLoader] = useState(false);
  const { data } = GetAPI("admin/getCashCollections");

  const columns = [
    { field: "sn", header: t("SN") },
    { field: "collectFrom", header: t("Collect from") },
    { field: "type", header: t("Type") },
    { field: "receivedAt", header: t("Received At") },
    { field: "amount", header: t("Amount") },
    { field: "reference", header: t("Reference") },
    { field: "action", header: t("Action") },
  ];

  const datas = [
    {
      sn: 1,
      collectFrom: "John Doe",
      type: "Cash",
      receivedAt: "2025-04-14 10:30 AM",
      amount: 150.0,
      reference: "INV-00123",
      action: (
        <FaEye
          size={25}
          className="cursor-pointer hover:text-red-500"
          onClick={() => setModal(!modal)}
        />
      ),
    },
  ];

  return (
    <Layout
      content={
        <div className="bg-themeGray p-5">
          <div className="bg-white rounded-lg p-5">
            <div className="flex justify-between items-center flex-wrap gap-5">
              <h2 className="text-themeRed text-lg font-bold font-norms">
                <span className="text-2xl">💰</span>{" "}
                {t("Collect Cash transaction")}
              </h2>
            </div>

            <div className="grid grid-cols-3 gap-5 mt-10">
              <div className="space-y-1">
                <label
                  htmlFor="type"
                  className="text-black font-switzer font-semibold"
                >
                  {t("Collect From")}
                </label>
                <Select
                  placeholder="Select"
                  name="type"
                  //   options={options}
                  //   onChange={(e) =>
                  //     setAddVoucher({
                  //       ...addVoucher,
                  //       type: e?.label,
                  //     })
                  //   }
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="type"
                  className="text-black font-switzer font-semibold"
                >
                  {t("Store")}
                </label>
                <Select
                  placeholder="Select"
                  name="type"
                  //   options={options}
                  //   onChange={(e) =>
                  //     setAddVoucher({
                  //       ...addVoucher,
                  //       type: e?.label,
                  //     })
                  //   }
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="type"
                  className="text-black font-switzer font-semibold"
                >
                  {t("Deliveryman")}
                </label>
                <Select
                  placeholder="Select"
                  name="type"
                  //   options={options}
                  //   onChange={(e) =>
                  //     setAddVoucher({
                  //       ...addVoucher,
                  //       type: e?.label,
                  //     })
                  //   }
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="PaymentMethod"
                  className="text-black font-switzer font-semibold"
                >
                  {t("Payment Method")}
                </label>
                <input
                  value={"PaymentMethod"}
                  type="text"
                  name="PaymentMethod"
                  id="PaymentMethod"
                  placeholder="Payment Method..."
                  className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="reference"
                  className="text-black font-switzer font-semibold"
                >
                  {t("Reference")}
                </label>
                <input
                  value={"Reference"}
                  type="text"
                  name="reference"
                  id="reference"
                  placeholder="Payment Method..."
                  className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="amount"
                  className="text-black font-switzer font-semibold"
                >
                  {t("Amount")}
                </label>
                <input
                  value={"Amount"}
                  type="text"
                  name="amount"
                  id="amount"
                  placeholder="Amount..."
                  className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-x-2 my-7">
              <BlackButton text="cancel" />
              <RedButton text="Collect cash" />
            </div>
            <div className="flex justify-between items-center flex-wrap gap-5">
              <h2 className="text-themeRed text-lg font-bold font-norms">
                {t("Transaction history")}
              </h2>
              <div className="flex gap-2 items-center flex-wrap">
                <Helment
                  search={true}
                  searchOnChange={(e) => setSearch(e.target.value)}
                  searchValue={search}
                  csvdata={[]}
                />
              </div>

              <div className="w-full">
                <MyDataTable data={datas} columns={columns} />
              </div>
            </div>
          </div>

          <Modal
            onClose={() => setModal(false)}
            isOpen={modal}
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
                  <div className="w-full space-y-4 my-8">
                    <h4 className="text-xl font-semibold text-center">
                      Account Transaction Information
                    </h4>
                    <div className="flex flex-col items-center">
                      <p>Method: ssl_commerz</p>
                      <p>Amount: $8768</p>
                      <p>Request time: 27 Nov 2023 12:43:pm</p>
                      <p>Reference: Deliveryman collect cash payments</p>
                    </div>

                    <div className="flex flex-col items-center">
                      <h4 className="text-lg font-semibold">
                        DeliveryMan Info
                      </h4>
                      <p>Name: Jhon Doe</p>
                      <p>Phone: 98786887</p>
                      <p>Address: R9PG+XCH, Dhaka District, BD</p>
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
};

export default CollectCash;
