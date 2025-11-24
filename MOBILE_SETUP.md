# 📱 LocalSkillHub - Android App Setup Guide

Your React web app has been successfully configured to build as an **Android mobile app** using Capacitor!

---

## ✅ What's Been Done

1. ✔ Capacitor installed and initialized
2. ✔ Android platform added (check the `android/` folder)
3. ✔ Build scripts configured
4. ✔ Your app name: **LocalSkillHub**
5. ✔ Bundle ID: `com.localskillhub.app`

---

## 🚀 How to Build and Run Your Android App

### **Step 1: Install Android Studio**

You need Android Studio to build and test Android apps.

**Download:** https://developer.android.com/studio

After installation:
1. Open Android Studio
2. Go to **Settings/Preferences → Appearance & Behavior → System Settings → Android SDK**
3. Install **Android SDK** (API Level 33 or higher recommended)
4. Install **Android SDK Build-Tools**

### **Step 2: Open Your Android Project**

Run this command in your terminal:

```bash
npm run android
```

This will:
- Build your React app
- Sync files to the Android project
- Open Android Studio with your project

**OR** manually open Android Studio and select:
```
/Users/aryanjain/Documents/it_project_app/android
```

### **Step 3: Run on Emulator or Real Device**

**Option A: Android Emulator (Virtual Device)**
1. In Android Studio, click **Device Manager** (phone icon)
2. Click **Create Device**
3. Choose a phone model (e.g., Pixel 7)
4. Download a system image (API 33+)
5. Click the **green play button** in Android Studio

**Option B: Real Android Phone**
1. Enable **Developer Options** on your phone:
   - Go to Settings → About Phone
   - Tap **Build Number** 7 times
2. Enable **USB Debugging** in Developer Options
3. Connect your phone via USB
4. Allow USB debugging when prompted
5. Click the **green play button** in Android Studio

---

## 🔄 Development Workflow

### When you make changes to your React code:

```bash
npm run android:sync
```

This rebuilds your app and syncs changes to Android. Then in Android Studio, click the **green play button** again.

### To just build without opening Android Studio:

```bash
npm run build
npx cap sync android
```

---

## 📦 Adding Mobile Features

Since you're building a service marketplace, you'll likely need these Capacitor plugins:

### **1. Camera (for provider profile photos)**
```bash
npm install @capacitor/camera
```

### **2. Geolocation (for finding nearby providers)**
```bash
npm install @capacitor/geolocation
```

### **3. Push Notifications (for booking alerts)**
```bash
npm install @capacitor/push-notifications
```

### **4. Status Bar customization**
```bash
npm install @capacitor/status-bar
```

After installing plugins, run:
```bash
npx cap sync android
```

**Plugin docs:** https://capacitorjs.com/docs/plugins

---

## 🎨 Customizing Your App

### **App Icon & Splash Screen**

1. Create your app icon (1024x1024 PNG)
2. Use this free tool: https://icon.kitchen/
3. Download the Android assets
4. Replace files in: `android/app/src/main/res/`

### **App Name**

Edit: `android/app/src/main/res/values/strings.xml`
```xml
<string name="app_name">LocalSkillHub</string>
```

### **Permissions (Camera, Location, etc.)**

Edit: `android/app/src/main/AndroidManifest.xml`
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
```

---

## 📱 Making Your App Mobile-Friendly

### Important CSS/UI Tips:

1. **Use viewport meta tag** (already in `index.html`):
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
```

2. **Add safe-area for notches** in your CSS:
```css
body {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
}
```

3. **Make buttons touch-friendly** (minimum 44x44px)

4. **Test on small screens** (use Chrome DevTools mobile view)

5. **Add bottom navigation** instead of top navbar for easier thumb access

---

## 🚢 Building APK for Testing

When you want to share your app with testers:

1. Open Android Studio
2. Go to **Build → Build Bundle(s) / APK(s) → Build APK(s)**
3. Wait for build to complete
4. Find your APK in: `android/app/build/outputs/apk/debug/app-debug.apk`
5. Share this file - anyone can install it!

---

## 🏪 Publishing to Google Play Store

When ready to launch:

1. **Create a Google Play Developer account** ($25 one-time fee)
   https://play.google.com/console

2. **Generate a signed release build:**
   - In Android Studio: **Build → Generate Signed Bundle / APK**
   - Choose **Android App Bundle (AAB)**
   - Create a keystore (keep it safe!)

3. **Upload to Play Console:**
   - Create a new app
   - Fill in store listing details
   - Upload your AAB file
   - Submit for review

**Note:** First review takes 3-7 days. Updates are usually approved within 24 hours.

---

## 🐛 Troubleshooting

### **App not loading / White screen:**
```bash
# Clear cache and rebuild
rm -rf dist android/app/src/main/assets/public
npm run build
npx cap sync android
```

### **Gradle errors:**
```bash
cd android
./gradlew clean
cd ..
npx cap sync android
```

### **Can't find Android SDK:**
Set `ANDROID_HOME` in your `~/.zshrc`:
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

Then run: `source ~/.zshrc`

---

## 📚 Learning Resources

- **Capacitor Docs:** https://capacitorjs.com/docs
- **Android Developer Guide:** https://developer.android.com/guide
- **React for Mobile:** https://capacitorjs.com/docs/guides/react

---

## 💡 Next Steps for LocalSkillHub

To make your app production-ready:

1. ✅ Add location-based search using Geolocation API
2. ✅ Implement camera for profile photos
3. ✅ Add push notifications for bookings
4. ✅ Create a bottom navigation bar
5. ✅ Add pull-to-refresh on service listings
6. ✅ Optimize images for mobile
7. ✅ Add offline support with Service Workers
8. ✅ Test payment integration (Razorpay/Paytm)
9. ✅ Add deep linking for sharing services
10. ✅ Implement ratings & reviews

---

## 🎉 You're All Set!

Your LocalSkillHub app is now ready to run on Android!

**Start with:**
```bash
npm run android
```

Good luck with your app! 🚀
