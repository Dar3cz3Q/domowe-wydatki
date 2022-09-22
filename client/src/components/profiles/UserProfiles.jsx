import React, { useContext } from "react";
import SetupUser from "./SetupUser";
import AppInterface from "../interface/AppInterface";
import { UserContext } from "../UserContext";

export default function UserProfiles() {
  const { loggedInStatus } = useContext(UserContext);

  return (
    <div className="user-interface-container flex">
      {loggedInStatus.profileName ? <AppInterface /> : <SetupUser />}
    </div>
  );
}
