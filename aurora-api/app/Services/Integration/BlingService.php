<?php

namespace App\Services\Integration;

use App\Connectors\Bling\BlingConnector;
use App\Services\Integration\Exceptions\IntegrationException;
use Illuminate\Support\Facades\Http;

class BlingService
{
    public function __construct(
        private readonly string $apiKey,
        private readonly BlingConnector $connector = new BlingConnector,
    ) {}

    public function fetchProducts(int $page = 1, int $limit = 100): BlingProductsPage
    {
        $limit = min(max($limit, 1), 100);

        $response = Http::withToken($this->apiKey)
            ->acceptJson()
            ->get($this->endpoint('/produtos'), [
                'pagina' => $page,
                'limite' => $limit,
            ]);

        if ($response->status() === 401) {
            throw IntegrationException::invalidCredentials('Bling');
        }

        if (! $response->successful()) {
            throw IntegrationException::fromResponse(
                'Bling',
                $response->status(),
                data_get($response->json(), 'error.message'),
            );
        }

        $items = data_get($response->json(), 'data', []);

        if (! is_array($items)) {
            $items = [];
        }

        $products = array_map(
            fn (array $item) => $this->connector->toUniversal($item),
            $items,
        );

        return new BlingProductsPage(
            products: $products,
            page: $page,
            limit: $limit,
            hasMore: count($items) === $limit,
        );
    }

    private function endpoint(string $path): string
    {
        $baseUrl = rtrim((string) config('integrations.bling.base_url'), '/');

        return "{$baseUrl}{$path}";
    }
}
