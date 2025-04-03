<?php
use App\Models\User;
use App\Models\Ad;
use App\Models\Plan;

use Carbon\carbon;



//
function insertPlan($id,$cat,$adDetail,$status,$chosenPlan,$userName,$phone,$pay_method)
{ 
   //prepare to insert
  $planTable=new Plan();

   //now
   $now=Carbon::now();

  //insert in plan table
  $planTable->item_id=$id;  $planTable->ad_cat=$cat;
  $planTable->ad_title=$adDetail->NAME; $planTable->ad_date=$adDetail->item_date;
  $planTable->ad_status=$status; $planTable->ad_chosenplan=$chosenPlan;
  $planTable->ad_username=$userName; $planTable->ad_userphone=$phone;
  $planTable->pay_method=$pay_method;  $planTable->order_date=$now;
  $planTable->save();
}
