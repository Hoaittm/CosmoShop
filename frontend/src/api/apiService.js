import axios from "axios";
import axiosInstance from "./axiosInstance";

function callApi(endpoint, method = "GET", body, params) {
    const queryString = new URLSearchParams(params).toString();
    const url = `${endpoint}?${queryString}`;
    
    const config = {
        method,
        url,
        withCredentials: true, // 👈 Thêm dòng này
        headers : {
            "Content-Type" : "application/json",
            // Bỏ Authorization nếu bạn dùng session/cookie
        },
        data : body ? JSON.stringify(body) : null,
    };

    return axiosInstance(config)
        .then((response) => response.data)
        .catch((error) => {
            console.log("API called error: ", error);
            throw error;
        });
}


export function GET_ALL(endpoint) {
    return callApi(endpoint, "GET", null, null)
};  
export function GET_ID(endpoint) {
    return callApi(endpoint, "GET", null, null)
};

export function LOGIN(endpoint, body, params) {
    return callApi(endpoint, "POST", body, params)
};

export function REGISTER(endpoint, body) {
    return callApi(endpoint, "POST", body, null)
};
export function POST_ADD(endpoint, params) {
    return callApi(endpoint, "POST", null, params)
};
export function POST_ORDER(endpoint) {
    return callApi(endpoint, "POST", null, null)
};
export function DELETE(endpoint, params) {
    return callApi(endpoint, "DELETE", null, params)
};
const API_BASE_URL = "http://localhost:8900/api";

export const GET_CART = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/shop/cart`, {
            withCredentials: true, 
            
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy giỏ hàng:", error);
        throw error;
    }
};