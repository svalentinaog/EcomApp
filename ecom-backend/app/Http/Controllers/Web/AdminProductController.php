<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use App\Models\Subcategory;
use Illuminate\Http\Request;

class AdminProductController extends Controller
{
    public function index()
    {
        $products = Product::with(['subcategory.category'])->paginate(10);
        return view('admin.products.index', compact('products'));
    }

    public function create()
    {
        $categories = Category::with('subcategories')->get();
        return view('admin.products.create', compact('categories'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'required|string|unique:products',
            'price' => 'required|numeric',
            'stock' => 'required|integer',
            'subcategory_id' => 'required|exists:subcategories,id',
        ]);

        Product::create($request->all());

        return redirect()->route('admin.products.index')->with('success', 'Producto creado exitosamente.');
    }

    public function edit(Product $product)
    {
        $categories = Category::with('subcategories')->get();
        return view('admin.products.create', compact('product', 'categories'));
    }

    public function update(Request $request, Product $product)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'required|string|unique:products,sku,' . $product->id,
            'price' => 'required|numeric',
            'stock' => 'required|integer',
            'subcategory_id' => 'required|exists:subcategories,id',
        ]);

        $product->update($request->all());

        return redirect()->route('admin.products.index')->with('success', 'Producto actualizado exitosamente.');
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return redirect()->route('admin.products.index')->with('success', 'Producto eliminado exitosamente.');
    }
}