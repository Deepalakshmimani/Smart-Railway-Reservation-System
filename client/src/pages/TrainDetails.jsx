import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

import TrainCardList from "../components/TrainCardList";

import CoachCard from "../components/CoachCard";




function TrainDetails() {

  const { trainId } = useParams();

  const { axios, backendUrl } = useAppContext();

  const [train, setTrain] = useState(null);

  const [coaches, setCoaches] = useState([]);




const fetchTrain = async () => {

  try {

    const { data } = await axios.get(

      `${backendUrl}/api/trains/train/${trainId}`

    );

    if (data.success) {

      setTrain(data.train);

      setCoaches(data.coaches);

    }

  } catch (error) {

    console.error(error);

  }

};


useEffect(() => {

  fetchTrain();

}, []);
  


  if (!train) {

  return <h2>Loading...</h2>;

}

  return (

  <div className="train-details-page">

    {/* Train Information */}

    <TrainCardList
            title="Train Details"
            trains={[train]}
        />

    

  </div>

);
}

export default TrainDetails;


