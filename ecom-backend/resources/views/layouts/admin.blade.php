<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BeeShop - Panel Administrativo</title>
    
    <!-- 🎨 Tailwind CSS via CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Configuración opcional para extender colores al estilo BeeShop -->
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        beeGreen: '#10B981', // El verde esmeralda de tus botones y estados
                        beeDark: '#111827',  // El fondo oscuro de la barra lateral
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-gray-50 font-sans antialiased">

    <div class="flex h-screen bg-gray-100">
        
        <!-- 🖤 BARRA LATERAL OSCURA (Diseño BeeShop) -->
        <aside class="w-64 bg-beeDark text-white flex flex-col justify-between hidden md:flex">
            <div>
                <!-- Logo -->
                <div class="flex justify-center items-center gap-3 mt-2 mb-2">
                <div class="bg-[#34D399] w-12 h-12 rounded-full flex items-center justify-center text-white shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <span class="text-3xl font-bold text-white tracking-tight" style="font-family: system-ui, -apple-system, sans-serif;">BeeShop</span>
                </div>

                <!-- Menú de Navegación -->
                <nav class="mt-6 px-4 space-y-2">
                    <!-- Usuarios -->
                    <a href="{{ route('admin.users.index') }}" class="flex items-center gap-3 px-4 py-3 rounded-lg text-white font-medium {{ request()->routeIs('admin.users*') ? 'bg-[#34D399]' : 'hover:bg-gray-800' }}">
                        👥 Usuarios
                    </a>

                    <!-- Productos -->
                    <a href="{{ route('admin.products.index') }}" class="flex items-center gap-3 px-4 py-3 rounded-lg text-white font-medium {{ request()->routeIs('admin.products*') ? 'bg-[#34D399]' : 'hover:bg-gray-800' }}">
                        📦 Productos
                    </a>

                    <!-- Categorías -->
                    <a href="{{ route('admin.categories.index') }}" class="flex items-center gap-3 px-4 py-3 rounded-lg text-white font-medium {{ request()->routeIs('admin.categories*') ? 'bg-[#34D399]' : 'hover:bg-gray-800' }}">
                        📌 Categorías
                    </a>

                    <!-- Subcategorías -->
                    <a href="{{ route('admin.subcategories.index') }}" class="flex items-center gap-3 px-4 py-3 rounded-lg text-white font-medium {{ request()->routeIs('admin.subcategories*') ? 'bg-[#34D399]' : 'hover:bg-gray-800' }}">
                        📌 Subcategorías
                    </a> 
                </nav>
            </div>

            <!-- Botón Cerrar Sesión (Abajo a la izquierda en tus capturas) -->
            <div class="p-4 border-t border-gray-800">
                <form action="{{ route('admin.logout') }}" method="POST" class="inline">
                    @csrf
                    <button type="submit" class="flex items-center gap-2 text-gray-400 hover:text-white transition text-sm font-medium">
                        <span>←</span> Cerrar sesión
                    </button>
                </form>
            </div>
        </aside>

        <!-- 🖥️ CONTENEDOR PRINCIPAL -->
        <div class="flex-1 flex flex-col overflow-hidden">
            <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-8">
                <!-- Aquí se inyectará el contenido de cada vista (Productos, Usuarios, etc.) -->
                @yield('content')
            </main>
        </div>

    </div>

</body>
</html>