import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import RenderDetails from "./RenderDetails";
import ShowStateInformation from "../../ShowStateInformation";
import Axios from "axios";
import OperationButtons from "./OperationButtons";
import PageHeader from "../PageHeader";
import _ from "lodash";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;
const API_PORT = process.env.REACT_APP_API_PORT;
const TIMEOUT_TIME = process.env.REACT_APP_TIMEOUT_TIME;

export default function AccountSettings() {
  const [userData, setUserData] = useState({});
  const [accountCreateTime, setAccountCreateTime] = useState();
  const [stateInformation, setStateInformation] = useState(null);
  const [inputs, setInputs] = useState({});
  const [inputErrors, setInputErrors] = useState({});
  const navigate = useNavigate();

  const submitButtonRefs = useRef();
  const clearButtonRefs = useRef();
  const removeButtonRefs = useRef();

  const inputRefs = useRef([]);
  inputRefs.current = [];

  useEffect(() => {
    submitButtonRefs.current.disabled = true;
    downloadData();
  }, []);

  const downloadData = async () => {
    try {
      let result = await Axios.post(
        "" + API_URL + ":" + API_PORT + "/account/data"
      );
      const createdDate = new Date(result.data.Utworzono);
      setAccountCreateTime(createdDate.toLocaleString());
      const { Utworzono, ...modifiedData } = result.data;
      setUserData(modifiedData);
    } catch (err) {
      if (err.response.status === 403) {
        navigate("/");
        window.location.reload();
      }
      console.log(err.response);
    }
  };

  const updateData = async () => {
    setInputErrors({});
    setStateInformation(null);
    if (_.isEqual(inputs, userData)) {
      return setStateInformation({
        status: 400,
        message: "Dane nie zostały zmienione",
      });
    }
    try {
      let result = await Axios.patch(
        "" + API_URL + ":" + API_PORT + "/account",
        {
          login: inputs.login,
          email: inputs.email,
        }
      );
      setStateInformation({
        status: result.status,
        message: result.data.message,
      });
      setTimeout(() => {
        navigate("/");
        window.location.reload(); //? Logging out different way
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

  const addInputToRefs = (e) => {
    if (e && !inputRefs.current.includes(e)) {
      inputRefs.current.push(e);
    }
  };

  const enableEditingData = () => {
    setInputs(userData);
    inputRefs.current.map((input) => {
      return (input.readOnly = false);
    });
    submitButtonRefs.current.disabled = false;
    clearButtonRefs.current.disabled = true;
  };

  //!SQL not ready
  const removeAccount = async () => {
    setStateInformation({
      status: 500,
      message: "SQL not ready",
    });
    // try {
    //   let result = await Axios.delete(
    //     "" + API_URL + ":" + API_PORT + "/account/remove"
    //   );
    //   setStateInformation({
    //     status: result.status,
    //     message: result.data.message,
    //   });
    //   setTimeout(() => {
    //     window.location.reload(); //? Logging out different way
    //   }, TIMEOUT_TIME);
    // } catch (err) {
    //   if (err.response.status === 403) {
    //     window.location.reload();
    //   }
    //   setStateInformation({
    //     status: err.response.status,
    //     message: err.response.data.message,
    //   });
    //   console.log(err.response);
    // }
  };

  return (
    <>
      <div className="settings--container flex">
        <PageHeader name="Ustawienia konta" />
        <div className="settings flex">
          {userData
            ? Object.entries(userData).map(([name, value]) => {
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
          <div className="detail--group flex">
            <span>Hasło:</span>
            <Link to="/settings/account/password">
              <span>Zmień hasło</span>
            </Link>
          </div>
          <div className="detail--group flex">
            <span>
              Konto utworzono: <i>{accountCreateTime}</i>
            </span>
          </div>
        </div>
        <div className="operation-info-container">
          {stateInformation ? (
            <ShowStateInformation stateMessage={stateInformation} />
          ) : (
            ""
          )}
        </div>
        <div className="operations-buttons--container flex">
          <OperationButtons
            type="remove"
            title="Usuń konto"
            click={removeAccount}
            reference={removeButtonRefs}
          />
          <OperationButtons
            type="edit"
            title="Edytuj dane"
            click={enableEditingData}
            reference={clearButtonRefs}
          />
          <OperationButtons
            type="save"
            title="Zapisz zmiany"
            click={updateData}
            reference={submitButtonRefs}
          />
        </div>
      </div>
    </>
  );
}
