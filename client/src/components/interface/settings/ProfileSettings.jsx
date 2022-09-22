import React, { useEffect, useState, useRef, useContext } from "react";
import RenderDetails from "./RenderDetails";
import Axios from "axios";
import ShowStateInformation from "../../ShowStateInformation";
import OperationButtons from "./OperationButtons";
import PageHeader from "../PageHeader";
import _ from "lodash";
import { UserContext } from "../../UserContext";
import AddButton from "../AddButton";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;
const API_PORT = process.env.REACT_APP_API_PORT;
const TIMEOUT_TIME = process.env.REACT_APP_TIMEOUT_TIME;

export default function AccountSettings() {
  const [userData, setUserData] = useState(null);
  const [inputs, setInputs] = useState({});
  const [inputErrors, setInputErrors] = useState({});
  const [stateInformation, setStateInformation] = useState(null);
  const { loggedInStatus, setLoggedInStatus } = useContext(UserContext);
  const navigate = useNavigate();

  const submitButtonRefs = useRef();
  const clearButtonRefs = useRef();
  const removeButtonRefs = useRef();
  const inputRefs = useRef([]);
  inputRefs.current = [];

  useEffect(() => {
    submitButtonRefs.current.disabled = true;
    clearButtonRefs.current.disabled = false;
    if (loggedInStatus.profileName === "Brak profilu") {
      setUserData({
        forename: "",
        surname: "",
        IDcard: "",
        pesel: "",
        birthDate: "",
      });
      setInputErrors({});
      setStateInformation(null);
    } else {
      downloadData();
    }
  }, [loggedInStatus]);

  const downloadData = async () => {
    try {
      let result = await Axios.post(
        "" + API_URL + ":" + API_PORT + "/profile/data"
      );
      setUserData(result.data);
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
    const data = {
      forename: inputs.forename,
      surname: inputs.surname,
      IDcard: inputs.IDcard,
      pesel: inputs.pesel,
      birthDate: inputs.birthDate,
    };
    try {
      var result;
      if (loggedInStatus.profileName === "Brak profilu") {
        result = await Axios.put(
          "" + API_URL + ":" + API_PORT + "/profile",
          data
        );
      } else {
        result = await Axios.patch(
          "" + API_URL + ":" + API_PORT + "/profile",
          data
        );
      }
      setStateInformation({
        status: result.status,
        message: result.data.message,
      });
      setTimeout(() => {
        navigate("/");
        window.location.reload(); //? Change chosen profile different way
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

  const createNewProfile = () => {
    setLoggedInStatus({
      ...loggedInStatus,
      profileName: "Brak profilu",
    });
    setUserData(null);
  };

  //!SQL not ready
  const removeProfile = async () => {
    setStateInformation({
      status: 500,
      message: "SQL not ready",
    });
    // try {
    //   let result = await Axios.delete(
    //     "" + API_URL + ":" + API_PORT + "/profile"
    //   );
    //   setStateInformation({
    //     status: result.status,
    //     message: result.data.message,
    //   });
    //   setTimeout(() => {
    //     window.location.reload(); //? Change chosen profile different way
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
        <PageHeader
          name={
            loggedInStatus.profileName === "Brak profilu"
              ? "Utwórz nowy profil"
              : "Ustawienia profilu"
          }
        />
        {loggedInStatus.profileName !== "Brak profilu" ? (
          <AddButton click={createNewProfile} />
        ) : (
          ""
        )}
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
        </div>
        <div className="operation-info-container">
          {stateInformation ? (
            <ShowStateInformation stateMessage={stateInformation} />
          ) : (
            ""
          )}
        </div>
        <div className="operations-buttons--container flex">
          {loggedInStatus.profileName !== "Brak profilu" ? (
            <OperationButtons
              type="remove"
              title="Usuń profil"
              click={removeProfile}
              reference={removeButtonRefs}
            />
          ) : (
            ""
          )}
          <OperationButtons
            type="edit"
            title={
              loggedInStatus.profileName === "Brak profilu"
                ? "Wprowadź dane"
                : "Edytuj dane"
            }
            click={enableEditingData}
            reference={clearButtonRefs}
          />
          <OperationButtons
            type="save"
            title={
              loggedInStatus.profileName === "Brak profilu"
                ? "Utwórz profil"
                : "Zapisz zmiany"
            }
            click={updateData}
            reference={submitButtonRefs}
          />
        </div>
      </div>
    </>
  );
}
