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

export default function EditLoan() {
  const [loanData, setLoanData] = useState(null);
  const [returnedData, setReturnedData] = useState(null);
  const { loanID, personID } = useParams();
  const [toggleChanged, setToggleChanged] = useState(false);
  const [active, setActive] = useState();
  const [inputs, setInputs] = useState({});
  const [inputErrors, setInputErrors] = useState({});
  const [stateInformation, setStateInformation] = useState(null);

  const navigate = useNavigate();

  const submitButtonRefs = useRef();
  const clearButtonRefs = useRef();
  const removeButtonRefs = useRef();
  const markButtonRefs = useRef();
  const typeButtonRefs = useRef();
  typeButtonRefs.current = [];

  const inputRefs = useRef([]);
  inputRefs.current = [];

  useEffect(() => {
    submitButtonRefs.current.disabled = true;
    var today = new Date().toJSON().slice(0, 10).replace(/-/g, "-");
    if (loanID && personID) {
      downloadData();
      setActive(personID);
    } else {
      setLoanData({
        osoba: "",
        data: today,
        kwota: "",
        termin: "",
      });
      setActive("out");
    }
  }, []);

  async function downloadData() {
    try {
      let result = await Axios.post(
        "" + API_URL + ":" + API_PORT + "/loans/" + loanID + "",
        {
          type: personID,
        }
      );
      setReturnedData(!result.data.oddano);
      const { oddano, ...modifiedData } = result.data;
      setLoanData(modifiedData);
    } catch (err) {
      if (err.response.status === 403) {
        navigate("/");
        window.location.reload();
      }
      if (err.response.status === 406) {
        navigate("/loans");
      }
      console.log(err.response);
    }
  }

  const enableEditingData = () => {
    setInputs(loanData);
    inputRefs.current.map((input) => {
      return (input.readOnly = false);
    });
    typeButtonRefs.current.map((button) => {
      return (button.style = { pointerEvents: "auto" });
    });
    submitButtonRefs.current.disabled = false;
    clearButtonRefs.current.disabled = true;
  };

  const addInputToRefs = (e) => {
    if (e && !inputRefs.current.includes(e)) {
      inputRefs.current.push(e);
    }
  };

  const addButtonToRefs = (e) => {
    if (e && !typeButtonRefs.current.includes(e)) {
      typeButtonRefs.current.push(e);
    }
  };

  const updateData = async () => {
    setInputErrors({});
    setStateInformation(null);
    if (_.isEqual(inputs, loanData) && !toggleChanged) {
      return setStateInformation({
        status: 400,
        message: "Dane nie zostały zmienione",
      });
    }
    const data = {
      id: loanID,
      type: active,
      osoba: inputs.osoba,
      data: inputs.data,
      kwota: inputs.kwota,
      termin: inputs.termin,
    };
    try {
      var result;
      if (!loanID) {
        result = await Axios.put(
          "" + API_URL + ":" + API_PORT + "/loans",
          data
        );
      } else {
        result = await Axios.patch(
          "" + API_URL + ":" + API_PORT + "/loans",
          data
        );
      }
      setStateInformation({
        status: result.status,
        message: result.data.message,
      });
      setTimeout(() => {
        navigate("/loans");
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
        "" +
          API_URL +
          ":" +
          API_PORT +
          "/loans/" +
          personID +
          "/" +
          loanID +
          "/"
      );
      setStateInformation({
        status: result.status,
        message: result.data.message,
      });
      setTimeout(() => {
        navigate("/loans");
      }, TIMEOUT_TIME);
    } catch (err) {
      setStateInformation({
        status: err.response.status,
        message: err.response.data.message,
      });
    }
  };

  const markLoan = async () => {
    try {
      const result = await Axios.patch(
        "" + API_URL + ":" + API_PORT + "/loans/mark/",
        {
          id: loanID,
          type: personID,
          state: returnedData,
        }
      );
      setReturnedData(!returnedData);
      setStateInformation({
        status: result.status,
        message: result.data.message,
      });
    } catch (err) {
      setStateInformation({
        status: err.response.status,
        message: err.response.data.message,
      });
    }
  };

  const switchToggle = (e) => {
    setToggleChanged(true);
    setActive(e.target.dataset.type);
  };

  return (
    <>
      <div className="settings--container flex">
        <PageHeader name={loanID ? "Edycja pożyczki" : "Dodaj nową pożyczkę"} />
        {loanID ? (
          <OperationButtons
            type="mark"
            title={
              returnedData ? "Oznacz jako oddane" : "Oznacz jako nie oddane"
            }
            click={markLoan}
            reference={markButtonRefs}
          />
        ) : (
          ""
        )}
        <div className="loan_type--container flex">
          <div
            className="loan_type--button flex"
            data-type="in"
            onClick={switchToggle}
            data-state={active === "in" ? true : false}
            ref={addButtonToRefs}
            style={{ pointerEvents: "none" }}
          >
            <span>Pożyczkobiorca</span>
          </div>
          <div
            className="loan_type--button flex"
            data-type="out"
            onClick={switchToggle}
            data-state={active === "out" ? true : false}
            ref={addButtonToRefs}
            style={{ pointerEvents: "none" }}
          >
            <span>Pożyczkodawca</span>
          </div>
        </div>
        <div className="settings flex">
          {loanData
            ? Object.entries(loanData).map(([name, value]) => {
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
          {loanID ? (
            <OperationButtons
              type="remove"
              title="Usuń pożyczkę"
              click={removeExpense}
              reference={removeButtonRefs}
            />
          ) : (
            ""
          )}
          <OperationButtons
            type="edit"
            title={loanID ? "Edytuj dane" : "Wprowadź dane"}
            click={enableEditingData}
            reference={clearButtonRefs}
          />
          <OperationButtons
            type="save"
            title={loanID ? "Zapisz zmiany" : "Dodaj pożyczkę"}
            click={updateData}
            reference={submitButtonRefs}
          />
        </div>
      </div>
    </>
  );
}
