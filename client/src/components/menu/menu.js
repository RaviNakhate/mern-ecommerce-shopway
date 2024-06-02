import React, { useEffect, useState } from 'react'
import "./index.css"
import { SlGraph } from "react-icons/sl";
import { HiMiniShoppingBag } from "react-icons/hi2";
import { MdShoppingCart } from "react-icons/md";
import { IoAddCircle } from "react-icons/io5";
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { CgProfile } from "react-icons/cg";
import { details } from "../../api/axios";

function Menu() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const logout = async () => {
        localStorage.clear();
        window.location.href = "/"
    }


    const detailsApi = async () => {
        if (!localStorage.getItem('token') && !localStorage.getItem('id') && !localStorage.getItem('user'))
        {
            navigate('/');
            return 0;
        };

        const res = await details();

        if (res?.status) {
            setName(res?.data?.name);
            setEmail(res?.data?.email);
        }
        else {
            logout();
        }
    }

    useEffect(() => {
    
        detailsApi();
    }, []);


    return (
        <div className='outlet'>
            <div className='menu-main-container'>
                <div className='menu-container'>
                    <CgProfile style={{ fontSize: "25px", marginLeft: "5px" }} />
                    <div className='menu-username'> <p>{name.toUpperCase()}</p><p>{email}</p></div>
                </div>

                <div className='menu-heading-container'>
                    <NavLink className='menu-heading' to='dashboard'>
                        <SlGraph style={{ fontSize: "20px", margin: "5px", marginRight: "15px" }} />
                        Dashboard
                    </NavLink>
                    <NavLink className='menu-heading' to='orders'>
                        <HiMiniShoppingBag style={{ fontSize: "20px", margin: "5px", marginRight: "15px" }} />
                        Orders
                    </NavLink>
                    <NavLink className='menu-heading' to='products'>
                        <MdShoppingCart style={{ fontSize: "20px", margin: "5px", marginRight: "15px" }} />
                        Products
                    </NavLink>
                    <NavLink className='menu-heading' to='addproduct'>
                        <IoAddCircle style={{ fontSize: "20px", margin: "5px", marginRight: "15px" }} />
                        Add Product
                    </NavLink>
                </div>

                <div className='logout-container'>
                    <button
                        className='logout-btn'
                        onClick={() => logout()}>
                        Log out</button>
                </div>
            </div>
            <Outlet />
        </div>
    )
}

export default Menu