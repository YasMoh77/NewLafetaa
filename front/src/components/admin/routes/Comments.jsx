import {useEffect,useState,useRef} from 'react'
import { useNavigate } from 'react-router'
import axios  from 'axios'
import Pagination from '../pagination'
import GetUserName from '../../helpers/getUserName'
import GetAdName from '../../helpers/getAdName'
import { Modal, Button } from "react-bootstrap";
import { http5 } from '../../axios/axiosGlobal'


const Comments = () => {
    //get login data
    const loginData=JSON.parse(localStorage.getItem('loginData'));
    //states
    const navigate=useNavigate();
    //states
    const [comments, setComments] = useState([])
    const [loadComments, setLoadComments] = useState(false)
    //pagination
    const [currentPage, setCurrentPage] = useState(1)
    const [lastPage, setLastPage] = useState(1)
    const [total, setTotal] = useState(1)

    //get comments
   const getComments=async()=>{
    setLoadComments(true)
    const res=await axios.get('http://127.0.0.1:8000/api/panel/comments?page='+1/*page*/);
   // console.log(res.data)
    //use data to change states
    setCurrentPage(res.data.current_page)
    setLastPage(res.data.last_page)
    setTotal(res.data.total)
    setComments(res.data.data)
    setLoadComments(false)
 }

 //mark row
 const markRow=(ee)=>{
    if( ee.parentElement.style.backgroundColor=='orange'){
        ee.parentElement.style.backgroundColor='white';
    }else{ ee.parentElement.style.backgroundColor='orange' }
  }

  //when pagination number is clicked change currentPage
  const changePageFunc=(page)=>{
    setCurrentPage(page)
   }

   //edit
   const [modal, setModal] = useState(false)
   const [commentData, setCommentData] = useState([])
   const [textState, setTextState] = useState('')
   const editFunc=(e)=>{
      setModal(true)
      setCommentData(e)
      setTextState(e.c_text)
   }
   //use new value
   const editText=(e)=>{
      setTextState(e.target.value)
   }
   //submit comment editing
   const refComValue = useRef('')
   const btnSubmitFunc = useRef('')
   const [load, setLoad] = useState(false)
   const [msg, setMsg] = useState('')

   const submitFunc=async(e)=>{
    if(btnSubmitFunc.current){
        btnSubmitFunc.current.disabled=true
        btnSubmitFunc.current.style.cursor='not-allowed'
    }
       e.preventDefault()
       setLoad(true)
      const text=refComValue.current.value
      const id=commentData.c_id
      const res=await http5.post(`/panel/comment`,{text,id})
      setMsg(res.data.message)
      setLoad(false)
     setTimeout(() => {
          setMsg('')
          window.location.reload()
      }, 1200);
      btnSubmitFunc.current.disable=false
   }
   //delete comment
   const deleteFunc=async(id)=>{
       if(window.confirm('Delete this comment?')){
       const res=await http5.post(`/panel/delete-comment/`,{id})
       alert(res.data.message)
       window.location.reload()
       }
   }


  
    useEffect(() => {
        getComments()
    }, [])

    
    return (
        <>
        {modal&&
          /*<!-- Modal -->*/
          <Modal show={modal} onHide={() => setModal(false)}>
                <Modal.Header className='d-flex justify-content-between'>
                    <Modal.Title>{<GetAdName id={commentData.ITEM_ID} />}</Modal.Title>
                    <Button variant='white'><i onClick={()=>{setModal(false)}} className='bi bi-x-lg text-danger'></i></Button>
                </Modal.Header>

                <Modal.Body className='overflow-auto'>
                    <form onSubmit={submitFunc}>
                        <textarea className='w-100 d-block mb-2' ref={refComValue} value={textState} onChange={(ee)=>{editText(ee)}}></textarea>
                        <div className='d-flex align-items-center '>
                            <button ref={btnSubmitFunc} className='border-0 bg-success text-white ms-2'>أرسل</button>
                            {load
                            ?<span className='spinner-border text-info'></span>
                            :<span className={msg==='تم التعديل'?'text-success':'text-danger'}>{msg==='تم التعديل'?<i className='bi bi-check-lg'></i>:msg}</span>}
                        </div>
                    </form>
                </Modal.Body>

                <Modal.Footer>
                        <Button  variant="secondary" onClick={() => setModal(false)}>اغلاق</Button>
                </Modal.Footer>
           </Modal>

        }
        <div className='container-fluid top-cont'>
            {loadComments ? (<p className='spinner-border gray mx-auto mt-5 d-block'></p>)
             : comments&& comments.length>0 &&
             (        
            <>
            <p>All comments  ({total})</p>
            <div className='overflow-auto w-100 pb-2 table-user-parent' >
                <table className='mb-2 table-user min-vw-100 text-center' >                   
                   <thead className='bg-info fw-bold'>
                        <tr >
                            <td>Id</td>
                            <td>comment</td>
                            <td>Ad</td>
                            <td>Commentor</td>
                            <td>Rating</td>      
                            <td>Ad Owner</td>
                            <td>On</td>                                                        
                            {loginData.admin ==='sup'||loginData.admin ==='own' &&    //only super admin or owner can do actions                      
                            <td>Action</td> 
                            }                      
                        </tr>
                    </thead>

                    <tbody>
                       {  comments.map((e)=>(
                        <tr key={e.c_id}  onClick={(ee)=>{markRow(ee.target);}}  >
                            <td>{e.c_id}</td>
                            <td className='bg-light w-25 overflow-auto' dir='rtl'><span className='mh-20 d-block'>{e.c_text}</span></td>
                            <td dir='rtl'>{<GetAdName id={e.ITEM_ID} />}</td>
                            <td>{<GetUserName id={e.commentor} />}</td>
                            <td>{e.rate}</td>
                            <td>{<GetUserName id={e.owner} />}</td>  
                            <td dir='rtl'>{e.c_date}</td>  
                            <td>
                                <i onClick={()=>{editFunc(e)}} className='bi bi-pen me-3 text-success'></i>
                                <i onClick={()=>{deleteFunc(e.c_id)}} className='bi bi-trash text-danger'></i>
                            </td>
                                                                               
                        </tr>
                       ))}
                    </tbody>                 
                </table>

                {<Pagination currentPage={currentPage} lastPage={lastPage} changePageFunc={changePageFunc} />}
              
            </div>
            </>

            )}      
        </div>
        </>
    )
}

export default Comments
