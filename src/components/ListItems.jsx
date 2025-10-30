import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function ListItems(props) {
  const location = useLocation().pathname;
  const { Icon } = props;

  return (
    <Link
      data-testid={`listitems-${props.title?.toLowerCase().replace(/\s+/g, '') || 'link'}-link`}
      className={`flex gap-x-2 justify-between items-center py-2 lg:py-3 px-2 rounded-md duration-200
        ${
          location === props.to || props.active
            ? "text-white bg-themeRed font-medium rounded-lg text-sm  text-center"
            : "bg-transparent text-themeLightGray"
        }
        hover:bg-themeRed hover:text-white
      `}
      to={props.to}
    >
      <div className="flex items-center gap-x-2">
        <Icon size={20} />
        <h1 className="font-norms font-medium text-xs lg:text-sm">{props.title}</h1>
      </div>
    </Link>
  );
}

