<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ad extends Model
{
    use HasFactory;
    protected $table='ads';
    
    protected $fillable=['NAME','description2','price','approve','feature','silver','gold','plan_id','plan_until','phone','website','item_email','whatsapp','youtube','CAT_ID','subcat_id','eventDate','country_id','state_id','city_id','photo','photo2','photo3','photo4','photo5','item_date','update_date','expiry_date','USER_ID'];
    public $timestamps=false;
}
