import axios from "axios";

const BASE_URL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_BASE_URL
    : import.meta.env.VITE_BASE_URL_DEV;

const authorizedAxios = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export default authorizedAxios;
