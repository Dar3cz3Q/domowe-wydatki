import React, { useState, useEffect, useMemo } from "react";
import AuthForm from "./components/authorization/AuthForm";
import UserProfiles from "./components/profiles/UserProfiles";
import { UserContext } from "./components/UserContext";
import Axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;
const API_PORT = process.env.REACT_APP_API_PORT;

function App() {
  const [loggedInStatus, setLoggedInStatus] = useState(null);

  const providerStatus = useMemo(
    () => ({ loggedInStatus, setLoggedInStatus }),
    [loggedInStatus, setLoggedInStatus]
  );

  Axios.defaults.withCredentials = true;

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      let result = await Axios.post("" + API_URL + ":" + API_PORT + "/account");
      setLoggedInStatus(result.data);
    } catch (err) {
      setLoggedInStatus(null);
    }
  };

  const changeProfile = async () => {
    try {
      await Axios.delete("" + API_URL + ":" + API_PORT + "/profile/cookie");
      const { profileName, ...newItems } = loggedInStatus;
      window.history.replaceState(null, "/", "/");
      setLoggedInStatus(newItems);
    } catch (err) {
      if (err.response.status === 403) {
        window.location.reload();
      }
    }
  };

  const logout = async () => {
    try {
      let result = await Axios.delete(
        "" + API_URL + ":" + API_PORT + "/account"
      );
      window.history.replaceState(null, "/", "/");
      setLoggedInStatus(result.data);
    } catch (err) {
      console.log(err);
      if (err.response.status === 403) {
        window.location.reload();
      }
    }
  };

  return (
    <>
      <div className="general-container flex">
        <div className="header-container flex">
          <span className="header-container--logo">Domowe wydatki</span>
          {loggedInStatus ? (
            <div className="header-container--logout flex">
              <span className="header-container--user">
                {loggedInStatus.username}
                {loggedInStatus.profileName ? " > " : ""}
                {loggedInStatus.profileName ? (
                  <span
                    className="header-container--selected-profile"
                    title="Zmień profil"
                    onClick={changeProfile}
                  >
                    {loggedInStatus.profileName}
                  </span>
                ) : (
                  ""
                )}
              </span>
              <button onClick={logout} data-button-type="logout">
                Wyloguj
              </button>
            </div>
          ) : (
            ""
          )}
        </div>
        <UserContext.Provider value={providerStatus}>
          {loggedInStatus ? <UserProfiles /> : <AuthForm />}
        </UserContext.Provider>
        <div className="footer-container flex">
          <span>&copy; Domowe wydatki - Wszelkie prawa zastrzeżone</span>
        </div>
      </div>
    </>
  );
}

export default App;
