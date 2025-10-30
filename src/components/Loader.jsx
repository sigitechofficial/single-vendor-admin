import React from "react";
import { Bars } from "react-loader-spinner";

export default function Loader() {
  return (
    <section className="fixed h-screen w-full bg-theme bg-cover bg-no-repeat z-[100] flex justify-center items-center">
      <Bars width={100} height={100} color="#E13743" visible={true} />
    </section>
  );
}

export function MiniLoader() {
  return (
    <section className="absolute h-full w-full top-0 left-0 z-[100] flex justify-center items-center">
      <Bars width={100} height={100} color="#E13743" visible={true} />
    </section>
  );
}
