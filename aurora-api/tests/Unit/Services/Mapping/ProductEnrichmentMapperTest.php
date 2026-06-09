<?php

use App\Domain\Entities\ProdutoUniversal;
use App\Models\CategoryMapping;
use App\Models\User;
use App\Services\Mapping\ProductEnrichmentMapper;

it('applies category mapping tags to produto universal', function () {
    $user = User::factory()->create();

    $mappings = CategoryMapping::factory()
        ->for($user)
        ->createMany([
            [
                'bling_category_name' => 'Eletrônicos',
                'shopify_tag_or_collection' => 'tech',
            ],
            [
                'bling_category_name' => 'Casa',
                'shopify_tag_or_collection' => 'home',
            ],
        ]);

    $mapper = new ProductEnrichmentMapper;

    $enriched = $mapper->apply(
        new ProdutoUniversal(
            sku: 'CAM-001',
            title: 'Camiseta',
            category: 'Eletrônicos',
            description: 'Descrição curta',
        ),
        $mappings,
    );

    expect($enriched->tags)->toContain('tech');
    expect($enriched->metafields)->not->toBeEmpty();
    expect(collect($enriched->metafields)->pluck('key'))->toContain('bling_category');
});

it('keeps produto universal unchanged when category has no mapping', function () {
    $mapper = new ProductEnrichmentMapper;

    $product = new ProdutoUniversal(
        sku: 'CAM-001',
        title: 'Camiseta',
        category: 'Sem Mapeamento',
    );

    $enriched = $mapper->apply($product, collect());

    expect($enriched->tags)->toBe([]);
    expect(collect($enriched->metafields)->pluck('key'))->toContain('bling_category');
});
