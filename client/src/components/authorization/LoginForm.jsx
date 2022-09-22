import React, { useState, useContext } from "react";
import Axios from "axios";
import ShowInputMessage from "../ShowInputMessage";
import ShowStateInformation from "../ShowStateInformation";
import { UserContext } from "../UserContext";

const API_URL = process.env.REACT_APP_API_URL;
const API_PORT = process.env.REACT_APP_API_PORT;

export default function LoginForm() {
  //TODO Warning about memory leak
  const [login, setLogin] = useState(
    sessionStorage.getItem("loginValue") || ""
  );
  const [password, setPassword] = useState("");
  const [submitButton, setSubmitButton] = useState("Zaloguj się");
  const [stateInformation, setStateInformation] = useState(null);
  const [inputErrors, setInputErrors] = useState({});

  const { setLoggedInStatus } = useContext(UserContext);

  Axios.defaults.withCredentials = true;

  const loginRequest = async () => {
    setSubmitButton(<i className="icon-spin6 animate-spin"></i>);
    setStateInformation("");
    setInputErrors("");
    try {
      let result = await Axios.post(
        "" + API_URL + ":" + API_PORT + "/account/login",
        {
          login,
          password,
        }
      );
      setLoggedInStatus(result.data);
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
    setSubmitButton("Zaloguj się");
  };

  return (
    <>
      <div className="input-container flex">
        <label htmlFor="login">Login:</label>
        <div className={`input-field flex ${inputErrors.login ? "error" : ""}`}>
          <div className="input-field--icon">
            <i className="icon-user"></i>
          </div>
          <input
            type="text"
            name="login"
            id="login"
            value={login}
            onChange={(e) => {
              setLogin(e.target.value);
              sessionStorage.setItem("loginValue", e.target.value);
            }}
          />
        </div>
        {inputErrors.login ? (
          <ShowInputMessage errorMessage={inputErrors.login} />
        ) : (
          ""
        )}
      </div>
      <div className="input-container flex">
        <label htmlFor="password">Hasło:</label>
        <div
          className={`input-field flex ${inputErrors.password ? "error" : ""}`}
        >
          <div className="input-field--icon">
            <i className="icon-key"></i>
          </div>
          <input
            type="password"
            name="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {inputErrors.password ? (
          <ShowInputMessage errorMessage={inputErrors.password} />
        ) : (
          ""
        )}
      </div>
      {stateInformation ? (
        <ShowStateInformation stateMessage={stateInformation} />
      ) : (
        ""
      )}
      <button type="submit" onClick={loginRequest} data-button-type="login">
        {submitButton}
      </button>
    </>
  );
}
