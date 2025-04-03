import {useState,useEffect} from 'react'
import { http } from '../axios/axiosGlobal'

const CheckReportCom = ({cid,email}) => {
    const [showReport, setShowReport] = useState({})
    //
    const getReport=async(cid,email)=>{
        const res=await http.post(`/ads/report-comment`,{cid,email})
        setShowReport({ok:res.data.ok,cid:res.data.cid,email:res.data.email})
    }

    useEffect(() => {
        getReport(cid,email)
    }, [cid,email])

    return (
        <>
            {showReport&&showReport.ok==='ok'&&showReport.email===email&&showReport.cid===cid
                ?<i title='تم التبليغ' className='bi bi-flag-fill pointer'></i>
                :<i title='تبليغ' className='bi bi-flag pointer'></i>
            }
        </>
    )
}

export default CheckReportCom
