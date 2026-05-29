import React from 'react'
import Navbar from './components/NavBar'
import Sidebar from './components/SideBar'
import { Route, Routes, useLocation } from 'react-router-dom'

import Home from './pages/Home'
import Footer from './components/Footer'
import { useAppContext } from './context/AppContext'

import Login from './components/Login'
import AllTrains from './pages/AllTrains'
import TrainDetails from './pages/TrainDetails'
import BookingPage from './pages/BookingPage'

import { Toaster } from "react-hot-toast";
import MyBookings from './pages/MyBookings';
import Ticket from './pages/Ticket';
import About from './components/About'
import Feedback from './pages/Feedback'
import CancelBooking from './pages/CancelBooking'
import Notifications from './pages/Notifications'
import Profile from './pages/Profile'
import AdminLogin from './components/admin/AdminLogin'
import AdminLayout from './pages/admin/AdminLayout'
import TrainList from './pages/admin/TrainList'
import AddTrain from './pages/admin/AddTrain'
import CoachManagement from './pages/admin/CoachTemplates'
import AddCoach from './pages/admin/AddCoach'
import Bookings from './pages/admin/Bookings'

const App = () => {

  const isAdminPath = useLocation()
    .pathname.includes("admin");

  const { showUserLogin,showTicket } = useAppContext();
  const {isAdmin,setIsAdmin}=useAppContext();

  return (

    <div>

      {!isAdminPath && <Navbar />}
      {!isAdminPath && <Sidebar />}

      {showUserLogin && <Login />}
     


      <Toaster />

      <div>

        <Routes>

          <Route
            path='/'
            element={<Home />}
          />

          <Route
            path='/trains'
            element={<AllTrains />}
          />

          <Route
            path='/train/:id'
            element={<TrainDetails />}
          />

          <Route
            path='/book/:id'
            element={<BookingPage />}
          />
           <Route
            path='/bookings'
            element={<MyBookings />}
          />

          <Route
            path='/viewticket/:id'
            element={<Ticket/>}
          />

          <Route
            path='/about'
            element={<About/>}
          />

          <Route
            path='/feedback'
            element={<Feedback/>}
          />
           <Route
            path='/cancelbooking'
            element={<CancelBooking/>}
          />
          <Route
            path='/notifications' 
            element={<Notifications/>}
          />
          <Route
            path='/profile'
            element={<Profile/>}
          />

          <Route
            path='/admin'
            element={<AdminLogin/>}
          />

          <Route
            path='/admin/dashboard'
            element={<AdminLayout/>}
          >

            <Route
              index
              element={<h1>Dashboard</h1>}
            />

            <Route
              path='trains'
              element={<h1>Train List</h1>  && <TrainList/>}
            />

            <Route
              path='add-train'
              element={<AddTrain/>}
            />

            <Route
              path='update-train/:id'
              element={<AddTrain/>}
            />

            <Route
              path='coaches'
              element={<CoachManagement/>}
            />
            <Route
              path='add-coach'
              element={<AddCoach/>}
            />
            <Route
              path='add-coach/:id'
              element={<AddCoach/>}
            />

            <Route
              path='bookings'
              element={<Bookings/>}
            />

          </Route>

          
        </Routes>

      </div>

      {!isAdminPath && <Footer />}

    </div>
  )
}

export default App