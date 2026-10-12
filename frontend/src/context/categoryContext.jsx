//create boiler for category context
import { createContext, useContext, useState } from "react";
import {
  getAllCategoriesService,
  createCategoryService,
  updateCategoryService,
  deleteCategoryService
} from "../services/categoryServices";  


const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {

  const value={}
  return(
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  )
} 
  export const useCategory = () => {
    return useContext(CategoryContext);
  }
  