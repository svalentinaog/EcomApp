<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Subcategory;
use App\Models\Category;
use Illuminate\Http\Request;

class AdminSubcategoryController extends Controller
{
    public function index()
    {
        $subcategories = Subcategory::with('category')->paginate(10);
        return view('admin.subcategories.index', compact('subcategories'));
    }

    public function create()
    {
        $categories = Category::all();
        return view('admin.subcategories.create', compact('categories'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
        ]);

        Subcategory::create($request->all());

        return redirect()->route('admin.subcategories.index')->with('success', 'Subcategoría creada exitosamente.');
    }
}