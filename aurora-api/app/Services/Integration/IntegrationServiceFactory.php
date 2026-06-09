<?php

namespace App\Services\Integration;

use App\Models\StoreCredential;
use App\Models\User;
use App\Services\Integration\Exceptions\IntegrationException;

class IntegrationServiceFactory
{
    public function blingForUser(User $user): BlingService
    {
        $credential = $this->requireCredential($user);

        return new BlingService(apiKey: $credential->bling_api_key);
    }

    public function shopifyForUser(User $user): ShopifyService
    {
        $credential = $this->requireCredential($user);

        return new ShopifyService(
            shopifyDomain: $credential->shopify_domain,
            accessToken: $credential->shopify_access_token,
        );
    }

    private function requireCredential(User $user): StoreCredential
    {
        $credential = $user->storeCredential;

        if (! $credential instanceof StoreCredential) {
            throw new IntegrationException('Store credentials are not configured for this user.', 422);
        }

        return $credential;
    }
}
