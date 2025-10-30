import React, { useContext } from "react";
import { ToggleContext } from "../utilities/ContextApi";

export default function Main(props) {
  const { isToggled, setIsToggled, show } = useContext(ToggleContext);
  return (
    <main
      className={`${
        isToggled ? "w-full" : "w-[calc(100%-280px)]"
      }  float-right relative top-[66px] bg-themeGray min-h-[calc(100vh-66px)] duration-500 ease-[cubic-bezier(0.68,-0.6,0.32,1.6)] space-y-6 ${
        show ? "w-full" : "max-lg:w-full"
      }`}
    >
      {props?.content}
    </main>
  );
}
