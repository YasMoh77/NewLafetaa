import React, {useEffect,useState } from 'react'
import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'
import { http } from '../axios/axiosGlobal';
import './verify.css'





const Verified = () => {

    const loginData = JSON.parse(localStorage.getItem('loginData'));
    const nameRegister=JSON.parse(localStorage.getItem('nameRegister'));
    const emailRegister=JSON.parse(localStorage.getItem('emailRegister'));

   //localStorage.setItem('justVerified');
   const [show, setShow] = useState(false)
   const navigate=useNavigate();

    useEffect(() => {
        if(loginData){ navigate('/profile');}
        checkVerifiedFunc()

    }, [navigate])

    const checkVerifiedFunc=async()=>{
       // console.log('ggghg')
        if(emailRegister){
           const res=await http.post('/check-verify',{emailRegister});
           if(res.data.message=='verified'){
                //verified user so remove nameRegister
                localStorage.removeItem('nameRegister');
                localStorage.removeItem('emailRegister');
                setShow(true)
                setTimeout(() => {
                    navigate('/login')
                }, 3000);

           }else{ 
               //not verified user
                navigate('/verify')
           }
        }else{
            navigate('/');
        }
       
    }




    return (
        <div className='container-fluid min-vh-100'>
            <div className='mt-5 mx-auto w-fit'>
                {show &&
                    (<>
                        <div className='d-flex mb-3'>
                            <p className='w-fit ms-3'>تم تفعيل البريد الالكتروني  </p>
                            <i className='bi bi-check-circle-fill green fs-4'></i>
                        </div>
                        <p className='mt-3 mx-auto w-fit green fs-i'>جاري تحويلك لصفحة تسجيل الدخول ...</p>
                    </>)
                    
                }
                
                {/*{show && <p>wll be redirected to login</p>}*/}
            </div>
        </div>
    )
}

export default Verified
