<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCredential\StoreStoreCredentialRequest;
use App\Http\Requests\StoreCredential\UpdateStoreCredentialRequest;
use App\Http\Resources\StoreCredentialResource;
use App\Models\StoreCredential;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StoreCredentialController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $credential = $request->user()->storeCredential;

        return response()->json([
            'data' => $credential ? new StoreCredentialResource($credential) : null,
        ]);
    }

    public function store(StoreStoreCredentialRequest $request): JsonResponse
    {
        if ($request->user()->storeCredential) {
            return response()->json([
                'message' => 'Store credentials already exist. Use PUT to update.',
            ], 422);
        }

        $credential = $request->user()->storeCredential()->create($request->validated());

        return response()->json([
            'data' => new StoreCredentialResource($credential),
        ], 201);
    }

    public function update(UpdateStoreCredentialRequest $request): JsonResponse
    {
        $credential = $request->user()->storeCredential;

        if (! $credential) {
            return response()->json([
                'message' => 'Store credentials not found.',
            ], 404);
        }

        $validated = collect($request->validated())
            ->filter(fn (mixed $value, string $key) => match ($key) {
                'bling_api_key', 'shopify_access_token', 'shopify_api_secret' => filled($value),
                default => true,
            })
            ->all();

        $credential->update($validated);

        return response()->json([
            'data' => new StoreCredentialResource($credential->fresh()),
        ]);
    }

    public function destroy(Request $request): JsonResponse
    {
        $credential = $request->user()->storeCredential;

        if (! $credential instanceof StoreCredential) {
            return response()->json([
                'message' => 'Store credentials not found.',
            ], 404);
        }

        $credential->delete();

        return response()->json([
            'message' => 'Store credentials deleted successfully.',
        ]);
    }
}
