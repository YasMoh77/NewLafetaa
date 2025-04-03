import React, {useState,useRef,useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'
import {http} from '../axios/axiosGlobal'
import  axios  from 'axios'
import './login.css'



const Login = () => { 
  
    //use nameRegister & emailRegister if user not verified yet to redirect to verify
    const nameRegister=JSON.parse(localStorage.getItem('nameRegister'));
    const emailRegister=JSON.parse(localStorage.getItem('emailRegister'));
    //use loginData if user already logged in to redirect to profile
    const loginData = JSON.parse(localStorage.getItem('loginData'));

    //values
    const [responseOk, setResponseOk] = useState()
    const [loadNav, setLoadNav] = useState(false)
    //navigate
    const navigate=useNavigate();
    //fields
    const refEmail = useRef('')
    const refPassword = useRef('')

   /* async function getUser(){
      const main= await axios.get('/sanctum/csrf-cookie');
      console.log(main)
    }
    useEffect(() => {
       getUser();
    }, [])*/
    
    //log user in
    const submitCheckUser=async(e)=>{
        e.preventDefault();
        //if responseOk has message, remove it
        setResponseOk('');
        //get values from form
        const email=refEmail.current.value.trim();
        const password=refPassword.current.value.trim();

        //show form error
        const showError=(field,value,ref)=>{
        if(field===value){ref.current.style.backgroundColor='#e87878';}else{ref.current.style.backgroundColor='white';}
      }
        //check if form values are valid
        showError(email,'',refEmail);
        showError(password,'',refPassword);
        //store values
        const postData={email,password}
        
        //send values to backend
        if(email!=='' && password!=='' ){
             //start spinner, then fetch data
             setLoadNav(true)
             const res= await http.post('/login',postData);
             //if logged in, store login data and go to profile
             if(res.data.message==='تم تسجيل الدخول بنجاح'){
                  //start spinner, then fetch data
                  setLoadNav(true)
                  //store token
                  const token=res.data.authData.token;
                  //get user data
                   const res2= await http.get('/user',{
                    headers:{ Authorization: `Bearer ${token}`}
                  });
                  //if not verified, store name and email then send to verify
                  //as if just now registered
                  if(res2.data.message=='verify your email'){
                       localStorage.setItem('emailRegister',JSON.stringify(res2.data.email))
                       localStorage.setItem('nameRegister',JSON.stringify(res2.data.name))
                        navigate('/verify')
                  }else{
                      // store only user name and email 
                      const name=res2.data.name;
                      const email=res2.data.email;
                      const country=res2.data.cont//user's country
                      const block=res2.data.block
                      const admin=res2.data.admin
                      const user={name,email,country,block,admin}
                      //store name and email in localStorage
                      localStorage.setItem('loginData',JSON.stringify(user))
                      //show response & stop spinner after response
                      setLoadNav(false)
                      setResponseOk(res.data.message);
                      setTimeout(() => {
                        navigate('/profile');
                      }, 2500);
                      window.location.reload();
                  }
               }else{
                setResponseOk(res.data.message);
                setLoadNav(false)
               }
        }//end if
    }//end submitAddFunc

   
  useEffect(() => {
    //if logged in, go to profile.
    if(loginData){ setTimeout(() => {
       navigate('/profile')
    }, 100);}
    

    //if not verified, go to verify
    if(nameRegister && emailRegister){navigate('/verify');}
  }, [loginData,nameRegister,emailRegister,navigate])

  
  //showHidePassword
  const showHidePassword=()=>{
    if(refPassword.current.type=='password'){refPassword.current.type='text';}
    else if(refPassword.current.type=='text'){refPassword.current.type='password';}
  }


    return (
        <div className='container-fluid top-add'>
            <form onSubmit={submitCheckUser} className='mx-auto my-5 form-add b-radius-1'>
                <p className="w-fit mx-auto fw-bold fs-2">تسجيل الدخول </p>
                
                <div className="mb-3 d-flex ">
                    <label htmlFor="email" className="form-label w-25">البريد الالكتروني</label>
                    <input type="email"  ref={refEmail} className="form-control" id="email" placeholder="enter add title"/>
                </div>

                <div className="mb-3 d-flex pass-div">
                    <label htmlFor="password" className="form-label w-25">كلمة المرور</label>
                    <input type="password"  ref={refPassword} className="form-control" id="password" placeholder="enter add title"/>
                    <i onClick={showHidePassword} className='bi bi-eye'></i>
                </div>

                <div className='div-login-forget d-flex row w-7 mt-4 align-items-center'>
                    <button type="submit" className="col-12 col-lg-2 btn btn-success d-flex justify-content-center mx-auto ">
                     {loadNav
                        ? <span className='spinner-border text-white'></span>
                        :<span>دخول</span>
                     }
                     </button>
                   <Link to='/password-reset'  className="col-12 col-lg-4 mx-auto "> نسيت كلمة المرور</Link>
                   <Link to='/register'  className="col-12 col-lg-3 mx-auto ">حساب جديد</Link>
                </div>
                
                {responseOk && responseOk!=='تم تسجيل الدخول بنجاح' ? (<p className="w-fit mx-auto mt-3 red">{responseOk}</p>) : (<p className="w-fit mx-auto mt-3 green">{responseOk}</p>) }              
            </form>
    </div>

    )
}

export default Login
