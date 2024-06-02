import React, { useState } from "react";
import { orderSubProduct } from "../../../components/index";
import { dateFormate, indianRupeesFormate } from '../../../methods';
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast"
import { approveOrder } from '../../../api/axios';


function SubOrder({ val }) {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [orderComplete,setOrderComplete] = useState(val?.orders?.orderComplete)
    const [status,setStatus] = useState(val?.orders?.status);

    const approveOrderApi = async (userId, orderId) => {
        setIsLoading(true);
        const res = await approveOrder({ userId, orderId });

        if (res?.status) {
            setOrderComplete(res?.data?.orderComplete);
            setStatus(res?.data?.status);
        } else if (res?.unVerify) {
            localStorage.clear();
            navigate('/');
        } else {
            setIsLoading(false);
            toast.error(res?.message);
        }
    }

    return <div className='order-container'>
        {
            status==="process" ?
                <div className='orders-placed'>
                    <div>Order Placed ?</div>
                    <button
                        className='orders-placed-btn'
                        onClick={async () => {
                            approveOrderApi(val?.userDetails?._id, val?.orders?.orderId);
                        }}>{isLoading ? "Loading..." : "Yes"}</button>

                </div> : null
        }


        <table className='order-table'>
            <tbody>
                <tr className='color-grey'>
                    <td>Name </td>
                    <td>:</td>
                    <td>{val?.userDetails?.name}</td>
                </tr>
                <tr className='color-grey'>
                    <td>Email </td>
                    <td>:</td>
                    <td>{val?.userDetails?.email}</td>
                </tr>
                <tr className='color-grey'>
                    <td>Location </td>
                    <td>:</td>
                    <td>{val?.userDetails?.state}, {val?.userDetails?.city}</td>
                </tr>
                <tr className='color-grey'>
                    <td>Address </td>
                    <td>:</td>
                    <td>{val?.userDetails?.address}</td>
                </tr>
                <tr>
                    <td>Order ID </td>
                    <td>:</td>
                    <td>{val?.orders?.orderId}</td>
                </tr>
                <tr>
                    <td>Payment ID </td>
                    <td>:</td>
                    <td>{val?.orders?.paymentId ?? <div style={{ color: 'red' }}>Payment Fail</div>}</td>
                </tr>
                <tr>
                    <td>Order Time </td>
                    <td>:</td>
                    <td>{dateFormate(val?.orders?.createAt)}</td>
                </tr>
                {
                  orderComplete ? 
                  <tr>
                    <td>Delivered Time </td>
                    <td>:</td>
                    <td>{dateFormate(orderComplete)}</td>
                </tr> : null
                }
                <tr>
                    <td>Total Quantity </td>
                    <td>:</td>
                    <td>{val?.orders?.totalQuantity}</td>
                </tr>
                <tr className='large-txt'>
                    <td>Total Amount </td>
                    <td>:</td>
                    <td>{indianRupeesFormate(val?.orders?.totalAmount)}</td>
                </tr>
                <tr>
                    <td>Status </td>
                    <td>:</td>
                    <td>
                        {status === "process" ?
                            <div className='order-process'>Process</div>
                            : status === "fail" ?
                                <div className='order-fail'>Fail </div>
                                : <div className='order-confirm'>confirm</div>}
                    </td>
                </tr>
            </tbody>
        </table>

        <div className='order-subproduct-list-container'>
            {
                val?.orders?.products?.map((ele, id) => {
                    return (
                        <orderSubProduct object={ele} key={id} />
                    );
                })
            }
        </div>
    </div>;
}

export default SubOrder;
