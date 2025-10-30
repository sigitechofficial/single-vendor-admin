import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function ListHead(props) {
  const {
    Icon,
    Angle,
    hasPermission,
    searchTab,
    title,
    nestedItems = [],
  } = props;
  const location = useLocation().pathname;

  const normalizedSearch = searchTab?.trim().toLowerCase();
  const normalizedTitle = title?.trim().toLowerCase();

  const isMatchInNestedItems = nestedItems?.some((item) =>
    item?.trim()?.toLowerCase().includes(normalizedSearch)
  );

  const isVisible =
    hasPermission(title) &&
    (normalizedTitle.includes(normalizedSearch) ||
      isMatchInNestedItems ||
      searchTab === "");

  if (!isVisible) return null;

  return (
    <li className="px-3">
      <Link
        to={props.to}
        className="space-y-1"
        data-testid={`listhead-${props.title?.toLowerCase().replace(/\s+/g, '') || 'link'}-link`}
      >
        <div
          className={`flex gap-x-2 justify-between items-center py-2 lg:py-3 px-2 rounded-md duration-200
            ${
              location === props.to || props.active
                ? "text-white bg-themeRed font-medium rounded-lg text-sm text-center"
                : "bg-transparent text-themeLightGray"
            }
            hover:bg-themeRed hover:text-white
          `}
          onClick={props.onClick}
        >
          <div className="flex items-center gap-x-1">
            <Icon size={22} />
            <h1 className="font-norms font-medium text-sm lg:text-base">
              {props.title}
            </h1>
          </div>

          <button data-testid={`listhead-${props.title?.toLowerCase().replace(/\s+/g,'') || 'angle'}-btn`}>{Angle && <Angle />}</button>
        </div>
        <hr className="w-full opacity-25" />
      </Link>
    </li>
  );
}
