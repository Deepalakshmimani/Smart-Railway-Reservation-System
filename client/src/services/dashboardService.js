import axios from "axios";

const API = "http://localhost:4000/api";

export const getDashboard = async () => {

    const { data } = await axios.get(
        `${API}/dashboard`,
        {
            withCredentials: true
        }
    );

    return data.dashboard;

};