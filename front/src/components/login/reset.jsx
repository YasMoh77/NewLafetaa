import React, {useState,useRef,useEffect } from 'react'
import { useNavigate } from 'react-router'
import {http} from '../axios/axiosGlobal'
import './login.css'


const RequestReset = () => {
    
     //get loginData to check if user already logged in
    const loginData = JSON.parse(localStorage.getItem('loginData'));
    const emailReset = localStorage.getItem('emailReset');

     //values
     const [responseOk, setResponseOk] = useState()
     const [responseError, setResponseError] = useState('')
     const [loadNav, setLoadNav] = useState(false)
     //navigate
     const navigate=useNavigate();
     //fields
     const refEmail = useRef('')
 
     //submit add
     const submitRequestPass=async(e)=>{
         e.preventDefault();
         
         //empty response
         setResponseOk('')
         
         //get values from form
         const email=refEmail.current.value.trim();
         //show form error
         const showError=(field,value,ref)=>{
         if(field===value){ref.current.style.backgroundColor='#e87878';}else{ref.current.style.backgroundColor='white';}
         }
       
         //check if form values are valid
         showError(email,'',refEmail);

         //send values to backend
         if(email!=='' ){
               try{

              //start spinner, then fetch data
              setLoadNav(true)
              const res= await http.post('/request-reset',{email});
              setResponseOk(res.data.message);

              //if user found
              if(res.data.message=='user found'){
                   const emailReset=res.data.emailReset;
                   localStorage.setItem('emailReset',emailReset)
                   navigate('/forget-password')
              }
              setLoadNav(false)
 
              }catch(error){
                setLoadNav(false)
                error.response ? setResponseError(error.response.data.errors) :setResponseError('');
              }
         }//end if
     }  //end submitNewUser
     
   //if logged in, go to profile 
   useEffect(() => {
     if(loginData){navigate('/profile');}
     //if(nameRegister && emailRegister){navigate('/verify');}
   }, [navigate])


    return (
        <div className='container-fluid top-add'>
            <form onSubmit={submitRequestPass} className='w-50 mx-auto my-5 ps-5 form-add rounded-3'>
                <p className="w-fit mx-auto fw-bold fs-2"> طلب تعديل كلمة المرور </p>
                
                <div className="mb-3 d-flex ">
                    <label htmlFor="email" className="form-label">البريد الالكتروني</label>
                    <input type="email"  ref={refEmail} className="form-control" name='email' id="email" placeholder="أدخل البريد الالكتروني" required/>
                </div>

                <div className='d-flex justify-content-between  mt-4 '>
                   <button type="submit" className="btn btn-success mx-auto w-25">أرسل</button>
                </div>
               
                {/* use spinner before fetching response*/}
                {loadNav&& (<p className='spinner-border gray mx-auto mt-4 d-block'></p>)}
                 {/* show success response*/}
                {responseOk && (<p className="w-fit mt-3 mx-auto fw-bold red">{responseOk}</p>) }  
               
                 
                {/* show email error */}
                {responseError && Object.keys(responseError).map((key)=>(
                <div className='mt-3 '>
                    {responseError[key].map((e)=> key=='email' &&  <p className='mb-0 mx-auto w-fit red'> " البريد الالكتروني" : {e}</p> )} 
                </div>  ))
                }
            </form>
        </div>
    )
}

export default RequestReset
