<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Scan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ScanController extends Controller
{
    private const MAX_PAR_JOUR = 10;
    private const POINTS_PAR_DH = 10;

    public function store(Request $request)
    {
        $data = $request->validate([
            'barcode' => 'required|string',
        ]);

        $user = $request->user();

        $product = Product::where('barcode', $data['barcode'])->first();
        if (!$product) {
            return response()->json(['message' => 'Produit non reconnu.'], 404);
        }

        // Anti-fraude 1 : nombre maximum de scans par jour
        $scansDuJour = Scan::where('user_id', $user->id)->whereDate('created_at', today());

        if ((clone $scansDuJour)->count() >= self::MAX_PAR_JOUR) {
            return response()->json(['message' => 'Limite de scans atteinte aujourd\'hui.'], 429);
        }

        // Anti-fraude 2 : même produit une seule fois par jour
        if ((clone $scansDuJour)->where('product_id', $product->id)->exists()) {
            return response()->json(['message' => 'Ce produit a déjà été scanné aujourd\'hui.'], 409);
        }

        DB::transaction(function () use ($user, $product) {
            Scan::create([
                'user_id' => $user->id,
                'product_id' => $product->id,
                'points' => $product->points,
            ]);
            $user->increment('points', $product->points);
        });

        $user->refresh();

        return response()->json([
            'message' => 'Scan enregistré.',
            'points_gagnes' => $product->points,
            'points_total' => $user->points,
            'solde_dh' => $user->points / self::POINTS_PAR_DH,
        ], 201);
    }

    public function index(Request $request)
    {
        $scans = Scan::with('product:id,name,category')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->limit(50)
            ->get();

        return response()->json($scans);
    }
}