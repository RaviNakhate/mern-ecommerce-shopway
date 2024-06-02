import React, { useEffect, useRef, useState } from 'react'
import "./index.css";
import { useLocation, useNavigate } from 'react-router-dom';
import { products, getCategories } from '../../../api/axios';
import { indianRupeesFormate } from "../../../methods/index"
import { PORT } from '../../../utils';
import { useDispatch, useSelector } from 'react-redux';
import { FaStar } from "react-icons/fa";


function Search() {
  const ref = useRef(true);
  const location = useLocation();
  const state = location?.state ?? {};
  const { defaultCategory = [] } = state;
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state);
  const dispatch = useDispatch();

  const [skip, setSkip] = useState(0);
  const afterFirstLimit = 8;
  const [limit, setLimit] = useState(12);

  const [totalProducts, setTotalProducts] = useState(0);
  const [productsArray, setProductsArray] = useState([]);

  const [arr1,setArr1] = useState([]);
  const arr2 = ["Featured", "Low to High", "High to Low"]
  const arr3 = [4, 3, 2, 1]
  const [categories, setCategories] = useState(defaultCategory);
  const [sort, setSort] = useState(0);
  const [rating, setRating] = useState(1);

  const [btnDisplay, setBtnDisplay] = useState(true);
  const [isLoadMoreLoading, setIsLoadMoreLoading] = useState(false);


  const setDefaultPagination = async () => {
    setSkip(0);
    setLimit(12);
    setBtnDisplay(true);
    setProductsArray([]);
  }

  const clearAll = async () => {
    if(categories.length===0 && sort===0 && rating===1) {
      return 0;
    }

    setCategories([]);
    setSort(0);
    setRating(1);

    setDefaultPagination();
  }


  const productsApi = async () => {
    const res = await products({
      categories,
      skip,
      limit,
      rating,
      sort
    });

    if (res?.status) {
      setTotalProducts(res?.data?.totalProducts);
      setProductsArray((prev) => [...prev, ...res?.data?.data]);

      if (totalProducts!==0 && totalProducts === productsArray?.length) {
        setBtnDisplay(false);
      }
    }
    else if (res?.unVerify) {
      localStorage.clear();
      navigate('/register');
    }
  }


  const loadMore = async () => {
    if (totalProducts === productsArray?.length) {
      setBtnDisplay(false);
    }
    else {
      setSkip(productsArray.length);
      setLimit(afterFirstLimit);
      return true;
    }
  }


  const updateCategory = async (val) => {
    if (categories.includes(val)) {
      let newArr = categories.filter(x => x !== val);
      setCategories(newArr);
    }
    else {
      setCategories((prev) => [...prev, val]);
    }
  }

  const fun1 = (val) => {
    return (<>
      <label style={{ display: "flex", marginTop: "5px" }}>
        <input
          style={{ cursor: 'pointer' }}
          type='checkbox'
          name="category"
          onChange={() => {
            setDefaultPagination();
            updateCategory(val);
          }}
          checked={categories?.includes(val) ? true : false} />
        <p className='filter-sub-category'> {val} </p>
      </label>      
    </>);
  }

  const fun2 = (val, ind) => {
    return (<>
      <label style={{ display: "flex", marginTop: "5px" }} key={ind}>
        <input
          style={{ cursor: 'pointer' }}
          type='radio'
          name="sort"
          checked={sort === ind ? true : false}
          onChange={() => {
            setDefaultPagination();
            setSort(ind);
          }} />
        <p className='filter-sub-category'> {val} </p>
      </label>
    </>);
  }

  const fun3 = (val) => {
    return (<>
      <label style={{ display: "flex", marginTop: "5px" }}>
        <input
          style={{ cursor: 'pointer' }}
          type='radio'
          name="rating"
          checked={rating === val ? true : false}
          onChange={() => {
            setDefaultPagination();
            setRating(val);
          }} />
        <p className='filter-sub-category'> {val} & above </p>
      </label>
    </>);
  }

  const product = (val) => {
    return (
      <>
        { val?.rating?<div className='search-rating-label'>
          {val?.rating} <FaStar style={{ fontSize: "smaller", marginLeft:"3px" }} />
          </div> : null }
        <img src={PORT + val.imageUrl} alt="product" className='search-product-img' />
        <div className='search-product-title'>{val.title}</div>
        <div className='search-product-price'>{indianRupeesFormate(val.price)}</div>
      </>
    )
  }


  useEffect(() => {
    const tempFun = async () => {
      dispatch({ type: 'setIsLoading', payload: isLoadMoreLoading?false:true });
      await productsApi();
      dispatch({ type: 'setIsLoading', payload: false });
      setIsLoadMoreLoading(false);
    }

    tempFun();
  }, [categories, rating, sort, skip])


  useEffect(()=>{
    if (ref.current) {
      ref.current = false;
      return;
    }

    const tempFun = async () => {
      clearAll();
      const data = defaultCategory[0];
      await setCategories([data]);
    }

    tempFun();
  },[defaultCategory[0]]);


  useEffect(()=> {
    const getCategoriesApi = async () => {
      const res = await getCategories();
      setArr1(res?.categoryList);
    }
    
    getCategoriesApi();
  },[])


  return (
    <div className='search-container'>
      <div className='search-left'>
        <div className='filter-heading-container'>
          <div className='filter-heading'>Filters</div>
          <button
            className="filter-clear-all"
            onClick={() => {
              clearAll();
            }}>CLEAR ALL</button>
        </div>

        <div className='filter-container'>
          <div className='filter-sub-container'>
            <label className='filter-title'>CATEGORY</label>
            {arr1.map((val, ind) => { return <div key={ind}>{fun1(val)}</div> })}
          </div>

          <div className='filter-sub-container'>
            <label className='filter-title'>PRICING</label>
            {arr2.map((val, ind) => { return <div key={ind}>{fun2(val, ind)}</div> })}
          </div>

          <div className='filter-sub-container'>
            <label className='filter-title'>RATING</label>
            {arr3.map((val, ind) => { return <div key={ind}>{fun3(val)}</div> })}
          </div>
        </div>
      </div>

      <div className='search-right-container'>
        <div className='search-right' >

          {isLoading ?
            <div style={{ marginTop: "20px" }}>Loading . . .</div>
            : productsArray?.map((val, ind) => {
              return (
                <div
                  className='search-product'
                  key={ind}
                  onClick={() => navigate(`/product/${val._id}`)}>
                  {product(val, ind)}
                </div>)
            })}
        </div>
        <div className='search-right'>
          {productsArray.length &&
            btnDisplay ? <button
              className='load-more'
              onClick={() =>{ 
              setIsLoadMoreLoading(true);
              loadMore() }}>
            {isLoadMoreLoading ? "Loading ..." : "Load more"}</button>
            : null}
        </div>
      </div>

    </div>
  )
}

export default Search