import React,{useRef} from 'react';
import {Link} from 'react-router-dom';
import  './nav.css';

const Nav = () => {
    const loginData=JSON.parse(localStorage.getItem('loginData'));
    const email=loginData&&loginData.email
    //
    const refNavbar = useRef(null)
    const refBtn = useRef(null)

    const showBackground=()=>{
        refNavbar.current.style.backgroundColor='black'
        refNavbar.current.style.padding = "3vh 0";
        refBtn.current.style.marginRight='12vw'
    }

    return (
     
            <nav className="navbar fixed-top navbar-expand-lg bg-body-tertiary">
                    <div className="container-fluid">
                        <a className="navbar-brand" href="#">
                            <i className="bi bi-signpost-2-fill d-inline-block fs-1"></i>
                            <span className="d-inline-block me-2 fs-1 ">لافتة</span>
                        </a>
                    <button onClick={showBackground} className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div ref={refNavbar} className="collapse navbar-collapse left" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link to="/" className="nav-link active" aria-current="page" >الرئيسية</Link>
                            </li>
                            <li className="nav-item">
                                <Link to='/about' className="nav-link" href="#">عن الموقع</Link>
                            </li>
                            <li className="nav-item">
                                <Link to='/faq' className="nav-link" href="#">سؤال وجواب</Link>
                            </li>
                            
                             {
                                loginData ? 
                                (<li className="nav-item">
                                <Link to='/profile' className="nav-link ">  حسابي</Link>
                                </li>) 
                                :
                                (<li className="nav-item">
                                <Link to='/login' className="nav-link ">  دخول</Link>
                                </li>)
                             }
                        
                        </ul>
                        <button ref={refBtn} className='border-0 py-2 px-3 rounded-2 white fw-bold add-nav'>  <Link to={email?'/add':'/login'} className="nav-link ">أضف لافتة </Link></button>
                    </div>
                    </div>
                </nav>
                
       
    )
}

export default Nav
