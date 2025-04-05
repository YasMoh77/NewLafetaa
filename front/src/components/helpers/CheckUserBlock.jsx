import {useState,useEffect} from 'react'
import { http } from '../axios/axiosGlobal'

const CheckUserBlock = ({id,more}) => {
    //check if user was blocked 
    const [showBlockReports, setShowBlockReports] = useState('')
    const [showBlockAds, setShowBlockAds] = useState('')
    const [showBlockComms, setShowBlockComms] = useState('')
    //check block reports
    const checkBlockReports=async(id,more)=>{
        const res=await http.post('/panel/check-user-block',{id,more})
        console.log('res report',res.data.message)
        if(res.data.more==='reports'){
            setShowBlockReports(res.data.message)
            //console.log('reports=',res.data)
        }}
    //check Block Ads
    const checkBlockAds=async(id,more)=>{
        const res=await http.post('/panel/check-user-block',{id,more})
        if(res.data.more==='ads'){
            setShowBlockAds(res.data.message)
        }
    }
    //check Block Comments
    const checkBlockComms=async(id,more)=>{
        const res=await http.post('/panel/check-user-block',{id,more})
        if(res.data.more==='comms'){
            setShowBlockComms(res.data.message)
        }
    }

    //prevent user from reporting anymore
    const blockReports=async(id)=>{ //reporter id
        const reports='reports'
        const confirmed=showBlockReports===0
         ?window.confirm('Block this reporting user so they can\'t send reports on (ads&comments) anymore?')
         :window.confirm('Unblock this reporting user so they can send reports on (ads&comments) ?')
         if(confirmed){
           const res=await http.post('/panel/block',{id,reports})
           alert(res.data.message)
           window.location.reload()
        }
      }

      //prevent user from adding ads anymore
    const blockUserAds=async(id)=>{//id=user id
        const ads='ads'
        const confirmed=showBlockAds===0
          ?window.confirm('Block this user so they can\'t add Ads anymore?')
          :window.confirm('Unblock this user so they can add Ads ?')
        if(confirmed){
          const res=await http.post(`panel/block`,{id,ads});
          alert(res.data.message)
          window.location.reload()
        }
      }

      //prevent user from commenting anymore
    const blockUserComms=async(id)=>{//id=user id
        const comms='comms'
        const confirmed=showBlockComms===0
          ?window.confirm('Block this user so they can\'t insert comments anymore?')
          :window.confirm('Unblock this user so they can insert comments ?')
        if(confirmed){
          const res=await http.post(`panel/block`,{id,comms});
          alert(res.data.message)
          window.location.reload()
        }
      }

    useEffect(() => {
        if(more==='reports'){checkBlockReports(id,more)}
        if(more==='ads'){checkBlockAds(id,more)}
        if(more==='comms'){checkBlockComms(id,more)}
    }, [id,more])

    return (
        <>
           {showBlockReports!==''//reports
           &&
              showBlockReports===0  //not blocked
                ?<i on onClick={()=>{blockReports(id)}} title='Block reports' className='bi bi-lock bg-secondary p-1 text-white'></i>
                :showBlockReports===1  //blocked
                    ?<i title='Unblock reports' on onClick={()=>{blockReports(id)}} className='bi bi-lock bg-danger p-1 text-white'></i>
                    :showBlockReports==='not found'&&<span className='text-warning'>not found</span> 
            } 

            {//ads      
                showBlockAds!==''
                &&showBlockAds===0  //not blocked
                      ?<i on onClick={()=>{blockUserAds(id)}} title='Block ads' className='bi bi-lock bg-secondary p-1 text-white'></i>
                      :showBlockAds===1  //blocked
                          ?<i title='Unblock ads' on onClick={()=>{blockUserAds(id)}} className='bi bi-lock bg-danger p-1 text-white'></i>
                          :showBlockAds==='not found'&&<span className='text-warning'>not found</span> 
            }

            { //comments
                showBlockComms!==''
                &&showBlockComms===0  //not blocked
                    ?<i on onClick={()=>{blockUserComms(id)}} title='Block comments' className='bi bi-lock bg-secondary p-1 text-white'></i>
                    :showBlockComms===1  //blocked
                        ?<i title='Unblock comments' on onClick={()=>{blockUserComms(id)}} className='bi bi-lock bg-danger p-1 text-white'></i>
                        :showBlockComms==='not found'&&<span className='text-warning'>not found</span> 
            }
        </>
    )
}

export default CheckUserBlock
