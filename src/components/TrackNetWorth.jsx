import React, { useEffect, useState } from "react";
import CurrencyDropDown from "./CurrencyDropDown";
import { getCurrencySymbol } from "../util/CurrencyUtil";
import {
  currencyConverterApi,
  API_DEFAULT_PARAMS,
} from "../api/currencyConverterApi";
import { netWorthCalculatorApi } from "../api/netWorthCalculatorApi";
import "../css/Table.css";
import assestDataJson from "../data/assets.json";
import liabilitiesDataJson from "../data/liabilities.json";
import TotalWorth from "./TotalWorth";

const TrackNetWorth = () => {
  const [selectedCurrency, setSelectedCurrency] = useState("CAD");
  const [currencyMulitplier, setCurrencyMultiplier] = useState(1);
  const [assets, setAssets] = useState({});
  const [liabilities, setLiabilities] = useState({});
  const [totalAssets, setTotalAssets] = useState(0);
  const [totalLiabilities, setTotalLiabilities] = useState(0);
  const [netWorth, setNetWorth] = useState(0);
  const [currencySymbol, setCurrencySymbol] = useState("CA$");

  useEffect(() => {
    let assetsValues = {};
    let liabilitiesValues = {};
    readDataFromJson(assestDataJson, assetsValues);
    readDataFromJson(liabilitiesDataJson, liabilitiesValues);
    setAssets(assetsValues);
    setLiabilities(liabilitiesValues);

    function readDataFromJson(jsonData, dataMap) {
      jsonData.forEach((item) => {
        item.data.forEach((subItem) => {
          dataMap[subItem.description] = subItem.amount.toFixed(2);
        });
      });
    }
  }, []);

  useEffect(async () => {
    let assetsData = [];
    Object.values(assets).forEach((value) => assetsData.push(Number(value)));
    let liabilitiesData = [];
    Object.values(liabilities).forEach((value) =>
      liabilitiesData.push(Number(value))
    );

    if (assetsData.length === 0 || liabilitiesData.length === 0) {
      return;
    }
    const response = await netWorthCalculatorApi({
      method: "post",
      url: "/worth/asset-and-liability",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      data: {
        assets: assetsData,
        liabilities: liabilitiesData,
      },
    });

    setTotalAssets(response.data.totalAssetValue);
    setTotalLiabilities(response.data.totalLiabilityValue);
    setNetWorth(response.data.netWorthValue);
  }, [assets, liabilities]);

  useEffect(() => {
    if (
      assets === undefined ||
      assets === null ||
      Object.keys(assets).length === 0
    )
      return;

    // Set Assets
    let newAssetData = {};
    Object.entries(assets).forEach(
      ([key, value]) =>
        (newAssetData[key] = (currencyMulitplier * value).toFixed(2))
    );
    setAssets(newAssetData);

    // Set Liabilities
    if (
      liabilities === undefined ||
      liabilities === null ||
      Object.keys(liabilities).length === 0
    )
      return;
    let newLiabilityData = {};
    Object.entries(liabilities).forEach(
      ([key, value]) =>
        (newLiabilityData[key] = (currencyMulitplier * value).toFixed(2))
    );
    setLiabilities(newLiabilityData);
  }, [currencyMulitplier]);

  useEffect(() => {
    setCurrencySymbol(getCurrencySymbol(selectedCurrency));
  }, [selectedCurrency]);

  const handleCurrencySelection = async (event) => {
    const newCurrency = event.target.value;
    const conversionString = selectedCurrency + "_" + newCurrency;
    const response = await currencyConverterApi.get("/api/v7/convert", {
      params: {
        ...API_DEFAULT_PARAMS,
        q: conversionString,
      },
    });
    setCurrencyMultiplier(response.data[conversionString]);
    setSelectedCurrency(newCurrency);
  };

  const handleAssetInputOnChange = (event) => {
    let newData = { ...assets };
    const newAmount = Number(event.target.value);
    newData[event.target.getAttribute("name")] = newAmount;
    setAssets(newData);
  };

  const handleLiabilityInputOnChange = (event) => {
    let newData = { ...liabilities };
    const newAmount = Number(event.target.value);
    newData[event.target.getAttribute("name")] = newAmount;
    setLiabilities(newData);
  };

  const renderAssetsRows = (data) => {
    return data.map(({ investmentType, data }) => {
      const dataRow = data.map(({ description, amount }) => {
        return (
          <tr key={description}>
            <td>{description}</td>
            <td>
              <span>{currencySymbol}</span>&nbsp;
              <input
                type="number"
                name={description}
                min="0"
                value={assets[description] ? assets[description] : ""}
                onChange={handleAssetInputOnChange}
              />
            </td>
          </tr>
        );
      });
      return (
        <React.Fragment key={investmentType}>
          <tr key={investmentType}>
            <th colSpan="2">{investmentType}</th>
          </tr>
          {dataRow}
        </React.Fragment>
      );
    });
  };

  const renderLiabilitiesRows = (data) => {
    return data.map(({ liabilityType, monthlyPaymentHeading, data }) => {
      const dataRow = data.map(({ description, monthlyPayment, amount }) => {
        return (
          <tr key={description}>
            <td>{description}</td>
            <td>{monthlyPayment}</td>
            <td>
              <span>{currencySymbol}</span>&nbsp;
              <input
                type="number"
                name={description}
                min="0"
                value={liabilities[description] ? liabilities[description] : ""}
                onChange={handleLiabilityInputOnChange}
              />
            </td>
          </tr>
        );
      });
      return (
        <React.Fragment key={liabilityType}>
          <tr key={liabilityType}>
            <th>{liabilityType}</th>
            <th colSpan="2">{monthlyPaymentHeading}</th>
          </tr>
          {dataRow}
        </React.Fragment>
      );
    });
  };

  return (
    <div style={{ margin: "auto", width: "80%" }}>
      <div className="p-2 d-flex justify-content-end">
        <CurrencyDropDown handleCurrencySelection={handleCurrencySelection} />
      </div>

      <hr />
      <TotalWorth
        displayText="Net Worth"
        selectedCurrency={selectedCurrency}
        currencyMulitplier={currencyMulitplier}
        netWorthValue={netWorth}
      />
      <hr />

      <div className="p-2 mb-2 bg-info text-white">
        <h6>Assets</h6>
      </div>

      <table className="yourWorthTable assetTable">
        <thead />
        <tbody>{renderAssetsRows(assestDataJson)}</tbody>
      </table>

      <TotalWorth
        displayText="Total Assets"
        selectedCurrency={selectedCurrency}
        currencyMulitplier={currencyMulitplier}
        netWorthValue={totalAssets}
      />

      <hr />
      <div className="p-2 mb-2 bg-danger text-white">
        <h6>Liablities</h6>
      </div>

      <table className="yourWorthTable liabilityTable">
        <thead />
        <tbody>{renderLiabilitiesRows(liabilitiesDataJson)}</tbody>
      </table>

      <TotalWorth
        displayText="Total Liabilities"
        selectedCurrency={selectedCurrency}
        currencyMulitplier={currencyMulitplier}
        netWorthValue={totalLiabilities}
      />
    </div>
  );
};

export default TrackNetWorth;
