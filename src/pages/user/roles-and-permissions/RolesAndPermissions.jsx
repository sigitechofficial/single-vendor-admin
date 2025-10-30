import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Layout from "../../../components/Layout";
import Helment from "../../../components/Helment";
import MyDataTable from "../../../components/MyDataTable";
import RedButton, { EditButton } from "../../../utilities/Buttons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import Loader from "../../../components/Loader";
import GetAPI from "../../../utilities/GetAPI";
import dayjs from "dayjs";
import {
  error_toaster,
  info_toaster,
  success_toaster,
} from "../../../utilities/Toaster";
import { PostAPI } from "../../../utilities/PostAPI";
import { LiaUsersCogSolid } from "react-icons/lia";
import CustomCheckbox from "../../../components/CustomCheckbox";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";

export default function RolesAndPermissions() {
  const { t } = useTranslation();
  const { data: dataPermission, reFetch: permissionsRefetch } = GetAPI(
    "admin/get_permissions"
  );
  const { data: dataRole, reFetch: roleRefetch } = GetAPI(
    "admin/allactiveroles"
  );

  const [search, setSearch] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [rolename, setRoleName] = useState("");
  const [modal, setModal] = useState(false);
  const [loader, setLoader] = useState(false);
  const [modalType, setModalType] = useState("");
  const [permissionId, setPermissionId] = useState("");
  const [addPermission, setAddPermission] = useState("");
  const [updatePermission, setUpdatePermission] = useState("");
  const [permissionDat, setPermissionDat] = useState({
    roleId: "",
    permissions: [],
  });

  // Helper function to filter roles based on search
  const permissionData = () => {
    return dataRole?.data?.filter(
      (dat) =>
        search === "" ||
        dat?.id?.toString().includes(search.toLowerCase()) ||
        dat?.name?.toLowerCase().includes(search.toLowerCase())
    );
  };

  // Handling checkbox changes
  const handleCheckboxChange = (permissionId, isChecked) => {
    setPermissionDat((prevState) => {
      const permissions = isChecked
        ? [...prevState.permissions, permissionId]
        : prevState.permissions.filter((id) => id !== permissionId);
      return { ...prevState, permissions };
    });
  };

  // Handle "Select All" checkbox change
  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);
    setPermissionDat((prevState) => ({
      ...prevState,
      permissions: isChecked
        ? dataPermission?.data?.map((item) => item?.id)
        : [],
    }));
  };

  // Update permissions for a role
  const updatePermissions = async () => {
    let exist = dataRole?.data?.some(
      (item) =>
        item?.name?.toLowerCase().trim() === rolename?.toLowerCase().trim()
    );

    // if (!permissionDat.roleId) {
    //   info_toaster(t("pleaseSelectRole"));
    //   return;
    // }
    if (!permissionDat.permissions.length) {
      info_toaster(t("pleaseSelectPermission"));
      return;
    }

    setLoader(true);
    const res = await PostAPI("admin/addRoleAndPermissions", {
      roleName: exist ? null : rolename,
      roleId: exist ? permissionDat.roleId : null,
      list: permissionDat.permissions,
    });
    setLoader(false);

    if (res?.data?.status === "1") {
      success_toaster(res?.data?.message);
      roleRefetch();
      setPermissionDat({ roleId: "", permissions: [] });
      setRoleName("");
    } else {
      error_toaster(res?.data?.message);
    }
  };

  const deleteRole = async (id) => {
    const res = await PostAPI("admin/deleteRole", { roleId: id });
    if (res?.data?.status === "1") {
      success_toaster(res?.data?.message);
      roleRefetch();
      setPermissionDat({ roleId: "", permissions: [] });
    } else {
      error_toaster(res?.data?.message);
    }
  };

  const columns = [
    { field: "sn", header: t("serialNo") },
    { field: "id", header: t("id") },
    { field: "name", header: t("name") },
    { field: "action", header: t("action") },
  ];

  // Prepare data for the table
  const datas = permissionData()?.map((values, index) => ({
    sn: index + 1,
    id: values?.id,
    name: values?.name,
    action: (
      <div className="flex gap-x-2">
        {/* <EditButton
          text={t("update")}
          onClick={() => {
            setRoleName(values?.name);
            setPermissionDat({ ...permissionDat, roleId: values?.id });
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }}
        />

        <RedButton text={t("Delete")} onClick={() => deleteRole(values?.id)} /> */}

        <FaRegEdit
          size={25}
          className="cursor-pointer text-black"
          onClick={() => {
            setRoleName(values?.name);
            setPermissionDat({ ...permissionDat, roleId: values?.id });
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }}
        />
        <RiDeleteBin6Line
          size={27}
          className="cursor-pointer text-red-500"
          onClick={() => deleteRole(values?.id)}
        />
      </div>
    ),
  }));

  useEffect(() => {
    if (permissionDat?.permissions.length === dataPermission?.data?.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [permissionDat?.permissions.length]);

  return dataRole?.length === 0 ? (
    <Loader />
  ) : (
    <Layout
      content={
        <div className="bg-themeGray p-5 font-switzer">
          <div className="bg-white rounded-lg p-5">
            <div className="flex justify-between items-center flex-wrap gap-5">
              <h2 className="text-themeRed text-lg font-bold font-norms">
                {t("Employee Role")}
              </h2>
            </div>

            <div className="mt-10">
              <h2 className=" text-lg font-bold flex items-center gap-x-2">
                <LiaUsersCogSolid size="35" />
                {t("Employee Roles")}
              </h2>

              <p className="mt-5 mb-2 text-base font-bold">Role Name </p>

              <input
                className="border-2 border-gray-300 rounded-md w-full outline-none px-4 py-2 duration-300 hover:border-green-700 focus:border-green-700"
                placeholder="Role Name..."
                type="text"
                onChange={(e) => setRoleName(e.target.value)}
                data-testid="roles-role-name-input"
                value={rolename}
              />
            </div>

            <div className="font-switzer">
              <div className="my-10 mb-2 flex items-center gap-x-4">
                <p className="text-base font-medium">Set Permissions</p>
                <div className="flex items-center gap-x-2">
                  <CustomCheckbox
                    id="#selectAll"
                    onChange={handleSelectAll}
                    type="checkbox"
                    checked={selectAll}
                    data-testid="roles-selectall-chk"
                  />
                  <label className=" cursor-pointer" htmlFor="#selectAll">
                    Select ALL
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 xl:grid-cols-6 gap-y-5 sm:gap-y-10 mt-10">
                {dataPermission?.data?.map((per, ind) => (
                  <div
                    key={ind}
                    className="flex items-center gap-2 overflow-ellipsis"
                  >
                    <CustomCheckbox
                      type="checkbox"
                      name="permissions"
                      id={`permission-${ind}`}
                      className="w-4 h-4 bg-themeBorderGray"
                      onChange={(e) =>
                        handleCheckboxChange(per.id, e.target.checked)
                      }
                      checked={permissionDat.permissions.includes(per.id)}
                      data-testid={`roles-permission-${per?.id}-chk`}
                    />
                    <label
                      htmlFor={`permission-${ind}`}
                      className="text-themeBorderGray font-switzer text-xs sm:text-base cursor-pointer"
                    >
                      {per.title}
                    </label>
                  </div>
                ))}
              </div>
                <div className="w-full flex justify-end mt-10" data-testid="roles-update-btn">
                  <RedButton text={t("Update")} onClick={updatePermissions} />
                </div>
            </div>

            <div className="mt-10">
              <h2 className="text-lg font-bold">{t("Roles Table")}</h2>
              <MyDataTable columns={columns} data={datas} />
            </div>
          </div>
        </div>
      }
    />
  );
}
