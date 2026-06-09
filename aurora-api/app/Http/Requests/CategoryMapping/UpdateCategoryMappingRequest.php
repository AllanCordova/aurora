<?php

namespace App\Http\Requests\CategoryMapping;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCategoryMappingRequest extends FormRequest
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
        $mappingId = $this->route('category_mapping');

        return [
            'bling_category_name' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('category_mappings', 'bling_category_name')
                    ->where(fn ($query) => $query->where('user_id', $this->user()->id))
                    ->ignore($mappingId),
            ],
            'shopify_tag_or_collection' => ['sometimes', 'required', 'string', 'max:255'],
        ];
    }
}
