import React, { useEffect, useState } from 'react'
import "./index.css"
import { Suggestion } from "../../../components/index"
import { useNavigate, useParams } from 'react-router-dom';
import { product, updateCart } from "../../../api/axios";
import { indianRupeesFormate } from "../../../methods/index"
import { PORT } from '../../../utils';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { FaStar } from "react-icons/fa";

function Product() {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state);
  const navigate = useNavigate();
  const { id } = useParams();
  const [productDetails, setProductDetails] = useState(null);


  const productApi = async () => {
    const res = await product({ id });

    if (res?.status) {
      setProductDetails(res?.data);
    }
  }

  const updateCartApi = async (redirect = false) => {
    if (!localStorage.getItem('token') && !localStorage.getItem('id') && !localStorage.getItem('user')) {
      navigate('/login');
      return 0;
    }

    const res = await updateCart({
      productId: id,
      status: 1
    });


    if (res?.status) {
      toast.success('added to cart');
      if (redirect === true) {
        navigate('/cart');
        return 0;
      }
    } else if (res?.unVerify) {
      localStorage.clear();
      navigate('/register');
    }

    if (redirect === true) {
      navigate('/login');
    }
  }

  useEffect(() => {
    const tempFun = async () => {
      dispatch({ type: 'setIsLoading', payload: true });
      await productApi();
      dispatch({ type: 'setIsLoading', payload: false });
    }

    tempFun();
  }, [id])

  return (
    <>
      {
        isLoading ? <div style={{
          marginTop: "40px",
          display: "flex",
          alignContent: "center",
          justifyContent: "center",
          width: "100%"
        }}><div>Loading . . .</div></div>
          : <> <div className='product-container'>
            <div className='product-left'>
              <div style={{ display: "flex", justifyContent: "center", padding: "2%" }}>
                <img src={PORT + productDetails?.imageUrl} alt="product-img" className='product-img' />
              </div>
              <div className="product-btn-container">
                <button
                  className=" product-btn-addtocart"
                  onClick={() => { updateCartApi() }}>ADD TO CART</button>
                <button
                  className=" product-btn-buynow"
                  onClick={() => {
                    updateCartApi(true);
                  }}>BUY NOW</button>
              </div>
            </div>

            <div className='product-right'>
              <div className='product-title'>
                {productDetails?.title}
              </div>

              {productDetails?.rating ? <div className='product-rating-label'>
                {productDetails?.rating} <FaStar style={{ fontSize: "medium", marginLeft: "5px" }} />
              </div> : null}
              <div className='product-price'>
                {productDetails?.price && indianRupeesFormate(productDetails.price)}
              </div>
              <div className='product-delivery'>
                Free Delivery within {productDetails?.delivery} day's
              </div>
              <div className='product-desc'>
                {productDetails?.description}
              </div>
            </div>

          </div>
            <Suggestion title="Similar Products" defaultCategory={[productDetails?.category]} />
          </>}
    </>
  )
}

export default Product;