import React from "react";
import MyDataTable from "../../../components/MyDataTable";
import Helment from "../../../components/Helment";
import { FaArrowLeft, FaWallet } from "react-icons/fa";
import RedButton, { BlackButton, TabButton } from "../../../utilities/Buttons";

export default function ProductDetails() {
  const [tab, setTab] = useState("Item Details");
  return (
    <Layout
      content={
        <div className="bg-themeGray p-5">
          <div className="bg-white rounded-lg p-5 h-screen">
            <div className="flex gap-5 items-center">
              <button
                className="bg-themeGray p-2 rounded-full"
                onClick={() => window.history.back()}
              >
                <FaArrowLeft />
              </button>
              <h2 className="text-themeRed text-lg font-bold font-norms">
                {tab === "Item Details" ? (
                  "Item Details"
                ) : tab === "Addon’s" ? (
                  "Addon’s"
                ) : (
                  <></>
                )}
              </h2>
            </div>

            <div className="py-5 space-y-1.5">
              <ul className="flex flex-wrap items-center gap-8">
                <TabButton
                  title="Item Details"
                  tab={tab}
                  onClick={() => setTab("Item Details")}
                />
                <TabButton
                  title="Addon’s"
                  tab={tab}
                  onClick={() => setTab("Addon’s")}
                />
              </ul>
              <div className={`w-full bg-[#00000033] h-[1px]`}></div>
            </div>

            {tab === "User Detail" ? (
              <div className="space-y-3">
                <div>
                  <img
                    src="/images/profile.webp"
                    alt="profile"
                    className="w-32 h-32 object-cover rounded-full"
                  />
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label
                      htmlFor="firstName"
                      className="text-black font-switzer font-semibold"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firtName"
                      id="firtName"
                      className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label
                      htmlFor="lastName"
                      className="text-black font-switzer font-semibold"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      id="lastName"
                      className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label
                      htmlFor="email"
                      className="text-black font-switzer font-semibold"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                    />
                  </div>

                  <div className="space-y-1 col-span-2">
                    <label
                      htmlFor="password"
                      className="text-black font-switzer font-semibold"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-2 col-span-2 justify-end">
                    <RedButton text="Block Driver" />
                    <BlackButton text="Update User" />
                  </div>
                </div>
              </div>
            ) : tab === "Orders" ? (
              <div className="space-y-5">
                <Helment   csvdata={datas}/>
                <MyDataTable columns={columns} />
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      }
    />
  );
}
