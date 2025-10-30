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

export default function VatCategories() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [editModal, setEditModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deletingCategoryId, setDeletingCategoryId] = useState(null);

  const filterOptions = GetAPI("admin/filterOptions");
  const { data: vatCategoriesData, reFetch } = GetAPI("admin/getVatCategories");
  console.log("VAT Categories Data:", vatCategoriesData);

  const [vatCategory, setVatCategory] = useState({
    zoneId: "",
    name: "",
    value: "",
  });

  // Sample data - replace with actual API call
  useEffect(() => {
    // Data will come from vatCategoriesData API
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

  // Filter VAT categories data
  const filterData = () => {
    const query = search?.trim().toLowerCase() || "";
    const categories =
      vatCategoriesData?.data?.categories || vatCategoriesData?.data || [];

    if (!Array.isArray(categories)) return [];

    return categories.filter((item) => {
      return (
        item?.id?.toString()?.includes(query) ||
        item?.name?.toLowerCase()?.includes(query) ||
        item?.value?.toString()?.includes(query)
      );
    });
  };

  const columns = [
    { field: "id", header: t("ID") },
    { field: "name", header: t("Name") },
    { field: "value", header: t("Value") },
    { field: "zoneId", header: t("Zone ID") },
    { field: "action", header: t("Actions") },
  ];

  // Prepare data for table with proper field mapping
  const tableData =
    filterData()?.map((item, index) => ({
      id: item.id,
      name: item.name,
      value: `${parseFloat(item.value || 0).toFixed(2)}%`,
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
            onClick={() => handleDelete(item.id)}
          />
        </div>
      ),
    })) || [];

  const handleEdit = (categoryData) => {
    console.log("Edit VAT category:", categoryData);
    setEditingCategory({
      id: categoryData.id,
      zoneId: categoryData.zoneId,
      name: categoryData.name,
      value: categoryData.value,
    });
    setEditModal(true);
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
        id: deletingCategoryId,
      };

      console.log("Delete API Request Payload:", requestPayload);

      const response = await PostAPI("admin/deleteVatCategory", requestPayload);

      console.log("Delete API Response:", response);

      if (response?.data?.status === "1") {
        success_toaster(
          response?.data?.message || "VAT category deleted successfully!"
        );
        reFetch(); // Refresh the data
      } else {
        error_toaster(
          response?.data?.message || "Failed to delete VAT category"
        );
      }
    } catch (error) {
      console.error("Error deleting VAT category:", error);
      error_toaster("An error occurred while deleting VAT category");
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

  const handleUpdateVatCategory = async () => {
    // Validate required fields
    if (
      !editingCategory.id ||
      !editingCategory.name ||
      !editingCategory.value
    ) {
      error_toaster("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);

      const requestPayload = {
        id: editingCategory.id,
        name: editingCategory.name,
        zoneId: editingCategory.zoneId,
        value: parseFloat(editingCategory.value) || 0,
      };

      console.log("Edit API Request Payload:", requestPayload);

      const response = await PostAPI("admin/editVatCategory", requestPayload);

      if (response?.data?.status === "1") {
        success_toaster(
          response?.data?.message || "VAT category updated successfully!"
        );

        // Close modal and reset form
        setEditModal(false);
        setEditingCategory(null);
        reFetch(); // Refresh the data
      } else {
        error_toaster(
          response?.data?.message || "Failed to update VAT category"
        );
      }
    } catch (error) {
      console.error("Error updating VAT category:", error);
      error_toaster("An error occurred while updating VAT category");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditModal(false);
    setEditingCategory(null);
  };

  const handleAddVatCategory = async () => {
    // Validate required fields
    if (!vatCategory.zoneId || !vatCategory.name || !vatCategory.value) {
      error_toaster("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);

      const requestPayload = {
        name: vatCategory.name,
        zoneId: vatCategory.zoneId,
        value: parseFloat(vatCategory.value) || 0,
      };

      console.log("API Request Payload:", requestPayload);

      const response = await PostAPI("admin/addVatCategory", requestPayload);

      if (response?.data?.status === "1") {
        success_toaster(
          response?.data?.message || "VAT category added successfully!"
        );

        // Reset form
        setVatCategory({
          zoneId: "",
          name: "",
          value: "",
        });
        reFetch(); // Refresh the data
      } else {
        error_toaster(response?.data?.message || "Failed to add VAT category");
      }
    } catch (error) {
      console.error("Error adding VAT category:", error);
      error_toaster("An error occurred while adding VAT category");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form
    setVatCategory({
      zoneId: "",
      name: "",
      value: "",
    });
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
                  {t("VAT Categories")}
                </h2>
              </div>
              <div className="flex gap-2 items-center flex-wrap">
                <Helment
                  search={true}
                  searchOnChange={(e) => setSearch(e.target.value)}
                  searchValue={search}
                  csvdata={tableData}
                />
              </div>
            </div>
            {/* Add VAT Category Form */}
            <div className="grid grid-cols-3 gap-5 mt-10">
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
                    setVatCategory({
                      ...vatCategory,
                      zoneId: e?.value,
                    })
                  }
                  value={
                    zoneOptions.find(
                      (option) => option.value === vatCategory.zoneId
                    ) || null
                  }
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="name"
                  className="text-black font-switzer font-semibold"
                >
                  {t("Name")}
                </label>
                <input
                  value={vatCategory.name}
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Enter VAT category name..."
                  className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                  onChange={(e) =>
                    setVatCategory({
                      ...vatCategory,
                      name: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="value"
                  className="text-black font-switzer font-semibold"
                >
                  {t("Value (%)")}
                </label>
                <input
                  value={vatCategory.value}
                  type="number"
                  name="value"
                  id="value"
                  placeholder="Enter VAT percentage..."
                  className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                  onChange={(e) =>
                    setVatCategory({
                      ...vatCategory,
                      value: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="flex justify-end gap-x-2 my-7">
              <BlackButton text={t("Cancel")} onClick={handleCancel} />
              <RedButton
                text={loading ? t("Adding...") : t("Add VAT Category")}
                onClick={handleAddVatCategory}
                disabled={loading}
              />
            </div>

            {/* Edit Modal */}
            {editModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-themeRed">
                      {t("Edit VAT Category")}
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

                  <div className="grid grid-cols-3 gap-5">
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
                        htmlFor="editName"
                        className="text-black font-switzer font-semibold"
                      >
                        {t("Name")}
                      </label>
                      <input
                        value={editingCategory?.name || ""}
                        type="text"
                        name="editName"
                        id="editName"
                        placeholder="Enter VAT category name..."
                        className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                        onChange={(e) =>
                          setEditingCategory({
                            ...editingCategory,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-1">
                      <label
                        htmlFor="editValue"
                        className="text-black font-switzer font-semibold"
                      >
                        {t("Value (%)")}
                      </label>
                      <input
                        value={editingCategory?.value || ""}
                        type="number"
                        name="editValue"
                        id="editValue"
                        placeholder="Enter VAT percentage..."
                        className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                        onChange={(e) =>
                          setEditingCategory({
                            ...editingCategory,
                            value: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-x-2 mt-6">
                    <BlackButton
                      text={t("Cancel")}
                      onClick={handleCancelEdit}
                    />
                    <RedButton
                      text={
                        loading ? t("Updating...") : t("Update VAT Category")
                      }
                      onClick={handleUpdateVatCategory}
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

                  <div className="mb-6">
                    <p className="text-gray-700">
                      {t(
                        "Are you sure you want to delete this VAT category? This action cannot be undone."
                      )}
                    </p>
                  </div>

                  <div className="flex justify-end gap-x-2">
                    <BlackButton
                      text={t("Cancel")}
                      onClick={handleCancelDelete}
                    />
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
              {t("Our VAT Categories")}
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
