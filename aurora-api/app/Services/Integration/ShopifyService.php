<?php

namespace App\Services\Integration;

use App\Connectors\Shopify\ShopifyConnector;
use App\Domain\Entities\ProdutoUniversal;
use App\Services\Integration\Exceptions\IntegrationException;
use Illuminate\Support\Facades\Http;

class ShopifyService
{
    public function __construct(
        private readonly string $shopifyDomain,
        private readonly string $accessToken,
        private readonly ShopifyConnector $connector = new ShopifyConnector,
    ) {}

    public function findProductIdBySku(string $sku): ?string
    {
        $response = $this->graphqlRequest(
            $this->connector->findProductBySkuQuery(),
            ['query' => "sku:{$sku}"],
        );

        $productId = data_get(
            $response,
            'data.productVariants.edges.0.node.product.id',
        );

        return is_string($productId) ? $productId : null;
    }

    /**
     * @return array<string, mixed>
     */
    public function updateProductEnrichment(string $shopifyProductId, ProdutoUniversal $product): array
    {
        $payload = $this->connector->toUpdatePayload($product, $shopifyProductId);

        $response = $this->graphqlRequest(
            $payload['query'],
            $payload['variables'],
        );

        $userErrors = data_get($response, 'data.productUpdate.userErrors', []);

        if (is_array($userErrors) && $userErrors !== []) {
            $message = collect($userErrors)
                ->pluck('message')
                ->filter()
                ->implode(' ');

            throw IntegrationException::fromResponse('Shopify', 422, $message ?: 'Shopify rejected the update.');
        }

        return data_get($response, 'data.productUpdate.product', []);
    }

    /**
     * @param  array<string, mixed>  $variables
     * @return array<string, mixed>
     */
    private function graphqlRequest(string $query, array $variables = []): array
    {
        $response = Http::withHeaders([
            'X-Shopify-Access-Token' => $this->accessToken,
            'Content-Type' => 'application/json',
        ])
            ->acceptJson()
            ->post($this->graphqlEndpoint(), [
                'query' => $query,
                'variables' => $variables,
            ]);

        if ($response->status() === 401) {
            throw IntegrationException::invalidCredentials('Shopify');
        }

        if (! $response->successful()) {
            throw IntegrationException::fromResponse(
                'Shopify',
                $response->status(),
                data_get($response->json(), 'errors.0.message'),
            );
        }

        $body = $response->json();

        if (isset($body['errors']) && is_array($body['errors']) && $body['errors'] !== []) {
            throw IntegrationException::fromResponse(
                'Shopify',
                422,
                data_get($body, 'errors.0.message'),
            );
        }

        return is_array($body) ? $body : [];
    }

    private function graphqlEndpoint(): string
    {
        $domain = str_replace(['https://', 'http://'], '', $this->shopifyDomain);
        $version = config('integrations.shopify.api_version', '2024-10');

        return "https://{$domain}/admin/api/{$version}/graphql.json";
    }
}
