# Android Setup Guide

This guide will help you set up Android development for your Ionic React app with Capacitor.

## Prerequisites

1. **Node.js** (already installed)
2. **Android Studio** - Download from [developer.android.com](https://developer.android.com/studio)
3. **Java Development Kit (JDK) 11 or higher**

## Android Studio Setup

### 1. Install Android Studio
- Download and install Android Studio
- During installation, make sure to install:
  - Android SDK
  - Android SDK Platform
  - Android Virtual Device

### 2. Configure Android SDK
1. Open Android Studio
2. Go to **Tools > SDK Manager**
3. Install the following:
   - **Android SDK Platform 33** (API Level 33)
   - **Android SDK Build-Tools 33.0.0**
   - **Android SDK Command-line Tools**
   - **Android Emulator**

### 3. Set Environment Variables
Add these to your system environment variables:

**Windows:**
```bash
ANDROID_HOME=C:\Users\[USERNAME]\AppData\Local\Android\Sdk
ANDROID_SDK_ROOT=C:\Users\[USERNAME]\AppData\Local\Android\Sdk
```

**macOS/Linux:**
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export ANDROID_SDK_ROOT=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

## Project Setup Commands

### 1. Add Android Platform
```bash
npm run android:add
```

### 2. Build and Sync
```bash
npm run android:build
```

### 3. Open in Android Studio
```bash
npm run android:open
```

## Building APK

### Method 1: Through Android Studio (Recommended)
1. Run `npm run android:open`
2. In Android Studio:
   - Select **Build > Build Bundle(s) / APK(s) > Build APK(s)**
   - Wait for build to complete
   - APK will be in `android/app/build/outputs/apk/debug/`

### Method 2: Command Line
```bash
cd android
./gradlew assembleDebug
```

### Method 3: Release APK
1. Generate signing key:
```bash
keytool -genkey -v -keystore my-release-key.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias my-key-alias
```

2. Update `android/app/build.gradle`:
```gradle
android {
    ...
    signingConfigs {
        release {
            storeFile file('../../my-release-key.keystore')
            storePassword 'your-store-password'
            keyAlias 'my-key-alias'
            keyPassword 'your-key-password'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

3. Build release APK:
```bash
cd android
./gradlew assembleRelease
```

## Development Workflow

### 1. Live Reload Development
```bash
npm run capacitor:serve
```

### 2. Build and Test on Device
```bash
npm run android:run
```

### 3. Sync Changes
After making changes to web assets:
```bash
npm run android:sync
```

## Troubleshooting

### Common Issues

1. **Gradle Build Failed**
   - Ensure Android SDK is properly installed
   - Check environment variables
   - Try cleaning: `cd android && ./gradlew clean`

2. **Device Not Detected**
   - Enable Developer Options on Android device
   - Enable USB Debugging
   - Install device drivers

3. **Build Tools Version**
   - Update Android SDK Build-Tools to latest version
   - Ensure compileSdkVersion matches installed SDK

### Useful Commands

```bash
# Check Capacitor configuration
npx cap doctor

# List available devices
npx cap run android --list

# Clean and rebuild
cd android && ./gradlew clean && cd .. && npm run android:build

# View device logs
npx cap run android --livereload --external
```

## Native Features Available

Your app now has access to these native capabilities:

- **Camera**: Take photos and access gallery
- **Filesystem**: Read/write files to device storage
- **Share**: Native sharing functionality
- **Splash Screen**: Custom app launch screen
- **Status Bar**: Control status bar appearance
- **Haptics**: Vibration feedback
- **Device Info**: Access device information
- **Network**: Check connectivity status

## Next Steps

1. **Test on Real Device**: Connect Android device and run `npm run android:run`
2. **Customize App Icon**: Replace icons in `android/app/src/main/res/`
3. **Configure Permissions**: Edit `android/app/src/main/AndroidManifest.xml`
4. **Add Splash Screen**: Customize in `android/app/src/main/res/drawable/`
5. **Prepare for Play Store**: Follow Google Play Console guidelines

## Play Store Deployment

1. **Build Release APK**: Follow release build steps above
2. **Test Thoroughly**: Test on multiple devices and Android versions
3. **Create Play Console Account**: Sign up at [play.google.com/console](https://play.google.com/console)
4. **Upload APK**: Create new app and upload your signed APK
5. **Complete Store Listing**: Add descriptions, screenshots, and metadata

Your Ionic React app is now ready for Android development and deployment!