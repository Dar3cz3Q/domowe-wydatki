import React, { useState, useEffect, useContext } from "react";
import Axios from "axios";
import { UserContext } from "../UserContext";
import RenderProfile from "./RenderProfile";

const API_URL = process.env.REACT_APP_API_URL;
const API_PORT = process.env.REACT_APP_API_PORT;

export default function SetupUser() {
  const [profiles, setProfiles] = useState([]);
  const { loggedInStatus, setLoggedInStatus } = useContext(UserContext);

  useEffect(() => {
    const downloadProfiles = async () => {
      try {
        let result = await Axios.post(
          "" + API_URL + ":" + API_PORT + "/profile"
        );
        setProfiles(result.data);
      } catch (err) {
        if (err.response.status === 404) {
          setLoggedInStatus({
            ...loggedInStatus,
            profileID: 0,
            profileName: "Brak profilu",
          });
        }
        console.log(err.response);
      }
    };
    downloadProfiles();
  }, [loggedInStatus, setLoggedInStatus]);

  return (
    <div className="profiles-container flex">
      <div className="profiles-header">
        <span>Wybierz profil:</span>
      </div>
      <div className="profiles-list flex">
        {profiles.map((profile) => (
          <RenderProfile
            key={profile.IDProfilu}
            id={profile.IDProfilu}
            name={profile.Imie}
            surname={profile.Nazwisko}
          />
        ))}
      </div>
    </div>
  );
}
