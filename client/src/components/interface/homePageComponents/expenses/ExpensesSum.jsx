import React, { useState, useEffect } from "react";
import Axios from "axios";
import NoData from "../NoData";
import StatHeader from "../StatHeader";
import StatSumText from "../StatSumText";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;
const API_PORT = process.env.REACT_APP_API_PORT;

export default function ExpensesSum() {
  const [sumData, setSumData] = useState(null);
  const [loaderData, setLoaderData] = useState("Pobieranie danych");
  const navigate = useNavigate();

  useEffect(() => {
    downloadData();
  }, []);

  const downloadData = async () => {
    try {
      let result = await Axios.post(
        "" + API_URL + ":" + API_PORT + "/stats/expenses/sum"
      );
      setSumData(result.data.Suma);
    } catch (err) {
      if (err.response.status === 403) {
        navigate("/");
        window.location.reload();
      }
      if (err.response.status === 404) {
        setSumData(null);
        setLoaderData(err.response.data.message);
      }
      console.log(err.response);
    }
  };

  return (
    <div className="stats--container">
      <StatHeader header="Wydatki - suma" icon="money" />
      <div className="stats--body flex">
        {sumData ? (
          <StatSumText suma={sumData} />
        ) : (
          <NoData title={loaderData} />
        )}
      </div>
    </div>
  );
}
