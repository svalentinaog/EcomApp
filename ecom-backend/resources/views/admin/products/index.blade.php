@extends('layouts.admin')

@section('content')
<div class="flex justify-between items-center mb-6">
    <h1 class="text-2xl font-bold text-gray-800">Gestión de Productos</h1>
    <a href="{{ route('admin.products.create') }}" class="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition">
        + Nuevo Producto
    </a>
</div>

@if(session('success'))
    <div class="mb-4 p-4 bg-emerald-100 text-emerald-700 rounded-lg">
        {{ session('success') }}
    </div>
@endif

<div class="bg-white rounded-xl shadow overflow-hidden">
    <table class="w-full text-left border-collapse">
        <thead>
            <tr class="bg-gray-100 text-gray-600 text-sm border-b">
                <th class="p-4">SKU</th>
                <th class="p-4">Nombre</th>
                <th class="p-4">Precio</th>
                <th class="p-4">Stock</th>
                <th class="p-4">Subcategoría</th>
                <th class="p-4 text-right">Acciones</th>
            </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 text-sm text-gray-700">
            @forelse($products as $product)
                <tr>
                    <td class="p-4 font-mono text-gray-500">{{ $product->sku }}</td>
                    <td class="p-4 font-medium text-gray-900">{{ $product->name }}</td>
                    <td class="p-4">${{ number_format($product->price, 2) }}</td>
                    <td class="p-4">
                        <span class="px-2 py-1 rounded text-xs font-semibold {{ $product->stock > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700' }}">
                            {{ $product->stock }} un.
                        </span>
                    </td>
                    <td class="p-4">{{ $product->subcategory->name ?? 'N/A' }}</td>
                    <td class="p-4 text-right space-x-2">
                        <a href="{{ route('admin.products.edit', $product) }}" class="text-blue-600 hover:underline">Editar</a>
                        <form action="{{ route('admin.products.destroy', $product) }}" method="POST" class="inline-block" onsubmit="return confirm('¿Estás seguro de eliminar este producto?');">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="text-red-600 hover:underline">Eliminar</button>
                        </form>
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="6" class="p-6 text-center text-gray-500">No hay productos registrados.</td>
                </tr>
            @endforelse
        </tbody>
    </table>
    <div class="p-4 border-t">
        {{ $products->links() }}
    </div>
</div>
@endsection