import React from "react";
import { FiPackage } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function HomeCards(props) {
  return (
    <Link to={props.to} data-testid={props.dataTestId}>
      <div className="bg-white p-2.5 rounded-md shadow-lg">
        <div className="flex flex-col gap-5 justify-center items-center h-full">
          <div>
            <img
              src={`/images/home-${props.image}.webp`}
              alt={`card-${props.image}`}
              className="w-20 h-16 object-contain"
            />
          </div>
          <div className="text-xl font-medium font-norms">{props.title}</div>
        </div>
      </div>
    </Link>
  );
}
