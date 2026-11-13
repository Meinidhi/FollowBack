import React, { useState, useRef } from 'react';
import { UploadCloud, FileArchive, X, AlertCircle, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { formatFileSize, isValidZipFile } from '../utils/validation';
import { ProcessingError } from '../types/instagram';

interface UploadSectionProps {
  onFileSelect: (file: File) => void;
  onStartAnalysis: () => void;
  onLoadDemoData: () => void;
  onViewInstructions: () => void;
  selectedFile: File | null;
  onClearSelectedFile: () => void;
  isProcessing: boolean;
  error: ProcessingError | null;
}

export const UploadSection: React.FC<UploadSectionProps> = ({
  onFileSelect,
  onStartAnalysis,
  onLoadDemoData,
  onViewInstructions,
  selectedFile,
  onClearSelectedFile,
  isProcessing,
  error
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [jsonAcknowledged, setJsonAcknowledged] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (isValidZipFile(file)) {
        onFileSelect(file);
      } else {
        alert('Please drop a valid .zip file downloaded from Instagram.');
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (isValidZipFile(file)) {
        onFileSelect(file);
      } else {
        alert('Please select a valid .zip file.');
      }
    }
  };

  const isStartDisabled = !selectedFile || !jsonAcknowledged || isProcessing;

  return (
    <section id="upload-section" className="py-14 md:py-20 bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Step 2 of 2</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-main tracking-tight mb-2">
            Upload your Instagram data.
          </h2>
          <p className="text-base text-secondary">
            Upload the ZIP file you downloaded from Instagram in JSON format.
          </p>
        </div>

        {/* Dropzone Card */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !selectedFile && fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all duration-200 bg-white ${
            isDragOver
              ? 'border-primary bg-primary-light/30 scale-[1.01]'
              : 'border-slate-300 hover:border-slate-400'
          } ${selectedFile ? 'cursor-default' : 'cursor-pointer'} shadow-sm`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".zip,application/zip,application/x-zip-compressed"
            onChange={handleFileInputChange}
            className="hidden"
          />

          {!selectedFile ? (
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center transition-transform group-hover:scale-105">
                <UploadCloud className="w-8 h-8 stroke-[2]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-main mb-1">
                  Drag and drop your Instagram ZIP file here
                </h3>
                <p className="text-sm text-secondary">
                  or click to browse from your computer
                </p>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-primary bg-primary-light hover:bg-primary/20 transition-colors"
                >
                  <FileArchive className="w-4 h-4" />
                  <span>Browse Files</span>
                </button>
              </div>
              <p className="text-xs text-secondary/70 pt-2">
                Accepts official Instagram .zip archive files only
              </p>
            </div>
          ) : (
            /* Selected File Preview Card */
            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-6 text-left max-w-lg mx-auto shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    <FileArchive className="w-6 h-6 stroke-[2]" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-main text-base truncate" title={selectedFile.name}>
                      {selectedFile.name}
                    </h4>
                    <p className="text-xs text-secondary mt-0.5 font-medium">
                      {formatFileSize(selectedFile.size)} • Ready for analysis
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClearSelectedFile();
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="w-8 h-8 rounded-lg text-secondary hover:text-danger hover:bg-red-50 flex items-center justify-center transition-colors flex-shrink-0"
                  title="Remove and choose a different file"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* JSON Acknowledgement Checkbox */}
        <div className="mt-6 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <label className="flex items-start gap-3.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={jsonAcknowledged}
              onChange={(e) => setJsonAcknowledged(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary focus:ring-offset-1 cursor-pointer accent-primary"
            />
            <div className="flex-1">
              <span className="font-bold text-main text-sm sm:text-base block">
                I have selected JSON format while downloading my Instagram information.
              </span>
              <span className="text-xs text-secondary block mt-0.5">
                Mandatory verification: FollowBack requires JSON files and cannot process HTML exports.
              </span>
            </div>
          </label>
        </div>

        {/* Error Message Box */}
        {error && (
          <div className="mt-6 bg-red-50/90 border-2 border-danger/40 rounded-2xl p-5 sm:p-6 text-left shadow-sm">
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-danger text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-extrabold text-danger text-base mb-1">
                  {error.title}
                </h4>
                <p className="text-sm text-red-900/90 leading-relaxed">
                  {error.message}
                </p>
                {error.actionableGuide && (
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={onViewInstructions}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider text-white bg-danger hover:bg-red-600 transition-colors shadow-sm"
                    >
                      <HelpCircle className="w-4 h-4" />
                      <span>View Download Instructions</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Start Analysis Button */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            onClick={onStartAnalysis}
            disabled={isStartDisabled}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-extrabold text-base transition-all duration-200 ${
              isStartDisabled
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                : 'bg-primary text-white hover:bg-primary-hover shadow-lg shadow-primary/25 active:scale-95'
            }`}
          >
            <span>{isProcessing ? 'Analyzing Data...' : 'Start Analysis'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={onLoadDemoData}
            disabled={isProcessing}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-sm text-secondary hover:text-main bg-white hover:bg-slate-50 border border-slate-200 shadow-sm transition-colors"
            title="Preview the full application with simulated followers data"
          >
            <span>⚡ Try with Demo Data</span>
          </button>
        </div>

        {/* Security / Privacy reassurance banner */}
        <div className="mt-8 text-center flex items-center justify-center gap-2 text-xs text-secondary font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Local browser execution: Your ZIP archive and data never leave this device.</span>
        </div>

      </div>
    </section>
  );
};
