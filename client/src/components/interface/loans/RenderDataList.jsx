import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;
const API_PORT = process.env.REACT_APP_API_PORT;

const DATA_LIST_NAMES = {
  osoba: "profile/person",
};

export default function RenderDetails({ name }) {
  const [dataList, setDataList] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const downloadData = async () => {
      try {
        let result = await Axios.post(
          "" + API_URL + ":" + API_PORT + "/" + DATA_LIST_NAMES[name] + ""
        );
        setDataList(result.data);
      } catch (err) {
        if (err.response.status === 403) {
          navigate("/");
          window.location.reload();
        }
        console.log(err.response);
      }
    };
    downloadData();
  }, [name]);

  return (
    <datalist id={`${name}-list`}>
      {dataList
        ? dataList.map((data) => <option key={data.ID} value={data.Nazwa} />)
        : ""}
    </datalist>
  );
}
