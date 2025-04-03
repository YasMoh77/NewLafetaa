<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class countryWhats implements ValidationRule
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
          if(isset($value) &&  strlen($value) !==12 ){
               $fail(' رقم الواتس الصحيح هكذا  201012345678');}
       }elseif($this->country==2){
          if(isset($value) &&  strlen($value) !==13 ){
               $fail(' رقم الواتس الصحيح هكذا 9660531234567');}
        }elseif($this->country==3){
          if(isset($value) &&  strlen($value) !==11 ){
               $fail('رقم الواتس الصحيح هكذا 96505312345');}
        } elseif($this->country==4){
          if(isset($value) &&  strlen($value) !==13 ){
               $fail(' رقم الواتس الصحيح هكذا 9710531234567');}
        } elseif($this->country==5){
          if(isset($value) &&  strlen($value) !==11 ){
               $fail(' رقم الواتس الصحيح هكذا 97405312345'); }
        } elseif($this->country==6){
          if(isset($value) &&  strlen($value) !==11 ){
               $fail('رقم الواتس الصحيح هكذا 96805312345'); }
        } 

    
    }
}
