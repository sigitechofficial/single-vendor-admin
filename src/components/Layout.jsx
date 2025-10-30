import React, { useEffect } from "react";
import Header from "./Header";
import SideBar from "./SideBar";
import Main from "./Main";
import { useNavigate } from "react-router-dom";
import { info_toaster } from "../utilities/Toaster";

export default function Layout(props) {
  const navigate = useNavigate();
  useEffect(() => {
    if (
      !localStorage.getItem("loginStatus") ||
      !localStorage.getItem("accessToken")
    ) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("loginStatus");
      localStorage.removeItem("userEmail");
      navigate("/login");
      info_toaster("Please Login First");
    }
  }, [navigate]);
  return (
    <>
      <SideBar />
      <Header />
      <Main content={props?.content} />
    </>
  );
}
