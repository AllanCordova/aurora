<?php

use App\Models\StoreCredential;
use App\Models\User;
use Illuminate\Support\Facades\DB;

it('encrypts credentials at rest and decrypts on read', function () {
    $user = User::factory()->create();
    $plainKey = 'bling-test-key-abc';
    $plainToken = 'shpat_test_token_xyz';
    $plainSecret = 'shpss_test_secret_123';

    $credential = StoreCredential::factory()->for($user)->create([
        'bling_api_key' => $plainKey,
        'shopify_access_token' => $plainToken,
        'shopify_api_secret' => $plainSecret,
    ]);

    $raw = DB::table('store_credentials')->where('id', $credential->id)->first();

    expect($raw->bling_api_key)->not->toBe($plainKey);
    expect($raw->shopify_access_token)->not->toBe($plainToken);
    expect($raw->shopify_api_secret)->not->toBe($plainSecret);

    $fresh = $credential->fresh();

    expect($fresh->bling_api_key)->toBe($plainKey);
    expect($fresh->shopify_access_token)->toBe($plainToken);
    expect($fresh->shopify_api_secret)->toBe($plainSecret);
});

it('hides sensitive credentials when serializing to array', function () {
    $credential = StoreCredential::factory()->create();

    $array = $credential->toArray();

    expect($array)->not->toHaveKeys([
        'bling_api_key',
        'shopify_access_token',
        'shopify_api_secret',
    ]);
});
