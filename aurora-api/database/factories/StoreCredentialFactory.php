<?php

namespace Database\Factories;

use App\Models\StoreCredential;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<StoreCredential>
 */
class StoreCredentialFactory extends Factory
{
    protected $model = StoreCredential::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'bling_api_key' => 'bling-'.fake()->uuid(),
            'shopify_domain' => fake()->slug().'.myshopify.com',
            'shopify_access_token' => 'shpat_'.fake()->sha256(),
            'shopify_api_secret' => 'shpss_'.fake()->sha256(),
        ];
    }
}
