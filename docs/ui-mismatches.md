# YRide Signup Scenarios — UI-Requirement Discrepancies

This document records confirmed discrepancies between the Lead QA-specified scenarios
and the current YRide application UI, discovered during live device inspection.

These are **not automation failures**. They are product/requirement findings that
must be resolved at the product level before automation can be extended.

---

## Discrepancy 1: Lead Scenario #11 — Password Confirmation Mismatch

**Lead requirement:**
> The Signup form should reject submission when the "Confirm Password" field does not
> match the "Password" field.

**Observed application UI:**
The current Signup screen contains exactly **one** password input field. There is no
"Confirm Password" or "Re-enter Password" field visible in the current build.

**Automation status:** ❌ **Cannot be implemented**

**Recommendation:**
- If the feature is planned: implement the Confirm Password field in the application
  and re-run locator discovery.
- If the feature does not exist at product level: remove scenario #11 from scope
  or mark it as a product backlog item.

---

## Discrepancy 2: Lead Scenario #12 — T&C Validation During Signup

**Lead requirement:**
> The Signup process should require the user to accept the Terms & Conditions before
> creating an account.

**Observed application UI:**
The Signup screen contains an **informational text statement** reading approximately:
> "By signing up, you agree to our Terms of Service and Privacy Policy."

There is **no T&C checkbox, radio button, or toggle** on the Signup screen.
The user does not need to explicitly check a box — submission is permitted regardless.

**Actual T&C acceptance point:**
T&C acceptance is enforced during **initial application onboarding** (first launch):

```
App Launch
  → Disclaimer / Terms & Conditions screen  ← Mandatory acceptance here
  → Accept Terms & Conditions
  → List • Protect • Retire onboarding
  → Sign In to YRide
  → Sign Up
```

**Automation status:** ⚠️ **Redirected** — see `onboarding.feature`

**Recommendation:**
- If a Signup-page T&C checkbox is a product requirement, it needs to be added to the UI.
- The current onboarding-level T&C acceptance has been automated in `onboarding.feature`.

---

## Discrepancy 3: Scenarios 13–15 — API/Backend-Dependent Assertions

**Lead requirements:**
- **#13 Successful API Response:** Verify the API returns a 200/201 success response.
- **#14 Signup API Failure:** Simulate API 4xx/5xx failure and verify UI behavior.
- **#15 Partial Registration Rollback:** Verify no orphaned user record in the database.

**Current environment:**
- No API documentation provided.
- No API interceptor or network proxy has been configured.
- No database access has been provided.
- No backend test hooks have been identified.

**Automation status:** ⚠️ **Backend access required**

UI-observable behavior for scenarios #13–15 is already covered by:
- #1 (Successful Signup) — user-visible success flow
- #6, #7, #8 (Invalid data) — server-side rejection messages visible in UI

**Recommendation:**
To fully automate scenarios 13–15, provide one or more of:
- REST API documentation + test environment credentials
- Network proxy configuration (e.g., WireMock, Proxyman, Charles)
- Database query access for post-registration state verification
- Backend test stub/hook that can simulate API failures

---

## Discrepancy 4: Lead Scenario #8 — Phone Number Boundary Length (Confirmed Application Defect)

**Lead requirement:**
> The Signup form should validate phone number boundary lengths and reject subscriber numbers
> that do not meet the 7-digit standard for the Jamaican numbering plan (+1 876).

**Observed application behavior:**
- Entering special characters (e.g. `123#456`) is rejected with `"Invalid Mobile Number"`.
- Entering a leading zero (e.g. `0123456`) is rejected with `"Invalid Mobile Number"`.
- However, entering **5 or 6 digits** (e.g., `12345`, `234567`) is **accepted by the backend**,
  displaying the Success Modal and creating an account rather than rejecting with a validation error.

**Automation status:** ⚠️ **Tagged `@defect`**
- Automated in `signup.feature` under `@signup-validation @defect`.
- Tagged with `@defect` so that the standard test run excludes known bugs while maintaining
  full automated reproduction for when development provides a fix.

---

## Observed Application Behavior (Documented Rules)

These rules are derived from live device testing, **not invented**:

| Field | Observed Rule |
|:---|:---|
| Password minimum length | 6 characters (5 rejected, 6 accepted) |
| Phone format | +1 876 + **7 subscriber digits** accepted (standard NANP format) |
| Phone format | +1 876 + **5 or 6 digits** accepted by backend (e.g. 12345, 234567) — **Defect**: permits registration without enforcing 7-digit subscriber boundary |
| Phone special chars | Accepted by input field; rejected on submission ("Invalid Mobile Number") |
| Currency default | USD |
| Currency options | USD, JMD |
| Referral Code | Optional — submission proceeds without it |
| Confirm Password | Field does not exist in current UI |
| T&C checkbox | Does not exist on Signup screen |
| OTP verification | Not observed during Signup flow |
| Email verification | Not observed during Signup flow |

**Known existing data:**
- Phone `1234567` returns "Already exists mobile number" — a real account exists with this number.
  This phone is **not** used as an invalid-format test value in the automation suite.

---

*Last updated: 2026-09-29 — YRide version at time of investigation: current production build*
