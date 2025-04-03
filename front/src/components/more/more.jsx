import React,{useState, useEffect} from 'react'
import { useSearchParams,Link } from 'react-router-dom'
import GetCatSubcat from '../helpers/catSubcat';
import GetCountryStateCity from '../helpers/countryStateCity';
import ShowSaved from '../show/ShowSaved';

import { http } from '../axios/axiosGlobal'

const More = () => {
   //stored id for authenticated users
   const loginData=JSON.parse(localStorage.getItem('loginData'));
  //get ads based on query
   const [query] = useSearchParams()
   const [data, setData] = useState([])
   const [show, setShow] = useState(null)
   const [enlarge, setEnlarge] = useState('')
   const [savedStatuses, setSavedStatuses] = useState({})
   const country=query.get('cont')
   //load more ads
   //loadMore
   const [currentPage, setCurrentPage] = useState(1)
    const [loadingMore, setLoadingMore] = useState(false)
    const [loadingSearch, setLoadingSearch] = useState(false)
    const [adsNum, setAdsNum] = useState('')//number of ads per page
    const [div, setDiv] = useState(0) //ads per page divided by 9

   //url
   const baseURL='http://127.0.0.1:8000/storage/images/';
   //get country code for whatsapp
   const code=(name)=>{
        if(name==1||name==='مصر'){return '20';} else  if(name==2||name==='السعودية'){return '9660';}
        else  if(name==3||name==='الكويت'){return '9650';} else  if(name==4||name==='الامارات'){return '9710';}
        else  if(name==5||name==='قطر'){return '9740';} else  if(name==6||name==='سلطنة عمان'){return '9680';}
   }

   //const search= window.location.search
   //const query=new URLSearchParams(search)
    
   const [param, setParam] = useState(null)
   const [paramVal, setParamVal] = useState(0)
   //
   useEffect(() => {
    if (query.has('c')) {
        setParam('cat');setParamVal(query.get('c'))
      } else if (query.has('s')) {
        setParam('sub');setParamVal(query.get('s'))
      } else if (query.has('cnt')) {
        setParam('country');setParamVal(query.get('cnt'))
      } else if (query.has('st')) {
        setParam('state');setParamVal(query.get('st'))
      } else if (query.has('ci')) {
        setParam('city');setParamVal(query.get('ci'))
      } else {
        setParam('');setParamVal(0)
      }
   }, [query])

  //get ads
   const getAds=async()=>{
     if(param==='city'){
        setLoadingSearch(true)
        const res=await http.post(`/ads/more`,{param,paramVal})
        setData(res.data.ads)
        // store other data
        setShow(res.data.show)
        setAdsNum(res.data.adsNum)
        setDiv(res.data.div)
        setLoadingSearch(false)
      }else if(param==='state'){
        setLoadingSearch(true)
        const res=await http.post(`/ads/more`,{param,paramVal})
        setData(res.data.ads)
        //console.log(res.data.ads)
        setShow(res.data.show)
        setAdsNum(res.data.adsNum)
        setDiv(res.data.div)
        setLoadingSearch(false)
      }else if(param==='country'){
        setLoadingSearch(true)
        const res=await http.post(`/ads/more`,{param,paramVal})
        setData(res.data.ads)
       // console.log(res.data.ads)
        setShow(res.data.show)
        setAdsNum(res.data.adsNum)
        setDiv(res.data.div)
        setLoadingSearch(false)
      }else if(param==='cat'){
        setLoadingSearch(true)
        const res=await http.post(`/ads/more`,{param,paramVal})
        setData(res.data.ads)
        //console.log(res.data.ads)
        setShow(res.data.show)
        setAdsNum(res.data.adsNum)
        setDiv(res.data.div)
        setLoadingSearch(false)
      }else if(param==='sub'){
        setLoadingSearch(true)
        const res=await http.post(`/ads/more`,{param,paramVal})
        setData(res.data.ads)
        //console.log(res.data.ads)
        setShow(res.data.show)
        setAdsNum(res.data.adsNum)
        setDiv(res.data.div)
        setLoadingSearch(false)
      }
   }

 useEffect(() => {
    getAds()
    }, [paramVal])
   

    //load more ads
const loadMore=async()=>{
    //start spinner
    setLoadingMore(true)
    //increment currentPage
    const Page = currentPage + 1;
      //send data with (Page=currentPage + 1);
      const res=await http.post(`/ads/more`,{param,paramVal,Page})
      //store brought data
      const moreData=res.data.ads;
      //use old data + new data
      setData(prevData=> [...prevData, ...moreData])
      //increment currentPage
      setCurrentPage(Page); // Update current page
      //end spinner
      setLoadingMore(false)
}


    // enlarge image
    const enlargeFun=(src)=>{
        setEnlarge(src)
        document.querySelector('body').style.overflow='hidden';
    }
    // stop enlarge image
    const stopEnlargeFun=()=>{
        setEnlarge('');
        document.querySelector('body').style.overflow='initial';
    }

    
    

    return (
      
        
        <div className='fullheight'>
          {/* enlarge images*/}
          {enlarge && 
             <div className="overlay">
                <img src={enlarge}  alt="k" /> <i onClick={stopEnlargeFun} className="close-btn bi bi-x-square" ></i>
             </div>
          }
                                
            {loadingSearch 
            ? <div className='fullheight d-flex justify-content-center align-items-center'><p className='spinner-border gray large-spinner'></p></div>
            : data&&Array.isArray(data)&&data.length>0
                ?
                    <div  className="container-fluid my-5">
                        <p className="d-inline-block fs-md-6 fs-5">  لافتات في {show} </p> <span className="d-inline-block small">({adsNum})</span> 
                        <div className="row">
                            <div id="sho"  className="d-flex flex-wrap show-wrapper justify-content-around col-sm-12">
                            { Array.isArray(data)&&data.length>0&&data.map((e)=>{ return(
                                <div className='col-xs-12 col-md-4 main2'>
                                    <img  onClick={(e)=>{enlargeFun(e.target.src)}} key={e.item_id} src={baseURL+e.photo} alt={e.NAME} className='w-100 mx-auto d-block img'/> 
                                    <GetCatSubcat cat={e.CAT_ID} sub={e.subcat_id} />
                                    <GetCountryStateCity country={e.country_id} state={e.state_id} city={e.city_id} />
                                    <div className='pe-1 mb-1 fw-bold text-muted text-truncate'>{e.NAME}</div>                                            
                                    <div className='featured-icons-div d-flex px-1 justify-content-between fs-5 fs-md-6'>
                                        <div>
                                            {e.phone != 0 ? <a className='me-3' href={'tel:0'+e.phone}><i class="bi bi-telephone-fill full-tel"></i></a>  : <a className='me-3'><i class="bi bi-telephone-fill empty"></i></a>} 
                                            {e.whatsapp !=0 ? <a className='me-3' href={'https://wa.me/'+code(e.country_id)+e.whatsapp}><i class="bi bi-whatsapp full-whats"></i></a> : <a className='me-3'><i class="bi bi-whatsapp empty"></i></a> } 
                                            {e.website !='' ? <a className='me-3' href={e.website}><i class="bi bi-globe-americas full-globe"></i></a> :  <a className='me-3'><i class="bi bi-globe-americas empty"></i></a>} 
                                            {e.item_email !='' ? <a className='me-3' href={'mailto:'+e.item_email}><i class="bi bi-envelope-at-fill full-env"></i></a> : <a className='me-3'><i class="bi bi-envelope-at-fill empty"></i></a> } 
                                            {e.youtube !='' ? <a className='me-3' href={e.youtube}><i class="bi bi-youtube full-you"></i></a> : <a className='me-3'><i class="bi bi-youtube empty"></i></a> } 
                                        </div>
                                        {loginData ?  (<ShowSaved id={e.item_id} isSaved={savedStatuses[e.item_id] === 'saved'}/>) : (<Link to='/login'><i className='bi bi-heart align-self-center'></i></Link>) }
                                    </div>
                                </div> )}) }
                            </div>
                        </div>
                        {data && data.length>0 
                        ?  div && currentPage<div 
                            ? (<button onClick={loadMore } className="btn btn-info w-fit px-4 mt-3 mx-auto d-block " id="">  {loadingMore ? (<div className='px-4'><p className="spinner-border spinner mb-0" role="status" aria-hidden="true"></p></div>) : (<span> تحميل المزيد</span>)} </button>) 
                            : (<p className="mx-auto w-fit red">نهاية النتائج</p>)
                        : (<span></span>)}
                    </div>    
            
                :<div className='mx-auto w-fit'> لا توجد لافتات </div>
            }
           
        </div>
        
    )
}

export default More
