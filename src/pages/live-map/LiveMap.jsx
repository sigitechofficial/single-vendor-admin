import React, { useState, useContext, useEffect, useRef } from "react";
import Select from "react-select";
import { IoMdHome } from "react-icons/io";
import { MdDirectionsBike } from "react-icons/md";
import { GoogleMap, LoadScript, Marker, InfoWindow, Polygon, useJsApiLoader } from "@react-google-maps/api";
import Loader from "../../components/Loader";
import { ToggleContext } from "../../utilities/ContextApi";
import Layout from "../../components/Layout";
import GetAPI from "../../utilities/GetAPI";
import { PostAPI } from "../../utilities/PostAPI";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

const LiveMap = () => {
    const { data } = GetAPI("admin/getAllZones");
    const [libraries] = useState(["places", "drawing"]);
    const [activeDriver, setActiveDriver] = useState();
    const [redMarker, setRedMarker] = useState();
    const { t } = useTranslation();
    const [polygon, setPolygon] = useState([]);
    const [center, setCenter] = useState({
        lat: 31.5497, 
        lng: 74.3436 
    });
    const { isToggled, setIsToggled } = useContext(ToggleContext);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [activeMarker, setActiveMarker] = useState();
    const [showingInfoWindow, setShowingInfoWindow] = useState(false);
    const [zoneData, setZoneData] = useState({
        zone: { value: "1", label: "zone1" },
    });
    let zoneOptions = [];


    data?.data?.forEach((z) => {
        zoneOptions.push({
            value: z?.zoneDetail?.zoneId,
            label: z?.name,
        });
    });
    // ==========Set Zoom Level==========
    const [mapInstance, setMapInstance] = useState(null);
    useEffect(() => {
        if (mapInstance && polygon.length) {
            const bounds = new window.google.maps.LatLngBounds();
            polygon.forEach((coords) => {
                bounds.extend(new window.google.maps.LatLng(coords.lat, coords.lng));
            });
            mapInstance.fitBounds(bounds);
            mapInstance.setZoom(Math.min(mapInstance.getZoom(), 15));
        }
    }, [polygon, mapInstance]);

    const onMapLoad = (map) => {
        setMapInstance(map);
    };

    // ==========GetActiveZonesFunction==========
    const activeZone = async () => {
        const res = await PostAPI("admin/zoneActiveDrivers", {
            zoneId: zoneData?.zone?.value,
        });

        if (res?.data?.status === "1") {
            setActiveDriver(res?.data?.data);

            if (res?.data?.data?.activeDrivers[0]?.zoneDetail?.coordinates?.coordinates) {
                const initialCoordinates = res.data.data.activeDrivers[0].zoneDetail.coordinates.coordinates[0].map(([lat, lng]) => ({
                    lat,
                    lng,
                }));
                setPolygon(initialCoordinates);
            }
        }
    };
    console.log(activeDriver, "activeDriver")
    console.log(polygon, "polygone")

    useEffect(() => {
        activeZone();
    }, [zoneData?.zone]);


    const containerStyle = {
        width: "100%",
        height: "600px",
    };

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyCYC3-gTg2XJFIeo9fura6PoNuQzzPeBlc",
        libraries,
    });

    const onMarkerClick = (place, marker) => {
        setSelectedPlace(place);
        setActiveMarker(marker);
        setShowingInfoWindow(true);
    };

    const onInfoWindowClose = () => {
        setActiveMarker(null);
        setShowingInfoWindow(false);
    };

    if (loadError) {
        return <div>Error loading maps</div>;
    }

    if (!isLoaded) {
        return <Loader />;
    }

    const customIcon = {
        url: "/images/grayMarker.png",
        scaledSize: new window.google.maps.Size(40, 40),
    };
    const activeIcon = {
        url: "/images/redMarker.png",
        scaledSize: new window.google.maps.Size(60, 60),
    };
    const customStyles = {
        control: (base, state) => ({
            ...base,
            background: "#fff",
            borderRadius: state.isFocused ? "3px 3px 0 0" : 3,
            borderColor: state.isFocused ? "green" : "gray",
            boxShadow: state.isFocused ? null : null,
            "&:hover": {
                borderColor: state.isFocused ? "red" : "blue",
            },
        }),
        menu: (base) => ({
            ...base,
            borderRadius: 0,
            marginTop: 0,
        }),
        menuList: (base) => ({
            ...base,
            padding: 0,
        }),
    };

    const handleClick = (lat, lng, id) => {
        setCenter({ lat, lng });
        setRedMarker(id);
    };

    // ===========================


    return (
        <>
            < Layout content={<>
                <div className='bg-[#faf4f8] px-5 py-8 w-full'>
                    <div className='w-full rounded-md bg-white h-full pb-10 '>
                        <div className='flex justify-between items-center w-[90%] mx-auto py-5' >
                            <h4 className='text-themeRed text-lg font-bold font-norms'>{t("Active Couriers")}</h4>
                            <div className='w-[300px]'>
                                <Select
                                    styles={customStyles}
                                    placeholder="Select"
                                    name="distanceUnitId"
                                    options={zoneOptions}
                                    onChange={(e) => {
                                        setZoneData({ ...zoneData, zone: zoneOptions.find(el => el.value === e?.value) });
                                    }
                                    }
                                    value={zoneData?.zone}
                                />
                            </div>
                        </div>

                        {activeDriver?.activeDrivers?.length > 0 && <div className="w-[90%] mx-auto flex gap-2 mb-10">
                            <div className="w-[70%] space-y-4 ">
                                <div className="flex gap-x-4 [&>div]:py-5">
                                    <div className="rounded-xl shadow-xl bg-white flex-1 px-6 font-semibold space-y-2">
                                        <p className="text-2xl">{activeDriver?.totalActiveDrivers}</p>
                                        <p>Active Delivery Man</p>
                                    </div>
                                    <div className="rounded-xl shadow-xl bg-white flex-1 px-6 font-semibold space-y-2">
                                        <p className="text-2xl">{activeDriver?.driversWithoutOrders}</p>
                                        <p>Available to Assign More Orders</p>
                                    </div>
                                </div>
                                <div className="flex gap-x-4 [&>div]:py-5">
                                    <div className="rounded-xl shadow-xl bg-white flex-1 px-6 font-semibold space-y-2">
                                        <p className="text-2xl">6</p>
                                        <p>Fully Booked Delivery Man</p>
                                    </div>
                                    <div className="rounded-xl shadow-xl bg-white flex-1 px-6 font-semibold space-y-2">
                                        <p className="text-2xl">{activeDriver?.totalInactiveDrivers}</p>
                                        <p>Inactive Delivery Man</p>
                                    </div>
                                </div>
                            </div>
                            <div className="w-[30%] [&>div]:rounded-xl [&>div]:shadow-xl [&>div]:bg-white [&>div]:px-6 [&>div]:py-[17px] [&>div]:font-semibold [&>div]:flex [&>div]:justify-between [&>div]:items-center space-y-3">
                                <div className="">
                                    <p>Unassigned Orders</p>
                                    <p className="text-2xl">{activeDriver?.totalUnassignedOrders}</p>
                                </div>
                                <div >
                                    <p>Available by Delivery Man</p>
                                    <p className="text-2xl">6</p>
                                </div>
                                <div >
                                    <p>Out For Delivery</p>
                                    <p className="text-2xl">6</p>
                                </div>
                            </div>
                        </div>}


                        {/* ================= */}
                        <div className='w-[90%] mx-auto flex relative'>
                            <div className='w-[30%] min-w-[300px] h-full bg-white shadow-2xl rounded-xl py-8 absolute top-0 left-0 z-10 overflow-auto'>
                                <div className=" w-full flex justify-center"><button className='bg-green-700 rounded-full text-white px-4 py-1 shadow-md duration-200 text-lg font-semibold font-norms border-green-700 border-[1px]  hover:bg-transparent hover:border-[1px] hover:text-green-700'>{t("Active Courier")}</button></div>

                                {activeDriver?.activeDrivers?.length > 0 ? activeDriver?.activeDrivers?.map((item, i) => {
                                    return (
                                        <div key={i} className='w-[92%] mx-auto border-gray-200 border-[2px] rounded-xl px-3 py-3 mt-3 cursor-pointer hover:border-gray-400' onClick={() => handleClick(item?.location?.lat, item?.location?.lng, item?.location?.id)}>
                                            {item?.assigned && <div className='flex justify-between'><p className='font-norms font-semibold text-lg'>{item?.orderData?.orderNum ? item?.orderData?.orderNum : "N/A "}</p> <div className='flex flex-col justify-center items-center'><p>{dayjs(item?.orderData?.createdAt).format("DD/MM/YYYY h:mm A")}</p> <p className={`${item?.assigned ? "bg-green-700" : "bg-gray-400"}  rounded-md px-2 text-white mt-1`}>{item?.assigned ? t("Assigned") : t("Not Assigned")}</p></div></div>}                                            <div className='flex gap-3'>
                                                <IoMdHome className='text-green-700' size={20} />
                                                {item?.assigned && <div>
                                                    <p className='font-medium font-norms'>Deliver to {item.orderData.dropOffID.user.userName ? item.orderData.dropOffID.user.userName : ""}</p>
                                                    <p className='text-gray-400'>{item?.orderData?.dropOffID?.streetAddress ? item?.orderData?.dropOffID?.streetAddress : "N/A"}</p>
                                                </div>}
                                            </div>
                                            <div className='flex gap-3 mt-3'>
                                                <MdDirectionsBike className='text-green-700' size={20} />
                                                <div>
                                                    <p className='font-medium font-norms'>{`${item?.courier?.firstName} ${item?.courier?.lastName}`}</p>

                                                </div>
                                            </div>
                                        </div>
                                    )
                                }) : <p className="text-center mt-10 text-lg font-medium font-norms text-gray-500">{t("No Active Courier")}</p>}

                            </div>

                            {/* =====================Google Maps========================= */}
                            <div className='w-[70.2%] bg-slate-600 ml-[29.5%]'>
                                <div className="">

                                    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={14} onLoad={onMapLoad} >
                                        {activeDriver?.activeDrivers?.map((driver, i) => {
                                            return (
                                                <Marker
                                                    key={i}
                                                    position={{
                                                        lat: driver?.location?.lat,
                                                        lng: driver?.location?.lng
                                                    }}
                                                    icon={redMarker == driver?.location?.id ? activeIcon : customIcon}
                                                    onClick={() => onMarkerClick({ name: "Current location" }, { position: center })}
                                                />
                                            )
                                        })}
                                        {polygon.length > 2 &&
                                            <Polygon
                                                paths={polygon}
                                                options={{
                                                    strokeColor: '#FF0000',
                                                    strokeOpacity: 0.8,
                                                    strokeWeight: 2,
                                                    fillColor: '#ff0000a4',
                                                    fillOpacity: 0.35,
                                                    clickable: true,
                                                    // editable: true,
                                                    // draggable: true,
                                                    // geodesic: true,
                                                }}
                                            />
                                        }

                                        {showingInfoWindow && (
                                            <InfoWindow position={activeMarker.position} onCloseClick={onInfoWindowClose}>
                                                <div>
                                                    <h1>{selectedPlace.name}</h1>
                                                </div>
                                            </InfoWindow>
                                        )}
                                    </GoogleMap>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>} />
        </>
    )
}

export default LiveMap






