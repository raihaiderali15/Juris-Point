import api from "./api";

 export const loginService=async (data)=>{
    return await api.post("/users/login",data)


}