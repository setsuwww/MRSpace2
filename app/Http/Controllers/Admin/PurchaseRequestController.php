<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Models\PurchaseRequest;
use App\Models\PurchaseRequestItem;
use App\Models\Supplier;
use App\Models\Item;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PurchaseRequestController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->get('status', 'pending');
        $requests = PurchaseRequest::with(['supplier', 'items.item'])
            ->where('status', $status)
            ->get();

        return Inertia::render('PurchaseRequests/Index', compact('requests', 'status'));
    }

    public function create()
    {
        $suppliers = Supplier::with('items')->get();
        return Inertia::render('PurchaseRequests/Create', compact('suppliers'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'items.*.item_id' => 'required|exists:items,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        $purchaseRequest = PurchaseRequest::create([
            'supplier_id' => $data['supplier_id'],
            'status' => 'pending',
        ]);

        foreach ($data['items'] as $item) {
            PurchaseRequestItem::create([
                'purchase_request_id' => $purchaseRequest->id,
                'item_id' => $item['item_id'],
                'quantity' => $item['quantity'],
                'price' => Item::find($item['item_id'])->selling_price,
            ]);
        }

        return redirect()->route('purchase-requests.index')->with('success', 'Purchase request created');
    }

    public function approve(PurchaseRequest $purchaseRequest)
    {
        $purchaseRequest->update(['status' => 'approved']);

        foreach ($purchaseRequest->items as $prItem) {
            $item = $prItem->item;
            $item->decrement('stock', $prItem->quantity);
        }

        return redirect()->route('purchase-requests.index')->with('success', 'Request approved');
    }

    public function reject(PurchaseRequest $purchaseRequest)
    {
        $purchaseRequest->update(['status' => 'rejected']);
        return redirect()->route('purchase-requests.index')->with('success', 'Request rejected');
    }
}
