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

    public function getPriceInRupiah()
    {
        return 'Rp ' . number_format($this->price, 0, ',', '.');
    }
}
