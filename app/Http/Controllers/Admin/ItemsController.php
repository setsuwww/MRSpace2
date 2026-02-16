<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Item;
use App\Models\Supplier;
use App\Models\StockMovement;

class ItemsController extends Controller
{
    public function index()
    {
        return Inertia::render('Inventory/Items/Index', [
            'items' => Item::latest()->get(),
            'suppliers' => Supplier::all()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'name' => 'required|string|max:255',
            'sku' => 'required|string|unique:items,sku',
            'description' => 'nullable|string',
            'stock' => 'nullable|integer|min:0',
            'cost_price' => 'required|numeric|min:0',
            'selling_price' => 'required|numeric|min:0',
        ]);

        Item::create($validated);

        return redirect()->back()->with('success', 'Item created');
    }

    public function update(Request $request, Item $item)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'required|string|unique:items,sku,' . $item->id,
            'description' => 'nullable|string',
            'stock' => 'nullable|integer|min:0',
            'cost_price' => 'required|numeric|min:0',
            'selling_price' => 'required|numeric|min:0',
        ]);

        $item->update($validated);

        return redirect()->back();
    }

    public function destroy(Item $item)
    {
        $item->delete();
        return redirect()->back();
    }

    public function stockIn(Request $request, Item $item)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);

        $item->increment('stock', $request->quantity);

        StockMovement::create([
            'item_id' => $item->id,
            'type' => 'in',
            'quantity' => $request->quantity,
            'note' => $request->note
        ]);

        return redirect()->back();
    }

    public function stockOut(Request $request, Item $item)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);

        if ($item->stock < $request->quantity) {
            return back()->withErrors(['quantity' => 'Stock not enough']);
        }

        $item->decrement('stock', $request->quantity);

        StockMovement::create([
            'item_id' => $item->id,
            'type' => 'out',
            'quantity' => $request->quantity,
            'note' => $request->note
        ]);

        return redirect()->back();
    }
}
