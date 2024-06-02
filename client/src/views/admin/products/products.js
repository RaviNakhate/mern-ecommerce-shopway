import React, { useEffect, useState } from 'react'
import "./index.css"
import { listProduct } from "../../../api/axios";
import { useNavigate } from 'react-router-dom';
import SubProduct from './subProduct';

function Products() {
  const navigate = useNavigate();
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(5);
  const [totalProducts, setTotalProducts] = useState(0);
  const [data, setData] = useState([]);
  const [btnDisplay, setBtnDisplay] = useState(true);
  const [isLoading, setIsLoading] = useState(false);



  const loadMore = async () => {
    if (totalProducts === data.length) {
      setBtnDisplay(false);
    }
    else {
      await setSkip((prevSkip) => prevSkip + limit);
      await setLimit((prevLimit) => prevLimit);
      await listProductApi()
    }
  }


  const listProductApi = async () => {
    if (!localStorage.getItem('token') && !localStorage.getItem('id') && !localStorage.getItem('user')) {
      navigate('/');
      return 0;
    };


    const res = await listProduct({ skip, limit });

    if (res?.status) {
      setTotalProducts(res?.data?.totalProducts);
      setData((prevData) => [...prevData, ...res?.data?.data]);
    }
    else if (res?.unVerify) {
      localStorage.clear();
      navigate('/');
    }
  }


  useEffect(() => {
    const tempFun = async () => {
      await setIsLoading(true);
      await listProductApi();
      await setIsLoading(false);
    }

    tempFun();
  }, [])

  return (
    <div className='list-product-container'>
      {
        isLoading ? "Loading..."
          : <>
            <table cellPadding={10} className='list-product-table' border='1'>
              <tbody>
                <tr>
                  <th></th>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Rating</th>
                  <th></th>
                  <th></th>
                  <th></th>
                </tr>
                {
                  data.map((val, ind) => {
                    return (<SubProduct val={val} ind={ind} key={ind} />)
                  })
                }
              </tbody>
            </table>
            <div style={{ marginTop: "2%", textAlign: "center" }}>
              {btnDisplay && <button className='nav-btn' onClick={() => loadMore()}>Load more</button>}
            </div>
          </>
      }
    </div>
  )
}

export default Products