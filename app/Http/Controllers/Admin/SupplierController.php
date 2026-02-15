<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Supplier;
use App\Models\Item;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SupplierController extends Controller
{
    public function index()
    {
        $suppliers = Supplier::with('items')->get();
        return Inertia::render('Suppliers/Index', compact('suppliers'));
    }

    public function create()
    {
        return Inertia::render('Suppliers/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string',
            'items.*.name' => 'required|string|max:255',
            'items.*.sku' => 'required|string|unique:items,sku',
            'items.*.price' => 'required|integer|min:0',
        ]);

        $supplier = Supplier::create($data);

        if(isset($data['items'])) {
            foreach ($data['items'] as $item) {
                $supplier->items()->create([
                    'name' => $item['name'],
                    'sku' => $item['sku'],
                    'selling_price' => $item['price'],
                    'cost_price' => $item['price'],
                ]);
            }
        }

        return redirect()->route('suppliers.index')->with('success', 'Supplier created');
    }

    public function show(Supplier $supplier)
    {
        $supplier->load('items');
        return Inertia::render('Suppliers/Show', compact('supplier'));
    }

    public function edit(Supplier $supplier)
    {
        $supplier->load('items');
        return Inertia::render('Suppliers/Edit', compact('supplier'));
    }

    public function update(Request $request, Supplier $supplier)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string',
            'items.*.id' => 'nullable|exists:items,id',
            'items.*.name' => 'required|string|max:255',
            'items.*.sku' => 'required|string',
            'items.*.price' => 'required|integer|min:0',
        ]);

        $supplier->update($data);

        if(isset($data['items'])) {
            foreach ($data['items'] as $itemData) {
                if(isset($itemData['id'])) {
                    $item = Item::find($itemData['id']);
                    $item->update([
                        'name' => $itemData['name'],
                        'sku' => $itemData['sku'],
                        'selling_price' => $itemData['price'],
                    ]);
                } else {
                    $supplier->items()->create([
                        'name' => $itemData['name'],
                        'sku' => $itemData['sku'],
                        'selling_price' => $itemData['price'],
                        'cost_price' => $itemData['price'],
                    ]);
                }
            }
        }

        return redirect()->route('suppliers.index')->with('success', 'Supplier updated');
    }

    public function destroy(Supplier $supplier)
    {
        $supplier->delete();
        return redirect()->route('suppliers.index')->with('success', 'Supplier deleted');
    }
}
