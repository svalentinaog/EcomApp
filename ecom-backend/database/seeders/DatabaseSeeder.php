<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Product;
use App\Models\Address;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\CartItem;
use App\Models\ProductImage;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // 0. Ejecutar primero el seeder del catálogo para tener productos reales
        $this->call([
            CatalogSeeder::class,
        ]);

        // 1. CREAR USUARIOS (Admin y Customer), cada uno con 2 direcciones
        $admin = User::firstOrCreate(
            ['email' => env('ADMIN_EMAIL', 'admin@ecom.com')],
            [
                'name' => env('ADMIN_NAME', 'Administrador'),
                'password' => Hash::make(env('ADMIN_PASSWORD', 'Admin@123')),
                'role' => 'admin',
                'birth_date' => '1990-01-01',
            ]
        );
        Address::factory(2)->create(['user_id' => $admin->id]);

        $customer = User::firstOrCreate(
            ['email' => 'customer@ecom.com'],
            [
                'name' => 'Cliente de Pruebas',
                'password' => Hash::make('Customer@123'),
                'role' => 'customer',
                'birth_date' => '1995-05-15',
            ]
        );
        Address::factory(2)->create(['user_id' => $customer->id]);

        // Agrupamos los usuarios para asignarles el carrito y las órdenes fácilmente
        $users = [$admin, $customer];

        // 2. OBTENER PRODUCTOS REALES DE LA BASE DE DATOS (Tomamos los primeros 2 del catálogo)
        $products = Product::take(2)->get();

        // Asegurarnos de que tengan al menos una imagen asociada para la orden/carrito si lo requiere
        foreach ($products as $product) {
            if ($product->images()->count() === 0) {
                ProductImage::factory()->create(['product_id' => $product->id]);
            }
        }

        // 3. ASIGNAR LOS PRODUCTOS AL CARRITO Y A UNA ORDEN DE CADA USUARIO
        foreach ($users as $user) {
            $defaultAddress = $user->addresses()->first();

            // Carrito: agregar los productos obtenidos
            foreach ($products as $product) {
                CartItem::create([
                    'user_id' => $user->id,
                    'product_id' => $product->id,
                    'quantity' => 2,
                ]);
            }

            // Orden: crear una orden con los productos
            $subtotal = $products->sum(fn($p) => $p->price * 1);
            $cost = 10.00;

            $order = Order::create([
                'user_id' => $user->id,
                'address_id' => $defaultAddress->id,
                'payment_status' => 'approved',
                'payment_method' => 'credit_card',
                'recipient_full_name' => $defaultAddress->recipient_full_name,
                'phone' => $defaultAddress->phone,
                'address_line' => $defaultAddress->address_line,
                'department' => $defaultAddress->department,
                'city' => $defaultAddress->city,
                'neighborhood' => $defaultAddress->neighborhood,
                'complement' => $defaultAddress->complement,
                'subtotal' => $subtotal,
                'cost' => $cost,
                'total' => $subtotal + $cost,
            ]);

            // Items de la orden
            foreach ($products as $product) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => 1,
                    'unit_price' => $product->price,
                    'subtotal' => $product->price * 1,
                ]);
            }
        }
    }
}