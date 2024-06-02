import React, { useEffect, useState } from 'react'
import "./index.css";
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { login, details } from "../../../api/axios";
import { useDispatch } from 'react-redux';

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading,setIsLoading] = useState(false);


  const loginApi = async () => {
    if (!email.trim()) {
      toast.error("Email required!");
      return 0;
    }
    if (!password.trim()) {
      toast.error("Password required!");
      return 0;
    }

    setIsLoading(true);
    const res = await login({ email, password });
    setIsLoading(false);

    if (res?.status) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem('id', res.data._id);
      localStorage.setItem("user", res.data.user);
      dispatch({ type: 'userUpdate', payload: res.data });

      await res?.data?.user === "client" ? navigate('/'): navigate('/admin/dashboard');
    }
    else { toast.error(res.message) }
  }

  
  const authApi = async () => {
    if (!localStorage.getItem('token') && !localStorage.getItem('id') && !localStorage.getItem('user')) return 0;
    
    const user = localStorage.getItem('user');
    const res = await details();

    if (res?.status) {
      user === "client" ? navigate('/') : navigate('/admin/dashboard');
    } else if (res?.unVerify) {
      localStorage.clear();
    } else { toast.error(res.message) }

  }


  useEffect(() => {
    authApi();
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: "center", height: "60vh" }}>
      <div className='login-container'>
        <div>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyUp={(e) => e.key === 'Enter' && loginApi()}
            type="email"
            placeholder='Email'
            className='login-input login-email'
            spellCheck="false" />
        </div>

        <div>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyUp={(e) => e.key === 'Enter' && loginApi()}
            type="password"
            placeholder='Password'
            className='login-input login-password' spellCheck="false" />
        </div>

        <div className="login-btn-container">
          <button className='nav-btn' onClick={() => loginApi()}>
          {isLoading?'Loading...':'Login'} 
          </button>
        </div>
        <div style={{ marginTop: '55px', textAlign: "center" }}>
          <label style={{ color: "grey" }}>New to Shopway ? </label>
          <button style={{ color: "blue" }} onClick={() => navigate('/register')}>Create an account</button>
        </div>

      </div>
    </div>
  )
}

export default Login