import React, { useState } from "react";
import Axios from "axios";
import ShowInputMessage from "../ShowInputMessage";
import ShowStateInformation from "../ShowStateInformation";

const API_URL = process.env.REACT_APP_API_URL;
const API_PORT = process.env.REACT_APP_API_PORT;

export default function RegisterForm() {
  const [login, setLogin] = useState(
    sessionStorage.getItem("loginValueReg") || ""
  );
  const [email, setEmail] = useState(
    sessionStorage.getItem("emailValue") || ""
  );
  const [password, setPassword] = useState("");
  const [submitButton, setSubmitButton] = useState("Zarejestruj się");
  const [stateInformation, setStateInformation] = useState("");
  const [inputErrors, setInputErrors] = useState({});

  const registerRequest = async () => {
    setSubmitButton(<i className="icon-spin6 animate-spin"></i>);
    setStateInformation("");
    setInputErrors("");
    try {
      let result = await Axios.post(
        "" + API_URL + ":" + API_PORT + "/account/register",
        {
          login,
          email,
          password,
        }
      );
      setPassword("");
      setStateInformation({
        status: result.status,
        message: result.data.message,
      });
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
    setSubmitButton("Zarejestruj się");
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
              sessionStorage.setItem("loginValueReg", e.target.value);
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
        <label htmlFor="email">Email:</label>
        <div className={`input-field flex ${inputErrors.email ? "error" : ""}`}>
          <div className="input-field--icon">
            <i className="icon-mail"></i>
          </div>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              sessionStorage.setItem("emailValue", e.target.value);
            }}
          />
        </div>
        {inputErrors.email ? (
          <ShowInputMessage errorMessage={inputErrors.email} />
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
            value={password}
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
      <button
        type="submit"
        onClick={registerRequest}
        data-button-type="register"
      >
        {submitButton}
      </button>
    </>
  );
}
