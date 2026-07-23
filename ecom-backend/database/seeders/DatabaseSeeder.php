<?php

namespace Database\Seeders;

use App\Models\User; // Necesario para crear el administrador
use App\Models\Category;
use App\Models\Subcategory;
use App\Models\Product;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * El trait WithoutModelEvents desactiva temporalmente los eventos de los modelos 
     * (como 'created', 'updated') mientras se ejecuta el Seeder. 
     * Esto mejora drásticamente el rendimiento al insertar datos masivos.
     */
    use WithoutModelEvents;

    /**
     * Poblar la base de datos de la aplicación.
     * Comando para ejecutar: php artisan migrate --seed
     */
    public function run(): void
    {
        // ==========================================
        // 1. CREACIÓN DE ESTRUCTURA BASE (Datos fijos)
        // ==========================================
        // Creamos explícitamente los datos de los que dependen otros registros.
        $category = Category::create([
            'name' => 'Despensa'
        ]);
        
        $subcategory = Subcategory::create([
            'name' => 'Granos y Cereales',
            'category_id' => $category->id
        ]);

        // ==========================================
        // 2. GENERACIÓN MASIVA (Uso de Factories)
        // ==========================================
        // Utilizamos el Factory para delegar a Faker la creación de 20 productos.
        // Le inyectamos explícitamente el 'subcategory_id' para que todos 
        // pertenezcan a la subcategoría que acabamos de crear arriba.
        $products = Product::factory(20)->create([
            'subcategory_id' => $subcategory->id
        ]);

        // ==========================================
        // 3. INSERCIÓN DE RELACIONES (Imágenes)
        // ==========================================
        // Recorremos la colección de productos generados y utilizamos el método de 
        // relación createMany() para guardar múltiples imágenes vinculadas automáticamente.
        foreach ($products as $product) {
            $product->productImages()->createMany([
                ['url_image' => 'products/EW5olmJaigOSYI7000dQsTMP5eW7h8Iqir24wCvm.jpg'],
                ['url_image' => 'products/GPqCDmV57T2tDMBPm3n38GThiDTRp3MAiKcFnrZU.jpg']
            ]);
        }

        // ==========================================
        // 4. DATOS DE ADMINISTRACIÓN (Usuarios reales/obligatorios)
        // ==========================================
        // firstOrCreate: Busca un registro por el primer array (email). 
        // Si no lo encuentra, lo crea combinando el primer y segundo array.
        // Esto evita que se duplique el administrador si ejecutamos el seeder varias veces.
        User::firstOrCreate(
            ['email' => env('ADMIN_EMAIL', 'admin@ecomapp.com')],
            [
                'name' => env('ADMIN_NAME', 'Administrador'),
                // Es crucial hashear la contraseña, de lo contrario el login fallará
                'password' => Hash::make(env('ADMIN_PASSWORD', 'ecompassword123')),
                'role' => 'admin',
                'birth_date' => '1990-01-01',
            ]
        );
    }
}