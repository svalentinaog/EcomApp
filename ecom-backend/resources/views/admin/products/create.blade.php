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

    <form action="{{ isset($product) ? route('admin.products.update', $product) : route('admin.products.store') }}" method="POST" enctype="multipart/form-data" class="space-y-4">        @csrf
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

            <label for="product_images" style="display:flex; flex-direction:column; align-items:center; justify-content:center; width:100%; padding:12px; background:#f9fafb; border:1px dashed #d1d5db; border-radius:8px; cursor:pointer; box-sizing:border-box;">
                <svg style="width:20px; height:20px; color:#9ca3af; margin-bottom:4px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span style="font-size:12px; color:#4b5563;">Haz clic o arrastra tus imágenes aquí</span>
                <span style="font-size:11px; color:#9ca3af;">Puedes seleccionar varias a la vez</span>
                <input id="product_images" type="file" name="product_images[]" multiple accept="image/*"
                    {{ isset($product) ? '' : 'required' }}
                    style="display:none;" onchange="previewImages(event)">
            </label>

            <div id="image-preview-container" style="display:grid; grid-template-columns:repeat(6, 1fr); gap:8px; margin-top:8px;"></div>
        </div>

        <div class="flex justify-end gap-3 pt-4">
            <a href="{{ route('admin.products.index') }}" class="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100">Cancelar</a>
            <button type="submit" class="px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700">Guardar</button>
        </div>
    </form>
</div>

<script>
    let selectedFiles = [];

    function previewImages(event) {
        const newFiles = Array.from(event.target.files);
        selectedFiles = selectedFiles.concat(newFiles);
        renderPreviews();
    }

    function removeImage(index) {
        selectedFiles.splice(index, 1);
        renderPreviews();
        updateInputFiles();
    }

    function renderPreviews() {
        const container = document.getElementById('image-preview-container');
        container.innerHTML = '';

        selectedFiles.forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = function (e) {
                const wrapper = document.createElement('div');
                wrapper.style.position = 'relative';
                wrapper.innerHTML = `
                    <img src="${e.target.result}" style="width:100%; height:56px; object-fit:cover; border-radius:6px; border:1px solid #e5e7eb; display:block;">
                    <button type="button" onclick="removeImage(${index})"
                        style="position:absolute; top:-6px; right:-6px; background:#ef4444; color:white; border:none; border-radius:50%; width:16px; height:16px; font-size:10px; line-height:16px; cursor:pointer; padding:0;">
                        ✕
                    </button>
                `;
                container.appendChild(wrapper);
            };
            reader.readAsDataURL(file);
        });
    }

    function updateInputFiles() {
        const input = document.getElementById('product_images');
        const dataTransfer = new DataTransfer();
        selectedFiles.forEach(file => dataTransfer.items.add(file));
        input.files = dataTransfer.files;
    }

    document.getElementById('product_images')?.addEventListener('change', function () {
        updateInputFiles();
    });
</script>
@endsection