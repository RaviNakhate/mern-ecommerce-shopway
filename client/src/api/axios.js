import axios from "axios";
import { isArray, isObject } from "lodash";
import { isDate } from "moment";
import { PORT } from "../utils/index"

const axiosInstance = axios.create({
  baseURL: PORT
});
const headers = () => {
  return {
    token: localStorage.getItem("token"),
    user: localStorage.getItem("user"),
    id: localStorage.getItem('id')
  }
}




const sendOtp = async (body) => {
  try {
    const { data } = await axiosInstance.post("/user", body);
    return data;
  } catch (err) {
    return err;
  }
};
const login = async ({ email, password }) => {
  try {
    const { data } = await axiosInstance.get(`/user/${email}/${password}`);
    return data;
  } catch (err) {
    return err;
  }
};
const register = async (body) => {
  try {
    const { data } = await axiosInstance.put("/user", body);
    return data;
  } catch (err) {
    return err;
  }
};
const forgotOtp = async (body) => {
  try {
    const { data } = await axiosInstance.post("/user/forgot", body);
    return data;
  } catch (err) {
    return err;
  }
};
const forgotPassword = async (body) => {
  try {
    const { data } = await axiosInstance.put("/user/forgot", body);
    return data;
  } catch (err) {
    return err;
  }
};
const details = async () => {
  try {
    const id = localStorage.getItem('id');
    const { data } = await axiosInstance.get(`/user/${id}`, { headers: headers() });
    return data;
  } catch (err) {
    return err;
  }
};
const updateProfile = async (body) => {
  try {
    const { data } = await axiosInstance.patch("/user", body, { headers: headers() });
    return data;
  } catch (err) {
    return err;
  }
};



const addProduct = async (body) => {
  try {

    let formData = await new FormData();
    await Object.keys(body).forEach((item) => {
      if (body?.[item]) {
        if (body?.[item]?.name) {
          formData.append(item, body?.[item]);
        } else if (
          (isArray(body?.[item]) || isObject(body?.[item])) &&
          !isDate(body?.[item])
        ) {
          formData.append(item, JSON.stringify(body?.[item]));
        } else {
          formData.append(item, body?.[item]?.toString());
        }
      }
    });

    const { data } = await axiosInstance.post('/product', formData, { headers: headers() });
    return data;
  }
  catch (err) {
    return err;
  }
}
const listProduct = async ({ skip = 0, limit = 5 }) => {
  try {
    const { data } = await axiosInstance.get(`/product/list?skip=${skip}&limit=${limit}`, { headers: headers() });
    return data;
  } catch (err) {
    return err;
  }
};
const products = async ({ categories = [],
  skip = 0,
  limit = 7,
  rating = 0,
  sort = 0,
  search = "" }) => {
  try {
    
    const { data } = await axiosInstance.get(`/product/search?category=${categories.join(";")}&skip=${skip}&limit=${limit}&rating=${rating}&sort=${sort}&search=${search}`);
    return data;
  } catch (err) {
    return err;
  }
};
const product = async ({ id }) => {
  try {
    const { data } = await axiosInstance.get(`/product/${id}`);
    return data;
  } catch (err) {
    return err;
  }
};
const deleteProduct = async ({productId}) => {
  try {
    const { data } = await axiosInstance.delete(`/product/${productId}`, { headers: headers() });
    return data;
  } catch(err) {
    return err; 
  }
}


const dashboard = async () => {
  try {
    const { data } = await axiosInstance.get(`/dashboard`, { headers: headers() });
    return data;
  } catch (err) {
    return err;
  }
};
const updateCart = async (body) => {
  try {
    const { data } = await axiosInstance.post(`/cart`, body, { headers: headers() });
    return data;
  } catch (err) {
    return err;
  }
};

const carts = async () => {
  try {
    const id = localStorage.getItem('id');
    const { data } = await axiosInstance.get(`/cart/${id}`, { headers: headers() });
    return data;
  } catch (err) {
    return err;
  }
};



const createOrder = async (body) => {
  try {
    const { data } = await axiosInstance.post(`/order`,body , { headers: headers() });
    return data;
  } catch (err) {
    return err;
  }
};
const buyOrder = async (body) => {
  try {
    const { data } = await axiosInstance.patch(`/order`,body , { headers: headers() });
    return data;
  } catch (err) {
    return err;
  }
};
const orders = async ({skip, limit}) => {
  try {
    
    const { data } = await axiosInstance.get(`/order?skip=${skip}&limit=${limit}`,{ headers: headers() });
    return data;
  } catch (err) {
    return err;
  }
};
const ordersList = async ({skip, limit}) => {
  try {

    const { data } = await axiosInstance.get(`/order/list?skip=${skip}&limit=${limit}`,{ headers: headers() });
    return data;
  } catch (err) {
    return err;
  }
};
const approveOrder = async (body) => {
  try {
    const { data } = await axiosInstance.patch(`/order/confirm`,body , { headers: headers() });
    return data;
  } catch (err) {
    return err;
  }
}






const getStates = async () => {
  try {
    const { data } = await axios.post(`https://countriesnow.space/api/v0.1/countries/states`, {
      country: 'India'
    });
    return data;
  } catch (err) {
    return err;
  }
};
const getCities = async ({ state }) => {
  try {
    const { data } = await axios.post(`https://countriesnow.space/api/v0.1/countries/state/cities`, {
      country: "India",
      state: state
    });
    return data;
  } catch (err) {
    return err;
  }
};
const getCategories = async () => {
  try {
    const { data } = await axiosInstance.get(`/categorylist`);
    return data;
  } catch (err) {
    return err;
  }
};
export {
  login,
  sendOtp,
  register,
  forgotOtp,
  forgotPassword,
  details,
  addProduct,
  listProduct,
  dashboard,
  updateProfile,
  products,
  product,
  deleteProduct,
  updateCart,
  carts,
  orders,
  createOrder,
  buyOrder,
  ordersList,
  approveOrder,
  getCategories,
  getStates,
  getCities,
}