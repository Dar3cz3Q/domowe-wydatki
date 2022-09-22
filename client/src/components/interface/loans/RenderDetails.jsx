import React from "react";
import ShowInputMessage from "../../ShowInputMessage";
import RenderDataList from "./RenderDataList";

const INPUT_NAMES = {
  osoba: "Osoba",
  data: "Data",
  kwota: "Kwota",
  termin: "Termin oddania",
};

const DATA_LIST_NAMES = ["osoba"];

export default function RenderDetails({
  name,
  value,
  inputValue,
  inputState,
  inputRef,
  error,
}) {
  const handleInput = (e) => {
    inputState((state) => ({
      ...state,
      [name]: e.target.value,
    }));
  };

  return (
    <div className="detail--group flex">
      <label htmlFor={name}>{INPUT_NAMES[name]}:</label>
      <input
        className={error[name] ? "error" : ""}
        ref={inputRef}
        type={name === "data" || name === "termin" ? "date" : "text"}
        name={name}
        id={name}
        list={DATA_LIST_NAMES.includes(name) ? `${name}-list` : ""}
        defaultValue={value}
        value={[inputValue][name]}
        readOnly
        onChange={handleInput}
      />
      {DATA_LIST_NAMES.includes(name) ? <RenderDataList name={name} /> : ""}
      {error[name] ? <ShowInputMessage errorMessage={error[name]} /> : ""}
    </div>
  );
}
