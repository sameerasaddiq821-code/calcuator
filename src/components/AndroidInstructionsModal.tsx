import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Download,
  Terminal,
  CheckCircle2,
  FileCode,
  Package,
  Layers,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';

interface AndroidInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidInstructionsModal: React.FC<AndroidInstructionsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'pwa' | 'apk' | 'gradle'>('pwa');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const capacitorConfig = `{
  "appId": "com.university.studyperformance",
  "appName": "Student Study Performance Calculator",
  "webDir": "dist",
  "bundledWebRuntime": false,
  "server": {
    "androidScheme": "https"
  }
}`;

  const gradleSnippet = `// android/app/build.gradle
android {
    namespace "com.university.studyperformance"
    compileSdk 34
    defaultConfig {
        applicationId "com.university.studyperformance"
        minSdk 24
        targetSdk 34
        versionCode 1
        versionName "1.0.0"
    }
    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] flex flex-col bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                Android Installation & APK Build Guide
              </h3>
              <p className="text-xs text-slate-400">
                Install directly on Android or package into native APK
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-800 px-5 bg-slate-950/40 text-xs">
          <button
            onClick={() => setActiveTab('pwa')}
            className={`py-3 px-3 font-medium border-b-2 transition ${
              activeTab === 'pwa'
                ? 'border-indigo-500 text-indigo-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Method 1: Direct WebAPK Install (No PC needed)
          </button>
          <button
            onClick={() => setActiveTab('apk')}
            className={`py-3 px-3 font-medium border-b-2 transition ${
              activeTab === 'apk'
                ? 'border-indigo-500 text-indigo-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Method 2: Native Android Studio APK
          </button>
          <button
            onClick={() => setActiveTab('gradle')}
            className={`py-3 px-3 font-medium border-b-2 transition ${
              activeTab === 'gradle'
                ? 'border-indigo-500 text-indigo-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Project Manifest & Gradle
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-300">
          {activeTab === 'pwa' && (
            <div className="space-y-4">
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-emerald-300">
                <div className="flex items-center gap-2 font-semibold text-sm mb-1 text-emerald-200">
                  <CheckCircle2 className="w-4 h-4" />
                  Instant Android WebAPK Deployment
                </div>
                Android Chrome automatically wraps this PWA into a true native Android package (.apk) signed and installed directly to your phone's app drawer.
              </div>

              <div className="space-y-2.5">
                <h4 className="font-semibold text-white text-sm">How to install on any Android phone:</h4>
                <ol className="list-decimal list-inside space-y-2 text-slate-300 leading-relaxed bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
                  <li>
                    Open this app URL in <strong>Google Chrome</strong>, <strong>Samsung Internet</strong>, or <strong>Edge</strong> on your Android phone.
                  </li>
                  <li>
                    Tap the <strong>"Install App"</strong> button in the top bar of this screen, OR tap the Chrome menu (three dots in top right) &gt; <strong>"Install app"</strong> / <strong>"Add to Home screen"</strong>.
                  </li>
                  <li>
                    A native Android install dialog will pop up showing the app title <em>Student Study Performance Calculator</em>.
                  </li>
                  <li>
                    Tap <strong>Install</strong>. Android will generate the WebAPK and place the icon on your home screen and app launcher.
                  </li>
                  <li>
                    <strong>Works 100% Offline:</strong> Turn on Airplane mode—the application boots instantly from local cache and calculates locally without any network connection!
                  </li>
                </ol>
              </div>
            </div>
          )}

          {activeTab === 'apk' && (
            <div className="space-y-4">
              <p className="text-slate-300">
                To build a standalone signed Release APK (<code>app-release.apk</code>) using Android Studio and Capacitor:
              </p>

              <div className="space-y-3">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-200 relative">
                  <div className="text-slate-400 mb-1"># 1. Build the production web bundle</div>
                  <div>npm run build</div>
                  <div className="text-slate-400 mt-2 mb-1"># 2. Add Capacitor Android platform</div>
                  <div>npm install @capacitor/core @capacitor/cli @capacitor/android</div>
                  <div>npx cap init "Student Performance" "com.university.studyperformance" --web-dir=dist</div>
                  <div>npx cap add android</div>
                  <div className="text-slate-400 mt-2 mb-1"># 3. Compile release APK with Gradle</div>
                  <div>cd android && ./gradlew assembleRelease</div>
                  <div className="text-emerald-400 mt-2">
                    # Output: android/app/build/outputs/apk/release/app-release-unsigned.apk
                  </div>

                  <button
                    onClick={() =>
                      handleCopy(
                        `npm run build\nnpm install @capacitor/core @capacitor/cli @capacitor/android\nnpx cap init "Student Performance" "com.university.studyperformance" --web-dir=dist\nnpx cap add android\ncd android && ./gradlew assembleRelease`,
                        'apk-cmds'
                      )
                    }
                    className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                    title="Copy commands"
                  >
                    {copiedCode === 'apk-cmds' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 space-y-1">
                  <span className="font-semibold text-white">Installing APK on phone:</span>
                  <p className="text-slate-400">
                    Connect Android phone via USB with USB Debugging enabled, then run: <br />
                    <code className="text-indigo-300 bg-slate-900 px-1 py-0.5 rounded">adb install app-release.apk</code> or transfer via Bluetooth / Google Drive.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'gradle' && (
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1 text-slate-400">
                  <span>capacitor.config.json</span>
                  <button
                    onClick={() => handleCopy(capacitorConfig, 'cap-config')}
                    className="flex items-center gap-1 text-[11px] text-indigo-400 hover:underline"
                  >
                    {copiedCode === 'cap-config' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-200 overflow-x-auto">
                  {capacitorConfig}
                </pre>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1 text-slate-400">
                  <span>android/app/build.gradle config</span>
                  <button
                    onClick={() => handleCopy(gradleSnippet, 'gradle-config')}
                    className="flex items-center gap-1 text-[11px] text-indigo-400 hover:underline"
                  >
                    {copiedCode === 'gradle-config' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-200 overflow-x-auto">
                  {gradleSnippet}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Offline ready • Zero telemetry • Material Design 3
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
