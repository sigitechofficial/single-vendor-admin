import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next'; // Import useTranslation
import Layout from "../../../components/Layout";
import Helment from "../../../components/Helment";
import MyDataTable from "../../../components/MyDataTable";
import RedButton, { BlackButton, EditButton } from "../../../utilities/Buttons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import Select from "react-select";
import GetAPI from "../../../utilities/GetAPI";
import Loader, { MiniLoader } from "../../../components/Loader";
import {
  error_toaster,
  info_toaster,
  success_toaster,
} from "../../../utilities/Toaster";
import { PostAPI } from "../../../utilities/PostAPI";
import axios from "axios";
import { BASE_URL } from "../../../utilities/URL";

export default function Roles() {
  const { t } = useTranslation(); // Use the t function
  const { data, reFetch } = GetAPI("admin/allactiveroles");
  const permission = GetAPI("admin/get_permissions");
  const [modal, setModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [loader, setLoader] = useState(false);
  const [role, setRole] = useState("");
  const [search, setSearch] = useState("");
  const [permissionData, setPermissionData] = useState({
    roleId: "",
    permissions: [],
  });
  const [updatePermission, setUpdatePermission] = useState({
    roleId: "",
    permissions: [],
  });

  const roleData = () => {
    const filteredData = data?.data?.filter((dat) => {
      return (
        search === "" ||
        (dat?.id && dat?.id.toString().includes(search.toLowerCase())) ||
        (dat?.name && dat?.name.toLowerCase().includes(search.toLowerCase()))
      );
    });
    return filteredData;
  };

  const openModal = (type, id) => {
    setModalType(type);
    setModal(true);
    setUpdatePermission({ ...updatePermission, roleId: id });
  };

  const roles = [];
  data?.data?.map((role, index) =>
    roles.push({
      value: role?.id,
      label: role?.name,
    })
  );

  const handleCheckboxChange = (permissionId, isChecked) => {
    setPermissionData((prevState) => {
      const { permissions } = prevState;
      if (isChecked) {
        return {
          ...prevState,
          permissions: [...permissions, permissionId],
        };
      } else {
        return {
          ...prevState,
          permissions: permissions.filter((id) => id !== permissionId),
        };
      }
    });
  };

  const addRole = async () => {
    if (role === "") {
      info_toaster(t("pleaseEnterRoleName"));
    } else {
      setLoader(true);
      const res = await PostAPI("admin/addRole", {
        name: role,
      });
      if (res?.data?.status === "1") {
        setLoader(false);
        reFetch();
        setModal(false);
        success_toaster(res?.data?.message);
      } else {
        setLoader(false);
        error_toaster(res?.data?.message);
      }
    }
  };

  const assignPermission = async () => {
    if (permissionData?.roleId === "") {
      info_toaster(t("pleaseSelectRole"));
    } else if (permissionData?.permissions.length === 0) {
      info_toaster(t("pleaseSelectPermission"));
    } else {
      setLoader(true);
      const res = await PostAPI("admin/assign_permissions_to_role", {
        roleId: permissionData?.roleId,
        permissions: permissionData?.permissions,
      });

      if (res?.data?.status === "1") {
        setLoader(false);
        reFetch();
        setModal(false);
        success_toaster(res?.data?.message);
        setPermissionData({
          roleId: "",
          permissions: [],
        });
      } else {
        setLoader(false);
        error_toaster(res?.data?.message);
      }
    }
  };

  const updateCheckBox = (permissionId) => {
    setUpdatePermission((current) => {
      const isPresent = current?.permissions?.includes(permissionId);
      const newPermissions = isPresent
        ? current.permissions.filter((id) => id !== permissionId)
        : [...current.permissions, permissionId];
      return { ...current, permissions: newPermissions };
    });
  };

  const update = async () => {
    setLoader(true);
    const res = await PostAPI("admin/update_role_permissions", {
      roleId: updatePermission?.roleId,
      permissions: updatePermission?.permissions,
    });

    if (res?.data?.status === "1") {
      setLoader(false);
      reFetch();
      setModal(false);
      success_toaster(res?.data?.message);
      setUpdatePermission({
        roleId: "",
        permissions: [],
      });
    } else {
      setLoader(false);
      error_toaster(res?.data?.message);
    }
  };

  useEffect(() => {
    if (modal && updatePermission?.roleId) {
      const fetchData = () => {
        const config = {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        };
        axios
          .get(
            `${BASE_URL}admin/get_role_permissions/${updatePermission?.roleId}`,
            config
          )
          .then((response) => {
            if (response?.data?.data) {
              const permissionIds = response?.data?.data.map(
                (permission) => permission?.permission?.id
              );
              setUpdatePermission((prevState) => ({
                ...prevState,
                permissions: permissionIds,
              }));
            }
          })
          .catch((error) => {
            console.error("Error fetching data: ", error);
          });
      };

      fetchData();
    }
  }, [modal, updatePermission?.roleId]);

  const columns = [
    { field: "sn", header: t('serialNo') },
    { field: "id", header: t('roleId') },
    { field: "name", header: t('name') },
    { field: "action", header: t('action') },
  ];

  const datas = [];
  const csv = [];
  roleData()?.map((values, index) => {
    csv.push({
      sn: index + 1,
      id: values?.id,
      name: values?.name,
    });
    return datas.push({
      sn: index + 1,
      id: values?.id,
      name: values?.name,
      action: (
        <div>
          <EditButton
            text={t('edit')}
            onClick={() => openModal("Edit Permission", values?.id)}
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
                {t('allRoles')}
              </h2>
              <div className="flex gap-2 items-center flex-wrap">
                <Helment
                  search={true}
                  searchOnChange={(e) => setSearch(e.target.value)}
                  searchValue={search}
                  csvdata={csv}
                />
                <div className="flex gap-2">
                  <BlackButton
                    text={t('addRole')}
                    onClick={() => openModal("Add Role")}
                  />
                  <RedButton
                    text={t('assignPermissions')}
                    onClick={() => openModal("Assign Permission")}
                  />
                </div>
              </div>
            </div>

            <div>
              <MyDataTable columns={columns} data={datas} />
            </div>
          </div>

          <Modal onClose={() => setModal(false)} isOpen={modal} isCentered>
            <ModalOverlay />
            <ModalContent>
              <ModalCloseButton
                onClick={() =>
                  setUpdatePermission((prevState) => ({
                    ...prevState,
                    permissions: [],
                  }))
                }
              />
              <ModalBody padding={4}>
                {loader ? (
                  <div className="h-[200px]">
                    <MiniLoader />
                  </div>
                ) : modalType === "Add Role" ? (
                  <div className="space-y-5">
                    <div className="border-b-2 border-b-[#0000001F] text-lg font-norms font-medium">
                      {t('addNewRole')}
                    </div>

                    <div className="space-y-1">
                      <label
                        htmlFor="name"
                        className="text-black font-norms font-medium"
                      >
                        {t('role')}
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                        onChange={(e) => {
                          setRole(e.target.value);
                        }}
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <BlackButton
                        text={t('cancel')}
                        onClick={() => {
                          setModal(false);
                        }}
                      />
                      <RedButton text={t('add')} onClick={addRole} />
                    </div>
                  </div>
                ) : modalType === "Assign Permission" ? (
                  <div className="space-y-5">
                    <div className="border-b-2 border-b-[#0000001F] text-lg font-norms font-medium">
                      {t('assignPermission')}
                    </div>

                    <div>
                      <Select
                        placeholder={t('select')}
                        options={roles}
                        onChange={(e) =>
                          setPermissionData({
                            ...permissionData,
                            roleId: e?.value,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="font-norms font-medium text-base">
                        {t('permissions')}
                      </div>
                      <div className="grid grid-cols-3 gap-5 items-center">
                        {permission?.data?.data?.map((per, ind) => (
                          <div key={ind} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              name="permissions"
                              id={`permission-${ind}`}
                              className="w-4 h-4 bg-themeBorderGray"
                              onChange={(e) =>
                                handleCheckboxChange(per.id, e.target.checked)
                              }
                            />
                            <label
                              htmlFor={`permission-${ind}`}
                              className="text-themeBorderGray font-switzer"
                            >
                              {per.title}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <BlackButton
                        text={t('cancel')}
                        onClick={() => {
                          setModal(false);
                        }}
                      />
                      <RedButton text={t('assign')} onClick={assignPermission} />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div className="border-b-2 border-b-[#0000001F] text-lg font-norms font-medium">
                      {t('editPermissionRole')}
                    </div>

                    <div>
                      <Select
                        placeholder={t('select')}
                        options={roles}
                        onChange={(e) =>
                          setUpdatePermission({
                            ...updatePermission,
                            roleId: e?.value,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="font-norms font-medium text-base">
                        {t('permissions')}
                      </div>
                      <div className="grid grid-cols-3 gap-5 items-center">
                        {permission?.data?.data?.map((per, ind) => (
                          <div key={ind} className="flex items-center gap-2">
                            <input
                              value={per.id}
                              type="checkbox"
                              name="permissions"
                              id={`permission-${ind}`}
                              className="w-4 h-4 bg-themeBorderGray"
                              checked={
                                updatePermission?.permissions.includes(per.id)
                                  ? true
                                  : false
                              }
                              onChange={(e) => updateCheckBox(per.id)}
                            />
                            <label
                              htmlFor={`permission-${ind}`}
                              className="text-themeBorderGray font-switzer"
                            >
                              {per.title}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <BlackButton
                        text={t('cancel')}
                        onClick={() => {
                          setModal(false);
                          setUpdatePermission((prevState) => ({
                            ...prevState,
                            permissions: [],
                          }));
                        }}
                      />
                      <RedButton text={t('assign')} onClick={update} />
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
