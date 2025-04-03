import React,{useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import { http5 } from '../axios/axiosGlobal'

const GetCatSubcat = ({cat,sub}) => {
    const [adCat, setAdCat] = useState('')
    const [adSub, setAdSub] = useState('')
    //fetch values
    const getCatsubcatFunc=async(cat,sub)=>{
      const res=await http5.post(`/ads/get-cat-subcat/`,{cat,sub})
      setAdCat(res.data.cat)
      setAdSub(res.data.sub)
    }
    useEffect(() => {
        getCatsubcatFunc(cat,sub)
    }, [])
   

    return (
        adCat&&adSub
        ? <div className='pe-1 small'><Link to={`/more/?c=${cat}`}>{adCat}</Link> › <Link to={`/more/?s=${sub}`}>{adSub}</Link></div>             
        :<p></p>
        )
}

export default GetCatSubcat
