@extends('layouts.admin')

@section('content')
<div class="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">
        {{ isset($user) ? 'Editar Usuario' : 'Crear Nuevo Usuario' }}
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

    <form action="{{ isset($user) ? route('admin.users.update', $user) : route('admin.users.store') }}" method="POST" class="space-y-4">
        @csrf
        @if(isset($user))
            @method('PUT')
        @endif

        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
            <input type="text" name="name" value="{{ old('name', $user->name ?? '') }}" required 
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none">
        </div>

        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
            <input type="email" name="email" value="{{ old('email', $user->email ?? '') }}" required 
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none">
        </div>

        <div class="grid grid-cols-2 gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                <select name="role" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                    <option value="customer" {{ (old('role', $user->role ?? '') == 'customer') ? 'selected' : '' }}>Customer</option>
                    <option value="admin" {{ (old('role', $user->role ?? '') == 'admin') ? 'selected' : '' }}>Admin</option>
                </select>
            </div>
            <div>
                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Fecha de Nacimiento</label>
                <input type="date" name="birthdate" max="2008-12-31" required 
                    class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-[#34D399] focus:outline-none transition">
            </div>
        </div>

        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
                Contraseña {{ isset($user) ? '(Déjalo en blanco para mantener la actual)' : '' }}
            </label>
            <input type="password" name="password" {{ isset($user) ? '' : 'required' }} 
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none">
        </div>

        @if(!isset($user))
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Confirmar Contraseña</label>
            <input type="password" name="password_confirmation" required 
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none">
        </div>
        @endif

        <div class="flex justify-end gap-3 pt-4">
            <a href="{{ route('admin.users.index') }}" class="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100">Cancelar</a>
            <button type="submit" class="px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700">Guardar</button>
        </div>
    </form>
</div>
@endsection