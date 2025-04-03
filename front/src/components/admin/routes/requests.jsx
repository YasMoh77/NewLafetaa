import { useState,useEffect } from 'react';
import { http } from '../../axios/axiosGlobal';
import { useNavigate } from 'react-router'
import Pagination  from '../pagination'

import axios from 'axios';
import  '../admin.css'

const Requests = ({hideFunc}) => {
    //receive hideFunc as a prop, load it with hide whose value is 1
   //to go back to dashboard and hide its contents
   const hide=1;
   hideFunc(hide)
   //get login data
   const loginData=JSON.parse(localStorage.getItem('loginData'));
   const navigate=useNavigate();
   
   //pagination
   const [currentPage, setCurrentPage] = useState(1)
   const [lastPage, setLastPage] = useState(1)
   const [total, setTotal] = useState(1)
   //plans
   const [plans, setPlans] = useState([])
   const [loadingPlans, setLoadingPlans] = useState(false)



   const plansFunc=async(page)=>{
      setLoadingPlans(true)
      const res=await axios.get('http://127.0.0.1:8000/api/panel/plans?page='+page);
      console.log(res.data)
      setPlans(res.data.data)
      setLastPage(res.data.last_page)
      setTotal(res.data.total)
      setLoadingPlans(false)
   }

   //when pagination number is clicked change currentPage
   const changePageFunc=(page)=>{
    setCurrentPage(page)
   }


   //mark row
  const markRow=(ee)=>{
    if( ee.parentElement.style.backgroundColor=='orange'){
        ee.parentElement.style.backgroundColor='white';
    }else{ ee.parentElement.style.backgroundColor='orange' }
  }


  //delete user
  const deletePlan=async(plan_id)=>{ 
    const del=window.confirm('Do you want to delete this plan?')
    if(del){    
       const res=await http.post(`/panel/delete-plan/${plan_id}`)
       alert(res.data.message)
       window.location.reload()
    }
 }


 //accept plan and feature ad
 const featureFunc=async(item_id,chosenPlan)=>{
    const del=window.confirm('Do you want to accept this plan and feature this ad?')
    if(del){    
       const res=await http.post(`/panel/feature-ad`,{item_id,chosenPlan})
       alert(res.data.message)
       window.location.reload()
    }
 }




   useEffect(() => {
      plansFunc(currentPage)
   }, [currentPage])



    return (
        <div className='container-fluid top-cont'>
            {loadingPlans ? (<p className='spinner-border gray mx-auto mt-5 d-block'></p>)
             : plans&& plans.length>0 ?
             (        
            <>
            <span>All plan requests  ({total})</span>
            <p className='small'>These users requested to feature their ads</p>
            <div className='overflow-auto w-100 pb-5 table-user-parent' >
                <table className='mb-5 table-user min-vw-100' >                   
                   <thead className='bg-info fw-bold'>
                        <tr >
                            <td>Id</td>
                            <td>Item_id</td>
                            <td>Category</td>
                            <td>Title</td>
                            <td>Ad added on</td>      
                            <td>status</td>
                            <td>Chosen plan</td>
                            <td>User name</td>      
                            <td>User phone</td>
                            <td>pay method</td>      
                            <td>Order date</td>                                                  
                            {loginData.admin ==='sup'||loginData.admin ==='own' &&    //only super admin or owner can do actions                      
                            <td>Action</td> 
                            }                      
                        </tr>
                    </thead>

                    <tbody>
                       {  plans.map((e)=>(
                        <tr key={e.plan_id}  onClick={(ee)=>{markRow(ee.target);}}  >
                            <td>{e.plan_id}</td>
                            <td>{e.item_id}</td>
                            <td>{e.ad_cat}</td>
                            <td>{e.ad_title}</td>
                            <td>{e.ad_date}</td>
                            <td>{e.ad_status}</td>
                            <td>{e.ad_chosenplan}</td>
                            <td>{e.ad_username}</td>
                            <td><a href={'tel:0'+e.ad_userphone}>{'0'+e.ad_userphone}</a></td> 
                            <td>{e.pay_method}</td>
                            <td>{e.order_date}</td>                                                                                                     
                            {loginData.admin ==='sup'||loginData.admin ==='own' && // action ONLY allowed for super admins
                            (<td>
                                {/* block user */}
                               <i title='Accept and feature ' className='bi bi-door-closed-fill me-3 text-warning fs-5' onClick={()=>{featureFunc(e.item_id,e.ad_chosenplan)}} ></i>                       
                               {/* delete plan */}
                               <i title='Delete plan row in plan table' onClick={()=>{deletePlan(e.plan_id)}} className='bi bi-trash text-danger fs-5'></i>
                            </td>)}
                        </tr>
                       ))}
                    </tbody>                 
                </table>

                {<Pagination currentPage={currentPage} lastPage={lastPage} changePageFunc={changePageFunc} />}
              
            </div>
            </>
            ):<p>لا توجد طلبات لخطط تمييز </p>
            }      
        </div>
    )
}

export default Requests
