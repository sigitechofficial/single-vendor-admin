import React from "react";

export default function EarningCards(props) {
  return (
    <div className="bg-white p-2.5 rounded-md shadow-lg h-[150px]">
      <div className="flex flex-col gap-5 justify-center items-center h-full">
        <div className="text-base font-medium font-switzer text-center">
          {props?.title}
        </div>

        <div className="text-xl font-semibold font-switzer">
          CHF {props?.earning ? props?.earning.toFixed(2) : "0.00"}
        </div>
      </div>
    </div>
  );
}
