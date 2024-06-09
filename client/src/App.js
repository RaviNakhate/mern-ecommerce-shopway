import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  Cart,
  Home,
  Login,
  Order,
  Product,
  Profile,
  Register,
  Search,
  Forgot
} from "./views/cilent/index.js";
import {
  Dashboard,
  Products,
  AddProduct,
  Orders
} from "./views/admin/index.js"
import { Menu, Header } from "./components/index.js";
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <Header />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/login' element={<Login />} />
        <Route path='/order' element={<Order />} />
        <Route path='/product/:id' element={<Product />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/register' element={<Register />} />
        <Route path='/search' element={<Search />} />
        <Route path='/forgot' element={<Forgot />} />
        <Route path='/admin' element={<Menu />}>
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='products' element={<Products />} />
          <Route path='orders' element={<Orders />} />
          <Route path='addproduct' element={<AddProduct />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
