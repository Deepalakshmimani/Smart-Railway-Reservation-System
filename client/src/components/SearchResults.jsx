import React from "react";
import "./SearchResults.css";
import { useAppContext } from "../context/AppContext";


const SearchResults = ({ results }) => {
  const {user,navigate}=useAppContext();
  
  return (
    <div className="results-section">
      

      {results.length === 0 ? (
        <p>No trains found 😢</p>
      ) : (
        results.map((train) => (
          <div key={train.schedule_id} className="result-card">
            <div className="left">
              <h3>{train.train}</h3>
              <p>{train.source} → {train.destination}</p>
            </div>

            <div className="center">
              <p>{train.departure} - {train.arrival}</p>
            </div>

            <div className="right">
              <button  onClick={() => navigate(`/coach-selection/${train.schedule_id}`)}>View Details</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default SearchResults;