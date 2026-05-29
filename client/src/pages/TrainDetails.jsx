import React from 'react'
import Recommended from '../components/RecommendedTrains'
import { allTrains } from '../assets/assets'
import { useParams } from "react-router-dom";
import { useAppContext } from '../context/AppContext';

function TrainDetails() {
  const { id } = useParams();
  const {user,results}=useAppContext();

  const train = allTrains.find(
    item => item.id === Number(id)
  );

  return (
    <div>
      <Recommended trains={[train]}/>
    </div>
  );
}

export default TrainDetails;


