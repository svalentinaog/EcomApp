@extends('layouts.admin')

@section('content')
<div class="flex justify-between items-center mb-6">
    <h1 class="text-2xl font-bold text-gray-800">Gestión de Usuarios</h1>
    <a href="{{ route('admin.users.create') }}" class="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition">
        + Nuevo Usuario
    </a>
</div>

@if(session('success'))
    <div class="mb-4 p-4 bg-emerald-100 text-emerald-700 rounded-lg">
        {{ session('success') }}
    </div>
@endif

@if(session('error'))
    <div class="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
        {{ session('error') }}
    </div>
@endif

<div class="bg-white rounded-xl shadow overflow-hidden">
    <table class="w-full text-left border-collapse">
        <thead>
            <tr class="bg-gray-100 text-gray-600 text-sm border-b">
                <th class="p-4">Nombre</th>
                <th class="p-4">Correo</th>
                <th class="p-4">Rol</th>
                <th class="p-4">F. Nacimiento</th>
                <th class="p-4 text-right">Acciones</th>
            </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 text-sm text-gray-700">
            @forelse($users as $user)
                <tr>
                    <td class="p-4 font-medium text-gray-900">{{ $user->name }}</td>
                    <td class="p-4 text-gray-500">{{ $user->email }}</td>
                    <td class="p-4">
                        <span class="px-2 py-1 rounded text-xs font-semibold {{ $user->role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700' }}">
                            {{ ucfirst($user->role) }}
                        </span>
                    </td>
                    <td class="p-4">{{ $user->birth_date ?? 'N/A' }}</td>
                    <td class="p-4 text-right space-x-2">
                        <a href="{{ route('admin.users.edit', $user) }}" class="text-blue-600 hover:underline">Editar</a>
                        @if($user->id !== auth()->id())
                            <form action="{{ route('admin.users.destroy', $user) }}" method="POST" class="inline-block" onsubmit="return confirm('¿Estás seguro de eliminar este usuario?');">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="text-red-600 hover:underline">Eliminar</button>
                            </form>
                        @endif
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="5" class="p-6 text-center text-gray-500">No hay usuarios registrados.</td>
                </tr>
            @endforelse
        </tbody>
    </table>
    <div class="p-4 border-t">
        {{ $users->links() }}
    </div>
</div>
@endsection