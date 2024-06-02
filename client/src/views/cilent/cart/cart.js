import React, { useEffect, useState } from 'react'
import "./index.css";
import CartContainer from "./cartContainer.js";
import { carts, updateCart, createOrder, buyOrder } from "../../../api/axios.js"
import { indianRupeesFormate, loadScript } from '../../../methods/index.js';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { PORT } from '../../../utils/index.js';


function Cart() {
  const { name, email } = useSelector((state) => state);
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state);
  const navigate = useNavigate();
  const [cartsArray, setCartArray] = useState([]);
  const [totalPrice, setTotalPrice] = useState(1);
  const [totalQuantity, setTotalQuantity] = useState(1);
  const [isButtonLoading, setIsButtonLoading] = useState(false);


  const updateTotal = async (price, quantity) => {
    setTotalPrice(price);
    setTotalQuantity(quantity);
  }

  const handleSubmit = async (obj) => {
    setCartArray(obj?.carts);
    updateTotal(obj?.totalPrice, obj?.totalQuantity);
  }

  const cartsApi = async () => {
    if (!localStorage.getItem('token') && !localStorage.getItem('id') && !localStorage.getItem('user')) {
      navigate('/');
      return 0;
    };

    const res = await carts();

    if (res?.status) {
      setCartArray(res?.data?.carts);
      updateTotal(res?.data?.totalPrice, res?.data?.totalQuantity);
    } else if (res?.unVerify) {
      localStorage.clear();
      window.location.href = "/"
    }
  }

  const updateCartApi = async (status) => {
    const res = await updateCart({
      status
    });

    if (res?.status) {
      setCartArray([]);
      updateTotal(0, 0);
    }
    else if (res?.unVerify) {
      localStorage.clear();
      navigate('/');
    }
  }

  const placeOrderApi = async ({ razorpay_payment_id, razorpay_order_id }) => {
    const res = await buyOrder({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
    });

    if (res?.status) {
      navigate('/order');
      await setTimeout(() => null, 2000);
      return Promise.resolve(true)
    } else {
      return Promise.reject(true)
    }
  }


  const createOptions = ({ amount, notes, id, KEY_ID }) => {
    console.log(KEY_ID);
    var options = {
      key: KEY_ID,
      amount: amount,
      currency: "INR",
      name: "Shopway Product",
      description: "Test Transaction",
      image: `${PORT}/photos/logo.png`,
      order_id: id,
      redirect: false,
      handler: async function (res) {
        toast.promise(placeOrderApi(res),
          {
            loading: 'Auto Redirecting Please wait...',
            success: <b>Order Placed</b>,
            error: <b>Network Error</b>,
          }
        );
      },
      modal: {
        ondismiss: function () {
          toast.error("Payment Fail");
        }
      },
      prefill: {
        name: name,
        email: email,
      },
      notes: notes,
      theme: {
        color: "#3399cc"
      }
    }
    return options;
  };

  const createOrderApi = async () => {
    setIsButtonLoading(true);
    const res = await createOrder();
    setIsButtonLoading(false);

    if (res?.status) {
      await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      const options = await createOptions(res?.data);
      const payment = await new window.Razorpay(options);
      payment.open();
    }
    else if (res?.unVerify) {
      localStorage.clear();
      navigate('/');
    }
    else if (res?.simple) {
      toast(res?.message);
    } else {
      toast.error(res?.message);
    }
  }

  useEffect(() => {
    const tempFun = async () => {
      dispatch({ type: 'setIsLoading', payload: true });
      await cartsApi();
      dispatch({ type: 'setIsLoading', payload: false });
    }

    tempFun();
  }, [])

  return (
    <div className='cart-main-container'>
      {
        isLoading ? <div style={{
          marginTop: "40px",
          display: "flex",
          alignContent: "center",
          justifyContent: "center",
          width:"100%"
        }}><div>Loading . . .</div></div>
          : <> <div className='cart-container'>
            <div className='cart-title-container'>
              {
                cartsArray?.length ? <>
                  <div className='cart-title'>Shopping Cart</div>
                  <div className='cart-delete-all' onClick={() => { updateCartApi(3) }}>Delete all items</div>
                </> : <>
                  <div className='cart-title'>Cart is Empty</div>
                  <div className='cart-delete-all' onClick={() => { navigate('/') }}>Continue Shopping to Click here</div>
                </>
              }
            </div>
            {cartsArray?.map((val, ind) =>
              <CartContainer
                object={val}
                key={ind}
                handleSubmit={handleSubmit} />)}
          </div>


            <div className='sum-container'>
              {
                cartsArray?.length ? <>
                  <p style={{ fontSize: "x-large", fontWeight: '500' }}>
                    Subtotal : {indianRupeesFormate(totalPrice)}
                  </p>
                  <p>SubItems : {totalQuantity}</p>
                  <div className='sum-proceed-btn-container'>
                    <button
                      className='sum-proceed-btn'
                      onClick={() => createOrderApi()}>
                      {
                        isButtonLoading ? "Loading . . ." : "proceed to buy"
                      }
                    </button>
                  </div>
                </> : <>
                  <p style={{ fontWeight: "500" }}>No Items in your cart</p>
                </>
              }
            </div>
          </>}
    </div>
  )
}


export default Cart