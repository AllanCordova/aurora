<?php

use App\Connectors\Shopify\ShopifyConnector;
use App\Domain\Entities\ProdutoUniversal;

it('builds shopify product update payload from produto universal', function () {
    $connector = new ShopifyConnector;

    $product = new ProdutoUniversal(
        sku: 'CAM-001',
        title: 'Camiseta Básica',
        tags: ['tech', 'existing-tag'],
        metafields: [
            [
                'namespace' => 'aurora',
                'key' => 'bling_category',
                'value' => 'Eletrônicos',
                'type' => 'single_line_text_field',
            ],
        ],
    );

    $payload = $connector->toUpdatePayload($product, 'gid://shopify/Product/999');

    expect($payload['variables']['product']['id'])->toBe('gid://shopify/Product/999');
    expect($payload['variables']['product']['tags'])->toBe(['tech', 'existing-tag']);
    expect($payload['variables']['product']['metafields'])->toHaveCount(1);
    expect($payload['query'])->toContain('productUpdate');
});
