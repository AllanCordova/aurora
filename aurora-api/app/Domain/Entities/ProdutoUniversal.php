<?php

namespace App\Domain\Entities;

readonly class ProdutoUniversal
{
    /**
     * @param  array<int, string>  $tags
     * @param  array<int, array{namespace: string, key: string, value: string, type: string}>  $metafields
     */
    public function __construct(
        public string $sku,
        public string $title,
        public ?string $description = null,
        public ?string $category = null,
        public ?float $price = null,
        public array $tags = [],
        public array $metafields = [],
        public ?string $externalId = null,
        public ?string $sourcePlatform = null,
    ) {}

    /**
     * @param  array<int, string>  $tags
     */
    public function withTags(array $tags): self
    {
        return new self(
            sku: $this->sku,
            title: $this->title,
            description: $this->description,
            category: $this->category,
            price: $this->price,
            tags: array_values(array_unique($tags)),
            metafields: $this->metafields,
            externalId: $this->externalId,
            sourcePlatform: $this->sourcePlatform,
        );
    }

    /**
     * @param  array<int, array{namespace: string, key: string, value: string, type: string}>  $metafields
     */
    public function withMetafields(array $metafields): self
    {
        return new self(
            sku: $this->sku,
            title: $this->title,
            description: $this->description,
            category: $this->category,
            price: $this->price,
            tags: $this->tags,
            metafields: $metafields,
            externalId: $this->externalId,
            sourcePlatform: $this->sourcePlatform,
        );
    }
}
