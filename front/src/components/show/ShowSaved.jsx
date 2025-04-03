import { useState,useRef } from 'react';
import { Link } from 'react-router-dom';
import   './show.css'
import {http} from '../axios/axiosGlobal'

const ShowSaved = ({id,isSaved }) => {

    const loginData=JSON.parse(localStorage.getItem('loginData'));
    const userEmail=loginData.email;
    //save ad
    const [savedAd, setSavedAd] = useState(isSaved ? 'text-danger' : 'gray');
    const refI = useRef()      

   //save ads
    const saveFunc=async(id)=>{
        refI.current.classList.toggle('text-danger') 

        const res=await http.post('/save',{id,userEmail});
        if(res.data.message=='saved'){
            setSavedAd('text-danger')
        }else{
            setSavedAd('gray')
        }
    }


  return (
    <div className='d-flex'>
       <i title='حفظ' ref={refI} id={id} onClick={(e) => saveFunc(e.target.id)} className={`bi bi-heart mx-3 align-self-center ${savedAd}`} ></i>
    </div>
  );

}


export default ShowSaved
