import ApiCreator from "./apiCreator";
import FileUploader from "./fileApiCreator";
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
    },
    uploadFile: (data) => {
        const url = `${PATH.BASEURL}/file/upload`
        return FileUploader.post(url, data);
    },
    uploadFiles: (data) => {
        const url = `${PATH.BASEURL}/file/upload-many`
        return FileUploader.post(url, data);
    }
};
export default ProductServices;