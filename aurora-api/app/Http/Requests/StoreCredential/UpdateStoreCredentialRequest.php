<?php

namespace App\Http\Requests\StoreCredential;

use Illuminate\Foundation\Http\FormRequest;

class UpdateStoreCredentialRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'bling_api_key' => ['sometimes', 'nullable', 'string', 'max:500'],
            'shopify_domain' => ['sometimes', 'required', 'string', 'max:255', 'regex:/^[a-zA-Z0-9][a-zA-Z0-9\-]*\.myshopify\.com$/'],
            'shopify_access_token' => ['sometimes', 'nullable', 'string', 'max:500'],
            'shopify_api_secret' => ['sometimes', 'nullable', 'string', 'max:500'],
        ];
    }
}
