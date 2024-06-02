import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import "./index.css";
import { orders } from '../../../api/axios';
import { useDispatch, useSelector } from 'react-redux';
import { OrderSubProduct } from "../../../components/index"
import { dateFormate, indianRupeesFormate } from '../../../methods';


function Order() {
  const { isLoading } = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [orderArray, setOrderArray] = useState([]);
  const [totalOrderArray, setTotalOrderArray] = useState(0);

  const [isLoadMore, setIsLoadMore] = useState(false);
  const [isLoadMoreLoading, setIsLoadMoreLoading] = useState(false);


  const loadMore = async () => {
    setIsLoadMoreLoading(true);
    await ordersApi();
    setIsLoadMoreLoading(false);

    if (orderArray.length === totalOrderArray) {
      setIsLoadMore(false);
    }
  }

  const ordersApi = async () => {
    if (!localStorage.getItem('token') && !localStorage.getItem('id') && !localStorage.getItem('user')) {
      navigate('/');
      return 0;
    };

    const res = await orders({
      skip: orderArray.length,
      limit: 5
    });


    if (res?.status) {
      await setOrderArray((prev) => [...prev, ...res?.data?.array]);
      await setTotalOrderArray(res?.data?.size);
      if (res?.data?.size > 0) {
        setIsLoadMore(true);
      }

    } else if (res?.unVerify) {
      localStorage.clear();
      navigate("/");
      return 0;
    }
  }


  useEffect(() => {
    const tempFun = async () => {
      dispatch({ type: 'setIsLoading', payload: true });
      await ordersApi();
      dispatch({ type: 'setIsLoading', payload: false });
    }

    tempFun();
  }, [])

  return (
    <div className='order-main-container'>
      {
        isLoading ? <div style={{
          marginTop: "40px",
          display: "flex",
          alignContent: "center",
          justifyContent: "center",
          width: "100%"
        }}><div>Loading . . .</div></div>
          : <>
            {orderArray?.length ? null : <div className='no-order-container'>
              <div>
                <div className='no-order-title'>There are no order yet.</div>
                <div className='no-order-shopping-continue' onClick={() => { navigate('/') }}>Continue Shopping to Click here</div>
              </div>
            </div>}

            <div className='order-list-container'>
              {orderArray?.map((val, ind) => {
                return (
                  <div className='order-container' key={ind}>
                    <table className='order-table'>
                      <tbody>
                        <tr>
                          <td>Order ID </td>
                          <td>:</td>
                          <td>{val?.orderId}</td>
                        </tr>
                        <tr>
                          <td>Payment ID </td>
                          <td>:</td>
                          <td>{val?.paymentId ?? <div style={{ color: 'red' }}>Payment Fail</div>}</td>
                        </tr>
                        <tr>
                          <td>Order Time </td>
                          <td>:</td>
                          <td>{dateFormate(val?.createAt)}</td>
                        </tr>
                        <tr>
                          <td>Total Quantity </td>
                          <td>:</td>
                          <td>{val?.totalQuantity}</td>
                        </tr>
                        <tr className='large-txt'>
                          <td>Total Amount </td>
                          <td>:</td>
                          <td>{indianRupeesFormate(val?.totalAmount)}</td>
                        </tr>
                        {val?.orderComplete ? <tr>
                          <td>Delivered Time</td>
                          <td>:</td>
                          <td>
                            {dateFormate(val?.orderComplete)}
                          </td>
                        </tr> : null}
                        <tr>
                          <td>Status </td>
                          <td>:</td>
                          <td>
                            {val?.status === "process" ?
                              <div className='order-process'>Process</div>
                              : val?.status === "fail" ?
                                <div className='order-fail'>Fail </div>
                                : <div className='order-confirm'>confirm</div>}
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <div className='order-subproduct-list-container'>
                      {
                        val?.products?.map((ele, id) => {
                          return (<OrderSubProduct object={ele} key={id} />)
                        })
                      }
                    </div>
                  </div>

                )
              })
              }
            </div>
            {
              isLoadMore ? <div style={{
                idth: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <button
                  className='load-more'
                  onClick={() => loadMore()}>
                  {isLoadMoreLoading ? "Loading ..." : "Load more"}</button>
              </div> : null
            }
          </>
      }

    </div>
  )
}

export default Order