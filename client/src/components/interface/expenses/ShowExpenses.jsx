import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import PageHeader from "../PageHeader";
import Axios from "axios";
import CreateTable from "../CreateTable";
import { EXPENSES_COLUMNS } from "./ExpensesColumns";
import AddButton from "../AddButton";

const API_URL = process.env.REACT_APP_API_URL;
const API_PORT = process.env.REACT_APP_API_PORT;

export default function ShowExpenses() {
  const [expensesData, setExpensesData] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    downloadData();
  }, []);

  const downloadData = async () => {
    try {
      let result = await Axios.post(
        "" + API_URL + ":" + API_PORT + "/expenses"
      );
      setExpensesData(result.data);
    } catch (err) {
      if (err.response.status === 403) {
        navigate("/");
        window.location.reload();
      }
      if (err.response.status === 404) {
        navigate("/expenses/edit");
      }
      console.log(err.response);
    }
  };

  return (
    <>
      <div className="expenses--container flex">
        <PageHeader name="Wydatki" />
        <NavLink to="/expenses/edit/">
          <AddButton />
        </NavLink>
        <div className="table--container flex">
          {expensesData ? (
            <CreateTable
              dataToShow={expensesData}
              columnsToShow={EXPENSES_COLUMNS}
              type="expenses"
            />
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
}
