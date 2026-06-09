"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AnimatedSwap } from "@/components/motion/AnimatedSwap";
import { PageEnter } from "@/components/motion/PageEnter";
import { StaggerItem, StaggerList } from "@/components/motion/StaggerList";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FormField } from "@/components/ui/FormField";
import { Loading } from "@/components/ui/Loading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/ui/Table";
import {
  useCategoryMappings,
  useCreateCategoryMapping,
  useDeleteCategoryMapping,
  useUpdateCategoryMapping,
} from "@/lib/queries/use-category-mappings";
import {
  createCategoryMappingSchema,
  updateCategoryMappingSchema,
  type CategoryMapping,
  type CreateCategoryMappingInput,
  type UpdateCategoryMappingInput,
} from "@/lib/schemas/category-mapping";

export default function MappingsPage() {
  const mappingsQuery = useCategoryMappings();
  const createMapping = useCreateCategoryMapping();
  const [editingId, setEditingId] = useState<number | null>(null);

  if (mappingsQuery.isLoading) {
    return <Loading label="Loading category mappings..." />;
  }

  const mappings = mappingsQuery.data ?? [];

  return (
    <PageEnter>
      <StaggerList className="space-y-6">
        <StaggerItem>
          <Card>
            <h2 className="text-2xl font-semibold">Category Mapping</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Define how Bling categories translate into Shopify tags or collections
              before products are enriched during sync.
            </p>
          </Card>
        </StaggerItem>

        <StaggerItem>
          <CreateMappingForm
            isSubmitting={createMapping.isPending}
            onCreate={async (values) => {
              await createMapping.mutateAsync(values);
            }}
          />
        </StaggerItem>

        <StaggerItem>
          <Card className="p-0 overflow-hidden">
            <div className="border-b border-border px-6 py-4">
              <h3 className="text-lg font-semibold">Mapping Rules</h3>
              <p className="text-sm text-muted-foreground">
                {mappings.length} rule{mappings.length === 1 ? "" : "s"} configured
              </p>
            </div>

            {mappings.length === 0 ? (
              <div className="px-6 py-10 text-center text-sm text-muted-foreground">
                No mappings yet. Add your first rule above.
              </div>
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeaderCell>Bling Category</TableHeaderCell>
                    <TableHeaderCell>Shopify Tag / Collection</TableHeaderCell>
                    <TableHeaderCell className="text-right">Actions</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mappings.map((mapping) => (
                    <MappingRow
                      key={mapping.id}
                      mapping={mapping}
                      isEditing={editingId === mapping.id}
                      onEdit={() => setEditingId(mapping.id)}
                      onCancel={() => setEditingId(null)}
                      onSaved={() => setEditingId(null)}
                    />
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>
        </StaggerItem>
      </StaggerList>
    </PageEnter>
  );
}

function CreateMappingForm({
  onCreate,
  isSubmitting,
}: {
  onCreate: (values: CreateCategoryMappingInput) => Promise<void>;
  isSubmitting: boolean;
}) {
  const form = useForm<CreateCategoryMappingInput>({
    resolver: zodResolver(createCategoryMappingSchema),
    defaultValues: {
      bling_category_name: "",
      shopify_tag_or_collection: "",
    },
  });

  return (
    <Card>
      <h3 className="text-lg font-semibold">Add Mapping Rule</h3>
      <form
        className="mt-5 grid gap-5 md:grid-cols-2"
        onSubmit={form.handleSubmit(async (values) => {
          await onCreate(values);
          form.reset();
        })}
      >
        <FormField
          label="Bling Category"
          name="bling_category_name"
          placeholder='e.g. "Eletrônicos"'
          error={form.formState.errors.bling_category_name}
          registration={form.register("bling_category_name")}
        />
        <FormField
          label="Shopify Tag or Collection"
          name="shopify_tag_or_collection"
          placeholder='e.g. "tech"'
          error={form.formState.errors.shopify_tag_or_collection}
          registration={form.register("shopify_tag_or_collection")}
        />
        <div className="md:col-span-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Rule"}
          </Button>
        </div>
      </form>
    </Card>
  );
}

function MappingRow({
  mapping,
  isEditing,
  onEdit,
  onCancel,
  onSaved,
}: {
  mapping: CategoryMapping;
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const updateMapping = useUpdateCategoryMapping();
  const deleteMapping = useDeleteCategoryMapping();

  const form = useForm<UpdateCategoryMappingInput>({
    resolver: zodResolver(updateCategoryMappingSchema),
    values: {
      bling_category_name: mapping.bling_category_name,
      shopify_tag_or_collection: mapping.shopify_tag_or_collection,
    },
  });

  if (isEditing) {
    return (
      <TableRow>
        <TableCell colSpan={3}>
          <AnimatedSwap swapKey={`edit-${mapping.id}`}>
            <form
              className="grid gap-4 py-2 md:grid-cols-2"
              onSubmit={form.handleSubmit(async (values) => {
                await updateMapping.mutateAsync({ id: mapping.id, payload: values });
                onSaved();
              })}
            >
              <FormField
                label="Bling Category"
                name="bling_category_name"
                error={form.formState.errors.bling_category_name}
                registration={form.register("bling_category_name")}
              />
              <FormField
                label="Shopify Tag or Collection"
                name="shopify_tag_or_collection"
                error={form.formState.errors.shopify_tag_or_collection}
                registration={form.register("shopify_tag_or_collection")}
              />
              <div className="flex gap-2 md:col-span-2">
                <Button type="submit" disabled={updateMapping.isPending}>
                  {updateMapping.isPending ? "Saving..." : "Save"}
                </Button>
                <Button type="button" variant="secondary" onClick={onCancel}>
                  Cancel
                </Button>
              </div>
            </form>
          </AnimatedSwap>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow>
      <TableCell className="font-medium">{mapping.bling_category_name}</TableCell>
      <TableCell>{mapping.shopify_tag_or_collection}</TableCell>
      <TableCell>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" size="sm" onClick={onEdit}>
            Edit
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={deleteMapping.isPending}
            onClick={() => deleteMapping.mutate(mapping.id)}
          >
            {deleteMapping.isPending ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
