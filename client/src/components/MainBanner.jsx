import React from 'react'
import { assets } from '../assets/assets'
import "./MainBanner.css"
import { Link } from "react-router-dom";

const MainBanner = () => {
  return (
    <div >

      <img className="banner" src={assets.main_banner} alt="banner" />

      <div className="banner-content">

        <h1>
         Connecting Cities, <br />
          &nbsp; Creating Journeys!
        </h1>

        <div className="banner-buttons">

          <Link to="/trains" className="shop-btn">
              Book now
          </Link>

          <Link to="/trains" className="explore-btn">
              Explore deals
              <img
                className="black-arrow"
                src={assets.black_arrow}
                alt=""
              />
          </Link>

        </div>

      </div>

  </div>
  )
}

export default MainBanner
