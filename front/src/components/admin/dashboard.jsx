import { useState,useEffect } from 'react'
import { Link, Route, Routes,useLocation } from 'react-router-dom'
//import hooks
import Ads from './routes/Ads'
import Users from './routes/users'
import Requests from './routes/requests'
import Comments from './routes/Comments'
import RepliesComments from './routes/RepliesComments'
import Notes from './routes/notes'
import   './admin.css'
import { http } from '../axios/axiosGlobal'



const  Dashboard=()=> {
    const [hide, setHide] = useState(0)
    const [adsNum, setAdsNum] = useState(0)
    const [usersNum, setUsersNum] = useState(0)
    const [plansNum, setPlansNum] = useState(0)
    const [comments, setComments] = useState(0)
    const [replies, setReplies] = useState(0)
    const location=useLocation()

    //send api call to count ads and users
    const count=async()=>{
        const res=await http.post('panel/count-dashboard');
        // 
        setAdsNum(res.data.ads)
        setUsersNum(res.data.users)
        setPlansNum(res.data.plans)
        setComments(res.data.comments)
        setReplies(res.data.replies)
    }
    
    //send hideFunc to ads and users to hide dasboard contents
    const hideFunc=(hide)=>{
        setHide(hide)
    }
    const showDashGraphs=(val)=>{
        if (val===0&&location.pathname==='/dashboard') {
            setHide(0)
        }else{
            setHide(1)
        }
    }

    useEffect(() => {
        count()
    }, [])

    useEffect(() => {
        showDashGraphs(0)
    }, [location.pathname])
    


    return (
        <div className='ltr mb-5' >
            <p> Dashboard </p>
            <div className='container-fluid d-flex '>
                <div className='row col-md-12 justify-content-between mb-5 px-0 mx-auto'>
                    <div className='left-dash col-2 bg-dark me-1'>
                        <ul className='list-unstyled py-4'>
                            <li className='pb-2'><Link onClick={()=>{showDashGraphs(0)}} to='/dashboard'>Dashboard</Link></li>
                            <li className='pb-2'><Link onClick={()=>{showDashGraphs(1)}} to='ads'>Ads</Link></li>
                            <li className='pb-2'><Link onClick={()=>{showDashGraphs(1)}} to='users'>Users</Link></li>
                            <li className='pb-2'><Link onClick={()=>{showDashGraphs(1)}} to='requests'>Plan requests</Link></li>
                            <li className='pb-2'><Link onClick={()=>{showDashGraphs(1)}} to='comments'>Comments</Link></li>
                            <li className='pb-2'><Link onClick={()=>{showDashGraphs(1)}} to='reply-comments'>Replies to Comments</Link></li>
                            <li className='pb-2'><Link onClick={()=>{showDashGraphs(1)}} to='notes'>Notes</Link></li>
                        </ul>
                    </div>

     
                    <div className='right-dash col-9  me-1'>
                        <div className='row h-100 justify-content-between '>
                            <Routes>
                               <Route path='ads'  element={<Ads hideFunc={hideFunc}/>} />
                               <Route path='users'  element={<Users hideFunc={hideFunc} />} />
                               <Route path='requests'  element={<Requests hideFunc={hideFunc} />} />
                               <Route path='comments'  element={<Comments hideFunc={hideFunc} />} />
                               <Route path='reply-comments'  element={<RepliesComments hideFunc={hideFunc} />} />
                               <Route path='notes'  element={<Notes hideFunc={hideFunc} />} />
                            </Routes>
                            {!hide && 
                            <div className='data d-flex justify-content-between p-0'>
                                <div className='col-md-2 bg-success show white text-center fs-4'><p>Ads</p> <Link to='ads'>{adsNum}</Link></div>
                                <div className='col-md-2 bg-danger show white text-center fs-4'>  <p>Users</p> <Link to='users'>{usersNum}</Link></div>
                                <div className='col-md-3 bg-dark show white text-center fs-4'>  <p>Plan Requests</p> <Link to='requests'>{plansNum}</Link></div>
                                <div className='col-md-3 bg-info show white text-center fs-4'>  <p>comments</p><Link to='comments'>{comments}</Link></div>
                                <div className='col-md-2 bg-secondary show white text-center fs-4'>  <p>replies</p><Link to='reply-comments'>{replies}</Link></div>
                            </div>
                            }
                        </div>
                    </div>
                    

                </div>
            </div>

           
        </div>
    )
}

export default Dashboard
