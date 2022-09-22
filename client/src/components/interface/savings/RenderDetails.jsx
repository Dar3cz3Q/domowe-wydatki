import React from "react";
import ShowInputMessage from "../../ShowInputMessage";

const INPUT_NAMES = {
  kwota: "Kwota",
};

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
        type="text"
        name={name}
        id={name}
        defaultValue={value}
        value={[inputValue][name]}
        readOnly
        onChange={handleInput}
      />
      {error[name] ? <ShowInputMessage errorMessage={error[name]} /> : ""}
    </div>
  );
}
