import React from "react";

const CurrrencyDropDown = (props) => {
  return (
    <div>
      <span style={{ paddingRight: "10px" }}>Select Currency:</span>
      <select onChange={props.handleCurrencySelection}>
        <option defaultValue value="CAD">
          CAD
        </option>
        <option value="USD">USD</option>
        <option value="GBP">GBP</option>
        <option value="EUR">EUR</option>
        <option value="CHF">CHF</option>
        <option value="INR">INR</option>
        <option value="AUD">AUD</option>
        <option value="SGD">SGD</option>
        <option value="LYD">LYD</option>
        <option value="NZD">NZD</option>
      </select>
    </div>
  );
};

export default CurrrencyDropDown;
