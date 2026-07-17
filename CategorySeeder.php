<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Subcategory;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Categorías y subcategorías para EcomApp.
     *
     * Usa firstOrCreate en ambos niveles, así que es seguro correrlo
     * aunque ya existan categorías (ej. "Despensa" con "Granos y Cereales"):
     * no se duplican, solo se agrega lo que falte.
     */
    public function run(): void
    {
        $categories = [
            'Despensa' => [
                'Granos y Cereales',
                'Pastas y Harinas',
                'Aceites y Vinagres',
                'Salsas y Aderezos',
                'Enlatados y Conservas',
                'Azúcar y Endulzantes',
                'Especias y Condimentos',
                'Sopas y Cremas',
            ],
            'Frutas y Verduras' => [
                'Frutas Frescas',
                'Verduras y Hortalizas',
                'Frutos Secos y Semillas',
                'Hierbas Aromáticas',
            ],
            'Lácteos y Huevos' => [
                'Leches',
                'Yogures y Kumis',
                'Quesos',
                'Huevos',
                'Mantequillas y Margarinas',
                'Crema de Leche',
            ],
            'Carnes, Pescados y Mariscos' => [
                'Carne de Res',
                'Pollo',
                'Cerdo',
                'Pescados',
                'Mariscos',
                'Embutidos y Fiambres',
            ],
            'Panadería y Pastelería' => [
                'Pan Fresco',
                'Pan Empacado',
                'Tortas y Ponqués',
                'Galletería',
                'Repostería',
            ],
            'Bebidas' => [
                'Gaseosas',
                'Jugos y Néctares',
                'Aguas',
                'Café, Té e Infusiones',
                'Bebidas Energizantes',
                'Cervezas y Licores',
            ],
            'Congelados' => [
                'Helados',
                'Vegetales Congelados',
                'Comidas Listas',
                'Papas y Snacks Congelados',
            ],
            'Snacks y Dulces' => [
                'Papas y Pasabocas Salados',
                'Chocolates',
                'Dulces y Confites',
                'Galletas Dulces',
                'Barras de Cereal',
            ],
            'Aseo del Hogar' => [
                'Detergentes y Suavizantes',
                'Limpieza de Cocina',
                'Limpieza de Baño',
                'Papel Higiénico y Servilletas',
                'Bolsas de Basura',
                'Insecticidas',
            ],
            'Cuidado Personal' => [
                'Higiene Bucal',
                'Shampoo y Acondicionador',
                'Jabones y Geles de Baño',
                'Desodorantes',
                'Cuidado de la Piel',
                'Afeitada y Depilación',
            ],
            'Bebé y Maternidad' => [
                'Pañales y Toallitas',
                'Fórmulas y Alimentos Infantiles',
                'Higiene del Bebé',
                'Accesorios para Bebé',
            ],
            'Mascotas' => [
                'Alimento para Perros',
                'Alimento para Gatos',
                'Accesorios y Juguetes',
                'Higiene para Mascotas',
            ],
            'Hogar y Bazar' => [
                'Utensilios de Cocina',
                'Desechables',
                'Ferretería Básica',
                'Pilas y Bombillos',
            ],
        ];

        foreach ($categories as $categoryName => $subcategories) {
            $category = Category::firstOrCreate(['name' => $categoryName]);

            foreach ($subcategories as $subcategoryName) {
                Subcategory::firstOrCreate([
                    'name' => $subcategoryName,
                    'category_id' => $category->id,
                ]);
            }
        }
    }
}
