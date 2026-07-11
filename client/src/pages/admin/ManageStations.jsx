import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";

import "./AdminTable.css"
import toast from "react-hot-toast";

const ManageStations = () => {


  const { axios, backendUrl,navigate } = useAppContext();

  const [stations, setStations] = useState([]);




  const fetchStations = async () => {

    try {

        const { data } = await axios.get(
            `${backendUrl}/api/stations/list`
        );

        if (data.success) {

            setStations(data.stations);

        }

    }

    catch (error) {

        console.log(error);

    }

};

const deleteStation = async (id) => {

    const confirmDelete = window.confirm(

        "Are you sure you want to delete this station?"

    );

    if (!confirmDelete) return;

    try {

        const { data } = await axios.put(

            `${backendUrl}/api/stations/delete/${id}`,

            {},

            {
                withCredentials: true
            }

        );

        if (data.success) {

            toast.success(data.message);

            fetchStations();

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

useEffect(() => {

    fetchStations();

}, []);

    return (

        <div className="admin-table-container">

            <h1 className="admin-table-title">Manage Stations</h1>

            <table className="admin-table">

              <thead>

                  <tr>

                      <th>Station Name</th>

                      <th>Station Code</th>

                      <th>Actions</th>

                  </tr>

              </thead>

              <tbody>

                  {

                      stations.map((station) => (

                          <tr key={station.station_id}>

                              <td>{station.station_name}</td>

                              <td>{station.station_code}</td>

                              <td>

                                  <div className="action-buttons">

                                        <button
                                            className="edit-button"
                                            onClick={() =>
                                                navigate(
                                                    `/admin/dashboard/update-station/${station.station_id}`
                                                )
                                            }
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="delete-btn"
                                            onClick={() =>
                                                deleteStation(station.station_id)
                                            }
                                        >
                                            Delete
                                        </button>

                                    </div>

                              </td>

                          </tr>

                      ))

                  }

              </tbody>

          </table>

        </div>

    );

};

export default ManageStations;