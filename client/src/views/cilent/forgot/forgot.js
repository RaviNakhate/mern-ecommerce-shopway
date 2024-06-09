import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { forgotOtp, forgotPassword, details } from "../../../api/axios";

function Forgot() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isOtpLogin, setIsOtpLogin] = useState(false);


    const ForgotOtpApi = async () => {
        if (!email.trim().replace(/ +(?= )/g, '')) {
            toast("Please enter your Email");
            return 0;
        }

        setIsOtpLogin(true);
        const res = await forgotOtp({ email });
        setIsOtpLogin(false);

        if (res?.status) {
            toast.success(res.message);
        } else {
            res?.simple ? toast(res.message) : toast.error(res.message)
        }
    }


    const ForgotPasswordApi = async () => {
        if (!email.trim().replace(/ +(?= )/g, '')) {
            toast("Please enter your Email");
            return 0;
        }
        if (!otp.trim().replace(/ +(?= )/g, '')) {
            toast("Please enter OTP ");
            return 0;
        }
        if (!password.trim()) {
            toast("Please enter Password");
            return 0;
        }
        if (password.length < 6) {
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

        setIsLoading(true);
        const res = await forgotPassword({ email, password, otp });
        setIsLoading(false);

        if (res?.status) {
            toast.success(res.message);
            navigate('/login');
        } else {
            res?.simple ? toast(res.message) : toast.error(res.message)
        }
    }

    const enterPress = async (val) => {
        val === "Enter" && ForgotPasswordApi();
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
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: "center", height: "60vh", marginTop: "50px" }}>
            <div className='login-container'>
                <div>
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyUp={(e) => enterPress(e.key)}
                        type="email"
                        placeholder='Email'
                        className='login-input login-email'
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
                            disabled={isOtpLogin ? true : false}
                            className="register-otp-btn"
                            onClick={() => ForgotOtpApi()}> {isOtpLogin ? 'Loading...' : 'Send OTP'} </button>
                    </div>
                </div>

                <div>
                    <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyUp={(e) => e.key === 'Enter' && ForgotPasswordApi()}
                        type="password"
                        placeholder='Password'
                        className='login-input login-password' spellCheck="false" />
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

                <div className="login-btn-container">
                    <button className='nav-btn' onClick={() => ForgotPasswordApi()}>
                        {isLoading ? 'Loading...' : 'Forgot'}
                    </button>
                </div>
                <div style={{ marginTop: '55px', textAlign: "center" }}>
                    <label style={{ color: "grey" }}>Know you Password ? </label>
                    <button style={{ color: "blue" }} onClick={() => navigate('/login')}> Log in</button>
                </div>

            </div>
        </div>
    )
}

export default Forgot