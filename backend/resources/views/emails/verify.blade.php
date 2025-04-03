<html dir="rtl">
   <head>
        <meta charset='UTF-8'>                                              
   </head>
      <body style="direction: rtl">
         <div style="direction: rtl">
             <h1 style="direction: rtl;margin-bottom: 8vh">أهلاً  <?php echo $user['name'] ?></h1>
             <div style="background: #f8c0fa;padding: 2vh 2vw 5vh; border-radius: 1vw;color: #504f4f;">
                  <h2 style="direction: rtl;"> تفعيل بريدك الالكتروني <a href="{{env('FRONTEND_URL')}}"></a> </h2>
                      <br><br>
                  
                   <h2 style="direction: rtl;">اضغط على الرابط أدناه لتفعيل بريدك الالكتروني</h2>
                  
                       <br><br>
                 
                   <h2 style="width:15vw;margin:0 auto 5vh"><a href="{{url('api/verify',['email'=>Crypt::encrypt($user['email'])])}}">اضغط للتفعيل</a></h2>
                 
                       <br><br>
                  
                  <h3 style="direction: rtl;font-weight:bold;">مع تحيات</h3>
                  <h3 style="direction: rtl;font-weight:bold;">فريق موقع لافتة </h3>
                  <br>
             </div>
         </div>
   </body>
</html>
