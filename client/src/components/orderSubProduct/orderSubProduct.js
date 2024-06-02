import React, { useEffect, useState } from "react";
import { indianRupeesFormate } from '../../methods';
import { product } from "../../api/axios";
import { PORT } from "../../utils";
import "./index.css";

function OrderSubProduct({ object }) {
    const [details, setDetails] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const productApi = async () => {
        setIsLoading(true);
        const res = await product({ id: object.productId });
        setIsLoading(false);

        if (res?.status) {
            setDetails(res?.data);
        }
    }

    useEffect(() => {
        productApi();
    }, []);

    return <div className='order-subproduct-container'>
        {
            isLoading ?"Loading . . ."
                : <>
                    <img src={PORT + details?.imageUrl} alt="product" className='order-subproduct-img'></img>

                    <div className='order-subproduct-title-container'>
                        <div>
                            <div>{details.title}</div>
                            <div>QTY : {object?.quantity}</div>
                        </div>
                        <div>{indianRupeesFormate(object?.price)}</div>
                    </div>
                </>
        }

    </div>;
}

export default OrderSubProduct;
