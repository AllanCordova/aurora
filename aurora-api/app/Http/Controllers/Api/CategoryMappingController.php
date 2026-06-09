<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CategoryMapping\StoreCategoryMappingRequest;
use App\Http\Requests\CategoryMapping\UpdateCategoryMappingRequest;
use App\Http\Resources\CategoryMappingResource;
use App\Models\CategoryMapping;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryMappingController extends Controller
{
    public function index(Request $request)
    {
        $mappings = $request->user()
            ->categoryMappings()
            ->latest()
            ->get();

        return CategoryMappingResource::collection($mappings);
    }

    public function store(StoreCategoryMappingRequest $request): JsonResponse
    {
        $mapping = $request->user()
            ->categoryMappings()
            ->create($request->validated());

        return response()->json([
            'data' => new CategoryMappingResource($mapping),
        ], 201);
    }

    public function update(UpdateCategoryMappingRequest $request, CategoryMapping $categoryMapping): JsonResponse
    {
        $this->ensureMappingBelongsToUser($request, $categoryMapping);

        $categoryMapping->update($request->validated());

        return response()->json([
            'data' => new CategoryMappingResource($categoryMapping->fresh()),
        ]);
    }

    public function destroy(Request $request, CategoryMapping $categoryMapping): JsonResponse
    {
        $this->ensureMappingBelongsToUser($request, $categoryMapping);

        $categoryMapping->delete();

        return response()->json([
            'message' => 'Category mapping deleted successfully.',
        ]);
    }

    private function ensureMappingBelongsToUser(Request $request, CategoryMapping $categoryMapping): void
    {
        abort_unless(
            $categoryMapping->user_id === $request->user()->id,
            404,
            'Category mapping not found.',
        );
    }
}
