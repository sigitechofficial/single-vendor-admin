import React from "react";

export default function ReportsCard(props) {
  return (
    <div className="bg-white px-2.5 py-5 rounded-md shadow-lg">
      <div className="flex flex-col gap-3 justify-center items-center w-full h-full">
        <div>
          <img
            src={`/images/${props.image}.webp`}
            alt={`card-${props.image}`}
            className="w-20 h-16 object-contain"
          />
        </div>
        <div className="text-2xl font-medium text-center font-norms">
          {props?.total ? props?.total : "0"}
        </div>
        <div className="text-base font-medium text-center font-norms">
          {props.title}
        </div>
      </div>
    </div>
  );
}
