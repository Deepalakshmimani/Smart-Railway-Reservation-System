// AddTrain.jsx

import React, {
  useEffect,
  useState
} from "react";

import "./AddTrain.css";

import toast from "react-hot-toast";

import { useParams } from "react-router-dom";

import { useAppContext } from "../../context/AppContext";



const AddTrain = () => {

  const { id } = useParams();

  const {
    navigate,
    axios,
    backendUrl
} = useAppContext();

  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);

  const [trainData, setTrainData] =
    useState({

      train_name: "",

      train_no: "",

      source_station_id: "",

      destination_station_id: "",

      departure_time: "",

      arrival_time: "",

      ac_sleeper_coaches: 0,
      sleeper_coaches: 0,
      chair_car_coaches: 0,
      general_coaches: 0,

      base_price: "",

      status: "Available",

      running_days:[]

    });

  /* Prefill Data */
  const fetchTrain = async () => {

      try {

          const { data } = await axios.get(

              `${backendUrl}/api/trains/${id}`,

              {
                  withCredentials: true
              }

          );

          

        if (data.success) {

            setTrainData({

                ...data.train,

                departure_time:
                    data.train.departure_time.slice(0,5),

                arrival_time:
                    data.train.arrival_time.slice(0,5)

            });

}

          else {

              console.log(data.message);

          }

      } catch (error) {

          console.error(error);

      }

  };


  useEffect(() => {

      if (id) {

          fetchTrain();

      }

  }, [id]);

  /* Handle Change */

  const handleChange = (e) => {

    setTrainData({
      ...trainData,
      [e.target.name]:
        e.target.value
    });
  };

  /* Running Days */

  const handleDayChange = (day) => {

    if (
      trainData.running_days.includes(day)
    ) {

      setTrainData({
        ...trainData,
        running_days:
          trainData.running_days.filter(
            item => item !== day
          )
      });

    } else {

      setTrainData({
        ...trainData,
        running_days: [
          ...trainData.running_days,
          day
        ]
      });
    }
  };

  /* Submit */

const handleSubmit = async (e) => {

    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {

        let data;

        if (id) {

            const response = await axios.put(

                `${backendUrl}/api/trains/update/${id}`,

                trainData,

                {
                    withCredentials: true
                }

            );

            data = response.data;

        } else {

            const response = await axios.post(

                `${backendUrl}/api/trains/add`,

                trainData,

                {
                    withCredentials: true
                }

            );

            data = response.data;

        }

        if (data.success) {

            toast.success(data.message);

            navigate("/admin/dashboard/trains");

        } else {

            toast.error(data.message);

        }

    } catch (error) {

        console.error(error);

        toast.error(
            error.response?.data?.message ||
            "Something went wrong"
        );

    } finally {

        setLoading(false);

    }

};


const fetchStations = async () => {

  try {

    const { data } = await axios.get(
      `${backendUrl}/api/stations/list`
    );

    if (data.success) {

      setStations(data.stations);

    }

  } catch (error) {

    console.error(error);

  }

};


useEffect(() => {

    fetchStations();

}, []);


  const days = [

    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun"

  ];

  return (

    <div className="add-train-page">

      <div className="add-train-card">

        {/* Heading */}

        <div className="top-section">

          <div>

            <h1>

              {id
                ? "Update Train"
                : "Add Train"}

            </h1>

            <p className="subtitle">

              {id
                ? "Modify train details"
                : "Add new railway service"}

            </p>

            

          </div>

          <div className="train-badge">

            🚆 Railway Admin

          </div>

        </div>

        <form onSubmit={handleSubmit}>

          {/* Train Details */}

          <div className="form-section">

            <h3>
              Train Details
            </h3>

            <div className="row">

              <div className="form-group">

                <label>
                  Train Name
                </label>

                <input
                  type="text"
                  name="train_name"
                  placeholder="Enter train name"
                  value={trainData.train_name}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  Train Number
                </label>

                <input
                  type="text"
                  name="train_no"
                  placeholder="Enter train number"
                  value={trainData.train_no}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

          </div>

          {/* Route */}

          <div className="form-section">

            <h3>
              Route Information
            </h3>

            <div className="row">

              <div className="form-group">

                <label>
                  Source
                </label>

                <select
                    name="source_station_id"
                    value={trainData.source_station_id}
                    onChange={handleChange}
                >

                    <option value="">

                        Select Source Station

                    </option>

                    {stations.map((station) => (

                        <option
                            key={station.station_id}
                            value={station.station_id}
                        >

                            {station.station_name}

                        </option>

                    ))}

                </select>

              </div>

              <div className="form-group">

                <label>
                  Destination
                </label>

                <select
                    name="destination_station_id"
                    value={trainData.destination_station_id}
                    onChange={handleChange}
                >

                    <option value="">

                        Select Destination Station

                    </option>

                    {stations.map((station) => (

                        <option
                            key={station.station_id}
                            value={station.station_id}
                        >

                            {station.station_name}

                        </option>

                    ))}

                </select>

              </div>

            </div>

          </div>

          {/* Timings */}

          <div className="form-section">

            <h3>
              Timings
            </h3>

            <div className="row">

              <div className="form-group">

                <label>
                  Departure
                </label>

                <input
                  type="time"
                  name="departure_time"
                  value={trainData.departure_time}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  Arrival
                </label>

                <input
                  type="time"
                  name="arrival_time"
                  value={trainData.arrival_time}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

          </div>

          {/* Coach Configuration */}
          {id && (
              <p className="info-text">
                Coach configuration and base price cannot be modified after a train is created.
              </p>
            )}

          <div className="coach-section">

            <h3>
              Coach Configuration
            </h3>

            <div className="coach-grid">

              <div className="coach-box">

                <p>
                  AC Sleeper
                </p>

                <input
                  type="number"
                  disabled={!!id}
                  name="ac_sleeper_coaches"
                  value={
                    trainData.ac_sleeper_coaches
                  }
                  onChange={handleChange}
                  min="0"
                />

              </div>

              <div className="coach-box">

                <p>
                  Sleeper
                </p>

                <input
                  type="number"
                  disabled={!!id}
                  name="sleeper_coaches"
                  value={
                    trainData.sleeper_coaches
                  }
                  onChange={handleChange}
                  min="0"
                />

              </div>

              <div className="coach-box">

                <p>
                  Chair Car
                </p>

                <input
                  type="number"
                  disabled={!!id}
                  name="chair_car_coaches"
                  value={
                    trainData.chair_car_coaches
                  }
                  onChange={handleChange}
                  min="0"
                />

              </div>

              <div className="coach-box">

                <p>
                  General
                </p>

                <input
                  type="number"
                  disabled={!!id}
                  name="general_coaches"
                  value={
                    trainData.general_coaches
                  }
                  onChange={handleChange}
                  min="0"
                />

              </div>

            </div>

          </div>

          {/* base_price & Status */}

          <div className="form-section">

            <h3>
              Pricing & Status
            </h3>

            <div className="row">

              <div className="form-group">

                <label>
                  Base Price
                </label>

                <input
                  type="number"
                  disabled={!!id}
                  name="base_price"
                  placeholder="Enter base_price"
                  value={trainData.base_price}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  Train Status
                </label>

                <select
                  name="status"
                  value={trainData.status}
                  onChange={handleChange}
                >

                  <option>
                    Available
                  </option>

                  <option>
                    Delayed
                  </option>

                  <option>
                    Cancelled
                  </option>

                  <option>
                    Maintenance
                  </option>

                </select>

              </div>

            </div>

          </div>

          {/* Running Days */}

          <div className="days-section">

            <label>
              Running Days
            </label>

            <div className="days-container">

              {days.map((day) => (

                <button
                  type="button"
                  key={day}
                  className={
                    trainData.running_days.includes(
                      day
                    )
                      ? "day-btn active"
                      : "day-btn"
                  }
                  onClick={() =>
                    handleDayChange(day)
                  }
                >

                  {day}

                </button>

              ))}

            </div>

          </div>

          {/* Submit */}

          <button
              type="submit"
              className="submit-btn"
              disabled={loading}
              style={{
                  opacity: loading ? 0.6 : 1,
                  cursor: loading ? "not-allowed" : "pointer"
              }}
          >

              {
                  loading
                  ? (
                      id
                      ? "Saving..."
                      : "Adding Train..."
                  )
                  : (
                      id
                      ? "Save Changes"
                      : "Add Train"
                  )
              }

          </button>

          

        </form>

      </div>

    </div>
  );
};

export default AddTrain;