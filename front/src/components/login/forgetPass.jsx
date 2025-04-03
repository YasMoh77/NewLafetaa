import React, {useState,useRef,useEffect } from 'react'
import { useNavigate } from 'react-router'
import {Link}  from 'react-router-dom'
import {http} from '../axios/axiosGlobal'
import './login.css'



const Forgetpassword = () => {
    const loginData = JSON.parse(localStorage.getItem('loginData'));
    const emailReset = localStorage.getItem('emailReset');

     //values
     const [responseOk, setResponseOk] = useState()
     const [responseError, setResponseError] = useState('')
     const [loadNav, setLoadNav] = useState(false)
     //navigate
     const navigate=useNavigate();
     //fields
     const refPassword = useRef('')
     const refPassword2 = useRef('')
 
     //submit add
     const submitResetPass=async(e)=>{
         e.preventDefault();

         //get values from form
         const password=refPassword.current.value.trim();
         const password_confirmation=refPassword2.current.value.trim();
         //show form error
         const showError=(field,value,ref)=>{
         if(field===value){ref.current.style.backgroundColor='#e87878';}else{ref.current.style.backgroundColor='white';}
       }
       
         //check if form values are valid
         showError(password,'',refPassword);
         showError(password_confirmation,'',refPassword2);
         //store values
         const postData={password,password_confirmation,emailReset}
         
         //send values to backend
         if(password!=='' && password_confirmation!=='' ){
               try{
              //start spinner, then fetch data
              setLoadNav(true)
              
              const res= await http.post('/reset-password',postData);
              setResponseError('')
              setResponseOk(res.data.message);
              setLoadNav(false)
 
              //if logged in, store login data and go to profile
              if(res.data.message==='تم تعديل كلمة المرور'){
                 //remove emailReset and navigate to login
                  localStorage.removeItem('emailReset')
                   setTimeout(() => {
                      navigate('/login');
                   }, 2000);
                }

              }catch(error){
                setLoadNav(false)
                error.response ? setResponseError(error.response.data.errors) :setResponseError('');
              }
         }//end if
     }  //end submitNewUser
     
   //if logged in, go to profile 
   useEffect(() => {
     if(loginData){navigate('/profile');}
     if(!emailReset){navigate('/');}

   }, [navigate])

   //showHidePassword
   const showHidePassword=()=>{
     if(refPassword.current.type=='password'){refPassword.current.type='text';}
     else {refPassword.current.type='password';}
   }

   //showHidePassword2
   const showHidePassword2=()=>{
    if(refPassword2.current.type=='password'){refPassword2.current.type='text';}
    else {refPassword2.current.type='password';}
  }


    return (
        <div className='container-fluid top-add'>
            <form onSubmit={submitResetPass} className='w-50 mx-auto my-5 ps-2 form-add-forget rounded-3'>
                <p className="w-fit mx-auto fw-bold fs-2"> تعديل كلمة المرور </p>
                
                <div className="mb-3 d-flex pass-div">
                    <label htmlFor="password" className="form-label lbl-forget"> كلمة المرور الجديدة</label>
                    <input type="password"  ref={refPassword} className="form-control inp-forget"  id="password" placeholder="أدخل كلمة المرور" required/>
                    <i onClick={showHidePassword} className='bi bi-eye'></i>
                </div>


                <div className="mb-3 d-flex pass-div">
                    <label htmlFor="password2" className="form-label lbl-forget">تأكيد  كلمة المرور الجديدة</label>
                    <input type="password"  ref={refPassword2} className="form-control inp-forget"  id="password2"  placeholder="أعد كلمة المرور" required/>
                    <i onClick={showHidePassword2} className='bi bi-eye'></i>
                </div>

                <div className='d-flex justify-content-between  mt-4'>
                   <button type="submit" className="btn btn-success mx-auto w-25">أرسل</button>
                </div>
               
                {/* use spinner before fetching response*/}
                {loadNav&& (<p className='spinner-border gray mx-auto mt-4 d-block'></p>)}
                 {/* show success response*/}
                {responseOk && (<p className="w-fit mx-auto fw-bold mt-3 green">{responseOk}</p>) }  
               
                 {/* show name error */}
                 {responseError && Object.keys(responseError).map((key)=>(
                        <div className='mt-3 '>
                            {responseError[key].map((e)=> key=='name' &&  <p className='mb-0 mx-auto w-fit red'> "اسم المستخدم" : {e}</p> )} 
                        </div>  ))
                  }
                   {/* show email error */}
                   {responseError && Object.keys(responseError).map((key)=>(
                    <div className='mt-3 '>
                        {responseError[key].map((e)=> key=='email' &&  <p className='mb-0 mx-auto w-fit red'> " البريد الالكتروني" : {e}</p> )} 
                    </div>  ))
                   }
                   {/* show password error */}
                   {responseError && Object.keys(responseError).map((key)=>(
                    <div className='mt-3 '>
                        {responseError[key].map((e)=> key=='password' &&  <p className='mb-0 mx-auto w-fit red'> "كلمة المرور " : {e}</p>  )} 
                    </div>  ))
                   }

            </form>
        </div>
    )
}

export default Forgetpassword
