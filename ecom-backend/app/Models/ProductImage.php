<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductImage extends Model
{
    public $fillable = [
        'url_image',
        'product_id',
    ];

    //   Relacion:
    public function product() {
        return $this->belongsTo(Product::class);
    }
}