import React, { useEffect, useState } from 'react'
import "./index.css"
import { dashboard } from "../../../api/axios";
import { useNavigate } from 'react-router-dom';
import { indianRupeesFormate } from '../../../methods';

function Dashboard() {
  const navigate = useNavigate();
  const [array, setArray] = useState([]);
  const [isLoading,setIsLoading] = useState(false);

  const dashboardApi = async () => {
    if (!localStorage.getItem('token') && !localStorage.getItem('id') && !localStorage.getItem('user')) {
      navigate('/');
      return 0;
    };

    setIsLoading(true);
    const res = await dashboard();
    setIsLoading(false);

    if (res?.status) {
      setArray(res?.data);
    }
    else if (res?.unVerify) {
      localStorage.clear();
      navigate('/');
    }
  }

  useEffect(() => {
    dashboardApi();
  }, []);

  return (
    <div className='record-main-container'>
      { isLoading?"Loading ...":
        array?.map((val, ind) => {
          return (
            <div className='record-container' style={{ background: val?.color }} key={ind}>
              <div>{val?.key}</div>
              <div className="record-value">{val?.rupees?indianRupeesFormate(val.value):val?.value}</div>
            </div>
          )
        })
      }
    </div>
  )
}

export default Dashboard