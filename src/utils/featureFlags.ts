/**
 * Feature Flags System
 * Environment-based feature control for the eLearning application
 */

interface FeatureFlags {
  "editor-advanced": boolean;
  "preview-fullscreen": boolean;
  collaboration: boolean;
  analytics: boolean;
  "ai-suggestions": boolean;
  "qa-testing-mode": boolean;
  "asset-upload": boolean;
  "custom-template": boolean;
}

// Environment variables for Create React App
interface ProcessEnv {
  NODE_ENV: "development" | "production" | "test";
  REACT_APP_FEATURE_FLAGS?: string;
}

declare const process: {
  env: ProcessEnv;
};

class FeatureFlagService {
  private flags: FeatureFlags;

  constructor() {
    this.flags = this.parseFeatureFlags();
  }

  private parseFeatureFlags(): FeatureFlags {
    const defaultFlags: FeatureFlags = {
      "editor-advanced": false,
      "preview-fullscreen": true,
      collaboration: false,
      analytics: false,
      "ai-suggestions": false,
      "qa-testing-mode": false,
      "asset-upload": false,
      "custom-template": process.env.NODE_ENV === "development",
    };

    try {
      // Get feature flags from environment variable (available at build time)
      const envFlags = process.env.REACT_APP_FEATURE_FLAGS || "";
      const enabledFlags = envFlags
        .split(",")
        .map((flag: string) => flag.trim());

      // Enable flags that are listed in the environment
      const parsedFlags = { ...defaultFlags };
      enabledFlags.forEach((flag: string) => {
        if (flag in parsedFlags) {
          (parsedFlags as any)[flag] = true;
        }
      });

      console.log("Feature flags initialized:", parsedFlags);
      return parsedFlags;
    } catch (error) {
      console.warn("Failed to parse feature flags, using defaults:", error);
      return defaultFlags;
    }
  }

  /**
   * Check if a feature is enabled
   */
  isEnabled(feature: keyof FeatureFlags): boolean {
    return this.flags[feature] || false;
  }

  /**
   * Get all feature flags
   */
  getAllFlags(): FeatureFlags {
    return { ...this.flags };
  }

  /**
   * Enable a feature at runtime (for development/testing)
   */
  enableFeature(feature: keyof FeatureFlags): void {
    if (process.env.NODE_ENV === "development") {
      this.flags[feature] = true;
      console.log(`Feature '${feature}' enabled`);
    } else {
      console.warn("Runtime feature toggling only allowed in development");
    }
  }

  /**
   * Disable a feature at runtime (for development/testing)
   */
  disableFeature(feature: keyof FeatureFlags): void {
    if (process.env.NODE_ENV === "development") {
      this.flags[feature] = false;
      console.log(`Feature '${feature}' disabled`);
    } else {
      console.warn("Runtime feature toggling only allowed in development");
    }
  }
}

// Export singleton instance
export const featureFlags = new FeatureFlagService();

// Export React hook for easy usage in components
import { useEffect, useState } from "react";

export const useFeatureFlag = (feature: keyof FeatureFlags): boolean => {
  const [isEnabled, setIsEnabled] = useState(featureFlags.isEnabled(feature));

  useEffect(() => {
    // Re-check feature flag (useful if flags change at runtime in dev)
    setIsEnabled(featureFlags.isEnabled(feature));
  }, [feature]);

  return isEnabled;
};

// Export types
export type { FeatureFlags };
export type FeatureFlag = keyof FeatureFlags;
