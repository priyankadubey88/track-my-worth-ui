import React from "react";
import { formatCurrency } from "../util/CurrencyUtil";

const TotalWorth = (props) => {
  return (
    <div className="d-flex justify-content-between text-success fw-bold">
      <div className="p-2">{props.displayText}</div>
      <div className="p-2">
        {formatCurrency(
          props.selectedCurrency,
          props.currencyMulitplier * props.netWorthValue
        )}
      </div>
    </div>
  );
};

export default TotalWorth;
