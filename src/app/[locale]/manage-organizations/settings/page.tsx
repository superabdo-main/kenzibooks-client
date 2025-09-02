"use client";
import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Trash2,
  Building2,
  ExternalLink,
  AlertTriangle,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useOrganizationsStore } from "@/stores/organizations.store";
import { useAuth } from "@/contexts/AuthContext";

// Types
interface Organization {
  id: string;
  name: string;
  iconUrl: string;
}

interface FormData {
  name: string;
  iconUrl: string;
}

interface FormErrors {
  name?: string;
  iconUrl?: string;
}

interface EditFormProps {
  organization: Organization | null;
  onSave: (organization: Organization) => void;
  onDelete: () => void;
  isLoading: boolean;
  isSaving: boolean;
  saveError: string | null;
}

interface PreviewCardProps {
  organization: Organization | null;
  formData: FormData;
}

interface DeleteDialogProps {
  isOpen: boolean;
  organizationName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

interface PageHeaderProps {
  organizationName: string;
  onCancel: () => void;
  isLoading: boolean;
}

interface LoadingSkeletonProps {}

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

const EditOrganization = () => {
  const t = useTranslations("OrganizationManager");
  const {
    fetchOrganizationById,
    updateOrganization,
    deleteOrganization,
    isLoading,
  } = useOrganizationsStore();
  const { session } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // State management
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);

  // Extract organization ID from params
  const organizationId = searchParams.get("id");

  // Fetch organization data on component mount
  const fetchOrganization = async () => {
    if (!organizationId) {
      setFetchError("Organization ID is required");
      return;
    }

    try {
      setFetchError(null);

      const orgData = await fetchOrganizationById({
        userId: session?.user?.id!,
        organizationId,
        accessToken: session?.accessToken!,
      });

      if (orgData.data) {
        setOrganization(orgData.data);
      } else {
        setFetchError("Organization not found");
      }
    } catch (error) {
      console.error("Error fetching organization:", error);
      setFetchError(
        error instanceof Error ? error.message : "Failed to fetch organization"
      );
    } finally {
    }
  };

  // Fix 2: Add proper dependency management and prevent unnecessary re-fetches
  useEffect(() => {
    // Only fetch if we don't already have the organization data
    if (organizationId && session && !organization) {
      fetchOrganization();
    }
  }, [organizationId, session?.accessToken]); // Remove session from deps, use only accessToken

  const handleSave = async (updatedOrg: Organization): Promise<void> => {
    if (!organization) return;

    setIsSaving(true);
    setSaveError(null);

    try {
      await updateOrganization({
        id: organizationId!,
        name: updatedOrg.name,
        icon: updatedOrg.iconUrl,
        accessToken: session?.accessToken!,
      });
      setOrganization(updatedOrg);
      setShowSuccessMessage(true);

      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);

    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : "Failed to update organization"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (): Promise<void> => {
    if (!organization) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await deleteOrganization({
        id: organizationId!,
        accessToken: session?.accessToken!,
      });
      router.push("/manage-organizations");
    } catch (error) {
      console.error("Error deleting organization:", error);
      setDeleteError(
        error instanceof Error ? error.message : "Failed to delete organization"
      );
      setShowDeleteDialog(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = (): void => {
    router.push("/manage-organizations");
  };

  const handleRetryFetch = (): void => {
    setFetchError(null);
    // Call the fetch function directly instead of reloading
    fetchOrganization();
  };

  // Show loading skeleton while fetching
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  // Show error state if fetch failed
  if (fetchError) {
    return <ErrorState error={fetchError} onRetry={handleRetryFetch} />;
  }

  // Show not found if organization doesn't exist
  if (!organization) {
    return (
      <ErrorState error="Organization not found" onRetry={handleRetryFetch} />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden pt-5">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-pink-200/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-100 border border-green-200 rounded-lg p-4 shadow-lg animate-slide-in-right">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-green-800 font-medium">
              Organization updated successfully!
            </p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-12 flex-col lg:flex-row gap-6">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
              Edit {organization.name}
            </h1>
            <p className="text-slate-600 text-xl">
              Manage organization settings
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleCancel}
              className="bg-white/80 backdrop-blur-sm hover:bg-white border border-white/20 text-slate-700 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-3 shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Organizations
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Edit Form */}
          <div className="lg:col-span-2">
            <EditForm
              organization={organization}
              onSave={handleSave}
              onDelete={() => setShowDeleteDialog(true)}
              isLoading={false}
              isSaving={isSaving}
              saveError={saveError}
            />
          </div>

          {/* Preview Sidebar */}
          <div className="lg:col-span-1">
            <PreviewCard
              organization={organization}
              formData={{
                name: organization.name,
                iconUrl: organization.iconUrl,
              }}
            />
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        isOpen={showDeleteDialog}
        organizationName={organization.name}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
        isDeleting={isDeleting}
      />

      {/* Delete Error Message */}
      {deleteError && (
        <div className="fixed bottom-4 right-4 z-50 bg-red-100 border border-red-200 rounded-lg p-4 shadow-lg max-w-md">
          <div className="flex items-start gap-2">
            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-800 font-medium">Delete Failed</p>
              <p className="text-red-700 text-sm">{deleteError}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Loading Skeleton Component
const LoadingSkeleton: React.FC<LoadingSkeletonProps> = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden pt-5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          {/* Header Skeleton */}
          <div className="mb-12">
            <div className="h-12 bg-slate-200 rounded-lg w-1/3 mb-4"></div>
            <div className="h-6 bg-slate-200 rounded-lg w-1/4"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Skeleton */}
            <div className="lg:col-span-2">
              <div className="bg-white/80 rounded-2xl p-8 space-y-6">
                <div className="h-8 bg-slate-200 rounded-lg w-1/4"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-slate-200 rounded w-1/6"></div>
                  <div className="h-12 bg-slate-200 rounded-xl"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-4 bg-slate-200 rounded w-1/6"></div>
                  <div className="h-12 bg-slate-200 rounded-xl"></div>
                </div>
                <div className="flex gap-4 pt-6">
                  <div className="h-12 bg-slate-200 rounded-xl flex-1"></div>
                  <div className="h-12 bg-slate-200 rounded-xl w-24"></div>
                </div>
              </div>
            </div>

            {/* Preview Skeleton */}
            <div className="lg:col-span-1">
              <div className="bg-white/80 rounded-2xl p-8">
                <div className="h-6 bg-slate-200 rounded w-1/3 mb-6"></div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-slate-200 rounded-2xl mx-auto mb-4"></div>
                  <div className="h-6 bg-slate-200 rounded w-2/3 mx-auto mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2 mx-auto"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Error State Component
const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-8 text-center max-w-md w-full">
        <div className="p-3 bg-red-100 rounded-full w-fit mx-auto mb-4">
          <XCircle className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">
          Something went wrong
        </h2>
        <p className="text-slate-600 mb-6">{error}</p>
        <button
          onClick={onRetry}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-blue-600/25"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

// EditForm Component
const EditForm: React.FC<EditFormProps> = ({
  organization,
  onSave,
  onDelete,
  isLoading,
  isSaving,
  saveError,
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: organization?.name || "",
    iconUrl: organization?.iconUrl || "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  // Update form data when organization changes
  useEffect(() => {
    if (organization) {
      setFormData({
        name: organization.name,
        iconUrl: organization.iconUrl,
      });
    }
  }, [organization]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Organization name is required";
    } else if (formData.name?.trim().length < 2) {
      newErrors.name = "Organization name must be at least 2 characters";
    }

    if (formData.iconUrl && !isValidUrl(formData.iconUrl)) {
      newErrors.iconUrl = "Please enter a valid URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = (): void => {
    if (validateForm() && organization) {
      onSave({
        ...organization,
        name: formData.name?.trim(),
        iconUrl: formData.iconUrl?.trim(),
      });
    }
  };

  const handleInputChange = (field: keyof FormData, value: string): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const hasChanges =
    organization &&
    (formData.name !== organization.name ||
      formData.iconUrl !== organization.iconUrl);

  if (!organization) return null;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl shadow-slate-200/20 p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-blue-100 rounded-xl">
          <Building2 className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Edit Organization
          </h2>
          <p className="text-slate-500 text-sm">
            Update your organization details
          </p>
        </div>
      </div>

      {/* Save Error Message */}
      {saveError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-800 font-medium">Save Failed</p>
              <p className="text-red-700 text-sm">{saveError}</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-8">
        {/* Organization Name */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">
            Organization Name
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={`w-full px-4 py-4 bg-white border-2 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-200 text-slate-900 placeholder-slate-400 ${
                errors.name
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                  : "border-slate-200 hover:border-slate-300"
              }`}
              placeholder="Enter organization name"
              disabled={isLoading || isSaving}
            />
            {errors.name && (
              <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
                <AlertTriangle className="w-4 h-4" />
                {errors.name}
              </div>
            )}
          </div>
        </div>

        {/* Icon URL */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">
            Icon URL
            <span className="text-slate-400 font-normal ml-1">(Optional)</span>
          </label>
          <div className="relative">
            <input
              type="url"
              value={formData.iconUrl || ""}
              onChange={(e) => handleInputChange("iconUrl", e.target.value)}
              className={`w-full px-4 py-4 bg-white border-2 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-200 text-slate-900 placeholder-slate-400 ${
                errors.iconUrl
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                  : "border-slate-200 hover:border-slate-300"
              }`}
              placeholder="https://example.com/icon.svg"
              disabled={isLoading || isSaving}
            />
            {formData.iconUrl && isValidUrl(formData.iconUrl) && (
              <a
                href={formData.iconUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
          {errors.iconUrl && (
            <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
              <AlertTriangle className="w-4 h-4" />
              {errors.iconUrl}
            </div>
          )}
          <p className="text-sm text-slate-500 flex items-start gap-2">
            <span className="inline-block w-1 h-1 bg-slate-400 rounded-full mt-2 flex-shrink-0"></span>
            Enter a direct link to an image file (SVG, PNG, JPG). High contrast
            icons work best.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-100">
          <button
            onClick={handleSubmit}
            disabled={!hasChanges || isLoading || isSaving}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 px-8 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-3 shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30 hover:-translate-y-0.5"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Changes
              </>
            )}
          </button>

          <button
            onClick={onDelete}
            disabled={isLoading || isSaving}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-4 px-8 rounded-xl font-semibold disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-3 shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 hover:-translate-y-0.5"
          >
            <Trash2 className="w-5 h-5" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// PreviewCard Component
const PreviewCard: React.FC<PreviewCardProps> = ({
  organization,
  formData,
}) => {
  const [imageError, setImageError] = useState<boolean>(false);

  // Use form data for real-time preview
  const displayName =
    formData.name || organization?.name || "Organization Name";
  const displayIconUrl = formData.iconUrl || organization?.iconUrl || "";

  useEffect(() => {
    setImageError(false);
  }, [displayIconUrl]);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl shadow-slate-200/20 p-8 sticky top-8">
      <h3 className="text-lg font-bold text-slate-900 mb-6">Live Preview</h3>

      {/* Organization Card Preview */}
      <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200/60 rounded-xl p-6 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl mx-auto mb-4 flex items-center justify-center overflow-hidden shadow-inner">
          {displayIconUrl && !imageError ? (
            <img
              src={displayIconUrl}
              alt="Organization icon"
              className="w-12 h-12 object-contain"
              onError={() => setImageError(true)}
            />
          ) : (
            <Building2 className="w-8 h-8 text-slate-400" />
          )}
        </div>
        <h4 className="font-bold text-slate-900 text-lg mb-1">{displayName}</h4>
        <p className="text-sm text-slate-500 bg-slate-100 rounded-full px-3 py-1 inline-block">
          Organization
        </p>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
        <p className="text-xs text-blue-700 font-medium">
          💡 This is how your organization will appear to users
        </p>
      </div>
    </div>
  );
};

// DeleteDialog Component
const DeleteDialog: React.FC<DeleteDialogProps> = ({
  isOpen,
  organizationName,
  onConfirm,
  onCancel,
  isDeleting,
}) => {
  const [confirmText, setConfirmText] = useState<string>("");
  const isConfirmValid = confirmText === organizationName;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-red-100 rounded-xl">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            Delete Organization
          </h3>
        </div>

        <div className="mb-6">
          <p className="text-slate-600 mb-4 leading-relaxed">
            This action cannot be undone. This will permanently delete the
            organization{" "}
            <span className="font-semibold text-slate-900 bg-slate-100 px-2 py-1 rounded">
              {organizationName}
            </span>{" "}
            and all of its data.
          </p>

          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-800 text-sm font-medium mb-3">
              Type <span className="font-bold">{organizationName}</span> to
              confirm:
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="text-black w-full px-4 py-3 border-2 border-red-200 rounded-lg focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all duration-200 bg-white"
              placeholder={organizationName}
              disabled={isDeleting}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-900 py-3 px-6 rounded-xl font-semibold disabled:opacity-50 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!isConfirmValid || isDeleting}
            className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-6 rounded-xl font-semibold disabled:opacity-50 transition-all duration-200 shadow-lg shadow-red-500/25 flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditOrganization;
