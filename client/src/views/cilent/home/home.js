import React from 'react'
import { Banner, Suggestion } from "../../../components/index"
import "./index.css"
import One from "../../../assets/one.png"
import Two from "../../../assets/two.png"
import Three from "../../../assets/three.png"
import Books from "../../../assets/books.png"

function home() {
  return (
    <>
      <Banner />
      <Suggestion title="Electronics & more" defaultCategory={["electronic", "tv", "laptop", "mobile"]} />
      <Suggestion title="Fashions" defaultCategory={["fashion"]} />
      <div style={{ margin: "0px", overflow: "hidden" }}>
        <img src={Books} alt='banner' className='books-banner' />
      </div>
      <Suggestion title="Home & Appliances" defaultCategory={["home"]} />
      <Suggestion title="Sport & Healthcare" defaultCategory={["sport", "healthcare"]} />
      <div className='label-container-feature'>
        <img src={One} alt='feature-1'></img>
        <img src={Two} alt='feature-2'></img>
        <img src={Three} alt='feature-3'></img>
      </div>
    </>
  )
}

export default home