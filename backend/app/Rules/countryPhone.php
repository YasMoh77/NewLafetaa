<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class countryPhone implements ValidationRule
{
    
    public $country;

    public function __construct($country)
    {
       $this->country=$country;
    }
    
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
      if(empty($value)){
          return;
      }
        if($this->country==1){
          if(isset($value) &&  strlen($value) !==11 ){
               $fail(' أدخل 11 رقم في حقل التليفون');}
        }elseif($this->country==2){
          if(isset($value) &&  strlen($value) !==10 ){
               $fail(' أدخل 10 رقم في حقل التليفون');}
        }elseif($this->country==3){
          if(isset($value) &&  strlen($value) !==8 ){
               $fail(' أدخل 8 رقم في حقل التليفون');}
        } elseif($this->country==4){
          if(isset($value) &&  strlen($value) !==10 ){
               $fail(' أدخل 10 رقم في حقل التليفون');}
        } elseif($this->country==5){
          if(isset($value) &&  strlen($value) !==8 ){
               $fail(' أدخل 8 رقم في حقل التليفون'); }
        } elseif($this->country==6){
          if(isset($value) &&  strlen($value) !==8 ){
               $fail(' أدخل 8 رقم في حقل التليفون'); }
        } 


    }
}
