<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
        // 1. READ (Todos los productos)
        public function index(){
            // Le pedimos al Modelo todos los productos de alimentación
            // 'with('subcategory')' hace que también traiga a qué subcategoría pertenece cada uno
            // Reemplazamos get() por paginate(10) para activar la paginación automatizada
            $products = Product::with('subcategory.category', 'productImages')->paginate(10); // 👈 es subcategory pq es el nombre de la función (la relación) que cree dentro del archivo app/Models/Product.php.

            // 3. Entregamos la respuesta en formato JSON (listo para que cualquier frontend lo lea)
            return response()->json([
                'success' => true,
                'data' => $products
            ]); 
        }

        // 2. CREATE (Crear un producto)
        public function store(Request $request)
        {
            // 1. Validamos estrictamente los datos que entran
            $validatedData = $request->validate([
                'name'           => 'required|string|max:255',
                'description'    => 'nullable|string',
                'price'          => 'required|numeric|min:0',
                'old_price'      => 'nullable|numeric|min:0',
                'discount'       => 'nullable|integer|min:0|max:100',
                'rating'         => 'nullable|integer|min:1|max:5',
                'sku'            => 'required|string|unique:products,sku',
                'stock'          => 'required|integer|min:0',
                'subcategory_id' => 'required|exists:subcategories,id',
                // REGLAS PARA LAS IMAGENES:
                'product_images'         => 'nullable|array', // Validamos que venga como un arreglo
                'product_images.*'       => 'image|mimes:jpeg,png,jpg|max:2048' // Cada archivo debe ser una imagen de max 2MB
            ]);

            // 2. Creamos el producto en la base de datos
            $product = Product::create($validatedData);

            // 3. Guardamos las imágenes en la base de datos
            if ($request->hasFile('product_images')) {
                foreach ($request->file('product_images') as $file) {
                    // Se guarda el archivo físico en storage/app/public/products
                    $path = $file->store('products', 'public');

                    // Insertamos usando el nombre de la columna: "url_image"
                    $product->productImages()->create([
                        'url_image' => $path 
                    ]);
                }
            }

            // 4. Cargamos relaciones para la respuesta final
            $product->load('subcategory.category', 'productImages');

            return response()->json([
                'success' => true,
                'message' => 'Producto creado correctamente',
                'data'    => $product
            ], 201); // Creado con éxito"
        }

        // 3. READ (Un producto en particular)
        public function show($id)
        {
            // Buscamos el producto trayendo también su subcategoría e imágenes anidadas
            $product = Product::with(['subcategory.category', 'productImages'])->find($id);

            // Si el id no existe en la base de datos, manejamos el error limpiamente
            if (!$product) {
                return response()->json([
                    'success' => false,
                    'message' => 'El producto que estas intentando ver no existe'
                ], 404); // Código 404: Not Found
            }

            return response()->json([
                'success' => true,
                'data'    => $product
            ]);
        }

        // 3. UPDATE (Actualizar un producto)
        public function update(Request $request, $id) {

            $product = Product::find($id);

            // Si el request está vacío, detenemos la ejecución
            if (empty($request->all())) {
                return response()->json([
                    'success' => false,
                    'message' => 'No se enviaron datos para actualizar'
                ], 422);
            }

            if (!$product) {
                return response()->json([
                    'success' => false,
                    'message' => 'El producto que estas intentando actualizar no existe'
                ], 404);
            }

            // 'sometimes' significa: valida esta regla solo si el campo viene en la petición
            $validatedData = $request->validate([
                'name'           => 'sometimes|required|string|max:255',
                'description'    => 'nullable|string',
                'price'          => 'sometimes|required|numeric|min:0',
                'old_price'      => 'nullable|numeric|min:0',
                'discount'       => 'nullable|integer|min:0|max:100',
                'rating'         => 'sometimes|integer|min:1|max:5',
                'sku'            => 'sometimes|required|string|unique:products,sku,' . $id,
                'stock'          => 'sometimes|required|integer|min:0',
                'subcategory_id' => 'sometimes|required|exists:subcategories,id',
            ]);

            $product->update($validatedData);

            return response()->json([
                'success' => true,
                'message' => 'Producto actualizado correctamente',
                'data'    => $product
            ]);
        }

        // 4. DELETE (Eliminar un producto)
        public function destroy($id) {
            $product = Product::find($id);

            if (!$product) {
                return response()->json([
                    'success' => false,
                    'message' => 'El producto que estas intentando eliminar no existe'
                ], 404);
            }

            $product->delete();

            return response()->json([
                'success' => true,
                'message' => 'Producto eliminado exitosamente'
            ]);
        }
}

// ¿Que es la Inyección de Dependencias?
// Respuesta: Es una técnica de diseño que permite a una clase obtener sus dependencias (o servicios) desde fuera de sí, en lugar de crearlas dentro de sí misma.