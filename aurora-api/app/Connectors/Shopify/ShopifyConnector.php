<?php

namespace App\Connectors\Shopify;

use App\Connectors\Contracts\DestinationConnectorInterface;
use App\Domain\Entities\ProdutoUniversal;

class ShopifyConnector implements DestinationConnectorInterface
{
    public function toUpdatePayload(ProdutoUniversal $product, string $shopifyProductId): array
    {
        $productInput = [
            'id' => $shopifyProductId,
            'tags' => $product->tags,
        ];

        if ($product->metafields !== []) {
            $productInput['metafields'] = array_map(
                fn (array $metafield) => [
                    'namespace' => $metafield['namespace'],
                    'key' => $metafield['key'],
                    'value' => $metafield['value'],
                    'type' => $metafield['type'],
                ],
                $product->metafields,
            );
        }

        return [
            'query' => $this->productUpdateMutation(),
            'variables' => [
                'product' => $productInput,
            ],
        ];
    }

    public function buildGraphqlQueries(): array
    {
        return [
            'find_product_by_sku' => $this->findProductBySkuQuery(),
            'update_product' => $this->productUpdateMutation(),
        ];
    }

    public function findProductBySkuQuery(): string
    {
        return <<<'GRAPHQL'
        query FindProductBySku($query: String!) {
          productVariants(first: 1, query: $query) {
            edges {
              node {
                id
                sku
                product {
                  id
                  tags
                }
              }
            }
          }
        }
        GRAPHQL;
    }

    public function productUpdateMutation(): string
    {
        return <<<'GRAPHQL'
        mutation UpdateProductEnrichment($product: ProductUpdateInput!) {
          productUpdate(product: $product) {
            product {
              id
              tags
            }
            userErrors {
              field
              message
            }
          }
        }
        GRAPHQL;
    }
}
