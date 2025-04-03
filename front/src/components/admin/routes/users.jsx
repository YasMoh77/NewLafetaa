import { useEffect,useState,useRef } from 'react'
import { useNavigate } from 'react-router'
import axios  from 'axios'
import {http} from '../../axios/axiosGlobal' 
import Pagination  from '../pagination'
import   '../admin.css'

const Users = ({hideFunc}) => {
    //receive hideFunc as a prop, load it with hide whose value is 1
    //to go back to dashboard and hide its contents
    //const hide=1;
    hideFunc(1)

     //get login data
     const loginData=JSON.parse(localStorage.getItem('loginData'));

    const navigate=useNavigate();
    //states
    const [users, setUsers] = useState(null)
    const [loadingUsers, setLoadingUsers] = useState(false)
    //pagination
    const [currentPage, setCurrentPage] = useState(1)
    const [lastPage, setLastPage] = useState(1)
    const [total, setTotal] = useState(1)


    //const page=1;
   const getUsers=async(page)=>{
      setLoadingUsers(true)
      const res=await axios.get('http://127.0.0.1:8000/api/panel/users?page='+page);
     // console.log(res.data)
      //use data to change states
      setCurrentPage(res.data.current_page)
      setLastPage(res.data.last_page)
      setTotal(res.data.total)
      setUsers(res.data.data)
      setLoadingUsers(false)
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

   //block & unblock
   const block=async(id,block)=>{
       const confirmBlock=window.confirm('Warning! You will BLOCK this user');
       if(confirmBlock){
            const res=await http.post('panel/block',{id,block})
            //on finishing, show alert message 
            alert(res.data.message)
            window.location.reload()
       }
   }

      //unblock
      const cancelBlock=async(id,block)=>{
          const confirmCancel=window.confirm('Warning! You will CANCEL BLOCK this user');
        if(confirmCancel){
             const res=await http.post('panel/block',{id,block})
             //on finishing, show alert message 
             alert(res.data.message)
             window.location.reload()
        }
    }

   //change users to admin, super admin or owner
   const adminFunc=async(val,id)=>{
    //send val to backend
    const res=await http.post('/panel/change-admin',{val,id});
    alert(res.data.message)
    window.location.reload()
   }


    //delete user
   const deleteItem=async(id)=>{
      const del=window.confirm('Do you want to delete this user?')
      if(del){    
         const res=await http.post(`/panel/delete/${id}`)
         alert(res.data.message)
         window.location.reload()
      }
   }


   useEffect(() => {
       getUsers(currentPage);
       !loginData || loginData && loginData.admin==='' && navigate('/')
   }, [currentPage])


    return (
        <div className='container-fluid top-cont'>
            {loadingUsers ? (<p className='spinner-border gray mx-auto mt-5 d-block'></p>)
             : users&& users.length>0 &&
             (        
            <>
            <p>All users  ({total})</p>
            <div className='overflow-auto w-100 pb-5 table-user-parent' >
                <table className='mb-5 table-user min-vw-100' >                   
                   <thead className='bg-info fw-bold'>
                        <tr >
                            <td>Id</td>
                            <td>Name</td>
                            <td>Email</td>
                            <td>Email verified at</td>
                            <td>Admin</td>      
                            <td>Blocked</td>                                                  
                            {loginData.admin ==='sup'||loginData.admin ==='own' &&    //only super admin or owner can do actions                      
                            <td>Action</td> 
                            }                      
                        </tr>
                    </thead>

                    <tbody>
                       {  users.map((e)=>(
                        <tr key={e.id}  onClick={(ee)=>{markRow(ee.target);}}  >
                            <td>{e.id}</td>
                            <td>{e.name}</td>
                            <td>{e.email}</td>
                            <td>{e.email_verified_at}</td>
                            <td className='w-fit'><span className='text-success'>{e.admin=='ok'?'admin':e.admin=='sup'?'superAdmin':e.admin=='own'?'Owner':''}</span></td>  
                            <td>{e.block==1 ? <span className='red'>blocked</span> : ''} </td>                                                   
                            {loginData.admin ==='sup'||loginData.admin ==='own' && // action ONLY allowed for super admins
                            (<td>
                                {/* block user */}
                               {e.block==1 ? <i title='cancel blocking' className='bi bi-lock me-5 p-1 bg-danger text-light' onClick={()=>{cancelBlock(e.id,e.block)}} ></i> : <i title='block' className='bi bi-unlock me-5 p-1 bg-success text-light' onClick={()=>{block(e.id,e.block)}} ></i> }                       
                               {/* delete user */}
                               <i title='delete' onClick={()=>{deleteItem(e.id)}} className='bi bi-trash me-5 bg-danger text-light p-1'></i>
                                {/* promote user */}
                                <select  onChange={(ee)=>{adminFunc(ee.target.value,e.id)}}>
                                    <option value='0'>make</option>
                                    {e.admin=='' ? <option selected value='1'>User</option> : <option value='1'>User</option>}
                                    {e.admin=='ok' ? <option selected value='2'>Admin</option> : <option value='2'>Admin</option>}
                                    {e.admin=='sup' ? <option selected value='3'>Superadmin</option> : <option value='3'>Superadmin</option>}
                                    {e.admin=='own' ? <option selected value='4'>Owner</option> : <option value='4'>Owner</option>}                                
                                </select>                               
                            </td>)}
                                                                               
                        </tr>
                       ))}
                    </tbody>                 
                </table>

                {<Pagination currentPage={currentPage} lastPage={lastPage} changePageFunc={changePageFunc} />}
              
            </div>
            </>

           

            )}      
        </div>
    )
}

export default Users
