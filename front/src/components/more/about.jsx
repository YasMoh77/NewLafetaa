import { Link } from 'react-router-dom'
import   './more.css'

const About = () => {
    return (
        <div className='container-fluid min-vh-100 about-container'>

            <p className='mx-auto w-25 fw-bold fs-1 my-5 text-secondary'>موقــع لافتـــة</p>
            <div className='mx-auto w-75 '>
                <p className='mx-auto w-fit fw-bold fs-4 mb-4 text-secondary'>لافتة فكرة مميزة وجديدة للدعايا للأنشطة التجارية والمهن والمنتجات </p>
                <p className='mx-auto w-fit fs-5 mb-4'>الفكرة تهدف لتجميع الأنشطة التجارية واصحاب المهن في مكان واحد واتاحة تعليقات الجمهور المُتعامل معهم لتقييم التجربة واعطاء ثقة للاخرين مما يزيد من الشهرة والرواج</p>
                <p className='mx-auto w-fit fw-bold fs-4 mb-4 text-secondary'>لو انت صاحب نشاط تجاري؛ صاحب مهنه؛ بتقدم خدمات للناس او بتبيع منتجات جديدة</p>
                <p className='mx-auto w-fit fs-5 '>تقدر تضيف لافتة تعرف الناس من خلالها بنشاطك أو بمهنتك</p>
                <button className='border-0 py-2 px-3 rounded-2 white fw-bold add-nav mx-auto w-fit d-block mt-5'>  <Link to='/add' className="nav-link ">أضف لافتة </Link></button>

            </div>
        </div>
    )
}

export default About
