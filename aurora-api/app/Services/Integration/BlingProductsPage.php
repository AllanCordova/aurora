<?php

namespace App\Services\Integration;

use App\Domain\Entities\ProdutoUniversal;

readonly class BlingProductsPage
{
    /**
     * @param  array<int, ProdutoUniversal>  $products
     */
    public function __construct(
        public array $products,
        public int $page,
        public int $limit,
        public bool $hasMore,
    ) {}
}
