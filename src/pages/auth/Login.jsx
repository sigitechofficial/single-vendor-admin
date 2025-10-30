import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@chakra-ui/react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { BlackButton } from "../../utilities/Buttons";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { loginSchema } from "../../schemas";
import { errorStyle } from "../../utilities/Input";
import { loginAPI } from "../../utilities/PostAPI";
import { setLoginStatus } from "../../utilities/AuthCheck";
import { error_toaster, success_toaster } from "../../utilities/Toaster";
import { MiniLoader } from "../../components/Loader";
import { createSocketConnection } from "../../utilities/socket";

export default function Login() {
  const navigate = useNavigate();
  const [modal, setModal] = useState(true);
  const [visible, setVisible] = useState(false);
  const [loader, setLoader] = useState(false);
  const [rememberMe, setRememberMe] = useState(
    localStorage.getItem("rememberMe") || false
  );

  const initialValues = {
    email: localStorage.getItem("rememberedEmail") || "",
    password: localStorage.getItem("rememberedPassword") || "",
  };

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    resetForm,
  } = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, action) => {
      setLoader(true);
      let res = await loginAPI("admin/login", {
        email: values.email,
        password: values.password,
        dvToken: "182378xnp9d0s83u21809xhddchn08132cdxu89s0m3n",
      });

      if (res?.data?.status === "1") {
        setLoader(false);
        localStorage.setItem("accessToken", res?.data?.data?.accessToken);
        localStorage.setItem("userId", res?.data?.data?.id);
        localStorage.setItem("userEmail", res?.data?.data?.email);
        localStorage.setItem("userName", res?.data?.data?.name);
        localStorage.setItem("rememberMe", rememberMe);
        localStorage.setItem(
          "permissions",
          JSON.stringify(res?.data?.data?.permissions)
        );
        setLoginStatus(true);

        if (rememberMe) {
          localStorage.setItem("rememberedEmail", values.email);
          localStorage.setItem("rememberedPassword", values.password);
        } else {
          localStorage.removeItem("rememberedEmail");
          localStorage.removeItem("rememberedPassword");
          localStorage.removeItem("rememberMe");
        }

        // Create socket connection after successful login
        const socket = createSocketConnection(res?.data?.data?.id?.toString());

        navigate("/");
        success_toaster("Login Successfully");
      } else {
        setLoader(false);
        error_toaster("Error");
      }
      action.resetForm();
    },
  });

  const handleRememberMe = () => {
    setRememberMe(!rememberMe);
  };

  return (
    <div className="bg-theme w-full h-screen">
      <Modal isOpen={modal} size={"xl"} isCentered>
        <ModalOverlay />
        <ModalContent borderRadius={"20px"}>
          <ModalHeader>
            <div className="flex flex-col gap-3 items-center justify-center">
              <div>
                <img src="/images/logo-red.webp" alt="logo" className="w-32" />
              </div>
              <div>
                <h3 className="font-semibold text-2xl font-switzer">
                  Login to Dashboard
                </h3>
                <p className="font-normal text-base text-black text-opacity-60 font-switzer">
                  Enter your credentials below
                </p>
              </div>
            </div>
          </ModalHeader>
          {loader ? (
            <div className="h-[380px]">
              <MiniLoader />
            </div>
          ) : (
            <ModalBody padding={0}>
              <div className="mt-2 mb-5 space-y-5 px-7 h-[calc(100vh-280px)] overflow-auto">
                <form
                  className="space-y-5 border-b border-b-themeBorderGray pb-10"
                  onSubmit={handleSubmit}
                >
                  <div className={errors.email && touched.email && errorStyle}>
                    <div className="flex flex-col gap-y-2">
                      <label
                        htmlFor="email"
                        className="text-labelColor font-medium font-futura"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="border border-inputBorder rounded-md outline-none px-3 py-2"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {errors.email && touched.email && (
                        <div className="text-red-500">
                          <p>{errors.email}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div
                    className={
                      errors.password && touched.password && errorStyle
                    }
                  >
                    <div className="flex flex-col gap-y-2 relative">
                      <label
                        htmlFor="password"
                        className="text-labelColor font-medium font-futura"
                      >
                        Password
                      </label>
                      <input
                        type={visible ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        className="border border-inputBorder rounded-md outline-none px-3 py-2"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <button
                        onClick={() => setVisible(!visible)}
                        type="button"
                        className="text-labelColor absolute right-4 top-10"
                      >
                        {visible ? (
                          <AiOutlineEye size={24} />
                        ) : (
                          <AiOutlineEyeInvisible size={24} />
                        )}
                      </button>

                      {errors.password && touched.password && (
                        <div className="text-red-600">
                          <p>{errors.password}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-x-2 items-center">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      className="w-4 h-4"
                      checked={rememberMe}
                      onChange={handleRememberMe}
                    />
                    <label
                      htmlFor="rememberMe"
                      className="font-switzer font-semibold"
                    >
                      Remember Me
                    </label>
                  </div>
                  <button
                    type="submit"
                    className="py-2.5 px-5 w-full font-semibold text-base text-white bg-themeRed border border-themeRed rounded hover:bg-transparent hover:text-themeRed duration-200"
                  >
                    Login
                  </button>
                </form>

                <div className="flex gap-3 justify-center items-center">
                  <BlackButton text="Register For Store" />
                  {/* <RedButton text="Sign In As Admin" /> */}
                </div>
              </div>
            </ModalBody>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
