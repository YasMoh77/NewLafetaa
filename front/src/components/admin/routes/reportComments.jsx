import {useEffect,useState} from 'react'
import axios  from 'axios'
import Pagination from '../pagination'
import GetUserName from '../../helpers/getUserName'
import CheckUserBlock from '../../helpers/CheckUserBlock'
import GetComment from '../../helpers/GetComment'
import { http5 } from '../../axios/axiosGlobal'


const ReportsComms = () => {
    //get login data
    const loginData=JSON.parse(localStorage.getItem('loginData'));
    //states
    const [reports, setReports] = useState([])
    const [loadReports, setLoadReports] = useState(false)
    //pagination
    const [currentPage, setCurrentPage] = useState(1)
    const [lastPage, setLastPage] = useState(1)
    const [total, setTotal] = useState(1)

    //get reports
   const getReports=async()=>{
    setLoadReports(true)
    const res=await axios.get('http://127.0.0.1:8000/api/panel/get-comment-reports?page='+1/*page*/);
    //use data to change states
    setCurrentPage(res.data.current_page)
    setLastPage(res.data.last_page)
    setTotal(res.data.total)
    setReports(res.data.data)
    setLoadReports(false)
 }

 //mark row when clicked
 const markRow=(ee)=>{
    if( ee.parentElement.style.backgroundColor=='orange'){
        ee.parentElement.style.backgroundColor='white';
    }else{ ee.parentElement.style.backgroundColor='orange' }
  }

  //when pagination number is clicked change currentPage
  const changePageFunc=(page)=>{
    setCurrentPage(page)
   }

 
   //delete report row
   const deleteFunc=async(id)=>{
       if(window.confirm('Fake report? Delete this row?')){
       const res=await http5.post(`/panel/delete-comment-report/`,{id})
       alert(res.data.msg)
       window.location.reload()
       }
   }

    useEffect(() => {
        getReports()
    }, [])

    
    return (
        <>
        <div className='container-fluid top-cont'>
            {loadReports ? (<p className='spinner-border gray mx-auto mt-5 d-block'></p>)
             : reports&& reports.length>0 ?
             (        
            <>
            <p>All Users' reports on comments ({total})</p>
            <div className='overflow-auto w-100 pb-2 table-user-parent' >
                <table className='mb-2 table-user min-vw-100 text-center' >                   
                   <thead className='bg-info fw-bold'>
                        <tr >
                            <td>Row id</td>
                            <td>Reported comment ID</td>
                            <td>Status</td>
                            <td>Reporting user</td>
                            <td>Action</td> 
                                                  
                        </tr>
                    </thead>

                    <tbody>
                       {  reports.map((e)=>(
                        <tr key={e.id}  onClick={(ee)=>{markRow(ee.target);}}  >
                            <td>{e.id}</td>
                            <td>{e.c_id}</td>
                            <td><GetComment id={e.c_id} /> </td>
                            <td>{<GetUserName id={e.reporter} />}</td>
                            {loginData.admin ==='sup'||loginData.admin ==='own' &&    //only super admin or owner can do actions                      
                                <td className='d-flex justify-content-between'>
                                    <CheckUserBlock id={e.reporter} more={'comms'} />
                                    <i title='Only Delete this row' onClick={()=>{deleteFunc(e.id)}} className='bi bi-trash text-danger'></i>
                                </td>
                            }
                                                                               
                        </tr>
                       ))}
                    </tbody>                 
                </table>

                {<Pagination currentPage={currentPage} lastPage={lastPage} changePageFunc={changePageFunc} />}
              
            </div>
            </>

            )
            :<span>لا توجد بلاغات عن تعليقات مخالفة</span>}      
        </div>
        </>
    )
}

export default ReportsComms
