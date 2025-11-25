import axios from "axios";

const api = axios.create({
  //TEMPORARY URL FOR DEVELOPMENT
  baseURL: `http://localhost:612/api/`
});

export default api;