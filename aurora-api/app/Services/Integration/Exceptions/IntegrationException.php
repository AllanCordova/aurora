<?php

namespace App\Services\Integration\Exceptions;

use Exception;

class IntegrationException extends Exception
{
    public static function fromResponse(string $platform, int $status, ?string $message = null): self
    {
        return new self(
            $message ?? "Integration request to {$platform} failed with status {$status}.",
            $status,
        );
    }

    public static function productNotFound(string $platform, string $sku): self
    {
        return new self("Product with SKU [{$sku}] was not found on {$platform}.", 404);
    }

    public static function invalidCredentials(string $platform): self
    {
        return new self("Invalid credentials for {$platform}.", 401);
    }
}
