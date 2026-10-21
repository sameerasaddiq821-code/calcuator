# Student Study Performance Calculator (Android Mobile App)

A modern, responsive Android mobile application designed to help university students evaluate academic performance using official weighted rubrics.

---

## 📐 Calculation Formula

The application calculates the Student Performance Score out of 100 using this weighted formula:

$$\text{Performance Score} = (\text{Average Marks} \times 0.40) + (\text{Attendance} \times 0.20) + (\text{Assignment Score} \times 0.20) + (\text{Quiz Score} \times 0.20)$$

The final score is rounded to exactly **one decimal place**.

---

## 🏆 Performance Classification & Recommended Actions

| Score Range | Category | Recommended Next Action |
|---|---|---|
| **80 – 100** | **Excellent** | Maintain your current study habits and continue aiming for high performance. |
| **70 – 79.9** | **Very Good** | Maintain your performance and focus on the areas with relatively lower scores. |
| **60 – 69.9** | **Good** | Improve your weaker areas through more consistent study and practice. |
| **50 – 59.9** | **Needs Improvement** | Increase study time, improve attendance, and seek academic support where needed. |
| **Below 50** | **Critical** | Develop an immediate improvement plan and consult your teacher/advisor for academic support. |

---

## 🧪 Verification Benchmarks

The app comes with one-tap benchmark presets to verify calculation correctness:

1. **Example 1 (High Achiever)**:
   - Marks = `90`, Attendance = `95`, Assignment = `85`, Quiz = `90`
   - Expected Score = **90.0**
   - Category = **Excellent**

2. **Example 2 (Average Standing)**:
   - Marks = `65`, Attendance = `70`, Assignment = `60`, Quiz = `65`
   - Expected Score = **65.0**
   - Category = **Good**

3. **Example 3 (Academic Risk)**:
   - Marks = `40`, Attendance = `45`, Assignment = `50`, Quiz = `40`
   - Expected Score = **43.0**
   - Category = **Critical**

---

## 📱 Installation & Running on Android

### Method 1: 1-Click Android WebAPK Direct Install (Recommended)
1. Open the app link in **Google Chrome**, **Samsung Internet**, or **Edge** on an Android phone.
2. Tap the **"Install to Android"** button at the top, or open the browser menu (⋮) and tap **"Install app"** / **"Add to Home screen"**.
3. Android generates a native **WebAPK** package and adds the application directly to your home screen and launcher.
4. **Offline support:** The app is cached locally via Service Worker and functions with zero network connectivity.

### Method 2: Building Standalone Native Android APK with Android Studio & Capacitor
```bash
# 1. Build the production web bundle
npm run build

# 2. Initialize Capacitor Android project
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init "Student Performance" "com.university.studyperformance" --web-dir=dist
npx cap add android

# 3. Compile release APK with Gradle
cd android
./gradlew assembleRelease

# 4. Output APK location:
# android/app/build/outputs/apk/release/app-release-unsigned.apk
```
