import React,{useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import { http,http5 } from '../axios/axiosGlobal'

const GetCountryStateCity = ({country,state,city}) => {
    const [adCountry, setAdCountry] = useState('')
    const [adState, setAdState] = useState('')
    const [adCity, setAdCity] = useState('')
    //fetch values
    const getCountryStateCityFunc=async(country,state,city)=>{
      const res=await http5.post(`/ads/get-country-state-city/`,{country,state,city})
      setAdCountry(res.data.country)
      setAdState(res.data.state)
      setAdCity(res.data.city)
    }
    useEffect(() => {
        getCountryStateCityFunc(country,state,city)
    }, [country,state,city])

    return (
        adCountry&&adState&&adCity
       ? <div className='pe-1 mb-1 small'><Link to={`/more/?cnt=${country}`}>{adCountry}</Link> › <Link to={`/more/?st=${state}`}>{adState}</Link> › <Link to={`/more/?ci=${city}`}>{adCity}</Link></div>             
       : <p></p>
       )
}

export default GetCountryStateCity
