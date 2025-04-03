import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {http} from '../axios/axiosGlobal'
import   './verify.css'



const Verify = () => {

    const nameRegister=JSON.parse(localStorage.getItem('nameRegister'));
    const emailRegister=JSON.parse(localStorage.getItem('emailRegister'));
    const loginData=JSON.parse(localStorage.getItem('loginData'));

    const [load, setLoad] = useState(false)
    const [result, setResult] = useState('')
    const navigate=useNavigate();

    //send email verification again
    const sendVerifyMsgAgain=async()=>{

        if(nameRegister&& emailRegister){
            //hide message and start spinner
            setResult('')
            setLoad(true)
            console.log(nameRegister,emailRegister)
            //go to verify in backend
            const res= await http.post('/send-verify',{nameRegister,emailRegister});
             console.log(res.data)
            //show message and stop spinner
            setResult(res.data.message)
            setLoad(false)
            setTimeout(() => {
                navigate('/')
            }, 3000);

        }
    }

    useEffect(() => {
       if(!nameRegister && !emailRegister ){ navigate('/login') }
       if(loginData  ){ navigate('/profile') }

    }, [])

    
    return (
        <div className='container-fluid min-vh-100'>
            <div className='mt-5 mx-auto w-fit'>
                <p>أرسلنا رسالة تفعيل الى بريدك الالكتروني؛الرجاء الضغط على رابط التفعيل الموجود بها</p>
                <p>اذا لم تجد الرسالة المذكورة </p>
                <button onClick={sendVerifyMsgAgain} className='btn btn-info mx-auto d-block'>اضغط هنا لارسال رسالة تفعيل أخرى</button>
                {load && (<p className='spinner-border gray mx-auto mt-4 d-block'></p>)}
                {result && (<p className='mx-auto w-fit mt-3 green'>{result}</p>)}
            </div>
        </div>
    )
}

export default Verify
