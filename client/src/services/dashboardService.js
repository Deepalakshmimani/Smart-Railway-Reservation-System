import axios from "axios";

const API = "https://smart-railway-reservation-system.onrender.com";

export const getDashboard = async () => {

    const { data } = await axios.get(
        `${API}/api/dashboard`,
        {
            withCredentials: true
        }
    );

    return data.dashboard;

};