@extends('layouts.admin')

@section('content')
<div class="container mx-auto px-6 py-8">
    <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Gestión de SubCategorías</h2>
        <a href="{{ route('admin.subcategories.create') }}" class="bg-[#34D399] text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-500 transition">
            Crear SubCategoría
        </a>
    </div>

    <div class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <table class="w-full text-left border-collapse">
            <thead>
                <tr class="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th class="py-4 px-6">ID</th>
                    <th class="py-4 px-6">Nombre</th>
                    <th class="py-4 px-6 text-right">Acciones</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 text-sm text-gray-700">
                @forelse($subcategories as $subcategory)
                    <tr class="hover:bg-gray-50 transition">
                        <td class="py-4 px-6">{{ $subcategory->id }}</td>
                        <td class="py-4 px-6 font-medium text-gray-900">{{ $subcategory->name }}</td>
                        <td class="py-4 px-6 text-right space-x-2">
                            <a href="{{ route('admin.subcategories.edit', $subcategory) }}" class="text-indigo-600 hover:text-indigo-900 font-medium">Editar</a>
                            <form action="{{ route('admin.subcategories.destroy', $subcategory) }}" method="POST" class="inline">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="text-red-600 hover:text-red-900 font-medium" onclick="return confirm('¿Estás seguro?')">Eliminar</button>
                            </form>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="3" class="py-6 text-center text-gray-400">No hay Subcategorías registradas.</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    <div class="mt-4">
        {{ $subcategories->links() }}
    </div>
</div>
@endsection