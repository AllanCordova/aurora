<?php

namespace App\Connectors\Bling;

use App\Connectors\Contracts\SourceConnectorInterface;
use App\Domain\Entities\ProdutoUniversal;

class BlingConnector implements SourceConnectorInterface
{
    /**
     * @param  array<string, mixed>  $payload
     */
    public function toUniversal(array $payload): ProdutoUniversal
    {
        $category = data_get($payload, 'categoria.descricao')
            ?? data_get($payload, 'categoria.nome')
            ?? data_get($payload, 'categoria');

        if (is_array($category)) {
            $category = $category['descricao'] ?? $category['nome'] ?? null;
        }

        return new ProdutoUniversal(
            sku: (string) ($payload['codigo'] ?? $payload['sku'] ?? ''),
            title: (string) ($payload['nome'] ?? ''),
            description: $payload['descricaoCurta'] ?? $payload['descricao'] ?? null,
            category: is_string($category) ? $category : null,
            price: isset($payload['preco']) ? (float) $payload['preco'] : null,
            externalId: isset($payload['id']) ? (string) $payload['id'] : null,
            sourcePlatform: 'bling',
        );
    }
}
