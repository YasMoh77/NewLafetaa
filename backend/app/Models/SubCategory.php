<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class subCategory extends Model
{
    use HasFactory;
    protected $table='sub';
    
    protected $fillable=['subcat_name','subcat_nameAR','ordering','cat_id'];
    public $timestamps=false;
}
