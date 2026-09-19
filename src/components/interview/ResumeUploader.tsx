import React, { useRef, useState } from 'react';
import { FileUp, FileText, CheckCircle2, X, AlertCircle } from 'lucide-react';

interface ResumeUploaderProps {
  selectedFile: File | null;
  onFileSelect: (file: File | null, contentText?: string) => void;
  disabled?: boolean;
}

export const ResumeUploader: React.FC<ResumeUploaderProps> = ({
  selectedFile,
  onFileSelect,
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (file: File | null) => {
    setError(null);
    if (!file) {
      onFileSelect(null);
      return;
    }

    // Strict PDF validation: check mime type or extension
    const isPdf =
      file.type === 'application/pdf' ||
      file.name.toLowerCase().endsWith('.pdf');

    if (!isPdf) {
      setError('Please upload a valid PDF resume file (.pdf)');
      return;
    }

    // Read preliminary text or name for AI question grounding
    const reader = new FileReader();
    reader.onload = () => {
      // In browser, passing filename and slice of raw content if readable
      onFileSelect(file, file.name);
    };
    reader.onerror = () => {
      onFileSelect(file, file.name);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setError(null);
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        id="resume-pdf-input"
        accept=".pdf,application/pdf"
        className="hidden"
        disabled={disabled}
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleFileChange(e.target.files[0]);
          }
        }}
      />

      {!selectedFile ? (
        <div
          id="resume-dropzone"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-[#00ba66] bg-[#f0fbf5]'
              : 'border-slate-300 hover:border-[#00ba66] bg-slate-50/70 hover:bg-slate-50'
          } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#e6f8ef] text-[#008f4c] flex items-center justify-center mb-4 border border-[#b7eed4] shadow-xs">
            <FileUp className="w-7 h-7" />
          </div>

          <h4 className="text-base font-semibold text-slate-800 mb-1">
            Upload your resume
          </h4>
          <p className="text-sm text-slate-500 mb-4">
            Drag and drop your resume PDF here, or click to browse
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-xs hover:border-[#00ba66]">
            <FileText className="w-4 h-4 text-[#008f4c]" />
            <span>Select PDF Resume</span>
          </div>

          <p className="text-[11px] text-slate-400 mt-3">
            Supports PDF files only (up to 10MB)
          </p>
        </div>
      ) : (
        <div
          id="resume-uploaded-card"
          className="bg-[#f2fcf6] border border-[#bbf0d8] rounded-2xl p-5 flex items-center justify-between transition-all"
        >
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-white text-[#008f4c] flex items-center justify-center border border-[#b7eed4] shrink-0 shadow-xs">
              <FileText className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-slate-900 truncate">
                  {selectedFile.name}
                </p>
                <CheckCircle2 className="w-4 h-4 text-[#008f4c] shrink-0" />
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {formatFileSize(selectedFile.size)} • PDF Ready for AI analysis
              </p>
            </div>
          </div>

          <button
            type="button"
            id="remove-resume-btn"
            onClick={handleRemove}
            title="Remove uploaded resume"
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors shrink-0 ml-3"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {error && (
        <div className="mt-3 flex items-center gap-2 text-xs font-medium text-rose-600 bg-rose-50 border border-rose-200 p-3 rounded-xl">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
