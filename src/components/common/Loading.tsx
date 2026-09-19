import React from 'react';

interface LoadingProps {
  message?: string;
}

// Clean minimalist loading spinner
export const Loading: React.FC<LoadingProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-9 h-9 border-3 border-emerald-100 border-t-[#00ba66] rounded-full animate-spin"></div>
      <p className="mt-3 text-sm text-slate-500 font-medium">{message}</p>
    </div>
  );
};
