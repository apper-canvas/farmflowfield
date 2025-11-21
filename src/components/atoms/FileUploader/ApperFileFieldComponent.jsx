import React, { useEffect, useState, useRef, useMemo } from 'react';

const ApperFileFieldComponent = ({ elementId, config }) => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);
  
  // Refs for tracking lifecycle and preventing memory leaks
  const mountedRef = useRef(false);
  const elementIdRef = useRef(elementId);
  const existingFilesRef = useRef([]);

  // Update elementId ref when it changes
  useEffect(() => {
    elementIdRef.current = elementId;
  }, [elementId]);

  // Memoized existing files to prevent unnecessary re-renders
  const memoizedExistingFiles = useMemo(() => {
    const files = config?.existingFiles || [];
    
    // Return empty array if no files exist
    if (!Array.isArray(files) || files.length === 0) {
      return [];
    }
    
    // Detect changes by comparing length and first file's ID
    const currentRef = existingFilesRef.current;
    if (currentRef.length !== files.length || 
        (files.length > 0 && currentRef.length > 0 && 
         (currentRef[0]?.Id !== files[0]?.Id && currentRef[0]?.id !== files[0]?.id))) {
      return files;
    }
    
    return currentRef;
  }, [config?.existingFiles]);

  // Initial mount effect
  useEffect(() => {
    const initializeSDK = async () => {
      try {
        // Wait for ApperSDK to load (max 50 attempts × 100ms = 5 seconds)
        let attempts = 0;
        while (!window.ApperSDK && attempts < 50) {
          await new Promise(resolve => setTimeout(resolve, 100));
          attempts++;
        }

        if (!window.ApperSDK) {
          throw new Error('ApperSDK not loaded. Please ensure the SDK script is included before this component.');
        }

        const { ApperFileUploader } = window.ApperSDK;
        if (!ApperFileUploader) {
          throw new Error('ApperFileUploader not available in SDK.');
        }

        elementIdRef.current = `file-uploader-${elementId}`;
        
        await ApperFileUploader.FileField.mount(elementIdRef.current, {
          ...config,
          existingFiles: memoizedExistingFiles
        });

        if (mountedRef.current) {
          setIsReady(true);
          setError(null);
        }
      } catch (err) {
        console.error('Failed to initialize ApperFileFieldComponent:', err);
        if (mountedRef.current) {
          setError(err.message);
          setIsReady(false);
        }
      }
    };

    mountedRef.current = true;
    initializeSDK();

    // Cleanup on unmount
    return () => {
      mountedRef.current = false;
      try {
        if (window.ApperSDK?.ApperFileUploader) {
          window.ApperSDK.ApperFileUploader.FileField.unmount(elementIdRef.current);
        }
      } catch (err) {
        console.error('Error during cleanup:', err);
      }
      setIsReady(false);
      setError(null);
    };
  }, [elementId, config.fieldKey, config.tableName, config.apperProjectId, config.apperPublicKey]);

  // File update effect
  useEffect(() => {
    const updateFiles = async () => {
      if (!isReady || !window.ApperSDK?.ApperFileUploader || !config.fieldKey) {
        return;
      }

      try {
        const { ApperFileUploader } = window.ApperSDK;
        
        // Deep equality check with JSON.stringify
        const currentFilesStr = JSON.stringify(existingFilesRef.current);
        const newFilesStr = JSON.stringify(memoizedExistingFiles);
        
        if (currentFilesStr === newFilesStr) {
          return; // No changes
        }

        // Update the ref
        existingFilesRef.current = memoizedExistingFiles;

        // Check if format conversion is needed
        let filesToUpdate = memoizedExistingFiles;
        if (memoizedExistingFiles.length > 0) {
          // Check if files have .Id property (API format) vs .id property (UI format)
          const hasIdProperty = memoizedExistingFiles[0].hasOwnProperty('Id');
          if (hasIdProperty) {
            // Convert from API format to UI format
            filesToUpdate = ApperFileUploader.toUIFormat(memoizedExistingFiles);
          }
        }

        // Update or clear files
        if (filesToUpdate.length > 0) {
          await ApperFileUploader.FileField.updateFiles(config.fieldKey, filesToUpdate);
        } else {
          await ApperFileUploader.FileField.clearField(config.fieldKey);
        }
      } catch (err) {
        console.error('Error updating files:', err);
        if (mountedRef.current) {
          setError(err.message);
        }
      }
    };

    updateFiles();
  }, [memoizedExistingFiles, isReady, config.fieldKey]);

  // Render error state
  if (error) {
    return (
      <div className="p-4 border border-red-300 rounded-lg bg-red-50">
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span className="text-red-700 font-medium">File Upload Error</span>
        </div>
        <p className="text-red-600 text-sm mt-1">{error}</p>
      </div>
    );
  }

  // Main container (always render with unique ID)
  return (
    <div className="file-upload-container">
      <div id={`file-uploader-${elementId}`} className="w-full">
        {!isReady && (
          <div className="flex items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center">
              <svg className="animate-spin h-8 w-8 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-gray-500 text-sm">Loading file uploader...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApperFileFieldComponent;