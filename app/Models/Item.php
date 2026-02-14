<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    protected $fillable = [
        'name',
        'sku',
        'description',
        'stock',
        'price'
    ];

    public function movements()
    {
        return $this->hasMany(StockMovement::class);
    }
}
