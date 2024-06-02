import React, { useEffect, useState } from 'react'
import "./index.css";
import { ImCross } from "react-icons/im";
import { addProduct, getCategories } from "../../../api/axios";
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';


function AddProduct() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState(1);
  const [rating, setRating] = useState(1);
  const [delivery, setDelivery] = useState(1);
  const [category, setCategory] = useState("electronic"); // same as categories first element
  const [description, setDescription] = useState('');

  const [thumbnailName, setThumbnailName] = useState("");
  const [thumbnail, setThumbnail] = useState();
  const [thumbnailPreview, setThumbnailPreview] = useState();
  const [categoriesList,setCategoryList] = useState([]);
  const [isLoading,setIsLoading] = useState(false);


  const removeImage = () => {
    setThumbnailName("");
    setThumbnail();
    setThumbnailPreview();
  }
  const checkEmptyImage = () => {
    return thumbnailName && thumbnail && thumbnailPreview ? true : false;
  }

  const reset = () => {
    setTitle("");
    setPrice(1);
    setRating(0);
    setDelivery(1);
    setCategory("electronic");
    setDescription("");
    removeImage();
  }

  const addProductApi = async () => {
    if (!localStorage.getItem('token') && !localStorage.getItem('id') && !localStorage.getItem('user')) {
      navigate('/');
      return 0;
    }

    // validation
    if (!checkEmptyImage()) { toast('Please select product image'); return 0 }
    if (!title.trim().replace(/ +(?= )/g, '')) { toast('Please enter title'); return 0 };
    if (!description.trim().replace(/ +(?= )/g, '')) { toast('Please enter Description'); return 0 };

    setIsLoading(true);
    const body = await {
      title,
      price,
      rating,
      delivery,
      category,
      description,
      image: thumbnail,
      thumbnailName: thumbnailName === "" ? false : true,
    }
    const res = await addProduct(body);
    setIsLoading(false);

    if (res?.status) {
      reset();
      toast.success(res.message);
    }
    else if (res?.unVerify) {
      localStorage.clear();
      navigate('/');
    } else {
      toast(res?.message);
    }
  }



  useEffect(() => {
    const getCategoriesApi = async () => {
      const res = await getCategories();
      setCategoryList(res?.categoryList);
    }

    getCategoriesApi();
  }, [])

  return (
    <div className='add-product-container'>
      <table cellPadding={10} className='add-product-table'>
        <tr>
          <td colSpan={1}><label className='title-product'>Title</label></td>
          <td colSpan={3}><textarea value={title} onChange={(e) => setTitle(e.target.value)} className='input-product1' spellCheck='false' rows='3' /></td>
        </tr>
        <tr>
          <td colSpan={1}><label className='title-product'>Image</label></td>
          <td colSpan={2}><input
            placeholder='kdf'
            value={thumbnailName}
            accept=".jpg"
            onChange={(e) => {
              e?.target?.files?.[0] && setThumbnail(e.target.files?.[0]);
              setThumbnailName(e.target.value);
              e?.target?.files?.[0] && setThumbnailPreview(URL?.createObjectURL(e.target.files?.[0]));
            }} type='file' className='input-product1' /> </td>
          <td> {thumbnailName && thumbnailPreview ? (<div style={{ display: 'flex' }}>
            <img
              src={thumbnailPreview}
              style={{ width: "200px" }}
              alt="thumbnail"
            /><ImCross onClick={() => removeImage()} style={{ margin: '2%', cursor: 'pointer' }} />
          </div>
          ) : (
            null
          )}</td>
        </tr>
        <tr>
          <td><label className='title-product'>Price</label></td>
          <td><input
            value={price}
            onChange={(e) => e.target.value >= 1 && setPrice(e.target.value)}
            onWheel={(e) => e.target.blur()}
            type='number'
            className='input-product2'
            spellCheck='false' />₹ </td>
          <td><label className='title-product'>Rating</label></td>
          <td><input
            value={rating}
            onChange={(e) => e.target.value >= 0 && e.target.value <= 5 && setRating(e.target.value)}
            onWheel={(e) => e.target.blur()}
            type='number'
            className='input-product2'
            spellCheck='false' /> </td>
        </tr>
        <tr>
          <td><label className='title-product'>Delivery</label></td>
          <td><input
            value={delivery}
            onChange={(e) => e.target.value >= 1 && e.target.value <= 14 && setDelivery(e.target.value)}
            type='number'
            className='input-product2'
            spellCheck='false' />(within 14 day's)</td>
          <td><label className='title-product'>Category</label></td>
          <td ><select className='input-product2' value={category} onChange={(e) => setCategory(e.target.value)}>
            {
              categoriesList?.map((val, ind) => {
                return <option value={val} key={ind}>{val.charAt(0).toUpperCase() + val.slice(1)}</option>
              })
            }
          </select>
          </td>
        </tr>
        <tr>
          <td colSpan={1}><label className='title-product'>Description</label></td>
          <td colSpan={3}><textarea value={description} onChange={(e) => setDescription(e.target.value)} className='input-product1' spellCheck='false' rows='7' /> </td>
        </tr>
      </table>
      <button className='nav-btn' onClick={() => addProductApi()}>
        { isLoading?"Loading...":"Add Product" }
      </button>
    </div>
  )
}

export default AddProduct