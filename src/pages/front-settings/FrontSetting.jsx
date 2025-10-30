import Layout from "../../components/Layout";
import React, { useState, useRef, useMemo } from "react";
import JoditEditor from "jodit-react";
import GetAPI from "../../utilities/GetAPI";
import RedButton from "../../utilities/Buttons";
import { error_toaster, success_toaster } from "../../utilities/Toaster";
import { PostAPI } from "../../utilities/PostAPI";
import { MiniLoader } from "../../components/Loader";
import { useTranslation } from "react-i18next";

export default function FrontSetting() {
  const { data, reFetch } = GetAPI("admin/getSetting");
  const [loader, setLoader] = useState(false);
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const {t} = useTranslation();

  const update = async (id) => {
    setLoader(true);
    let res = await PostAPI("admin/updateSetting", {
      id: id,
      value: content,
    });
    if (res?.data?.status === "1") {
      reFetch();
      setLoader(false);
      success_toaster(res?.data?.message);
    } else {
      setLoader(false);
      error_toaster(res?.data?.message);
    }
  };

  return (
    <Layout
      content={
        <div className="bg-themeGray p-5">
          <div className="bg-white rounded-lg p-5 h-screen space-y-3">
            <h2 className="text-themeRed text-lg font-bold font-norms">
              {t("Front Settings")}
            </h2>

            {loader ? (
              <MiniLoader />
            ) : (
              <div className="space-y-5">
                {data?.data?.map((val, ind) => (
                  <div className="space-y-3">
                    <h4 className="text-2xl text-black font-medium font-norms">
                      {val?.content}
                    </h4>
                    <JoditEditor
                      ref={editor}
                      value={val?.value}
                      tabIndex={1}
                      onChange={(newContent) => {
                        setContent(newContent);
                      }}
                    />

                    <div className="flex justify-end">
                      <RedButton
                        text="Update"
                        onClick={() => update(val?.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      }
    />
  );
}
