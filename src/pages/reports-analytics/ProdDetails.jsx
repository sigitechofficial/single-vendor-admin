import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import Layout from "../../components/Layout";
import { useTranslation } from "react-i18next";
import GetAPI from "../../utilities/GetAPI";
import { BASE_URL } from "../../utilities/URL";
import { useLocation } from "react-router-dom";
import Loader from "../../components/Loader";

const ProdDetails = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const id = location?.state?.id;
  const getData = GetAPI(`admin/productDetails/${id}`);

  const data = getData?.data?.data?.product || [];

  return data?.length === 0 ? (
    <Loader />
  ) : (
    <>
      <Layout
        content={
          <div className="bg-themeGray p-5 space-y-5 font-switzer">
            <div className="flex flex-col gap-5 items-center bg-white rounded-md p-5 pb-16">
              <div className="w-full flex justify-between items-center">
                <h2 className="text-themeRed text-lg font-bold font-norms">
                  {t(`${data?.name}`)}
                </h2>
              </div>

              <div className="w-full grid grid-cols-2 gap-5 rounded-md p-5">
                <div>
                  <img
                    src={BASE_URL + data?.image}
                    alt="image"
                    className="w-52 h-48 object-cover rounded-md"
                  />
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <img
                    src={BASE_URL + data?.R_MCLink?.restaurant?.image}
                    alt="image"
                    className="w-52 h-32 object-cover rounded-md"
                  />
                  <p>{data?.R_MCLink?.restaurant?.businessName}</p>
                  <p>{data?.R_MCLink?.restaurant?.address}</p>
                </div>
              </div>

              <div className="w-full grid grid-cols-6  rounded-md p-5 [&>div]:bg-gray-100 [&>div]:py-4 font-semibold font-switzer">
                <div className=" pl-3  rounded-tl-lg">Short description</div>
                <div>Nutrition</div>
                <div>Allergy</div>
                <div>Stock</div>
                <div>Price</div>
                <div className=" rounded-tr-lg">Tags</div>
              </div>

              <div className="w-full grid grid-cols-6 gap-5 rounded-md p-5">
                <div className="text-sm text-gray-500">{data?.description}</div>
                <div>
                  <p> {data?.nutrients}</p>
                  <p>
                    {data?.fat &&
                      "Fat :" +
                        JSON.parse(data?.fat)?.value +
                        JSON.parse(data?.fat)?.unit}
                  </p>
                  <p>
                    {data?.energy &&
                      "Energy :" +
                        JSON.parse(data?.energy)?.value +
                        JSON.parse(data?.energy)?.unit}
                  </p>
                  <p>
                    {data?.protein &&
                      "Protein :" +
                        JSON.parse(data?.protein)?.value +
                        JSON.parse(data?.protein)?.unit}
                  </p>
                  <p>
                    {data?.salt &&
                      "Salt :" +
                        JSON.parse(data?.salt)?.value +
                        JSON.parse(data?.salt)?.unit}
                  </p>
                  <p>
                    {data?.saturated_fat &&
                      "Saturated fat :" +
                        JSON.parse(data?.saturated_fat)?.value +
                        JSON.parse(data?.saturated_fat)?.unit}
                  </p>
                  <p>
                    {data?.sugar &&
                      "Sugar :" +
                        JSON.parse(data?.sugar)?.value +
                        JSON.parse(data?.sugar)?.unit}
                  </p>
                </div>
                <div>
                  <p> {data?.allergies}</p>
                </div>
                <div>500</div>
                <div>
                  <p>Price : {data?.originalPrice}</p>
                  <p>Discount : {data?.discountPrice}</p>
                </div>

                <div>
                  {data?.productTags &&
                    JSON.parse(data?.productTags)?.map((item) => <p>{item}</p>)}
                </div>
              </div>

              {/* <div className="w-full">
                <h4 className="font-semibold text-lg pl-5">Product reviews</h4>
                <div className="w-full grid grid-cols-6 rounded-md p-5 [&>div]:bg-gray-100 [&>div]:py-4 font-semibold font-switzer">
                  <div className="pl-3 rounded-tl-lg">Review Id</div>
                  <div>Reviewer</div>
                  <div>Review</div>
                  <div>Date</div>
                  <div>Restaurant reply</div>
                  <div className=" rounded-tr-lg">Status</div>
                </div>
              </div> */}
            </div>
          </div>
        }
      />
    </>
  );
};

export default ProdDetails;
