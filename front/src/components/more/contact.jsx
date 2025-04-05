import React from 'react'
import { Link } from 'react-router-dom'

const Contact = () => {

    return (
        <div className='fullheight px-4'>
            <h5> اتصل بنا</h5>
            <div className='pt-2 pb-5'>
                <p>بريد الكتروني</p>
                <Link to='mailto:hgq1100@yahoo.com' > اضغط لارسال رسالة الكترونية  </Link>
            </div>
            <div>
                <p>واتساب</p>
                <Link to='https://wa.me/201020121073'>اضغط لارسال رسالة واتساب </Link>
            </div>
        </div>
    )
}

export default Contact
