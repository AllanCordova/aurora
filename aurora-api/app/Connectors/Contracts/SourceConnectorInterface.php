<?php

namespace App\Connectors\Contracts;

use App\Domain\Entities\ProdutoUniversal;

interface SourceConnectorInterface
{
    /**
     * @param  array<string, mixed>  $payload
     */
    public function toUniversal(array $payload): ProdutoUniversal;
}
