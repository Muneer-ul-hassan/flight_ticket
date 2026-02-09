import { useState } from "react";
import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Building2, Upload, X } from "lucide-react";

interface BrandingOptions {
  logoUrl?: string;
}

interface BrandingSectionProps {
  branding: BrandingOptions;
  onBrandingChange: (branding: BrandingOptions) => void;
}

export default function BrandingSection({ branding, onBrandingChange }: BrandingSectionProps) {
  const [logoFile, setLogoFile] = useState<File | null>(null);

  // Do not set a default logo on mount; only show upload button initially

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const logoUrl = e.target?.result as string;
        onBrandingChange({ ...branding, logoUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    onBrandingChange({ ...branding, logoUrl: undefined });
  };

  const updateField = (field: keyof BrandingOptions, value: string) => {
    onBrandingChange({ ...branding, [field]: value || undefined });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <Building2 className="w-5 h-5 mr-2 text-purple-600" />
          Company Logo Upload
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Your Company Logo
            </label>
            <div className="flex items-center gap-4">
              {branding.logoUrl ? (
                <div className="relative inline-block">
                  <img 
                    src={branding.logoUrl} 
                    alt="Company Logo" 
                    className="h-10 w-auto max-w-[250px] border border-gray-300 rounded-lg shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={removeLogo}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow-md"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="cursor-pointer flex items-center gap-2 px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Custom Logo
                  </label>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Recommended: PNG or JPG, max 250x80px for best results
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
