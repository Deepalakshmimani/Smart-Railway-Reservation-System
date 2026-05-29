import React from 'react'
import Recommended from '../components/RecommendedTrains'
import { allTrains } from '../assets/assets'

const AllTrains = () => {
  return (
    <>
   
    <div>
      <Recommended trains={allTrains}/>
    </div>
    </>
  )
}

export default AllTrains
