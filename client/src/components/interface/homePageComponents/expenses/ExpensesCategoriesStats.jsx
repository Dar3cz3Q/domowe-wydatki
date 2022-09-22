import React, { useState, useEffect } from "react";
import Chart from "react-google-charts";
import Axios from "axios";
import NoData from "../NoData";
import StatHeader from "../StatHeader";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;
const API_PORT = process.env.REACT_APP_API_PORT;

export default function ExpensesCatStats() {
  const [chartData, setChartData] = useState(null);
  const [loaderData, setLoaderData] = useState("Pobieranie danych");
  const navigate = useNavigate();
  const chartOptions = {
    backgroundColor: "transparent",
    legend: {
      textStyle: {
        color: "#ffffff",
      },
    },
  };

  useEffect(() => {
    downloadData();
  }, []);

  const downloadData = async () => {
    try {
      let result = await Axios.post(
        "" + API_URL + ":" + API_PORT + "/stats/expenses/chart"
      );
      const tempData = [["Kategoria", "Kwota"]];
      result.data.forEach((element) => {
        tempData.push([element.Nazwa, Number(element.Suma)]);
      });
      setChartData(tempData);
    } catch (err) {
      if (err.response.status === 403) {
        navigate("/");
        window.location.reload();
      }
      if (err.response.status === 404) {
        setChartData(null);
        setLoaderData(err.response.data.message);
      }
      console.log(err.response);
    }
  };

  return (
    <div className="stats--container">
      <StatHeader header="Wydatki - kategorie" icon="chart-pie" />
      <div className="stats--body flex">
        {chartData ? (
          <Chart
            chartType="PieChart"
            data={chartData}
            options={chartOptions}
            loader={<i className="icon-spin6 animate-spin data-spinner"></i>}
          />
        ) : (
          <NoData title={loaderData} />
        )}
      </div>
    </div>
  );
}
