import {useState,useEffect} from 'react'
import { http } from '../axios/axiosGlobal'

const LikeComment = ({cid,email}) => {
        //like a comment
        const [state, setstate] = useState(0)

        const likeFunc=async(cid,email)=>{
        const res=await http.post(`/ads/check-like-comment`,{cid,email})
            setstate({count:res.data.count,user:res.data.user,email:res.data.email})
        }

        useEffect(() => {
            likeFunc(cid,email)
        }, [cid,email])

    return (
        <>
        {state&&state.count>0&&<span>{state.count}</span>}
        {state&&state.user==='like'&&email===state.email
            ?<i className='bi bi-hand-thumbs-up-fill pointer'></i>
            :<i className='bi bi-hand-thumbs-up pointer'></i>
        }
        </>
    )
}

export default LikeComment
