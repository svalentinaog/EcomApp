<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Subcategory;
use App\Models\Product;

class CatalogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Arreglo de datos
        $catalog = [
            'Despensa' => [
                'Granos y Cereales' => [
                    ['name' => 'Arroz Diana', 'sku' => 'DSP-GRC-001', 'price' => 3900, 'stock' => 100, 'description' => 'Arroz Diana blanco, un clásico de la cocina colombiana, ideal para el día a día, suelto y de excelente calidad.'],
                    ['name' => 'Arroz Roa', 'sku' => 'DSP-GRC-002', 'price' => 4100, 'stock' => 120, 'description' => 'Arroz Roa, el señor arroz. Grano entero y rendidor, perfecto para acompañar todas tus comidas familiares.'],
                    ['name' => 'Frijoles Diana', 'sku' => 'DSP-GRC-003', 'price' => 6500, 'stock' => 85, 'description' => 'Frijoles cargamanto Diana, de rápida cocción y excelente espesor, indispensables para una buena bandeja paisa.'],
                    ['name' => 'Lentejas el Potaje', 'sku' => 'DSP-GRC-004', 'price' => 4200, 'stock' => 90, 'description' => 'Lentejas El Potaje, ricas en hierro y proteína, ideales para sopas espesas y nutritivas con un gran sabor.'],
                    ['name' => 'Avena Quaker', 'sku' => 'DSP-GRC-005', 'price' => 5200, 'stock' => 60, 'description' => 'Avena molida Quaker, fuente de fibra y energía. Perfecta para preparar coladas, batidos o repostería saludable.'],
                ],
                'Pastas y Harinas' => [
                    ['name' => 'Pastas Doria', 'sku' => 'DSP-PYH-001', 'price' => 2800, 'stock' => 150, 'description' => 'Spaghetti Doria, pasta clásica fortificada con Nutrivit. No se pega ni se deshace, ideal para cualquier salsa.'],
                ],
            ],
            'Frutas y Verduras' => [
                'Frutas Frescas' => [
                    ['name' => 'Racimo de Banano', 'sku' => 'FYV-FRF-001', 'price' => 3500, 'stock' => 40, 'description' => 'Banano fresco y dulce por racimo. Excelente fuente de potasio y energía rápida para cualquier momento del día.'],
                    ['name' => 'Aguacate', 'sku' => 'FYV-FRF-002', 'price' => 4800, 'stock' => 35, 'description' => 'Aguacate fresco, cremoso y en su punto ideal de maduración. El acompañante perfecto para sopas, ensaladas y arepas.'],
                    ['name' => 'Maracuyá', 'sku' => 'FYV-FRF-003', 'price' => 3200, 'stock' => 50, 'description' => 'Maracuyá fresca (fruta de la pasión), con excelente acidez y pulpa abundante, ideal para jugos, postres y salsas.'],
                ]
            ]
        ];

        // Recorrer el arreglo para poblar la BD
        foreach ($catalog as $categoryName => $subcategories) {
            
            // 1. Crear o buscar la Categoría
            $category = Category::firstOrCreate(['name' => $categoryName]);

            foreach ($subcategories as $subcategoryName => $products) {
                
                // 2. Crear o buscar la Subcategoría asignándole la Categoría
                $subcategory = Subcategory::firstOrCreate([
                    'name' => $subcategoryName,
                    'category_id' => $category->id
                ]);

                // 3. Crear los Productos
                foreach ($products as $productData) {
                    Product::firstOrCreate(
                        ['sku' => $productData['sku']],
                        [
                            'name' => $productData['name'],
                            'description' => $productData['description'],
                            'price' => $productData['price'],
                            'stock' => $productData['stock'],
                            'subcategory_id' => $subcategory->id,
                            
                            // Los demás campos requeridos por tu BD que aún necesiten valor por defecto
                            'discount' => 0,
                            'rating' => 5,
                            'old_price' => null,
                        ]
                    );
                }
            }
        }
    }
}