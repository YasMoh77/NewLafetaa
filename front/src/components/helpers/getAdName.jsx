import React,{useState,useEffect} from 'react'
import { http } from '../axios/axiosGlobal'

const GetAdName = ({id}) => {
    //state
    const [name, setName] = useState('')
    const getTheName=async(id)=>{
        //send api
        const res= await http.post(`/panel/get-ad-name/${id}`) 
        setName(res.data.name)
    }

    useEffect(() => {
        getTheName(id)
    }, [id])

    return (
       !name
       ?<div className='d-flex align-items-center justify-content-center'><span className='spinner-border gray'></span></div>
       :<span>{name}</span>
    )
}

export default GetAdName
