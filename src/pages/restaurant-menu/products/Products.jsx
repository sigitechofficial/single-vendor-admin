import React, { useState } from "react";
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
import Loader from "../../../components/Loader";
import { BASE_URL } from "../../../utilities/URL";
import { useTranslation } from "react-i18next";

export default function Products() {
  const { data } = GetAPI("admin/allproducts");
  console.log("🚀 ~ Products ~ data:", data)
  const [modal, setModal] = useState(false);
  const [search, setSearch] = useState("");
  const { t } = useTranslation();
  const productData = () => {

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

  const columns = [
    { field: "sn", header: t('serialNo') },
    { field: "id", header: t('id') },
    {
      field: "image",
      header: t('image'),
    },
    {
      field: "name",
      header: t('name'),
    },
    {
      field: "restaurant",
      header: t('restaurant'),
    },
    {
      field: "menuCategory",
      header: t('menuCategory'),
    },
    {
      field: "addOn",
      header: t('Add On'),
    },
    {
      field: "price",
      header: t('price'),
    },
    {
      field: "attribute",
      header: t('attribute'),
    },
    // {
    //   field: "action",
    //   header: t('action'),
    // },
  ];

  const datas = [];
  productData()?.map((values, index) => {

    return datas.push({
      sn: index + 1,
      id: values?.id,
      image: (
        <div>
          <img
            src={`${BASE_URL}${values?.image}`}
            alt={t('image')}
            className="w-24 h-24"
          />
        </div>
      ),
      name: values?.name,
      restaurant: values?.R_MCLink?.restaurant?.businessName,
      menuCategory: values?.R_MCLink?.menuCategory?.name,
      addOn: values?.productCollections?.map(item => item?.collection?.collectionAddons?.map(itm=>itm?.addOn?.name) + ","),
      price: values?.originalPrice,
      attribute:
        values?.isPopular || values?.isNew || values?.isRecommended ? (
          <div className="space-y-2">
            <div className="flex gap-2">
              <div
                className="bg-themeRed text-white text-xs font-semibold px-2 py-1 rounded-full flex 
              justify-center items-center"
              >
                {t('popular')}
              </div>
              <div
                className="bg-[#434445] text-white text-xs font-semibold px-2 py-1  rounded-full flex 
              justify-center items-center"
              >
                {t('new')}
              </div>
            </div>
            <div
              className="bg-[#92D48F] text-white text-xs font-semibold px-2 py-1  rounded-full flex 
              justify-center items-centerz"
            >
              {t('recommended')}
            </div>
          </div>
        ) : (
          <></>
        ),
      // action: <EditButton text="View Details" />,
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
                {t('allProducts')}
              </h2>
              <div className="flex gap-2 items-center flex-wrap">
                <Helment
                  search={true}
                  searchOnChange={(e) => setSearch(e.target.value)}
                  searchValue={search}
                  csvdata={datas}
                />
                <div className="flex gap-2">
                  {/* <RedButton text="Add New Product" onClick={openModal} /> */}
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
                      name="firtName"
                      id="firtName"
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
                    text="Cancel"
                    onClick={() => {
                      setModal(false);
                    }}
                  />

                  <RedButton text="Add" />
                </div>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </div>
      }
    />
  );
}
