<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\StockMovement;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ItemsController extends Controller
{
    public function index()
    {
        return Inertia::render('Inventory/Items/Index', [
            'items' => Item::latest()->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required',
            'sku' => 'required|unique:items,sku',
            'price' => 'required|numeric',
            'description' => 'nullable'
        ]);

        Item::create($validated);

        return redirect()->back();
    }

    public function update(Request $request, Item $item)
    {
        $validated = $request->validate([
            'name' => 'required',
            'price' => 'required|numeric',
            'description' => 'nullable'
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

