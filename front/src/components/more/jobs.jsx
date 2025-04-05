import React from 'react'
import { Link } from 'react-router-dom'

const Jobs = () => {

    return (
        <div className='fullheight px-4'>
            <h5> وظائف  </h5>
            <div className='pt-2 pb-5'>
                <p>يمكنك أن تعمل معنا في موقع لافته عن طريق اضافة لافتات لأنشطة او وظائف او منتجات في محافظتك بمقابل مادي . لاضافة لافتات من محافظتك بمقابل مادي ولمعرفة الشروط ومقدار المقابل المادي تواصل معنا على البريد الالكتروني او الواتس اب </p>
                <Link to='mailto:hgq1100@yahoo.com' > اضغط  للتواصل معنا بالبريد الكتروني  </Link>
                <Link className='d-block my-3' to='https://wa.me/201020121073'>اضغط للتواصل معنا يالواتس اب </Link>
            </div>
            
        </div>
    )
}

export default Jobs
