import {useState,useEffect} from 'react'
import { http } from '../axios/axiosGlobal'

const CheckReportAd = ({item,email}) => {
    const [showReportAd, setShowReportAd] = useState({})
    //
    const getReport=async(item,email)=>{
        const res=await http.post(`/ads/report-ad`,{item,email})
        setShowReportAd({ok:res.data.ok,item:res.data.item,email:res.data.email})
    }

    useEffect(() => {
        getReport(item,email)
    }, [item,email])

    return (
        <>
            {showReportAd&&showReportAd.ok==='ok'&&showReportAd.email===email&&showReportAd.item===item
                ?<i title='تم التبليغ' className='bi bi-flag-fill pointer'></i>
                :<i title='تبليغ' className='bi bi-flag pointer'></i>
            }
        </>
    )
}

export default CheckReportAd
