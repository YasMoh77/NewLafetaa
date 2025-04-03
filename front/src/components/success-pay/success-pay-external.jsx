import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import {Link} from 'react-router-dom'
import './success-pay.css'

const SuccessPayExternal = () => {
    const navigate=useNavigate();
     //get the parameter in the URL
    const search=window.location.search;   
    const params=new URLSearchParams(search);
    var token=params.get('t');
    
    useEffect(() => {
        {token==null ||  token!='eyJpdiI6ImswWWNxWHNSRW9nY1hlVU5wY3VYMmc9PSIsInZhbHVlIjoid2JuOUNKZmlZcm1qb2ZwL0xWR25Xdz09IiwibWFjIjoiOGM2NGZjMzI4YmE3YjQ5ZjZjNDg0ZmE3NTRkNGQxMzFlZTkwYTBjNTJmZTA4MDgyNGVkODMyZmY0NTM3NzFjZCIsInRhZyI6IiJ9' && navigate('/')}
    }, [navigate])
   
    return (
        <div className='container-fluid top-add'>
            <div className='w-fit mx-auto my-5 p-2'>
                <p className='mx-auto w-fit green'>تم تمييز اللافتة بنجاح</p>
                <button className='border-0 bg-info py-2 px-3 '><Link to='/' className='white'>اذهب للصفحة الرئيسية</Link></button>
            </div>
        </div>
    )
}

export default SuccessPayExternal