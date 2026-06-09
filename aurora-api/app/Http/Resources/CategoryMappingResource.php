<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryMappingResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'bling_category_name' => $this->bling_category_name,
            'shopify_tag_or_collection' => $this->shopify_tag_or_collection,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
