import ApiCreator from "./apiCreator";
import PATH from "../commons/path";

const CategoryServices = {
    getAllCategories: () => {
        const url = `${PATH.BASEURL}/category/getall`;
        return ApiCreator.get(url);
    },
    getCategory: (id) => {
        const url = `${PATH.BASEURL}/category/${id}`;
        return ApiCreator.get(url);
    },
    updateCategory: (data) => {
        const url = `${PATH.BASEURL}/category`;
        return ApiCreator.put(url, JSON.stringify(data));
    },
    createCategory: (data) => {
        const url = `${PATH.BASEURL}/category`
        return ApiCreator.post(url, data);
    },
    deleteCategory: (id) => {
        const url = `${PATH.BASEURL}/category/${id}`
        return ApiCreator.delete(url);
    },
    getAllProducts: (id) => {
        const url = `${PATH.BASEURL}/category`
        return ApiCreator.get(url, id);
    }
};
export default CategoryServices;