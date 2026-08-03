@extends('layouts.admin')

@section('content')
<div class="max-w-xl bg-white p-8 rounded-xl shadow-md border border-gray-100">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Crear Nueva Subcategoría</h2>

    <form action="{{ route('admin.subcategories.store') }}" method="POST" class="space-y-5">
        @csrf
        
        <!-- Selector de Categoría Padre -->
        <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Categoría Principal</label>
            <select name="category_id" required 
                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-[#34D399] focus:outline-none transition">
                <option value="">Selecciona una categoría</option>
                @foreach($categories as $category)
                    <option value="{{ $category->id }}">{{ $category->name }}</option>
                @endforeach
            </select>
        </div>

        <!-- Nombre de la Subcategoría -->
        <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Nombre de la Subcategoría</label>
            <input type="text" name="name" placeholder="Ej. Lácteos" required 
                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-[#34D399] focus:outline-none transition">
        </div>

        <button type="submit" class="w-full bg-[#34D399] text-white py-3 rounded-lg font-semibold hover:bg-emerald-500 transition shadow-sm">
            Guardar Subcategoría
        </button>
    </form>
</div>
@endsection