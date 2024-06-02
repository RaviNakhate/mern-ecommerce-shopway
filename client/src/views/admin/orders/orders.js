import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import "./index.css";
import { ordersList } from '../../../api/axios';
import toast from 'react-hot-toast';
import SubOrder from './subOrder';

function Orders() {
  const navigate = useNavigate();
  const [orderArray, setOrderArray] = useState([]);
  const [totalOrderArray, setTotalOrderArray] = useState(0);

  const [isLoadMore, setIsLoadMore] = useState(false);
  const [isLoadMoreLoading, setIsLoadMoreLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  const loadMore = async () => {
    setIsLoadMoreLoading(true);
    await ordersListApi();
    setIsLoadMoreLoading(false);

    if (orderArray.length === totalOrderArray) {
      setIsLoadMore(false);
    }
  }


  const ordersListApi = async () => {
    setIsLoading(true);
    const res = await ordersList({
      skip: orderArray.length,
      limit: 10
    });
    setIsLoading(false);

    if (res?.status) {
      await setOrderArray((prev) => [...prev, ...res?.data?.array]);
      await setTotalOrderArray(res?.data?.size);
      if (res?.data?.size > 0) {
        setIsLoadMore(true);
      }

    } else if (res?.unVerify) {
      localStorage.clear();
      navigate('/');
    } else {
      toast.error(res?.message);
    }
  }


  useEffect(() => {
    ordersListApi();
  }, []);

  return (
    <div className='orders-main-container'>
      {

        isLoading ? <div style={{margin:"40px"}}>Loading...</div>
          : <div className='order-list-container'>
            {
              orderArray?.map((val, ind) => {
                return (<SubOrder val={val} key={ind} />)
              })
            }

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
          </div>
      }


    </div>
  )
}

export default Orders