<?php

use App\Services\Integration\BlingService;
use App\Services\Integration\Exceptions\IntegrationException;
use Illuminate\Support\Facades\Http;

function blingFixture(string $filename): array
{
    $path = base_path("tests/Fixtures/Bling/{$filename}");

    return json_decode(file_get_contents($path), true, 512, JSON_THROW_ON_ERROR);
}

it('fetches paginated products from bling api', function () {
    Http::fake([
        'api.bling.com.br/Api/v3/produtos*' => Http::response(blingFixture('product-list-page-1.json'), 200),
    ]);

    $service = new BlingService(apiKey: 'bling-test-token');
    $page = $service->fetchProducts(page: 1, limit: 2);

    expect($page->products)->toHaveCount(2);
    expect($page->products[0]->sku)->toBe('CAM-001');
    expect($page->products[1]->sku)->toBe('GAR-002');
    expect($page->page)->toBe(1);
    expect($page->hasMore)->toBeTrue();

    Http::assertSent(function ($request) {
        return $request->hasHeader('Authorization', 'Bearer bling-test-token')
            && str_contains($request->url(), 'pagina=1')
            && str_contains($request->url(), 'limite=2');
    });
});

it('returns empty page when bling has no products', function () {
    Http::fake([
        'api.bling.com.br/Api/v3/produtos*' => Http::response(blingFixture('product-list-empty.json'), 200),
    ]);

    $service = new BlingService(apiKey: 'bling-test-token');
    $page = $service->fetchProducts();

    expect($page->products)->toBe([]);
    expect($page->hasMore)->toBeFalse();
});

it('throws when bling credentials are invalid', function () {
    Http::fake([
        'api.bling.com.br/Api/v3/produtos*' => Http::response(['error' => ['message' => 'Unauthorized']], 401),
    ]);

    $service = new BlingService(apiKey: 'invalid-token');

    expect(fn () => $service->fetchProducts())
        ->toThrow(IntegrationException::class, 'Invalid credentials for Bling');
});

it('throws when bling api returns server error', function () {
    Http::fake([
        'api.bling.com.br/Api/v3/produtos*' => Http::response(['error' => ['message' => 'Unavailable']], 503),
    ]);

    $service = new BlingService(apiKey: 'bling-test-token');

    expect(fn () => $service->fetchProducts())
        ->toThrow(IntegrationException::class);
});
