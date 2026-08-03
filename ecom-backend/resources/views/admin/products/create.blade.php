@extends('layouts.admin')

@section('content')
<div class="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">
        {{ isset($product) ? 'Editar Producto' : 'Crear Nuevo Producto' }}
    </h1>

    @if($errors->any())
        <div class="mb-4 p-4 bg-red-100 text-red-700 rounded-lg text-sm">
            <ul class="list-disc pl-5">
                @foreach($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <form action="{{ isset($product) ? route('admin.products.update', $product) : route('admin.products.store') }}" method="POST" class="space-y-4">
        @csrf
        @if(isset($product))
            @method('PUT')
        @endif

        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre del Producto</label>
            <input type="text" name="name" value="{{ old('name', $product->name ?? '') }}" required 
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none">
        </div>

        <div class="grid grid-cols-2 gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                <input type="text" name="sku" value="{{ old('sku', $product->sku ?? '') }}" required 
                    class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Subcategoría</label>
                <select name="subcategory_id" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                    <option value="">Seleccione...</option>
                    @foreach($categories as $category)
                        <optgroup label="{{ $category->name }}">
                            @foreach($category->subcategories as $subcat)
                                <option value="{{ $subcat->id }}" {{ (old('subcategory_id', $product->subcategory_id ?? '') == $subcat->id) ? 'selected' : '' }}>
                                    {{ $subcat->name }}
                                </option>
                            @endforeach
                        </optgroup>
                    @endforeach
                </select>
            </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Precio ($)</label>
                <input type="number" step="0.01" name="price" value="{{ old('price', $product->price ?? '') }}" required 
                    class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                <input type="number" name="stock" value="{{ old('stock', $product->stock ?? '') }}" required 
                    class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none">
            </div>
        </div>

        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea name="description" rows="3" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none">{{ old('description', $product->description ?? '') }}</textarea>
        </div>

        <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Imágenes del Producto</label>
            <input type="file" name="product_images[]" multiple accept="image/*" required
                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-[#34D399] focus:outline-none transition">
            <p class="text-xs text-gray-400 mt-1">Puedes seleccionar varias imágenes a la vez.</p>
        </div>

        <div class="flex justify-end gap-3 pt-4">
            <a href="{{ route('admin.products.index') }}" class="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100">Cancelar</a>
            <button type="submit" class="px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700">Guardar</button>
        </div>
    </form>
</div>
@endsection