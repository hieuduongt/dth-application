import ApiCreator from "./apiCreator";
import FileUploader from "./fileApiCreator";
import PATH from "../commons/paths";

const ProductServices = {
    getAllProducts: (search, page, pageSize) => {
        let url = `${PATH.BASEURL}/product/all`;
        if(search) {
            url = `${url}?search=${search}`;
        }
        if(page && url.includes("?")) {
            url = `${url}&page=${page}`;
        } else if(page) {
            url = `${url}?page=${page}`;
        }
        if(pageSize) {
            url = `${url}&pageSize=${pageSize}`;
        }
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
    getAllProductsByCategory: (id, search, page, pageSize) => {
        let url = `${PATH.BASEURL}/product/category/${id}`;
        if(search) {
            url = `${url}?search=${search}`;
        }
        if(page && url.includes("?")) {
            url = `${url}&page=${page}`;
        } else if(page) {
            url = `${url}?page=${page}`;
        }
        if(pageSize) {
            url = `${url}&pageSize=${pageSize}`;
        }
        return ApiCreator.get(url);
    },
    uploadFile: (data) => {
        const url = `${PATH.BASEURL}/image/upload`
        return FileUploader.post(url, data);
    },
    uploadFiles: (data) => {
        const url = `${PATH.BASEURL}/image/upload-multiple`
        return FileUploader.post(url, data);
    }
};
export default ProductServices;