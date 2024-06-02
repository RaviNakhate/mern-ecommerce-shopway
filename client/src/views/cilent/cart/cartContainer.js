import React, { useEffect, useState } from "react";
import { IoAddCircleOutline } from "react-icons/io5";
import { FiMinusCircle } from "react-icons/fi";
import { product, updateCart } from "../../../api/axios"
import { PORT } from "../../../utils";
import { indianRupeesFormate } from "../../../methods";
import { useNavigate } from "react-router-dom";

function CartContainer({ object, handleSubmit }) {
    const navigate = useNavigate();
    const [productDetails, setProductDetails] = useState({});
    const [isLoading, setIsLoading] = useState(false);


    const productApi = async () => {
        setIsLoading(true);
        const res = await product({ id: object?.productId });
        setIsLoading(false);

        if (res?.status) {
            setProductDetails(res?.data);
        } else if (res?.unVerify) {
            localStorage.clear();
            navigate('/register');
          }
    }


    const updateCartApi = async (status) => {
        const res = await updateCart({
            productId: object?.productId,
            status
        });

        if (res?.status) {
            handleSubmit(res?.data);
        }
        if (res?.unVerify) {
            localStorage.clear();
            navigate('/');
        }
    }

    const goToProduct = async (id) => {
        navigate(`/product/${id}`);
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
    }
    

    useEffect(() => {
        productApi();
    }, [object?.productId]);

    return (
        <>{
            isLoading ? <div className="cart-skeleton"></div>
                : <div className='specific-cart-container'>
                    <img
                        src={PORT + productDetails?.imageUrl}
                        alt="cart-img"
                        className='specific-cart-img'
                        onClick={() => goToProduct(productDetails?._id)} />
                    <div style={{ marginLeft: "20px" }}>
                        <div
                            className='specific-cart-title'
                            onClick={() => goToProduct(productDetails?._id)}>{productDetails?.title}</div>
                        <div className='specific-cart-counter'>
                            <IoAddCircleOutline
                                style={{ fontSize: "25px", color: "grey", cursor: "pointer" }}
                                onClick={() => updateCartApi(1)} />
                            <p className='specific-cart-qty'>{object.quantity}</p>
                            <FiMinusCircle
                                style={{ fontSize: "22px", color: "grey", cursor: "pointer" }}
                                onClick={() => updateCartApi(2)} />
                        </div>
                        <div style={{ fontWeight: "500" }}>{indianRupeesFormate(productDetails?.price)}</div>
                    </div>
                </div>

        }
        </>

    );
}

export default CartContainer;
