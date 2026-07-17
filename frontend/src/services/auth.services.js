import api from "./api";

 export const loginService=async (data)=>{
    return await api.post("/users/login",data)


}
export  const getUserService=async ()=>{
    return await api.get("/users/profile")
}