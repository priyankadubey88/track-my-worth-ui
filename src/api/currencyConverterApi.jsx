import axios from "axios";

export const currencyConverterApi = axios.create({
  baseURL: "https://free.currconv.com",
});

export const API_DEFAULT_PARAMS = {
  apiKey: "5a51aaf43480fe3af395",
  compact: "ultra",
};
