import React from "react";
import "./SeatCard.css";

const SeatCard = ({

    seat,

    selected,

    onSelect

}) => {

    const getClass = () => {

        if (seat.status === "BOOKED")

            return "seat booked";

        if (selected)

            return "seat selected";

        return "seat available";

    };

    return (

        <div

            className={getClass()}

            onClick={() => {

                if (seat.status === "AVAILABLE") {

                    onSelect(seat);

                }

            }}

        >

            {seat.seat_number}

        </div>

    );

};

export default SeatCard;