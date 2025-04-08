import axios from "axios";
const BASE_URL = import.meta.env.BASE_URL;
const instance = axios.create({
  baseURL: "https://forum-backend-j0y6.onrender.com/",
});

export default instance;
