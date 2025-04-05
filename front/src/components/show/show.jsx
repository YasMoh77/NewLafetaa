import React, {useRef,useEffect,useState } from 'react';
import { Modal, Button } from "react-bootstrap";
import {Link} from 'react-router-dom'
import {http} from '../axios/axiosGlobal'
import ShowSaved from  './ShowSaved'
//import GetCatSubcat from '../helpers/catSubcat';
//import GetCountryStateCity from '../helpers/countryStateCity';
import GetUserName from '../helpers/getUserName';
import GetStars from '../helpers/GetStars';
import NumOfReplies from '../helpers/NumOfReplies';
import LikeComment from '../helpers/LikeComment';
import CheckReportCom from '../helpers/CheckReportCom';
import CheckReportAd from '../helpers/CheckAdReported';
import './show.css';


//this is home page
function Show() {
    const loginData=JSON.parse(localStorage.getItem('loginData'));
    //bring featured ads
    const [featured, setFeatured] = useState([])
    //bring latest ads (ordinary not featured)
    const [adsLatest, setAdsLatest] = useState([])
    //check blocking
    const [resultBlock, setResultBlock] = useState('')
    const [resultBlockComms, setResultBlockComms] = useState('')
    //search
    const refCountry = useRef()
    const refState = useRef()
    const refCity = useRef()
    const refCat = useRef(0)
    const refSubcat = useRef(0)
    const refSearch = useRef('')
    const [state, setState] = useState([])
    const [city, setCity] = useState([])
    const [cats, setCats] = useState([])
    const [subcats, setSubcats] = useState([])
    const [result, setResult] = useState([])
    const [free, setFree] = useState('')
    const [adsNum, setAdsNum] = useState('')
    const [div, setDiv] = useState(0)
    const [msg, setMsg] = useState('')
    const [loading, setLoading] = useState(true)
    const [loadingSearch, setLoadingSearch] = useState(false)
    const [loadingMore, setLoadingMore] = useState(false)
    const [searchWord, setSearchWord] = useState('')
    //loadMore
    const [currentPage, setCurrentPage] = useState(1)
    const [savedStatuses, setSavedStatuses] = useState({})
    const refLoadMoreBtn = useRef('')
    //enlarge image
    const [enlarge, setEnlarge] = useState('')
    const baseURL='http://127.0.0.1:8000/storage/images/';
   //check if ad is saved or not
   const checkSavedStatus = async (itemIds, userEmail) => {
        try {
        const res = await http.post('/checkSaved', { itemIds, userEmail });
        // return
        return res.data.message; // Assuming it returns an object like { itemId1: 'saved', itemId2: 'not_saved', ... }
        
        } catch (error) {
        // console.error('Failed to check saved status', error);
        return {};
        }
    };

     //get featured ads on homepage when page loads 
   const bringFeatured=async()=>{
	setLoading(true);//start loading spinner	
	const res= await http.get('/home');//fetch data
    // Check saved status 
    const bringLinksItems=res.data.featured;
    if (loginData) {
        const itemIds = bringLinksItems.map(e => e.item_id);
        const statuses = await checkSavedStatus(itemIds, loginData.email);
        setSavedStatuses(statuses);  
      }

    setFeatured(res.data.featured);//store data in ads
    setLoading(false);//end loading spinner
  }

  //get newest ads on homepage when page loads
  const bringLatest=async()=>{
    setLoading(true);//start loading spinner	
	const res= await http.get('http://127.0.0.1:8000/api/latest');//fetch data
    // Check saved status 
    const bringLatestItems=res.data;
    if (loginData) {
        const itemIds = bringLatestItems.map(e => e.item_id);
        const statuses = await checkSavedStatus(itemIds, loginData.email);
        setSavedStatuses(statuses);  
      }
    setAdsLatest(res.data);//store data in ads
    setLoading(false);//end loading spinner
  }

//report ads when clicking on icon
const [adReported, setAdReported] = useState()
const click='click'
const reportAd=async(item,email)=>{
   const res=await http.post(`/ads/report-ad`,{click,item,email})
   //set the state
   setAdReported({ok:res.data.ok,item:res.data.item,email:res.data.email})
}

//provide search suggestions(search autocomplete)
const [suggestions, setSuggestions] = useState({result:'start'})//autocomplete search suggestions
//const [query, setQuery] = useState('');
const [loadSuggest, setLoadSuggest] = useState(false)
//get autosearch value into input 
const inputValue=(input)=>{
    refSearch.current.value=input
    setSuggestions({result:'start'})
}
//show search results
const searchSuggestions=async(text)=>{
    if(text.trim().length>0){
        setLoadSuggest(true)
        const res=await http.post(`/search-suggestions`,{text})
        res.data.result&&res.data.result.length>0
       ? setSuggestions(res.data.result)
       :setSuggestions({result:'empty'})
        setLoadSuggest(false)
    }else{
        setSuggestions({result:'start'})
    }
}

function modefyArabicTextForSearch(searchText){
     return searchText
     .replace(/[أإآ]/g, 'ا') ;
    // .replace(/[أإآ]]/g,'ا')
}

//search function
const searchFunc=async(e)=>{
        e.preventDefault();
        //remove search suggestion results
        setSuggestions({result:'start'})
        //start loading spinner
        setLoadingSearch(true);
        //set current page to 1
        setCurrentPage(1);
        //get values to be sent
        const countryValue=parseInt(refCountry.current.value,10);
        const stateValue=parseInt(refState.current.value,10);
        const cityValue=parseInt(refCity.current.value,10);
        const catValue=refCat.current.value;
        const subcatValue=refSubcat.current.value;
        const searched=refSearch.current.value;
        const search=modefyArabicTextForSearch(searched)
        //store values
        //console.log('se=',searched,search)
        const postData={countryValue,stateValue,cityValue,catValue,subcatValue,search}
        //fetch data when search form is submitted
        const res= await http.post('/search',postData);
        const broughtAds=res.data.data;
        // Check saved status 
       if (loginData) {
            const itemIds = broughtAds.map(e => e.item_id);
            const statuses = await checkSavedStatus(itemIds, loginData.email);
            setSavedStatuses(statuses);    
       }
        //set values
        setMsg(res.data.msg);
        setFree(res.data.free);
        setAdsNum(res.data.adsNum);
        setDiv(res.data.div);
        setSearchWord(res.data.word)
        setResult(res.data.data);
        //end loading spinner  
        setLoadingSearch(false);
}
   
  
//load more ads
const loadMore=async()=>{
    //start loading
    setLoadingMore(true);
    if(refLoadMoreBtn.current){
        refLoadMoreBtn.current.disabled=true
        refLoadMoreBtn.current.style.cursor='not-allowed'
    }
    const Page = currentPage + 1;
    //get values
     const countryValue=parseInt(refCountry.current.value,10);
     const stateValue=parseInt(refState.current.value,10);
     const cityValue=parseInt(refCity.current.value,10);
     const catValue=refCat.current.value;
     const subcatValue=refSubcat.current.value;
     const search=searchWord;
     //store values
     const postData={countryValue,stateValue,cityValue,catValue,subcatValue,Page,search}
     //fetch data
     const res= await http.post('http://127.0.0.1:8000/api/search',postData);
     const newItems = res.data.data;
     // Check saved status 
     if (loginData) {
        const itemIds = newItems.map(e => e.item_id);
        const statuses = await checkSavedStatus(itemIds, loginData.email);
        setSavedStatuses(prevStatuses => ({ ...prevStatuses, ...statuses }));  
      }
     // Append new items to existing results
     setResult(prevResults => [...prevResults, ...newItems]);
     //increment currentPage
     setCurrentPage(Page); // Update current page
     setLoadingMore(false);  
     if(refLoadMoreBtn.current){
        refLoadMoreBtn.current.disabled=false 
        refLoadMoreBtn.current.style.cursor='pointer'    
     } 
}


// enlarge image
const enlargeFun=(e)=>{
    setEnlarge(baseURL+e.photo)
    document.querySelector('body').style.overflow='hidden';
}
// stop enlarge image
const stopEnlargeFun=()=>{
    setEnlarge('');
    document.querySelector('body').style.overflow='initial';
}

//show comments on ads
const [showModal, setShowModal] = useState(false)
const [adData, setAdData] = useState([])
const [showComments, setShowComments] = useState([])
const [showCommentsReplies, setShowCommentsReplies] = useState([])
const [showCommentsCount, setShowCommentsCount] = useState(0)
const [showComRepliesCount, setShowComRepliesCount] = useState(0)
const [commentLoader, setCommentLoader] = useState(false)
const [isOwner, setIsOwner] = useState(false)

const commentsFunc=async(e)=>{
    //show modal
    setShowModal(true)
    setAdData(e)
    //e===ad data
    const id=e.item_id
    //start spinner
    setCommentLoader(true)
    const res=await http.post(`/ads/comments/${id}`)
    setShowComments(res.data.comments)
    setShowCommentsReplies(res.data.replies)
    setRepliesToOld([])
    setShowCommentsCount(res.data.count)
    //console.log('comts=',e)
        //check if commentor is the owner of the ad
        const email=loginData&&loginData.email
        if(email){
            const res2= await http.post(`/ads/check-ad-owner/${email}/${id}`)
            if(res2.data.found==='owner'){
                setIsOwner(true)
            }else{ 
                setIsOwner(false)
            }
        }
    setCommentLoader(false)
}


//insert comment
const inputComment = useRef('')
const refBtnSubmitComment = useRef('')
const received = useRef('')
const insertComment=async(e,item,owner)=>{
    e.preventDefault()
    //store value
    const comment=inputComment.current.value
    if(comment.length>0){
        //disable double submission
        if(refBtnSubmitComment.current){
            refBtnSubmitComment.current.disabled=true
            refBtnSubmitComment.current.style.cursor='not-allowed'
        }
        //if red, restore border normal color
        inputComment.current.style.border='1px solid transparent'
        //send comment to backend
        const email=loginData.email
        const rate=rate5.current.style.color==='orange'?'5':(rate4.current.style.color==='orange')?'4':(rate3.current.style.color==='orange')?'3':(rate2.current.style.color==='orange')?'2':'1'
        //send api
        const res=await http.post(`/ads/insert-comment`,{comment,item,owner,rate,email})
        //if comment was inserted
        if(res.data.ok){
            received.current.style.color='green'
            received.current.innerHTML='🗸' 
           //hide modal
            setTimeout(() => {
                setShowModal(false)
            }, 1800);
        }else{
            received.current.style.color='red'
            received.current.innerHTML='☒'
        }     
   }else{
        refBtnSubmitComment.current.disabled=false
        inputComment.current.style.border='1px solid red'
   }
}

//replies to comments
const [replyState, setReplyState] = useState(0)
const [commDiv, setCommDiv] = useState(0)
const ReplyT = useRef('')
const refCommsDiv = useRef('')
//when clicking comment, show reply input
const replyFunc=(e)=>{ //e=c_id(comment id)
    //show the form to reply
  setReplyState(e)
  //hide the replies on page render and show on click reply
  commDiv===0?setCommDiv(e):setCommDiv(0)
}

//submit Reply to old comment
const [repliesToOld, setRepliesToOld] = useState([])
const [repliesToOldCount, setRepliesToOldCount] = useState(0)
const submitReply=async(ev,e)=>{
   ev.preventDefault()
   const reply_text=ReplyT.current.value
   const c_id=e.c_id
   const email=loginData&&loginData.email
   const item=e.ITEM_ID
   if(reply_text.length>0){
   const res=await http.post(`/ads/submit-reply/`,{c_id,reply_text,email,item})
   res.data.replies&&
   setRepliesToOld(res.data.replies)//show replies
   setShowCommentsReplies([])//empty replies which appear autoatically on page render(interchangable with setRepliesToOldCount)
   setRepliesToOldCount(res.data.count)
   setCommDiv(c_id)//show the div which contains replies(was hidden on page render)
   ReplyT.current.value=''//empty reply input   
  }
}

//like a comment
const [likeCount, setLikeCount] = useState(null)
const likeFunc=async(e)=>{
   // prepare values
    const cid=e.c_id//comment id
    const commentor=e.commentor
    const item=e.ITEM_ID
    const owner=e.owner
    const email=loginData&&loginData.email
    const res=await http.post(`/ads/insert-like-comment`,{cid,commentor,item,owner,email})
    setLikeCount({count:res.data.count,user:res.data.user,email:res.data.email,cid:cid})
    //console.log('rr=',res.data,email,res.data.user)
}

//reportCom
const [showReport, setShowReport] = useState() //show the flag icon filled
const reportCom=async(cid)=>{
   const email=loginData&&loginData.email
   const click='click'
   const res=await http.post(`/ads/report-comment`,{click,cid,email})
   setShowReport({ok:res.data.ok,cid:res.data.cid,email:res.data.email})
   console.log('click=',res.data)
}


//rate ads
const rate1 = useRef(1) 
const rate2 = useRef(2)
const rate3 = useRef(3)
const rate4 = useRef(4)
const rate5 = useRef(5)

const rateFunc=(e)=>{
    //if user rated one star
  if(e===1){
    //rate1.current.style.color='orange'
    rate2.current.style.color='initial'
    rate3.current.style.color='initial'
    rate4.current.style.color='initial'
    rate5.current.style.color='initial'
  }else if(e===2){
    rate2.current.style.color='orange'
    rate3.current.style.color='initial'
    rate4.current.style.color='initial'
    rate5.current.style.color='initial'
  }else if(e===3){
    rate2.current.style.color='orange'
    rate3.current.style.color='orange'
    rate4.current.style.color='initial'
    rate5.current.style.color='initial'
  }else if(e===4){
    rate2.current.style.color='orange'
    rate3.current.style.color='orange'
    rate4.current.style.color='orange'
    rate5.current.style.color='initial'
  }else if(e===5){
    rate2.current.style.color='orange'
    rate3.current.style.color='orange'
    rate4.current.style.color='orange'
    rate5.current.style.color='orange'
  }
}

//get states
async function getStates(cont){
    //fetch states
   const res=  await http.post('/states',{cont});
   setState(res.data); 
}

//get cities
async function getCities(state){
    const postData={state};
    const res3= await http.post("http://127.0.0.1:8000/api/cities",postData);
    setCity(res3.data);
}

//get categories
async function getCats(){
   const res=  await http.post('/cats');
   setCats(res.data); 
}

//get sub categories
async function getSubcats(id){ //id=cat_id
   const res=  await http.post('/subcats',{id});
   setSubcats(res.data); 
}

  //check if user is prevented from adding ads
const checkBlockingReporting=async()=>{
    const more='reports'
    const email=loginData&&loginData.email
    const res=await http.post('/panel/check-user-block',{email,more})
    //res.data.message=0 means not blocked from adding ads
    res.data.more==='reports'&&setResultBlock(res.data.message)
}
  //check if user is prevented from commenting
const checkBlockingComms=async()=>{
    const more='comms'
    const email=loginData&&loginData.email
    const res=await http.post('/panel/check-user-block',{email,more})
    //res.data.message=0 means not blocked from commenting 
    res.data.more==='comms'&&setResultBlockComms(res.data.message)
}
  //bring featured and latest ads and categories when page loads
useEffect(() => {
    bringFeatured();
    bringLatest();
    getCats()
    checkBlockingReporting()
    checkBlockingComms()
}, []) 


    return (
          <>
                <div  className="container-fluid fullheight">
                       {/* show modal for comments */}
                       {showModal && 
                         <>                            
                            {/*<!-- Modal -->*/}
                            <Modal show={showModal} onHide={() => setShowModal(false)}>
                                <Modal.Header className='d-flex justify-content-between'>
                                     <Modal.Title>{adData.NAME}</Modal.Title>
                                     <Button variant='white'><i onClick={()=>{setShowModal(false)}} className='bi bi-x-lg text-danger'></i></Button>
                                </Modal.Header>
                                <Modal.Body className='overflow-auto'>
                                    {/** show comments */}
                                    {commentLoader
                                        ?<div className='w-fit mx-auto'><p className='spinner-border text-info'></p></div>
                                        : <>{showComments && Array.isArray(showComments) &&showComments.length>0
                                            ?<>
                                                <p>التعليقات ({showCommentsCount>0&&showCommentsCount})</p>
                                                {showComments.map((e)=>
                                                        <><div className='mb-5 p-1 border border-1 rounded-2 bg-light'>
                                                                <div className='d-flex mb-3 '>
                                                                    <i className='bi bi-person-circle fs-2 gray ms-3'></i>
                                                                    <div>
                                                                        <span><GetUserName id={e.commentor} /> </span>
                                                                        <p>{e.c_date}</p>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <GetStars e={e.rate} />
                                                                </div>
                                                                <div> {e.c_text}</div>
                                                                {/** replies */}
                                                                {/** like reply report */}
                                                                <div className='mt-2 w-50 mx-auto d-flex justify-content-between '>
                                                                    {loginData
                                                                       ? <> {/* if logged in */}
                                                                            <span title='اعجاب' onClick={()=>{likeFunc(e)}}>
                                                                               {likeCount
                                                                                    ? likeCount.count>0
                                                                                         ? <>
                                                                                              <span>{likeCount.cid===e.c_id&&likeCount.count}</span>
                                                                                              {likeCount.user==='like'&&loginData.email===likeCount.email&&likeCount.cid===e.c_id
                                                                                                 ?<i className='bi bi-hand-thumbs-up-fill pointer'></i>
                                                                                                 :<i className='bi bi-hand-thumbs-up pointer'></i>
                                                                                              }
                                                                                           </>
                                                                                         :<><></>   
                                                                                            {likeCount.user==='like'&&loginData.email===likeCount.email&&likeCount.cid===e.c_id
                                                                                                ?<i className='bi bi-hand-thumbs-up-fill pointer'></i>
                                                                                                :<i className='bi bi-hand-thumbs-up pointer'></i>
                                                                                            }
                                                                                        </> 
                                                                                    :<LikeComment cid={e.c_id} email={loginData.email} />
                                                                                } 
                                                                            </span>
                                                                          </>
                                                                          /* if not logged in */
                                                                         :<Link to='/login'><i title='اعجاب' className='bi bi-hand-thumbs-up pointer'></i></Link>
                                                                     }
                                                                    <span title='رد' onClick={()=>{replyFunc(e.c_id)}}>
                                                                        {repliesToOldCount&&repliesToOldCount>0?repliesToOldCount: <NumOfReplies comment_id={e.c_id} />}
                                                                        <i className='bi bi-chat pointer me-1'></i>
                                                                    </span>
                                                                    {loginData 
                                                                        ?<>{/* when online user clicks on repoert icon */}
                                                                            {resultBlock===0 //user not blocked
                                                                                ?
                                                                                    <span onClick={()=>{reportCom(e.c_id)}} title='تبليغ'>
                                                                                            {showReport /* show filled icon or unfilled icon */
                                                                                            ?showReport.ok==='ok'&&showReport.email===loginData.email&&showReport.cid===e.c_id
                                                                                                ?<i className='bi bi-flag-fill pointer'></i>
                                                                                                :<i className='bi bi-flag pointer'></i>
                                                                                            :<CheckReportCom cid={e.c_id} email={loginData.email} />
                                                                                            }
                                                                                    </span>
                                                                                  //user blocked
                                                                                :<i title='محظور' className='bi bi-flag'></i>
                                                                            }
                                                                         </>
                                                                        :<Link to='/login'><i title='تبليغ' className='bi bi-flag pointer'></i></Link>
                                                                    }
                                                                    {/* if not logged in */}
                                                                    {/*<Link to='/login'><i title='رد' className='bi bi-chat pointer'></i></Link>*/}
                                                                    
                                                                </div> 
                                                                {/** show replies */}
                                                                <div ref={refCommsDiv} className={commDiv&&commDiv===e.c_id?'':'none'} >
                                                                    {showCommentsReplies&&Array.isArray(showCommentsReplies)&&showCommentsReplies.length>0
                                                                     ? showCommentsReplies.map((r)=>
                                                                           r.c_id===e.c_id&&
                                                                           <div className='small my-2 me-5 p-1 border border-1 rounded-2 bg-white'>
                                                                               <div className='d-flex mb-3 '>
                                                                                   <i className='bi bi-person-circle fs-4 gray ms-3'></i>
                                                                                   <div>
                                                                                       <span className='fw-bold'><GetUserName id={r.commentor} /> </span>
                                                                                       <p className='mb-0'>{r.date}</p>
                                                                                   </div>
                                                                               </div>
                                                                               <div> {r.text}</div>
                                                                           </div>
                                                                           )
                                                                     : repliesToOld&&Array.isArray(repliesToOld)&&repliesToOld.length>0&&repliesToOld.map((r)=>
                                                                            r.c_id===e.c_id&& 
                                                                           <><div className='small my-2 me-5 p-1 border border-1 rounded-2 bg-white'>
                                                                                <div className='d-flex mb-3 '>
                                                                                    <i className='bi bi-person-circle fs-4 gray ms-3'></i>
                                                                                    <div>
                                                                                        <span className='fw-bold'><GetUserName id={r.commentor} /> </span>
                                                                                        <p className='mb-0'>{r.date}</p>
                                                                                    </div>
                                                                                </div>
                                                                                <div> {r.text}</div>
                                                                             </div>
                                                                           </>
                                                                     )}
                                                                </div>

                                                                {/** show form to insert reply if clicked on reply icon */}    
                                                                {loginData&&replyState>0&&replyState===e.c_id&& 
                                                                    <form onSubmit={(ev)=>{submitReply(ev,e)}} >
                                                                       {resultBlockComms===0&& <input ref={ReplyT} type='text' className='border-secondary border-1 mx-auto w-100 rounded-3 d-block small p-1' placeholder='اكتب رد على التعليق' />}
                                                                    </form>
                                                                }
                                                         </div>
                                                         </>
                                                )}
                                            </>
                                            :<p>لا توجد تعليقات</p>
                                             }
                                             
                                             {loginData
                                             ? 
                                               <div className=''>
                                                    {/** owners of the ads cant comment but they can reply to comments */}
                                                    {isOwner
                                                        ?<p>لا يمكن لصاحب اللافتة التعليق ولكن يمكنه الرد على التعليقات</p>
                                                        :resultBlockComms===0
                                                           ?
                                                            <>
                                                                <div>
                                                                    <i className='bi bi-star text-warning' value='1' ref={rate1} onClick={()=>{rateFunc(1)}} ></i> <i className='bi bi-star mx-2' ref={rate2} onClick={()=>{rateFunc(2)}}></i> <i className='bi bi-star' ref={rate3} onClick={()=>{rateFunc(3)}} ></i>
                                                                    <i className='bi bi-star mx-2' ref={rate4} onClick={()=>{rateFunc(4)}} ></i> <i className='bi bi-star' ref={rate5} onClick={()=>{rateFunc(5)}} ></i>
                                                                </div>
                                                                <form onSubmit={(e)=>{insertComment(e,adData.item_id,adData.USER_ID)}} className='mt-3 '>
                                                                        <textarea ref={inputComment} placeholder='  اكتب تعليق على هذه اللافته' className='w-100 p-1 ms-1 ' ></textarea>
                                                                        <div className='d-flex'>
                                                                            <button ref={refBtnSubmitComment} className='border-0 p-1 bg-success text-white'>أرسل</button>
                                                                            <span className='me-2 align-self-center fs-4' ref={received}></span>
                                                                        </div>
                                                                </form>
                                                            </>
                                                            :<span className='text-danger'>محظور من التعليق لمخالفة سياسة الموقع</span>
                                                    }
                                               </div>
                                             :<Link to='/login'>سجل الدخول لاضافة تعليق</Link>
                                             }

                                             </>
                                            }
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={() => setShowModal(false)}>اغلاق</Button>
                                </Modal.Footer>
                            </Modal>


                         </>
                       }
                       {/** show spinner before featured ads load*/}
                        {loading 
                        ?<div className='d-flex align-items-center justify-content-center minheight'><p className="spinner-border gray mx-auto large-spinner"></p></div>
                        : 
                           <> {/** after loading hide spinner and show featured ads */}
                                { 
                                featured&&Array.isArray(featured)&&featured.length>0&& 
                                <><p className="paid"> لافتات مميزة</p>
                                <div className="row">
                                    <div id="show"  className="d-flex flex-wrap justify-content-between col-sm-12">
                                        {featured.map((e,index)=>
                                            <div className='col-sm-12 col-md-6 main' key={index}>
                                                <img  onClick={()=>{enlargeFun(e)}} key={index} src={baseURL+e.photo} alt={e.NAME} className='w-100 mx-auto d-block mb-1'/> 
                                                {/*<GetCatSubcat cat={e.CAT_ID} sub={e.subcat_id} />
                                                <GetCountryStateCity country={e.country_id} state={e.state_id} city={e.city_id} />*/}
                                                <div className='pe-1 mb-2 fw-bold text-muted text-truncate'>{e.NAME}</div>                                          
                                                <div className='featured-icons-div d-flex px-1 justify-content-between align-items-center fs-6'>
                                                     {/*means of communication*/}
                                                    <div>
                                                            {e.phone !== 0 ? <a className='me-3' target='_blank' rel='noopener noreferer nofollow' href={'tel:'+e.phone}><i className="bi bi-telephone-fill full-tel"></i></a>  : <a className='me-3'><i className="bi bi-telephone-fill empty"></i></a>} 
                                                            {e.whatsapp !==0 ? <a className='me-3' target='_blank' rel='noopener noreferer nofollow' href={'https://wa.me/'+e.whatsapp}><i className="bi bi-whatsapp full-whats"></i></a> : <a className='me-3'><i className="bi bi-whatsapp empty"></i></a> } 
                                                            {e.website !=='' ? <a className='me-3' target='_blank' rel='noopener noreferer nofollow' href={e.website}><i className="bi bi-globe-americas full-globe"></i></a> :  <a className='me-3'><i className="bi bi-globe-americas empty"></i></a>} 
                                                            {e.item_email !=='' ? <a className='me-3' target='_blank' rel='noopener noreferer nofollow' href={'mailto:'+e.item_email}><i className="bi bi-envelope-at-fill full-env"></i></a> : <a className='me-3'><i className="bi bi-envelope-at-fill empty"></i></a> } 
                                                            {e.youtube !=='' ? <a className='me-3' target='_blank' rel='noopener noreferer nofollow' href={e.youtube}><i className="bi bi-youtube full-you"></i></a> : <a className='me-3'><i className="bi bi-youtube empty"></i></a> } 
                                                    </div>

                                                    {/*rating, comment, save and report */}
                                                    <div className='d-flex justify-content-between text-align-center  gray'>
                                                        {/*rating*/}
                                                        <div className='mx-3'> 
                                                            <i className={e.rating>1?'bi bi-star text-warning' :'bi bi-star'}></i>
                                                            {e.rating>1 ? e.rating===2||e.rating===3||e.rating===4||e.rating===5?<span className='fs-6 ms-1'>{e.rating}.0</span>:<span>{e.rating}</span>:''  }
                                                        </div>
                                                        {/*comment*/}
                                                        <div title='تعليقات'>
                                                            <i onClick={()=>{commentsFunc(e);}} className={e.comments>0?'bi bi-chat-dots text-success' : 'bi bi-chat-dots'} ></i>
                                                            {e.comments>0&&<span className='fs-6 ms-1'>{e.comments}</span>}
                                                        </div>
                                                          {/*save*/}
                                                          {loginData ?  (<ShowSaved id={e.item_id} isSaved={savedStatuses[e.item_id] === 'saved'}/>) : (<Link title='حفظ' to='/login'><i className='bi bi-heart mx-2 align-self-center gray'></i></Link>) }
                                                          {/*report*/}
                                                          {loginData 
                                                            ? <> 
                                                               {resultBlock===0 /*user not blocked*/ 
                                                                 ?
                                                                    <span onClick={()=>{reportAd(e.item_id,loginData.email )}}>
                                                                        {adReported
                                                                            ?adReported.ok==='ok'&&adReported.item===e.item_id&&adReported.email===loginData.email
                                                                                ?<i className='bi bi-flag-fill mt-1'></i>
                                                                                :<i className='bi bi-flag mt-1'></i>
                                                                            :<CheckReportAd item={e.item_id} email={loginData.email} />
                                                                        }
                                                                    </span>
                                                                 :<i title='محظور' className='bi bi-flag mt-1'></i>
                                                               }
                                                             </>
                                                            :<Link to='/login' ><i className='bi bi-flag mt-1'></i></Link>
                                                          }
                                                    </div>
                                                </div>
                                            </div> )
                                        }
                                    </div>
                                </div></>
                                }


                                {/** after loading hide spinner and show latest ads */}
                                <div  className="container-fluid p-0 mt-5">
                                    <p className="paid"> أحدث اللافتات </p>
                                    <div className="row">
                                        <div id="show"  className="d-flex flex-wrap justify-content-between col-sm-12">
                                        { adsLatest.map((e,index)=>(
                                        <div className='col-sm-12 col-md-4 main2' key={index} >
                                            <img  onClick={()=>{enlargeFun(e)}} key={index} src={baseURL+e.photo} alt={e.NAME} className='w-100 mx-auto d-block img'/> 
                                            {/*<GetCatSubcat cat={e.CAT_ID} sub={e.subcat_id} />
                                            <GetCountryStateCity country={e.country_id} state={e.state_id} city={e.city_id} />*/}
                                            <div className='pe-1 mb-1 fw-bold text-muted text-truncate'>{e.NAME}</div>                                             
                                            <div className='featured-icons-div d-flex px-1 justify-content-between align-items-center fs-6 fs-md-6'>
                                               <div>
                                                    {e.phone != 0 ? <a className='me-3' target='_blank' rel='noopener noreferer nofollow' href={'tel:'+e.phone}><i className="bi bi-telephone-fill full-tel"></i></a>  : <a className='me-3'><i className="bi bi-telephone-fill empty"></i></a>} 
                                                    {e.whatsapp !=0 ? <a className='me-3' target='_blank' rel='noopener noreferer nofollow' href={'https://wa.me/'+e.whatsapp}><i className="bi bi-whatsapp full-whats"></i></a> : <a className='me-3'><i className="bi bi-whatsapp empty"></i></a> } 
                                                    {e.website !='' ? <a className='me-3' target='_blank' rel='noopener noreferer nofollow' href={e.website}><i className="bi bi-globe-americas full-globe"></i></a> :  <a className='me-3'><i className="bi bi-globe-americas empty"></i></a>} 
                                                    {e.item_email !='' ? <a className='me-3' target='_blank' rel='noopener noreferer nofollow' href={'mailto:'+e.item_email}><i className="bi bi-envelope-at-fill full-env"></i></a> : <a className='me-3'><i className="bi bi-envelope-at-fill empty"></i></a> } 
                                                    {e.youtube !='' ? <a className='me-3' target='_blank' rel='noopener noreferer nofollow' href={e.youtube}><i className="bi bi-youtube full-you"></i></a> : <a className='me-3'><i className="bi bi-youtube empty"></i></a> } 
                                               </div>
                                               {/*rating,comment,save and report*/}
                                               <div className='d-flex justify-content-between gray '>
                                                   {/*rating*/}
                                                    <div className='d-flex mx-3'>
                                                        <i className={e.rating>1?'bi bi-star text-warning' :'bi bi-star'}></i>
                                                        {e.rating>1 ? e.rating===2||e.rating===3||e.rating===4||e.rating===5?<span className='fs-6 ms-1'>{e.rating}.0</span>:<span>{e.rating}</span>:''  }
                                                    </div>
                                                    {/*comment*/}
                                                    <div title='تعليقات' className='d-flex'>
                                                        <i onClick={()=>commentsFunc(e)} className={e.comments>0?'bi bi-chat-dots text-success' : 'bi bi-chat-dots'} ></i>
                                                        {e.comments>0&&<span className='fs-6 ms-1'>{e.comments}</span>}
                                                    </div>
                                                    {/*save*/}
                                                    {loginData ?  (<ShowSaved id={e.item_id} isSaved={savedStatuses[e.item_id] === 'saved'}/>) : (<Link title='حفظ' to='/login'><i className='bi bi-heart mx-2 align-self-center gray'></i></Link>) }
                                                    {/*report*/}
                                                    {loginData 
                                                        /*if logged in*/
                                                        ? <>
                                                           {resultBlock===0 /*user not blocked*/
                                                             ?
                                                                <span onClick={()=>{reportAd(e.item_id,loginData.email )}}>
                                                                    {adReported
                                                                    ?adReported.ok==='ok'&&adReported.item===e.item_id&&adReported.email===loginData.email
                                                                        ?<i className='bi bi-flag-fill mt-1'></i>
                                                                        :<i className='bi bi-flag mt-1'></i>
                                                                    :<CheckReportAd item={e.item_id} email={loginData.email} />
                                                                    }
                                                                </span>
                                                             :  <i title='محظور' className='bi bi-flag mt-1'></i>
                                                            }
                                                            </>
                                                          /*if not logged in*/
                                                         :<Link to='/login' ><i className='bi bi-flag mt-1'></i></Link>
                                                     }
                                               </div>
                                            </div>
                                        </div> )) }
                                        </div>
                                    </div>	
                                </div>
 
                                {/* enlarge images*/}
                                {enlarge && (
                                   <div className="overlay">
                                       <img src={enlarge}  alt="k" /> <i onClick={stopEnlargeFun} className="close-btn hand bi bi-x-square" ></i>
                                   </div>
                                )}
                                
                                {/* search for ads */}
                                <div className="form-parent container-fluid">
                                    {/*form*/}
                                    <form onSubmit={searchFunc} id="formSearch" className="mx-auto py-5 px-2 rounded-3 col-md-11 col-sm-12">
                                        <div className="mx-auto row justify-content-between d-flex">
                                                {/*select countries*/}
                                                <select ref={refCountry} onChange={ (e)=>{/*setCountry(e.target.value);*/ getStates(e.target.value); } }   name="country"  className="select-place col-12 col-sm-12 col-md-4 mb-2" aria-label="Default select example">
                                                    <option value="0"> كل الدول </option>
                                                    <option value="1"> مصر</option>
                                                    <option disabled value="2">السعودية</option>
                                                    <option disabled value="3">الكويت</option>
                                                    <option disabled value="4">الامارات</option>
                                                    <option disabled value="5">قطر</option>
                                                    <option disabled value="6">عمان</option>
                                                </select>
                                                {/*select states*/}
                                                <select ref={refState} onChange={(e)=>{ getCities(e.target.value); }} name="state" id="state" className="select-place col-12 col-sm-12 col-md-4 mb-2" aria-label="Default select example">
                                                    <option value="0"> كل المحافظات</option>
                                                    {Array.isArray(state) && state.length > 0 ? state.map((e, index) => (
                                                    <option value={e.state_id} key={index}>{e.state_nameAR}</option>
                                                    )) : (
                                                    <option value="0">لا توجد نتائج</option>
                                                    )}
                                                </select>
                                                 {/*select cities*/}
                                                <select ref={refCity} name="city" id="city" className="select-place col-12 col-sm-12 col-md-4 mb-2" aria-label="Default select example">
                                                    <option value="0"> كل المدن</option>
                                                    {Array.isArray(city) && city.length > 0 ? city.map((e, index) => (
                                                    <option key={index} value={e.city_id}>{e.city_nameAR}</option>
                                                    )) : (
                                                    <option value="0">لا توجد نتائج</option>
                                                    )}
                                                </select>
                                                {/*search input and button*/}
                                                <select className='col-md-3 col-sm-12' ref={refCat} onChange={(e)=>{ getSubcats(e.target.value); }}>
                                                    <option value='0'>كل الأقسام</option>
                                                    {Array.isArray(cats)&&cats.length>0&&
                                                      cats.map((c,index)=>
                                                         <option key={index} value={c.cat_id}>{c.nameAR}</option>
                                                      )
                                                    }
                                                </select>
                                                <select className='col-md-3 col-sm-12' ref={refSubcat} >
                                                    <option value='0'> كل الأقسام الفرعية</option>
                                                    {subcats&&Array.isArray(subcats)&&subcats.length>0&&
                                                      subcats.map((s,index)=>
                                                         <option key={index} value={s.subcat_id}>{s.subcat_nameAR}</option>
                                                      )
                                                    }
                                                </select>
                                                <input type='text' onKeyUp={(e)=>{searchSuggestions(e.target.value)}}  ref={refSearch} className="btn col-md-4 col-sm-12 mb-2 mb-md-0 mb-sm-0 " placeholder='عن أي شيء تبحث؟'  />
                                                <button className="btn  col-md-2 col-sm-12 " type="submit" ><i className='bi bi-search fs-5'></i></button>
                                         </div>
                                    </form>
                                </div>
                                {loadSuggest
                                    ?<div className='mx-auto w-fit mt-1'><span className='spinner-border gray'></span></div>
                                    :suggestions&&suggestions.result!=='start'
                                        ?suggestions&&suggestions.result!=='empty'
                                            ?suggestions&&suggestions.length>0
                                                && //appear only if array suggestion has items
                                                <div className='suggestion-div overflow-auto'>
                                                   <div className='suggestion-child py-2 bg-success'>
                                                        {suggestions.map((s,index)=>
                                                            <span onClick={(e)=>{inputValue(e.target.innerHTML)}} key={index} className='d-block w-fit mx-auto text-white hand py-1'>{s.suggestion}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            :<div className='w-fit mx-auto text-danger'>لا توجد نتائج بحث</div>
                                        :<div></div>
                                }
                           </>
                        }
                        
                         {/* show search results after hitting search button */} 
                        <div  className="container-fluid p-0">
                                {loadingSearch? (
                                 <div className='d-flex justify-content-center minheight mt-3'><p className="spinner-border gray mx-auto large-spinner"></p></div>
                                ):(
                                   <div className="row">
                                       <p className="free">{free}</p>
                                        <small className="mb-2 d-block"> {adsNum} </small>
                                        <div id="show2"  className="d-flex flex-wrap justify-content-between ">
                                            {result&&result.length>0 ?  result.map((e,index)=>(
                                                <div className={e.feature===2?'col-xs-12 col-md-6 col-lg-4 main2 border-warning border-1':e.feature===1?'col-xs-12 col-md-6 col-lg-4 main2 border-info border-1':'col-xs-12 col-md-6 col-lg-4 main2'}> 
                                                    <img onClick={()=>{enlargeFun(e)}} key={index} src={baseURL+e.photo} alt={e.NAME} className='w-100 mx-auto d-block img'/> 
                                                    {/*<GetCatSubcat cat={e.CAT_ID} sub={e.subcat_id} />
                                                    <GetCountryStateCity country={e.country_id} state={e.state_id} city={e.city_id} />*/}
                                                    <div className='pe-1 mb-1 fw-bold text-muted text-truncate'>{e.NAME}</div>                                            
                                                    <div className='featured-icons-div d-flex px-1 justify-content-between align-items-center fs-6'>
                                                        <div className=''>
                                                            {e.phone != 0 ? <a className='me-3' target='_blank' rel='noopener noreferer nofollow' href={'tel:'+e.phone}><i className="bi bi-telephone-fill full-tel"></i></a>  : <a className='me-3'><i className="bi bi-telephone-fill empty"></i></a>} 
                                                            {e.whatsapp !=0 ? <a className='me-3' target='_blank' rel='noopener noreferer nofollow' href={'https://wa.me/'+e.whatsapp}><i className="bi bi-whatsapp full-whats"></i></a> : <a className='me-3'><i className="bi bi-whatsapp empty"></i></a> } 
                                                            {e.website !='' ? <a className='me-3' target='_blank' rel='noopener noreferer nofollow' href={e.website}><i className="bi bi-globe-americas full-globe"></i></a> :  <a className='me-3'><i className="bi bi-globe-americas empty"></i></a>} 
                                                            {e.item_email !='' ? <a className='me-3' target='_blank' rel='noopener noreferer nofollow' href={'mailto:'+e.item_email}><i className="bi bi-envelope-at-fill full-env"></i></a> : <a className='me-3'><i className="bi bi-envelope-at-fill empty"></i></a> } 
                                                            {e.youtube !='' ? <a className='me-3' target='_blank' rel='noopener noreferer nofollow' href={e.youtube}><i className="bi bi-youtube full-you"></i></a> : <a className='me-3'><i className="bi bi-youtube empty"></i></a> } 
                                                        </div>
                                                        {/*rating,comment,save and report*/}
                                                        <div className='d-flex justify-content-between gray'>
                                                            {/*rating*/}
                                                            <div className='d-flex mx-3'>
                                                                <i className={e.rating>1?'bi bi-star text-warning' :'bi bi-star'}></i>
                                                                {e.rating>1 ? e.rating===2||e.rating===3||e.rating===4||e.rating===5?<span className='fs-6 ms-1'>{e.rating}.0</span>:<span>{e.rating}</span>:''  }
                                                            </div>
                                                            {/*comment*/}
                                                            <div title='تعليقات' className='d-flex'>
                                                                <i onClick={()=>commentsFunc(e)} className={e.comments>0?'bi bi-chat-dots text-success' : 'bi bi-chat-dots'} ></i>
                                                                {e.comments>0&&<span className='fs-6 ms-1'>{e.comments}</span>}
                                                            </div>
                                                            {/*save*/}
                                                            {loginData ?  (<ShowSaved id={e.item_id} isSaved={savedStatuses[e.item_id] === 'saved'}/>) : (<Link title='حفظ' to='/login'><i className='bi bi-heart mx-2 align-self-center gray'></i></Link>) }
                                                            {/*report*/}
                                                            {loginData 
                                                                ? <>
                                                                  {resultBlock===0 /*user not blocked*/
                                                                    ?
                                                                        <span onClick={()=>{reportAd(e.item_id,loginData.email )}}>
                                                                            {adReported
                                                                                ?adReported.ok==='ok'&&adReported.item===e.item_id&&adReported.email===loginData.email
                                                                                    ?<i className='bi bi-flag-fill mt-1'></i>
                                                                                    :<i className='bi bi-flag mt-1'></i>
                                                                                :<CheckReportAd item={e.item_id} email={loginData.email} />
                                                                            }
                                                                        </span>
                                                                    :   <i title='محظور' className='bi bi-flag mt-1'></i>
                                                                  }
                                                                  </>
                                                                :<Link to='/login' ><i className='bi bi-flag mt-1'></i></Link>
                                                            }
                                                       </div>
                                                    </div>
                                            </div>
                                            
                                             ))   : (<p className="mx-auto red"> {msg} </p>) 
                                            }
                                        </div>
                                      {result && result.length>0 
                                      ?  div && currentPage<div 
                                            ? <button ref={refLoadMoreBtn} onClick={loadMore } className="btn btn-info w-25 px-4 mt-3 mx-auto" id="loadMore">  {loadingMore
                                                  ? (<span className="spinner-border spinner" role="status" aria-hidden="true"></span>)
                                                  : (<span className='mx-auto'> تحميل المزيد</span>)} </button>
                                            : <p className="mx-auto w-fit red">نهاية النتائج</p> 
                                      : <span></span>}
                                   </div>
                                )}
                                <p className="mx-auto w-fit red mt-5"></p>
                        </div>
                </div>
                
            
                <script type="text/javascript" src="front/JS/jquery-3.6.0.min.js"></script>	
                <script type="text/javascript" src="front/JS/bootstrap.min.js"></script>	
                <script type="text/javascript" src="front/JS/js.js"></script>	
           </>
        
    )
}

export default Show
