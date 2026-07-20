import axios from "axios";

  const refreshInstance=axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    withCredentials:true,
})

export default refreshInstance;