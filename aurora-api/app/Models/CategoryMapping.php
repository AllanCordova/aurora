<?php

namespace App\Models;

use Database\Factories\CategoryMappingFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['user_id', 'bling_category_name', 'shopify_tag_or_collection'])]
class CategoryMapping extends Model
{
    /** @use HasFactory<CategoryMappingFactory> */
    use HasFactory;

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
