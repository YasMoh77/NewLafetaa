import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import {Link} from 'react-router-dom'
import './cancel-pay.css'

const CancelPay = () => {
    const navigate=useNavigate();
     //get the parameter in the URL
    const search=window.location.search;   
    const params=new URLSearchParams(search);
    var token=params.get('t');
    
    useEffect(() => {
        {token==null ||  token!='eyJpdiI6Im13QmdIRHQ4eW1VMXZtUEw1VS93Tmc9PSIsInZhbHVlIjoicGdidWY0VEYrUWVQdVJZcTB4N1h6dz09IiwibWFjIjoiNzg3OTEwNzAzZGZhZDg1YjFmNGUzYzU1Zjg4NGNjNTNmYWVhM2FlODNkNzc1ODVkZTBlYTAyODc4YjA1M2I0MCIsInRhZyI6IiJ9' && navigate('/')}
    }, [navigate])
   
    return (
        <div className='container-fluid top-add'>
            <div className='w-fit mx-auto my-5 p-2'>
                <p className='mx-auto w-fit red'>تم الغاء العملية</p>
                <button className='border-0 bg-info py-2 px-3 '><Link to='/' className='white'>اذهب للصفحة الرئيسية</Link></button>
            </div>
        </div>
    )
}

export default CancelPay