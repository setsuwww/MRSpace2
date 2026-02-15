<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SuppliersController extends Controller
{
    public function index()
    {
        return Inertia::render('Inventory/Suppliers/Index', [
            'suppliers' => Supplier::with('items')->latest()->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string|max:500',
            'items' => 'nullable|array',
            'items.*.name' => 'required|string|max:255',
            'items.*.sku' => 'required|string|max:255|unique:items,sku',
            'items.*.cost_price' => 'required|numeric|min:0',
            'items.*.selling_price' => 'required|numeric|min:0',
        ]);

        $supplier = Supplier::create($validated);

        if (!empty($validated['items'])) {
            foreach ($validated['items'] as $item) {
                $supplier->items()->create($item);
            }
        }

        return redirect()->back();
    }

    public function update(Request $request, Supplier $supplier)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string|max:500',
            'items' => 'nullable|array',
            'items.*.id' => 'nullable|exists:items,id',
            'items.*.name' => 'required|string|max:255',
            'items.*.sku' => 'required|string|max:255',
            'items.*.cost_price' => 'required|numeric|min:0',
            'items.*.selling_price' => 'required|numeric|min:0',
        ]);

        $supplier->update($validated);

        if (!empty($validated['items'])) {
            foreach ($validated['items'] as $itemData) {
                if (isset($itemData['id'])) {
                    $item = $supplier->items()->find($itemData['id']);
                    if ($item) $item->update($itemData);
                } else {
                    $supplier->items()->create($itemData);
                }
            }
        }

        return redirect()->back();
    }

    public function destroy(Supplier $supplier)
    {
        $supplier->delete();
        return redirect()->back();
    }
}
