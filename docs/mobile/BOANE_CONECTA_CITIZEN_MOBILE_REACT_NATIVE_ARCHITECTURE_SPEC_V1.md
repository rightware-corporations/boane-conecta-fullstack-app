# BOANE CONECTA — CITIZEN MOBILE APP REACT NATIVE ARCHITECTURE & NATIVE CAPABILITIES SPEC V1

**Status:** Canonical future mobile engineering authority
**Product:** Boane Conecta — Aplicação do Munícipe
**Target:** Android + iOS
**Recommended framework:** React Native + TypeScript, Expo-based workflow where native capability requirements remain compatible
**Purpose:** define architecture, UX boundaries, native APIs, security, offline behavior, notifications, camera/document capture, testing, release and backend implications before mobile implementation.

---

# 0. PRODUCT ROLE

The mobile app is not a copy of the website.

Its strongest value is:

- citizen identity;
- requests in progress;
- notifications;
- appointments;
- queue;
- payments;
- documents;
- camera capture;
- native push;
- fast return to active tasks.

Public information remains available, but task continuity is primary.

---

# 1. MOBILE ACTOR

Primary actor:

```text
Authenticated Citizen
```

Secondary:

- public visitor before login;
- authorized representative later.

Staff/admin mobile is a separate future product decision.

---

# 2. MOBILE NAVIGATION

Frozen citizen mobile navigation:

```text
Início
Pedidos
Serviços
Alertas
Conta
```

Native app IA should align with web citizen IA, but optimize for mobile usage.

---

# 3. TECHNOLOGY DECISION

Recommended:

```text
React Native
+ TypeScript
+ Expo
```

Why:

- shared TS knowledge with frontend;
- native UI/runtime;
- OTA/update tooling;
- camera;
- notifications;
- secure storage;
- deep linking;
- native module escape path;
- Android/iOS.

Expo is not a limitation if managed with development builds/custom native modules when required.

---

# 4. EXPO MODE

Prefer:

- Expo SDK;
- Expo Router or React Navigation decision recorded;
- EAS Build;
- development builds for native modules;
- EAS Update only with controlled compatibility policy.

Do not rely exclusively on Expo Go for production architecture validation.

---

# 5. PROJECT STRUCTURE

Conceptual:

```text
mobile/
├── app/
├── navigation/
├── design-system/
├── features/
│   ├── auth
│   ├── home
│   ├── services
│   ├── requests
│   ├── documents
│   ├── appointments
│   ├── queue
│   ├── payments
│   ├── notifications
│   └── profile
├── native/
│   ├── camera
│   ├── notifications
│   ├── secure-storage
│   ├── biometrics
│   ├── sharing
│   └── connectivity
├── api/
├── storage/
├── sync/
└── observability/
```

---

# 6. MOBILE DESIGN SYSTEM

Reuse semantic identity from web:

- typography roles;
- spacing;
- colors;
- status semantics;
- accessibility language.

Do not reuse DOM-specific components.

Build native components.

---

# 7. DEVICE CLASSES

Validate:

Android:
- low/mid/high-end;
- small screens;
- large phones;
- tablets only if supported.

iOS:
- standard;
- Plus/Max;
- safe areas;
- Dynamic Type.

---

# 8. SAFE AREAS

All top/bottom UI respects safe area.

Bottom navigation must not collide with home indicator.

---

# 9. ACCESSIBILITY

Mobile must support:

- VoiceOver;
- TalkBack;
- Dynamic Type;
- sufficient touch targets;
- accessible labels;
- logical focus;
- reduce motion;
- color-independent state.

---

# 10. PERFORMANCE

Mobile budgets matter more due to device variability.

Avoid:

- giant JS bundle;
- heavy startup work;
- unnecessary charts;
- huge images;
- long synchronous transforms.

---

# 11. STARTUP EXPERIENCE

Splash should be purposeful.

Flow:

```text
Native splash
→ restore session
→ determine route
→ render shell
```

Do not hold splash waiting for every API.

---

# 12. AUTH STORAGE

Never store refresh/access tokens in plain AsyncStorage.

Use platform secure storage:

- iOS Keychain;
- Android Keystore-backed storage;
- Expo SecureStore or vetted equivalent.

---

# 13. BIOMETRICS

Optional convenience:

- Face ID;
- Touch ID;
- Android biometrics.

Biometrics unlock local credential/session access.

Biometrics do not replace server authentication policy.

---

# 14. DEVICE INSTALLATION

Backend may model installation:

- installationId;
- userId;
- platform;
- appVersion;
- pushToken;
- lastSeenAt;
- pushEnabled.

Avoid invasive fingerprinting.

---

# 15. SESSION EXPIRY

On expired session:

- preserve safe unsaved local draft;
- reauthenticate;
- return to intended task.

No silent data loss.

---

# 16. DEEP LINKS

Support routes such as:

```text
boaneconecta://requests/{id}
boaneconecta://appointments/{id}
boaneconecta://payments/{id}
boaneconecta://alerts/{id}
```

Production should also support universal/app links where domain available.

---

# 17. PUSH NOTIFICATIONS

Native push is core.

Use cases:

- request update;
- action required;
- appointment reminder;
- queue called;
- payment state;
- alert;
- funding deadline;
- security event.

---

# 18. PUSH PRIVACY

Push payload should minimize PII.

Prefer:

```text
"Há uma atualização no seu pedido."
```

not sensitive case detail on lock screen.

App opens and fetches authoritative resource.

---

# 19. PUSH PROVIDER

Options:

- Expo Push as abstraction initially;
- direct FCM/APNs later if needed.

Backend notification architecture must isolate provider adapter.

---

# 20. PUSH TOKEN ROTATION

Tokens can change.

App registers on:

- login;
- token refresh event;
- reinstall;
- permission change.

Backend invalidates failed tokens.

---

# 21. NOTIFICATION PERMISSIONS

Ask at contextually meaningful moment.

Do not immediately show permission prompt on first splash without explaining value.

---

# 22. NOTIFICATION CENTER

In-app notifications remain authoritative/history.

Push is delivery mechanism.

---

# 23. CAMERA

Camera use cases:

- photograph document;
- capture work-site/location evidence for complaint/request;
- QR check-in;
- optional profile/identity flow only if approved.

---

# 24. CAMERA PERMISSION

Request only when feature invoked.

Explain:

- why needed;
- what will be captured;
- alternative file picker if possible.

---

# 25. DOCUMENT CAPTURE

Flow:

```text
Open camera
→ capture
→ crop/rotate if needed
→ preview
→ compress
→ strip unnecessary metadata where appropriate
→ upload
→ quarantine
→ scan
→ status
```

---

# 26. DOCUMENT SCANNING UI

Camera "scan" is presentation/processing aid.

Backend remains authoritative for:

- MIME;
- size;
- malware;
- classification;
- validity.

---

# 27. GALLERY / FILE PICKER

Allow:

- photo library where appropriate;
- Files/Documents picker;
- PDF.

Respect document requirement policy from backend.

---

# 28. QR CODE

Potential uses:

- appointment check-in;
- queue ticket;
- receipt/reference verification.

QR data should contain opaque reference/token, not sensitive full payload.

---

# 29. LOCATION

Do not require GPS for ordinary service access.

Possible optional uses:

- incident location;
- nearby municipal point;
- route/map.

Request permission only in context.

---

# 30. LOCATION PRIVACY

Do not continuously track citizens.

No background location unless a future use case has explicit necessity and approval.

---

# 31. MAPS

Map provider is replaceable adapter.

For public locations:

- municipal offices;
- service points;
- project locations.

Data must be validated.

---

# 32. CONNECTIVITY

Use connectivity state to improve UX.

States:

- online;
- offline;
- degraded.

Do not equate device network flag with server reachability.

---

# 33. OFFLINE PUBLIC CONTENT

May cache:

- service catalog;
- selected public information;
- previously loaded public alerts.

Show stale timestamp.

---

# 34. OFFLINE AUTHENTICATED DATA

Cache minimally.

Sensitive cached data:

- encrypted;
- scoped;
- purge on logout.

Do not keep document bytes indefinitely.

---

# 35. OFFLINE DRAFTS

Possible local draft fallback:

- safe form answers;
- encrypted if sensitive;
- synchronized against server draft version.

Server is authoritative.

---

# 36. OFFLINE SUBMISSION

Not authorized by default.

Critical submission requires confirmed server response/idempotency.

---

# 37. BACKGROUND SYNC

Use cautiously.

Possible:

- refresh notification state;
- upload continuation where platform permits;
- safe draft sync.

Platform restrictions differ iOS/Android.

Do not promise exact background execution timing.

---

# 38. UPLOAD RESILIENCE

For large files / unstable networks consider later:

- resumable upload;
- chunking;
- retry;
- background transfer.

F3 initial contract can use multipart if limits are controlled.

---

# 39. REQUEST DRAFT AUTOSAVE

Mobile integrates with backend:

```text
If-Match version
→ PATCH answers
→ new version
```

On conflict:

- preserve local data;
- fetch authoritative server;
- offer review/merge where feasible.

---

# 40. IDEMPOTENT SUBMIT

Mobile must generate opaque idempotency key.

After timeout:

```text
submission-status
```

not blind re-submit.

---

# 41. APPOINTMENT NATIVE UX

Native features:

- date/slot;
- reminder;
- calendar add optionally;
- QR check-in;
- push reminder.

System calendar access should be optional.

---

# 42. CALENDAR API

If user chooses "Adicionar ao calendário":

request appropriate permission/intent.

Do not silently write calendar.

---

# 43. QUEUE NATIVE UX

Strong mobile use case:

- live ticket;
- position/status;
- push when called;
- accessibility.

Do not rely on push only; app refreshes authoritative state.

---

# 44. PAYMENTS

Mobile provider path depends on Mozambique/payment channels.

Security rules:

- amount server-owned;
- provider adapter;
- callback authoritative;
- no card/payment secrets stored in app unless certified provider SDK handles them.

---

# 45. SHARING

Native share can support:

- public service link;
- receipt reference;
- public news.

Never share confidential data by default.

---

# 46. DOWNLOADS

Documents/receipts:

- explicit user action;
- safe filename;
- platform storage rules;
- privacy warning where relevant.

---

# 47. SCREENSHOTS

Do not promise full anti-screenshot security.

For highly sensitive screens Android secure flags may reduce screenshots.

iOS cannot universally prevent capture.

Design privacy rather than false guarantees.

---

# 48. CLIPBOARD

Avoid copying sensitive data automatically.

Clipboard actions explicit.

---

# 49. APP SWITCHER PRIVACY

For sensitive screens consider obscuring app snapshot in task switcher.

Implement only where justified.

---

# 50. ROOT/JAILBREAK

Detection can be a risk signal, not absolute security.

Do not block all citizens solely on unreliable detection without policy.

---

# 51. APP INTEGRITY

Future:

- Play Integrity API;
- Apple App Attest/DeviceCheck.

Useful for abuse defense.

Server remains responsible for authorization.

---

# 52. CERTIFICATE PINNING

Potential future high-security measure.

Adds rotation/operational risk.

Do not implement casually without pin update strategy.

---

# 53. NETWORK CLIENT

Central API client:

- base URL;
- auth;
- refresh;
- timeout;
- correlation;
- retry policy;
- error normalization;
- app version headers.

No ad-hoc fetch per screen.

---

# 54. SERVER STATE

Use TanStack Query React Native or equivalent.

Server state stays server state.

---

# 55. LOCAL STATE

Use local state for:

- view state;
- temporary input;
- UI preferences.

Avoid duplicating whole server database locally.

---

# 56. FORM STATE

React Hook Form + schema tools can be used.

But backend form definitions remain authoritative.

---

# 57. SECURE LOCAL DATABASE

If complex offline later:

- SQLite with encryption strategy if sensitive;
- normalized sync model;
- migration handling.

Do not introduce local DB before need.

---

# 58. CACHE INVALIDATION

On:

- logout;
- account switch;
- sensitive permission changes.

Citizen A data must never appear to Citizen B.

---

# 59. LOGOUT

Must clear:

- access;
- refresh;
- sensitive query cache;
- local files;
- push association where policy requires.

---

# 60. ERROR UX

Mobile errors should distinguish:

- offline;
- server unavailable;
- session expired;
- validation;
- conflict;
- rate limit;
- permission;
- unknown.

---

# 61. CRASH REPORTING

Use privacy-aware crash tracking.

No form answers/document content in breadcrumb metadata.

---

# 62. MOBILE ANALYTICS

Only product metrics with privacy policy.

No PII.

Examples:

- service search;
- request step completion;
- push open.

---

# 63. APP VERSION

Backend should know coarse app version for compatibility/diagnostics.

Do not use it as identity.

---

# 64. MINIMUM SUPPORTED VERSION

Future backend may return upgrade policy:

```json
{
  "minimumSupportedVersion": "...",
  "latestVersion": "...",
  "updateRequired": false
}
```

Use forced upgrade rarely.

---

# 65. OTA UPDATES

Expo EAS Update can ship JS/assets.

Rules:

- runtimeVersion compatibility;
- native module changes require binary build;
- rollback strategy;
- staged rollout.

Do not OTA a change incompatible with installed native runtime.

---

# 66. APP STORE RELEASES

Android:

- signing;
- Play Console;
- internal testing;
- closed/open tracks;
- production.

iOS:

- certificates;
- provisioning;
- App Store Connect;
- TestFlight;
- production.

---

# 67. SIGNING KEYS

Critical secrets.

Back up securely.

Restrict access.

Never commit.

---

# 68. CI/CD MOBILE

Pipeline:

```text
lint
→ typecheck
→ unit
→ component
→ build validation
→ EAS build
→ device smoke
→ internal distribution
→ release
```

---

# 69. TESTING PYRAMID

Mobile:

- unit;
- component;
- navigation;
- integration;
- native permission flows;
- E2E on devices.

---

# 70. DEVICE TEST MATRIX

At minimum:

Android:
- low/mid representative;
- current + older supported Android.

iOS:
- current supported iPhone classes.

Exact OS support set before launch.

---

# 71. PERMISSION TEST MATRIX

Test:

- denied;
- granted;
- limited;
- permanently denied;
- revoked after grant.

For:

- notifications;
- camera;
- photos/files;
- biometrics;
- location if used.

---

# 72. NETWORK TEST MATRIX

Test:

- Wi-Fi;
- mobile data;
- offline;
- slow;
- packet loss;
- timeout;
- switch networks during upload.

---

# 73. APP LIFECYCLE

Test:

- foreground;
- background;
- terminated;
- cold start from push;
- deep link;
- session restore;
- interrupted upload.

---

# 74. ACCESSIBILITY TESTING

Manual:

- TalkBack;
- VoiceOver;
- large text;
- contrast;
- reduce motion.

---

# 75. NATIVE PERFORMANCE

Measure:

- cold start;
- navigation;
- list scroll;
- image decode;
- upload;
- memory.

---

# 76. IMAGE HANDLING

Use:

- max dimensions;
- compression;
- thumbnails;
- progressive preview.

Do not upload 20MB camera image unnecessarily if policy permits compression.

---

# 77. EXIF

Potential privacy data:

- GPS;
- device.

Strip unless explicitly required.

Server must not assume EXIF truth.

---

# 78. CAMERA QUALITY

Document capture needs readable text.

Balance:

- compression;
- bandwidth;
- validation quality.

---

# 79. APP ICON / SPLASH

Must align with Boane Conecta brand.

Splash is native and lightweight.

Do not use giant marketing animation.

---

# 80. NATIVE MODULE GOVERNANCE

Before adding module evaluate:

- maintenance;
- Expo compatibility;
- platform parity;
- privacy;
- app size;
- security;
- licensing.

---

# 81. REACT NATIVE NEW ARCHITECTURE

Use supported framework defaults.

Do not custom-optimize native bridge without measured need.

---

# 82. FLIPPER/DEV TOOLS

Development only.

No debug endpoints in production.

---

# 83. ENV CONFIG

Use public config only in bundle.

Secrets do not live in app environment variables.

Anything inside mobile binary can be extracted.

---

# 84. API KEYS IN MOBILE

Only publishable/restricted keys where provider requires client key.

Sensitive provider secrets remain backend.

---

# 85. DEEP LINK SECURITY

Validate route parameters.

Sensitive operation still requires authenticated API authorization.

A deep link must not grant access.

---

# 86. PUSH SECURITY

Push action does not execute privileged operation automatically.

Open app → authenticate if needed → fetch resource → user confirms action.

---

# 87. NOTIFICATION CATEGORIES

Potential:

- PROCESS
- APPOINTMENT
- QUEUE
- PAYMENT
- ALERT
- PROGRAM
- SECURITY
- INFORMATION

User preferences applied where policy allows.

---

# 88. EMERGENCY ALERTS

May use push.

But public alert remains accessible without push.

Do not rely on app install for municipal emergency communication.

---

# 89. CAMERA FOR COMPLAINTS

Potential flow:

```text
Reportar problema
→ category
→ description
→ camera/gallery
→ optional location
→ review
→ submit
```

Categories must come from backend.

---

# 90. QR CHECK-IN

Flow:

```text
appointment
→ display QR OR scan venue QR
→ backend validate
→ checked-in
```

Choice requires operational design.

---

# 91. NFC

Not required initially.

Only introduce if future physical-service integration justifies.

---

# 92. BLUETOOTH

Not required initially.

No speculative permissions.

---

# 93. CONTACTS

Do not request contact-book access for ordinary municipal app.

---

# 94. MICROPHONE

Do not request unless voice/audio feature approved.

---

# 95. BACKGROUND LOCATION

Explicitly prohibited unless future validated case requires it.

---

# 96. MOBILE SECURITY REVIEW

Before production:

- storage review;
- token review;
- jailbreak/root behavior;
- SSL/TLS;
- deep links;
- exported Android components;
- iOS URL schemes;
- logs;
- clipboard;
- screenshots;
- backup policy.

---

# 97. ANDROID BACKUP

Sensitive app data should not be indiscriminately backed up.

Review Android backup configuration.

---

# 98. IOS BACKUP

SecureStore/keychain accessibility class and backup behavior reviewed.

---

# 99. SCREEN PRIVACY

Potential sensitive screens:

- personal documents;
- payment;
- protocol.

Use OS capabilities where practical.

---

# 100. MOBILE DEFINITION OF DONE

A mobile feature is done only if:

- Android works;
- iOS works;
- permission denied works;
- offline/degraded behavior defined;
- accessibility checked;
- secure storage considered;
- deep link/push interaction considered;
- old API compatibility considered;
- backend authoritative behavior preserved;
- device QA completed.

---

# 101. MOBILE PHASES

Suggested:

```text
M0 — Foundation / Auth / Design System
M1 — Public / Service Discovery
M2 — Citizen Home / Requests
M3 — Guided Request / Documents / Camera
M4 — Notifications
M5 — Appointments / Queue / QR
M6 — Payments
M7 — Complaints / Location
M8 — Funding / Protocol
M9 — Production Hardening
```

Sequence should align with backend readiness.

---

# 102. M0

- Expo/React Native TS;
- app shell;
- navigation;
- API client;
- secure auth;
- design system;
- error handling;
- connectivity;
- observability.

---

# 103. M1

- Home;
- services;
- public alerts;
- search.

---

# 104. M2

- citizen home;
- request list;
- request detail;
- notifications center.

---

# 105. M3

- request definition;
- guided form;
- autosave;
- camera;
- file picker;
- upload;
- review;
- idempotent submit.

---

# 106. M4

- push registration;
- notification preferences;
- deep links;
- action required.

---

# 107. M5

- appointments;
- QR/check-in;
- queue live state;
- call push.

---

# 108. M6

- obligations;
- payment intents;
- receipts;
- provider handoff.

---

# 109. M7

- complaints;
- camera;
- optional geo capture.

---

# 110. M8

- opportunities;
- funding;
- protocol requests.

---

# 111. M9

- security audit;
- performance;
- accessibility;
- store compliance;
- privacy;
- release.

---

# 112. MOBILE ↔ BACKEND CONTRACT

The mobile app uses the same domain API.

Do not create a second business logic backend only for mobile.

A Backend-for-Frontend layer is considered only if demonstrated need exists.

---

# 113. MOBILE API COMPATIBILITY

Because app updates are delayed, backend changes require:

- backward compatibility;
- graceful unknown fields;
- stable enums/error codes;
- deprecation telemetry.

---

# 114. NATIVE FEATURE REGISTRY

Each native capability should record:

```text
Capability
Purpose
Screens
Permission
Data collected
Backend dependency
Offline behavior
Android
iOS
Security
Fallback
```

---

# 115. CAMERA REGISTRY

Purpose:
documents/evidence/QR.

Permission:
camera.

Data:
image/video only if explicitly needed.

Fallback:
gallery/file picker where applicable.

---

# 116. PUSH REGISTRY

Purpose:
time-sensitive citizen status.

Permission:
notifications.

Backend:
device installation + notification service.

Fallback:
in-app notification center.

---

# 117. BIOMETRICS REGISTRY

Purpose:
local session convenience.

Permission:
biometric API.

Backend:
none for biometric itself; normal auth remains authoritative.

Fallback:
PIN/password login.

---

# 118. LOCATION REGISTRY

Purpose:
incident/map only.

Permission:
when-in-use.

Backend:
coordinates only when explicitly submitted.

Fallback:
manual location selection/text.

---

# 119. FILE REGISTRY

Purpose:
documents.

Permission:
system picker generally minimizes broad storage permission.

Backend:
Document domain.

---

# 120. FINAL MOBILE PRINCIPLE

Mobile should exploit native capability only where it materially improves municipal service.

Do not add permissions because "apps usually have them".

Every native permission is a privacy and trust cost.

---

**END — CITIZEN MOBILE APP REACT NATIVE ARCHITECTURE & NATIVE CAPABILITIES SPEC V1**
