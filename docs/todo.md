# Gaslytics Project To-Do List

This document outlines the tasks for the development team to enhance the Gaslytics application.

---

## 🚀 Priority 1: Backend and Core Functionality

### 1.1. Implement Analysis Pipeline (TwelveLabs & Gemini)

- **Goal:** Set up the core data processing pipeline to analyze video conversations.
- **Tasks:**
  - [ ] **Set up TwelveLabs Integration:**
    - [ ] Initialize TwelveLabs SDK.
    - [ ] Create a module for handling video uploads to TwelveLabs.
    - [ ] Implement logic to start the video indexing process.
    - [ ] Create a webhook or polling mechanism to get the analysis results.
  - [ ] **Set up Gemini Integration:**
    - [ ] Initialize Gemini SDK.
    - [ ] Create a module to send transcription data from TwelveLabs to Gemini for analysis (e.g., identifying manipulation techniques, summarizing conversations).
    - [ ] Structure the prompts for Gemini to get the desired analysis format.
  - [ ] **Connect Pipeline to Frontend:**
    - [ ] Create a new API endpoint on the frontend (or a separate backend service) that triggers this pipeline when a user uploads a video.
    - [ ] The `UploadPage.tsx` should call this new endpoint.
    - [ ] The frontend should handle the loading and completion states of the pipeline.
    - [ ] The analysis results should be passed to the `/results` and `/highlights` pages.

### 1.2. Set Up Supabase for Data Storage

- **Goal:** Use Supabase to store user data and conversation analyses.
- **Tasks:**
  - [ ] **Initialize Supabase Project:**
    - [ ] Create a new project on Supabase.
    - [ ] Define the database schema for users and analyses (see schema suggestion below).
  - [ ] **Integrate Supabase with the Frontend:**
    - [ ] Install the Supabase client library (`@supabase/supabase-js`).
    - [ ] Initialize the Supabase client in the application.
    - [ ] Implement user authentication (e.g., email/password or social logins).
    - [ ] Secure the application by protecting routes that require authentication.
  - [ ] **Save and Fetch Analyses:**
    - [ ] After a successful analysis from the pipeline, save the results to the Supabase database, associated with the user's ID.
    - [ ] The `SavedConversations.tsx` page should fetch and display the list of analyses for the logged-in user from Supabase.

**Suggested DB Schema:**

- **`users`**: `id`, `email`, `created_at`
- **`analyses`**: `id`, `user_id`, `video_url`, `title`, `summary`, `manipulation_likelihood`, `detected_patterns` (JSON), `highlights` (JSON), `created_at`

---

##🎨 Priority 2: UI/UX Redesign and Refactoring

### 2.1. Redesign Landing Page

- **Goal:** Create a more professional and less "AI-generated" look for the landing page to build user trust.
- **Tasks:**
  - [ ] **Hero Section:**
    - [ ] Design a clean and compelling hero section with a clear headline, a short description of Gaslytics, and a prominent "Start Your Analysis" button that links to `/consent`.
  - [ ] **Video Demo:**
    - [ ] Replace the current interactive demo with a high-quality, professionally made video that walks through the app's features and benefits.
  - [ ] **Marketing Claims:**
    - [ ] Add a section with 3-4 key marketing claims (e.g., "Complete Privacy," "Actionable Insights," "Unbiased Analysis") with icons and short descriptions.
  - [ ] **FAQ Section:**
    - [ ] Create a Frequently Asked Questions (FAQ) section to address common user concerns (e.g., "Is my data secure?", "How accurate is the analysis?").
  - [ ] **Overall Aesthetics:**
    - [ ] Update the color palette and typography to be more unique and professional.
    - [ ] Remove the floating conversation bubbles animation.

### 2.2. Split the Results Page

- **Goal:** Improve the user experience by splitting the dense results page into two more focused pages.
- **Tasks:**
  - [ ] **Create New Route:**
    - [ ] In `App.tsx`, create a new route for `/highlights`.
  - [ ] **Modify `/results` Page:**
    - [ ] This page should display:
      - `Conversation Summary`
      - `Mediator's Perspective`
      - `Detected Patterns` (the list of techniques)
      - `Manipulation Likelihood` score.
    - [ ] Add a clear navigation button or link (e.g., "View Highlights") that takes the user to the `/highlights` page.
  - [ ] **Create `/highlights` Page:**
    - [ ] This page will be based on the provided sample image.
    - [ ] **Left Side (Video Player):**
      - [ ] Implement a real video player that plays the user's video.
      - [ ] The timeline should have markers at timestamps where specific techniques were detected.
      - [ ] Hovering over a marker should show a tooltip with the technique name.
      - [ ] Clicking a marker should jump the video to that timestamp and display details in the right-hand sidebar.
    - [ ] **Right Side (Analysis Sidebar):**
      - [ ] At the top, show "Key Takeaways" (the overall summary).
      - [ ] Add a "Download PDF" button.
      - [ ] Below, have a "Highlighted Clips" section. This should be a scrollable list of all detected techniques with their timestamps.
      - [ ] When a user clicks on a marker on the timeline (or a clip in this list), this section should update to show the detailed analysis for that clip (e.g., transcript snippet, confidence score, sentiment delta).
  - [ ] **State Management:**
    - [ ] Ensure that the analysis data is available to both `/results` and `/highlights`. This might involve fetching the data once and passing it between routes or using the existing `ConversationContext`.

---

Please review this list and let me know if you have any questions.
