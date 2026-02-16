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
            'items.*.selling_price' => 'required|integer|min:0',
            'items.*.cost_price' => 'required|integer|min:0', // tambah ini
        ]);


        $supplier = Supplier::create($data);

        if (isset($data['items'])) {
            foreach ($data['items'] as $item) {
                $supplier->items()->create([
                    'name' => $item['name'],
                    'sku' => $item['sku'],
                    'selling_price' => $item['selling_price'],
                    'cost_price' => $item['cost_price'],
                    'stock' => $item['stock'] ?? 0,
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
            'items.*.id' => 'nullable|exists:items,id', // untuk update existing items
            'items.*.name' => 'required|string|max:255',
            'items.*.sku' => 'required|string',
            'items.*.cost_price' => 'required|integer|min:0',
            'items.*.selling_price' => 'required|integer|min:0',
            'items.*.stock' => 'nullable|integer|min:0',
        ]);

        $supplier->update([
            'name' => $data['name'],
            'phone' => $data['phone'] ?? null,
            'email' => $data['email'] ?? null,
            'address' => $data['address'] ?? null,
        ]);

        if (isset($data['items'])) {
            foreach ($data['items'] as $item) {
                if (isset($item['id'])) {
                    $existingItem = $supplier->items()->find($item['id']);
                    if ($existingItem) {
                        $existingItem->update([
                            'name' => $item['name'],
                            'sku' => $item['sku'],
                            'selling_price' => $item['selling_price'],
                            'cost_price' => $item['cost_price'],
                            'stock' => $item['stock'] ?? 0,
                        ]);
                    }
                } else {
                    $supplier->items()->create([
                        'name' => $item['name'],
                        'sku' => $item['sku'],
                        'selling_price' => $item['selling_price'],
                        'cost_price' => $item['cost_price'],
                        'stock' => $item['stock'] ?? 0,
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
