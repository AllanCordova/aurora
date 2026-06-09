<?php

namespace Database\Factories;

use App\Models\CategoryMapping;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CategoryMapping>
 */
class CategoryMappingFactory extends Factory
{
    protected $model = CategoryMapping::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'bling_category_name' => fake()->words(2, true),
            'shopify_tag_or_collection' => fake()->slug(),
        ];
    }
}
