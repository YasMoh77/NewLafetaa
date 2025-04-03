<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use App\Models\Ad;
use App\Models\User;
use App\Models\Category;
use App\Models\subCategory;
use App\Models\Country;
use App\Models\State;
use App\Models\City;
use App\Models\Plan;
use App\Models\Comment;
use App\Models\ReplyComment;
use App\Rules\countryPhone;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage; //put or delete files
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;


class panelController extends Controller
{
    
    //count ads, users on dashboard
    public function countDashboard()
    {
       $countAds=Ad::count();//count ads
       $countUsers=User::count();//count users
       $countPlans=Plan::count();//count plan requests for featuring ads
       $comments=Comment::count();//count comments
       $replies=ReplyComment::count();

       return response()->json([
           'ads'=>$countAds,
           'users'=>$countUsers,
           'plans'=>$countPlans,
           'comments'=>$comments,
           'replies'=>$replies
       ]);
    }


    public function ads(Request $request)
    {   
        //store query
        $page=$request->query('page',1);
         //get all ads ['*']
        $ads=Ad::orderBy('item_id','DESC')-> paginate(10,['*'],'page',$page);
        // return ads as json
        return response()->json($ads);
    }


    //apprve ads 
    public function approve(Request $request)
    {
     $found=Ad::where('item_id',$request->id)->first();
     if($found){
        Ad::where('item_id',$request->id)->update(['approve'=>1]);
     }
     return response()->json(['message'=>'Ad approved successfully']);
    }



    //apprve ads 
    public function returnPending(Request $request)
    {
     $found=Ad::where('item_id',$request->id)->first();
     if($found){
        Ad::where('item_id',$request->id)->update(['approve'=>2]);
     }
     return response()->json(['message'=>'Ad returned to pending ']);
    }



    //feature ad
    public function featureAd(Request $request)
    {  
       $found=Ad::where('item_id',$request->item_id)->first();
       $now=Carbon::now();//time now
       $ninetyDays= $now->copy()->addDays(90);//time after 3months

       if($found){ 
            //feature ad to gold
           if($request->chosenPlan=='GOLD'){
                Ad::where('item_id',$request->item_id)->update(['gold'=>1,'silver'=>0,'feature'=>2,'plan_until'=>$ninetyDays]);
                //delete row in plan table
                Plan::where('item_id',$request->item_id)->delete();
                return response()->json(['message'=>'Ad featured to gold successfully']);
            //feature ad to silver
           }elseif($request->chosenPlan=='SILVER'){
                Ad::where('item_id',$request->item_id)->update(['gold'=>0,'silver'=>1,'feature'=>1,'plan_until'=>$ninetyDays]);
                //delete row in plan table
                Plan::where('item_id',$request->item_id)->delete();
                return response()->json(['message'=>'Ad featured to silver successfully']);
          }
        }
    }


    //get users
    public function users(Request $request)
    {
        $page=$request->query('page',1);
        $users=User::orderBy('id','DESC')->paginate(10,['*'],'page',$page);
        return response()->json($users);
    }


    //block and unblock users
    public function block(Request $request)
    {  
        //check if user is found
        $found=User::where('id',$request->id);
        //update block if user was found
        if($found->first()){
            if($found->first()->block==0){$found->update(['block'=>1]); return response()->json(['message'=>'User blocked', ]);
            }else{$found->update(['block'=>0]); return response()->json(['message'=>'User blocking cancelled', ]);}    
        }
        return response()->json([
            'message'=>'User NOT found'
        ]);  
    }


    //change admin
    public function changeAdmin(Request $request)
    {
       if($request->val>0){
          $user= User::findOrFail($request->id);
          $thisUser=User::where('id',$request->id);
          if($user){
            if($request->val==1){$thisUser->update(['admin'=>'']); }
            elseif($request->val==2){$thisUser->update(['admin'=>'ok']); }
            elseif($request->val==3){$thisUser->update(['admin'=>'sup']); }
            elseif($request->val==4){$thisUser->update(['admin'=>'own']); }

            return response()->json(['message'=>'Success', ]);
          }
       }
    }


    public function destroy(string $id)
    {   
        $found=User::findOrFail($id);
        if($found){
            User::where('item_id',$id)->delete();
            return response()->json(['message'=>'User deleted successfully',]);
        }
        return response()->json(['message'=>'User not found',]);
    }


     //get country,state,city,cat and subcat names
    public function names(Request $request)
    {  
        $country=Country::whereIn('country_id',$request->country)->pluck('country_nameAR','country_id');
        $state=State::whereIn('state_id',$request->state)->pluck('state_nameAR','state_id');
        $city=City::whereIn('city_id',$request->city)->pluck('city_nameAR','city_id');
        $cat=Category::whereIn('cat_id',$request->cat)->pluck('nameAR','cat_id');
        $subCat=SubCategory::whereIn('subcat_id',$request->subCat)->pluck('subcat_nameAR','subcat_id');
        $user=User::whereIn('id',$request->user)->pluck('name','id');

        return response()->json([
            'country'=>$country,
            'state'=>$state,
            'city'=>$city,
            'cat'=>$cat,
            'subCat'=>$subCat,
            'user'=>$user
        ]);
    }


    public function plans(Request $request)
    {
      $page=$request->query('page',1);
      $plans=Plan::orderBy('plan_id','DESC')->paginate(10,['*'],'page',$page);
      return response()->json($plans);
    }

    //delete plan
    public function destroyPlan(string $id)
    {  
        //check plan
        $found=Plan::where('plan_id',$id);
        //delete plan
       if($found->first()){$found->delete();}
       return response()->json([ 'message'=>'Plan deleted' ]);
    }

    //get comments
    public function comments(Request $request)
    {
        $page=$request->query('page',1);
        $comments=Comment::orderBy('c_id','DESC')->paginate(10,['*'],'page',$page);
        return response()->json($comments);
    }
   
    //delete comment
    public function destroyComment(Request $request)
    {   
        if($request->reply){
             //check if reply is there
            $found=ReplyComment::where('id',$request->id);
            //if not found, return not-found message
            if(!$found->first()){
                return response()->json([ 'message'=>'NOT FOUND' ]);
            }
                    //get ad id
            $item_id=$found->first()->item_id;
            //delete this comment from comments table
            $found->delete(); 
            //count comments & reply comments for this ad
            $numOfComments=Comment::where('ITEM_ID',$item_id)->count();
            $replyComms=ReplyComment::where('item_id',$item_id)->count();
            $num=$numOfComments+$replyComms;
            $sumOfRates=Comment::where('ITEM_ID',$item_id)->sum('rate');//get rates total
            $rating=$sumOfRates/$numOfComments;//divide to get rating
            //update number of comments and rating in ads table
            Ad::where('item_id',$item_id)->update(['comments'=>$num,'rating'=>$rating]);
            return response()->json([ 'message'=>'Reply deleted' ]);
        
        }
        //check if comment is there
        $found=Comment::where('c_id',$request->id);
        //check if comment has replies
        $found2=ReplyComment::where('c_id',$request->id);
        //if not found, return not-found message
        if(!$found->first()){
            return response()->json([ 'message'=>'NOT FOUND' ]);
        }
        //get ad id
        $item_id=$found->first()->ITEM_ID;
        //delete this comment from comments table
         $found->delete();  
         //delete replies for this comment from comments2 table
         if($found2){$found2->delete();}
         //count comments & reply comments for this ad
         $numOfComments=Comment::where('ITEM_ID',$item_id)->count();
         $replyComms=ReplyComment::where('item_id',$item_id)->count();
         $num=$numOfComments+$replyComms;
         $sumOfRates=Comment::where('ITEM_ID',$item_id)->sum('rate');//get rates total
         $rating=$sumOfRates/$numOfComments;//divide to get rating
         //update number of comments and rating in ads table
         Ad::where('item_id',$item_id)->update(['comments'=>$num,'rating'=>$rating]);
       return response()->json([ 'message'=>'Comment deleted' ]);
    }


    //get replies to comments
    public function replies(Request $request)
    {
        $page=$request->query('page',1);
        $replies=ReplyComment::orderBy('c_id','DESC')->paginate(10,['*'],'page',$page);
        return response()->json($replies);
    }

    //get user name
    public function getUserName(Request $request)
    {
       $name=User::where('id',$request->id)->first()->name;
       if($name){
          return response()->json([
              'name'=>$name
          ]);
       }
       return response()->json([
        'name'=>'غير معروف'
    ]);
    }

    //get comment to show on dashboad/reply-comments
    public function getComment($id)
    {
        $comm=Comment::where('c_id',$id)->first();
        if($comm){
            return response()->json(['comm'=>$comm->c_text]);
        }else{
            return response()->json([
                'comm'=>'تم حذف التعليق الأصلي'
            ]);
        }
    }

    //get ad name
    public function getAdName(Request $request)
    {
       $name=Ad::where('item_id',$request->id)->first()->NAME;
       if($name){
          return response()->json([ 
              'name'=>$name
          ]);
       }
       return response()->json([
        'name'=>'غير معروف'
    ]);
    }

    //edit Comment
    public function editComment(Request $request)
    {
        $validator = Validator::make($request->all(),[
            'text'     => 'required|string|min:2|max:700',
        ]);
        //if wrong data
        if ($validator->fails()) {
            return response()->json(['message' =>'انتبه للأخطاء']);
        }
        if($request->reply){
            $found=ReplyComment::where('id',$request->id)->exists();
            if(!$found){
                return response()->json(['message' =>'هذا الرد غير موجود']);
            }
            ReplyComment::where('id',$request->id)->update(['text'=>$request->text]);
            return response()->json(['message' =>'تم التعديل']);
        }
        $found=Comment::where('c_id',$request->id)->exists();
        if(!$found){
            return response()->json(['message' =>'هذا التعليق غير موجود']);
        }
         Comment::where('c_id',$request->id)->update(['c_text'=>$request->text]);
        return response()->json(['message' =>'تم التعديل']);
    }









}
