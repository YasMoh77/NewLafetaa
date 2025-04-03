<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\panelController;
use App\Http\Controllers\apiController;
use App\Http\Controllers\apiAds;
use App\Http\Controllers\PayPalController;
//use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use Illuminate\Support\Facades\Crypt;
use Carbon\Carbon;




//control panel
Route::group(['prefix'=>'panel'],function(){
   //count on dashboard
   Route::post('/count-dashboard', [panelController::class,'countDashboard']);
   //get all ads
   Route::get('/ads', [panelController::class,'ads']);
   //approve ad
   Route::post('/approve', [panelController::class,'approve']);
   //approve ad
   Route::post('/return-pending', [panelController::class,'returnPending']);
   //feature-ad
   Route::post('/feature-ad', [panelController::class,'featureAd']);
   //get ad name
   Route::post('get-ad-name/{id}',[panelController::class,'getAdName']); 
   ////////////////users/////////////////
   //get users
   Route::get('/users', [panelController::class,'users']);
   //block users
   Route::post('/block', [panelController::class,'block']);
   //change admin
   Route::post('/change-admin', [panelController::class,'changeAdmin']);
   //delete user
   Route::post('delete/{id}',[panelController::class,'destroy']); //delete certain user 
   //get user name
   Route::post('get-user-name/{id}',[panelController::class,'getUserName']); 
   //////////// country,state ...etc  ///////////////
   //get country,state,city,cat and subcat names
   Route::post('/names', [panelController::class,'names']);
   //get plan requests
   Route::get('/plans', [panelController::class,'plans']);
   //delete plan in plan table
   Route::post('delete-plan/{id}', [panelController::class,'destroyPlan']); 
   ///////comments///////////////
   //get comments
   Route::get('/comments', [panelController::class,'comments']);
   //edit comment
   Route::post('/comment', [panelController::class,'editComment']);
   //delete comment
   Route::post('/delete-comment', [panelController::class,'destroyComment']); 
   ///////replies to comments///////////////
   //get replies
   Route::get('/replies', [panelController::class,'replies']);
   //get comment
   Route::post('/get-comment/{id}', [panelController::class,'getComment']);

});


//show and search 
Route::group([],function () {
   //get featured ads
    Route::get('/home',[apiController::class,'featuredAds']); 
    //add latest ads
    Route::get('/latest',[apiController::class,'latest']); 
    ///////////////search //////////////
    //search on homepage
    Route::post('search',[apiController::class,'search']); 
    //search suggestions on homepage
    Route::post('search-suggestions',[apiController::class,'searchSuggestions']); 
    //search ads on profile
    Route::post('searchWordAds',[apiController::class,'searchWordAds']); 
    //search favourites on profile
    Route::post('searchWordFavourites',[apiController::class,'searchWordFavourites']); 
    //////////////get countries, states and cities///////////////
    Route::post('conts',[apiController::class,'conts']);  
    Route::post('states',[apiController::class,'states']); 
    Route::post('cities',[apiController::class,'cities']); 
    ////////////////categories & subcategories////////////////////
    Route::post('cats',[apiController::class,'cats']); 
    Route::post('subcats',[apiController::class,'subcats']);  
    //login
    Route::post('login',[apiController::class,'login']); //
    //sign up
    Route::post('register',[RegisteredUserController::class,'store']); 
    //user clicks on email link to verify email after register
    Route::get('verify/{email}',[apiController::class,'verify']);
    //user requests new verification email
    Route::post('send-verify',[apiController::class,'sendVerify']);
    //check if verirfied or not
    Route::post('check-verify',[apiController::class,'checkVerify']);
    //user requested to change password
    Route::post('request-reset',[apiController::class,'requestReset']);
    //receive values for password change
    Route::post('reset-password',[apiController::class,'resetPassword']);
    //receive values for password change
    Route::post('package',[apiController::class,'package']);
    //save 
    Route::post('/save',[apiController::class,'saveAd']);
     // check if ad is saved or not
    Route::post('/checkSaved',[apiController::class,'checkSaved']);
    // get favourites
    Route::post('/favourites',[apiController::class,'favourites']);

 });



 //ads
 Route::group(['prefix'=>'ads'],function(){
    //get certain user's ads to show them in their profile
    Route::post('/user',[apiAds::class,'userAds']);
    Route::post('store',[apiAds::class,'store']); 
    Route::get('/cat/{cat}',[apiAds::class,'getCat']);
    Route::get('/sub/{sub}',[apiAds::class,'getSub']);
    //update ads
    Route::post('update',[apiAds::class,'update']); //update certain ads
    //delete ads
    Route::post('delete/{id}',[apiAds::class,'destroy']); //delete certain ads
    //report ad
    Route::post('report-ad',[apiAds::class,'reportAd']); //delete certain ads
    //search certain user ads (in user profile)
    Route::post('/user-search',[apiAds::class,'userSearchAds']);
    //check if owner of the ad is the commentor
    Route::post('/check-ad-owner/{email}/{id}',[apiAds::class,'checkAdOwner']);
    //get category and subcategory for ads
    Route::post('/get-cat-subcat',[apiAds::class,'getCatSubcat']);
    //get country, state and city for ads
    Route::post('/get-country-state-city',[apiAds::class,'getCountryStateCity']);
    //get more ads when clicking on category, subcategory...etc
    Route::post('/more',[apiAds::class,'moreAds']);
    ///////////////comments///////////////
    //check if ad has comments
    Route::post('/check-comments/{id}',[apiAds::class,'checkComments']);
    //insert a new comment
    Route::post('/insert-comment',[apiAds::class,'insertComment']);
    //bring ad comments
    Route::post('/comments/{id}',[apiAds::class,'getAddComments']);
    //update comments & rates
    Route::post('/update-comments-rates',[apiAds::class,'updateCommentsRates']);
    //submit reply
    Route::post('/submit-reply',[apiAds::class,'submitReply']);
    //get count of replies
    Route::post('/get-replies-count/{id}',[apiAds::class,'getRepliesCount']);
    //check comment likes
    Route::post('/check-like-comment',[apiAds::class,'checkLikeComment']);
    //insert comment likes
    Route::post('/insert-like-comment',[apiAds::class,'insertLikeComment']);
    //report comment 
    Route::post('/report-comment',[apiAds::class,'reportComment']);
    
    
    
 });


//get user data on logging 
Route::get('/user',[apiAds::class,'user'])->middleware(['auth:sanctum']); 

/*pay pal*/
/*Route::get('paypalPayment/{plan}/{amount}/{id}/{phone}',[PayPalController::class,'createPayment'])->name('paypal.create');
Route::get('paypalSuccess', [PayPalController::class,'success'])->name('paypal.success');
Route::get('paypalCancel', [PayPalController::class,'cancel'])->name('paypal.cancel');
Route::get('paypalPayment/{plan}/{amount}/{id}/{phone}',[PayPalController::class,'createPayment'])->name('paypal.create');*/
//Route::get('pay',[PayPalController::class,'index']);


Route::get('do',function(){
    $now=Carbon::now();
   $next=$now->copy()->addDays(90);
  echo $now.'<br>';
  echo $next.'<br>';
  if($now>$next){
   echo ' now is bigger<br>';
  }else{
   echo 'next is bigg<br>';
  }
 

});



 