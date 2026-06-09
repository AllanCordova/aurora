<?php

use App\Domain\Entities\ProdutoUniversal;
use App\Services\Integration\Exceptions\IntegrationException;
use App\Services\Integration\ShopifyService;
use Illuminate\Support\Facades\Http;

function shopifyFixture(string $filename): array
{
    $path = base_path("tests/Fixtures/Shopify/{$filename}");

    return json_decode(file_get_contents($path), true, 512, JSON_THROW_ON_ERROR);
}

it('finds shopify product id by sku via graphql', function () {
    Http::fake([
        '*/admin/api/*/graphql.json' => Http::response(shopifyFixture('find-product-by-sku.json'), 200),
    ]);

    $service = new ShopifyService(
        shopifyDomain: 'my-store.myshopify.com',
        accessToken: 'shpat_test_token',
    );

    $productId = $service->findProductIdBySku('CAM-001');

    expect($productId)->toBe('gid://shopify/Product/999');

    Http::assertSent(function ($request) {
        $body = $request->data();

        return isset($body['query'])
            && str_contains($body['query'], 'productVariants')
            && ($body['variables']['query'] ?? null) === 'sku:CAM-001';
    });
});

it('returns null when shopify product is not found by sku', function () {
    Http::fake([
        '*/admin/api/*/graphql.json' => Http::response(shopifyFixture('find-product-by-sku-not-found.json'), 200),
    ]);

    $service = new ShopifyService(
        shopifyDomain: 'my-store.myshopify.com',
        accessToken: 'shpat_test_token',
    );

    expect($service->findProductIdBySku('MISSING-SKU'))->toBeNull();
});

it('updates shopify product enrichment payload correctly', function () {
    Http::fake([
        '*/admin/api/*/graphql.json' => Http::response(shopifyFixture('update-product-success.json'), 200),
    ]);

    $service = new ShopifyService(
        shopifyDomain: 'my-store.myshopify.com',
        accessToken: 'shpat_test_token',
    );

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

    $result = $service->updateProductEnrichment('gid://shopify/Product/999', $product);

    expect($result['id'])->toBe('gid://shopify/Product/999');
    expect($result['tags'])->toContain('tech');

    Http::assertSent(function ($request) {
        $body = $request->data();

        return ($body['variables']['product']['id'] ?? null) === 'gid://shopify/Product/999'
            && ($body['variables']['product']['tags'] ?? null) === ['tech', 'existing-tag']
            && isset($body['variables']['product']['metafields']);
    });
});

it('throws when shopify credentials are invalid', function () {
    Http::fake([
        '*/admin/api/*/graphql.json' => Http::response(['errors' => [['message' => 'Invalid API key']]], 401),
    ]);

    $service = new ShopifyService(
        shopifyDomain: 'my-store.myshopify.com',
        accessToken: 'invalid-token',
    );

    expect(fn () => $service->findProductIdBySku('CAM-001'))
        ->toThrow(IntegrationException::class, 'Invalid credentials for Shopify');
});

it('throws when shopify returns user errors on update', function () {
    Http::fake([
        '*/admin/api/*/graphql.json' => Http::response(shopifyFixture('update-product-error.json'), 200),
    ]);

    $service = new ShopifyService(
        shopifyDomain: 'my-store.myshopify.com',
        accessToken: 'shpat_test_token',
    );

    $product = new ProdutoUniversal(
        sku: 'CAM-001',
        title: 'Camiseta Básica',
        tags: ['invalid tag'],
    );

    expect(fn () => $service->updateProductEnrichment('gid://shopify/Product/999', $product))
        ->toThrow(IntegrationException::class, 'Tag format is invalid.');
});
