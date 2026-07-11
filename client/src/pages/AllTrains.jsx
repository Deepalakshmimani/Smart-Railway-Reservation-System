


import React, { useEffect } from "react";
import TrainCardList from "../components/TrainCardList";
import { useAppContext } from "../context/AppContext";

const AllTrains = () => {

    const {
        allTrains,
        fetchAllTrains
    } = useAppContext();

    useEffect(() => {
        fetchAllTrains();
    }, []);

    return (
        <TrainCardList
            title="All Trains"
            trains={allTrains}
        />
    );
};

export default AllTrains;