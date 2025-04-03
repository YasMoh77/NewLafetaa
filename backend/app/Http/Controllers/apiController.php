<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Support\Facades\DB;
use App\Models\Plan;
use App\Models\Ad;
use App\Models\User; 
use App\Models\Favourite;  
use App\Models\Category;
use App\Models\subCategory;
use App\Models\Country;
use App\Models\State;
use App\Models\City;
use App\Events\VerifyEvent;
use Illuminate\Support\Facades\Crypt;
use Carbon\Carbon;
use App\Events\ResetPassEvent;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;



class apiController extends Controller
{
    
    //when user clicks on a link sent to their email     
    public function verify($email)
    {
        //decrypt encrypted email
        $email = Crypt::decrypt($email);
       // check user
       $found= User::where('email',$email)->first();

       $cc=Carbon::now();
       if($found){
           User::where('email',$email)->update(['email_verified_at'=> $cc ]);
           return redirect('http://localhost:3000/verified');
       }
    }



    //respond to user request and send him verification email again 
    public function sendVerify(Request $request) 
    {
      $user['name']=$request->nameRegister;
      $user['email']=$request->emailRegister;
      event(new VerifyEvent($user));
      //send response
      return response()->json(['message'=>'تم ارسال رسالة أخرى']);
    }



    //check if user is verified or not
    public function checkVerify(Request $request)
    {
        $email=$request->emailRegister;
        $found= User::where('email',$email)->value('email_verified_at');
        if($found!=null){
             return response()->json([
                 'message'=>'verified'
             ]);
             return redirect('http://localhost:3000/verified');

        }else{
            return response()->json([
                'message'=>'not verified'
            ]);
            return redirect('http://localhost:3000/verified');
        }
    }
    


       //user requested to change password
    public function requestReset(Request $request)
    {
       $email=$request->email;
       $found=User::where('email',$email)->value('id');
       if($found>0){
             return response()->json([
                 'message'=>'user found',
                 'emailReset'=>$email
             ]);
       }
       return response()->json([
        'message'=>'هذا المستخدم غير مسجل لدينا',
       ]);
    }



   //reset password - receive values for password change
    public function resetPassword(Request $request)
    {
        $request->validate([
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);
       
       $newPass=Hash::make($request->password);
       $done= User::where('email',$request->emailReset)->update(['password'=>$newPass]);
       
       //response
       if($done){
            return response()->json([
                'message'=>'تم تعديل كلمة المرور'
            ]);
        }

    }



    //log the user in
    public function login(Request $request)
    {
    
     $validator = Validator::make($request->all(),[
        'email'     => 'required|string',
        'password'  => 'required|string'
      ]);
        //if wrong data
        if ($validator->fails()) {
            return response()->json(['message' =>'خطأ في البريد الالكتروني أو كلمة المرور']);
        }
        
        //attempt login
        $credentials    =   $request->only('email', 'password');
        if (! Auth::attempt($credentials)) {
            return response()->json([
                'message' => 'بيانات الدخول غير صحيحة'
            ]);
        }

        //create token
        $user   = User::where('email', $request->email)->firstOrFail();
        $token  = $user->createToken('auth_token')->plainTextToken;
        
        $authData=[];
        $authData['token']=$token;
        $authData['token_type']='Bearer';

        return response()->json([
            'message'       => 'تم تسجيل الدخول بنجاح',
            'authData' => $authData,
        ]);
      
    }



    
    //show featured ads on homepage
    public function featuredAds() 
    {  
        $now=Carbon::now();
       //get 8 featured ads only
        $featured=Ad::where('feature',2)->where('plan_until','>',$now)->orderBy('plan_until','DESC')->limit(8)->get();
        //if there are featured ads, send them in an array
        if($featured){
            return response()->json([
                'featured'=>$featured
            ]);
            //or send empty array
        }else{
            return response()->json([
            'featured'=>[]
            ]);
        }
    }

   
    //get 9 latest ads (ordinary not featured)
    public function latest() 
    {
       $latest= Ad::orderBy('item_id','DESC')->limit(9)->get();
       return json_encode($latest);
    }


    //choose package
    public function package(Request $request)
    {   
         //now
         $now=Carbon::now();
         $ninetyDays= $now->copy()->addDays(90);
        //admin sent the promotion request from admin panel(admin/routes/Ads.jsx)
        if($request->adminChange){  
            $request->plan==1? $featured='Featured successfully to Gold' : ($request->plan==2 ? $featured='Featured successfully to Silver' : $featured='Plans cancelled');
            $found=Ad::where('item_id',$request->id)->first();

            //if this ad is still there
            if($found){          
                    if($request->plan==1){//make gold
                        Ad::where('item_id',$request->id)->update(['gold'=>1,'silver'=>0,'feature'=>2,'plan_until'=>$ninetyDays]);
                    }elseif($request->plan==2){ //make silver
                        Ad::where('item_id',$request->id)->update(['gold'=>0,'silver'=>1,'feature'=>1,'plan_until'=>$ninetyDays]);
                    }else{ //cancel plans
                         Ad::where('item_id',$request->id)->update(['gold'=>0,'silver'=>0,'feature'=>0]);
                    }
                    return response()->json(['notice'=>'success','message'=>$featured]);
              }else{return response()->json(['notice'=>'fail','message'=>'SORRY, Item NOT found']);}

         //user sent the promotion request     
        }else{  
            $adDetail= Ad::where('item_id',$request->id)->first();
            $name=$adDetail->NAME;
            $feature=$adDetail->feature;

            //get name of category
            if($adDetail->CAT_ID==1){$cat='activities';}elseif($adDetail->CAT_ID==2){$cat='jobs';}
            elseif($adDetail->CAT_ID==3){$cat='products & services';} elseif($adDetail->CAT_ID==4){$cat='occasions';}
            elseif($adDetail->CAT_ID==5){$cat='wanted';} elseif($adDetail->CAT_ID==6){$cat='lost';}
            //status
            if($adDetail->approve==1){$status='shown';} else{$status='pending';}
            //chosenPlan
            $chosenPlan=$request->plan==1 ? 'GOLD' : 'SILVER';
            //user name
            $userName=User::where('id',$adDetail->USER_ID)->value('name');
            //pay method
            if($request->pay==1){$pay_method='vodafone';} elseif($request->pay==2){$pay_method='bank';}
            //price
            $price=$request->plan==1 && $feature==0 ? 300 : ($request->plan==1 && $feature==1 ? 150 : 150);
            // check if ad has roq in plan table
            $foundPlan= Plan::where('item_id',$request->id)->first();
            //sterilize phone field
            $phone=strip_tags($request->input('phone'));
            //prepare to insert
            $planTable=new Plan();

          //there's already a previous request to promote ad 
         if($foundPlan){ 
                return response()->json(['message'=>'تم تقديم طلب تمييز من قبل وجاري فحصه']);
            // no previous request made
            }else{  
                if($feature==0){ //ad has no plan
                        if($request->pay==1||$request->pay==2){ //1=vodafone cash, 2=//bank transfer
                            //insert in plan table
                               $planTable->item_id=$request->id;  $planTable->ad_cat=$cat;
                                $planTable->ad_title=$adDetail->NAME; $planTable->ad_date=$adDetail->item_date;
                                $planTable->ad_status=$status; $planTable->ad_chosenplan=$chosenPlan;
                                $planTable->ad_username=$userName; $planTable->ad_userphone=$phone;
                                $planTable->pay_method=$pay_method;  $planTable->order_date=$now;
                            $planTable->save();
                            //return data
                            if($request->pay==1){
                                   return response()->json(['success'=>'success', 'tameezPay' =>'vodafone', 'tameezPlan' =>$request->plan, 'tameezPhone' => $phone, 'tameezName'=>$name, 'tameezPrice'=>$price ]);
                            }elseif($request->pay==2){
                                   return response()->json(['success'=>'success', 'tameezPay' =>'bank', 'tameezPlan' =>$request->plan, 'tameezPhone' => $phone, 'tameezName'=>$name, 'tameezPrice'=>$price ]);
                            }
                        //pay pal
                        }elseif($request->pay==3){ 
                           // return response()->json(['redirectPaypal' =>'redirectPaypal', 'price'=>$price ]);
                            //visa 
                        }elseif($request->pay==4){ 
                           // return response()->json(['redirectVisa' =>'redirectVisa' ]);                
                        }

                //feature==1 means already has silver plan, $request->plan==2 means user wants silver plan
                }elseif($feature==1 && $request->plan==2){ 
                    return response()->json(['message'=>'مميز بالفعل بالباقة الفضية']);

                //feature==1 means already has silver plan, $request->plan==1 means user wants gold plan(with silver plan but wants to upgrade to gold plan)
                }elseif($feature==1 && $request->plan==1){ 
                        // insert in plan table and return response
                        if($request->pay==1||$request->pay==2){ //1=vodafone cash, 2=//bank transfer
                               //insert in plan table
                                $planTable->item_id=$request->id;  $planTable->ad_cat=$cat;
                                $planTable->ad_title=$adDetail->NAME; $planTable->ad_date=$adDetail->item_date;
                                $planTable->ad_status=$status; $planTable->ad_chosenplan=$chosenPlan;
                                $planTable->ad_username=$userName; $planTable->ad_userphone=$phone;
                                $planTable->pay_method=$pay_method;  $planTable->order_date=$now;
                            $planTable->save();
                            //return data
                            if($request->pay==1){
                                    return response()->json(['success'=>'success', 'tameezPay' =>'vodafone', 'tameezPlan' =>$request->plan, 'tameezPhone' => $phone, 'tameezName'=>$name, 'tameezPrice'=>$price ]);
                            }elseif($request->pay==2){
                                    return response()->json(['success'=>'success', 'tameezPay' =>'bank', 'tameezPlan' =>$request->plan, 'tameezPhone' => $phone, 'tameezName'=>$name, 'tameezPrice'=>$price ]);
                            }
                         //pay pal 
                        }elseif($request->pay==3){ 
                           // return response()->json(['redirectPaypal' =>'redirectPaypal', 'price'=>$price  ]);
                           //visa 
                        }elseif($request->pay==4){ 
                           // return response()->json(['redirectVisa' =>'redirectVisa' ]);                
                        }
                 
                 //feature==1 means silver plan, $request->plan==2 means silver plan
                }elseif($feature==2 && $request->plan==1 || $feature==2 && $request->plan==2){ 
                    return response()->json(['message'=>'مميز بالفعل بالباقة الذهبية']);
                }
            }
        }//end if
    }




    //saved ad
    public function saveAd(Request $request)
    {
      $id=$request->id;
      $user_id=User::where('email',$request->userEmail)->value('id');

      //check if ad is found or deleted
      $found=Ad::where('item_id',$id)->first();
      if ($found) {
         //check if ad was added to favourite before
         $favourited=Favourite::where(['item_id'=>$id,'user_id'=>$user_id])->first();
        
         if($favourited){ //if it was added to favourites, delete it           
            Favourite::where(['item_id'=>$id,'user_id'=>$user_id])->delete();
         }else{ 
             //add new favourite ad
             $favourite=new Favourite();
             $favourite->item_id=$id;
             $favourite->user_id=$user_id;
             $favourite->save();
             return response()->json(['message'=>'saved']);
         }       
      }
    }


    //check
    public function checkSaved(Request $request)
    {
       
       $itemIds = $request->itemIds;
       $user_id = User::where('email', $request->userEmail)->value('id');

        // Check if each item was added to favourites before
        $favourites = Favourite::where('user_id', $user_id)
                           ->whereIn('item_id', $itemIds)
                           ->get();

        // Create a response array
        $response = [];
        foreach ($itemIds as $id) {
        $favourited = $favourites->firstWhere('item_id', $id);
        //return saved if $favourited, else unsaved
        $response[$id] = $favourited ? 'saved' : 'unsaved';        
    }

    return response()->json(['message' => $response]);
    }


    //get user's favourite ads
    public function favourites(Request $request)
    {
       $adsPerPage = 6; // Number of ads per page
       $pageNum=$request->Page ? $request->Page : 1;
       $startFrom = ($pageNum - 1) * $adsPerPage;
       // get user id
       $user=User::where('email',$request->email)->value('id');
       //gather favorite ads
       $favouriteAds=Favourite::where('user_id',$user)->pluck('item_id')->toArray();
       if($favouriteAds){
            $placeholders=implode(',',array_fill(0,count($favouriteAds),'?'));
            //query
            $query="
                    SELECT * from ads
                    where  approve=1 and item_id IN ($placeholders)
                    ORDER BY feature DESC, item_id DESC  
                    LIMIT ?, ? ";
            //bindings
            $bindings=array_merge($favouriteAds,[ $startFrom,$adsPerPage]);
            $data=DB::select($query,$bindings);
            // get ads number
            $adsTotalNumber=Ad::where(['USER_ID'=>$user,'approve'=>1])->whereIn('item_id',$favouriteAds)->count();
            //return response
                if(empty($data)){
                    $response = [
                        'data' => $data=[],
                        'free'=>' نتائج البحث ',
                        'msg'=>'لا توجد نتائج بحث',
                        'adsNum' => ' الاعلانات المحفوظة: 0',
                    ];
                    return response()->json($response);

                }else{
                    $response = [
                        'data' => $data,
                        'div' => ($adsTotalNumber/6),
                        'free'=>'  نتائج البحث ',
                        'adsNum' => ' الاعلانات المحفوظة: '.$adsTotalNumber,
                        ];
                    return response()->json($response);       
                } 
       }else{
            $response = [
                'data' => $data=[],
                'free'=>' نتائج البحث ',
                'msg'=>'لا توجد نتائج بحث',
                'adsNum' => ' الاعلانات المحفوظة: 0',
            ];
            return response()->json($response);
       }

    }

    
    //searched ads in homepage
    public function search(Request $request)
    {
        //if($key==123){
       $adsPerPage = 6; // Number of ads per page
       $pageNum=$request->Page ? $request->Page : 1;
       $startFrom = ($pageNum - 1) * $adsPerPage;// Starting point for pagination
       $searchWord=$request->search;
       //prepare query
       $searchQuery = "AND ((NAME LIKE ? OR NAME LIKE ?) OR (description2 LIKE ? OR description2 LIKE ?))";
       $bindSearchQuery = ["%$searchWord%", "%$searchWord", "%$searchWord%", "%$searchWord"];
       //handle cat & subcat
       $cat=$request->catValue>0?'AND CAT_ID = ?':'AND CAT_ID > 0';
       $subcat=$request->subcatValue>0?'AND subcat_id = ?':'AND subcat_id > 0';

       if( $request->countryValue>0 && $request->stateValue>0  && $request->cityValue>0){
        // Fetch paginated results using raw SQL query with Laravel DB facade
            $query = "
                SELECT * FROM ads
                WHERE country_id = ?
                AND state_id = ?
                AND city_id = ?
                $cat
                $subcat
                AND approve = 1 
                $searchQuery 
                ORDER BY feature DESC, plan_until DESC, item_id DESC  
                LIMIT ?,?
            ";
            //bind values with or without cat & subcat
            $bindings=[];
            if($request->catValue==0&&$request->subcatValue==0){
                $bindings=array_merge([$request->countryValue],[$request->stateValue],[$request->cityValue],$bindSearchQuery,[$startFrom],[$adsPerPage]);
            }elseif($request->catValue>0&&$request->subcatValue>0){
                $bindings=array_merge([$request->countryValue],[$request->stateValue],[$request->cityValue],[$request->catValue],[$request->subcatValue],$bindSearchQuery,[$startFrom],[$adsPerPage]);
            }elseif($request->catValue>0&&$request->subcatValue==0){
                $bindings=array_merge([$request->countryValue],[$request->stateValue],[$request->cityValue],[$request->catValue],$bindSearchQuery,[$startFrom],[$adsPerPage]);
            }elseif($request->catValue==0&&$request->subcatValue>0){
                $bindings=array_merge([$request->countryValue],[$request->stateValue],[$request->cityValue],[$request->subcatValue],$bindSearchQuery,[$startFrom],[$adsPerPage]);
            }

            $data=DB::select($query,$bindings);
            
             // get the total number of ads             
            if($request->search){ //if user used word search
                    $queryNum = DB::table('ads')
                    ->where('approve', 1)
                    ->where(['country_id'=> $request->countryValue,'state_id'=> $request->stateValue,'city_id'=>$request->cityValue])
                    ->where(function($quer) use ($searchWord){
                        $quer->where('NAME','LIKE','%'.$searchWord.'%')
                            ->orWhere('NAME','LIKE','%'.$searchWord)
                            ->orWhere('description2','LIKE','%'.$searchWord.'%')
                            ->orWhere('description2','LIKE','%'.$searchWord);
                    });
                    if($request->catValue>0&&$request->subcatValue==0){
                        $queryNum->where(['CAT_ID'=>$request->catValue]);
                    }elseif($request->subcatValue>0&&$request->catValue==0){
                        $queryNum->where(['subcat_id'=>$request->subcatValue]);
                    }elseif($request->catValue>0&&$request->subcatValue>0){
                        $queryNum->where(['CAT_ID'=>$request->catValue,'subcat_id'=>$request->subcatValue]);
                    }
                    //count
                    $adsTotalNumber=$queryNum->count();

            }else{
                    if($request->catValue>0&&$request->subcatValue==0){
                        $adsTotalNumber = DB::table('ads')->where(['country_id'=> $request->countryValue,'state_id'=> $request->stateValue,'city_id'=> $request->cityValue,'CAT_ID'=>$request->catValue])->where('approve', 1)->count();
                    }elseif($request->subcatValue>0&&$request->catValue==0){
                        $adsTotalNumber = DB::table('ads')->where(['country_id'=> $request->countryValue,'state_id'=> $request->stateValue,'city_id'=> $request->cityValue,'subcat_id'=>$request->subcatValue])->where('approve', 1)->count();
                    }elseif($request->catValue>0&&$request->subcatValue>0){
                        $adsTotalNumber = DB::table('ads')->where(['country_id'=> $request->countryValue,'state_id'=> $request->stateValue,'city_id'=> $request->cityValue,'CAT_ID'=>$request->catValue,'subcat_id'=>$request->subcatValue])->where('approve', 1)->count();
                    }elseif($request->catValue==0&&$request->subcatValue==0){
                        $adsTotalNumber = DB::table('ads')->where(['country_id'=> $request->countryValue,'state_id'=> $request->stateValue,'city_id'=> $request->cityValue])->where('approve', 1)->count();
                    }
            }
           

      }elseif( $request->countryValue>0 &&  $request->stateValue>0  && $request->cityValue==0){
            // Fetch paginated results 
            $query = "
            SELECT * FROM ads
            WHERE country_id = ?
            AND state_id = ?
            AND city_id > 0
            $cat
            $subcat
            AND approve = 1 
            $searchQuery 
            ORDER BY feature DESC, plan_until DESC, item_id DESC  
            LIMIT ?,?
            ";

        //bind values with or without cat & subcat
        $bindings=[];
        if($request->catValue==0&&$request->subcatValue==0){
            $bindings=array_merge([$request->countryValue],[$request->stateValue],$bindSearchQuery,[$startFrom],[$adsPerPage]);
        }elseif($request->catValue>0&&$request->subcatValue>0){
            $bindings=array_merge([$request->countryValue],[$request->stateValue],[$request->catValue],[$request->subcatValue],$bindSearchQuery,[$startFrom],[$adsPerPage]);
        }elseif($request->catValue>0&&$request->subcatValue==0){
            $bindings=array_merge([$request->countryValue],[$request->stateValue],[$request->catValue],$bindSearchQuery,[$startFrom],[$adsPerPage]);
        }elseif($request->catValue==0&&$request->subcatValue>0){
            $bindings=array_merge([$request->countryValue],[$request->stateValue],[$request->subcatValue],$bindSearchQuery,[$startFrom],[$adsPerPage]);
        }

        $data=DB::select($query,$bindings);

      // get the total number of ads 
        if($request->search){ //if user used word search
            $queryNum = DB::table('ads')
            ->where('approve', 1)
            ->where(['country_id'=> $request->countryValue,'state_id'=> $request->stateValue])
            ->where(function($quer) use ($searchWord){
                $quer->where('NAME','LIKE','%'.$searchWord.'%')
                    ->orWhere('NAME','LIKE','%'.$searchWord)
                    ->orWhere('description2','LIKE','%'.$searchWord.'%')
                    ->orWhere('description2','LIKE','%'.$searchWord);
            });
            if($request->catValue>0&&$request->subcatValue==0){
                $queryNum->where(['CAT_ID'=>$request->catValue]);
            }elseif($request->subcatValue>0&&$request->catValue==0){
                $queryNum->where(['subcat_id'=>$request->subcatValue]);
            }elseif($request->catValue>0&&$request->subcatValue>0){
                $queryNum->where(['CAT_ID'=>$request->catValue,'subcat_id'=>$request->subcatValue]);
            }
            //count
            $adsTotalNumber=$queryNum->count();
          
        }else{
                if($request->catValue>0&&$request->subcatValue==0){
                    $adsTotalNumber = DB::table('ads')->where(['country_id'=> $request->countryValue,'state_id'=> $request->stateValue,'CAT_ID'=>$request->catValue])->where('approve', 1)->count();
                }elseif($request->subcatValue>0&&$request->catValue==0){
                    $adsTotalNumber = DB::table('ads')->where(['country_id'=> $request->countryValue,'state_id'=> $request->stateValue,'subcat_id'=>$request->subcatValue])->where('approve', 1)->count();
                }elseif($request->catValue>0&&$request->subcatValue>0){
                    $adsTotalNumber = DB::table('ads')->where(['country_id'=> $request->countryValue,'state_id'=> $request->stateValue,'CAT_ID'=>$request->catValue,'subcat_id'=>$request->subcatValue])->where('approve', 1)->count();
                }elseif($request->catValue==0&&$request->subcatValue==0){
                    $adsTotalNumber = DB::table('ads')->where(['country_id'=> $request->countryValue,'state_id'=> $request->stateValue])->where('approve', 1)->count();
                }
         }       

     } elseif( $request->countryValue>0 && $request->stateValue==0 && $request->cityValue==0){
        // Fetch paginated results 
            $query = "
            SELECT * FROM ads
            WHERE country_id = ?
            AND state_id > 0
            AND city_id > 0
            $cat
            $subcat
            AND approve = 1 
            $searchQuery 
            ORDER BY feature DESC, plan_until DESC, item_id DESC  
            LIMIT ?,?
        ";

        //bind values with or without cat & subcat
        $bindings=[];
        if($request->catValue==0&&$request->subcatValue==0){
            $bindings=array_merge([$request->countryValue],$bindSearchQuery,[$startFrom],[$adsPerPage]);
        }elseif($request->catValue>0&&$request->subcatValue>0){
            $bindings=array_merge([$request->countryValue],[$request->catValue],[$request->subcatValue],$bindSearchQuery,[$startFrom],[$adsPerPage]);
        }elseif($request->catValue>0&&$request->subcatValue==0){
            $bindings=array_merge([$request->countryValue],[$request->catValue],$bindSearchQuery,[$startFrom],[$adsPerPage]);
        }elseif($request->catValue==0&&$request->subcatValue>0){
            $bindings=array_merge([$request->countryValue],[$request->subcatValue],$bindSearchQuery,[$startFrom],[$adsPerPage]);
        }
        
        $data=DB::select($query,$bindings);

        // get the total number of ads 
       if($request->search){ //if user used word search
            $queryNum = DB::table('ads')
            ->where('approve', 1)
            ->where(['country_id'=> $request->countryValue])
            ->where(function($quer) use ($searchWord){
                $quer->where('NAME','LIKE','%'.$searchWord.'%')
                    ->orWhere('NAME','LIKE','%'.$searchWord)
                    ->orWhere('description2','LIKE','%'.$searchWord.'%')
                    ->orWhere('description2','LIKE','%'.$searchWord);
            });
            if($request->catValue>0&&$request->subcatValue==0){
                $queryNum->where(['CAT_ID'=>$request->catValue]);
            }elseif($request->subcatValue>0&&$request->catValue==0){
                $queryNum->where(['subcat_id'=>$request->subcatValue]);
            }elseif($request->catValue>0&&$request->subcatValue>0){
                $queryNum->where(['CAT_ID'=>$request->catValue,'subcat_id'=>$request->subcatValue]);
            }
            //count
            $adsTotalNumber=$queryNum->count();

       }else{
            if($request->catValue>0&&$request->subcatValue==0){
                $adsTotalNumber = DB::table('ads')->where(['country_id'=> $request->countryValue,'CAT_ID'=>$request->catValue])->where('approve', 1)->count();
            }elseif($request->subcatValue>0&&$request->catValue==0){
                $adsTotalNumber = DB::table('ads')->where(['country_id'=> $request->countryValue,'subcat_id'=>$request->subcatValue])->where('approve', 1)->count();
            }elseif($request->catValue>0&&$request->subcatValue>0){
                $adsTotalNumber = DB::table('ads')->where(['country_id'=> $request->countryValue,'CAT_ID'=>$request->catValue,'subcat_id'=>$request->subcatValue])->where('approve', 1)->count();
            }elseif($request->catValue==0&&$request->subcatValue==0){
                $adsTotalNumber = DB::table('ads')->where(['country_id'=> $request->countryValue])->where('approve', 1)->count();
            }
       }

    } elseif( $request->countryValue==0 && $request->stateValue==0 && $request->cityValue==0){
        // Fetch results 
            $query = "
            SELECT * FROM ads
            WHERE country_id > 0
            AND state_id > 0
            AND city_id > 0
            $cat
            $subcat
            AND approve = 1 
            $searchQuery 
            ORDER BY feature DESC, plan_until DESC, item_id DESC  
            LIMIT ?,?
           ";

        //bind values with or without cat & subcat
        $bindings=[];
        if($request->catValue==0&&$request->subcatValue==0){
            $bindings=array_merge($bindSearchQuery,[$startFrom],[$adsPerPage]);
        }elseif($request->catValue>0&&$request->subcatValue>0){
            $bindings=array_merge([$request->catValue],[$request->subcatValue],$bindSearchQuery,[$startFrom],[$adsPerPage]);
        }elseif($request->catValue>0&&$request->subcatValue==0){
            $bindings=array_merge([$request->catValue],$bindSearchQuery,[$startFrom],[$adsPerPage]);
        }elseif($request->catValue==0&&$request->subcatValue>0){
            $bindings=array_merge([$request->subcatValue],$bindSearchQuery,[$startFrom],[$adsPerPage]);
        }
        
        $data=DB::select($query,$bindings);

        // get the total number of ads 
       if($request->search){ //if user used word search
            $queryNum = DB::table('ads')
            ->where('approve', 1)
            ->where(function($quer) use ($searchWord){
                $quer->where('NAME','LIKE','%'.$searchWord.'%')
                    ->orWhere('NAME','LIKE','%'.$searchWord)
                    ->orWhere('description2','LIKE','%'.$searchWord.'%')
                    ->orWhere('description2','LIKE','%'.$searchWord);
            });
            if($request->catValue>0&&$request->subcatValue==0){
                $queryNum->where(['CAT_ID'=>$request->catValue]);
            }elseif($request->subcatValue>0&&$request->catValue==0){
                $queryNum->where(['subcat_id'=>$request->subcatValue]);
            }elseif($request->catValue>0&&$request->subcatValue>0){
                $queryNum->where(['CAT_ID'=>$request->catValue,'subcat_id'=>$request->subcatValue]);
            }
            //count
            $adsTotalNumber=$queryNum->count();

       }else{
            if($request->catValue>0&&$request->subcatValue==0){
                $adsTotalNumber = DB::table('ads')->where(['CAT_ID'=>$request->catValue])->where('approve', 1)->count();
            }elseif($request->subcatValue>0&&$request->catValue==0){
                $adsTotalNumber = DB::table('ads')->where(['subcat_id'=>$request->subcatValue])->where('approve', 1)->count();
            }elseif($request->catValue>0&&$request->subcatValue>0){
                $adsTotalNumber = DB::table('ads')->where(['CAT_ID'=>$request->catValue,'subcat_id'=>$request->subcatValue])->where('approve', 1)->count();
            }elseif($request->catValue==0&&$request->subcatValue==0){
                $adsTotalNumber = DB::table('ads')->where('approve', 1)->count();
            }
       }
     } 
    
    
     if(empty($data)){
            $response = [
                'data' => $data=[],
                'free'=>' نتائج البحث ',
                'msg'=>'لا توجد نتائج بحث',
                'adsNum' => 'عدد الاعلانات: 0'
                ];
            return response()->json($response);
       }else{
            $response = [
                'data' => $data,
                'div' => ($adsTotalNumber/6),
                'free'=>'  نتائج البحث ',
                'adsNum' => 'عدد الاعلانات: '.$adsTotalNumber,
                'word'=>$request->search
                ];
            return response()->json($response);       
       }                 
    }//end search


    //searchSuggestions on home page
    public function searchSuggestions(Request $request)
    {
        $term = $request->input('text', '');
        if(mb_strlen($term)<1){
              return response()->json([]);
        }
        $resultName= Ad::selectRaw('DISTINCT SUBSTRING(NAME,LOCATE(?,NAME), LENGTH(?) + 15) AS suggestion,feature,item_id', [$term,$term])
        ->where('NAME', 'LIKE', '%'.$term.'%');
        $resultDesc= Ad::selectRaw('DISTINCT SUBSTRING(description2,LOCATE(?,description2), LENGTH(?) + 15) AS suggestion,feature,item_id', [$term,$term])
        ->where('description2', 'LIKE', '%'.$term.'%');
        $result=$resultName->Union($resultDesc)
   
        ->limit(15)
        ->orderBy('feature','desc')
        ->orderBy('item_id','desc')
        ->get();
        if($result){
            return response()->json(['result'=>$result]);
        }else{
            return response()->json([]);
        }
    }
    
    /*
        // MySQL-compatible word boundary search
        $results = Ad::where(function($query) use ($term) {
                // For NAME field
                $query->where(function($q) use ($term) {
                    $q->where('NAME', 'like', $term.'%')    // Start of string
                      ->orWhere('NAME', 'like', '%'.$term.'%')  // Middle of string
                      ->orWhere('NAME', 'like', '%'.$term)  // End of string
                      ->orWhere('NAME', '=', $term);        // Exact match
                })
                // For description2 field
                ->orWhere(function($q2) use ($term) {
                    $q2->where('description2', 'like', $term.'%')
                      ->orWhere('description2', 'like', '%'.$term.'%')
                      ->orWhere('description2', 'like', '%'.$term)
                      ->orWhere('description2', '=', $term);
                });
            })
            ->limit(5)
            ->get(['NAME', 'description2']);
    
    */



    //search user's ads in profile using input
    public function searchWordAds(Request $request)
    {
       $adsPerPage = 6; // Number of ads per page
       $pageNum=$request->Page ? $request->Page : 1;
       $startFrom = ($pageNum - 1) * $adsPerPage;// Starting point for pagination
       //if email is found, search based on user id
       $user=User::where('email',$request->email)->value('id');
        //use this query to match search word
       $word=$request->word;
       $query=$request->word  ? "AND ads.NAME LIKE '%$request->word%' OR ads.NAME LIKE '%$request->word' " : ''; //
       //////////
       // Fetch paginated results using raw SQL query with Laravel DB facade
            $data = DB::select("
            SELECT * FROM ads where approve = 1 
            and USER_ID= :user
            $query
            ORDER BY feature DESC, item_id DESC  
            LIMIT :startFrom, :adsPerPage
            ", [
            'user' => $user,
            'startFrom' => $startFrom,
            'adsPerPage' => $adsPerPage
            ]);

            // Optionally, get the total number of ads if you need it for pagination or other logic
            $word 
            ?  $adsTotalNumber = DB::table('ads')->where(function($q) use($word){
                $q->where('NAME','LIKE','%'.$word.'%')->orWhere('NAME','LIKE','%'.$word);
            })->where(['approve'=> 1,'USER_ID'=>$user])->count()
            :  $adsTotalNumber = DB::table('ads')->where('approve', 1)->count()   ; //
            
       if(empty($data)){
            //no search result
            $data=[];
            $msg='لا توجد نتائج بحث';
            $adsTotalNumber=0;
            $response = [
                'userAds' => $data,
                'free'=>' نتائج البحث ',
                'msg'=>$msg,
                'adsNum' => 'عدد الاعلانات: '.$adsTotalNumber,
                ];
                
            return response()->json($response);
        //search result
        }else{
            $response = [
                'userAds'=>$data,
                'div' => ($adsTotalNumber/6),
                'free'=>'  نتائج البحث ',
                'adsNum' => 'عدد الاعلانات: '.$adsTotalNumber,
                'word'=>$request->word
                ];
                
            return response()->json($response);       
        }  
    }


    //////////&&&&&&&&&&&&&&&&&&&&
    //search user's favourites in profile using input
    public function searchWordFavourites(Request $request)
    {
       $adsPerPage = 6; // Number of ads per page
       $pageNum=$request->Page ? $request->Page : 1;
       $startFrom = ($pageNum - 1) * $adsPerPage;// Starting point for pagination
       //if email is found, search based on user id
       $user=User::where('email',$request->email)->value('id');
       //gather all favourite ads
       $favouriteAds=Favourite::where('user_id',$user)->pluck('item_id')->toArray();
       //prepare for query
       $placeholders=implode(',',array_fill(0,count($favouriteAds),'?'));
       //use this query to match search word
       $word=$request->word;
       $searchCondition="AND (NAME LIKE ? OR NAME LIKE ?) ";
       $searchBindings=["%$word%","%$word"];
       //$query=$request->word  ? "AND NAME LIKE '%$request->word%' OR NAME LIKE '%$request->word' " : ''; //
       
       //search user's favourites in profile using input & Fetch paginated results using raw SQL query with Laravel DB facade
        $query="
        SELECT * FROM ads where approve = 1 
        and item_id IN ($placeholders) 
        $searchCondition
        ORDER BY feature DESC, item_id DESC  
        LIMIT ?, ?";
        $bindings=array_merge($favouriteAds,$searchBindings,[$startFrom,$adsPerPage]);
        $data = DB::select($query,$bindings);

        // get the total number of ads 
        $word 
        ?  $adsTotalNumber = Ad::where(function($q) use($word){
            $q->where('NAME','LIKE','%'.$word.'%')->orWhere('NAME','LIKE','%'.$word);
        })->where(['approve'=> 1,'USER_ID'=>$user])->whereIn('item_id',$favouriteAds)->count()
        :  $adsTotalNumber = Ad::where(['approve'=> 1,'USER_ID'=>$user])->whereIn('item_id',$favouriteAds)->count()   ; //
          
       if(empty($data)){
            //no search result
            $data=[];
            $msg='لا توجد نتائج بحث';
            $adsTotalNumber=0;
            $response = [
                'favourites' => $data,
                'free'=>' نتائج البحث ',
                'msg'=>$msg,
                'adsNum' => 'عدد الاعلانات: '.$adsTotalNumber,
                ];

            return response()->json($response);
        //search result
        }else{
            $response = [
                'favourites' => $data,
                'div' => ($adsTotalNumber/6),
                'free'=>'  نتائج البحث ',
                'adsNum' => 'عدد الاعلانات: '.$adsTotalNumber,
                'word'=>$request->word
                ];
               
            return response()->json($response);       
        }  
    }


    //get cats
    public function cats(Request $request)
    {
        $data=Category::where('cat_id','<',4)->get();//get the first 3 categories 
        return response()->json($data); // send JSON response
    }

    //get subcats
    public function subcats(Request $request)
    {   
        if ($request->id > 0 ) {
            $subCats=SubCategory::where('cat_id',$request->id)->orderBy('ordering')->get();
            return response()->json($subCats); // send JSON response
        }else{
            return response()->json([]);
        }
    }



    //get countries
    public function conts(Request $request)
    {
        $countries=Country::all();
        return response()->json($countries); // send JSON response
    }


    //get states
    public function states(Request $request)
     {
        if ($request->cont > 0 ) {
            $states=State::where('country_id',$request->cont)->get();
            return response()->json($states); // send JSON response
        }
        return response()->json([]); // if cont=0, send empty array
     }


     //get cities
    public function cities(Request $request)
    {
        if ($request->state > 0 ) {
            $cities=City::where('state_id',$request->state)->get();
            return response()->json($cities); // send JSON response
        }
          return response()->json([]); // 
    }



    




    






}//end
