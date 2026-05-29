import React from 'react'
import TicketModal from '../components/TicketModal'
import { useParams } from "react-router-dom";

const Ticket = () => {
  const {id}=useParams();
  return (
    <div>
      <TicketModal ticketId={id}/>
    </div>
  )
}

export default Ticket
