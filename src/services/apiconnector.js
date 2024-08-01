import axios from "axios"

export const axiosInstance = axios.create({});
axiosInstance.defaults.timeout = 1000*1000;
export const apiConnector = (method, url, bodyData, headers, params) => {
    return axiosInstance({
        method:`${method}`,
        url:`${url}`,
        data: bodyData ? bodyData : null,
        headers: headers ? headers: null,
        params: params ? params : null,
    });
}