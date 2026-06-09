<?php

use App\Models\StoreCredential;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\Sanctum;

it('creates store credentials for the authenticated user', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    $response = $this->postJson('/api/store-credentials', [
        'bling_api_key' => 'bling-secret-key',
        'shopify_domain' => 'my-store.myshopify.com',
        'shopify_access_token' => 'shpat_test_token',
        'shopify_api_secret' => 'shpss_test_secret',
    ]);

    $response->assertCreated()
        ->assertJsonPath('data.shopify_domain', 'my-store.myshopify.com')
        ->assertJsonPath('data.has_bling_api_key', true)
        ->assertJsonPath('data.has_shopify_access_token', true)
        ->assertJsonPath('data.has_shopify_api_secret', true)
        ->assertJsonMissing(['bling_api_key', 'shopify_access_token', 'shopify_api_secret']);

    $raw = DB::table('store_credentials')->first();

    expect($raw->bling_api_key)->not->toBe('bling-secret-key');
    expect($raw->shopify_access_token)->not->toBe('shpat_test_token');
});

it('prevents duplicate store credentials on create', function () {
    $user = User::factory()->create();
    StoreCredential::factory()->for($user)->create();
    Sanctum::actingAs($user);

    $response = $this->postJson('/api/store-credentials', [
        'bling_api_key' => 'bling-secret-key',
        'shopify_domain' => 'my-store.myshopify.com',
        'shopify_access_token' => 'shpat_test_token',
    ]);

    $response->assertUnprocessable();
});

it('shows store credentials without exposing secrets', function () {
    $user = User::factory()->create();
    StoreCredential::factory()->for($user)->create();
    Sanctum::actingAs($user);

    $response = $this->getJson('/api/store-credentials');

    $response->assertOk()
        ->assertJsonPath('data.has_bling_api_key', true)
        ->assertJsonMissing(['bling_api_key', 'shopify_access_token', 'shopify_api_secret']);
});

it('returns null when store credentials are not configured', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    $response = $this->getJson('/api/store-credentials');

    $response->assertOk()
        ->assertJsonPath('data', null);
});

it('updates store credentials without overwriting omitted secrets', function () {
    $user = User::factory()->create();
    $credential = StoreCredential::factory()->for($user)->create([
        'bling_api_key' => 'original-bling-key',
        'shopify_access_token' => 'original-token',
        'shopify_api_secret' => 'original-secret',
    ]);
    Sanctum::actingAs($user);

    $response = $this->putJson('/api/store-credentials', [
        'shopify_domain' => 'updated-store.myshopify.com',
    ]);

    $response->assertOk()
        ->assertJsonPath('data.shopify_domain', 'updated-store.myshopify.com')
        ->assertJsonPath('data.has_bling_api_key', true);

    expect($credential->fresh()->bling_api_key)->toBe('original-bling-key');
    expect($credential->fresh()->shopify_access_token)->toBe('original-token');
});

it('returns not found when updating missing store credentials', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    $response = $this->putJson('/api/store-credentials', [
        'shopify_domain' => 'updated-store.myshopify.com',
    ]);

    $response->assertNotFound();
});

it('deletes store credentials for the authenticated user', function () {
    $user = User::factory()->create();
    StoreCredential::factory()->for($user)->create();
    Sanctum::actingAs($user);

    $response = $this->deleteJson('/api/store-credentials');

    $response->assertOk();
    $this->assertDatabaseMissing('store_credentials', ['user_id' => $user->id]);
});

it('rejects unauthenticated store credential requests', function () {
    $this->postJson('/api/store-credentials', [
        'bling_api_key' => 'bling-secret-key',
        'shopify_domain' => 'my-store.myshopify.com',
        'shopify_access_token' => 'shpat_test_token',
    ])->assertUnauthorized();
});
