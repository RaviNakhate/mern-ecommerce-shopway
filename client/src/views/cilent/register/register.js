import React, { useEffect, useState } from 'react'
import "./index.css";
import { useNavigate } from 'react-router-dom';
import { sendOtp, register, details, getStates, getCities } from "../../../api/axios";
import toast from 'react-hot-toast';

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreement, setAgreement] = useState(true);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [address, setAddress] = useState("");
  const [isLoadLogin,setIsLoadLogin] = useState(false);
  const [isLoadRegister,setIsLoadRegister] = useState(false);



  const sendOtpApi = async () => {
    if (!email.trim().replace(/ +(?= )/g, '')) {
      toast("Please enter your Email");
      return 0;
    }

    setIsLoadLogin(true);
    const res = await sendOtp({ email });
    setIsLoadLogin(false);
    
    if (res?.status) {
      toast.success(res.message);
    } else { 
      res?.simple? toast(res.message): toast.error(res.message) }
  }


  const registerApi = async () => {
    if (!name.trim().replace(/ +(?= )/g, '')) {
      toast("Please enter your Name");
      return 0;
    }
    if (!email.trim().replace(/ +(?= )/g, '')) {
      toast("Please enter your Email");
      return 0;
    }
    if (!otp.trim().replace(/ +(?= )/g, '')) {
      toast("Please enter OTP ");
      return 0;
    }
    if (!state.trim()) {
      toast("Please select State");
      return 0;
    }
    if (!city.trim()) {
      toast("Please select City");
      return 0;
    }
    if (!address.trim().replace(/ +(?= )/g, '')) {
      toast("Please enter your Address");
      return 0;
    }
    if (!password.trim()) {
      toast("Please enter Password");
      return 0;
    }
    if (password.length<6) {
      toast("Password is not less than 6");
      return 0;
    }
    if (!confirmPassword.trim()) {
      toast("Please enter Confirm Password");
      return 0;
    }
    if (password !== confirmPassword) {
      toast("Password and Confirm Password must equal");
      return 0;
    }
    if (!agreement) {
      toast("Terms of Use and Privacy Policy is required");
      return 0;
    }

    setIsLoadRegister(true);
    const res = await register({
      name,
      email,
      otp,
      password,
      state,
      city,
      address
    });
    setIsLoadRegister(false);

     if (res?.status) {
      toast.success(res.message);
      navigate('/login');
    } else { 
      res?.simple? toast(res.message): toast.error(res.message) }
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


  const getStatesApi = async () => {
    const res = await getStates();
    setStates(res?.data?.states);
  }

  const getCitiesApi = async () => {
    const res = await getCities({ state });
    setCities(res?.data);
  }

  const enterPress = async (val) => {
    val === "Enter" && registerApi();
  }


  useEffect(() => {
    getStatesApi();

    authApi();
  }, []);

  useEffect(() => {
    state && getCitiesApi();
  }, [state]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: "center" }}>
      <div className='register-container'>
        <div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyUp={(e) => enterPress(e.key)}
            type="text"
            placeholder='Full Name'
            className='register-input register-full-name'
            spellCheck="false" />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", }}>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyUp={(e) => enterPress(e.key)}
            type="email"
            placeholder='Email'
            className='register-input register-email'
            spellCheck="false" />

        </div>
        <div className="otp-container" >
          <input
            value={otp}
            onChange={(e) => e.target.value >= 0 && setOtp(e.target.value)}
            onWheel={(e) => e.target.blur()}
            onKeyUp={(e) => enterPress(e.key)}
            type="number"
            placeholder='OTP'
            className='register-input register-otp' />
          <div className='otp-btn-container'>
            <button
              disabled={isLoadLogin?true:false}
              className="register-otp-btn"
              onClick={() => sendOtpApi()}> {isLoadLogin?'Loading...':'Send OTP'} </button>
          </div>
        </div>
        <div className='register-state-city-container'>
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className='register-input register-state'>
            {
              states?.map((val, ind) => { return <option value={val.name} key={ind}>{val.name}</option> })
            }
          </select>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            /* style={{marginLeft:'10px'}} */
            className='register-input register-city'>
            {
              cities?.map((val, ind) => { return <option value={val} key={ind}>{val}</option> })
            }
          </select>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", }}>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyUp={(e) => enterPress(e.key)}
            type="text"
            placeholder='Address'
            className='register-input register-address'
            spellCheck="false" />

        </div>
        <div>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyUp={(e) => enterPress(e.key)}
            type="password"
            placeholder='Password'
            className='register-input register-password'
            spellCheck="false" />
        </div>
        <div>
          <input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyUp={(e) => enterPress(e.key)}
            type="password"
            placeholder='Confirm Password'
            className='register-input register-confirm-password'
            spellCheck="false" />
        </div>
        <div style={{ marginTop: '20px' }}>
          <input type="checkbox" className='register-checkbox' defaultChecked={agreement} onClick={() => setAgreement(!agreement)} />
          <label className='register-condition'>I am agree to Shopways's Terms of Use and Privacy Policy.</label>
        </div>

        <div style={{ marginTop: '25px', display: "flex", justifyContent: "center" }}>
          <button
            disabled={isLoadRegister?true:false}
            className="register-otp-btn"
            onClick={() => registerApi()}> {isLoadRegister?'Loading...':'Register'} </button>
        </div>
        <div style={{ marginTop: '55px', textAlign: "center" }}>
          <label style={{ color: "grey" }}>Existing User ? </label>
          <button style={{ color: "blue" }} onClick={() => navigate('/login')}> Log in</button>
        </div>

      </div>
    </div>
  )
}

export default Register