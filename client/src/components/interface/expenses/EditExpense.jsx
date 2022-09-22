import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Axios from "axios";
import PageHeader from "../PageHeader";
import RenderDetails from "./RenderDetails";
import OperationButtons from "../settings/OperationButtons";
import ShowStateInformation from "../../ShowStateInformation";
import _ from "lodash";

const API_URL = process.env.REACT_APP_API_URL;
const API_PORT = process.env.REACT_APP_API_PORT;
const TIMEOUT_TIME = process.env.REACT_APP_TIMEOUT_TIME;

export default function EditExpense() {
  const [expenseData, setExpenseData] = useState(null);
  const { expenseID } = useParams();
  const [inputs, setInputs] = useState({});
  const [inputErrors, setInputErrors] = useState({});
  const [stateInformation, setStateInformation] = useState(null);

  const navigate = useNavigate();

  const submitButtonRefs = useRef();
  const clearButtonRefs = useRef();
  const removeButtonRefs = useRef();

  const inputRefs = useRef([]);
  inputRefs.current = [];

  useEffect(() => {
    submitButtonRefs.current.disabled = true;
    var today = new Date().toJSON().slice(0, 10).replace(/-/g, "-");
    if (expenseID) {
      downloadData();
    } else {
      setExpenseData({
        opis: "",
        kwota: "",
        data: today,
        kategoria: "",
        sklep: "",
        metoda_platnosci: "",
      });
    }
  }, []);

  async function downloadData() {
    try {
      let result = await Axios.post(
        "" + API_URL + ":" + API_PORT + "/expenses/" + expenseID + ""
      );
      setExpenseData(result.data);
    } catch (err) {
      if (err.response.status === 403) {
        navigate("/");
        window.location.reload();
      }
      if (err.response.status === 406) {
        navigate("/expenses");
      }
      console.log(err.response);
    }
  }

  const enableEditingData = () => {
    setInputs(expenseData);
    inputRefs.current.map((input) => {
      return (input.readOnly = false);
    });
    submitButtonRefs.current.disabled = false;
    clearButtonRefs.current.disabled = true;
  };

  const addInputToRefs = (e) => {
    if (e && !inputRefs.current.includes(e)) {
      inputRefs.current.push(e);
    }
  };

  const updateData = async () => {
    setInputErrors({});
    setStateInformation(null);
    if (_.isEqual(inputs, expenseData)) {
      return setStateInformation({
        status: 400,
        message: "Dane nie zostały zmienione",
      });
    }
    const data = {
      id: expenseID,
      opis: inputs.opis,
      kwota: inputs.kwota,
      data: inputs.data,
      kategoria: inputs.kategoria,
      sklep: inputs.sklep,
      metoda_platnosci: inputs.metoda_platnosci,
    };
    try {
      var result;
      if (!expenseID) {
        result = await Axios.put(
          "" + API_URL + ":" + API_PORT + "/expenses",
          data
        );
      } else {
        result = await Axios.patch(
          "" + API_URL + ":" + API_PORT + "/expenses",
          data
        );
      }
      setStateInformation({
        status: result.status,
        message: result.data.message,
      });
      setTimeout(() => {
        navigate("/expenses");
      }, TIMEOUT_TIME);
    } catch (err) {
      if (err.response.status === 400) {
        setInputErrors(err.response.data);
      } else {
        setStateInformation({
          status: err.response.status,
          message: err.response.data.message,
        });
      }
    }
  };

  const removeExpense = async () => {
    try {
      const result = await Axios.delete(
        "" + API_URL + ":" + API_PORT + "/expenses/" + expenseID + ""
      );
      setStateInformation({
        status: result.status,
        message: result.data.message,
      });
      setTimeout(() => {
        navigate("/expenses");
      }, TIMEOUT_TIME);
    } catch (err) {
      setStateInformation({
        status: err.response.status,
        message: err.response.data.message,
      });
    }
  };

  return (
    <>
      <div className="settings--container flex">
        <PageHeader
          name={expenseID ? "Edycja wydatku" : "Dodaj nowy wydatek"}
        />
        <div className="settings flex">
          {expenseData
            ? Object.entries(expenseData).map(([name, value]) => {
                return (
                  <RenderDetails
                    key={name}
                    name={name}
                    value={value}
                    inputValue={inputs}
                    inputState={setInputs}
                    inputRef={addInputToRefs}
                    error={inputErrors}
                  />
                );
              })
            : ""}
        </div>
        <div className="operation-info-container">
          {stateInformation ? (
            <ShowStateInformation stateMessage={stateInformation} />
          ) : (
            ""
          )}
        </div>
        <div className="operations-buttons--container flex">
          {expenseID ? (
            <OperationButtons
              type="remove"
              title="Usuń wydatek"
              click={removeExpense}
              reference={removeButtonRefs}
            />
          ) : (
            ""
          )}
          <OperationButtons
            type="edit"
            title={expenseID ? "Edytuj dane" : "Wprowadź dane"}
            click={enableEditingData}
            reference={clearButtonRefs}
          />
          <OperationButtons
            type="save"
            title={expenseID ? "Zapisz zmiany" : "Dodaj wydatek"}
            click={updateData}
            reference={submitButtonRefs}
          />
        </div>
      </div>
    </>
  );
}
