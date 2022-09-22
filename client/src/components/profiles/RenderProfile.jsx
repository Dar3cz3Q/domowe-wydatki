import React, { useContext } from "react";
import { UserContext } from "../UserContext";
import Axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;
const API_PORT = process.env.REACT_APP_API_PORT;

export default function RenderProfile({ id, name, surname }) {
  const { loggedInStatus, setLoggedInStatus } = useContext(UserContext);

  const setUser = async (e) => {
    const id = e.target.getAttribute("data-key");
    const username = e.target.getAttribute("data-name");
    setLoggedInStatus({
      ...loggedInStatus,
      profileID: id,
      profileName: username,
    });
    updateCookie(id, username);
  };

  const updateCookie = async (id, username) => {
    try {
      await Axios.patch("" + API_URL + ":" + API_PORT + "/profile/cookie", {
        //? error
        profileID: id,
        profileName: username,
      });
    } catch (err) {
      console.log(err.response);
    }
  };

  return (
    <div
      className="profile-card flex"
      data-key={id}
      data-name={name + " " + surname}
      onClick={setUser}
    >
      <span data-key={id} data-name={name + " " + surname}>
        {name}&nbsp;{surname}
      </span>
    </div>
  );
}
