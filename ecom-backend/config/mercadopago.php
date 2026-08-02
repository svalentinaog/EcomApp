<?php

return [

    'public_key' => env('MERCADOPAGO_PUBLIC_KEY'),

    'access_token' => env('MERCADOPAGO_ACCESS_TOKEN'),

    'webhook_secret' => env('MERCADOPAGO_WEBHOOK_SECRET'),

    'webhook_url' => env('MERCADOPAGO_WEBHOOK_URL'),

    'frontend_url' => env('FRONTEND_URL', 'https://beeshop-market.vercel.app'),

];