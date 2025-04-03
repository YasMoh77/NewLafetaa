import React from 'react'

const GetStars = ({e}) => {
    return (
        <>
        {
           e===1
           ?
            <><i className='bi bi-star text-warning'></i><i className='bi bi-star'></i><i className='bi bi-star'></i><i className='bi bi-star'></i><i className='bi bi-star'></i></>
           :(e===2
              ?
              <><i className='bi bi-star text-warning'></i><i className='bi bi-star text-warning'></i><i className='bi bi-star'></i><i className='bi bi-star'></i><i className='bi bi-star'></i></>
              :(e===3
                 ?
                 <><i className='bi bi-star text-warning'></i><i className='bi bi-star text-warning'></i><i className='bi bi-star text-warning'></i><i className='bi bi-star'></i><i className='bi bi-star'></i></>
                 :e===4 
                    ?
                    <><i className='bi bi-star text-warning'></i><i className='bi bi-star text-warning'></i><i className='bi bi-star text-warning'></i><i className='bi bi-star text-warning'></i><i className='bi bi-star'></i></>
                    :<><i className='bi bi-star text-warning'></i><i className='bi bi-star text-warning'></i><i className='bi bi-star text-warning'></i><i className='bi bi-star text-warning'></i><i className='bi bi-star text-warning'></i></> ))
             
        }
            
        </>
    )
}

export default GetStars
