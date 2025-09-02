"use client";
import { LogoutIconButton } from "@/components/auth/logoutButton";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Building2, Check, Loader2, Sparkles, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useOrganizationsStore } from "@/stores/organizations.store";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const CreateOrganization = () => {
  const t = useTranslations("OrganizationManager");
  const router = useRouter();
  const [orgName, setOrgName] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const { createOrganization } = useOrganizationsStore();
  const [isLoading, setIsLoading] = useState(false);
  const { session } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (orgName.trim() && session) {
      setShowForm(false);

      try {
        setIsLoading(true);
        const response = await createOrganization({
          name: orgName.trim(),
          icon: "",
          ownerId: session?.user?.id!,
          accessToken: session?.accessToken!,
        });
        setIsLoading(false);
        
        if (response.isOk) {
          setIsSuccess(true);
          // Wait 3 seconds then navigate
          setTimeout(() => {
            router.push("/manage-organizations");
          }, 3000);
          return;
        }

        if (response.error) {
          toast({
            variant: "destructive",
            title: "Error",
            description: response.error,
          });
          setShowForm(true);
        }
      } catch (error) {
        setIsLoading(false);
        setShowForm(true);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && orgName.trim()) {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6 relative overflow-hidden">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-200/20 to-indigo-200/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-128 h-128 bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-gradient-to-r from-cyan-200/20 to-blue-200/20 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-gradient-to-r from-indigo-200/15 to-purple-200/15 rounded-full blur-3xl animate-float-reverse"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-16">
          <div className="flex-1">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-slate-800 via-blue-700 to-indigo-700 bg-clip-text text-transparent leading-tight">
                {t("emptyState.title")}
              </h1>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
                {t("emptyState.subtitle")}
              </p>
            </div>
          </div>
          <LogoutIconButton />
        </div>

        {/* Form Container */}
        <div
          className={`relative transition-all duration-700 ease-out transform ${
            showForm
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-8 scale-95 pointer-events-none"
          }`}
        >
          <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 p-10 relative overflow-hidden">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent rounded-3xl"></div>

            <div className="relative z-10">
              {/* Icon Section */}
              <div className="text-center mb-10">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-xl transform hover:scale-105 transition-all duration-300 relative">
                  <Building2 className="w-12 h-12 text-white" />
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                </div>
                <h2 className="text-2xl font-semibold text-slate-700 mb-2">
                  Create Your Organization
                </h2>
                <p className="text-slate-500">
                  Enter a name to get started with your new workspace
                </p>
              </div>

              {/* Form Fields */}
              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-4">
                    Organization Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="w-full px-6 py-4 rounded-2xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm text-slate-700 placeholder-slate-400 text-lg"
                      placeholder="Organization name"
                      disabled={isLoading}
                      maxLength={50}
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <div
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          orgName.trim() ? "bg-green-400" : "bg-slate-300"
                        }`}
                      ></div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    {orgName.length}/50 characters
                  </p>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <button
                    onClick={handleSubmit}
                    disabled={!orgName.trim() || isLoading}
                    className="group w-full py-4 px-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center justify-center gap-3">
                      <span className="text-lg">Create Organization</span>
                      <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-out ${
            isLoading
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 pointer-events-none"
          }`}
        >
          <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 p-12 text-center relative overflow-hidden max-w-md w-full mx-6">
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent rounded-3xl"></div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl mx-auto mb-8 flex items-center justify-center shadow-xl">
                <Loader2 className="w-10 h-10 text-white animate-spin" />
              </div>
              <h3 className="text-2xl font-bold text-slate-700 mb-4">
                Creating Organization
              </h3>
              <p className="text-slate-500 leading-relaxed">
                Setting up your workspace and configuring initial settings...
              </p>

              {/* Progress dots */}
              <div className="flex justify-center gap-2 mt-6">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse delay-100"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-200"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Success State */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-out ${
            isSuccess
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 pointer-events-none"
          }`}
        >
          <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 p-12 text-center relative overflow-hidden max-w-lg w-full mx-6">
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent rounded-3xl"></div>

            {/* Celebration animation */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl">
              <div className="absolute top-4 left-4 w-3 h-3 bg-amber-400 rounded-full animate-bounce delay-100"></div>
              <div className="absolute top-8 right-6 w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-300"></div>
              <div className="absolute bottom-8 left-8 w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-500"></div>
              <div className="absolute bottom-4 right-4 w-3 h-3 bg-green-400 rounded-full animate-bounce delay-700"></div>
            </div>

            <div className="relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 rounded-2xl mx-auto mb-8 flex items-center justify-center shadow-xl transform animate-pulse">
                <Check className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-slate-700 mb-4">
                🎉 Congratulations!
              </h3>
              <p className="text-lg text-slate-600 mb-2 font-medium">
                "{orgName}" has been created successfully
              </p>
              <p className="text-slate-400 leading-relaxed mb-6">
                Your organization is ready to use. You'll be redirected to the
                management dashboard shortly.
              </p>

              {/* Progress bar */}
              <div className="w-full bg-slate-200 rounded-full h-1 mb-4">
                <div className="bg-gradient-to-r from-emerald-400 to-green-400 h-1 rounded-full animate-progress"></div>
              </div>
              <p className="text-sm text-slate-400">
                Redirecting in a few seconds...
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-30px) rotate(180deg);
          }
        }
        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-40px) rotate(-180deg);
          }
        }
        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(90deg);
          }
        }
        @keyframes float-reverse {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-25px) rotate(-90deg);
          }
        }
        @keyframes progress {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 10s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 12s ease-in-out infinite;
        }
        .animate-float-reverse {
          animation: float-reverse 9s ease-in-out infinite;
        }
        .animate-progress {
          animation: progress 3s ease-out forwards;
        }
        .w-128 {
          width: 32rem;
        }
        .h-128 {
          height: 32rem;
        }
      `}</style>
    </div>
  );
};

export default CreateOrganization;
