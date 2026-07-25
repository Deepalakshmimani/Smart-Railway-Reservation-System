import React, { useEffect } from "react";
import MainBanner from "../components/MainBanner";
import RecommendedTrainList from "../components/RecommendedTrainList";
import Search from "../components/SearchBar";
import SearchResults from "../components/SearchResults";
import { useAppContext } from "../context/AppContext";

const Home = () => {

    const {
        user,
        results,
        handleSearch,
        recommendedTrains,
        fetchRecommendedTrains
    } = useAppContext();
    console.log("Recommended:", recommendedTrains);

    useEffect(() => {

        if (user) {
            fetchRecommendedTrains();
        }

    }, [user]);

    return (

        <div>

            <MainBanner />

            {/* AI Recommended Trains */}
            
            {user && recommendedTrains.length > 0 && (

                <RecommendedTrainList
                    title="🤖 Recommended For You"
                    trains={recommendedTrains}
                />

            )}

            {/* Search Section */}

            <Search onSearch={handleSearch} />

            {/* Search Results */}

            <SearchResults results={results} />

        </div>

    );

};

export default Home;