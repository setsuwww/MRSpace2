<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    use HasFactory;

    protected $fillable = ['supplier_id', 'name', 'sku', 'description', 'stock', 'cost_price', 'selling_price'];

    // Supplier dari item ini
    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    // Purchase Requests yang memuat item ini
    public function purchaseRequestItems()
    {
        return $this->hasMany(PurchaseRequestItem::class);
    }
}
