<?php

namespace App\Services\Mapping;

use App\Domain\Entities\ProdutoUniversal;
use App\Models\CategoryMapping;
use Illuminate\Support\Collection;

class ProductEnrichmentMapper
{
    /**
     * @param  Collection<int, CategoryMapping>  $mappings
     */
    public function apply(ProdutoUniversal $product, Collection $mappings): ProdutoUniversal
    {
        if ($product->category === null || $product->category === '') {
            return $this->appendSourceMetafields($product);
        }

        $tags = $product->tags;

        foreach ($mappings as $mapping) {
            if ($mapping->bling_category_name === $product->category) {
                $tags[] = $mapping->shopify_tag_or_collection;
            }
        }

        return $this->appendSourceMetafields(
            $product->withTags($tags),
        );
    }

    private function appendSourceMetafields(ProdutoUniversal $product): ProdutoUniversal
    {
        $metafields = $product->metafields;

        if ($product->category) {
            $metafields[] = [
                'namespace' => 'aurora',
                'key' => 'bling_category',
                'value' => $product->category,
                'type' => 'single_line_text_field',
            ];
        }

        if ($product->description) {
            $metafields[] = [
                'namespace' => 'aurora',
                'key' => 'bling_description',
                'value' => $product->description,
                'type' => 'single_line_text_field',
            ];
        }

        return $product->withMetafields($metafields);
    }
}
