import React, { useEffect, useState } from 'react'
import "./index.css"
import logo from "../../assets/shopway-logo.png";
import { useLocation, useNavigate } from 'react-router-dom'
import { CgProfile } from "react-icons/cg";
import { MdKeyboardArrowDown } from "react-icons/md";
import { details, products, getCategories } from "../../api/axios";
import { useDispatch, useSelector } from 'react-redux';
import { PORT } from '../../utils';
import { searchFilter, toCamelCase, textWrap } from "../../methods/index"

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {name, state, city, address} = useSelector((state) => state);
  const [categoryList,setCategoryList] = useState([]);

  const [user, setUser] = useState(""); // user = client || admin || null
  const [search, setSearch] = useState("");
  const [productsArray, setProductsArray] = useState([]);

  const [isFocused, setIsFocused] = useState(false);
  const [categorySearchList, setCategorySearchList] = useState([]);
  const [isCategoryHovered, setIsCategoryHovered] = useState(false);
  const [isProfileHovered, setIsProfileHovered] = useState(false);


  const logout = async () => {
    localStorage.clear();
    navigate('/');
    setUser('');
  }

  const detailsApi = async () => {
    if (!localStorage.getItem('token') && !localStorage.getItem('id') && !localStorage.getItem('user'))
    {
      setUser('');
      return 0;
    };

    const res = await details();

    if (res?.status) {
      setUser(res?.data?.user);
      dispatch({ type: 'userUpdate', payload: res.data });
    } else if (res?.unVerify) {
      logout();
    }
  }

  const searchApi = async () => {
    const res = await products({ search: search.trim() });

    if (res?.status) {
      setCategorySearchList(searchFilter(categoryList, search.trim()));
      setProductsArray(res?.data.data);
    } else if (res?.unVerify) {
      logout();
    }
  }


  useEffect(() => {
    detailsApi();

  }, [localStorage.getItem('token'),
  localStorage.getItem('user'),
  localStorage.getItem('id') ],
  name, state, city, address);

  useEffect(() => {
    search.trim() && searchApi();

  }, [search])

  useEffect(() => {
    setSearch("")
  }, [location])


  
  useEffect(()=> {
    const getCategoriesApi = async () => {
      const res = await getCategories();
      setCategoryList(res?.categoryList);
    }
    
    getCategoriesApi();
  },[])

  return (<>
    {user === "admin" ? null
      : <header className='nav'>
        <div className='nav-left'>
          <img src={logo} alt="shopway-logo" className="nav-logo" onClick={() => navigate("/")} />

          <div className='search-input-list-container'>
            <div className='search-input-container'>
              <input
                type="search"
                placeholder='Search for Products, Brands and More'
                className='search-input'
                spellCheck='false'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setTimeout(() => setIsFocused(false), 100)} />
            </div>
            <div className="search-list-content" style={{ display: search.trim() && isFocused ? "block" : "none" }}>
                {categorySearchList?.map((val, ind) => {
                  return (
                    <div
                      className='search-category-container'
                      key={ind}
                      onClick={()=> navigate('/search', { state: { defaultCategory: [val],b:"df" } })}>
                      {toCamelCase(val)}
                    </div>
                  )

                })}

                {
                  productsArray?.map((val, ind) => {
                    return (
                      <div
                        className='search-product-container'
                        key={ind}
                        onClick={() => {
                          setSearch(val.title);
                          navigate(`/product/${val._id}`)
                        }}>
                        <img src={PORT + val.imageUrl} alt="product-img" className='searchlist-product-img' />
                        <p className='search-product-title'>{val.title}</p>
                      </div>
                    )
                  })
                }
              </div>
          </div>
        </div>


        <div className='nav-right' >
        <div 
                className='category-side-container'
                onMouseOver={() => setIsCategoryHovered(true)}
                onMouseOut={() => setIsCategoryHovered(false)}
              >
                <div className='category-side-btn'>
                  Category <MdKeyboardArrowDown style={{ fontSize: "25px", marginLeft: "5px" }} />
                </div>
                <div 
                  className="category-side-content"
                  style={{display:isCategoryHovered?"block":"none"}}>
                  <button
                          className='category-btn-item'
                          onClick={() => {
                            setIsCategoryHovered(false);
                            navigate('/search');
                          }
                          }>All</button> 
                  {
                    categoryList.map((val, ind) => {
                      return (
                        <button
                          className='category-btn-item'
                          tabIndex={ind+1}
                          key={ind}
                          onClick={() => {
                            setIsCategoryHovered(false);
                            navigate('/search', { state: { defaultCategory: [val] } });
                          }
                          }>{toCamelCase(val)}</button>
                      )

                    })
                  }
                  <button>Laptops</button>
                </div>
              </div>
              
          {user === "client" ?
            <>
              {/* Same css name beacause dropdown hover content */}
              <div
                className='profile-side-container'
                onMouseOver={() => setIsProfileHovered(true)}
                onMouseOut={() => setIsProfileHovered(false)}
                >
                <div className='profile-side-btn white-space-nowrap'>
                  <CgProfile style={{ marginRight: "5px" }} /> {textWrap(name,17)}
                  <MdKeyboardArrowDown style={{ fontSize: "25px", marginLeft: "5px" }} />
                </div>
                <div
                  style={{display:isProfileHovered?"block":"none"}}
                  className="profile-side-content"
                  onClick={()=> setIsProfileHovered(false)}>
                  <button onClick={() => navigate('/')}>Home</button>
                  <button onClick={() => navigate('/profile')}>Profile</button>
                  <button onClick={() => navigate('/cart')}>Saved</button>
                  <button onClick={() => navigate('/order')}>My Orders</button>
                  <button onClick={() => logout()}>Log out</button>
                </div>
              </div>
            </>
            : <div className='nav-btn-container'>
              <button
                className='nav-btn nav-btn-mobile'
                style={{marginRight:"10px"}}
                onClick={() => navigate('/register')}>Register</button>
              <button
                className='nav-btn nav-btn-mobile'
                onClick={() => navigate('/login')}>Login</button>
            </div> }
        </div>
      </header>}
  </>)
}

export default Navbar