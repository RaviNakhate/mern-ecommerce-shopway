import React, { useState, useEffect } from 'react'
import "./index.css";
import { getStates, getCities, updateProfile, details } from "../../../api/axios";
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const obj = useSelector((state) => state);
  const { email, isLoading } = obj;

  const [name, setName] = useState('');
  const [state, setState] = useState();
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [isEdit, setIsEdit] = useState(false);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);



  const edit = () => {
    setIsEdit((prev) => !prev);
  }

  const save = async () => {
    // validation
    if (!name.trim().replace(/ +(?= )/g, '')) { toast('Please enter your name'); return 0 };
    if (!state.trim().replace(/ +(?= )/g, '')) { toast('Please select you state'); return 0 };
    if (!city.trim().replace(/ +(?= )/g, '')) { toast('Please select your city'); return 0 };
    if (!address.trim().replace(/ +(?= )/g, '')) { toast('Please enter your address'); return 0 };


    setIsUpdateLoading(true);
    const res = await updateProfile({
      name,
      state,
      city,
      address
    });
    setIsUpdateLoading(false);
    setIsEdit((prev) => !prev);

    if (res?.response) { toast.error(res?.response?.data?.err?.errors[0]) }

    if (res?.status) {
      toast.success(res?.message);
      dispatch({ type: 'userUpdate', payload: { name, state, city, address } });
    }
    else if (res?.unVerify) {
      localStorage.clear();
      navigate('/');
    }
    else {
      toast.error(res?.message);
    }
  }

  const getStatesApi = async () => {
    const res = await getStates();
    setStates(res?.data?.states);
  }

  const getCitiesApi = async () => {
    const res = await getCities({ state });
    setCities(res?.data);
  }

  const logout = async () => {
    localStorage.clear();
    window.location.href = "/"
  }

  const detailsApi = async () => {
    if (!localStorage.getItem('token') && !localStorage.getItem('id') && !localStorage.getItem('user')) 
      {
        navigate('/');
        return 0;
      } 

    const res = await details();

    if (res?.status === false) {
      logout();
    }
  }

  useEffect(() => {
    const tempFun = async () => {
      dispatch({ type: 'setIsLoading', payload: true });
      await detailsApi();
      dispatch({ type: 'setIsLoading', payload: false });
    }

    getStatesApi();
    tempFun();
  }, []);

  useEffect(() => {
    state && getCitiesApi();
  }, [state]);



  useEffect(() => {
    setName(obj.name);
  }, [obj.name])

  useEffect(() => {
    setState(obj.state);
  }, [obj.state])

  useEffect(() => {
    setCity(obj.city);
  }, [obj.city])

  useEffect(() => {
    setAddress(obj.address);
  }, [obj.address])

  return (
    <div className='profile-container'>
      {
        isLoading ? <div style={{ marginTop: "20px" }}>Loading . . .</div>
          : <table cellPadding={20}>
            <tbody>
              <tr>
                <td>Name</td>
                <td> {isEdit ? <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type='text'
                  spellCheck={false} /> : name}
                </td>
              </tr>
              <tr>
                <td>Email</td>
                <td>{email} </td>
              </tr>
              <tr>
                <td>State</td>
                <td>{isEdit ? <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className='register-input register-state'>
                  {
                    states?.map((val, ind) => { return <option value={val.name} key={ind}>{val.name}</option> })
                  }
                </select> : state}</td>
              </tr>
              <tr>
                <td>City</td>
                <td>{isEdit ? <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className='register-input register-city'>
                  {
                    cities?.map((val, ind) => { return <option value={val} key={ind}>{val}</option> })
                  }
                </select> : city}</td>
              </tr>
              <tr>
                <td>Address</td>
                <td>{isEdit ? <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  type='text'
                  spellCheck={false} /> : address}</td>
              </tr>
              <tr>
                <td colSpan={2} className='td-last'>
                  {isEdit ?
                    <button
                      className='nav-btn'
                      onClick={() => save()}>
                      {isUpdateLoading ? "Loading ..." : "Save Profile"}</button> :
                    <button className='nav-btn' onClick={() => edit()}>Update Profile</button>}
                </td>
              </tr>
            </tbody>
          </table>}

    </div>
  )
}

export default Profile