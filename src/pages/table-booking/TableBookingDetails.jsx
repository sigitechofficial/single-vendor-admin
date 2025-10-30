import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import Layout from "../../components/Layout";
import { useLocation, useParams } from "react-router-dom";
import Loader from "../../components/Loader";
import GetAPI from "../../utilities/GetAPI";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

export default function tableBookingDetails() {
  const location = useLocation();
  const { id: orderId } = useParams();
  // const [data, setData] = useState("");
  const { data } = GetAPI(`admin/getBookingById/${orderId}`);
  const { t } = useTranslation();

  console.log(data, "datacheck");
  return data?.length === 0 ? (
    <Loader />
  ) : (
    <Layout
      content={
        <div className="bg-themeGray p-5 mb-[300px]">
          <div className="rounded-lg p-5 space-y-5">
            <div className="flex gap-5 items-center">
              <button
                className="bg-themeGray p-2 rounded-full"
                onClick={() => window.history.back()}
              >
                <FaArrowLeft />
              </button>
              <div className="flex flex-col">
                <h2 className="text-themeRed text-lg font-bold font-norms">
                  {t("Table Booking Details")}
                </h2>
              </div>
            </div>
            {/* ================ */}
            <div className="w-full flex gap-8 px-12">
              <div className="flex-1 shadow-md p-5 bg-white">
                <h2 className="text-themeRed text-lg font-bold font-norms">
                  {t("Customer Details")}
                </h2>
                <div className="flex justify-between mt-2">
                  <p className="font-medium text-lg">{t("Customer Name")}</p>
                  <p className="text-gray-400 font-semibold">
                    {data?.data?.user?.userName}
                  </p>
                </div>
                <div className="flex justify-between mt-2">
                  <p className="font-medium text-lg">{t("Email")}</p>
                  <p className="text-gray-400 font-semibold">
                    {data?.data?.user?.email}
                  </p>
                </div>
                <div className="flex justify-between mt-2">
                  <p className="font-medium text-lg">{t("Phone")} #</p>
                  <p className="text-gray-400 font-semibold">{`${data?.data?.user?.countryCode} ${data?.data?.user?.phoneNum}`}</p>
                </div>
                <div className="flex justify-between mt-2">
                  <p className="font-medium text-lg">{t("Delivery Address")}</p>
                  <p className="text-gray-400 font-semibold">{t("Name")}</p>
                </div>
              </div>
              <div className="flex-1 shadow-md p-5 bg-white">
                <h2 className="text-themeRed text-lg font-bold font-norms">
                  {t("Restaurant Details")}
                </h2>
                <div className="flex justify-between mt-2">
                  <p className="font-medium text-lg">{t("Restaurant Name")}</p>
                  <p className="text-gray-400 font-semibold">
                    {data?.data?.restaurant?.businessName}
                  </p>
                </div>
                <div className="flex justify-between mt-2">
                  <p className="font-medium text-lg">{t("Delivery Address")}</p>
                  <p className="text-gray-400 font-semibold">
                    {data?.data?.restaurant?.address}
                  </p>
                </div>
                <div className="flex justify-between mt-2">
                  <p className="font-medium text-lg">{t("Phone")} #</p>
                  <p className="text-gray-400 font-semibold">{` ${data?.data?.restaurant?.countryCode} ${data?.data?.restaurant?.phoneNum}`}</p>
                </div>
              </div>
              <div className="flex-1 shadow-md p-5 bg-white">
                <h2 className="text-themeRed text-lg font-bold font-norms">
                  {t("Order Details")} #76578
                </h2>
                <div className="flex justify-between mt-2">
                  <p className="font-medium text-lg">{t("Created at")}</p>
                  <p className="text-gray-400 font-semibold">
                    {data?.data?.createdAt
                      ? dayjs(data?.data?.createdAt).format("DD-MM-YYYY")
                      : "N/A"}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <p className="font-medium text-lg">{t("Order Status")}</p>
                  <p className=" bg-green-200 font-norms font-medium text-green-600 px-2">
                    {data?.data?.orderStatus?.name}
                  </p>
                </div>
                <div className="flex justify-between mt-2">
                  <p className="font-medium text-lg">{t("Person")}</p>
                  <p className="text-gray-400 font-semibold">Standard</p>
                </div>
                <div className="flex justify-between mt-2">
                  <p className="font-medium text-lg">{t("Date")}</p>
                  <p className="text-gray-400 font-semibold">
                    {data?.data?.date}
                  </p>
                </div>
                <div className="flex justify-between mt-2">
                  <p className="font-medium text-lg">{t("Time")}</p>
                  <p className="text-gray-400 font-semibold">
                    {data?.data?.time}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    />
  );
}
