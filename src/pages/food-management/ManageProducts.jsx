import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next"; // Import useTranslation
import Layout from "../../components/Layout";
import Helment from "../../components/Helment";
import RedButton, { BlackButton, EditButton } from "../../utilities/Buttons";
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
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import GetAPI from "../../utilities/GetAPI";
import { PostAPI } from "../../utilities/PostAPI";
import { PutAPI } from "../../utilities/PutAPI";
import Loader, { MiniLoader } from "../../components/Loader";
import { toast } from "react-toastify";
import { FaRegEdit, FaRegEye } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BiImageAdd } from "react-icons/bi";
import Select from "react-select";
import Switch from "react-switch";
import { useEffect } from "react";
import { BASE_URL } from "../../utilities/URL";
import CustomCheckbox from "../../components/CustomCheckbox";
import { IoIosInformationCircle } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { success_toaster } from "../../utilities/Toaster";

const ManageProducts = () => {
  const { t } = useTranslation();
  const { data, reFetch } = GetAPI("admin/allproducts");
  const [modal, setModal] = useState(false);
  const [modtype, setModType] = useState("add");
  const [search, setSearch] = useState("");
  const [addonListReady, setAddonListReady] = useState("");
  const [nutriModel, setNutriModel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalScroll, setModalScroll] = useState(0);
  const [addProduct, setAddProduct] = useState({
    image: "",
    imageUrl: "",
    productName: "",
    menuCategory: "",
    subCategory: "",
    restaurant: "",
    unitPrice: "",
    addonList: [],
    bannerImage: "",
    bannerUrl: "",
    description: "",
    RMCLinkId: "",
    weight: "",
    deliveryPrice: "",
    isAvailable: true,
    countryOfOrigin: "",
    ingredients: "",
    allergies: "",
    nutrients: "",
    energy: "",
    fat: "",
    saturated_fat: "",
    carbohydrates: "",
    sugar: "",
    protein: "",
    salt: "",
    qty: "",
    productTags: "",
    storageInstruction: "",
    producerInfo: "",
    additives: "",
    distributorInfo: "",
    feedingRecommendations: "",
    gttnNum: "",
    warningSafety: "",
    servingSize: "",
    fiber: "",
    nutrientType: "Per 100g",
    quantity: "",
    unitName: "",
    isUnlimited: true,
    nutritionModel: false,
  });

  const getTags = GetAPI("admin/getProductsData");
  //   const getRest = GetAPI("admin/getallrestaurants/restaurant");
  const getMenuCategory = GetAPI(
    addProduct?.restaurant?.value
      ? `retailer/getAllCategory/${addProduct?.restaurant?.value}`
      : ""
  );
  console.log("getMenuCategory", getMenuCategory);
  const getCollectionList = GetAPI(
    `admin/getAllAddOnCategories/${addProduct?.restaurant?.value}`
  );

  const getAllAddOns = GetAPI(
    `retailer/getAllAddOns/${addProduct?.restaurant?.value}`
  );

  const [businessType, setBusinessType] = useState("Restaurant");
  const restList = [];
  const getRest = GetAPI(`admin/getallrestaurants/${businessType}`);
  console.log("getRest", getRest);
  getRest?.data?.data?.map((el) => {
    restList.push({
      value: el.id,
      label: el.businessName,
    });
  });

  const menuCategoryList = useMemo(
    () =>
      getMenuCategory?.data?.data?.categories?.map((el) => ({
        value: el.id,
        label: el.name,
        subCategories: el.subCategories || [],
      })) || [],
    [getMenuCategory]
  );

  const subCategoryList = useMemo(() => {
    const selectedCategory = menuCategoryList.find(
      (cat) => cat.value === addProduct?.menuCategory?.value
    );
    return selectedCategory?.subCategories?.map((subCat) => ({
      value: subCat.id,
      label: subCat.name,
    })) || [];
  }, [menuCategoryList, addProduct?.menuCategory]);

  const { tagsList, unitList } = useMemo(() => {
    const tags =
      getTags?.data?.data?.allTags?.map((el) => ({
        value: el?.id,
        label: el?.name,
      })) || [];

    const units =
      getTags?.data?.data?.allUnits?.map((el) => ({
        value: el?.id,
        label: el?.name,
      })) || [];

    return { tagsList: tags, unitList: units };
  }, [getTags]);

  const collectionList = useMemo(
    () =>
      getCollectionList?.data?.data?.map((el) => ({
        value: el?.addonCategory?.id,
        label: el?.addonCategory?.name,
      })) || [],
    [getCollectionList]
  );

  const energyUnits = ["Kcal", "Kj"].map((unit) => ({
    value: unit,
    label: unit,
  }));

  const weightsUnits = ["g", "kg", "oz", "lbs"].map((unit) => ({
    value: unit,
    label: unit,
  }));

  const handleChange = (e, type) => {
    setAddProduct({
      ...addProduct,
      [type]: e,
    });
  };

  const handleFileChange = (e, type) => {
    let files = e.target.files[0];
    if (files && type === "image") {
      let imageUrl = URL.createObjectURL(files);
      setAddProduct({
        ...addProduct,
        image: files,
        imageUrl,
      });
    } else {
      let files = e.target.files[0];
      if (files && type === "bannerImage") {
        let bannerUrl = URL.createObjectURL(files);
        setAddProduct({
          ...addProduct,
          bannerImage: files,
          bannerUrl,
        });
      }
    }
  };
  // const handleCollectionChange = (e, type) => {
  //   setUpdateColAddon((prevData) =>
  //     prevData?.map((item) => {
  //       if (item.id === addOnId) {
  //         return {
  //           ...item,
  //           addOn: {
  //             ...item.addOn,
  //             [type]: e,
  //           },
  //         };
  //       }
  //       return item;
  //     })
  //   );

  //   setAddOnId("");
  // };

  const addOnCollectionData = () => {
    const filteredData = data?.data?.filter((dat) => {
      return (
        search === "" ||
        (dat?.id && dat?.id.toString().includes(search.toLowerCase())) ||
        (dat?.name && dat?.name.toLowerCase().includes(search.toLowerCase()))
      );
    });
    return filteredData;
  };

  const handleStatus = async (id, status) => {
    const res = await PutAPI(`admin/changestatusproduct/${id}`, {
      status: status ? false : true,
    });
    if (res.data.status === "1") {
      reFetch("admin/addOnCategoryRest");
      toast.success(res.data.message);
    } else {
      toast.error(res.data.message);
    }
  };

  const getaddOns = () => {
    const selectedIds = addProduct?.addonList?.map((el) => el?.value) || [];

    const fullAddons = getAllAddOns?.data?.data?.filter((item) =>
      selectedIds.includes(item?.id)
    );

    const formatAddons = (collections) => {
      return {
        addonList: collections.map((collection) => ({
          collectionId: String(collection.id),
          collectionName: collection.title?.trim() || "",
          minAllowed: String(collection.minAllowed ?? 0),
          maxAllowed: String(collection.maxAllowed ?? 0),
          addOns: (collection?.collectionAddons || []).map((item) => ({
            id: String(item.addOn?.id ?? ""),
            addOnName: item.addOn?.name?.trim() || "",
            isPaid: item.addOn?.isPaid ? 1 : 0,
            price: item.addOn?.price || "",
            isAvaiable:
              item.addOn?.isAvaiable ?? item.addOn?.isAvailable ? 1 : 0,
          })),
        })),
      };
    };
    if (fullAddons?.length > 0) {
      const formatted = formatAddons(fullAddons);
      setAddonListReady(formatted);
    }
  };

  const columns = [
    { field: "id", header: t("Id") },
    { field: "image", header: t("Image") },
    { field: "name", header: t("Name") },
    { field: "category", header: t("Category") },
    { field: "resName", header: t("Restaurant") },
    { field: "price", header: t("Price") },
    { field: "status", header: t("status") },
    { field: "action", header: t("Action") },
  ];

  const datas = [];
  const csv = [];
  addOnCollectionData()?.map((values, index) => {
    csv.push({
      sn: index + 1,
      name: values?.title,
      category: values?.R_MCLink?.menuCategory?.name,
      resName: values?.restaurant,
      status: values?.status ? t("active") : t("inactive"),
      action: values.status,
    });
    return datas.push({
      id: index + 1,
      image: (
        <img
          className="w-20 h-20 rounded-full object-cover"
          src={`${BASE_URL}${values?.image}`}
        />
      ),
      name: values?.name,
      category: values?.R_MCLink?.menuCategory?.name,
      resName: values?.R_MCLink?.restaurant?.businessName,
      price:
        values?.R_MCLink?.restaurant?.zoneRestaurant?.zone?.zoneDetail
          ?.currencyUnit?.symbol +
        " " +
        values?.originalPrice,
      action: (
        <div className="flex gap-x-4">
          <FaRegEdit
            onClick={() => {
              setAddProduct({
                image: values?.image,
                imageUrl: BASE_URL + values?.bannerImage,
                productName: values?.name,
                menuCategory: {
                  value: values?.R_MCLink?.id,
                  label: values?.R_MCLink?.menuCategory?.name,
                },
                subCategory: values?.subCategory ? {
                  value: values?.subCategory?.id,
                  label: values?.subCategory?.name,
                } : "",
                restaurant: {
                  value: values?.R_MCLink?.restaurant?.id,
                  label: values?.R_MCLink?.restaurant?.businessName,
                },
                unitPrice: values?.originalPrice,
                addonList: [],
                bannerImage: values?.bannerImage,
                bannerUrl: BASE_URL + values?.bannerImage,
                description: values?.description,
                RMCLinkId: values?.R_MCLink?.id,
                weight: values?.weight,
                deliveryPrice: values?.deliveryPrice,
                isAvailable: values?.isAvaiable,
                countryOfOrigin: values?.countryOfOrigin,
                ingredients: values?.ingredients,
                allergies: values?.allergies,
                nutrients: values?.nutrients,
                energy: values?.energy,
                fat: values?.fat,
                saturated_fat: values?.saturated_fat,
                carbohydrates: values?.carbohydrates,
                sugar: values?.sugar,
                protein: values?.protein,
                salt: values?.salt,
                qty: values?.qty,
                productTags: values?.productTags ?? {
                  value: values?.productTags,
                  label: values?.productTags,
                },
                storageInstruction: values?.storageInstruction,
                producerInfo: values?.producerInfo,
                additives: values?.additives,
                distributorInfo: values?.distributorInfo,
                feedingRecommendations: values?.feedingRecommendations,
                gttnNum: values?.gttnNum,
                warningSafety: values?.warningSafety,
                servingSize: values?.servingSize,
                fiber: values?.fiber,
                nutrientType: values?.nutrientType ?? "Per 100g",
                quantity: values?.isUnlimited ? 0 : values?.quantity,
                unitName: { value: values?.unitName, label: values?.unitName },
                isUnlimited: values?.isUnlimited,
                nutritionModel: false,
                productId: values?.productId,
              });
              setModType("update");
              setModal(true);
            }}
            size={25}
            className="cursor-pointer text-black"
          />
          <FaRegEye
            onClick={() => {
              setModType("view");
              setModal(true);
            }}
            size={29}
            className="cursor-pointer text-green-600"
          />
          <RiDeleteBin6Line
            size={27}
            className="cursor-pointer text-red-500"
            onClick={() => {
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

  const handleAddProduct = async () => {
    // Validation
    if (!addProduct.productName || addProduct.productName.trim() === "") {
      toast.error(t("Product name is required"));
      return;
    }
    if (!addProduct.menuCategory || !addProduct.menuCategory.value) {
      toast.error(t("Product category is required"));
      return;
    }
    if (
      !addProduct.unitPrice ||
      isNaN(addProduct.unitPrice) ||
      addProduct.unitPrice <= 0
    ) {
      toast.error(t("Product price must be a positive number"));
      return;
    }
    if (
      !addProduct.quantity ||
      isNaN(addProduct.quantity) ||
      addProduct.quantity <= 0
    ) {
      toast.error(t("Product volume is required and must be positive"));
      return;
    }
    if (!addProduct.isUnlimited) {
      // stock quantity required if limited stock
      if (!addProduct.qty || isNaN(addProduct.qty) || addProduct.qty <= 0) {
        toast.error(t("Stock quantity is required and must be positive"));
        return;
      }
    }
    if (!addProduct.description || addProduct.description.trim() === "") {
      toast.error(t("Product description is required"));
      return;
    }

    // If all validations pass, proceed
    const product = new FormData();
    product.append("productName", addProduct.productName);
    product.append("description", addProduct.description ?? "..");
    product.append("price", addProduct.unitPrice);
    product.append("RMCLinkId", addProduct.menuCategory?.value);
    product.append("subCategoryId", addProduct.subCategory?.value || "");
    product.append("image", addProduct.image);
    product.append("bannerImage", addProduct.bannerImage);
    product.append("restaurantId", addProduct?.restaurant.value);
    product.append("addonList", JSON.stringify(addonListReady?.addonList));
    product.append("isAvailable", addProduct?.isAvailable ? 1 : 0);
    product.append("countryOfOrigin", addProduct?.countryOfOrigin);
    product.append("ingredients", addProduct?.ingredients);
    product.append("allergies", addProduct?.allergies);
    product.append("nutrients", addProduct?.nutrients ?? "");
    product.append("qty", addProduct?.isUnlimited ? 0 : addProduct?.qty);
    product.append("productTags", addProduct?.productTags?.label);
    product.append("storageInstruction", addProduct?.storageInstruction);
    product.append("producerInfo", addProduct?.producerInfo);
    product.append("additives", addProduct?.additives);
    product.append("distributorInfo", addProduct?.distributorInfo);
    product.append(
      "feedingRecommendations",
      addProduct?.feedingRecommendations
    );
    product.append("gttnNum", addProduct?.gttnNum);
    product.append("warningSafety", addProduct?.warningSafety);
    product.append(
      "servingSize",
      addProduct?.servingSize === "Per Serving" ? "" : addProduct?.servingSize
    );
    product.append("fiber", addProduct?.fiber);
    product.append("nutrientType", addProduct?.nutrientType);
    product.append("unitName", addProduct?.unitName?.label);
    product.append("quantity", addProduct?.quantity);
    product.append("isUnlimited", addProduct?.isUnlimited ? 1 : 0);
    product.append("weight", parseInt(addProduct.weight) || 0);
    product.append(
      "energy",
      JSON.stringify({
        value: addProduct?.energy,
        unit: addProduct?.energyUnits?.value,
      })
    );
    product.append(
      "fat",
      JSON.stringify({
        value: addProduct?.fat,
        unit: "g",
      })
    );
    product.append(
      "saturated_fat",
      JSON.stringify({
        value: addProduct?.saturated_fat,
        unit: "g",
      })
    );
    product.append(
      "carbohydrates",
      JSON.stringify({
        value: addProduct?.carbohydrates,
        unit: "g",
      })
    );
    product.append(
      "sugar",
      JSON.stringify({
        value: addProduct?.sugar,
        unit: "g",
      })
    );
    product.append(
      "protein",
      JSON.stringify({
        value: addProduct?.protein,
        unit: "g",
      })
    );
    product.append(
      "salt",
      JSON.stringify({
        value: addProduct?.salt,
        unit: "g",
      })
    );

    setLoading(true);
    let res = await PostAPI("retailer/addProduct", product);
    if (res?.data?.status === "1") {
      setLoading(false);
      reFetch();
      success_toaster(res?.data?.message);
      setModal(false);
      setAddProduct("");
      setAddonListReady({});
    } else {
      toast.error(res?.data?.message);
      setModal(false);
      setLoading(false);
    }
  };

  const handleModalScroll = (event) => {
    const shouldShow = event.target.scrollTop > 100;

    if (modalScroll !== shouldShow) {
      setModalScroll(shouldShow);
    }
  };

  useEffect(() => {
    if (addProduct?.menuCategory?.value) {
      const matchedItem = getMenuCategory?.data?.data?.categories?.find(
        (item) => item?.id == addProduct?.menuCategory?.value && item?.RMCLink
      );

      if (matchedItem) {
        setAddProduct((prev) => ({
          ...prev,
          RMCLinkId: matchedItem.RMCLink,
        }));
      }
    }
    if (addProduct?.addonList?.length > 0) {
      getaddOns();
    }
  }, [addProduct?.menuCategory, addProduct?.addonList?.length]);

  return data?.length === 0 ? (
    <Loader />
  ) : (
    <Layout
      content={
        <div className="bg-themeGray p-5">
          <div className="bg-white rounded-lg p-5">
            <div className="flex justify-between items-center flex-wrap gap-5">
              <h2 className="text-themeRed text-lg font-bold font-norms">
                {t("Products")}
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
                  {t("Add New Products")}
                </div>
              </div>
            </div>

            <div>
              <MyDataTable columns={columns} data={datas} />
            </div>
          </div>

          {modtype === "add" || modtype === "update" ? (
            <Modal
              onClose={() => setModal(false)}
              isOpen={modal}
              size={"2xl"}
              isCentered
              blockScrollOnMount={addProduct?.nutritionModel ? false : true}
            >
              <ModalOverlay />
              <ModalContent borderRadius="20px" overflow="hidden">
                <ModalHeader
                  padding={0}
                  className={`absolute transition-all duration-300 ease-in-out font-sf h-16 flex items-center ${modalScroll
                    ? "translate-y-0 opacity-100"
                    : "-translate-y-full opacity-0"
                    } top-0 left-0 z-20 bg-white w-full shadow-md`}
                >
                  <div className="flex justify-center items-center w-full h-8">
                    <h2
                      className={`text-lg font-semibold transition-all duration-500 ease-in-out 
                          ${modalScroll
                          ? "translate-y-0 opacity-100 delay-500"
                          : "-translate-y-4 opacity-0 delay-0"
                        }`}
                    >
                      {modtype === "add" ? "Add Product" : "Update Product"}
                    </h2>
                  </div>
                </ModalHeader>

                <div
                  onClick={() => setModal(false)}
                  className="bg-themeGray hover:bg-gray-200 rounded-full cursor-pointer duration-150 size-10 absolute top-3 right-3 z-20 flex justify-center items-center text-2xl text-black font-black"
                >
                  <IoClose size={30} />
                </div>
                <ModalBody padding={0}>
                  {loading ? (
                    <div className="w-full h-[70vh] flex justify-center items-center">
                      <MiniLoader />
                    </div>
                  ) : (
                    <div
                      onScroll={handleModalScroll}
                      className="grid grid-cols-2 gap-x-3 p-5 pt-20 space-y-5 h-full max-h-[80vh] overflow-auto scroll-modal"
                    >
                      <div className="col-span-2 space-y-1 relative">
                        <div className="flex flex-col gap-4 w-full mb-16 col-span-2 relative">
                          <div
                            className={`w-full h-[130px] bg-slate-100  rounded-sm`}
                          >
                            <label
                              className="w-full h-full flex flex-col justify-center items-center text-gray-600 cursor-pointer"
                              htmlFor="bannerImage"
                            >
                              {addProduct?.bannerUrl ? (
                                <img
                                  className="w-full h-full object-cover rounded"
                                  src={addProduct?.bannerUrl}
                                  alt="banner Image"
                                />
                              ) : (
                                <BiImageAdd size={40} />
                              )}
                              {addProduct?.bannerUrl ? (
                                ""
                              ) : (
                                <p>{t("Upload banner image")}</p>
                              )}
                            </label>
                            <input
                              className="bg-slate-100 outline-none py-4 px-3 w-full"
                              id="bannerImage"
                              name="bannerImage"
                              hidden
                              type="file"
                              onChange={(e) => {
                                handleFileChange(e, "bannerImage");
                              }}
                            />
                          </div>
                          <div className="w-28 h-28 rounded-md bg-slate-100 shadow-md border-gray-200 border-[1px] absolute bottom-[-70px] left-6">
                            <label
                              className="h-full flex flex-col font-semibold justify-center items-center text-gray-600 cursor-pointer"
                              htmlFor="image"
                            >
                              {addProduct?.imageUrl ? (
                                <img
                                  className="w-full h-full object-contain rounded"
                                  src={addProduct?.imageUrl}
                                  alt="image"
                                />
                              ) : (
                                <BiImageAdd size={40} />
                              )}
                              {addProduct?.imageUrl ? (
                                ""
                              ) : (
                                <p className="text-xs">{t("Upload image")}</p>
                              )}
                            </label>
                            <input
                              className="bg-slate-100 outline-none py-4 px-3 w-full"
                              id="image"
                              name="image"
                              hidden
                              type="file"
                              onChange={(e) => handleFileChange(e, "image")}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label
                          htmlFor="productName"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Product Name")}
                        </label>
                        <input
                          type="text"
                          name="productName"
                          id="productName"
                          className="bg-themeInput w-full h-[46px] px-3 rounded-md outline-none"
                          placeholder="Product name"
                          value={addProduct?.productName}
                          onChange={(e) =>
                            handleChange(e.target.value, "productName")
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <label
                          htmlFor="restaurant"
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
                          }}
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
                          placeholder="Select Restaurant"
                          name="restaurant"
                          id="restaurant"
                          options={restList}
                          value={addProduct?.restaurant}
                          onChange={(e) => handleChange(e, "restaurant")}
                        />
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor="menuCategoru"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Menu Category")}
                        </label>
                        <Select
                          placeholder="Select Category"
                          name="menuCategory"
                          id="menuCategory"
                          options={menuCategoryList}
                          value={addProduct?.menuCategory}
                          onChange={(e) => {
                            handleChange(e, "menuCategory");
                            // Reset sub-category when category changes
                            setAddProduct(prev => ({
                              ...prev,
                              menuCategory: e,
                              subCategory: "",
                            }));
                          }}
                        />
                      </div>

                      {/* Sub-category select - always visible but disabled when no sub-categories */}
                      <div className="space-y-1">
                        <label
                          htmlFor="subCategory"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Sub Category")}
                        </label>
                        <Select
                          placeholder={subCategoryList.length > 0 ? "Select Sub Category" : "No sub-categories available"}
                          name="subCategory"
                          id="subCategory"
                          options={subCategoryList}
                          value={addProduct?.subCategory}
                          onChange={(e) => handleChange(e, "subCategory")}
                          isDisabled={subCategoryList.length === 0}
                          styles={{
                            control: (provided, state) => ({
                              ...provided,
                              backgroundColor: subCategoryList.length === 0 ? '#f5f5f5' : 'white',
                              cursor: subCategoryList.length === 0 ? 'not-allowed' : 'default',
                            }),
                            placeholder: (provided) => ({
                              ...provided,
                              color: subCategoryList.length === 0 ? '#999' : '#666',
                            }),
                          }}
                        />
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor="unitPrice"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Original Price")}
                        </label>
                        <input
                          type="number"
                          name="unitPrice"
                          id="unitPrice"
                          className="bg-themeInput w-full h-[46px] px-3 rounded-md outline-none"
                          placeholder="Price"
                          value={addProduct?.unitPrice}
                          onChange={(e) =>
                            handleChange(e.target.value, "unitPrice")
                          }
                        />
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor="quantity"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Product volume")}
                        </label>
                        <input
                          type="number"
                          name="quantity"
                          id="quantity"
                          className="bg-themeInput w-full h-[46px] px-3 rounded-md outline-none"
                          placeholder="Volume..."
                          value={addProduct?.quantity}
                          onChange={(e) =>
                            handleChange(e.target.value, "quantity")
                          }
                        />
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor="unitName"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Unit")}
                        </label>
                        <Select
                          placeholder="Select Unit"
                          name="unitName"
                          id="unitName"
                          options={unitList}
                          value={addProduct?.unitName}
                          onChange={(e) => handleChange(e, "unitName")}
                        />
                      </div>

                      <div className="space-y-1 col-span-2 text-black font-switzer font-semibold">
                        <label>{t("Stock Quantity")}</label>
                        <div className="flex !mt-2">
                          <label
                            htmlFor="limited"
                            className="flex flex-1 gap-x-3 items-center"
                          >
                            <CustomCheckbox
                              id="limited"
                              checked={!addProduct.isUnlimited}
                              onChange={() =>
                                setAddProduct((prev) => ({
                                  ...prev,
                                  isUnlimited: false,
                                }))
                              }
                            />

                            <p>Limited</p>
                          </label>
                          <label
                            htmlFor="unlimited"
                            className="flex flex-1 gap-x-3 items-center"
                          >
                            <CustomCheckbox
                              id="unlimited"
                              checked={addProduct.isUnlimited}
                              onChange={() =>
                                setAddProduct((prev) => ({
                                  ...prev,
                                  isUnlimited: true,
                                }))
                              }
                            />
                            <p>Unlimited</p>
                          </label>
                        </div>
                      </div>

                      {!addProduct?.isUnlimited && (
                        <div className="space-y-1 col-span-2">
                          <label
                            htmlFor="qty"
                            className="text-black font-switzer font-semibold"
                          >
                            {t("Add Stock")}
                          </label>
                          <input
                            type="text"
                            name="qty"
                            id="qty"
                            className="bg-themeInput w-full h-[46px] px-3 rounded-md outline-none"
                            placeholder="Add quantity"
                            value={addProduct?.qty}
                            onChange={(e) =>
                              handleChange(e.target.value, "qty")
                            }
                          />
                        </div>
                      )}

                      <div className="space-y-1">
                        <label
                          htmlFor="addonList"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Addon Collection")}
                        </label>
                        <Select
                          isMulti
                          // styles={customStyles}
                          placeholder="Select Collection"
                          name="addonList"
                          id="addonList"
                          options={collectionList}
                          value={addProduct?.addonList}
                          onChange={(e) => {
                            handleChange(e, "addonList");
                          }}
                        />
                      </div>
                      <div className="space-y-1">
                        <p
                          htmlFor="nutritionalInfo"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Nutritional info")}
                        </p>

                        <div className="pt-3">
                          <Switch
                            checked={nutriModel}
                            uncheckedIcon={false}
                            onChange={(e) => {
                              setAddProduct({
                                ...addProduct,
                                nutritionModel: e,
                              });
                              setNutriModel(!nutriModel);
                            }}
                            checkedIcon={false}
                            onColor="#008000"
                            onHandleColor="#fff"
                            className="react-switch mx-auto"
                            boxShadow="none"
                            width={36}
                            height={20}
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor="countryOfOrigin"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Country of origin")}
                        </label>
                        <input
                          type="text"
                          name="countryOfOrigin"
                          id="countryOfOrigin"
                          className="bg-themeInput w-full h-[46px] px-3 rounded-md outline-none"
                          placeholder="country..."
                          value={addProduct?.countryOfOrigin}
                          onChange={(e) =>
                            handleChange(e.target.value, "countryOfOrigin")
                          }
                        />
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor="storageInstruction"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Storage/Usage instruction")}
                        </label>
                        <input
                          type="text"
                          name="storageInstruction"
                          id="storageInstruction"
                          className="bg-themeInput w-full h-[46px] px-3 rounded-md outline-none"
                          placeholder="Storage/Usage instruction"
                          value={addProduct?.storageInstruction}
                          onChange={(e) =>
                            handleChange(e.target.value, "storageInstruction")
                          }
                        />
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor="producerInfo"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Producer Information")}
                        </label>
                        <input
                          type="text"
                          name="producerInfo"
                          id="producerInfo"
                          className="bg-themeInput w-full h-[46px] px-3 rounded-md outline-none"
                          placeholder="Producer Information..."
                          value={addProduct?.producerInfo}
                          onChange={(e) =>
                            handleChange(e.target.value, "producerInfo")
                          }
                        />
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor="ingredients"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Ingredients")}
                        </label>
                        <input
                          type="text"
                          name="ingredients"
                          id="ingredients"
                          className="bg-themeInput w-full h-[46px] px-3 rounded-md outline-none"
                          placeholder="ingredients..."
                          value={addProduct?.ingredients}
                          onChange={(e) =>
                            handleChange(e.target.value, "ingredients")
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <label
                          htmlFor="allergies"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Allergens")}
                        </label>
                        <input
                          type="text"
                          name="allergies"
                          id="allergies"
                          className="bg-themeInput w-full h-[46px] px-3 rounded-md outline-none"
                          placeholder="ingredients..."
                          value={addProduct?.allergies}
                          onChange={(e) =>
                            handleChange(e.target.value, "allergies")
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <label
                          htmlFor="additives"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Additives")}
                        </label>
                        <input
                          type="text"
                          name="additives"
                          id="additives"
                          className="bg-themeInput w-full h-[46px] px-3 rounded-md outline-none"
                          placeholder="additives..."
                          value={addProduct?.additives}
                          onChange={(e) =>
                            handleChange(e.target.value, "additives")
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <label
                          htmlFor="distributorInfo"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Distributor Information")}
                        </label>
                        <input
                          type="text"
                          name="distributorInfo"
                          id="Distributor Info"
                          className="bg-themeInput w-full h-[46px] px-3 rounded-md outline-none"
                          placeholder="distributorInfo..."
                          value={addProduct?.distributorInfo}
                          onChange={(e) =>
                            handleChange(e.target.value, "distributorInfo")
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <label
                          htmlFor="feedingRecommendations"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Feeding Recommendations")}
                        </label>
                        <input
                          type="text"
                          name="feedingRecommendations"
                          id="Feeding Recommendations"
                          className="bg-themeInput w-full h-[46px] px-3 rounded-md outline-none"
                          placeholder="feedingRecommendations..."
                          value={addProduct?.feedingRecommendations}
                          onChange={(e) =>
                            handleChange(
                              e.target.value,
                              "feedingRecommendations"
                            )
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <label
                          htmlFor="warningSafety"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("More Info Warning & Safety")}
                        </label>
                        <input
                          type="text"
                          name="warningSafety"
                          id="warningSafety"
                          className="bg-themeInput w-full h-[46px] px-3 rounded-md outline-none"
                          placeholder="warning Safety..."
                          value={addProduct?.warningSafety}
                          onChange={(e) =>
                            handleChange(e.target.value, "warningSafety")
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <label
                          htmlFor="gttnNum"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("GTIN")}
                        </label>
                        <input
                          type="number"
                          name="gttnNum"
                          id="gttnNum"
                          className="bg-themeInput w-full h-[46px] px-3 rounded-md outline-none"
                          placeholder="GTIN..."
                          value={addProduct?.gttnNum}
                          onChange={(e) =>
                            handleChange(e.target.value, "gttnNum")
                          }
                        />
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor="productTags"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Product Tags")}
                        </label>
                        <Select
                          // styles={customStyles}
                          placeholder="Select tag"
                          name="productTags"
                          id="productTags"
                          options={tagsList}
                          value={addProduct?.productTags}
                          onChange={(e) => handleChange(e, "productTags")}
                        />
                      </div>

                      <div className="space-y-1 col-span-2">
                        <label
                          htmlFor="description"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Description")}
                        </label>
                        <textarea
                          type="text"
                          name="description"
                          id="description"
                          className="bg-themeInput w-full p-3 rounded-md outline-none h-28 resize-none"
                          placeholder="description..."
                          value={addProduct?.description}
                          onChange={(e) =>
                            handleChange(e.target.value, "description")
                          }
                        />
                      </div>

                      <div className="space-y-1 col-span-2">
                        <div className="flex gap-x-3 items-center w-max">
                          <p className="text-black font-switzer font-semibold">
                            {t("Item Available")}
                          </p>
                          <Switch
                            checked={addProduct?.isAvailable}
                            uncheckedIcon={false}
                            onChange={(e) => {
                              setAddProduct({ ...addProduct, isAvailable: e });
                            }}
                            checkedIcon={false}
                            onColor="#008000"
                            onHandleColor="#fff"
                            className="react-switch mx-auto"
                            boxShadow="none"
                            width={36}
                            height={20}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </ModalBody>
                {!loading && (
                  <ModalFooter px={2} pb="2">
                    <div className="flex gap-1 pr-3">
                      <BlackButton
                        text={t("cancel")}
                        onClick={() => {
                          setModal(false);
                        }}
                      />
                      <RedButton
                        text={t(
                          modtype === "add" ? "Add Product" : "Update Product"
                        )}
                        onClick={handleAddProduct}
                      />
                    </div>
                  </ModalFooter>
                )}
              </ModalContent>
            </Modal>
          ) : modtype === "delete" ? (
            <Modal
              onClose={() => setModal(false)}
              isOpen={modal}
              size={"lg"}
              isCentered
            >
              <ModalOverlay />
              <ModalContent borderRadius="20px" overflow="hidden">
                <ModalHeader padding={0}></ModalHeader>
                <div
                  onClick={() => setModal(false)}
                  className="bg-themeGray hover:bg-gray-200 rounded-full cursor-pointer duration-150 size-10 absolute top-3 right-3 z-20 flex justify-center items-center text-2xl text-black font-black"
                >
                  <IoClose size={30} />
                </div>
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
                  <div className="grid grid-cols-2 px-6 pb-5 gap-x-3 [&>div]:py-2.5 [&>div]:border w-full [&>div]:rounded-md [&>div]:cursor-pointer text-center font-semibold text-xl">
                    <div
                      className="border-black hover:bg-black hover:text-white duration-150"
                      onClick={() => setModal(false)}
                    >
                      {t("Cancel")}
                    </div>
                    <div className="border-red-500 bg-red-500 text-white hover:bg-white hover:text-red-500 duration-150">
                      {t("Confirm")}
                    </div>
                  </div>
                </ModalFooter>
              </ModalContent>
            </Modal>
          ) : modtype === "update" ? (
            ""
          ) : (
            // <Modal
            //   onClose={() => setModal(false)}
            //   isOpen={modal}
            //   size={"3xl"}
            //   isCentered
            // >
            //   <ModalOverlay />
            //   <ModalContent>
            //     <ModalHeader padding={0}>
            //       <div className="pl-8 pt-10 text-lg font-norms font-semibold0">
            //         {addProduct?.addonCollection?.label}
            //       </div>
            //     </ModalHeader>

            //     <ModalBody padding={4}>
            //       <div className="p-5">
            //         <div className="grid grid-cols-2 gap-x-3">
            //           <div className="space-y-1">
            //             <label
            //               htmlFor="maxAllow"
            //               className="text-black font-switzer font-semibold"
            //             >
            //               {t("Maximum Allow")}
            //             </label>
            //             <Select
            //               placeholder="Quantity"
            //               name="max"
            //               id="max"
            //               options={[
            //                 { value: "01", label: "1" },
            //                 { value: "02", label: "2" },
            //                 { value: "03", label: "3" },
            //                 { value: "04", label: "4" },
            //                 { value: "05", label: "5" },
            //               ]}
            //               onChange={(e) =>
            //                 setCollectionData({
            //                   ...collectionData,
            //                   maxAllowed: e,
            //                 })
            //               }
            //               value={collectionData?.maxAllowed}
            //             />
            //           </div>

            //           <div className="space-y-1">
            //             <label
            //               htmlFor="addonCollection"
            //               className="text-black font-switzer font-semibold"
            //             >
            //               {t("Minimum Allow")}
            //             </label>
            //             <Select
            //               placeholder="Quantity"
            //               name="min"
            //               id="min"
            //               options={[
            //                 { value: "01", label: "1" },
            //                 { value: "02", label: "2" },
            //                 { value: "03", label: "3" },
            //                 { value: "04", label: "4" },
            //                 { value: "05", label: "5" },
            //               ]}
            //               onChange={(e) =>
            //                 setCollectionData({
            //                   ...collectionData,
            //                   minAllowed: e,
            //                 })
            //               }
            //               value={collectionData.minAllowed}
            //             />
            //           </div>
            //         </div>
            //         <div className="bg-[#f4f4f4] rounded-md px-2 py-4 mt-5">
            //           <div className="grid grid-cols-5 [&>p]:font-norms [&>p]:font-semibold [&>p]:text-center pt-5">
            //             <p></p>
            //             <p>Default Selected</p>
            //             <p>Is Paid</p>
            //             <p>Price</p>
            //             <p>Available</p>
            //           </div>
            //           {updateColAddon.length > 0 &&
            //             updateColAddon?.map((el, i) => {
            //               return (
            //                 <div
            //                   key={i}
            //                   className="bg-white rounded-md px-2 py-4 mt-5 mx-2 grid grid-cols-5 [&>p]:font-norms [&>p]:font-semibold [&>p]:text-center"
            //                   onClick={() => setAddOnId(el?.id)}
            //                 >
            //                   <p>{el?.addOn?.name}</p>
            //                   <Switch
            //                     checked={
            //                       el?.default
            //                         ? el?.default
            //                         : collectionData?.default
            //                     }
            //                     onChange={(checked) => {
            //                       setCollectionData({
            //                         ...collectionData,
            //                         default: checked,
            //                       });
            //                       // handleCollectionChange(checked, "default")
            //                     }}
            //                     uncheckedIcon={false}
            //                     checkedIcon={false}
            //                     onColor="#008000"
            //                     onHandleColor="#fff"
            //                     className="react-switch mx-auto"
            //                     boxShadow="none"
            //                     width={36}
            //                     height={20}
            //                   />

            //                   <Switch
            //                     checked={el?.addOn?.isPaid}
            //                     onChange={(checked) => {
            //                       setAddOnId(el?.id);
            //                       handleCollectionChange(checked, "isPaid");
            //                     }}
            //                     uncheckedIcon={false}
            //                     checkedIcon={false}
            //                     onColor="#008000"
            //                     onHandleColor="#fff"
            //                     className="react-switch mx-auto"
            //                     boxShadow="none"
            //                     width={36}
            //                     height={20}
            //                   />
            //                   <p className="text-sm">{el?.addOn?.price}</p>
            //                   <Switch
            //                     checked={el?.addOn?.isAvaiable}
            //                     onChange={(checked) => {
            //                       setAddOnId(el?.id);
            //                       handleCollectionChange(checked, "isAvaiable");
            //                     }}
            //                     uncheckedIcon={false}
            //                     checkedIcon={false}
            //                     onColor="#008000"
            //                     onHandleColor="#fff"
            //                     className="react-switch mx-auto"
            //                     boxShadow="none"
            //                     width={36}
            //                     height={20}
            //                   />
            //                 </div>
            //               );
            //             })}
            //         </div>
            //       </div>
            //     </ModalBody>
            //     <ModalFooter padding={4}>
            //       <div className="flex gap-1 pr-5">
            //         <BlackButton
            //           text={t("cancel")}
            //           onClick={() => {
            //             setModal(false);
            //           }}
            //         />
            //         <RedButton
            //           text={t("Save Changes")}
            //           onClick={() => {
            //             setModType("add");
            //           }}
            //         />
            //       </div>
            //     </ModalFooter>
            //   </ModalContent>
            // </Modal>
            ""
          )}

          <Modal
            onClose={() =>
              setAddProduct({ ...addProduct, nutritionModel: false })
            }
            isOpen={addProduct?.nutritionModel}
            size={"3xl"}
            isCentered
            blockScrollOnMount={true}
          >
            <ModalOverlay />
            <ModalContent borderRadius="20px" overflow="hidden" zIndex="1500">
              <ModalHeader
                className={`absolute transition-all duration-300 ease-in-out font-sf ${modalScroll
                  ? "translate-y-0 opacity-100"
                  : "-translate-y-full opacity-0"
                  } top-0 left-0 z-20 bg-white w-full shadow-md`}
              >
                <div className="flex justify-center items-center w-full h-8">
                  <h2
                    className={`text-lg font-semibold transition-all duration-500 ease-in-out 
                          ${modalScroll
                        ? "translate-y-0 opacity-100 delay-500"
                        : "-translate-y-4 opacity-0 delay-0"
                      }`}
                  >
                    Nutritional Information
                  </h2>
                </div>
              </ModalHeader>

              <div
                onClick={() =>
                  setAddProduct({ ...addProduct, nutritionModel: false })
                }
                className="bg-themeGray hover:bg-gray-200 rounded-full cursor-pointer duration-150 size-10 absolute top-3 right-3 z-20 flex justify-center items-center text-2xl text-black font-black"
              >
                <IoClose size={30} />
              </div>

              <ModalBody padding="0">
                <div
                  onScroll={handleModalScroll}
                  className="p-5 pt-20 h-full max-h-[calc(100vh-100px)] overflow-auto"
                >
                  <div className="flex gap-x-2 items-center">
                    <h4 className="text-lg font-semibold">
                      Nutritional Information
                    </h4>
                    <IoIosInformationCircle size={25} />
                  </div>

                  <div className="flex items-center gap-3 my-5 font-switzer [&>div]:cursor-pointer [&>div]:px-4 [&>div]:py-2 [&>div]:rounded-full [&>div]:bg-gray-200 ">
                    <div
                      onClick={(e) =>
                        setAddProduct({
                          ...addProduct,
                          nutrientType: "Per 100g",
                        })
                      }
                      className={
                        addProduct?.nutrientType === "Per 100g" &&
                        "!bg-black text-white"
                      }
                    >
                      Per 100g
                    </div>
                    <div
                      onClick={(e) =>
                        setAddProduct({
                          ...addProduct,
                          nutrientType: "Per 100mL",
                        })
                      }
                      className={
                        addProduct?.nutrientType === "Per 100mL" &&
                        "!bg-black text-white"
                      }
                    >
                      Per 100mL
                    </div>
                    <div
                      onClick={(e) =>
                        setAddProduct({
                          ...addProduct,
                          nutrientType: "Per Serving",
                        })
                      }
                      className={
                        addProduct?.nutrientType === "Per Serving" &&
                        "!bg-black text-white"
                      }
                    >
                      Per Serving
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label
                        htmlFor="weight"
                        className="text-black font-switzer font-semibold"
                      >
                        {t("Weight")}
                      </label>
                      <input
                        type="number"
                        name="weight"
                        id="weight"
                        className="bg-themeInput w-full h-[46px] px-3 rounded-md outline-none"
                        placeholder="weight..."
                        value={addProduct?.weight}
                        onChange={(e) => handleChange(e.target.value, "weight")}
                      />
                    </div>

                    <div className="space-y-1">
                      <label
                        htmlFor="weightsUnits"
                        className="text-black font-switzer font-semibold"
                      >
                        {t("Weight Unit")}
                      </label>
                      <Select
                        // styles={customStyles}
                        placeholder="Select tag"
                        name="weightsUnits"
                        id="weightsUnits"
                        options={weightsUnits}
                        value={addProduct?.weightsUnits}
                        onChange={(e) => handleChange(e, "weightsUnits")}
                      />
                    </div>

                    <div className="space-y-1">
                      <label
                        htmlFor="energy"
                        className="text-black font-switzer font-semibold"
                      >
                        {t("Energy")}
                      </label>
                      <input
                        type="number"
                        name="energy"
                        id="energy"
                        className="bg-themeInput w-full h-[46px] px-3 rounded-md outline-none"
                        placeholder="energy..."
                        value={addProduct?.energy}
                        onChange={(e) => handleChange(e.target.value, "energy")}
                      />
                    </div>

                    <div className="space-y-1">
                      <label
                        htmlFor="energyUnits"
                        className="text-black font-switzer font-semibold"
                      >
                        {t("Energy Unit")}
                      </label>
                      <Select
                        // styles={customStyles}
                        placeholder="Select tag"
                        name="energyUnits"
                        id="energyUnits"
                        options={energyUnits}
                        value={addProduct?.energyUnits}
                        onChange={(e) => handleChange(e, "energyUnits")}
                      />
                    </div>

                    <div className="space-y-1">
                      <label
                        htmlFor="fat"
                        className="text-black font-switzer font-semibold"
                      >
                        {t("Fat")}
                      </label>
                      <input
                        type="number"
                        name="fat"
                        id="fat"
                        className="bg-themeInput w-full h-[46px] px-3 rounded-md outline-none"
                        placeholder="energy..."
                        value={addProduct?.fat}
                        onChange={(e) => handleChange(e.target.value, "fat")}
                      />
                    </div>
                    <div className="space-y-1">
                      <label
                        htmlFor="saturated_fat"
                        className="text-black font-switzer font-semibold"
                      >
                        {t("Saturated Fat")}
                      </label>
                      <input
                        type="number"
                        name="saturated_fat"
                        id="saturated_fat"
                        className="bg-themeInput w-full h-[46px] px-3 rounded-md outline-none"
                        placeholder="Saturated Fat..."
                        value={addProduct?.saturated_fat}
                        onChange={(e) =>
                          handleChange(e.target.value, "saturated_fat")
                        }
                      />
                    </div>

                    <div className="space-y-1">
                      <label
                        htmlFor="carbohydrates"
                        className="text-black font-switzer font-semibold"
                      >
                        {t("carbohydrates")}
                      </label>
                      <input
                        type="number"
                        name="carbohydrates"
                        id="carbohydrates"
                        className="bg-themeInput w-full h-[46px] px-3 rounded-md outline-none"
                        placeholder="carbohydrates..."
                        value={addProduct?.carbohydrates}
                        onChange={(e) =>
                          handleChange(e.target.value, "carbohydrates")
                        }
                      />
                    </div>

                    <div className="space-y-1">
                      <label
                        htmlFor="protein"
                        className="text-black font-switzer font-semibold"
                      >
                        {t("Protein")}
                      </label>
                      <input
                        type="number"
                        name="protein"
                        id="protein"
                        className="bg-themeInput w-full h-[46px] px-3 rounded-md outline-none"
                        placeholder="protein..."
                        value={addProduct?.protein}
                        onChange={(e) =>
                          handleChange(e.target.value, "protein")
                        }
                      />
                    </div>

                    <div className="space-y-1">
                      <label
                        htmlFor="salt"
                        className="text-black font-switzer font-semibold"
                      >
                        {t("Salt")}
                      </label>
                      <input
                        type="number"
                        name="salt"
                        id="salt"
                        className="bg-themeInput w-full h-[46px] px-3 rounded-md outline-none"
                        placeholder="salt..."
                        value={addProduct?.salt}
                        onChange={(e) => handleChange(e.target.value, "salt")}
                      />
                    </div>

                    <div className="space-y-1">
                      <label
                        htmlFor="sugar"
                        className="text-black font-switzer font-semibold"
                      >
                        {t("Sugar")}
                      </label>
                      <input
                        type="number"
                        name="sugar"
                        id="sugar"
                        className="bg-themeInput w-full h-[46px] px-3 rounded-md outline-none"
                        placeholder="sugar..."
                        value={addProduct?.sugar}
                        onChange={(e) => handleChange(e.target.value, "sugar")}
                      />
                    </div>

                    <div className="space-y-1">
                      <label
                        htmlFor="fiber"
                        className="text-black font-switzer font-semibold"
                      >
                        {t("Fiber")}
                      </label>
                      <input
                        type="number"
                        name="fiber"
                        id="fiber"
                        className="bg-themeInput w-full h-[46px] px-3 rounded-md outline-none"
                        placeholder="carbohydrates..."
                        value={addProduct?.fiber}
                        onChange={(e) => handleChange(e.target.value, "fiber")}
                      />
                    </div>

                    {addProduct?.nutrientType === "Per Serving" && (
                      <div className="space-y-1">
                        <label
                          htmlFor="servingSize"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Serving Size")}
                        </label>
                        <input
                          type="number"
                          name="servingSize"
                          id="servingSize"
                          className="bg-themeInput w-full h-[46px] px-3 rounded-md outline-none"
                          placeholder="servingSize..."
                          value={addProduct?.servingSize}
                          onChange={(e) =>
                            handleChange(e.target.value, "servingSize")
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>
              </ModalBody>
              <ModalFooter px={2}>
                <div className="flex gap-1 pr-5">
                  <BlackButton
                    text={t("cancel")}
                    onClick={() => {
                      setNutriModel(false);
                      setAddProduct({ ...addProduct, nutritionModel: false });
                    }}
                  />
                  <RedButton
                    text={t("Save Changes")}
                    onClick={() => {
                      setAddProduct({ ...addProduct, nutritionModel: false });
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

export default ManageProducts;
