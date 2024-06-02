import React from 'react'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Banner1 from "../../assets/banner1.webp"
import Banner2 from "../../assets/banner2.webp"
import Banner3 from "../../assets/banner3.webp"
import Banner4 from "../../assets/banner4.webp"
import "./index.css";


function banner() {
  var settings = {
    autoplay: true,
    autoplaySpeed: 1500,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };
  return (
    <>
      <Slider  {...settings} style={{marginTop:"20px"}}>
        <div>
          <img
            src={Banner1}
            alt="banner-1"
            className="banner-img" />
        </div>

        <div>
          <img
            src={Banner3}
            alt="banner-3"
            className="banner-img" />
        </div>

        <div>
          <img
            src={Banner4}
            alt="banner-2"
            className="banner-img" />
        </div>

        <div>
          <img
            src={Banner2}
            alt="banner-2"
            className="banner-img" />
        </div>
      </Slider>
    </>
  );
}

export default banner