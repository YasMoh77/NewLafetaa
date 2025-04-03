import React, {useState,useRef,useEffect } from 'react'
import { useNavigate } from 'react-router'
import {Link}  from 'react-router-dom'
import {http} from '../axios/axiosGlobal'
import './register.css'


const Register = () => {
     
    const loginData = JSON.parse(localStorage.getItem('loginData'));
    const nameRegister=JSON.parse(localStorage.getItem('nameRegister'));
    const emailRegister=JSON.parse(localStorage.getItem('emailRegister'));

     //values
     const [responseOk, setResponseOk] = useState()
     const [responseError, setResponseError] = useState('')
     const [loadNav, setLoadNav] = useState(false)
     //navigate
     const navigate=useNavigate();
     //fields
     const refEmail = useRef('')
     const refPassword = useRef('')
     const refPassword2 = useRef('')
     const refName = useRef('')
 
    /* useEffect(() => {
        getUser();
     }, [])
     async function getUser(){
       const main= await axios.get('http://127.0.0.1:8000/sanctum/csrf-cookie');
       console.log(main);
     }*/
     //submit add
     const submitNewUser=async(e)=>{
         e.preventDefault();

         //get values from form
         const name=refName.current.value.trim();
         const email=refEmail.current.value.trim();
         const password=refPassword.current.value.trim();
         const password_confirmation=refPassword2.current.value.trim();
         //show form error
         const showError=(field,value,ref)=>{
         if(field===value){ref.current.style.backgroundColor='#e87878';}else{ref.current.style.backgroundColor='white';}
       }
       
         //check if form values are valid
         showError(name,'',refName);
         showError(email,'',refEmail);
         showError(password,'',refPassword);
         showError(password_confirmation,'',refPassword2);
         //store values
         const postData={name,email,password,password_confirmation}
         
         //send values to backend
         if(name!=='' && email!=='' && password!=='' && password_confirmation!=='' ){
               try{
              //start spinner, then fetch data
              setLoadNav(true)
              
              const res= await http.post('/register',postData);
              setResponseOk(res.data.message);
              console.log(res.data)
              setLoadNav(false)
 
              //if logged in, store login data and go to profile
              if(res.data.message==='تم التسجيل بنجاح'){
                  localStorage.setItem('emailRegister',JSON.stringify(res.data.email))
                  localStorage.setItem('nameRegister',JSON.stringify(res.data.name))

                   navigate('/verify');
                }
              }catch(error){
                setLoadNav(false)
               // console.log(error)
                error.response ? setResponseError(error.response.data.errors) :setResponseError('');
              }
         }//end if
     }  //end submitNewUser
     
   //if logged in, go to profile 
   useEffect(() => {
     if(loginData){navigate('/profile');}
     if(nameRegister && emailRegister){navigate('/verify');}

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
            <form onSubmit={submitNewUser} className='w-50 mx-auto my-5 ps-5 form-add rounded-3'>
                <p className="w-fit mx-auto fw-bold fs-2">حساب جديد </p>
                
                <div className="mb-3 d-flex ">
                    <label htmlFor="name" className="form-label"> اسم المستخدم</label>
                    <input type="text"  ref={refName} className="form-control" id='name'  placeholder="أدخل الاسم" required/>
                </div>

                <div className="mb-3 d-flex ">
                    <label htmlFor="email" className="form-label">البريد الالكتروني</label>
                    <input type="email"  ref={refEmail} className="form-control" name='email' id="email" placeholder="أدخل البريد الالكتروني" required/>
                </div>
                  
                <div className="mb-3 d-flex pass-div">
                    <label htmlFor="password" className="form-label">كلمة المرور</label>
                    <input type="password"  ref={refPassword} className="form-control" name='password' id="password" placeholder="أدخل كلمة المرور" required/>
                    <i onClick={showHidePassword} className='bi bi-eye'></i>
                </div>

                <div className="mb-3 d-flex pass-div">
                    <label htmlFor="password2" className="form-label">تأكيد كلمة المرور</label>
                    <input type="password"  ref={refPassword2} className="form-control" name='confirm password' id="password2"  placeholder="أعد كلمة المرور" required/>
                    <i onClick={showHidePassword2} className='bi bi-eye'></i>
                </div>

                <div className='register-submit d-flex justify-content-between  mt-4 '>
                   <button type="submit" className="btn btn-success mx-auto ">أرسل</button>
                   <div className=" mx-auto ">
                     <span className='d-block'>لديك حساب؟</span>
                     <Link to='/login'> تسجيل الدخول</Link>
                   </div>
                </div>
               
                {/* use spinner before fetching response*/}
                {loadNav&& (<p className='spinner-border gray mx-auto mt-4 d-block'></p>)}
                 {/* show success response*/}
                {responseOk && (<p className="w-fit mx-auto fw-bold">{responseOk}</p>) }  
               
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

export default Register
