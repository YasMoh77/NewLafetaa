import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';//with Popper.js
import 'bootstrap-icons/font/bootstrap-icons.css';
import Exports from './components/export/export';
import './App.css';



const {Nav,About,Faq,Privacy,Terms,Contact,Jobs,Win,Blog,More,Show,Register,Verify,Verified,Login,RequestReset,Forgetpassword,Profile,Add,Dashboard,Paypal,SuccessPay
  ,SuccessPayExternal,CancelPay,Footer}=Exports;

function App() {
  return (
    <div className="App">
        <Nav/>
          <Routes>
            <Route path="/about"              element={<About/>} />
            <Route path="/faq"                element={<Faq/>} />
            <Route path="/privacy"            element={<Privacy/>} />
            <Route path="/terms"              element={<Terms/>} />
            <Route path="/contact-us"         element={<Contact/>} />
            <Route path="/jobs"               element={<Jobs/>} />
            <Route path="/win"                element={<Win/>} />
            <Route path="/blog"               element={<Blog/>} />
            <Route path="/more"               element={<More/>} />
            <Route path="/"                   element={<Show/>} />
            <Route path="*"                   element={<Show/>} />
            <Route path="/register"           element={<Register/>} />
            <Route path="/verify"             element={<Verify/>} />
            <Route path="/verified"           element={<Verified/>} />
            <Route path="/login"              element={<Login/>} />
            <Route path="/password-reset"     element={<RequestReset/>} />
            <Route path="/forget-password"    element={<Forgetpassword/>} />
            <Route path="/paypal"             element={<Paypal/>} />
            <Route path="/success-pay"             element={<SuccessPay/>} />
            <Route path="/success-pay-external"    element={<SuccessPayExternal/>} />
            <Route path="/add"                     element={<Add/>} />
            <Route path="/dashboard/*"             element={<Dashboard/>} />
            <Route path="/profile/*"              element={<Profile/>} />

          </Routes>
        <Footer/>
    </div>
  );
}

export default App;

