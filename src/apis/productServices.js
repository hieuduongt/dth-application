import ApiCreator from "./apiCreator";
import PATH from "../commons/path";

const ProductServices = {
    getAllProducts: () => {
        const url = `${PATH.BASEURL}/product/getall`;
        return ApiCreator.get(url);
    },
    getProduct: (id) => {
        const url = `${PATH.BASEURL}/product/${id}`;
        return ApiCreator.get(url);
    },
    updateProduct: (data) => {
        const url = `${PATH.BASEURL}/product`;
        return ApiCreator.put(url, JSON.stringify(data));
    },
    createProduct: (data) => {
        const url = `${PATH.BASEURL}/product`
        return ApiCreator.post(url, data);
    },
    deleteProduct: (id) => {
        const url = `${PATH.BASEURL}/product/${id}`
        return ApiCreator.delete(url);
    },
    getAllProductsByCategory: (id) => {
        const url = `${PATH.BASEURL}/product/getallbycategory`
        return ApiCreator.get(url, id);
    }
};
export default ProductServices;