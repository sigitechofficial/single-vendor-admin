// @ts-nocheck
import {
    Combobox,
    ComboboxInput,
    ComboboxList,
    ComboboxOption,
    ComboboxPopover,
  } from "@reach/combobox";
  import { useEffect, useRef } from "react";
  import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
  } from "use-places-autocomplete";
  
  export const PlacesAutocomplete = ({ setSelected, setPickAddress }) => {
    const {
      ready,
      value,
      setValue,
      suggestions: { status, data },
      clearSuggestions,
    } = usePlacesAutocomplete();
    const handleSelect = async (address) => {
      setValue(address, false);
      clearSuggestions();
      const results = await getGeocode({ address });
      setPickAddress(results[0].formatted_address);
      const { lat, lng } = await getLatLng(results[0]);
      setSelected({ lat, lng });
    };
    // const inputRef = useRef(null);
    // useEffect(() => {
    //   if (inputRef.current) {
    //     inputRef.current.focus();
    //   }
    // }, []);
  
    const inputStyle =
      "bg-white block w-full pl-4 pr-8 py-3 border border-black border-opacity-20 rounded font-normal text-sm appearance-none focus:outline-none placeholder:text-opacity-40";
  
    return (
      <Combobox onSelect={handleSelect}>
        <ComboboxInput
          // ref={inputRef}
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={!ready}
          className={inputStyle}
          placeholder={"Enter location"}
          onEnterKeyPress={(e) => e.preventDefault()}
        />
        <ComboboxPopover className="bg-white px-3">
          <ComboboxList className="cursor-pointer">
            {status === "OK" &&
              data.map(({ place_id, description }) => (
                <>
                  <div className="space-y-1">
                    <ComboboxOption key={place_id} value={description} />
                    <hr />
                  </div>
                </>
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    );
  };
  