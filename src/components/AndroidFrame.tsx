import React, { useState, useEffect } from 'react';
import {
  Wifi,
  Battery,
  Smartphone,
  Maximize2,
  Minimize2,
  HelpCircle,
  Download,
  Info,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface AndroidFrameProps {
  children: React.ReactNode;
  onOpenAndroidHelp: () => void;
  onReset: () => void;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
  onOpenAndroidHelp,
  onReset,
}) => {
  const [isPhoneFrame, setIsPhoneFrame] = useState(true);
  const [currentTime, setCurrentTime] = useState('');
  const { isInstallable, install } = usePWAInstall();

  // Keep live time updated for Android status bar
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-start p-0 sm:py-6 sm:px-4">
      {/* Top Desktop Controls Bar */}
      <div className="w-full max-w-4xl flex items-center justify-between px-4 py-2 mb-2 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Android Mobile Edition</span>
          </div>
          <span className="hidden sm:inline text-slate-500">|</span>
          <span className="hidden sm:inline text-slate-400">Material Design 3</span>
        </div>

        <div className="flex items-center gap-2">
          {/* In-App PWA Install */}
          {isInstallable && (
            <button
              onClick={install}
              className="flex items-center gap-1.5 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition shadow-sm"
              title="Install app to your Android home screen"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install to Android</span>
            </button>
          )}

          {/* Android APK & Install Instructions */}
          <button
            onClick={onOpenAndroidHelp}
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition"
            title="Android APK and installation instructions"
          >
            <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">APK & Install Guide</span>
            <span className="sm:hidden">Guide</span>
          </button>

          {/* Frame Toggle */}
          <button
            onClick={() => setIsPhoneFrame(!isPhoneFrame)}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition"
            title={isPhoneFrame ? 'Expand to responsive full width' : 'Wrap in Android phone mockup'}
          >
            {isPhoneFrame ? (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Full Width</span>
              </>
            ) : (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Phone Frame</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Container - either Android Device Mockup or Fluid View */}
      <div
        className={`w-full transition-all duration-300 ${
          isPhoneFrame
            ? 'max-w-[440px] sm:rounded-[44px] sm:border-[8px] sm:border-slate-800 sm:ring-1 sm:ring-slate-700/60 sm:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] bg-slate-900 overflow-hidden'
            : 'max-w-2xl bg-slate-900 sm:rounded-3xl sm:border sm:border-slate-800 sm:shadow-2xl overflow-hidden'
        }`}
      >
        {/* Android Native Status Bar */}
        <div className="bg-slate-950/90 text-slate-300 px-6 pt-3 pb-2 flex items-center justify-between text-xs select-none sticky top-0 z-30 border-b border-slate-800/40 backdrop-blur-md">
          {/* Left: Time & notification dot */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white tracking-wide font-mono">
              {currentTime || '09:41'}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
          </div>

          {/* Center: Punch-hole camera (visible when in phone frame) */}
          {isPhoneFrame && (
            <div className="hidden sm:flex items-center justify-center">
              <div className="w-3.5 h-3.5 rounded-full bg-black ring-2 ring-slate-800 flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-blue-900/60" />
              </div>
            </div>
          )}

          {/* Right: Network & Battery status */}
          <div className="flex items-center gap-2 text-slate-300 font-mono text-[11px]">
            <span className="text-[10px] font-bold text-slate-400">5G</span>
            <Wifi className="w-3.5 h-3.5 text-slate-300" />
            <div className="flex items-center gap-1">
              <span>98%</span>
              <Battery className="w-4 h-4 text-emerald-400 fill-emerald-400" />
            </div>
          </div>
        </div>

        {/* Child Application Screen Content */}
        <div className="p-4 sm:p-5 pb-6 overflow-y-auto max-h-[calc(100vh-60px)] sm:max-h-[820px] scrollbar-thin scrollbar-thumb-slate-700">
          {children}
        </div>

        {/* Android Bottom Navigation Pill */}
        <div className="bg-slate-950/90 py-2.5 flex items-center justify-center border-t border-slate-800/60 select-none">
          <div className="w-32 h-1 rounded-full bg-slate-600/70 hover:bg-slate-500 transition-colors cursor-pointer" />
        </div>
      </div>
    </div>
  );
};
