import axios from "axios";
const BASE_URL = import.meta.env.BASE_URL;
const instance = axios.create({
  baseURL: "http://localhost:5002/",
});

export default instance;
