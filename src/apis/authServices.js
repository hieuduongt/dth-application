import ApiCreator from "./apiCreator";
import PATH from "../commons/paths";

const AuthServices = {
    login: (data) => {
        const url = `${PATH.BASEURL}/auth/login`;
        return ApiCreator.post(url, data);
    },
    register: (data) => {
        const url = `${PATH.BASEURL}/auth/register`;
        return ApiCreator.post(url, data);
    }
};
export default AuthServices;