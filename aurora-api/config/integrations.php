<?php

return [

    'bling' => [
        'base_url' => env('BLING_API_BASE_URL', 'https://api.bling.com.br/Api/v3'),
        'default_page_size' => 100,
    ],

    'shopify' => [
        'api_version' => env('SHOPIFY_API_VERSION', '2024-10'),
    ],

];
