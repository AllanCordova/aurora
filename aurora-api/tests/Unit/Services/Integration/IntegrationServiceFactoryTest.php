<?php

use App\Models\StoreCredential;
use App\Models\User;
use App\Services\Integration\BlingService;
use App\Services\Integration\Exceptions\IntegrationException;
use App\Services\Integration\IntegrationServiceFactory;
use App\Services\Integration\ShopifyService;

it('creates integration services from user store credentials', function () {
    $user = User::factory()->create();
    StoreCredential::factory()->for($user)->create();

    $factory = new IntegrationServiceFactory;

    expect($factory->blingForUser($user))->toBeInstanceOf(BlingService::class);
    expect($factory->shopifyForUser($user))->toBeInstanceOf(ShopifyService::class);
});

it('throws when user has no store credentials configured', function () {
    $user = User::factory()->create();
    $factory = new IntegrationServiceFactory;

    expect(fn () => $factory->blingForUser($user))
        ->toThrow(IntegrationException::class, 'Store credentials are not configured');
});
