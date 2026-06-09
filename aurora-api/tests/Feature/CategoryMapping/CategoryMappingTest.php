<?php

use App\Models\CategoryMapping;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

it('lists category mappings for the authenticated user', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();

    CategoryMapping::factory()->for($user)->count(2)->create();
    CategoryMapping::factory()->for($otherUser)->create();

    Sanctum::actingAs($user);

    $response = $this->getJson('/api/category-mappings');

    $response->assertOk()
        ->assertJsonCount(2, 'data')
        ->assertJsonStructure([
            'data' => [
                '*' => ['id', 'bling_category_name', 'shopify_tag_or_collection'],
            ],
        ]);
});

it('creates a category mapping for the authenticated user', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    $response = $this->postJson('/api/category-mappings', [
        'bling_category_name' => 'Eletrônicos',
        'shopify_tag_or_collection' => 'tech',
    ]);

    $response->assertCreated()
        ->assertJsonPath('data.bling_category_name', 'Eletrônicos')
        ->assertJsonPath('data.shopify_tag_or_collection', 'tech');

    $this->assertDatabaseHas('category_mappings', [
        'user_id' => $user->id,
        'bling_category_name' => 'Eletrônicos',
        'shopify_tag_or_collection' => 'tech',
    ]);
});

it('prevents duplicate bling category names for the same user', function () {
    $user = User::factory()->create();
    CategoryMapping::factory()->for($user)->create([
        'bling_category_name' => 'Eletrônicos',
    ]);

    Sanctum::actingAs($user);

    $response = $this->postJson('/api/category-mappings', [
        'bling_category_name' => 'Eletrônicos',
        'shopify_tag_or_collection' => 'electronics',
    ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['bling_category_name']);
});

it('updates a category mapping for the authenticated user', function () {
    $user = User::factory()->create();
    $mapping = CategoryMapping::factory()->for($user)->create([
        'bling_category_name' => 'Eletrônicos',
        'shopify_tag_or_collection' => 'tech',
    ]);

    Sanctum::actingAs($user);

    $response = $this->putJson("/api/category-mappings/{$mapping->id}", [
        'shopify_tag_or_collection' => 'electronics',
    ]);

    $response->assertOk()
        ->assertJsonPath('data.shopify_tag_or_collection', 'electronics');

    expect($mapping->fresh()->shopify_tag_or_collection)->toBe('electronics');
});

it('deletes a category mapping for the authenticated user', function () {
    $user = User::factory()->create();
    $mapping = CategoryMapping::factory()->for($user)->create();

    Sanctum::actingAs($user);

    $response = $this->deleteJson("/api/category-mappings/{$mapping->id}");

    $response->assertOk();
    $this->assertDatabaseMissing('category_mappings', ['id' => $mapping->id]);
});

it('returns not found when accessing another users category mapping', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $mapping = CategoryMapping::factory()->for($otherUser)->create();

    Sanctum::actingAs($user);

    $this->putJson("/api/category-mappings/{$mapping->id}", [
        'shopify_tag_or_collection' => 'blocked',
    ])->assertNotFound();

    $this->deleteJson("/api/category-mappings/{$mapping->id}")
        ->assertNotFound();
});

it('rejects unauthenticated category mapping requests', function () {
    $this->getJson('/api/category-mappings')->assertUnauthorized();

    $this->postJson('/api/category-mappings', [
        'bling_category_name' => 'Eletrônicos',
        'shopify_tag_or_collection' => 'tech',
    ])->assertUnauthorized();
});
