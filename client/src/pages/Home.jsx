import React from 'react'
import MainBanner from '../components/MainBanner'
import Recommended from '../components/RecommendedTrains'
import { useAppContext} from '../context/AppContext'
import Search from '../components/SearchBar'
import SearchResults from '../components/SearchResults'
import { assets,trains } from "../assets/assets";
import BookingPage from './BookingPage'


const Home = () => {
    const {user,results,handleSearch}=useAppContext();
  return (
    <div>
      <MainBanner/>
      {user &&<Recommended trains={trains}/>}
      <Search onSearch={handleSearch}/>
      <SearchResults results={results} />
      
    </div>
  )
}

export default Home
