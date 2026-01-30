"use client";

import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import Uppy from "@uppy/core";
import type { UppyFile, UploadResult } from "@uppy/core";
import { DashboardModal } from "@uppy/react";
import AwsS3 from "@uppy/aws-s3";
import { Button } from "@/components/ui/button";

// CSS Imports
import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";

interface ObjectUploaderProps {
  maxNumberOfFiles?: number;
  maxFileSize?: number;
  onGetUploadParameters: (
    file: UppyFile<Record<string, unknown>, Record<string, unknown>>
  ) => Promise<{
    method: "PUT";
    url: string;
    headers?: Record<string, string>;
  }>;
  onComplete?: (
    result: UploadResult<Record<string, unknown>, Record<string, unknown>>
  ) => void;
  buttonClassName?: string;
  children: ReactNode;
}

export function ObjectUploader({
  maxNumberOfFiles = 1,
  maxFileSize = 10485760, // 10MB default
  onGetUploadParameters,
  onComplete,
  buttonClassName,
  children,
}: ObjectUploaderProps) {
  const [showModal, setShowModal] = useState(false);

  // Initialize Uppy instance once without plugins
  const [uppy] = useState(() => 
    new Uppy({
      restrictions: {
        maxNumberOfFiles,
        maxFileSize,
      },
      autoProceed: false,
    })
  );

  useEffect(() => {
    // Install the S3 plugin
    uppy.use(AwsS3, {
      shouldUseMultipart: false,
      getUploadParameters: onGetUploadParameters,
    });

    // Handle completion
    uppy.on("complete", (result) => {
      onComplete?.(result);
      // Optional: Close modal automatically on success
      if (result.successful.length > 0) {
        setTimeout(() => setShowModal(false), 1500);
      }
    });

    // Cleanup on unmount to prevent memory leaks and duplicate listeners
    return () => {
      uppy.close({ keepSession: false });
    };
  }, [uppy, onGetUploadParameters, onComplete]);

  return (
    <div>
      <Button 
        type="button"
        onClick={() => setShowModal(true)} 
        className={buttonClassName}
      >
        {children}
      </Button>

      <DashboardModal
        uppy={uppy}
        open={showModal}
        onRequestClose={() => setShowModal(false)}
        proudlyDisplayPoweredByUppy={false}
        closeAfterFinish={false} // Handled by our custom logic
      />
    </div>
  );
}