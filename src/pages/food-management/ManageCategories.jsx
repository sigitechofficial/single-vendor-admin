import { useState } from "react";
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
import "react-phone-input-2/lib/style.css";
import GetAPI from "../../utilities/GetAPI";
import { PutAPI } from "../../utilities/PutAPI";
import { PostAPI } from "../../utilities/PostAPI";
import Loader from "../../components/Loader";
import Switch from "react-switch";
import { toast } from "react-toastify";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import EmojiPicker from "emoji-picker-react";
import { BiImageAdd } from "react-icons/bi";
import Select from "react-select";
import { BASE_URL } from "../../utilities/URL";

const ManageCategories = () => {
  const { t } = useTranslation();
  const { data, reFetch } = GetAPI("admin/getAllMenuCategories");
  const [modal, setModal] = useState(false);
  const [modType, setModType] = useState("add");
  const [search, setSearch] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [emoji, setEmoji] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [menuCategory, setMenuCategory] = useState({});
  const [hasSubCategories, setHasSubCategories] = useState(false);
  const [subCategories, setSubCategories] = useState([]);
  const [newSubCategory, setNewSubCategory] = useState("");
  console.log("🚀 ~ ManageCategories ~ menuCategory:", menuCategory);

  const onEmojiClick = (event) => {
    if (event.emoji) {
      setEmoji(event.emoji);
      setShowPicker(false);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addSubCategory = () => {
    if (newSubCategory.trim() && !subCategories.includes(newSubCategory.trim())) {
      setSubCategories([...subCategories, newSubCategory.trim()]);
      setNewSubCategory("");
    }
  };

  const removeSubCategory = (index) => {
    setSubCategories(subCategories.filter((_, i) => i !== index));
  };

  const handleSubCategoryKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSubCategory();
    }
  };

  const resetModalState = () => {
    setMenuCategory({ businessType: "restaurant" }); // Default to restaurant
    setEmoji("");
    setSelectedImage(null);
    setImagePreview("");
    setShowPicker(false);
    setHasSubCategories(false);
    setSubCategories([]);
    setNewSubCategory("");
  };
  const restList = [];
  const getRest = GetAPI(
    `admin/getallrestaurants/${menuCategory?.businessType || ""}`
  );

  if (getRest?.data?.data && Array.isArray(getRest?.data?.data)) {
    getRest?.data?.data?.map((el) => {
      restList.push({
        value: el.id,
        label: el.businessName,
      });
    });
  }

  const addOnCollectionData = () => {
    const filteredData = data?.data?.filter((dat) => {
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
    const res = await PutAPI("admin/changestatusmenucategory", details);
    if (res.data.status === "1") {
      reFetch("admin/addOnCategoryRest");
      toast.success(res.data.message);
    } else {
      toast.error(res.data.message);
    }
  };

  const columns = [
    { field: "sn", header: t("serialNo") },
    { field: "image", header: t("Image") },
    { field: "categoryName", header: t("Category Name") },
    { field: "resName", header: t("restaurantName") },
    { field: "status", header: t("status") },
    { field: "action", header: t("Action") },
  ];

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
      image: values?.businessType === "store" && values?.image ? (
        <img

          src={BASE_URL + values?.image}
          alt="Category"
          className="w-8 h-8 object-cover rounded"
        />
      ) : (
        <span className="text-2xl">😋</span>
      ),
      categoryName: values?.name,
      name: values?.name,
      resName: values?.RestaurantName,
      action: (
        <div className="flex gap-x-2">
          <FaRegEdit
            size={25}
            className="cursor-pointer text-black"
            onClick={() => {
              setEmoji(values?.name.slice(-2));
              setMenuCategory({
                ...menuCategory,
                name: values?.name,
                id: values?.id,
              });
              setModType("update");
              setModal(true);
            }}
          />
          <RiDeleteBin6Line
            size={27}
            className="cursor-pointer text-red-500"
            onClick={() => {
              setMenuCategory({
                ...menuCategory,
                RMCLink: values?.RMCLink,
                menuCategoryId: values?.id,
              });
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

  const handleAdd = async () => {
    // Validation
    if (!menuCategory?.categoryName) {
      toast.error("Please enter category name");
      return;
    }

    const businessType = menuCategory?.businessType || "restaurant";

    if (businessType === "restaurant" && !emoji) {
      toast.error("Please select an emoji for restaurant");
      return;
    }
    if (businessType === "store" && !selectedImage) {
      toast.error("Please upload an image for store");
      return;
    }
    if (businessType === "store" && hasSubCategories && subCategories.length === 0) {
      toast.error("Please add at least one sub-category");
      return;
    }
    if (!menuCategory?.restaurantId) {
      toast.error("Please select a business");
      return;
    }

    const categoryName =
      businessType === "restaurant"
        ? menuCategory?.categoryName + " " + emoji
        : menuCategory?.categoryName;

    // Create FormData for file upload
    const formData = new FormData();
    formData.append("name", categoryName);
    formData.append("businessType", businessType);
    formData.append("restaurantId", menuCategory?.restaurantId);

    // Add sub-categories if enabled for store
    if (businessType === "store" && hasSubCategories && subCategories.length > 0) {
      // Send sub-categories as JSON string
      formData.append("subCategories", JSON.stringify(subCategories));

      // Also send individual sub-categories for backend processing
      subCategories.forEach((subCat, index) => {
        formData.append(`subCategory_${index}`, subCat);
      });

      // Send the count of sub-categories
      formData.append("subCategoryCount", subCategories.length.toString());
    }

    if (businessType === "store" && selectedImage) {
      formData.append("image", selectedImage);

      // Console log the image file details
      console.log("🖼️ Image file being sent to backend:");
      console.log("📄 File name:", selectedImage.name);
      console.log("📦 File size:", selectedImage.size, "bytes");
      console.log("🏷️ File type:", selectedImage.type);
      console.log("📅 Last modified:", new Date(selectedImage.lastModified).toLocaleString());
      console.log("📋 Full file object:", selectedImage);
    }

    // Console log all FormData contents
    console.log("📤 FormData being sent to backend:");
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}:`, `[File] ${value.name} (${value.size} bytes)`);
      } else {
        console.log(`${key}:`, value);
      }
    }

    let res = await PostAPI("admin/addCategory", formData);

    if (res?.data?.status === "1") {
      toast.success(res?.data?.message);
      reFetch();
      resetModalState();
      setModal(false);
    } else {
      toast.error(res?.data?.message);
    }
  };
  const handleUpdate = async () => {
    let res = await PostAPI("admin/editCategory", {
      categoryId: menuCategory.id,
      name: menuCategory.name + " " + emoji,
    });
    if (res?.data?.status === "1") {
      toast.success(res?.data?.message);
      reFetch();
      setMenuCategory({});
      setModal(false);
    } else {
      toast.error(res?.data?.message);
    }
  };

  // const handleStatusChange = async () => {
  //   let res = await PostAPI("admin/removeCategory", {
  //     id: menuCategory.id,
  //     restId: menuCategory.RestaurantId,
  //   });

  //   if (res?.data?.status === "1") {
  //     toast.success(res?.data?.message);
  //     reFetch();
  //     setMenuCategory({});
  //     setModal(false);
  //   } else {
  //     toast.error(res?.data?.message);
  //   }
  // };

  const handleDelete = async () => {
    // deleteMenuCategory

    let res = await PostAPI("admin/deleteMenuCategory", {
      menuCategoryId: menuCategory?.menuCategoryId,
      RMCLink: menuCategory?.RMCLink,
    });

    if (res?.data?.status === "1") {
      toast.success(res?.data?.message);
      reFetch();
      setMenuCategory({});
      setModal(false);
    } else {
      toast.error(res?.data?.message);
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
                {t("Menu Category")}
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
                    resetModalState();
                    setModal(true);
                  }}
                  className="flex border items-center text-sm rounded-md px-2 py-1.5 h-9 bg-red-500 text-white hover:bg-white hover:border-black hover:text-black duration-100 cursor-pointer"
                >
                  {t("Add New Category")}
                </div>
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
                    {t("Add Menu Category")}
                  </div>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody padding={4}>
                  <div className="p-5 space-y-5">
                    {/* Step 1: Category Name */}
                    <div className="space-y-1">
                      <label
                        htmlFor="categoryName"
                        className="text-black font-switzer font-semibold"
                      >
                        {t("Category Name")}{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="categoryName"
                        id="categoryName"
                        className="bg-themeInput w-full h-[46px] px-3 rounded-md outline-none"
                        placeholder="Enter category name"
                        value={menuCategory?.categoryName || ""}
                        onChange={(e) =>
                          setMenuCategory({
                            ...menuCategory,
                            categoryName: e?.target?.value,
                          })
                        }
                      />
                    </div>

                    {/* Step 2: Business Type */}
                    <div className="space-y-1">
                      <label
                        htmlFor="restaurant"
                        className="text-black font-switzer font-semibold"
                      >
                        {t("Business Type")}{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <Select
                        placeholder="Select Business Type"
                        name="businessType"
                        id="businessType"
                        options={[
                          { value: "restaurant", label: "Restaurant" },
                          { value: "store", label: "Store" },
                        ]}
                        value={
                          menuCategory?.businessType
                            ? {
                              value: menuCategory.businessType,
                              label:
                                menuCategory.businessType === "restaurant"
                                  ? "Restaurant"
                                  : "Store",
                            }
                            : { value: "restaurant", label: "Restaurant" }
                        }
                        onChange={(e) => {
                          setMenuCategory({
                            ...menuCategory,
                            businessType: e?.value,
                          });
                          // Reset image/emoji and sub-categories when business type changes
                          setEmoji("");
                          setSelectedImage(null);
                          setImagePreview("");
                          setHasSubCategories(false);
                          setSubCategories([]);
                          setNewSubCategory("");
                        }}
                      />
                    </div>

                    {/* Step 3: Sub-categories Toggle - Only for Store */}
                    {menuCategory?.businessType === "store" && (
                      <div className="space-y-1">
                        <label className="text-black font-switzer font-semibold">
                          {t("Enable Sub-categories")}
                        </label>
                        <div className="flex items-center gap-3">
                          <Switch
                            onChange={(checked) => {
                              setHasSubCategories(checked);
                              // Clear sub-categories when toggle is turned off
                              if (!checked) {
                                setSubCategories([]);
                                setNewSubCategory("");
                              }
                            }}
                            checked={hasSubCategories}
                            uncheckedIcon={false}
                            checkedIcon={false}
                            onColor="#139013"
                            offColor="#d1d5db"
                            onHandleColor="#fff"
                            offHandleColor="#fff"
                            className="react-switch"
                            boxShadow="0 0 0 1px rgba(0,0,0,0.1)"
                            width={40}
                            height={20}
                            handleDiameter={16}
                          />
                          <span className="text-sm text-gray-600">
                            {hasSubCategories ? "Sub-categories enabled" : "Sub-categories disabled"}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Step 4: Sub-categories Input - Only for Store when enabled */}
                    {menuCategory?.businessType === "store" && hasSubCategories && (
                      <div className="space-y-1">
                        <label
                          htmlFor="subCategories"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Sub-categories")}
                        </label>
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              id="subCategories"
                              className="bg-themeInput w-full h-[46px] px-3 rounded-md outline-none"
                              placeholder="Enter sub-category name"
                              value={newSubCategory}
                              onChange={(e) => setNewSubCategory(e.target.value)}
                              onKeyPress={handleSubCategoryKeyPress}
                            />
                            <button
                              type="button"
                              onClick={addSubCategory}
                              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                            >
                              Add
                            </button>
                          </div>
                          {subCategories.length > 0 && (
                            <div className="space-y-1">
                              <label className="text-sm text-gray-600">Added sub-categories:</label>
                              <div className="flex flex-wrap gap-2">
                                {subCategories.map((subCat, index) => (
                                  <div
                                    key={index}
                                    className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2"
                                  >
                                    <span className="text-sm">{subCat}</span>
                                    <button
                                      type="button"
                                      onClick={() => removeSubCategory(index)}
                                      className="text-red-500 hover:text-red-700 text-sm"
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Step 5: Image/Emoji Upload - Show based on business type */}
                    {(menuCategory?.businessType || "restaurant") ===
                      "store" ? (
                      // Store - Image Upload
                      <div className="space-y-1 relative">
                        <label
                          htmlFor="imageUpload"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Upload Image")}{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-20 h-20 bg-gray-200 rounded-md flex justify-center items-center cursor-pointer border-2 border-dashed border-gray-300 hover:border-gray-400"
                            onClick={() =>
                              document.getElementById("imageUpload").click()
                            }
                          >
                            {imagePreview ? (
                              <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-full h-full object-cover rounded-md"
                              />
                            ) : (
                              <BiImageAdd className="text-2xl text-gray-500" />
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm text-gray-600">
                              Click to upload image
                            </span>
                            <span className="text-xs text-gray-400">
                              PNG, JPG up to 5MB
                            </span>
                          </div>
                        </div>
                        <input
                          type="file"
                          id="imageUpload"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </div>
                    ) : (
                      // Restaurant - Emoji Picker
                      <div className="space-y-1 relative">
                        <label
                          htmlFor="emoji"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Select Emoji")}{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-20 h-20 bg-gray-200 rounded-md flex justify-center items-center text-3xl cursor-pointer border-2 border-dashed border-gray-300 hover:border-gray-400"
                            onClick={() => setShowPicker(true)}
                          >
                            {emoji || (
                              <BiImageAdd className="text-2xl text-gray-500" />
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm text-gray-600">
                              Click to select emoji
                            </span>
                            <span className="text-xs text-gray-400">
                              Choose an emoji for your category
                            </span>
                          </div>
                        </div>
                        {showPicker && (
                          <div className="absolute top-0 left-0 z-10">
                            <EmojiPicker onEmojiClick={onEmojiClick} />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Step 6: Business Name */}
                    <div className="space-y-1">
                      <label
                        htmlFor="restaurantlist"
                        className="text-black font-switzer font-semibold"
                      >
                        {(menuCategory?.businessType || "restaurant") ===
                          "store"
                          ? t("Store Name")
                          : t("Restaurant Name")}{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <Select
                        placeholder={`Select ${(menuCategory?.businessType || "restaurant") ===
                          "store"
                          ? "Store"
                          : "Restaurant"
                          }`}
                        name="restaurantlist"
                        id="restaurantlist"
                        options={restList}
                        value={
                          menuCategory?.restaurantId
                            ? restList.find(
                              (option) =>
                                option.value === menuCategory.restaurantId
                            )
                            : null
                        }
                        onChange={(e) =>
                          setMenuCategory({
                            ...menuCategory,
                            restaurantId: e?.value,
                          })
                        }
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
                        resetModalState();
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
              size={"xl"}
              isCentered
            >
              <ModalOverlay />
              <ModalContent>
                <ModalHeader padding={0}>
                  <div className="border-b-2 border-b-[#0000001F] px-5 py-2.5 text-lg font-norms font-medium">
                    {t("Update Menu Category")}
                  </div>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody padding={4}>
                  <div className="grid grid-cols-1 gap-x-3 p-5 space-y-5">
                    <div className="col-span-2 space-y-1 relative">
                      <label
                        htmlFor="emoji"
                        className="text-black font-switzer font-semibold"
                      >
                        {t("Upload Emoji")}
                      </label>
                      <div
                        className="w-20 h-20 bg-gray-200 rounded-md flex justify-center items-center text-3xl cursor-pointer text-gray-600"
                        onClick={() => setShowPicker(true)}
                      >
                        {emoji || <BiImageAdd />}
                      </div>
                      {showPicker && (
                        <div className="absolute top-0 left-0 z-10">
                          {" "}
                          <EmojiPicker onEmojiClick={onEmojiClick} />
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <label
                        htmlFor="categoryName"
                        className="text-black font-switzer font-semibold"
                      >
                        {t("Category Name")}
                      </label>
                      <input
                        type="text"
                        name="categoryName"
                        id="categoryName"
                        className="bg-themeInput w-full h-[46px] px-3 rounded-md outline-none"
                        placeholder="Category name"
                        value={menuCategory?.name}
                        onChange={(e) =>
                          setMenuCategory({
                            ...menuCategory,
                            name: e?.target?.value,
                          })
                        }
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
                    <RedButton text={t("Confirm")} onClick={handleUpdate} />
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
                      onClick={handleDelete}
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

export default ManageCategories;
