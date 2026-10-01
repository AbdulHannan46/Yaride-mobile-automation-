# YRide Android Automation Framework

Android mobile test automation framework for the **YRide** app (`com.jarental.jarental`) built with **WebdriverIO v9**, **Appium 3 (UiAutomator2)**, **TypeScript**, and **Cucumber BDD**.

---

## 1. Prerequisites

- **Node.js**: `>=20.x`
- **Java JDK**: `17+` (with `JAVA_HOME` configured)
- **Android SDK**: `platform-tools` with `adb` added to system `PATH`
- **Appium**: `3.x` with `uiautomator2` driver installed:
  ```powershell
  npm install -g appium
  appium driver install uiautomator2
  ```

---

## 2. Setup & Installation

1. **Install dependencies:**
   ```powershell
   npm install
   ```

2. **Configure environment:**
   ```powershell
   Copy-Item .env.example .env
   ```
   *(Optional: set `ANDROID_DEVICE_UDID` in `.env` if multiple Android devices are connected. If left empty, Appium auto-detects the connected device).*

---

## 3. Connect Android Device

1. Enable **Developer Options** and **USB Debugging** on the physical Android device (or launch an Android emulator).
2. Connect via USB and select **Always allow from this computer**.
3. Verify connection:
   ```powershell
   adb devices
   ```
   *(Ensure device shows status `device`, e.g. `082653335C001041    device`).*

---

## 4. Start Appium Server

In a separate terminal, start the Appium server:

```powershell
appium --port 4723 --address 127.0.0.1
```

---

## 5. Run Tests

```powershell
# Run the active Signup/Authentication suite (18 scenarios)
npm run test:signup

# Run full test suite
npm run test

# Run specific feature suites
npm run test:auth          # All authentication features
npm run test:login         # Login scenarios
npm run test:navigation    # Bottom navigation scenarios
npm run test:smoke         # Smoke tagged tests (@smoke)
```

> **Note for Windows PowerShell:** If script execution policies require it, use `npm.cmd run <script>` or `npx.cmd ...`.

---

## 6. Test Reports (Allure)

### Standalone Portable Report (Single HTML File)
A complete, self-contained report is generated at:
```text
reports/allure-report-single/index.html
```
*You can open this file directly in any web browser or share it as an attachment without running a web server.*

### Generate / View Standard Report
```powershell
# Generate standard HTML report
npm run report:generate

# Generate standalone single-file report
npm run report:single

# Open report in default browser
npm run report:open

# Clean previous test results and reports
npm run report:clean
```

---

## 7. Quality Gates

```powershell
# TypeScript compilation check
npm run typecheck

# ESLint validation
npm run lint
```

---

## 8. Known Application Discrepancies

Documented application defects and UI requirement mismatches (such as Scenario 8 phone boundary validation and missing UI fields) are maintained in [`docs/ui-mismatches.md`](docs/ui-mismatches.md).
