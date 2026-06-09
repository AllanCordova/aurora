<?php

use App\Connectors\Bling\BlingConnector;

it('maps bling product payload into produto universal', function () {
    $connector = new BlingConnector;

    $product = $connector->toUniversal([
        'id' => 16504923529,
        'nome' => 'Camiseta Básica',
        'codigo' => 'CAM-001',
        'preco' => 59.9,
        'descricaoCurta' => 'Camiseta 100% algodão',
        'categoria' => [
            'descricao' => 'Eletrônicos',
        ],
    ]);

    expect($product->sku)->toBe('CAM-001');
    expect($product->title)->toBe('Camiseta Básica');
    expect($product->category)->toBe('Eletrônicos');
    expect($product->price)->toBe(59.9);
    expect($product->sourcePlatform)->toBe('bling');
});

it('fails gracefully when bling payload has no sku', function () {
    $connector = new BlingConnector;

    $product = $connector->toUniversal([
        'nome' => 'Produto sem SKU',
    ]);

    expect($product->sku)->toBe('');
});
