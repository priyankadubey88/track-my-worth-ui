import axios from "axios";

export const netWorthCalculatorApi = axios.create({
  baseURL: "http://localhost:8080",
});
