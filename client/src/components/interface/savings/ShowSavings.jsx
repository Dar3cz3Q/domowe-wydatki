import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import PageHeader from "../PageHeader";
import Axios from "axios";
import CreateTable from "../CreateTable";
import AddButton from "../AddButton";
import { SAVING_COLUMNS } from "./SavingColumns";

const API_URL = process.env.REACT_APP_API_URL;
const API_PORT = process.env.REACT_APP_API_PORT;

export default function ShowSavings() {
  const [savingsData, setSavingsData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    downloadData();
  }, []);

  const downloadData = async () => {
    try {
      let result = await Axios.post("" + API_URL + ":" + API_PORT + "/savings");
      setSavingsData(result.data);
    } catch (err) {
      if (err.response.status === 403) {
        navigate("/");
        window.location.reload();
      }
      if (err.response.status === 404) {
        navigate("/savings/edit");
      }
      console.log(err.response);
    }
  };

  return (
    <>
      <div className="savings--container flex">
        <PageHeader name="Oszczędności" />
        <NavLink to="/savings/edit/">
          <AddButton />
        </NavLink>
        <div className="table--container flex">
          {savingsData ? (
            <CreateTable
              dataToShow={savingsData}
              columnsToShow={SAVING_COLUMNS}
              type="savings"
            />
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
}
