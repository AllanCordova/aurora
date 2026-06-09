<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StoreCredentialResource extends JsonResource
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
            'shopify_domain' => $this->shopify_domain,
            'has_bling_api_key' => filled($this->bling_api_key),
            'has_shopify_access_token' => filled($this->shopify_access_token),
            'has_shopify_api_secret' => filled($this->shopify_api_secret),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
