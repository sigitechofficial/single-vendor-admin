import React, { useMemo, useState } from "react";
import Layout from "../../components/Layout";
import Helment from "../../components/Helment";
import RedButton, { BlackButton } from "../../utilities/Buttons";
import { useTranslation } from "react-i18next";
import MyDataTable from "../../components/MyDataTable";
import { LiaFilterSolid } from "react-icons/lia";
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
import Select from "react-select";
import GetAPI from "../../utilities/GetAPI";
import { PostAPI } from "../../utilities/PostAPI";
import { BiImageAdd } from "react-icons/bi";
import { info_toaster, success_toaster } from "../../utilities/Toaster";
import Loader, { MiniLoader } from "../../components/Loader";
import { BASE_URL } from "../../utilities/URL";
import Switch from "react-switch";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import localizedFormat from "dayjs/plugin/localizedFormat";
import utc from "dayjs/plugin/utc";
dayjs.extend(localizedFormat);
dayjs.extend(timezone);
dayjs.extend(utc);

const Banners = () => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data, reFetch } = GetAPI("admin/getBanners");
  const filterOptions = GetAPI("admin/filterOptions");
  const [modType, setModType] = useState("filter");
  const [search, setSearch] = useState("");
  const [loader, setLoader] = useState(false);
  const [banner, setBanner] = useState({
    title: "",
    businessType: "",
    type: "",
    from: "",
    to: "",
    city: "",
    dimension: "",
    bannerType: "",
    image: null,
    bannerId: "",
    description: "",
  });
  console.log("🚀 ~ Banners ~ banner:", banner);

  const filterData = () => {
    const query = search?.trim().toLowerCase() || "";
    const filteredData = data?.data?.bannerData?.filter((item) => {
      return (
        item?.id?.toString()?.includes(query) ||
        item?.title?.trim()?.toLowerCase()?.includes(query) ||
        item?.cityId?.toString()?.includes(query) ||
        item?.dimension?.includes(query) ||
        item?.type?.includes(query) ||
        item?.businessType?.toString()?.includes(query)
      );
    });

    return filteredData;
  };

  const cityOptions = useMemo(() => {
    if (!filterOptions) return [];

    return (
      filterOptions?.data?.data?.city?.map((el) => ({
        value: el?.id,
        label: el?.name,
      })) || []
    );
  }, [filterOptions]);

  var columns = [
    { field: "srNo", header: "Serial No" },
    { field: "banner", header: "Banner" },
    { field: "title", header: "Title" },
    {
      field: "businessType",
      header: "Business Type",
    },
    {
      field: "type",
      header: "Type",
    },
    {
      field: "dimension",
      header: "Dimension",
    },
    {
      field: "startDate",
      header: "Start Date",
    },
    {
      field: "endDate",
      header: "End Date",
    },
    {
      field: "status",
      header: "Status",
    },
    {
      field: "action",
      header: "Action",
    },
  ];

  var datas = [];
  filterData()?.forEach((values, index) => {
    datas.push({
      srNo: index + 1,
      banner: (
        <img
          className="w-32 h-32 object-cover"
          src={BASE_URL + values.image}
          alt="banner image"
        />
      ),
      title: values.title,
      businessType: values?.businessType === 1 ? "Restaurant" : "Store",
      startDate:
        values?.startDate &&
        dayjs(values?.startDate).local().format("DD-MM-YYYY H:mm:ss"),
      endDate:
        values?.endDate &&
        dayjs(values?.endDate).local().format("DD-MM-YYYY H:mm:ss"),
      dimension: values?.dimension,
      type: values.type,
      status: (
        <label>
          <Switch
            onChange={() => {
              handleStatusChange(values?.id, values?.status);
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
      ),
      action: (
        <div className="flex gap-x-2">
          <FaRegEdit
            size={25}
            className="cursor-pointer text-orange-600"
            onClick={() => {
              setModType("update");
              setBanner({
                ...banner,
                title: values?.title,
                businessType: values?.businessType,
                bannerType: values?.type,
                from: values?.startDate,
                to: values?.endDate,
                city: values?.cityId,
                dimension: values?.dimension,
                bannerType: values?.type,
                image: values?.image,
                bannerId: values?.id,
                description: values?.description,
              });
              onOpen();
            }}
          />
          <RiDeleteBin6Line
            size={27}
            className="cursor-pointer text-red-500"
            onClick={() => {
              setBanner({ bannerId: values?.id });
              setModType("delete");
              onOpen();
            }}
          />
        </div>
      ),
    });
  });

  const handleChange = (e, type) => {
    setBanner({
      ...banner,
      [type]: e,
    });
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file && type === "image") {
      const imageUrl = URL.createObjectURL(file);
      setBanner({
        ...banner,
        image: file,
        imageShow: imageUrl,
      });
    }
  };

  const handleCreateBanner = async () => {
    const startDate = new Date(banner.from);
    const endDate = new Date(banner.to);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to midnight to compare only the date

    if (!banner?.title?.trim()) {
      info_toaster("Please add banner title");
    } else if (!banner?.businessType?.value) {
      info_toaster("Business Type is required.");
    } else if (!banner?.bannerType?.label) {
      info_toaster("Banner Type is required.");
    } else if (!banner?.from) {
      info_toaster("Start Date is required.");
    } else if (!banner?.to) {
      info_toaster("End Date is required.");
    } else if (!banner?.city?.value) {
      info_toaster("City is required.");
    } else if (!banner?.dimension?.label) {
      info_toaster("Dimension is required.");
    } else if (!banner?.image) {
      info_toaster("Image is required.");
    } else if (startDate < today) {
      info_toaster("Start Date cannot be earlier than today.");
    } else if (startDate > endDate) {
      info_toaster("Start Date cannot be after End Date.");
    } else if (endDate < startDate) {
      info_toaster("End Date cannot be before Start Date.");
    } else {
      setLoader(true);
      const formData = new FormData();
      formData.append("title", banner?.title);
      formData.append("businessType", banner.businessType?.value);
      formData.append("type", banner?.bannerType?.label?.toLowerCase());
      formData.append("startDate", banner?.from);
      formData.append("endDate", banner?.to);
      formData.append("cityId", banner?.city?.value);
      formData.append("dimension", banner?.dimension?.label?.toLowerCase());
      formData.append("image", banner?.image);

      let res = await PostAPI("admin/createBanner", formData);

      if (res?.data?.status === "1") {
        setLoader(false);
        onClose();
        reFetch();
        success_toaster(res?.data?.message);
      } else {
        setLoader(false);
        onClose();
        info_toaster(res?.data?.message || "Something went wrong");
      }
    }
  };

  const handleUpdateBanner = async () => {
    const startDate = new Date(banner.from);
    const endDate = new Date(banner.to);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to midnight to compare only the date

    if (!banner?.title?.trim()) {
      info_toaster("Please add banner title");
    } else if (!banner?.businessType) {
      info_toaster("Business Type is required.");
    } else if (!banner?.bannerType) {
      info_toaster("Banner Type is required.");
    } else if (!banner?.from) {
      info_toaster("Start Date is required.");
    } else if (!banner?.to) {
      info_toaster("End Date is required.");
    } else if (!banner?.city?.value) {
      info_toaster("City is required.");
    } else if (!banner?.dimension) {
      info_toaster("Dimension is required.");
    } else if (!banner?.image) {
      info_toaster("Image is required.");
    } else if (startDate < today) {
      info_toaster("Start Date cannot be earlier than today.");
    } else if (startDate > endDate) {
      info_toaster("Start Date cannot be after End Date.");
    } else if (endDate < startDate) {
      info_toaster("End Date cannot be before Start Date.");
    } else {
      setLoader(true);
      const formData = new FormData();
      formData.append("title", banner?.title);
      formData.append(
        "businessType",
        banner.businessType?.value
          ? banner.businessType?.value
          : banner.businessType
      );
      formData.append(
        "type",
        banner?.bannerType?.label
          ? banner?.bannerType?.label?.toLowerCase()
          : banner?.bannerType?.toLowerCase()
      );
      formData.append("startDate", banner?.from);
      formData.append("endDate", banner?.to);
      formData.append(
        "cityId",
        banner?.city?.value ? banner?.city?.value : banner?.city
      );
      formData.append(
        "dimension",
        banner?.dimension?.label
          ? banner?.dimension?.label?.toLowerCase()
          : banner?.dimension?.toLowerCase()
      );
      formData.append("image", banner?.image);
      formData.append("bannerId", banner?.bannerId);

      let res = await PostAPI("admin/updateBanner", formData);

      if (res?.data?.status === "1") {
        setLoader(false);
        handleClose();
        reFetch();
        success_toaster(res?.data?.message);
      } else {
        setLoader(false);
        handleClose();
        info_toaster(res?.data?.message || "Something went wrong");
      }
    }
  };

  const handleDelete = async () => {
    setLoader(true);
    let res = await PostAPI("admin/deleteBanner", {
      bannerId: banner?.bannerId,
    });

    if (res?.data?.status === "1") {
      handleClose();
      reFetch();
      setLoader(false);
      success_toaster(res?.data?.message);
    } else {
      info_toaster(res?.data?.message);
      setLoader(false);
    }
  };

  const handleStatusChange = async (bannerId, status) => {
    let res = await PostAPI("admin/changeStatusofBanner", {
      bannerId,
      status: status ? false : true,
    });

    if (res?.data?.status === "1") {
      reFetch();
      success_toaster("status changed");
    } else {
      info_toaster(res?.data?.message);
    }
  };
  const handleClose = () => {
    onClose();
    setBanner({
      title: "",
      businessType: "",
      type: "",
      from: "",
      to: "",
      city: "",
      dimension: "",
      bannerType: "",
      image: null,
      bannerId: "",
      description: "",
    });
    setModType("");
  };

  return data?.data?.status?.bannerData?.length === 0 ? (
    <Loader />
  ) : (
    <Layout
      content={
        <div className="p-5">
          <div className="bg-white rounded-lg p-5 min-h-screen">
            <div className="flex justify-between items-center flex-wrap gap-5">
              <h2 className="text-themeRed text-lg font-bold font-norms">
                {t("Banners")}
              </h2>
              <div className="flex gap-2 items-center flex-wrap">
                <Helment
                  search={true}
                  searchOnChange={(e) => setSearch(e.target.value)}
                  searchValue={search}
                  csvdata={[{ a: "s", c: "d" }]}
                />

                <div
                  className="flex items-center gap-1 text-sm border bg-red-500 text-white rounded-md px-2 py-1.5 h-9 cursor-pointer"
                  onClick={() => {
                    onOpen();
                    setModType("add banner");
                  }}
                >
                  {t("+ Add Banner")}
                </div>
              </div>
            </div>
            <div>
              <MyDataTable columns={columns} data={datas} />
            </div>
          </div>
          <Modal
            isOpen={isOpen}
            onClose={handleClose}
            size={modType === "delete" ? "lg" : "3xl"}
            isCentered
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader padding={0}>
                <h4 className="font-normal font-norms pl-4 py-2 border-gray-300 border-b-2">
                  {modType === "delete"
                    ? "Delete Banner"
                    : modType === "update"
                    ? "Update Banner"
                    : "Add Banner"}
                </h4>
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody padding={4}>
                {modType === "update" ? (
                  <div className="grid grid-cols-2 gap-x-3 p-5 space-y-5">
                    <div className="w-28 h-28 rounded-md bg-slate-100 shadow-md border-gray-200 border-[1px] col-span-2">
                      <label
                        className="h-full flex flex-col font-semibold justify-center items-center text-gray-600 cursor-pointer"
                        htmlFor="image"
                      >
                        {banner?.image ? (
                          <img
                            className="w-full h-full object-cover rounded"
                            src={banner?.imageShow || BASE_URL + banner?.image}
                            alt="image"
                          />
                        ) : (
                          <BiImageAdd size={40} />
                        )}
                      </label>
                      <input
                        className="bg-slate-100 outline-none py-4 px-3 w-full"
                        id="image"
                        name="image"
                        hidden
                        type="file"
                        onChange={(e) => {
                          handleImageChange(e, "image");
                        }}
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
                        className="bg-themeInput w-full h-[46px] px-3 rounded-md outline-none"
                        placeholder="title"
                        value={banner?.title}
                        onChange={(e) => handleChange(e.target.value, "title")}
                      />
                    </div>
                    <div className="space-y-1">
                      <label
                        htmlFor="bannerType"
                        className="text-black font-switzer font-semibold"
                      >
                        {t("Banner Type")}
                      </label>
                      <Select
                        // styles={customStyles}
                        placeholder="Banner Type"
                        name="bannerType"
                        id="bannerType"
                        options={[
                          { value: "1", label: "Web" },
                          { value: "2", label: "Mobile" },
                        ]}
                        onChange={(e) => handleChange(e, "bannerType")}
                        value={
                          banner?.bannerType?.value
                            ? banner?.bannerType
                            : banner?.bannerType == "1"
                            ? { value: "1", label: "Web" }
                            : banner?.bannerType == "2"
                            ? { value: "2", label: "Mobile" }
                            : banner?.bannerType === "web"
                            ? { value: "1", label: "Web" }
                            : banner?.bannerType === "mobile"
                            ? { value: "2", label: "Mobile" }
                            : ""
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <label
                        htmlFor="bannerType"
                        className="text-black font-switzer font-semibold"
                      >
                        {t("Business Type")}
                      </label>
                      <Select
                        // styles={customStyles}
                        placeholder="Business Type"
                        name="businessType"
                        id="businessType"
                        options={[
                          { value: "1", label: "Restaurant" },
                          { value: "3", label: "Store" },
                        ]}
                        onChange={(e) => handleChange(e, "businessType")}
                        value={
                          banner?.businessType?.value
                            ? banner?.businessType
                            : banner?.businessType == "1"
                            ? { value: "1", label: "Restaurant" }
                            : { value: "3", label: "Store" }
                        }
                      />
                    </div>

                    <div className="space-y-1">
                      <label
                        htmlFor="city"
                        className="text-black font-switzer font-semibold"
                      >
                        {t("City")}
                      </label>
                      <Select
                        // styles={customStyles}
                        placeholder="Select city"
                        name="city"
                        id="city"
                        options={cityOptions}
                        onChange={(e) => handleChange(e, "city")}
                        value={
                          banner?.city?.value
                            ? banner?.city
                            : cityOptions?.find(
                                (item) => item?.value === banner?.city
                              )
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <label
                        htmlFor="dimension"
                        className="text-black font-switzer font-semibold"
                      >
                        {t("Dimention")}
                      </label>
                      <Select
                        // styles={customStyles}
                        placeholder="Select Dimension"
                        name="dimension"
                        id="dimension"
                        options={[
                          { value: "1", label: "Landscape" },
                          { value: "2", label: "Portrait" },
                        ]}
                        onChange={(e) => handleChange(e, "dimension")}
                        value={
                          banner?.dimension?.value
                            ? banner?.dimension
                            : banner?.dimension === "landscape"
                            ? { value: "1", label: "Landscape" }
                            : { value: "2", label: "Portrait" }
                        }
                      />
                    </div>

                    <div>
                      <h4 className="text-black font-switzer font-semibold">
                        From
                      </h4>
                      <input
                        className="bg-[#f4f4f4] outline-none p-3 w-full rounded-md"
                        type="date"
                        onChange={(e) => handleChange(e.target.value, "from")}
                        value={banner?.from?.substring(0, 10)}
                      />
                    </div>
                    <div>
                      <h4 className="text-black font-switzer font-semibold">
                        To
                      </h4>
                      <input
                        className="bg-[#f4f4f4] outline-none p-3 w-full rounded-md"
                        type="date"
                        onChange={(e) => handleChange(e.target.value, "to")}
                        value={banner?.to?.substring(0, 10)}
                      />
                    </div>

                    <div>
                      <div className="space-y-1">
                        <label
                          htmlFor="description"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Description")}
                        </label>
                        <input
                          type="text"
                          name="description"
                          id="description"
                          className="bg-themeInput w-full h-[46px] px-3 rounded-md outline-none"
                          placeholder="description"
                          value={banner?.description}
                          onChange={(e) =>
                            handleChange(e.target.value, "description")
                          }
                        />
                      </div>
                    </div>
                  </div>
                ) : modType === "add banner" ? (
                  <>
                    {!loader ? (
                      <div className="grid grid-cols-2 gap-x-3 p-5 space-y-5">
                        <div className="w-28 h-28 rounded-md bg-slate-100 shadow-md border-gray-200 border-[1px] col-span-2">
                          <label
                            className="h-full flex flex-col font-semibold justify-center items-center text-gray-600 cursor-pointer"
                            htmlFor="image"
                          >
                            {banner?.image ? (
                              <img
                                className="w-full h-full object-cover rounded"
                                src={banner?.imageShow}
                                alt="image"
                              />
                            ) : (
                              <BiImageAdd size={40} />
                            )}
                          </label>
                          <input
                            className="bg-slate-100 outline-none py-4 px-3 w-full"
                            id="image"
                            name="image"
                            hidden
                            type="file"
                            onChange={(e) => {
                              handleImageChange(e, "image");
                            }}
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
                            className="bg-themeInput w-full h-[46px] px-3 rounded-md outline-none"
                            placeholder="title"
                            onChange={(e) =>
                              handleChange(e.target.value, "title")
                            }
                          />
                        </div>
                        <div className="space-y-1">
                          <label
                            htmlFor="bannerType"
                            className="text-black font-switzer font-semibold"
                          >
                            {t("Banner Type")}
                          </label>
                          <Select
                            // styles={customStyles}
                            placeholder="Banner Type"
                            name="bannerType"
                            id="bannerType"
                            options={[
                              { value: "1", label: "Web" },
                              { value: "2", label: "Mobile" },
                            ]}
                            onChange={(e) => handleChange(e, "bannerType")}
                            // value={zoneData?.zone}
                          />
                        </div>
                        <div className="space-y-1">
                          <label
                            htmlFor="bannerType"
                            className="text-black font-switzer font-semibold"
                          >
                            {t("Business Type")}
                          </label>
                          <Select
                            // styles={customStyles}
                            placeholder="Business Type"
                            name="businessType"
                            id="businessType"
                            options={[
                              { value: "1", label: "Restaurant" },
                              { value: "3", label: "Store" },
                            ]}
                            onChange={(e) => handleChange(e, "businessType")}
                            // value={zoneData?.zone}
                          />
                        </div>

                        <div className="space-y-1">
                          <label
                            htmlFor="city"
                            className="text-black font-switzer font-semibold"
                          >
                            {t("City")}
                          </label>
                          <Select
                            // styles={customStyles}
                            placeholder="Select city"
                            name="city"
                            id="city"
                            options={cityOptions}
                            onChange={(e) => handleChange(e, "city")}
                            // value={zoneData?.zone}
                          />
                        </div>
                        <div className="space-y-1">
                          <label
                            htmlFor="dimension"
                            className="text-black font-switzer font-semibold"
                          >
                            {t("Dimention")}
                          </label>
                          <Select
                            // styles={customStyles}
                            placeholder="Select Dimension"
                            name="dimension"
                            id="dimension"
                            options={[
                              { value: "1", label: "Landscape" },
                              { value: "2", label: "Portrait" },
                            ]}
                            onChange={(e) => handleChange(e, "dimension")}
                            // value={zoneData?.zone}
                          />
                        </div>

                        <div>
                          <h4 className="text-black font-switzer font-semibold">
                            From
                          </h4>
                          <input
                            className="bg-[#f4f4f4] outline-none p-3 w-full rounded-md"
                            type="date"
                            // onChange={(e) => { setSelected({ ...selected, from: e?.target?.value }); }}
                            onChange={(e) =>
                              handleChange(e.target.value, "from")
                            }
                          />
                        </div>
                        <div>
                          <h4 className="text-black font-switzer font-semibold">
                            To
                          </h4>
                          <input
                            className="bg-[#f4f4f4] outline-none p-3 w-full rounded-md"
                            type="date"
                            // onChange={(e) => { setSelected({ ...selected, to: e?.target?.value });}}
                            onChange={(e) => handleChange(e.target.value, "to")}
                          />
                        </div>

                        <div>
                          <div className="space-y-1">
                            <label
                              htmlFor="description"
                              className="text-black font-switzer font-semibold"
                            >
                              {t("Description")}
                            </label>
                            <input
                              type="text"
                              name="description"
                              id="description"
                              className="bg-themeInput w-full h-[46px] px-3 rounded-md outline-none"
                              placeholder="description"
                              value={banner?.description}
                              onChange={(e) =>
                                handleChange(e.target.value, "description")
                              }
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-[50vh] w-full">
                        <MiniLoader />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="space-y-5 p-5 flex flex-col items-center font-norms font-semibold text-xl">
                    <div>
                      <img src="/images/npswitch.svg" alt="npswitch" />
                    </div>
                    <p className="w-[80%] text-center">
                      Are you sure you want to delete this banner?
                    </p>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <div className="flex">
                  <BlackButton text="Cancel" onClick={handleClose} />
                  <RedButton
                    text={
                      modType === "add banner"
                        ? "Confirm"
                        : modType === "update"
                        ? "Update"
                        : "Delete"
                    }
                    onClick={() => {
                      modType === "add banner"
                        ? handleCreateBanner()
                        : modType === "update"
                        ? handleUpdateBanner()
                        : handleDelete();
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
};

export default Banners;
