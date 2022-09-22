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
  const [savingData, setSavingData] = useState(null);
  const { savingID } = useParams();
  const [toggleChanged, setToggleChanged] = useState(false);
  const [active, setActive] = useState();
  const [inputs, setInputs] = useState({});
  const [inputErrors, setInputErrors] = useState({});
  const [stateInformation, setStateInformation] = useState(null);

  const navigate = useNavigate();

  const submitButtonRefs = useRef();
  const clearButtonRefs = useRef();
  const removeButtonRefs = useRef();
  const typeButtonRefs = useRef();
  typeButtonRefs.current = [];

  const inputRefs = useRef([]);
  inputRefs.current = [];

  useEffect(() => {
    submitButtonRefs.current.disabled = true;
    if (savingID) {
      downloadData();
    } else {
      setSavingData({
        kwota: "",
      });
      setActive(1);
    }
  }, []);

  async function downloadData() {
    try {
      let result = await Axios.post(
        "" + API_URL + ":" + API_PORT + "/savings/" + savingID + ""
      );
      setActive(result.data.typ);
      const { typ, ...modifiedData } = result.data;
      setSavingData(modifiedData);
    } catch (err) {
      if (err.response.status === 403) {
        navigate("/");
        window.location.reload();
      }
      if (err.response.status === 406) {
        navigate("/savings");
      }
      console.log(err.response);
    }
  }

  const enableEditingData = () => {
    setInputs(savingData);
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
    if (_.isEqual(inputs, savingData) && !toggleChanged) {
      return setStateInformation({
        status: 400,
        message: "Dane nie zostały zmienione",
      });
    }
    const data = {
      id: savingID,
      type: active,
      kwota: inputs.kwota,
    };
    try {
      var result;
      if (!savingID) {
        result = await Axios.put(
          "" + API_URL + ":" + API_PORT + "/savings",
          data
        );
      } else {
        result = await Axios.patch(
          "" + API_URL + ":" + API_PORT + "/savings",
          data
        );
      }
      setStateInformation({
        status: result.status,
        message: result.data.message,
      });
      setTimeout(() => {
        navigate("/savings");
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

  const removeSaving = async () => {
    try {
      const result = await Axios.delete(
        "" + API_URL + ":" + API_PORT + "/savings/" + savingID + ""
      );
      setStateInformation({
        status: result.status,
        message: result.data.message,
      });
      setTimeout(() => {
        navigate("/savings");
      }, TIMEOUT_TIME);
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
        <PageHeader
          name={savingID ? "Edycja pożyczki" : "Dodaj nową oszczędność"}
        />
        <div className="loan_type--container flex">
          <div
            className="loan_type--button flex"
            data-type={1}
            onClick={switchToggle}
            data-state={active === 1 ? true : false}
            ref={addButtonToRefs}
            style={{ pointerEvents: "none" }}
          >
            <span>Wpłata</span>
          </div>
          <div
            className="loan_type--button flex"
            data-type={2}
            onClick={switchToggle}
            data-state={active === 2 ? true : false}
            ref={addButtonToRefs}
            style={{ pointerEvents: "none" }}
          >
            <span>Wypłata</span>
          </div>
        </div>
        <div className="settings flex">
          {savingData
            ? Object.entries(savingData).map(([name, value]) => {
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
          {savingID ? (
            <OperationButtons
              type="remove"
              title="Usuń oszczędność"
              click={removeSaving}
              reference={removeButtonRefs}
            />
          ) : (
            ""
          )}
          <OperationButtons
            type="edit"
            title={savingID ? "Edytuj dane" : "Wprowadź dane"}
            click={enableEditingData}
            reference={clearButtonRefs}
          />
          <OperationButtons
            type="save"
            title={savingID ? "Zapisz zmiany" : "Dodaj oszczędność"}
            click={updateData}
            reference={submitButtonRefs}
          />
        </div>
      </div>
    </>
  );
}
