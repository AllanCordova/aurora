<?php

namespace App\Connectors\Contracts;

use App\Domain\Entities\ProdutoUniversal;

interface DestinationConnectorInterface
{
    /**
     * @return array<string, mixed>
     */
    public function toUpdatePayload(ProdutoUniversal $product, string $shopifyProductId): array;

    /**
     * @return array<int, string>
     */
    public function buildGraphqlQueries(): array;
}
