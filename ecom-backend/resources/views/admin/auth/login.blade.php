<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panel Admin: Login - BeeShop</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-900 flex items-center justify-center h-screen">

    <div class="bg-white p-10 rounded-xl shadow-2xl w-full max-w-md border border-sky-400">
        
        <!-- Logo compuesto idéntico al diseño -->
        <div class="text-center mb-8">
            <div class="flex justify-center items-center gap-3 mb-2">
                <div class="bg-[#34D399] w-12 h-12 rounded-full flex items-center justify-center text-white shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                </div>
                <span class="text-3xl font-bold text-gray-900 tracking-tight" style="font-family: system-ui, -apple-system, sans-serif;">BeeShop</span>
            </div>
            <p class="text-sm text-gray-500">Inicia sesión para gestionar tu tienda</p>
        </div>

        @if($errors->any())
            <div class="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-lg">
                {{ $errors->first() }}
            </div>
        @endif

        <form action="{{ route('admin.login') }}" method="POST" class="space-y-5">
            @csrf
            <div>
                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Correo electrónico</label>
                <input type="email" name="email" value="{{ old('email') }}" placeholder="example@gmail.com" required 
                    class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-[#34D399] focus:outline-none transition">
            </div>

            <div>
                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Contraseña</label>
                <input type="password" name="password" placeholder="Ingresar contraseña" required 
                    class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-[#34D399] focus:outline-none transition">
            </div>

            <button type="submit" class="w-full bg-[#34D399] text-white py-3 rounded-lg font-semibold hover:bg-emerald-500 transition shadow-sm">
                Acceso
            </button>
        </form>
    </div>

</body>
</html>