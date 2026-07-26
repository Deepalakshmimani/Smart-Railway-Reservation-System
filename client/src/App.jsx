import React, { useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Toaster } from "react-hot-toast";

import Navbar from './components/NavBar';
import Sidebar from './components/SideBar';
import Footer from './components/Footer';
import Login from './components/Login';
import About from './components/About';
import ChatBot from "./components/ChatBot";

import Home from './pages/Home';
import AllTrains from './pages/AllTrains';
import TrainDetails from './pages/TrainDetails';
import BookingPage from './pages/Booking';
import CoachSelection from "./pages/CoachSelection";
import SeatSelection from "./pages/SeatSelection";
import PassengerDetails from './pages/PassengerDetails';
import Payment from "./pages/Payment";
import MyBookings from './pages/Booking';
import Ticket from './pages/Ticket';
import Feedback from './pages/Feedback';
import CancelBooking from './pages/CancelBooking';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';

import AdminLogin from './components/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import TrainList from './pages/admin/TrainList';
import AddTrain from './pages/admin/AddTrain';
import CoachManagement from './pages/admin/CoachTemplates';
import AddCoach from './pages/admin/AddCoach';
import Bookings from './pages/admin/Bookings';
import AddStation from "./pages/admin/AddStation";
import ManageStations from "./pages/admin/ManageStations";
import Dashboard from "./pages/Dashboard";

import { useAppContext } from './context/AppContext';

const App = () => {

  const isAdminPath = useLocation().pathname.includes("admin");

  const { showUserLogin } = useAppContext();

  const [isChatOpen, setIsChatOpen] = useState(false);

  return (

    <div>

      {!isAdminPath &&
        <Navbar />
      }

      {!isAdminPath &&
        <Sidebar openChatBot={() => setIsChatOpen(true)} />
      }

      {showUserLogin &&
        <Login />
      }

      <Toaster />

      <div className="main-content">

        <Routes>

          <Route path='/' element={<Home />} />
          <Route path='/trains' element={<AllTrains />} />
          <Route path='/train/:trainId' element={<TrainDetails />} />
          <Route path='/book/:id' element={<BookingPage />} />
          <Route path='/passenger-details' element={<PassengerDetails />} />
          <Route path='/payment' element={<Payment />} />
          <Route path='/ticket/:bookingId' element={<Ticket />} />
          <Route path='/viewticket/:id' element={<Ticket />} />
          <Route path='/seat-selection/:scheduleId/:coachType' element={<SeatSelection />} />
          <Route path='/coach-selection/:trainId' element={<CoachSelection />} />
          <Route path='/bookings' element={<MyBookings />} />
          <Route path='/cancel-ticket/:bookingId' element={<CancelBooking />} />
          <Route path='/about' element={<About />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/feedback' element={<Feedback />} />
          <Route path='/notifications' element={<Notifications />} />
          <Route path='/profile' element={<Profile />} />

          {/* Admin */}

          <Route path='/admin' element={<AdminLogin />} />

          <Route path='/admin/dashboard' element={<AdminLayout />}>

            <Route index element={<h1>Dashboard</h1>} />

            <Route path='trains' element={<TrainList />} />

            <Route path='add-train' element={<AddTrain />} />

            <Route path='update-train/:id' element={<AddTrain />} />

            <Route path='add-station' element={<AddStation />} />

            <Route path='update-station/:id' element={<AddStation />} />

            <Route path='stations' element={<ManageStations />} />

            <Route path='coaches' element={<CoachManagement />} />

            <Route path='add-coach' element={<AddCoach />} />

            <Route path='add-coach/:id' element={<AddCoach />} />

            <Route path='bookings' element={<Bookings />} />

          </Route>

        </Routes>

        {!isAdminPath &&
          <ChatBot
            isOpen={isChatOpen}
            setIsOpen={setIsChatOpen}
          />
        }

      </div>

      {!isAdminPath &&
        <Footer />
      }

    </div>

  );

};

export default App;