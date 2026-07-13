# OnboardIQ Journey Builder — Business Rules

> **Scope**: Every behavioural rule governing the Journey Builder product, extracted from the Trigger Node, Switch Node, Bundle-Based Definition Configuration System, Product Note (Bundles/Templates/Components), Document Treatment Template, User Stories, and Vision 2026 PRDs.
>
> **Not in scope**: Visual design, component styling, UI layout specifics.

---

## 1. Product Overview

OnboardIQ is an Adaptive Trust Orchestration Engine for KYC/KYB onboarding. The Journey Builder is a low-code canvas where users compose onboarding workflows from reusable Bundles, Components, Rules, and API integrations. Journeys automatically branch based on risk thresholds, policy configuration, and regulatory requirements.

The system hierarchy is: **Component → Bundle → Journey → Template Journey → Go-Live Journey**.

A Journey is composed of Bundles (reusable, versioned, QA-tested blocks), Components (17 basic building blocks: text box, link, tile, dropdown, etc.), Rules (visibility, workflow, conditional), APIs (with conditions and error messages), Document Treatments, and Templates (front-end/UI of a Bundle).

---

## 2. User Roles

### ROLE-01: L2 / L1 Team (Journey Builder)

- **Description**: Internal support/engineering personnel who build journeys per scope.
- **Trigger**: Assigned a journey build task.
- **Condition**: Must have engineering background; well-versed with IDfy terminologies, APIs, and systems.
- **Permissions**: Full JSON modification rights. Full Canvas access. Can create/modify bundles.
- **Exceptions**: Has no idea of regulations. Lacks understanding of customer experience.

### ROLE-02: Pre-sales / MD

- **Description**: Non-engineering or semi-technical personnel who build scope and journeys.
- **Trigger**: Customer engagement or scoping exercise.
- **Condition**: Somewhat familiar with IDfy terminologies. Low-to-medium JSON ability.
- **Permissions**: Can build journeys from Canvas. May want to act as checker only (provide comments/rectifications). Cannot certify that all necessary checks and error messages are configured.
- **Exceptions**: Wants to build main journey components without much effort/input. Lacks UI/UX understanding. Mistake in scope results in wrong journey.

### ROLE-03: Client

- **Description**: External customer onboarding their users.
- **Trigger**: Engages IDfy for onboarding solution.
- **Condition**: May or may not have engineering background. Not well-versed with IDfy terminology. Low familiarity with Journey Builder.
- **Permissions**: Can view journey. Wants theme to be highly customisable. Ability to understand API docs varies (Tech team: High, Product: Medium, Business: Low).
- **Exceptions**: May not have a clear understanding of regulations.

### ROLE-04: IDfy Admin

- **Description**: Internal administrator with elevated system privileges.
- **Trigger**: System configuration tasks.
- **Condition**: Internal IDfy role.
- **Permissions**: Can flag custom use cases as `Scope: Global`. Can set "no capping" on attempt limits. Can vet bundles before they are stored globally.
- **Exceptions**: None specified.

### ROLE-05: QA

- **Description**: Quality assurance role.
- **Trigger**: Journey submitted for approval.
- **Condition**: Post-approval, journey is assigned to QA.
- **Permissions**: QA approval is received before journey can be published to UAT/live.
- **Exceptions**: None specified.

---

## 3. User States

### STATE-01: Journey — Draft

- **Description**: Journey is being built/edited on Canvas.
- **Trigger**: User clicks "Create Profile" or opens existing draft.
- **Condition**: Not yet submitted for approval.
- **Outcome**: Can be modified freely. Multiple users can build the journey.

### STATE-02: Journey — Pending Approval

- **Description**: Journey submitted for review.
- **Trigger**: User sends profile for approval.
- **Condition**: Approver can assign comments to maker to resolve.
- **Outcome**: Journey cannot be published until approved.

### STATE-03: Journey — QA Review

- **Description**: Post-approval, journey is assigned to QA.
- **Trigger**: Approval received.
- **Condition**: QA approval must be received.
- **Outcome**: Only after QA approval can the journey be published.

### STATE-04: Journey — Published (UAT / Production)

- **Description**: Journey is live.
- **Trigger**: Publish action after QA approval.
- **Condition**: All validations pass (see Publish Validation rules).
- **Outcome**: Journey is immutable via bundle snapshots. Editing loads snapshot, not latest bundle.

### STATE-05: End-User Journey — Active

- **Description**: End-user is progressing through a journey.
- **Trigger**: Journey initiated via API, manual, or hybrid trigger.
- **Condition**: Link not expired. Device matches configuration.
- **Outcome**: User can progress through screens/bundles.

### STATE-06: End-User Journey — Expired

- **Description**: Journey link has exceeded its expiry.
- **Trigger**: Expiry date reached (either X days from generation or specific API-provided date).
- **Condition**: Maximum supported expiry is 365 days.
- **Outcome**: User cannot access or continue the journey.

### STATE-07: End-User Journey — Ineligible / Auto-Rejected

- **Description**: User terminated mid-journey due to hard-stop conditions.
- **Trigger**: "End Journey If" rule fires (e.g., cancelled ID, criminal cases, prohibited MCC code).
- **Condition**: Detection of ineligibility via finding, declaration, or API result.
- **Outcome**: Journey is immediately submitted (even with unfilled mandatory fields). Post-submission checks are NOT run. User is directed to alternate "Thank You" page with optional rejection reason.

---

## 4. Eligibility Rules

### ELIG-01: Journey Link Expiry

- **Description**: Every journey link has a configurable expiry.
- **Trigger**: Link generation.
- **Condition**: Expiry is set as EITHER `X days from link generation` OR a `specific date received over API`. Only one mode can be selected. Maximum supported = 365 days.
- **Outcome**: Expired links prevent journey access.
- **Exceptions**: If expiry is date-based, the date is received as input over API or form (for manual generation). Otherwise, default is X days post-initiation.

### ELIG-02: Device Enforcement

- **Description**: Journeys are configured for specific device classes.
- **Trigger**: User opens journey link.
- **Condition**: System detects User Agent (UA) on link access.
- **Outcome**:
  - Mobile-only link opened on Desktop → Show QR code encoding session token for seamless handover. Message: "This journey can only be opened in a Mobile/Tablet."
  - Desktop-only link opened on Mobile → Show error: "This journey can only be opened in a Desktop."
  - Kiosk journey → Auto-configured for USB-attached camera (webcam).
- **Exceptions**: None.
- **Related systems**: Device detection, QR code generator, session token management.

### ELIG-03: Ineligible User — Hard Stop

- **Description**: Certain conditions immediately terminate onboarding.
- **Trigger**: "End Journey If" rule evaluates to true.
- **Condition**: Based on finding, declaration, or API result. Examples: ID = Cancelled/Suspended; MCC code = Alcohol/Drug related; criminal cases detected.
- **Outcome**: Journey terminates immediately. Case is submitted even without user completing mandatory fields. Auto-rejected. Post-submission checks are NOT run.
- **Exceptions**: None — this is a hard stop.

### ELIG-04: Minor Nominee Handling

- **Description**: Nominees under 18 require guardian details.
- **Trigger**: Date of birth entered for nominee.
- **Condition**: If calculated `Age < 18` AND `Allow minor nominee == Yes`.
- **Outcome**: System automatically toggles Guardian Details section. If `Enforce guardian == Yes`, "Next" button remains disabled until all Guardian fields (Name, Relationship) are filled for every minor nominee.
- **Exceptions**: All nominees can be minors, provided each has an associated guardian (even the same guardian for all). Applicant can serve as guardian — no "Duplicate" error thrown.

---

## 5. Verification Rules

### VER-01: Pre-fill Field Regex Validation

- **Description**: Trigger Node input fields must pass regex before journey starts.
- **Trigger**: Payload received via API or manual form submission.
- **Condition**: Each field checked against its configured regex pattern.
- **Outcome**: If validation fails → return `400 Bad Request` with specific error message. If manual form has missing mandatory field → UI highlights field in red before submission.
- **Exceptions**: Regex must support Unicode for internationalisation (non-Latin characters).
- **Related systems**: Trigger Node.

### VER-02: Document Integrity Verification (DIV)

- **Description**: Mandatory document checks must pass for journey progression.
- **Trigger**: Document uploaded/captured in journey.
- **Condition**: Mandatory DIV check runs.
- **Outcome**: If mandatory DIV fails → system triggers `BLOCKING_ERROR`, preventing journey progression.
- **Exceptions**: If "Run in Journey" is toggled, checks trigger immediately post-upload. If "Post Submission" is toggled, API runs after journey submission.

### VER-03: Face Comparison

- **Description**: Cross-bundle validation comparing face images.
- **Trigger**: Face comparison configured between bundles (e.g., Selfie vs. POA).
- **Condition**: Both source and target bundles must have face image keys. Only selfie image keys shown in dropdown for face comparison.
- **Outcome**: Comparison runs at the bundle where it's configured. Can only reference prior bundles/components in the journey.
- **Exceptions**: If face comparison is set with a document that has no face image → RC shows: "Unable to run face comparison as face image not detected on document."

### VER-04: Name / DOB / String / Address Comparison

- **Description**: Cross-bundle data comparisons.
- **Trigger**: Advanced validation configured.
- **Condition**: Comparison sources can be pre-fill fields, bundle keys, or API verification responses.
- **Outcome**: Name and Address comparisons support fuzzy logic with configurable threshold. All other string comparisons use strict matching.
- **Exceptions**: If comparison target (pre-fill field) is empty → system defaults to `SKIP_VALIDATION` but logs warning in instrumentation and RC/Back-office.

### VER-05: Location Comparison (Geospatial)

- **Description**: Asset photo location compared against declared address.
- **Trigger**: Shop AI / SiteScan bundle with location comparison enabled.
- **Condition**: System fetches reference address key, converts to coordinates via Geocoding API, calculates distance against captured lat-long.
- **Outcome**: If distance exceeds threshold → fails.
- **Exceptions**:
  - GPS denied by user → blocking overlay: "Location access is required to verify this asset."
  - VPN/Mock location detected → immediate fail, flagged as "Location Spoofer Detected."
  - Reverse geocoding API timeout → "Soft Pass" — photo saved but flagged in RC as "Address Verification: Service Unavailable." Can be retriggered from back office.
  - Reference address missing → error in RC: "Reference address not found." If rule is set on threshold → auto-reject.

### VER-06: MCC Validation

- **Description**: For offline shop assets, system predicts Merchant Category Code from visual cues.
- **Trigger**: Asset photo captured for offline shop.
- **Condition**: System analyses signage/inventory in photo.
- **Outcome**: Predicted MCC compared against declared business type. Mismatches flagged.
- **Exceptions**: None specified.

### VER-07: Blur Detection

- **Description**: Real-time image quality gate.
- **Trigger**: Image captured via camera.
- **Condition**: System runs blur detection check.
- **Outcome**: If blurred/unclear → prompt re-capture.
- **Exceptions**: None specified.

### VER-08: Nominee Percentage Share Validation

- **Description**: Nominee percentage shares must total exactly 100%.
- **Trigger**: Nominee percentage values entered.
- **Condition**: System maintains running total across all nominees.
- **Outcome**:
  - `< 100%` → Warning: "Total nominee share assignment less than 100%". "Next" disabled.
  - `> 100%` → Error: "Total nominee share assignment more than 100%". Current input blocked from saving.
  - `= 0%` for any nominee → Validation error: "Share must be greater than 0%."
- **Exceptions**: System supports up to 2 decimal places (e.g., 33.33%) with rounding logic to allow exactly 100.00%.

---

## 6. Authentication Rules

### AUTH-01: Authorised Journey — OTP Requirement

- **Description**: If authorisation is added to a journey, mobile number + OTP validation is required.
- **Trigger**: Journey configured as "Authorized" access control.
- **Condition**: Authorisation toggle is enabled in Trigger Node.
- **Outcome**: Journey starts with mobile number + OTP to validate the mobile number.
- **Exceptions**: Non-Authorized journeys have open entry, regulated by Regex/Limit rules only.

### AUTH-02: Aadhaar-based E-Sign Authentication

- **Description**: E-sign via Aadhaar requires redirect to ESP gateway.
- **Trigger**: E-Sign bundle configured with Aadhaar-based execution.
- **Condition**: System redirects to E-Sign Service Provider gateway.
- **Outcome**: Handles OTP/Biometric flow. Returns signed PDF to IDfy.
- **Exceptions**: If user cancels Aadhaar OTP page → status changes to "Failed", user can restart. If name mismatch between Aadhaar and onboarding form → highlight mismatch (threshold: 80% or configured).

### AUTH-03: API-Led Journey Authentication

- **Description**: API-led journeys may require JWT or API Key.
- **Trigger**: Journey configured as "Authorized" + "API Led".
- **Condition**: Incoming request must include valid JWT or API Key.
- **Outcome**: If valid → journey initiates. If invalid → rejected.
- **Exceptions**: Non-Authorized API-led journeys accept open entry.

---

## 7. Permissions

### PERM-01: Organisational Unit (OU) Scoping

- **Description**: Users can only access journeys and bundles belonging to their OU.
- **Trigger**: User attempts to access/modify/view resources.
- **Condition**: System checks OU membership.
- **Outcome**: OU-specific bundles cannot be created/viewed/accessed/modified by members of other OUs.
- **Exceptions**: Global bundles (standard IDfy API bundles) are available across all OUs.

### PERM-02: Custom Use Case Permissions

- **Description**: Custom use cases have scoped visibility.
- **Trigger**: User selects "Add New" use case.
- **Condition**: System checks user role.
- **Outcome**: If `Role != IDfy_Admin` → use case flagged as `Scope: OU-Local`. If `Role == IDfy_Admin` → flagged as `Scope: Global`.
- **Exceptions**: Custom use case requires name (string) + description (minimum 10 words) — both mandatory.

### PERM-03: Bundle Version Deletion Protection

- **Description**: Active bundle versions cannot be deleted.
- **Trigger**: Attempt to delete a bundle version.
- **Condition**: System checks if version is currently "Active" in a live journey.
- **Outcome**: If active → deletion prevented.
- **Exceptions**: None.

### PERM-04: Component Editing Restrictions Inside Bundles

- **Description**: Users have limited structural editing within bundle instances.
- **Trigger**: User attempts to modify bundle contents on Canvas.
- **Condition**: Bundle is instantiated in a definition.
- **Outcome**: User CANNOT: add components, delete components, reorder components, drag elements. User CAN: change allowed component properties, hide components (if allowed through config).
- **Exceptions**: When feature flag `enableBundleConfigMode = false`, bundles behave like normal components — all edits allowed, bundle config ignored.

### PERM-05: Configuration Governance Scopes

- **Description**: Every configurable property has a defined scope controlling who can change it.
- **Trigger**: User attempts to edit a property.
- **Condition**: System checks property scope metadata.
- **Outcome**:
  - `bundle-only` → Only bundle config can change it.
  - `component-only` → Only component config can change it.
  - `bundle-default` → Bundle sets default, override allowed at component level.
  - `read-only` → Cannot be changed at any level.
- **Exceptions**: Governance is metadata-driven per property.

### PERM-06: "No Capping" Attempt Limits — Admin Only

- **Description**: Uncapped attempt limits can only be set by IDfy Admin.
- **Trigger**: Attempt limit configuration.
- **Condition**: User selects "No capping".
- **Outcome**: Only IDfy Admin role can set this. In "No capping" mode, attempts are not capped.
- **Exceptions**: None.

---

## 8. Workflow Rules

### WF-01: Trigger Node — Mandatory Presence

- **Description**: Every journey requires exactly one Trigger Node.
- **Trigger**: Journey save or publish action.
- **Condition**: System counts `TriggerNode` instances.
- **Outcome**: If `count(TriggerNode) < 1` → Save/Publish prevented. Error: "Journey needs a Trigger. Please add a Trigger to the first page."
- **Exceptions**: Trigger is auto-added to Canvas and attached to the first page when the first page is dropped, provided no trigger exists in the journey sheet.

### WF-02: Trigger Node — Initiation Modes

- **Description**: Three mutually exclusive initiation modes.
- **Trigger**: Trigger Node configuration.
- **Condition**: User selects one of three modes.
- **Outcome**:
  - **API Led**: Generates a unique endpoint for the journey.
  - **Manual Led**: Admin triggers journey from OnboardIQ dashboard (uses existing form engine).
  - **Hybrid**: Supports both simultaneous entry points.
- **Exceptions**: None.

### WF-03: Trigger Node — Journey Classification

- **Description**: Journeys are classified on two axes.
- **Trigger**: Trigger Node configuration.
- **Condition**: User selects distribution type and access control.
- **Outcome**:
  - **Broadcast**: One-to-many (e.g., public sign-up link).
  - **Targeted**: One-to-one (e.g., specific VIP invitation).
  - **Authorized**: Requires JWT or API Key.
  - **Non-Authorized**: Open entry, regulated by Regex/Limit rules.
- **Exceptions**: Only one distribution type can be selected.

### WF-04: Pre-fill Field Availability Downstream

- **Description**: Pre-fill fields defined in Trigger Node are available throughout the journey.
- **Trigger**: Pre-fill fields configured.
- **Condition**: Fields defined in Trigger Node schema.
- **Outcome**: Fields available as variables in all downstream nodes for setting advanced validations.
- **Exceptions**: If pre-fill fields are modified after journey is live, system must warn that downstream nodes relying on deleted fields will break.

### WF-05: Duplicate Pre-fill Key Prevention

- **Description**: No two pre-fill fields can share the same name.
- **Trigger**: User adds a pre-fill field.
- **Condition**: System checks existing field names.
- **Outcome**: UI prevents adding duplicate key names.
- **Exceptions**: None.

### WF-06: Switch Node — Multi-Path Routing

- **Description**: Switch Node enables 1:N branching on the canvas.
- **Trigger**: Switch Node placed on canvas and configured.
- **Condition**: Supports up to 20 distinct output ports (branches).
- **Outcome**: User is routed to exactly one branch (mutually exhaustive logic). A default/fallback branch handles unmatched conditions.
- **Exceptions**: Users can rename output ports for canvas readability (e.g., "Branch 1" → "Premium Users").

### WF-07: Switch Node — Logic Modes

- **Description**: Two logic modes for routing decisions.
- **Trigger**: Switch Node configuration.
- **Condition**: User selects logic mode.
- **Outcome**:
  - **Rules-based**: Define specific conditions (e.g., "Industry" contains "Fintech").
  - **JSON-based**: JavaScript expressions for dynamic/complex routing with multiple conditions.
- **Exceptions**: If incoming data field is null/missing → auto-route to Default/Fallback branch (no workflow error). Type mismatch → soft conversion option: "exclude the case" (e.g., case-insensitive matching).

### WF-08: Switch Node — Circular Logic Prevention

- **Description**: Infinite loops are prevented.
- **Trigger**: User routes a Switch output back into its own input.
- **Condition**: System detects circular reference.
- **Outcome**: Configuration is not allowed. Execution limits catch infinite loops.
- **Exceptions**: None.

### WF-09: Consent — Scroll-to-Accept Obligation

- **Description**: Consent checkbox can be gated behind content engagement.
- **Trigger**: Consent bundle with `Scroll through / Open Link = Yes`.
- **Condition**: User must scroll to bottom of in-frame text OR click hyperlink.
- **Outcome**: "I Agree" checkbox remains disabled (greyed out) until engagement condition met.
- **Exceptions**: If obligation is Non-Mandatory, user may skip. If PDF URL returns 404 and "Open Link" is mandatory → checkbox must NOT enable.

### WF-10: Consent — In-Journey vs. Child Journey Execution

- **Description**: Consent can execute within main flow or as a separate journey.
- **Trigger**: Consent bundle execution mode configuration.
- **Condition**: Mode selected.
- **Outcome**:
  - **In-Journey**: Consent is a step within the main flow.
  - **Child Journey**: System generates unique, time-bound URL sent via SMS/Email. Main journey pauses until "Success" webhook received from child.
- **Exceptions**: Child journey link expiry → "This consent link has expired. Please request a new link from the agent."

### WF-11: E-Sign — Three-Step Workflow

- **Description**: E-Sign follows a mandatory review-then-sign flow.
- **Trigger**: E-Sign bundle reached in journey.
- **Condition**: Step sequence enforced.
- **Outcome**:
  1. Review Form.
  2. If consent = Yes → direct to E-signing.
  3. If consent = No → show message: "Please rectify the relevant fields provided in the journey and regenerate the form for E-sign." (DIY) / "Please instruct the agent to rectify relevant fields provided in the journey." (Agent-assisted).
- **Exceptions**: User cancels Aadhaar OTP → status = "Failed", allow restart.

### WF-12: Navigation Restrictions

- **Description**: Workflow rules can restrict page navigation.
- **Trigger**: Workflow rules configured.
- **Condition**: Rule evaluates.
- **Outcome**: Examples: Restrict customers from visiting next page(s) through navigation bar. Restrict number of attempts. Form filling abilities (e.g., if 4 signatories mentioned, open 4 KYC containers).
- **Exceptions**: None.

### WF-13: Execution Checks — In-Journey vs. Post-Submission

- **Description**: API checks can run at two points.
- **Trigger**: Check toggle configuration per API.
- **Condition**: Toggle state.
- **Outcome**: "Run in Journey" → checks trigger immediately post-upload within journey. "Post Submission" → API runs once journey is submitted.
- **Exceptions**: If any API cannot be executed for a document, highlight under "i" (Information icon) with explanation.

### WF-14: Chat-Based Journey Creation Flow

- **Description**: Journey creation begins with structured chat-based form.
- **Trigger**: User clicks "Create Profile".
- **Condition**: Questions answered in sequence.
- **Outcome**: Summary shown for review. Post-confirmation → user lands on Canvas with all necessary configurations applied.
- **Exceptions**: Response types supported: Single select, Checkbox (multi-select), Search + Filter + Single select (long lists), Search + Filter + Checkbox (multi-select).

### WF-15: Journey Type Nuances — DIY vs. Agent-Assisted

- **Description**: Journey type dictates hardware and workflow behaviour.
- **Trigger**: Journey type selected during chat-based creation.
- **Condition**: Type = DIY or Agent-Assisted.
- **Outcome**:
  - **DIY**: Default camera = Front/Selfie. Consent/E-sign = In-Journey steps.
  - **Agent-Assisted**: Default camera = Back Camera. Consent/E-sign = Child Journey API calls.
- **Exceptions**: None.

### WF-16: Branched Journeys — Parent-Child Sync

- **Description**: Branched journey bundles create child journeys with synchronised trigger nodes.
- **Trigger**: Branched Journey bundle configured with child journey IDs.
- **Condition**: Child journey IDs added.
- **Outcome**: Child journey sheets open in Canvas. Each child has a Trigger Node (always API-led). Pre-fill fields modified in Bundle MUST update child Trigger Node and vice-versa (two-way sync). Discrepancies flagged immediately.
- **Exceptions**:
  - "Double Edit" conflict (Bundle open in one tab, Child Trigger in another) → system uses "Last Save Wins" or real-time websocket sync.
  - Orphaned child journey (child deleted from library) → Bundle shows "Journey Not Found" error, parent journey blocked from going live.
  - If all branched journey bundles have child journeys but not all child journeys are in a bundle → orphaned child journeys deleted on publish.
  - Minimum child journeys = 0 → user can bypass branching without error.

### WF-17: Branching Type Selection

- **Description**: Branched journeys support two branching modes.
- **Trigger**: Bundle configuration.
- **Condition**: User selects type.
- **Outcome**: **Dependent** = sequential/logic-based. **Independent** = parallel/standalone.
- **Exceptions**: None.

### WF-18: Nominee — Opt-Out Declaration

- **Description**: Non-mandatory nominee bundles require explicit opt-out.
- **Trigger**: Nominee bundle configured as non-mandatory (0 nominees accepted).
- **Condition**: User doesn't add nominees.
- **Outcome**: Declaration checkbox must be rendered: "I don't wish to add any nominee." (DIY) / "Customer doesn't wish to add any nominee." (Agent-assisted). Checking hides/clears all nominee input fields and satisfies bundle completion.
- **Exceptions**: If user deletes the only added nominee, the opt-out declaration must reappear or user is blocked from proceeding.

---

## 9. Integration Rules

### INT-01: API Marketplace

- **Description**: Centralised registry for IDfy APIs and (future) client APIs.
- **Trigger**: Bundle or component configuration.
- **Condition**: OU-scoped access — only specific OUs can access specific APIs.
- **Outcome**: APIs and error messages are pre-configured in a repository. No need to configure error messages per journey.
- **Exceptions**: Client-specific APIs are OU-scoped.

### INT-02: Document Treatment as API Configuration Source

- **Description**: Document treatment defines all checks and APIs per document.
- **Trigger**: Document added to a bundle.
- **Condition**: System fetches associated checks from Document Treatment.
- **Outcome**: Execution checks (DIV, OCR, Tampering, Verification, Linkage, Acceptability) are auto-populated. Camera optimisations stored in Document Treatment are auto-applied.
- **Exceptions**: For new documents not in the supported list, user must specify if it's a Card or A4 — treated as blind upload.

### INT-03: Error Message Repository

- **Description**: Error messages are pre-configured per API condition.
- **Trigger**: API added to IDfy 360 API pool (one-time effort).
- **Condition**: Conditions classified as: **Default** (required across all use cases, e.g., Blurry Image) and **Optional** (needed for specific use cases, e.g., Face Image Validation on POA).
- **Outcome**: Error messages are reused across journeys. No per-journey configuration needed.
- **Exceptions**: Users can add/remove error messages within bundles.

### INT-04: Communications Engine

- **Description**: Branched journeys use configurable communication channels.
- **Trigger**: Child journey link needs to be shared.
- **Condition**: Config specifies channel (Mobile, Email, or Both) and engine (IDfy default or custom "Add New").
- **Outcome**: Link sent via configured channel and engine.
- **Exceptions**: Comms engine failure → conditional error: "The comms engine has failed to share the link."

### INT-05: Network Timeout

- **Description**: Journey APIs have a maximum response time.
- **Trigger**: Any journey API call (verification, rules, OCR, DIV).
- **Condition**: API fails to respond within specified timespan.
- **Outcome**: Timeout at 45 seconds from initiation.
- **Exceptions**: None specified.

### INT-06: API Documentation Sync

- **Description**: API-led journeys provide downloadable documentation.
- **Trigger**: API-led journey configured.
- **Condition**: Pre-fill fields defined.
- **Outcome**: "Download API Docs" button in configuration panel provides dynamic Postman collection tailored to defined pre-fill fields. 100% parity between Pre-fill UI and downloaded documentation.
- **Exceptions**: None.

---

## 10. Data Ownership

### DATA-01: Global Journey Keys (GJKs)

- **Description**: GJKs are configured during client onboarding at system level.
- **Trigger**: Client onboarding.
- **Condition**: System-level configuration, not journey-level.
- **Outcome**: GJKs are available across journeys for that client. If incomplete, system surfaces visible nudge to complete.
- **Exceptions**: Cannot be set within individual journeys.

### DATA-02: Pre-fill Fields as Journey Variables

- **Description**: Trigger Node pre-fill fields become journey-wide variables.
- **Trigger**: Pre-fill fields defined in Trigger Node.
- **Condition**: Fields pass regex and limit validation.
- **Outcome**: Available in all downstream nodes for advanced validations, comparisons, and bundle configurations.
- **Exceptions**: Modifying pre-fill fields post-publish warns about downstream breakage.

### DATA-03: Bundle Snapshot Immutability

- **Description**: Published definitions use immutable bundle snapshots.
- **Trigger**: Definition published.
- **Condition**: System stores definition JSON, bundle configs, component overrides, and bundle snapshots.
- **Outcome**: Published definitions never break due to bundle updates. When editing a published definition, system loads bundle snapshot — NOT latest bundle version.
- **Exceptions**: User may upgrade bundle version during edit via controlled migration flow.

### DATA-04: Consent Status Immutability

- **Description**: Post-submission consent status cannot be changed.
- **Trigger**: Journey submitted.
- **Condition**: Consent captured (Accepted or Denied).
- **Outcome**: Consent status is immutable in Review Center. RC displays: PDF link/version shown to user, binary status (Accepted/Rejected), timestamp.
- **Exceptions**: If user initially selects "I don't agree" → recorded and updated. If user changes to "I Agree" before drop-off → status updates. If user drops off without changing → "Denied" persists in RC.

### DATA-05: Component Override Storage

- **Description**: Valid component-level changes inside bundles are stored as overrides.
- **Trigger**: User modifies an allowed property within a bundle instance.
- **Condition**: Property scope allows component-level change.
- **Outcome**: Change stored as `componentOverride` in definition, separate from bundle definition.
- **Exceptions**: Restricted properties are validated and blocked during editing.

### DATA-06: Document Treatment as Single Source of Truth

- **Description**: Document Treatment captures all document metadata centrally.
- **Trigger**: Document added to any template/bundle.
- **Condition**: Document exists in Document Treatment registry.
- **Outcome**: Properties auto-applied: document type (POI/POA/POB), characteristics (A4/Card/Booklet), face data (Always/Never/Some), sides to capture, name/date/address fields, associated APIs, fields for front-end and back-office, DB-received data keys.
- **Exceptions**: Optimisations (camera configs, focus, etc.) must be stored in Document Treatment only.

---

## 11. State Transitions

### TRANS-01: Bundle Lifecycle

```
Bundle Created → QA Tested → Available in Bundle Pool
                                   ↓
              Dragged to Canvas → Bundle Instance Created
                                   ↓
                          Configuration Applied → Published (Snapshot)
```

- **Trigger**: Each step triggered by user/system action.
- **Condition**: Bundle must be QA tested before appearing in pool.
- **Outcome**: At publish, snapshot is created and frozen.

### TRANS-02: Journey Lifecycle

```
Chat-Based Form → Canvas (Draft) → Configured → Submitted for Approval
                                                      ↓
                                              Approved → QA Review → Published (UAT/Production)
```

- **Trigger**: User actions at each stage.
- **Condition**: Five lifecycle stages: Trigger Definition → Journey Builder → Post Checks → Meta Data → Validate & Publish.
- **Outcome**: Journey moves through stages sequentially.

### TRANS-03: Configuration Resolution Order

```
Bundle Base Config → Bundle Level Config → Component Overrides → Resolved Component
```

- **Trigger**: Component rendering.
- **Condition**: System resolves effective config by applying each layer in order.
- **Outcome**: Lower layers override higher layers where permitted by governance scope.

### TRANS-04: Bundle Version Upgrade

```
Published (Snapshot v1) → Edit Mode → Upgrade Requested
    ↓
Migration Analysis → Conflict Preview → User Confirms → New Version Applied → Save
```

- **Trigger**: User requests bundle version upgrade during edit.
- **Condition**: Target version exists. Migration possible. Conflicts detected and shown.
- **Outcome**: New version may change UI structure, rules, validations, API mapping, checks, post-submission behaviour, and RC config.

---

## 12. Validation Rules

### VAL-01: Trigger Node — Regex Validation

- **Description**: Custom regex per pre-fill field.
- **Trigger**: Data received via API or manual form.
- **Condition**: Field value tested against regex pattern.
- **Outcome**: Pass → proceed. Fail → `400 Bad Request` with specific error. Manual form → red highlight on failing field.
- **Exceptions**: Must support Unicode for internationalisation.

### VAL-02: Trigger Node — Input Limits

- **Description**: Character count limits and allowed values (enums) per field.
- **Trigger**: Data entry.
- **Condition**: Field value checked against limits.
- **Outcome**: Exceeding limits → rejected.
- **Exceptions**: None.

### VAL-03: Switch Node — Real-Time Expression Validation

- **Description**: Invalid regex or expressions flagged immediately.
- **Trigger**: User creates rule in Switch Node.
- **Condition**: System validates expression in real-time.
- **Outcome**: Invalid expression → node shows error state.
- **Exceptions**: None.

### VAL-04: Custom Use Case — Minimum Description

- **Description**: New use cases require minimum description length.
- **Trigger**: "Add New" use case selected.
- **Condition**: Name (string) = mandatory. Description = mandatory, minimum 10 words.
- **Outcome**: Cannot proceed without meeting minimums.
- **Exceptions**: None.

### VAL-05: Save Validation (Bundle System)

- **Description**: Validation checks on definition save.
- **Trigger**: User saves definition.
- **Condition**: System checks: bundle version exists, property override is allowed (Phase 2), structure unchanged.
- **Outcome**: Save blocked if validation fails.
- **Exceptions**: None.

### VAL-06: Publish Validation (Bundle System)

- **Description**: Validation checks on definition publish.
- **Trigger**: User publishes definition.
- **Condition**: System checks: bundle snapshot created, overrides valid, configuration resolved.
- **Outcome**: Publish blocked if validation fails.
- **Exceptions**: None.

### VAL-07: Upgrade Validation (Bundle System)

- **Description**: Validation checks on bundle version upgrade.
- **Trigger**: User upgrades bundle version.
- **Condition**: System checks: target version exists, migration possible, conflicts detected.
- **Outcome**: Upgrade blocked or user warned if validation fails.
- **Exceptions**: None.

### VAL-08: Geography-Based Bundle Filtering

- **Description**: Bundles are filtered by selected geography.
- **Trigger**: User selects one or more countries in chat-based form.
- **Condition**: Country selection triggers filter.
- **Outcome**: Bundle selection refreshes instantly to show only bundles mapped to selected regions. Templates shown must also be filtered by geography.
- **Exceptions**: None.

---

## 13. Regulatory Constraints

### REG-01: Document Types — POI / POA / POB

- **Description**: Documents are classified by regulatory category.
- **Trigger**: Document added to bundle.
- **Condition**: Document Treatment defines category.
- **Outcome**: POI/POA = Proof of Identity and Address. POB = Details of business (DOI, DOC, type of business, address, constitution, etc.).
- **Exceptions**: None.

### REG-02: PAN — Individual vs. Entity Enforcement

- **Description**: PAN card type filtering.
- **Trigger**: PAN document added to bundle.
- **Condition**: "Allow only Individuals or Business" config set.
- **Outcome**: Accept only PAN cards where 4th letter = "P" (individual PAN) or business PAN as configured.
- **Exceptions**: Currently relevant only for PAN.

### REG-03: Expired ID Handling

- **Description**: Configurable rules for document expiry.
- **Trigger**: Document with expiry date captured.
- **Condition**: Expiry handling config.
- **Outcome**: Options: "Stop Expired IDs", "Stop about to expire IDs" (with configurable range in days).
- **Exceptions**: Depends on documents in list — not all documents have expiry.

### REG-04: Minor Detection — Stop Minor

- **Description**: Journeys can block minors.
- **Trigger**: DOB captured in document/form.
- **Condition**: "Stop Minor = Yes" configured.
- **Outcome**: Minor detected → journey blocked.
- **Exceptions**: None specified.

### REG-05: FATCA Declaration

- **Description**: FATCA compliance step in journey.
- **Trigger**: FATCA bundle present in journey.
- **Condition**: Regulatory requirement for financial services.
- **Outcome**: User completes FATCA declaration.
- **Exceptions**: None specified.

### REG-06: Consent Audit Trail

- **Description**: All consent actions must have timestamps for compliance.
- **Trigger**: Consent accepted or denied.
- **Condition**: Always.
- **Outcome**: 100% of Accepted/Denied statuses must have corresponding timestamp. RC shows: link to consent PDF, consent status, timestamp.
- **Exceptions**: Rapid clicking → debounce on "Accept" button prevents multiple timestamp entries for single consent action.

---

## 14. Error Handling Rules

### ERR-01: BundleVersionNotFound

- **Description**: Requested bundle version does not exist.
- **Trigger**: Bundle drag-and-drop or version reference.
- **Condition**: Version lookup fails.
- **Outcome**: Error raised. Operation blocked.

### ERR-02: IllegalComponentOverride

- **Description**: User attempted to modify a property locked by bundle governance.
- **Trigger**: Component property edit within bundle.
- **Condition**: Property scope = `bundle-only` or `read-only`.
- **Outcome**: Edit blocked.

### ERR-03: StructureModificationError

- **Description**: User attempted structural change within bundle instance.
- **Trigger**: Add/delete/reorder/drag of component within bundle.
- **Condition**: Bundle integrity rules.
- **Outcome**: Action prevented.

### ERR-04: BundleUpgradeConflict

- **Description**: Incompatible version upgrade attempted.
- **Trigger**: Bundle version upgrade.
- **Condition**: Migration analysis detects incompatibility.
- **Outcome**: Conflict shown to user. Upgrade blocked until resolved.

### ERR-05: Mandatory DIV Failure — BLOCKING_ERROR

- **Description**: Critical document check fails.
- **Trigger**: DIV check returns failure.
- **Condition**: Check is mandatory.
- **Outcome**: Journey progression blocked. User must retry or abandon.

### ERR-06: Null Reference in Comparison

- **Description**: Comparison configured against empty data source.
- **Trigger**: Cross-bundle comparison executes.
- **Condition**: Pre-fill field or comparison target is empty/null.
- **Outcome**: System defaults to `SKIP_VALIDATION`. Warning logged in instrumentation and RC/Back-office.

### ERR-07: Switch Node — Null Input

- **Description**: Incoming data field for switch is missing.
- **Trigger**: Switch Node evaluates routing.
- **Condition**: Data field is null or missing.
- **Outcome**: Auto-route to Default/Fallback branch. No workflow error thrown.

### ERR-08: In-Frame Consent Loading Failure

- **Description**: Consent text box fails to load.
- **Trigger**: In-frame consent rendering.
- **Condition**: Text box load fails.
- **Outcome**: Show retry button. Do NOT allow user to bypass mandatory read.

### ERR-09: Child Journey Link Expiry

- **Description**: Child journey consent/E-sign link has expired.
- **Trigger**: User clicks expired child journey link.
- **Condition**: Link past expiry time.
- **Outcome**: Show: "This consent link has expired. Please request a new link from the agent."

### ERR-10: Reference Address Changed After Asset Capture

- **Description**: User edits address after asset photo taken.
- **Trigger**: Address modification post-capture.
- **Condition**: Location comparison already done.
- **Outcome**: Bundle resets "Location Comparison" status to "Pending". New address must be geo-mapped again.

---

## 15. Edge Cases

### EDGE-01: Schema Change on Live Journey (Trigger Node)

- **Description**: Pre-fill fields modified after journey is live.
- **Trigger**: User edits Trigger Node on a live journey.
- **Condition**: Downstream nodes reference deleted fields.
- **Outcome**: System MUST warn that downstream nodes relying on deleted fields will break.

### EDGE-02: Bundle Removed from Registry — Snapshot Survives

- **Description**: Bundle deleted from registry after publish.
- **Trigger**: Bundle removed from repository.
- **Condition**: Published definition references this bundle.
- **Outcome**: Snapshot still usable. Published definition unaffected.

### EDGE-03: Component Removed in New Bundle Version

- **Description**: Newer bundle version removes a component that had overrides.
- **Trigger**: Bundle version upgrade.
- **Condition**: Override references component that no longer exists.
- **Outcome**: Migration conflict raised. User must resolve.

### EDGE-04: Property Scope Changed to Bundle-Only

- **Description**: Property that was previously component-editable becomes bundle-only.
- **Trigger**: Bundle version upgrade.
- **Condition**: Existing component override exists for this property.
- **Outcome**: Override is removed. Upgrade warning shown.

### EDGE-05: Applicant as Guardian for Nominee

- **Description**: Guardian details match primary applicant.
- **Trigger**: Guardian fields filled for minor nominee.
- **Condition**: Guardian name/relationship matches applicant.
- **Outcome**: System MUST allow this. No "Duplicate" error thrown.

### EDGE-06: Deleting Last Nominee

- **Description**: User removes the only added nominee.
- **Trigger**: Delete action on sole nominee.
- **Condition**: Bundle may be non-mandatory.
- **Outcome**: Opt-out declaration ("I don't wish to add a nominee") must reappear, OR user blocked from proceeding.

### EDGE-07: Orphaned Child Journeys on Publish

- **Description**: Child journeys exist without parent bundle reference.
- **Trigger**: Journey published.
- **Condition**: Not all child journeys are linked to a branched journey bundle.
- **Outcome**: Orphaned child journeys (without a bundle) are deleted on publish.

### EDGE-08: Zero-Minimum Branched Journeys

- **Description**: Minimum child journey count set to 0.
- **Trigger**: Branched journey configuration.
- **Condition**: Minimum = 0.
- **Outcome**: User can bypass branching logic without error.

### EDGE-09: No Image Provided for Product Tab

- **Description**: Product selection tab has no image.
- **Trigger**: Product tab rendered.
- **Condition**: Image slot empty.
- **Outcome**: Text properties expand to fill container width. No "broken image" icon displayed.

### EDGE-10: Excessive Bullet Points in Product Tab

- **Description**: Properties exceed tab height.
- **Trigger**: Product tab rendered with many properties.
- **Condition**: Content overflows.
- **Outcome**: "Show More" link appears or scrollbar triggers within tab content area.

### EDGE-11: Face Comparison Set Against Document Without Face

- **Description**: Face comparison target document has no face image.
- **Trigger**: Face comparison executes.
- **Condition**: Target document lacks face image.
- **Outcome**: RC shows: "Unable to run face comparison as face image not detected on document."

### EDGE-12: Negative Consent — "I Don't Agree"

- **Description**: User denies consent.
- **Trigger**: User selects negative consent.
- **Condition**: Consent bundle is mandatory.
- **Outcome**: Response recorded. Error shown: "Consent needed to proceed with the journey." User stopped at consent page. If user changes to "I Agree" → status updates. If user drops off → "Denied" persists in RC.

---

## 16. Exception Handling

### EXC-01: API Timeout — Soft Pass

- **Description**: External API fails to respond.
- **Trigger**: Reverse geocoding or other external API times out.
- **Condition**: Timeout reached.
- **Outcome**: Photo saved. Flagged in RC as "Address Verification: Service Unavailable." Can be retriggered from back office.
- **Exceptions**: If threshold rule is set → fail the case (auto-reject).

### EXC-02: VPN / Mock Location Detection

- **Description**: Location spoofing detected.
- **Trigger**: MCC or OS detects mock location provider.
- **Condition**: Detection confirmed.
- **Outcome**: Bundle fails immediately. Flagged as "Location Spoofer Detected."

### EXC-03: GPS Denied by User

- **Description**: User denies location access for asset capture.
- **Trigger**: Browser/app GPS permission denied.
- **Condition**: Location-dependent bundle.
- **Outcome**: Blocking overlay: "Location access is required to verify this asset. Please enable it in your browser settings." "Proceed" button stays disabled.

### EXC-04: Gallery Upload Restriction

- **Description**: Some bundles prohibit gallery uploads.
- **Trigger**: Asset/selfie capture.
- **Condition**: `Allow gallery upload = No`.
- **Outcome**: Native file picker restricted to camera intent only.

---

## 17. Feature Gates

### GATE-01: enableBundleConfigMode

- **Description**: Master toggle for bundle-level behaviour.
- **Trigger**: System configuration.
- **Condition**: Flag value.
- **Outcome**:
  - `true` (default) → Bundle governance enforced. Property scopes respected. Component editing restricted within bundles.
  - `false` → Bundles behave like normal components. All component edits allowed. Bundle config ignored.

### GATE-02: Rollout Phases

- **Description**: Feature rollout is phased.
- **Phase 1**: Bundle registry + bundle instance. Component overrides (common restrictions). Bundle snapshots. PHL-KYC bundle. Selfie bundle.
- **Phase 2**: Bundle version upgrade. Audit logging. Override validation enforcement. Version upgrade auditing. Bundle-level config (strict validations).

---

## 18. Success Criteria

### KPI-01: Trigger Latency

- **Description**: Time from API receipt to first-node execution < 50ms.

### KPI-02: Trigger Validation Overhead

- **Description**: Adding regex validation must not increase trigger processing time by more than 5ms.

### KPI-03: Manual Form Render Time

- **Description**: Manual trigger forms must load in < 1s even with 50+ pre-fill fields.

### KPI-04: Switch Node Execution Latency

- **Description**: Average time to resolve routing logic < 15ms (< 10ms for standard string comparisons).

### KPI-05: Switch Node Success Rate

- **Description**: > 99.9% of executions resolve to either a match or Default branch without system error.

### KPI-06: Switch Node UI Clarity

- **Description**: APM should set up a 4-way branch in under 60 seconds.

### KPI-07: Page Transition / Loading

- **Description**: < 500ms even on 4G networks.

### KPI-08: Direct Manipulation Response

- **Description**: Nominee add/remove and similar manipulations within 200ms, visually seamless.

### KPI-09: API Documentation Sync

- **Description**: 100% parity between Pre-fill UI and downloaded API documentation.

### KPI-10: Rejection Accuracy

- **Description**: % of "garbage" entries correctly caught by Regex vs. total entries.

### KPI-11: Consent Timestamp Integrity

- **Description**: 100% of Accepted/Denied consent statuses must have a corresponding timestamp.

### KPI-12: Theme Application

- **Description**: Theme applied to all pages in under 30 seconds. Journey loading/page transition still under 500ms post-application.

### KPI-13: Scope Generation

- **Description**: Exportable scope generated in under 10 minutes. All screens captured including error message screens for each page.

### KPI-14: Cross-Device Consistency

- **Description**: UI works as expected across mobile, desktop, tablets, laptop, and kiosks — including bundles and cameras.

---

## 19. Assumptions

### ASM-01: Bundle Structure is Fixed

- When a bundle is used in a definition, UI elements cannot be structurally modified (add, remove, drag-and-drop).
- Elements can only be hidden through component overrides, not deleted or rearranged.
- Users can change styles at component level.

### ASM-02: Bundle-Level Settings Override Component-Level

- Configuration at bundle level cannot be modified at component level.
- Component config must respect bundle restrictions.
- Example: If attempt limits set at bundle level → component-level attempt limit change is blocked.

### ASM-03: Restricted Properties Enforced Across Levels

- Certain properties are strictly controlled to prevent conflicts between bundle and component levels.
- Users cannot modify restricted properties at component level and revert at bundle level.
- Example: `dependentFields` must remain governed by bundle-level config.

### ASM-04: Property Governance is Metadata-Driven

- Each configurable property has defined rules specifying whether editable at: bundle level, component level, both with override rules, or read-only.
- Maintained in configuration reference documentation.

### ASM-05: Component Overrides Apply Only to Allowed Properties

- Overrides only affect properties explicitly allowed for component-level customisation.
- Restricted properties validated and blocked during editing.

### ASM-06: Theming, Client API Integration, and Deployment Out of Scope

- Theme builder, client API integration, and deployment in client systems are out of scope for the bundle-based configuration system.

### ASM-07: Automatic Bundle Migration Not Supported

- No automatic migration between bundle versions. Manual upgrade with migration analysis required.

### ASM-08: Runtime Rule Engine and Schema Validation Unchanged

- Runtime rule execution engine changes and schema validation engine redesign are out of scope.

---

*Document extracted from: Trigger Node PRD, Switch Node PRD, Vision 2026, User Stories & Targeted Outcomes, Product Note (Bundles/Templates/Components), Bundle-Based Definition Configuration System, Document Treatment Template, and project context notes.*
