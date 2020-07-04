<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Product;

class ProductController extends Controller
{
    public function index()
    {
        return Product::all();
    }

    public function store(Request $request)
    {
        Product::create($request->all());
        return ['message' => 'Product has been created successfully.'];
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        $product->update($request->all());
        return ['message' => 'Product has been updated successfully.'];
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();
        return ['message' => 'Product has been deleted successfully.'];
    }

    public function single($id)
    {
        $product = Product::findOrFail($id);
        return $product;
    }
}