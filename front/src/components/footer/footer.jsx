import {Link} from 'react-router-dom'
import './footer.css'

const Footer = () => {
    //
    const a=new Date().getFullYear();

    return (
        <>
        <footer id="footer" className="d-md-flex d-sm-block ">
                <div className="para pt-4 px-3 fs-md-4 fs-sm-1">لو انت صاحب نشاط صوّر لافتة نشاطك أو واجهة المكان ولو كنت صاحب مهنه صوّر الكارت الشخصي وأضف لافتة مجانا تكون بمثابة مرجع لك ؛ أضف لافتة الان ودع العالم يتعرف عليك.</div>
                <div className="row row-cols-1 row-cols-md-3  g-4 ">
                    <div className="col">
                    <div className="card h-100">
                        <div className="card-body">
                        <h5 className="card-title mb-4"> معلومات عنا</h5>
                        <Link to='/' className="card-text">الرئيسية </Link>
                        <Link to='/faq' className="card-text">سؤال وجواب </Link>
                        <Link to='/add' className="card-text"> أضف لافتة </Link>
                        </div>
                    </div>
                    </div>
                    <div className="col">
                    <div className="card h-100">
                        <div className="card-body">
                            <h5 className="card-title mb-4"> لافتــة</h5>
                            <Link to='/blog' className="card-text">المدونة </Link>
                            <Link to='/privacy' className="card-text"> سياسة الخصوصية </Link>
                            <Link to='/terms' className="card-text">الشروط والأحكام </Link>
                        </div>
                    </div>
                    </div>
                    <div className="col">
                    <div className="card h-100">
                        <div className="card-body">
                            <h5 className="card-title mb-4"> المزيد</h5>
                            <Link to='/jobs' className="card-text"> وظائف </Link>
                            <Link to='/win' className="card-text"> اربح معنا </Link>
                            <Link to='/contact-us' className="card-text"> اتصل بنا </Link>
                        </div>
                    </div>
                    </div>
                </div>
            </footer>
            <div className="bottom d-flex justify-content-center align-items-center bg-dark">Lafetaa &reg; {a} &ensp; All Rights Reserved</div>                  
        </>
    )
}

export default Footer
