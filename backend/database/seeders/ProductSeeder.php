<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $produits = [
            ['barcode' => '6111000000001', 'name' => 'Bouteille plastique 1,5 L', 'category' => 'plastique', 'points' => 2],
            ['barcode' => '6111000000002', 'name' => 'Bouteille en verre',        'category' => 'verre',     'points' => 3],
            ['barcode' => '6111000000003', 'name' => 'Canette aluminium 33 cl',   'category' => 'canette',   'points' => 2],
        ];

        foreach ($produits as $p) {
            Product::updateOrCreate(['barcode' => $p['barcode']], $p);
        }
    }
}