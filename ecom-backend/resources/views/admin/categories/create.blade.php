@extends('layouts.admin')

@section('content')
<div class="max-w-xl bg-white p-8 rounded-xl shadow-md border border-gray-100">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Crear Nueva Categoría</h2>

    <form action="{{ route('admin.categories.store') }}" method="POST" class="space-y-5">
        @csrf
        <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Nombre de la Categoría</label>
            <input type="text" name="name" placeholder="Ej. Despensa" required 
                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-[#34D399] focus:outline-none transition">
        </div>

        <button type="submit" class="w-full bg-[#34D399] text-white py-3 rounded-lg font-semibold hover:bg-emerald-500 transition shadow-sm">
            Guardar Categoría
        </button>
    </form>
</div>
@endsection