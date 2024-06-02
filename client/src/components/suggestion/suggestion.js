import React, { useEffect, useRef, useState } from 'react'
import "./index.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { IoIosArrowDroprightCircle } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { products } from "../../api/axios";
import { indianRupeesFormate } from "../../methods/index"
import { PORT } from '../../utils';



function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{
                ...style,
                background: "white",
                marginRight: "5px",
                width: "35px",
                height: "80px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
            }}
            onClick={onClick}
        />
    );
}

function SamplePrevArrow(props) {
    const { className, onClick } = props;
    return (
        <div
            className={className}
            style={{
                background: "white",
                marginLeft: "5px",
                width: "35px",
                height: "80px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                zIndex: 1
            }}
            onClick={onClick}
        />
    );
}


function Suggestion({ title, defaultCategory }) {
    const ref = useRef();
    const [productsArray, setProductsArray] = useState([]);
    const navigate = useNavigate();
    const [categories, setCategories] = useState(defaultCategory);

    var settings = {
        className: "slider-container",
        infinite: false,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    arrows: false,
                }
            }
        ],
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,

    };


    const suggestionProductsApi = async () => {
        const res = await products({ categories: defaultCategory });

        if (res?.status) {
            setProductsArray(res?.data?.data);
        }
    }

    useEffect(() => {
        const tempFun = async () => {
            await setProductsArray([]);
            await suggestionProductsApi();
        }

        if (defaultCategory[0] !== undefined) {
            tempFun();
        }

    }, [defaultCategory[0]]);


    /*    useEffect(()=> {
           if(ref.current) {
               ref.current=false;
               return 0;
           }
   
           const tempFun = async () => {
               const data = await defaultCategory[0];
               await setCategories([data]);
             }
         
             tempFun();
   
       },[defaultCategory[0]]) */

    return (
        <>
            {<div className='suggestion-container'>
                <div className="suggestion-title-container">
                    <p className='suggestion-title'>{title}</p>
                    <IoIosArrowDroprightCircle
                        style={{ fontSize: "x-large", color: "green", cursor: "pointer" }}
                        onClick={() => {
                            navigate('/search', { state: { defaultCategory } });
                        }} />
                </div>
                {
                    productsArray?.length
                        ? <Slider
                            style={{
                                margin: "0% 2% 0% 2%",
                            }}
                            {...settings}>
                            {
                                productsArray?.map((val, id) => {
                                    return (
                                        <div className='suggestion-product' key={id} >
                                            <div className='suggestion-product-border-container'
                                                onClick={() => {
                                                    navigate(`/product/${val._id}`);
                                                    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
                                                }}>
                                                <div
                                                    className='suggestion-product-img-container'>
                                                    <img src={PORT + val.imageUrl} alt="product" className='suggestion-product-img' />
                                                </div>
                                                <div className='suggestion-product-title'>{val.title}</div>
                                                <div className='suggestion-product-price'>{indianRupeesFormate(val.price)}</div>
                                            </div>   </div>
                                    )
                                })
                            }
                        </Slider>
                        : <div className='suggestion-skeleton-container'>
                            <div className="suggestion-skeleton"></div>
                        </div>
                }
            </div>
            }
        </>
    )
}

export default Suggestion