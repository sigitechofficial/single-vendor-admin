import React, { useCallback, useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import Layout from "../../components/Layout";
import {
  GoogleMap,
  useLoadScript,
  Polygon,
  Autocomplete,
} from "@react-google-maps/api";
import Select from "react-select";
import GetAPI from "../../utilities/GetAPI";
import RedButton from "../../utilities/Buttons";
import { PostAPI } from "../../utilities/PostAPI";
import {
  error_toaster,
  info_toaster,
  success_toaster,
} from "../../utilities/Toaster";
import { MiniLoader } from "../../components/Loader";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { googleApiKey } from "../../utilities/URL";

export default function UpdateZone() {
  const location = useLocation();
  const zoneDetail = location?.state?.zoneData;
  const allUnits = GetAPI("admin/getallunits");
  const [center, setCenter] = useState({ lat: 31.5204, lng: 74.3587 });
  const [coordinates, setCoordinates] = useState([]);
  const [polygonPaths, setPolygonPaths] = useState([]);
  const [closed, setClosed] = useState(false);
  const [autocomplete, setAutocomplete] = useState(null);
  const [loader, setLoader] = useState(false);
  const [libraries] = useState(["places", "drawing"]);
  const { t } = useTranslation();
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: googleApiKey,
    libraries,
  });
  const filterOptions = GetAPI("admin/filterOptions");

  const cityOptions = [];
  if (filterOptions) {
    filterOptions?.data?.data?.city?.map((el) => {
      cityOptions.push({
        value: el?.id,
        label: el?.name,
      });
    });
  }

  const [zoneData, setZoneData] = useState({
    zoneId: zoneDetail?.zoneDetail?.zoneId,
    name: zoneDetail?.name,
    baseCharges: zoneDetail?.zoneDetail?.baseCharges,
    baseDistance: zoneDetail?.zoneDetail?.baseDistance,
    perKmCharges: zoneDetail?.zoneDetail?.perKmCharges,
    maxDeliveryCharges: zoneDetail?.zoneDetail?.maxDeliveryCharges,
    adminComission: zoneDetail?.zoneDetail?.adminComission,
    adminComissionOnDeliveryCharges:
      zoneDetail?.zoneDetail?.adminComissionOnDeliveryCharges,
    distanceUnitId: zoneDetail?.zoneDetail?.distanceUnitId,
    currencyUnitId: zoneDetail?.zoneDetail?.currencyUnitId,
    arr: "",
    city: "",
    penalty: "",
  });

  const handleOnEventChange = (e) => {
    setZoneData({ ...zoneData, [e.target.name]: e.target.value });
  };

  const containerStyle = {
    width: "100%",
    height: "325px",
  };

  const currencyUnitOptions = [];
  allUnits?.data?.data?.currencyUnits?.map((activeUnits) =>
    currencyUnitOptions.push({
      value: activeUnits?.id,
      label: `${activeUnits?.name} (${activeUnits?.symbol})`,
    })
  );

  const distanceUnitOptions = [];
  allUnits?.data?.data?.distanceUnits?.map((activeUnits) =>
    distanceUnitOptions.push({
      value: activeUnits?.id,
      label: `${activeUnits?.name} (${activeUnits?.symbol})`,
    })
  );

  const handlePlaceChanged = () => {
    const place = autocomplete.getPlace();
    if (place.geometry) {
      setCenter(place.geometry.location);
      map.setCenter(place.geometry.location);
      map.setZoom(15);
    }
  };

  useEffect(() => {
    if (zoneDetail?.coordinates?.coordinates) {
      const initialCoordinates = zoneDetail?.coordinates?.coordinates[0].map(
        ([lat, lng]) => ({
          lat,
          lng,
        })
      );
      setPolygonPaths(initialCoordinates);
      if (initialCoordinates.length > 2) {
        setClosed(true);
      }
    }
  }, [zoneDetail]);

  useEffect(() => {
    const formattedCoordinates = coordinates.map((coord) => [
      coord.lat,
      coord.lng,
    ]);
    setZoneData((prevZoneData) => ({
      ...prevZoneData,
      arr: formattedCoordinates,
    }));
  }, [coordinates]);

  const updateZone = async () => {
    if (zoneData?.name === "") {
      info_toaster("Please Add Business Zone Name");
    } else if (zoneData?.arr === "") {
      info_toaster("Please Select Coordinates On Map");
    } else if (zoneData?.baseCharges === "") {
      info_toaster("Please Add Base Charges");
    } else if (zoneData?.baseDistance === "") {
      info_toaster("Please Add Base Distance");
    } else if (zoneData?.perKmCharges === "") {
      info_toaster("Please Add Per Km Charges");
    } else if (zoneData?.maxDeliveryCharges === "") {
      info_toaster("Please Add Maximum Delivery Charges");
    } else if (zoneData?.adminComission === "") {
      info_toaster("Please Add Admin Comission");
    } else if (zoneData?.adminComissionOnDeliveryCharges === "") {
      info_toaster("Please Add Admin Comission On Delivery Charges");
    } else if (zoneData?.distanceUnitId === "") {
      info_toaster("Please Select Distance Unit");
    } else if (zoneData?.currencyUnitId === "") {
      info_toaster("Please Select Currency Unit");
    } else {
      setLoader(true);
      const res = await PostAPI("admin/updateZone", {
        zoneId: zoneDetail?.id,
        name: zoneData?.name,
        baseCharges: zoneData?.baseCharges,
        baseDistance: zoneData?.baseDistance,
        perKmCharges: zoneData?.perKmCharges,
        maxDeliveryCharges: zoneData?.maxDeliveryCharges,
        adminComission: zoneData?.adminComission,
        adminComissionOnDeliveryCharges:
          zoneData?.adminComissionOnDeliveryCharges,
        distanceUnitId: zoneData?.distanceUnitId?.value,
        currencyUnitId: zoneData?.currencyUnitId?.value,
        arr: zoneData?.arr,
        cityId: zoneData?.city?.value,
      });

      if (res?.data?.status === "1") {
        success_toaster(res?.data?.message);
        setLoader(false);
        setZoneData({
          name: "",
          baseCharges: "",
          baseDistance: "",
          perKmCharges: "",
          maxDeliveryCharges: "",
          adminComission: "",
          adminComissionOnDeliveryCharges: "",
          distanceUnitId: "",
          currencyUnitId: "",
          arr: [],
          penalty: "",
        });
      } else {
        error_toaster(res?.data?.message);
        setLoader(false);
      }
    }
  };

  const fitMapToPolygon = (map, polygonPaths) => {
    if (!map || polygonPaths.length === 0) return;

    const bounds = new window.google.maps.LatLngBounds();
    polygonPaths.forEach(({ lat, lng }) =>
      bounds.extend(new window.google.maps.LatLng(lat, lng))
    );
    map.fitBounds(bounds);
  };

  const initializeMap = useCallback(
    (map) => {
      if (!map) return;

      if (!window.google.maps.drawing) {
        console.error("Google Maps Drawing library is not loaded.");
        return;
      }

      const drawingManager = new window.google.maps.drawing.DrawingManager({
        drawingControl: true,
        drawingControlOptions: {
          position: window.google.maps.ControlPosition.left,
          drawingModes: ["polygon"],
        },
        polygonOptions: {
          strokeColor: "#FF0000",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#FF0000",
          fillOpacity: 0.35,
          clickable: true,
          editable: true,
          draggable: true,
          geodesic: true,
        },
      });

      drawingManager.setMap(map);

      const handlePolygonComplete = (polygon) => {
        const paths = polygon
          .getPath()
          .getArray()
          .map(({ lat, lng }) => ({ lat: lat(), lng: lng() }));
        setPolygonPaths(paths);
        fitMapToPolygon(map, paths);
        setZoneData((prevZoneData) => ({
          ...prevZoneData,
          arr: paths.map(({ lat, lng }) => [lat, lng]),
        }));
      };

      window.google.maps.event.addListener(
        drawingManager,
        "overlaycomplete",
        (event) => {
          if (event.type === "polygon") {
            handlePolygonComplete(event.overlay);
          }
        }
      );

      const handlePathChanged = (polygon) => {
        const paths = polygon
          .getPath()
          .getArray()
          .map(({ lat, lng }) => ({ lat: lat(), lng: lng() }));
        setPolygonPaths(paths);
        fitMapToPolygon(map, paths);
        setZoneData((prevZoneData) => ({
          ...prevZoneData,
          arr: paths.map(({ lat, lng }) => [lat, lng]),
        }));
      };

      const updatePolygonListeners = (polygon) => {
        window.google.maps.event.addListener(polygon.getPath(), "set_at", () =>
          handlePathChanged(polygon)
        );
        window.google.maps.event.addListener(
          polygon.getPath(),
          "insert_at",
          () => handlePathChanged(polygon)
        );
        window.google.maps.event.addListener(
          polygon.getPath(),
          "remove_at",
          () => handlePathChanged(polygon)
        );
      };

      // Initialize the editable polygon
      const editablePolygon = new window.google.maps.Polygon({
        paths: polygonPaths,
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
        clickable: true,
        editable: true,
        draggable: true,
        geodesic: true,
      });
      editablePolygon.setMap(map);
      updatePolygonListeners(editablePolygon);
      fitMapToPolygon(map, polygonPaths); // Fit map to the existing polygon
    },
    [polygonPaths]
  );

  return (
    <Layout
      content={
        <div className="bg-themeGray p-5">
          <div className="bg-white rounded-lg p-5 space-y-10">
            <div className="flex gap-5 items-center">
              <button
                className="bg-themeGray p-2 rounded-full"
                onClick={() => window.history.back()}
              >
                <FaArrowLeft />
              </button>
              <div className="flex flex-col">
                <h2 className="text-themeRed text-lg font-bold font-norms">
                  {t("Update Zone")}
                </h2>
              </div>
            </div>

            {loader ? (
              <MiniLoader />
            ) : (
              <div>
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label
                        htmlFor="name"
                        className="text-black font-switzer font-semibold"
                      >
                        {t("Business Zone Name")}
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        className="bg-themeInput w-full h-10 px-3 rounded-md outline-none placeholder:font-switzer  placeholder:text-themeBorderGray"
                        placeholder="Write a new business zone name"
                        onChange={handleOnEventChange}
                        value={zoneData?.name}
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="city"
                        className="text-black font-switzer font-semibold"
                      >
                        {t("Select city")}
                      </label>
                      <Select
                        placeholder="Select"
                        name="city"
                        id="city"
                        options={cityOptions}
                        onChange={(e) => setZoneData({ ...zoneData, city: e })}
                        value={cityOptions.find(
                          (el) =>
                            el?.value === (zoneData?.city || zoneDetail?.cityId)
                        )}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="space-y-2">
                      <div className="text-black font-switzer font-semibold">
                        {t("Map")}
                      </div>
                      {isLoaded && (
                        <div className="mt-4 relative z-0">
                          <Autocomplete
                            onLoad={setAutocomplete}
                            onPlaceChanged={handlePlaceChanged}
                          >
                            <input
                              type="text"
                              placeholder="Search location"
                              style={{ width: 400, height: 40, paddingLeft: 8 }}
                              className="absolute top-4 bg-white left-1/2 -translate-x-1/2 z-30 rounded-md"
                            />
                          </Autocomplete>
                          {polygonPaths.length > 0 && (
                            <GoogleMap
                              mapContainerStyle={containerStyle}
                              center={center}
                              zoom={10}
                              onLoad={initializeMap}
                            >
                              <Polygon
                                paths={polygonPaths}
                                options={{
                                  strokeColor: "#FF0000",
                                  strokeOpacity: 0.8,
                                  strokeWeight: 2,
                                  fillColor: "#FF0000",
                                  fillOpacity: 0.35,
                                  clickable: true,
                                  editable: true,
                                  draggable: true,
                                  geodesic: true,
                                }}
                              />
                            </GoogleMap>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label
                        htmlFor="baseCharges"
                        className="text-black font-switzer font-semibold flex gap-x-2 items-center"
                      >
                        {t("Base Charges")}{" "}
                        <p className="text-gray-600">
                          {" "}
                          {(currencyUnitOptions &&
                            currencyUnitOptions.find(
                              (el) => el?.value === zoneData?.currencyUnitId
                            )?.label) ||
                            "$"}
                        </p>
                      </label>
                      <input
                        type="number"
                        name="baseCharges"
                        id="baseCharges"
                        className="bg-themeInput w-full h-10 px-3 rounded-md outline-none placeholder:font-switzer  placeholder:text-themeBorderGray"
                        placeholder="10"
                        onChange={handleOnEventChange}
                        value={zoneData?.baseCharges}
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="baseDistance"
                        className="text-black font-switzer font-semibold flex gap-x-2 items-center"
                      >
                        {t("Base Distance")}{" "}
                        <p className="text-gray-600">
                          {(distanceUnitOptions &&
                            distanceUnitOptions.find(
                              (item) => item?.value === zoneData?.distanceUnitId
                            )?.label) ||
                            "km"}
                        </p>
                      </label>
                      <input
                        type="text"
                        name="baseDistance"
                        id="baseDistance"
                        className="bg-themeInput w-full h-10 px-3 rounded-md outline-none placeholder:font-switzer  placeholder:text-themeBorderGray"
                        placeholder="10"
                        onChange={handleOnEventChange}
                        value={zoneData?.baseDistance}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label
                        htmlFor="perKmCharges"
                        className="text-black font-switzer font-semibold flex gap-x-1  items-center"
                      >
                        {t("Per km delivery charge")}{" "}
                        <p className="text-gray-600">
                          {" "}
                          {(currencyUnitOptions &&
                            currencyUnitOptions.find(
                              (el) => el?.value === zoneData?.currencyUnitId
                            )?.label) ||
                            "$"}
                        </p>
                      </label>
                      <input
                        type="number"
                        name="perKmCharges"
                        id="perKmCharges"
                        className="bg-themeInput w-full h-10 px-3 rounded-md outline-none placeholder:font-switzer  placeholder:text-themeBorderGray"
                        placeholder="10"
                        onChange={handleOnEventChange}
                        value={zoneData?.perKmCharges}
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="maxDeliveryCharges"
                        className="text-black font-switzer font-semibold flex gap-x-1 items-center"
                      >
                        {t("Maximum delivery charge")}{" "}
                        <p className="text-gray-600">
                          {" "}
                          {(currencyUnitOptions &&
                            currencyUnitOptions.find(
                              (el) => el?.value === zoneData?.currencyUnitId
                            )?.label) ||
                            "$"}
                        </p>
                      </label>
                      <input
                        type="text"
                        name="maxDeliveryCharges"
                        id="maxDeliveryCharges"
                        className="bg-themeInput w-full h-10 px-3 rounded-md outline-none placeholder:font-switzer  placeholder:text-themeBorderGray"
                        placeholder="10"
                        onChange={handleOnEventChange}
                        value={zoneData?.maxDeliveryCharges}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label
                        htmlFor="adminComission"
                        className="text-black font-switzer font-semibold flex items-center gap-x-2"
                      >
                        {t("Admin Comission")}{" "}
                        <p className="text-gray-600">
                          {" "}
                          {(currencyUnitOptions &&
                            currencyUnitOptions.find(
                              (el) => el?.value === zoneData?.currencyUnitId
                            )?.label) ||
                            "$"}
                        </p>
                      </label>
                      <input
                        type="number"
                        name="adminComission"
                        id="adminComission"
                        className="bg-themeInput w-full h-10 px-3 rounded-md outline-none placeholder:font-switzer  placeholder:text-themeBorderGray"
                        placeholder="10"
                        onChange={handleOnEventChange}
                        value={zoneData?.adminComission}
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="adminComissionOnDeliveryCharges"
                        className="text-black font-switzer font-semibold flex gap-x-2 items-center"
                      >
                        {t("Admin Comission On Delivery Charges")}{" "}
                        <p className="text-gray-600">
                          {" "}
                          {(currencyUnitOptions &&
                            currencyUnitOptions.find(
                              (el) => el?.value === zoneData?.currencyUnitId
                            )?.label) ||
                            "$"}
                        </p>
                      </label>
                      <input
                        type="text"
                        name="adminComissionOnDeliveryCharges"
                        id="adminComissionOnDeliveryCharges"
                        className="bg-themeInput w-full h-10 px-3 rounded-md outline-none placeholder:font-switzer placeholder:text-themeBorderGray"
                        placeholder="10"
                        onChange={handleOnEventChange}
                        value={zoneData?.adminComissionOnDeliveryCharges}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label
                        htmlFor="distanceUnitId"
                        className="text-black font-switzer font-semibold"
                      >
                        {t("Select Distance Unit")}
                      </label>
                      <Select
                        placeholder="Select"
                        name="distanceUnitId"
                        options={distanceUnitOptions}
                        onChange={(e) =>
                          setZoneData({ ...zoneData, distanceUnitId: e?.value })
                        }
                        value={distanceUnitOptions.find(
                          (el) => el?.value === zoneData?.distanceUnitId
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="currencyUnitId"
                        className="text-black font-switzer font-semibold"
                      >
                        {t("Select Currency Unit")}
                      </label>
                      <Select
                        placeholder="Select"
                        name="currencyUnitId"
                        options={currencyUnitOptions}
                        onChange={(e) =>
                          setZoneData({ ...zoneData, currencyUnitId: e?.value })
                        }
                        value={currencyUnitOptions.find(
                          (el) => el?.value === zoneData?.currencyUnitId
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="penalty"
                        className="text-black font-switzer font-semibold"
                      >
                        {t("Penalty")}
                      </label>
                      <input
                        type="number"
                        name="penalty"
                        id="penalty"
                        className="bg-themeInput w-full h-10 px-3 rounded-md outline-none placeholder:font-switzer placeholder:text-themeBorderGray"
                        onChange={(e) =>
                          setZoneData({ ...zoneData, penalty: e.target.value })
                        }
                        value={zoneData?.penalty}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-5">
                  <RedButton text={t("Update")} onClick={updateZone} />
                </div>
              </div>
            )}
          </div>
        </div>
      }
    />
  );
}
