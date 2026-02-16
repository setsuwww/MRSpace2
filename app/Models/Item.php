<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    protected $fillable = [
        'supplier_id',
        'name',
        'sku',
        'description',
        'stock',
        'cost_price',
        'selling_price'
    ];

    public function movements()
    {
        return $this->hasMany(StockMovement::class);
    }
    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function getSellingPriceInRupiah()
    {
        return 'Rp ' . number_format($this->selling_price, 0, ',', '.');
    }

    public function getCostPriceInRupiah()
    {
        return 'Rp ' . number_format($this->cost_price, 0, ',', '.');
    }
}
