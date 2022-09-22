import React, { useState, useEffect } from "react";
import Axios from "axios";
import NoData from "../NoData";
import StatHeader from "../StatHeader";
import StatSumText from "../StatSumText";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;
const API_PORT = process.env.REACT_APP_API_PORT;

export default function LoansSum({ type }) {
  const [loansData, setLoansData] = useState(null);
  const [loaderData, setLoaderData] = useState("Pobieranie danych");
  const navigate = useNavigate();

  useEffect(() => {
    downloadData();
  }, []);

  const downloadData = async () => {
    try {
      let result = await Axios.post(
        "" + API_URL + ":" + API_PORT + "/stats/loans/sum/" + type + ""
      );
      setLoansData(result.data.Suma);
    } catch (err) {
      if (err.response.status === 403) {
        navigate("/");
        window.location.reload();
      }
      if (err.response.status === 404) {
        console.log(err.response);
        setLoansData(null);
        setLoaderData(err.response.data.message);
      }
      console.log(err.response);
    }
  };

  return (
    <div className="stats--container">
      <StatHeader
        header={`${type === "in" ? "Pożyczkobiorca" : "Pożyczkodawca"} - suma`}
        icon="money"
      />
      <div className="stats--body flex">
        {loansData ? (
          <StatSumText suma={loansData} />
        ) : (
          <NoData title={loaderData} />
        )}
      </div>
    </div>
  );
}
