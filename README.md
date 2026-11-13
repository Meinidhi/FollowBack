# FollowBack 🔍 — Instagram Follow Analyzer

> **"Know who follows you back."**

A production-quality, responsive web application built with **React**, **TypeScript**, **Tailwind CSS**, **Vite**, **Lucide Icons**, and **JSZip** to identify who doesn't follow you back on Instagram using your official data export ZIP.

---

## 🔒 100% Client-Side Privacy Guarantee

- **Zero External Servers:** All uploaded ZIP files and extracted data are processed exclusively inside your browser memory.
- **No Passwords or Logins:** Never asks for your Instagram credentials, passwords, or authentication cookies.
- **Safe from Bans:** Uses Meta's official Account Center data export — completely immune to API limits, blocks, or account suspensions.
- **Zero Database / Telemetry:** No database, no telemetry, no tracking of usernames or lists.

---

## ⚡ Core Features

1. **Three Complete Comparison Lists:**
   - 🚫 **Don't Follow You Back:** Accounts you follow who do not follow you back (`Following - Followers`).
   - 🌟 **You Don't Follow Back:** Accounts that follow you, but you haven't followed back (`Followers - Following`).
   - 🤝 **Mutual Followers:** Accounts where both parties follow each other (`Followers ∩ Following`).
2. **Robust ZIP & Multi-part JSON Engine:**
   - Automatically detects all `followers_*.json` files (`followers_1.json`, `followers_2.json`, etc.) anywhere in the archive.
   - Detects `following.json` with fallback path normalization.
   - High-priority username extraction: `string_list_data[0].value` &rarr; `title` &rarr; `href` slug.
   - Guard against timestamps mistaken for usernames.
   - Removes duplicates and normalizes usernames case-insensitively.
   - Detects unsupported HTML exports with actionable instructions.
3. **Interactive 16-Step Download Guide:**
   - Complete visual walkthrough for Meta Accounts Center export.
   - High-visibility JSON vs HTML comparison cards (JSON Supported vs HTML Not Supported).
   - Mandatory JSON acknowledgement checkbox before file analysis.
   - Collapsible FAQ section.
4. **SaaS Dashboard (Linear / Stripe Aesthetic):**
   - 4 Animated stat cards: Total Followers, Total Following, Don't Follow You Back, Mutual Followers.
   - Visual proportional distribution breakdown bar.
   - Dynamic non-follow percentage calculator.
   - Timestamp and file metadata indicator.
5. **Interactive Controls:**
   - Live real-time search across all tabs.
   - Alphabetical sorting (A–Z, Z–A, Default).
   - Pagination (25 accounts per page).
   - Direct Instagram profile links (`https://www.instagram.com/username/`) opening in new tabs.
   - Real UTF-8 CSV exports (`instagram_non_followers.csv`, `instagram_mutual_followers.csv`, `instagram_you_dont_follow_back.csv`).
   - "Clear Data" button resetting all state and memory.
   - "⚡ Try with Demo Data" button for immediate test-driving.

---

## 🚀 Running the Project Locally

### 1. Development Server
To launch the Vite development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Production Build
```bash
npm run build
npm run preview
```

---

## 🛠️ Project Architecture

```
unfollows/
├── src/
│   ├── components/
│   │   ├── Navbar.tsx                # Brand header, status pill, clear data
│   │   ├── Hero.tsx                  # Landing hero, 3 feature cards, 3-step overview
│   │   ├── DownloadInstructions.tsx  # 16-step visual guide
│   │   ├── JsonFormatWarning.tsx     # JSON vs HTML comparison cards
│   │   ├── UploadSection.tsx         # Drag & drop ZIP upload, validation, acknowledgement
│   │   ├── UploadProgress.tsx        # Processing progress bar
│   │   ├── StatsCards.tsx            # 4 metric cards
│   │   ├── ComparisonChart.tsx       # Proportional distribution bar & summary sentence
│   │   ├── SearchBar.tsx             # Live username search input
│   │   ├── FilterControls.tsx        # Sorting & CSV export trigger
│   │   ├── AccountTable.tsx          # Responsive desktop table
│   │   ├── AccountCard.tsx           # Responsive mobile card
│   │   ├── Pagination.tsx            # 25-per-page paginator
│   │   ├── ResultsDashboard.tsx      # Results workspace & tabs
│   │   ├── PrivacyNotice.tsx         # "Your data stays yours" 6-point grid
│   │   ├── FAQ.tsx                   # Collapsible question drawer
│   │   └── Footer.tsx                # SaaS footer
│   ├── types/
│   │   └── instagram.ts              # TypeScript interfaces
│   ├── utils/
│   │   ├── usernameNormalizer.ts     # Sanitization, case normalization, URL generator
│   │   ├── jsonParser.ts             # Followers & following JSON extraction logic
│   │   ├── zipProcessor.ts           # JSZip reader, multi-part detector, HTML error
│   │   ├── comparisonEngine.ts       # Set-based math (A-B, B-A, A∩B)
│   │   ├── csvExporter.ts            # UTF-8 CSV blob download generator
│   │   └── validation.ts             # File size and archive format helpers
│   ├── App.tsx                       # Main application state orchestrator
│   ├── main.tsx                      # React root entry
│   └── index.css                     # Tailwind CSS entry
├── index.html                        # Application HTML entry
├── package.json                      # Project dependencies & scripts
├── tailwind.config.js                # Custom palette (#F8FAFC, #635BFF, #171717, #737373)
├── tsconfig.json                     # TypeScript strict configuration
└── vite.config.ts                    # Vite React bundler config
```

---

## 📋 Acceptance Criteria Checklist

- [x] Landing page with Linear/Stripe design aesthetic
- [x] 16-step Instagram data download instructions
- [x] Unmissable JSON vs HTML format comparison warning
- [x] Mandatory JSON acknowledgement checkbox
- [x] Drag & drop ZIP upload with size and format verification
- [x] Multi-part `followers_*.json` and `following.json` automated path detection
- [x] High-precision username extraction priority
- [x] Accurate mathematical Set comparison (`B - A`, `A - B`, `A ∩ B`)
- [x] Dynamic dashboard with 4 metric cards & distribution bar
- [x] 3 independent comparison tabs with empty-state handling
- [x] Search, alphabetical sorting (A-Z, Z-A), and pagination (25/page)
- [x] Verified external Instagram profile links
- [x] Browser-generated CSV exports for all tabs
- [x] "Clear Data" memory and state wipe
- [x] 100% In-browser execution with zero network telemetry
