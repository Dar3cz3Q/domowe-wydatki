import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import PageHeader from "../PageHeader";
import Axios from "axios";
import CreateTable from "../CreateTable";
import AddButton from "../AddButton";
import { LOANS_COLUMNS_IN, LOANS_COLUMNS_OUT } from "./LoansColumns";
import NoLoansInfo from "./NoLoansInfo";

const API_URL = process.env.REACT_APP_API_URL;
const API_PORT = process.env.REACT_APP_API_PORT;

export default function ShowExpenses() {
  const [loansInData, setLoansInData] = useState(null);
  const [loansOutData, setLoansOutData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    downloadData();
  }, []);

  const downloadData = async () => {
    await downloadInLoans();
    await downloadOutLoans();
  };

  const downloadInLoans = async () => {
    try {
      let result = await Axios.post("" + API_URL + ":" + API_PORT + "/loans/", {
        type: "in",
      });
      setLoansInData(result.data);
    } catch (err) {
      if (err.response.status === 403) {
        navigate("/");
        window.location.reload();
      }
      if (err.response.status === 404) {
        setLoansInData(null);
      }
      console.log(err.response);
    }
  };

  const downloadOutLoans = async () => {
    try {
      let result = await Axios.post("" + API_URL + ":" + API_PORT + "/loans/", {
        type: "out",
      });
      setLoansOutData(result.data);
    } catch (err) {
      if (err.response.status === 403) {
        navigate("/");
        window.location.reload();
      }
      if (err.response.status === 404) {
        setLoansOutData(null);
      }
      console.log(err.response);
    }
  };

  return (
    <>
      <div className="loans--container flex">
        <PageHeader name="Pożyczki (pożyczkobiorca)" />
        <NavLink to="/loans/edit">
          <AddButton />
        </NavLink>
        <div className="table--container flex">
          {loansInData ? (
            <CreateTable
              dataToShow={loansInData}
              columnsToShow={LOANS_COLUMNS_IN}
              type="loans"
            />
          ) : (
            <NoLoansInfo information="Brak zapisanych pożyczek" />
          )}
        </div>
        <PageHeader name="Pożyczki (pożyczkodawca)" />
        <div className="table--container flex">
          {loansOutData ? (
            <CreateTable
              dataToShow={loansOutData}
              columnsToShow={LOANS_COLUMNS_OUT}
              type="loans"
            />
          ) : (
            <NoLoansInfo information="Brak zapisanych pożyczek" />
          )}
        </div>
      </div>
    </>
  );
}
