<?php

namespace App\Http\Requests\StoreCredential;

use Illuminate\Foundation\Http\FormRequest;

class StoreStoreCredentialRequest extends FormRequest
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
            'bling_api_key' => ['required', 'string', 'max:500'],
            'shopify_domain' => ['required', 'string', 'max:255', 'regex:/^[a-zA-Z0-9][a-zA-Z0-9\-]*\.myshopify\.com$/'],
            'shopify_access_token' => ['required', 'string', 'max:500'],
            'shopify_api_secret' => ['nullable', 'string', 'max:500'],
        ];
    }
}
