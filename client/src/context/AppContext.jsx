import { createContext,useContext,useState } from "react";
import { useNavigate } from "react-router-dom";
import { allTrains } from "../assets/assets";
import axios from "axios";

export const AppContext=createContext();

export const AppCotextProvider=({children})=>
{

  const backendUrl = import.meta.env.VITE_API_URL;
  const navigate=useNavigate();
  const[user,setUser]=useState(null);
  const[isadmin,setIsAdmin]=useState(null);
  const[showUserLogin,setShowUserLogin]=useState(null);
  const[results,setResults]=useState([]);
  const [allTrains, setAllTrains] = useState([]);
  const[selectedDate,setSelectedDate]=useState("");
  const[showTicket,setShowTicket]=useState(null);
  const [recommendedTrains, setRecommendedTrains] = useState([]);
  

  const handleSearch = async (formData) => {

  console.log("Searching...", formData);

  if (!formData.from || !formData.to || !formData.date) {
    alert("Please fill all fields");
    return;
  }

  try {

    const { data } = await axios.get(

      `${backendUrl}/api/trains/search`,

      {
        params: {
          from: formData.from,
          to: formData.to,
          date: formData.date
        }
      }

    );

    if (data.success) {

      setResults(data.trains);

      setSelectedDate(formData.date);

    } else {

      alert(data.message);

    }

  } catch (error) {

    console.log(error);

    alert("Something went wrong");

  }

};

const fetchRecommendedTrains = async () => {

    try {

        const { data } = await axios.get(

            `${backendUrl}/api/trains/recommended`,

            {
                withCredentials: true
            }

        );

        console.log(data);

        if (data.success) {

            setRecommendedTrains(data.trains);

        }

    } catch (error) {

        console.log(error);

    }

};


const fetchAllTrains = async () => {

  try {

    const { data } = await axios.get(

      `${backendUrl}/api/trains/list`

    );

    if (data.success) {

      setAllTrains(data.trains);

    }

  } catch (error) {

    console.log(error);

  }

};


  const value={
    navigate,
    user,
    setUser,
    isadmin,
    setIsAdmin,
    showUserLogin,
    setShowUserLogin,
    results,
    setResults,
    handleSearch,
    selectedDate,
    setSelectedDate,
    showTicket,
    setShowTicket,
    axios,
    backendUrl,
    allTrains,
    setAllTrains,
    fetchAllTrains,
    recommendedTrains,
    setRecommendedTrains,
    fetchRecommendedTrains
  }

  return <AppContext.Provider value={value}>
    {children}
  </AppContext.Provider>
}


export const useAppContext=()=>
{
  return useContext(AppContext)
}

