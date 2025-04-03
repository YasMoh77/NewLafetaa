import {useState,useEffect} from 'react'
import { http } from '../axios/axiosGlobal'

const NumOfReplies = ({comment_id}) => {
    const [state, setstate] = useState(0)
    const getRepliescount=async(id)=>{
        const res=await http.post(`/ads/get-replies-count/${id}`)
        setstate(res.data.count)
    }

    useEffect(() => {
        getRepliescount(comment_id)
    }, [comment_id])

    return (
        <>
            {state>0&&<span>{state}</span>}
        </>
    )
}

export default NumOfReplies
