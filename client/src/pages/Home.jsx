import React, { useEffect } from "react";
import MainBanner from "../components/MainBanner";
import Recommended from "../components/TrainCardList";
import { useAppContext } from "../context/AppContext";
import Search from "../components/SearchBar";
import SearchResults from "../components/SearchResults";

const Home = () => {

    const {

        user,
        results,
        handleSearch,
        recommendedTrains,
        fetchRecommendedTrains

    } = useAppContext();

    useEffect(() => {

        if (user) {

            fetchRecommendedTrains();

        }

    }, [user]);

    return (

        <div>

            <MainBanner />

            {user && (

                <Recommended
                    title="Recommended Trains"
                    trains={recommendedTrains}
                />

            )}

            <Search onSearch={handleSearch} />

            <SearchResults results={results} />

        </div>

    );

};

export default Home;