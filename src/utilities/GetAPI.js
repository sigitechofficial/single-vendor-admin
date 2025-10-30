// @ts-nocheck
import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "./URL";
import { info_toaster } from "./Toaster";
const GetAPI = (url) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    var config = {
      headers: {
        accessToken: localStorage.getItem("accessToken"),
      },
    };
    const fetchData = () => {
      axios
        .get(BASE_URL + url, config)
        .then((dat) => {
          setData(dat.data);
        })
        .catch((err) => {
          if (err.response.status === 401) {
            localStorage.clear();
            info_toaster("Session Expired");
          }
        });
    };
    fetchData();
  }, [url]);

  const reFetch = async () => {
    var config = {
      headers: {
        accessToken: localStorage.getItem("accessToken"),
      },
    };
    try {
      axios.get(BASE_URL + url, config).then((dat) => {
        setData(dat.data);
      });
    } catch (err) {
      info_toaster(err);
    }
  };

  return { data, setData, reFetch };
};

export const GetPackages = (url) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(BASE_URL + url, {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        });
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [url]);
  return data;
};
export default GetAPI;
