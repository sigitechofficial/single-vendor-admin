import React, { useState } from "react";
import Layout from "../../components/Layout";
import RedButton from "../../utilities/Buttons";
import { useTranslation } from "react-i18next";
import { TbWorld } from "react-icons/tb";
import { PostAPI } from "../../utilities/PostAPI";
import { success_toaster, error_toaster } from "../../utilities/Toaster";

export default function HeaderDesign() {
    const { t } = useTranslation();
    const [form, setForm] = useState({
        logo: null,
        title: "",
        shortText: "",
        backgroundImage: null,
        overlay: 0.5,
    });
    const [preview, setPreview] = useState({
        logoUrl: "",
        bgUrl: "",
    });

    const handleChange = (e) => {
        const { name, value, files, type } = e.target;
        if (type === "file") {
            const file = files?.[0] || null;
            setForm((p) => ({ ...p, [name]: file }));
            if (file) {
                const url = URL.createObjectURL(file);
                if (name === "logo") setPreview((p) => ({ ...p, logoUrl: url }));
                if (name === "backgroundImage")
                    setPreview((p) => ({ ...p, bgUrl: url }));
            }
        } else {
            setForm((p) => ({ ...p, [name]: value }));
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const fd = new FormData();
            fd.append("headerTitle", form.title);
            fd.append("headerDescription", form.shortText);
            fd.append("overLay", String(form.overlay));
            if (form.backgroundImage) fd.append("image", form.backgroundImage);

            const res = await PostAPI("admin/addHeroSection", fd);
            if (res?.data?.status === "1") {
                success_toaster(res?.data?.message || "Hero section saved");
            } else {
                error_toaster(res?.data?.message || "Failed to save hero section");
            }
        } catch (err) {
            error_toaster("Failed to save hero section");
        }
    };

    return (
        <Layout
            content={
                <div className="bg-themeGray p-5">
                    <div className="bg-white rounded-lg p-5 space-y-4">
                        <h2 className="text-themeRed text-lg font-bold font-norms">
                            {t("Header Design")}
                        </h2>
                        {/* Top Header Preview (logo + auth buttons) */}
                        <div className="w-full mx-auto bg-white rounded-md border border-themeBorder flex items-center justify-between px-4 py-1">
                            <div className="flex items-center gap-3">
                                {preview.logoUrl ? (
                                    <img
                                        src={preview.logoUrl}
                                        alt="logo"
                                        className="h-8 object-contain"
                                    />
                                ) : (
                                    <div className="h-8 w-20 bg-gray-200 rounded" />
                                )}
                            </div>
                            <div className="flex items-center gap-6">
                                <button
                                    type="button"
                                    className="text-sm text-gray-700 hover:text-themeRed font-semibold"
                                >
                                    {t("Log in")}
                                </button>
                                <button
                                    type="button"
                                    className="cursor-pointer text-sm bg-[#F8D5D7] text-themeRed font-semibold rounded-full px-5 py-2 hover:opacity-90"
                                >
                                    {t("Sign up")}
                                </button>
                                <TbWorld size={24} className="text-theme" />
                            </div>
                        </div>
                        {/* Live Preview */}
                        <div
                            className="relative rounded-lg overflow-hidden border border-themeBorder"
                            style={{
                                backgroundImage: preview.bgUrl
                                    ? `url(${preview.bgUrl})`
                                    : "linear-gradient(90deg,#f5f5f5,#eaeaea)",
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                        >
                            <div
                                className="absolute inset-0"
                                style={{
                                    backgroundColor: "#000",
                                    opacity: Number(form.overlay) || 0,
                                }}
                            />
                            <div className="relative flex flex-col items-center justify-center gap-3 px-6 py-32 text-center text-white">
                                <h3 className="text-3xl md:text-4xl font-bold font-norms">
                                    {form.title || t("Header Title")}
                                </h3>
                                <p className="max-w-3xl text-sm md:text-base opacity-90">
                                    {form.shortText || t("Short Text")}
                                </p>
                            </div>
                        </div>
                        <form className="grid grid-cols-2 gap-5" onSubmit={handleSubmit}>
                            <div className="space-y-1 col-span-2 md:col-span-1">
                                <label className="text-black font-switzer font-semibold">
                                    {t("Logo")}
                                </label>
                                <div className="flex items-center gap-3">
                                    <input
                                        id="logo"
                                        type="file"
                                        name="logo"
                                        accept="image/*"
                                        onChange={handleChange}
                                        className="hidden"
                                    />
                                    <label
                                        htmlFor="logo"
                                        className="cursor-pointer inline-flex items-center gap-2 bg-themeRed text-white text-sm rounded-md px-3 py-2 hover:opacity-90"
                                    >
                                        {t("Upload")}
                                    </label>
                                    {preview.logoUrl ? (
                                        <img src={preview.logoUrl} alt="logo" className="h-8 w-auto rounded" />
                                    ) : (
                                        <span className="text-xs text-gray-500">{t("No file chosen")}</span>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-1 col-span-2 md:col-span-1">
                                <label className="text-black font-switzer font-semibold">
                                    {t("Background Image")}
                                </label>
                                <div className="flex items-center gap-3">
                                    <input
                                        id="backgroundImage"
                                        type="file"
                                        name="backgroundImage"
                                        accept="image/*"
                                        onChange={handleChange}
                                        className="hidden"
                                    />
                                    <label
                                        htmlFor="backgroundImage"
                                        className="cursor-pointer inline-flex items-center gap-2 bg-gray-800 text-white text-sm rounded-md px-3 py-2 hover:opacity-90"
                                    >
                                        {t("Upload")}
                                    </label>
                                    {preview.bgUrl ? (
                                        <div className="h-8 w-12 rounded bg-cover bg-center" style={{ backgroundImage: `url(${preview.bgUrl})` }} />
                                    ) : (
                                        <span className="text-xs text-gray-500">{t("No file chosen")}</span>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-1 col-span-2">
                                <label className="text-black font-switzer font-semibold">
                                    {t("Header Title")}
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    className="bg-themeInput w-full h-10 px-3 rounded-md outline-none"
                                />
                            </div>

                            <div className="space-y-1 col-span-2">
                                <label className="text-black font-switzer font-semibold">
                                    {t("Short Text")}
                                </label>
                                <textarea
                                    name="shortText"
                                    rows={4}
                                    value={form.shortText}
                                    onChange={handleChange}
                                    className="bg-themeInput w-full p-3 rounded-md outline-none"
                                />
                            </div>

                            <div className="space-y-1 col-span-2 md:col-span-1">
                                <label className="text-black font-switzer font-semibold">
                                    {t("Overlay")}
                                </label>
                                <input
                                    type="range"
                                    name="overlay"
                                    min={0}
                                    max={1}
                                    step={0.01}
                                    value={form.overlay}
                                    onChange={handleChange}
                                    className="w-full accent-themeRed"
                                    style={{ accentColor: "#EE4A4A" }}
                                />
                                <div className="text-sm text-gray-600">
                                    {Number(form.overlay).toFixed(2)}
                                </div>
                            </div>

                            <div className="col-span-2 flex justify-end">
                                <RedButton text={t("Save")} onClick={handleSubmit} />
                            </div>
                        </form>
                    </div>
                </div>
            }
        />
    );
}
