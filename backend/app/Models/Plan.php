<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    use HasFactory;
    protected $table='plan';
    
    protected $fillable=['item_id','ad_cat','ad_title','ad_date','ad_status','ad_chosenplan','ad_username','ad_userphone','pay_method','order_date'];
    public $timestamps=false;
}
