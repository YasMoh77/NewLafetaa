<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class External extends Model
{
    use HasFactory;
    protected $table='external_pay';
    
    protected $fillable=['item_id','title','method','plan','amount','phone','time'];
    public $timestamps=false;
}
