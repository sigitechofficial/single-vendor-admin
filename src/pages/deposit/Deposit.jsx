import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Layout from "../../components/Layout";
import Helment from "../../components/Helment";
import MyDataTable from "../../components/MyDataTable";
import Select from "react-select";
import RedButton, { BlackButton } from "../../utilities/Buttons";
import GetAPI from "../../utilities/GetAPI";
import { PostAPI } from "../../utilities/PostAPI";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import {
  info_toaster,
  success_toaster,
  error_toaster,
} from "../../utilities/Toaster";

export default function Deposit() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [editModal, setEditModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editDepositRows, setEditDepositRows] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deletingCategoryId, setDeletingCategoryId] = useState(null);
  const filterOptions = GetAPI("admin/filterOptions");
  const { data: depositCategoriesData, reFetch } = GetAPI(
    "admin/getDepositCategories"
  );
  console.log("Deposit Categories Data:", depositCategoriesData);
  const [depositCategory, setDepositCategory] = useState({
    zoneId: "",
    material: "",
  });

  const [depositRows, setDepositRows] = useState([
    {
      id: 1,
      isSingle: "",
      minLimit: "",
      maxLimit: "",
      unit: "ml", // Static ml unit
      value: "",
    }
  ]);

  // Sample data - replace with actual API call
  useEffect(() => {
    // Data will come from depositCategoriesData API
  }, []);

  // Zone options for dropdown
  let zoneOptions = [
    {
      value: null,
      label: "Select Zone",
    },
  ];
  filterOptions?.data?.data?.zones?.map((zone) => {
    zoneOptions.push({
      value: zone.id,
      label: zone.name,
    });
  });

  // Filter deposit categories data
  const filterData = () => {
    const query = search?.trim().toLowerCase() || "";
    const categories = depositCategoriesData?.data?.categories || depositCategoriesData?.data || [];

    if (!Array.isArray(categories)) return [];

    // Flatten the data to show each config as a separate row
    const flattenedData = [];
    categories.forEach(category => {
      if (category.depositCategoryConfigs && category.depositCategoryConfigs.length > 0) {
        category.depositCategoryConfigs.forEach(config => {
          flattenedData.push({
            id: config.id,
            categoryId: category.id,
            name: category.name,
            material: category.name,
            unit: config.unit,
            minLimit: config.minLimit,
            maxLimit: config.maxLimit,
            isSingle: config.scope,
            scope: config.scope,
            value: config.value,
            zoneId: category.zoneId,
            createdAt: config.createdAt,
            updatedAt: config.updatedAt
          });
        });
      } else {
        // Fallback for categories without configs
        flattenedData.push({
          id: category.id,
          categoryId: category.id,
          name: category.name,
          material: category.name,
          unit: "",
          minLimit: "",
          maxLimit: "",
          isSingle: "",
          scope: "",
          value: "",
          zoneId: category.zoneId,
          createdAt: category.createdAt,
          updatedAt: category.updatedAt
        });
      }
    });

    return flattenedData.filter((item) => {
      return (
        item?.id?.toString()?.includes(query) ||
        item?.material?.toLowerCase()?.includes(query) ||
        item?.name?.toLowerCase()?.includes(query) ||
        item?.unit?.toLowerCase()?.includes(query) ||
        item?.minLimit?.toString()?.includes(query) ||
        item?.maxLimit?.toString()?.includes(query) ||
        item?.value?.toString()?.includes(query)
      );
    });
  };

  const columns = [
    { field: "id", header: t("ID") },
    { field: "material", header: t("Material") },
    { field: "unit", header: t("Unit") },
    { field: "minLimit", header: t("Min Limit") },
    { field: "maxLimit", header: t("Max Limit") },
    { field: "isSingle", header: t("Is Single") },
    { field: "value", header: t("Value") },
    { field: "zoneId", header: t("Zone ID") },
    { field: "action", header: t("Actions") },
  ];

  // Prepare data for table with proper field mapping
  const tableData =
    filterData()?.map((item, index) => ({
      id: item.id,
      categoryId: item.categoryId, // Ensure categoryId is included
      material: item.material || item.name,
      unit: item.unit,
      minLimit: item.minLimit !== undefined && item.minLimit !== null ? item.minLimit : "",
      maxLimit: item.maxLimit !== undefined && item.maxLimit !== null ? item.maxLimit : "",
      isSingle: item.isSingle === "single" || item.scope === "single" || item.isSingle === "1" ? "Single" : "Multiple",
      value: `$${parseFloat(item.value || 0).toFixed(2)}`,
      zoneId: item.zoneId,
      action: (
        <div className="flex gap-x-2">
          <FaRegEdit
            size={25}
            className="cursor-pointer text-orange-600"
            onClick={() => handleEdit(item)}
          />
          <RiDeleteBin6Line
            size={27}
            className="cursor-pointer text-red-500"
            onClick={() => handleDelete(item.categoryId || item.id)}
          />
        </div>
      ),
    })) || [];

  const handleEdit = (categoryData) => {
    // Handle edit functionality
    console.log("Edit category:", categoryData);
    
    // Find all rows for this category from the original data
    const categories = depositCategoriesData?.data?.categories || depositCategoriesData?.data || [];
    const currentCategory = categories.find(cat => cat.id === categoryData.categoryId);
    
    setEditingCategory({
      id: categoryData.id,
      categoryId: categoryData.categoryId,
      zoneId: categoryData.zoneId,
      material: categoryData.material || categoryData.name,
    });
    
    // Set up edit deposit rows with all existing configurations for this category
    if (currentCategory && currentCategory.depositCategoryConfigs && currentCategory.depositCategoryConfigs.length > 0) {
      const allRows = currentCategory.depositCategoryConfigs.map((config, index) => ({
        id: index + 1,
        isSingle: config.scope === "single" ? "single" : "multiple",
        minLimit: config.minLimit !== undefined && config.minLimit !== null ? config.minLimit.toString() : "",
        maxLimit: config.maxLimit !== undefined && config.maxLimit !== null ? config.maxLimit.toString() : "",
        unit: config.unit || "ml",
        value: config.value ? config.value.toString().replace('$', '') : "",
      }));
      setEditDepositRows(allRows);
    } else {
      // Fallback to single row with current data
      setEditDepositRows([
        {
          id: 1,
          isSingle: categoryData.isSingle === "single" || categoryData.isSingle === "1" ? "single" : "multiple",
          minLimit: categoryData.minLimit !== undefined && categoryData.minLimit !== null
            ? categoryData.minLimit.toString()
            : categoryData.limit || "",
          maxLimit: categoryData.maxLimit !== undefined && categoryData.maxLimit !== null
            ? categoryData.maxLimit.toString()
            : "",
          unit: categoryData.unit || "ml",
          value: categoryData.value ? categoryData.value.toString().replace('$', '') : "",
        }
      ]);
    }
    
    setEditModal(true);
  };

  const handleUpdateDepositCategory = async () => {
    // Validate required fields
    if (
      !editingCategory.material
    ) {
      error_toaster("Please fill in Material Name");
      return;
    }

    // Validate edit deposit rows
    const invalidRows = editDepositRows.filter(row => 
      !row.isSingle || !row.minLimit || !row.maxLimit || !row.value
    );

    if (invalidRows.length > 0) {
      error_toaster("Please fill in all fields for all deposit details rows");
      return;
    }

    try {
      setLoading(true);

      const requestPayload = {
        id: editingCategory.categoryId || editingCategory.id, // Actual category ID
        name: editingCategory.material,
        zoneId: editingCategory.zoneId,
        list: editDepositRows.map(row => ({
          maxLimit: parseInt(row.maxLimit) || 0,
          minLimit: parseInt(row.minLimit) || 0,
          value: parseFloat(row.value) || 0,
          unit: "ml",
          scope: row.isSingle || ""
        }))
      };

      console.log("Edit API Request Payload:", requestPayload);

      const response = await PostAPI(
        "admin/editDepositCategory",
        requestPayload
      );

      if (response?.data?.status === "1") {
        success_toaster(
          response?.data?.message || "Deposit category updated successfully!"
        );

        // Close modal and reset form
        setEditModal(false);
        setEditingCategory(null);
        setEditDepositRows([]);
        reFetch(); // Refresh the data
      } else {
        error_toaster(
          response?.data?.message || "Failed to update deposit category"
        );
      }
    } catch (error) {
      console.error("Error updating deposit category:", error);
      error_toaster("An error occurred while updating deposit category");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditModal(false);
    setEditingCategory(null);
    setEditDepositRows([]);
  };

  const handleDelete = (categoryId) => {
    console.log("Delete called with categoryId:", categoryId);
    setDeletingCategoryId(categoryId);
    setDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingCategoryId) return;

    try {
      setLoading(true);
      
      const requestPayload = {
        id: deletingCategoryId
      };
      
      console.log("Delete API Request Payload:", requestPayload);
      
      const response = await PostAPI("admin/deleteDepositCategory", requestPayload);

      console.log("Delete API Response:", response);

      if (response?.data?.status === "1") {
        success_toaster(
          response?.data?.message || "Deposit category deleted successfully!"
        );
        reFetch(); // Refresh the data
      } else {
        error_toaster(
          response?.data?.message || "Failed to delete deposit category"
        );
      }
    } catch (error) {
      console.error("Error deleting deposit category:", error);
      error_toaster("An error occurred while deleting deposit category");
    } finally {
      setLoading(false);
      setDeleteModal(false);
      setDeletingCategoryId(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModal(false);
    setDeletingCategoryId(null);
  };

  // Functions to handle dynamic edit rows
  const updateEditDepositRow = (id, field, value) => {
    setEditDepositRows(prevRows =>
      prevRows.map(row =>
        row.id === id ? { ...row, [field]: value } : row
      )
    );
  };

  const addMoreEditDepositRow = () => {
    const newId = Math.max(...editDepositRows.map(row => row.id)) + 1;
    setEditDepositRows(prevRows => [
      ...prevRows,
      {
        id: newId,
        isSingle: "",
        minLimit: "",
        maxLimit: "",
        unit: "ml",
        value: "",
      }
    ]);
  };

  const removeEditDepositRow = (id) => {
    if (editDepositRows.length > 1) {
      setEditDepositRows(prevRows => prevRows.filter(row => row.id !== id));
    }
  };
  const updateDepositRow = (id, field, value) => {
    setDepositRows(prevRows =>
      prevRows.map(row =>
        row.id === id ? { ...row, [field]: value } : row
      )
    );
  };

  const addMoreDepositRow = () => {
    const newId = Math.max(...depositRows.map(row => row.id)) + 1;
    setDepositRows(prevRows => [
      ...prevRows,
      {
        id: newId,
        isSingle: "",
        minLimit: "",
        maxLimit: "",
        unit: "ml",
        value: "",
      }
    ]);
  };

  const removeDepositRow = (id) => {
    if (depositRows.length > 1) {
      setDepositRows(prevRows => prevRows.filter(row => row.id !== id));
    }
  };

  const handleAddDepositCategory = async () => {
    // Validate required fields
    if (
      !depositCategory.zoneId ||
      !depositCategory.material
    ) {
      error_toaster("Please fill in Zone and Material Name");
      return;
    }

    // Validate deposit rows
    const invalidRows = depositRows.filter(row => 
      !row.isSingle || !row.minLimit || !row.maxLimit || !row.value
    );

    if (invalidRows.length > 0) {
      error_toaster("Please fill in all fields for all deposit details rows");
      return;
    }

    try {
      setLoading(true);

      const requestPayload = {
        name: depositCategory.material,
        zoneId: depositCategory.zoneId,
        list: depositRows.map(row => ({
          maxLimit: parseInt(row.maxLimit) || 0,
          minLimit: parseInt(row.minLimit) || 0,
          value: parseFloat(row.value) || 0,
          unit: row.unit || "ml",
          scope: row.isSingle || ""
        }))
      };

      console.log("API Request Payload:", requestPayload);

      const response = await PostAPI(
        "admin/addDepositCategory",
        requestPayload
      );

      if (response?.data?.status === "1") {
        success_toaster(
          response?.data?.message || "Deposit category added successfully!"
        );

        // Reset form
        setDepositCategory({
          zoneId: "",
          material: "",
        });
        setDepositRows([
          {
            id: 1,
            isSingle: "",
            minLimit: "",
            maxLimit: "",
            unit: "ml",
            value: "",
          }
        ]);
        reFetch(); // Refresh the data
      } else {
        error_toaster(
          response?.data?.message || "Failed to add deposit category"
        );
      }
    } catch (error) {
      console.error("Error adding deposit category:", error);
      error_toaster("An error occurred while adding deposit category");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form
    setDepositCategory({
      zoneId: "",
      material: "",
    });
    setDepositRows([
      {
        id: 1,
        isSingle: "",
        minLimit: "",
        maxLimit: "",
        unit: "ml",
        value: "",
      }
    ]);
    info_toaster("Form cancelled");
  };

  return (
    <Layout
      content={
        <div className="bg-themeGray p-5">
          <div className="bg-white rounded-lg p-5">
              <div className="w-full flex justify-between items-center mb-6">
              <div>
                <h2 className="text-themeRed text-lg font-bold font-norms">
                  {t("Deposits")}
                </h2>
              </div>
              <div className="flex gap-2 items-center flex-wrap">
                <div data-testid="deposit-helment">
                  <Helment
                    search={true}
                    searchOnChange={(e) => setSearch(e.target.value)}
                    searchValue={search}
                    csvdata={tableData}
                  />
                </div>
              </div>
            </div>
            {/* Add Deposit Category Form */}
            <div className="space-y-6 mt-10">
              {/* First Row: Zone and Material Name */}
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1 relative z-10">
                  <label
                    htmlFor="zone"
                    className="text-black font-switzer font-semibold"
                  >
                    {t("Zone")}
                  </label>
                  <Select
                    placeholder="Select Zone"
                    name="zone"
                    options={zoneOptions}
                    onChange={(e) =>
                      setDepositCategory({
                        ...depositCategory,
                        zoneId: e?.value,
                      })
                    }
                    value={
                      zoneOptions.find(
                        (option) => option.value === depositCategory.zoneId
                      ) || null
                    }
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="material"
                    className="text-black font-switzer font-semibold"
                  >
                    {t("Material Name")}
                  </label>
                  <Select
                    placeholder="Select Material"
                    name="material"
                    options={[
                      { value: "PET", label: "PET" },
                      { value: "METAL", label: "METAL" },
                      { value: "GLASS", label: "GLASS" },
                    ]}
                    onChange={(e) =>
                      setDepositCategory({
                        ...depositCategory,
                        material: e?.value,
                      })
                    }
                    value={
                      depositCategory.material !== ""
                        ? {
                            value: depositCategory.material,
                            label: depositCategory.material,
                          }
                        : null
                    }
                  />
                </div>
              </div>

              {/* Dynamic Rows for Min Limit, Max Limit, Unit, Value */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">{t("Deposit Details")}</h3>
                {depositRows.map((row, index) => (
                  <div key={row.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="grid grid-cols-5 gap-4">
                      <div className="space-y-1">
                        <label
                          htmlFor={`isSingle-${row.id}`}
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Deposit Type")}
                        </label>
                        <Select
                          placeholder="Select"
                          name={`isSingle-${row.id}`}
                          options={[
                            { value: "single", label: "Single" },
                            { value: "multiple", label: "Multiple" },
                          ]}
                          onChange={(e) =>
                            updateDepositRow(row.id, "isSingle", e?.value)
                          }
                          value={
                            row.isSingle !== ""
                              ? row.isSingle === "single"
                                ? { value: "single", label: "Single" }
                                : { value: "multiple", label: "Multiple" }
                              : null
                          }
                        />
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor={`minLimit-${row.id}`}
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Min Limit")}
                        </label>
                        <input
                          value={row.minLimit}
                          type="number"
                          name={`minLimit-${row.id}`}
                          id={`minLimit-${row.id}`}
                          placeholder="Enter min limit..."
                          className="bg-white w-full h-10 px-3 rounded-md outline-none border border-gray-300"
                          onChange={(e) =>
                            updateDepositRow(row.id, "minLimit", e.target.value)
                          }
                        />
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor={`maxLimit-${row.id}`}
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Max Limit")}
                        </label>
                        <input
                          value={row.maxLimit}
                          type="number"
                          name={`maxLimit-${row.id}`}
                          id={`maxLimit-${row.id}`}
                          placeholder="Enter max limit..."
                          className="bg-white w-full h-10 px-3 rounded-md outline-none border border-gray-300"
                          onChange={(e) =>
                            updateDepositRow(row.id, "maxLimit", e.target.value)
                          }
                        />
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor={`unit-${row.id}`}
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Unit")}
                        </label>
                        <input
                          value="ml"
                          type="text"
                          name={`unit-${row.id}`}
                          id={`unit-${row.id}`}
                          readOnly
                          className="bg-gray-100 w-full h-10 px-3 rounded-md outline-none cursor-not-allowed border border-gray-300"
                        />
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor={`value-${row.id}`}
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Value")}
                        </label>
                        <div className="flex gap-2">
                          <input
                            value={row.value}
                            type="number"
                            name={`value-${row.id}`}
                            id={`value-${row.id}`}
                            placeholder="Enter value..."
                            className="bg-white w-full h-10 px-3 rounded-md outline-none border border-gray-300"
                            onChange={(e) =>
                              updateDepositRow(row.id, "value", e.target.value)
                            }
                          />
                          {depositRows.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeDepositRow(row.id)}
                              className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition-colors"
                            >
                              {t("Remove")}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add More Button */}
                <div className="flex justify-start">
                  <button
                    type="button"
                    onClick={addMoreDepositRow}
                    className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 transition-colors flex items-center gap-1 text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    {t("Add More")}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-x-2 my-7">
              <BlackButton text={t("Cancel")} onClick={handleCancel} />
              <RedButton
                text={loading ? t("Adding...") : t("Add Deposit Category")}
                onClick={handleAddDepositCategory}
                disabled={loading}
              />
            </div>

            {/* Edit Modal */}
            {editModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-themeRed">
                      {t("Edit Deposit Category")}
                    </h3>
                    <button
                      onClick={handleCancelEdit}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* First Row: Zone and Material Name */}
                    <div className="grid grid-cols-2 gap-5">
                      <div className="space-y-1 relative z-10">
                        <label
                          htmlFor="editZone"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Zone")}
                        </label>
                        <Select
                          placeholder="Select Zone"
                          name="editZone"
                          options={zoneOptions}
                          onChange={(e) =>
                            setEditingCategory({
                              ...editingCategory,
                              zoneId: e?.value,
                            })
                          }
                          value={
                            zoneOptions.find(
                              (option) => option.value === editingCategory?.zoneId
                            ) || null
                          }
                        />
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor="editMaterial"
                          className="text-black font-switzer font-semibold"
                        >
                          {t("Material Name")}
                        </label>
                        <Select
                          placeholder="Select Material"
                          name="editMaterial"
                          options={[
                            { value: "PET", label: "PET" },
                            { value: "METAL", label: "METAL" },
                            { value: "GLASS", label: "GLASS" },
                          ]}
                          onChange={(e) =>
                            setEditingCategory({
                              ...editingCategory,
                              material: e?.value,
                            })
                          }
                          value={
                            editingCategory?.material !== ""
                              ? {
                                  value: editingCategory.material,
                                  label: editingCategory.material,
                                }
                              : null
                          }
                        />
                      </div>
                    </div>

                    {/* Dynamic Rows for Min Limit, Max Limit, Unit, Value */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-700">{t("Deposit Details")}</h3>
                      {editDepositRows.map((row, index) => (
                        <div key={row.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                          <div className="grid grid-cols-5 gap-4">
                            <div className="space-y-1">
                              <label
                                htmlFor={`editIsSingle-${row.id}`}
                                className="text-black font-switzer font-semibold"
                              >
                                {t("Deposit Type")}
                              </label>
                              <Select
                                placeholder="Select"
                                name={`editIsSingle-${row.id}`}
                                options={[
                                  { value: "single", label: "Single" },
                                  { value: "multiple", label: "Multiple" },
                                ]}
                                onChange={(e) =>
                                  updateEditDepositRow(row.id, "isSingle", e?.value)
                                }
                                value={
                                  row.isSingle !== ""
                                    ? row.isSingle === "single"
                                      ? { value: "single", label: "Single" }
                                      : { value: "multiple", label: "Multiple" }
                                    : null
                                }
                              />
                            </div>

                            <div className="space-y-1">
                              <label
                                htmlFor={`editMinLimit-${row.id}`}
                                className="text-black font-switzer font-semibold"
                              >
                                {t("Min Limit")}
                              </label>
                              <input
                                value={row.minLimit}
                                type="number"
                                name={`editMinLimit-${row.id}`}
                                id={`editMinLimit-${row.id}`}
                                placeholder="Enter min limit..."
                                className="bg-white w-full h-10 px-3 rounded-md outline-none border border-gray-300"
                                onChange={(e) =>
                                  updateEditDepositRow(row.id, "minLimit", e.target.value)
                                }
                              />
                            </div>

                            <div className="space-y-1">
                              <label
                                htmlFor={`editMaxLimit-${row.id}`}
                                className="text-black font-switzer font-semibold"
                              >
                                {t("Max Limit")}
                              </label>
                              <input
                                value={row.maxLimit}
                                type="number"
                                name={`editMaxLimit-${row.id}`}
                                id={`editMaxLimit-${row.id}`}
                                placeholder="Enter max limit..."
                                className="bg-white w-full h-10 px-3 rounded-md outline-none border border-gray-300"
                                onChange={(e) =>
                                  updateEditDepositRow(row.id, "maxLimit", e.target.value)
                                }
                              />
                            </div>

                            <div className="space-y-1">
                              <label
                                htmlFor={`editUnit-${row.id}`}
                                className="text-black font-switzer font-semibold"
                              >
                                {t("Unit")}
                              </label>
                              <input
                                value="ml"
                                type="text"
                                name={`editUnit-${row.id}`}
                                id={`editUnit-${row.id}`}
                                readOnly
                                className="bg-gray-100 w-full h-10 px-3 rounded-md outline-none cursor-not-allowed border border-gray-300"
                              />
                            </div>

                            <div className="space-y-1">
                              <label
                                htmlFor={`editValue-${row.id}`}
                                className="text-black font-switzer font-semibold"
                              >
                                {t("Value")}
                              </label>
                              <div className="flex gap-2">
                                <input
                                  value={row.value}
                                  type="number"
                                  name={`editValue-${row.id}`}
                                  id={`editValue-${row.id}`}
                                  placeholder="Enter value..."
                                  className="bg-white w-full h-10 px-3 rounded-md outline-none border border-gray-300"
                                  onChange={(e) =>
                                    updateEditDepositRow(row.id, "value", e.target.value)
                                  }
                                />
                                {editDepositRows.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeEditDepositRow(row.id)}
                                    className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition-colors"
                                  >
                                    {t("Remove")}
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-x-2 mt-6">
                    <BlackButton
                      text={t("Cancel")}
                      onClick={handleCancelEdit}
                    />
                    <RedButton
                      text={
                        loading
                          ? t("Updating...")
                          : t("Update Deposit Category")
                      }
                      onClick={handleUpdateDepositCategory}
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* Delete Confirmation Modal */}
            {deleteModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-themeRed">
                      {t("Confirm Delete")}
                    </h3>
                    <button
                      onClick={handleCancelDelete}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-gray-700">
                      {t("Are you sure you want to delete this deposit category? This action cannot be undone.")}
                    </p>
                  </div>
                  
                  <div className="flex justify-end gap-x-2">
                    <BlackButton text={t("Cancel")} onClick={handleCancelDelete} />
                    <RedButton
                      text={loading ? t("Deleting...") : t("Delete")}
                      onClick={handleConfirmDelete}
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>
            )}

            <h2 className="text-themeRed text-lg font-bold font-norms">
              {t("Our Deposits")}
            </h2>
            <div className="bg-white rounded-lg shadow">
              <MyDataTable
                columns={columns}
                data={tableData}
                progressPending={loading}
                pagination
                paginationPerPage={10}
                paginationRowsPerPageOptions={[10, 20, 30]}
                highlightOnHover
                pointerOnHover
              />
            </div>
          </div>
        </div>
      }
    />
  );
}
