"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { PageEnter } from "@/components/motion/PageEnter";
import { StaggerItem, StaggerList } from "@/components/motion/StaggerList";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FormField } from "@/components/ui/FormField";
import { Loading } from "@/components/ui/Loading";
import {
  useCreateStoreCredentials,
  useStoreCredentials,
  useUpdateStoreCredentials,
} from "@/lib/queries/use-store-credentials";
import {
  createStoreCredentialSchema,
  updateStoreCredentialSchema,
  type CreateStoreCredentialInput,
  type StoreCredential,
  type UpdateStoreCredentialInput,
} from "@/lib/schemas/store-credential";

export default function SettingsPage() {
  const credentialsQuery = useStoreCredentials();

  if (credentialsQuery.isLoading) {
    return <Loading label="Loading settings..." />;
  }

  return (
    <PageEnter>
      <StaggerList className="space-y-6">
        <StaggerItem>
          <CredentialsOverview credential={credentialsQuery.data ?? null} />
        </StaggerItem>

        <StaggerItem>
          <CredentialsForm
            key={credentialsQuery.data ? "update" : "create"}
            credential={credentialsQuery.data ?? null}
          />
        </StaggerItem>
      </StaggerList>
    </PageEnter>
  );
}

function CredentialsOverview({ credential }: { credential: StoreCredential | null }) {
  return (
    <Card>
      <h2 className="text-2xl font-semibold">Store Credentials</h2>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Connect your Bling ERP and Shopify store. Secrets are sent once to the
        API, encrypted in the database, and never returned to this interface.
      </p>

      {credential && (
        <StaggerList className="mt-6 grid gap-3 rounded-app bg-surface-muted p-4 text-sm sm:grid-cols-3">
          <StaggerItem>
            <StatusItem label="Bling API Key" active={credential.has_bling_api_key} />
          </StaggerItem>
          <StaggerItem>
            <StatusItem
              label="Shopify Access Token"
              active={credential.has_shopify_access_token}
            />
          </StaggerItem>
          <StaggerItem>
            <StatusItem
              label="Shopify API Secret"
              active={credential.has_shopify_api_secret}
            />
          </StaggerItem>
        </StaggerList>
      )}
    </Card>
  );
}

function CredentialsForm({ credential }: { credential: StoreCredential | null }) {
  const isConfigured = Boolean(credential);
  const createCredentials = useCreateStoreCredentials();
  const updateCredentials = useUpdateStoreCredentials();
  const saveMutation = isConfigured ? updateCredentials : createCredentials;

  const form = useForm<CreateStoreCredentialInput | UpdateStoreCredentialInput>({
    resolver: zodResolver(isConfigured ? updateStoreCredentialSchema : createStoreCredentialSchema),
    defaultValues: {
      bling_api_key: "",
      shopify_domain: credential?.shopify_domain ?? "",
      shopify_access_token: "",
      shopify_api_secret: "",
    },
  });

  useEffect(() => {
    form.reset({
      bling_api_key: "",
      shopify_domain: credential?.shopify_domain ?? "",
      shopify_access_token: "",
      shopify_api_secret: "",
    });
  }, [credential, form]);

  return (
    <Card>
      <form
        className="grid gap-5"
        onSubmit={form.handleSubmit(async (values) => {
          if (isConfigured) {
            await updateCredentials.mutateAsync(values);
          } else {
            await createCredentials.mutateAsync(values as CreateStoreCredentialInput);
          }

          form.reset({
            bling_api_key: "",
            shopify_domain: values.shopify_domain ?? credential?.shopify_domain ?? "",
            shopify_access_token: "",
            shopify_api_secret: "",
          });
        })}
      >
        <FormField
          label="Bling API Key"
          name="bling_api_key"
          type="password"
          placeholder={
            credential?.has_bling_api_key
              ? "Leave blank to keep the current key"
              : "Enter your Bling API key"
          }
          error={form.formState.errors.bling_api_key}
          registration={form.register("bling_api_key")}
        />

        <FormField
          label="Shopify Domain"
          name="shopify_domain"
          placeholder="your-store.myshopify.com"
          error={form.formState.errors.shopify_domain}
          registration={form.register("shopify_domain")}
        />

        <FormField
          label="Shopify Access Token"
          name="shopify_access_token"
          type="password"
          placeholder={
            credential?.has_shopify_access_token
              ? "Leave blank to keep the current token"
              : "shpat_..."
          }
          error={form.formState.errors.shopify_access_token}
          registration={form.register("shopify_access_token")}
        />

        <FormField
          label="Shopify API Secret"
          name="shopify_api_secret"
          type="password"
          placeholder={
            credential?.has_shopify_api_secret
              ? "Leave blank to keep the current secret"
              : "shpss_... (optional)"
          }
          error={form.formState.errors.shopify_api_secret}
          registration={form.register("shopify_api_secret")}
        />

        <Button type="submit" disabled={saveMutation.isPending}>
          {saveMutation.isPending
            ? "Saving..."
            : isConfigured
              ? "Update Credentials"
              : "Save Credentials"}
        </Button>
      </form>
    </Card>
  );
}

function StatusItem({ label, active }: { label: string; active: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-app bg-surface px-4 py-3">
      <span>{label}</span>
      <Badge variant={active ? "success" : "muted"}>
        {active ? "Configured" : "Missing"}
      </Badge>
    </div>
  );
}
