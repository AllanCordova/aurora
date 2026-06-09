<?php

namespace App\Models;

use Database\Factories\StoreCredentialFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['user_id', 'bling_api_key', 'shopify_domain', 'shopify_access_token', 'shopify_api_secret'])]
#[Hidden(['bling_api_key', 'shopify_access_token', 'shopify_api_secret'])]
class StoreCredential extends Model
{
    /** @use HasFactory<StoreCredentialFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'bling_api_key' => 'encrypted',
            'shopify_access_token' => 'encrypted',
            'shopify_api_secret' => 'encrypted',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
