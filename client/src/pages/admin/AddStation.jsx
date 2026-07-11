import React, { useState,useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const AddStation = () => {

  const { axios, backendUrl } = useAppContext();
  const { id } = useParams();
  const [stationName, setStationName] = useState("");
  const [stationCode, setStationCode] = useState("");


  useEffect(() => {

    fetchStation();

}, []);
  


  const fetchStation = async () => {

    if (!id) return;

    try {

        const { data } = await axios.get(
            `${backendUrl}/api/stations/list`
        );

        if (data.success) {

            const station = data.stations.find(

                (item) =>
                    item.station_id == id

            );

            if (station) {

                setStationName(
                    station.station_name
                );

                setStationCode(
                    station.station_code
                );

            }

        }

    }

    catch (error) {

        console.log(error);

    }

};

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

          let data;

          if (id) {

              const response = await axios.put(

                  `${backendUrl}/api/stations/update/${id}`,

                  {
                      station_name: stationName,
                      station_code: stationCode
                  },

                  {
                      withCredentials: true
                  }

              );

              data = response.data;

          } else {

              const response = await axios.post(

                  `${backendUrl}/api/stations/add`,

                  {
                      station_name: stationName,
                      station_code: stationCode
                  },

                  {
                      withCredentials: true
                  }

              );

              data = response.data;

          }

        if (data.success) {

            toast.success(data.message);

            if (!id) {

                setStationName("");
                setStationCode("");

            }

        }

        else {

            toast.error(data.message);

        }

    }

    catch (error) {

        console.log(error);

        toast.error("Something went wrong");

    }

};

  return (
    <div className="add-train-page">

      <div className="add-train-card">

        <div className="top-section">

          <div>

            <h1>

            {id ? "Update Station" : "Add Station"}

            </h1>

            <p className="subtitle">
              {id

                ? "Update station details"

                : "Add a new railway station"

                }
            </p>

          </div>

        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-section">

            <div className="form-group">

              <label>Station Name</label>

              <input
                type="text"
                placeholder="Enter station name"
                value={stationName}
                onChange={(e) =>
                  setStationName(e.target.value)
                }
                required
              />

            </div>

            <div className="form-group">

              <label>Station Code</label>

              <input
                type="text"
                placeholder="Enter station code"
                value={stationCode}
                onChange={(e) =>
                  setStationCode(e.target.value)
                }
                required
              />

            </div>

          </div>

          <button
            type="submit"
            className="submit-btn"
          >
            {id

            ? "Update Station"

            : "Add Station"

            }
          </button>

        </form>

      </div>

    </div>
  );
};

export default AddStation;