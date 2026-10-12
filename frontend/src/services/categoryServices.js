import api from "./api.js";
export const getAllCategoriesService = async () => {
    return api.get("/getAllCategory");
};
export const createCategoryService = async (categoryData) => {
    return api.post("/createCategory", categoryData);
}
export const updateCategoryService = async (categoryId, categoryData) => {
    return api.patch(`/update/${categoryId}`, categoryData);
}
export const deleteCategoryService = async (categoryId) => {
    return api.delete(`/delete/${categoryId}`);
}
