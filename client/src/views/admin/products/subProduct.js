import React, { useState } from "react";
import { PORT } from '../../../utils';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { deleteProduct } from "../../../api/axios";


function SubProduct({ val, ind }) {
    const navigate = useNavigate();
    const [isDisplay, setIsDisplay] = useState(true);


    const deleteProductApi = async () => {
        const x = window.confirm("Are you sure delete product ?");
        if (x) {
            const res = await deleteProduct({ productId: val._id });

            if (res?.status) {
                setIsDisplay(false);
                toast.success(res?.message);
            } else if (res?.unVerify) {
                localStorage.clear();
                navigate('/');
            } else {
                toast.error(res?.message);
            }

        }
    }


    return <>
        {
            <tr key={ind} className={isDisplay ? "" : "delete-background"} >
                <td>{ind + 1}</td>
                <td><img src={PORT + val.imageUrl} className='table-product-img' alt={'product-' + (ind + 1) + '.jpg'} /></td>
                <td>{val.title}</td>
                <td className='white-space-nowrap'>₹ {val.price}</td>
                <td>{val.category}</td>
                <td>{val.rating}</td>
                <td style={{ textAlign: "center" }}><button className={`view-product-btn ${isDisplay ? '' : ' active-delete'}`}>Details</button></td>
                <td style={{ textAlign: "center" }}><button className={`edit-product-btn ${isDisplay ? '' : ' active-delete'}`}>Edit</button></td>
                <td style={{ textAlign: "center" }}><button className={`delete-product-btn ${isDisplay ? '' : ' active-delete'}`} onClick={() => deleteProductApi()}>Delete</button></td>
            </tr>
        }
    </>;
}

export default SubProduct;
