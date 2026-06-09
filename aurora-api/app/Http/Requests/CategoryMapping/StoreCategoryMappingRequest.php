<?php

namespace App\Http\Requests\CategoryMapping;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCategoryMappingRequest extends FormRequest
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
            'bling_category_name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('category_mappings', 'bling_category_name')
                    ->where(fn ($query) => $query->where('user_id', $this->user()->id)),
            ],
            'shopify_tag_or_collection' => ['required', 'string', 'max:255'],
        ];
    }
}
