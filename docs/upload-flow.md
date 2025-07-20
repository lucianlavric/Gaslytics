# Video Upload and Processing Flow

This document outlines the step-by-step process of how a user uploads a video file, how it's handled by the frontend, and how it's processed and stored using Supabase.

The primary components involved in this flow are:

- **Frontend:** `src/components/UploadPage.tsx`
- **Supabase Client Logic:** `src/lib/supabase.ts`

---

## 1. File Selection and Validation (Frontend)

The user journey begins on the `/upload` page, rendered by the `UploadPage.tsx` component.

1.  **UI Interaction**: The user is presented with a drag-and-drop area and a file input field. They can either drag a file onto the area or click it to open a file browser.
2.  **File Handling**: The `handleFileSelection` function is triggered when a file is selected.
3.  **Validation**: This function performs two key client-side checks:
    - **File Type**: It ensures the file is a valid video format (`video/mp4`, `video/webm`, or `video/quicktime`).
    - **File Size**: It checks if the file size is within the 50MB limit (a constraint of the Supabase free tier).
4.  **State Update**: If the file is valid, it's stored in the component's state (`selectedFile`), and the UI updates to show the selected file's name and size. The "Start Analysis" button is then displayed.

## 2. Triggering the Upload

1.  **User Action**: The user clicks the "Start Analysis" button.
2.  **Function Call**: This action calls the `handleUploadAndProcessing` async function, which orchestrates the entire upload and initial processing workflow.
3.  **UI Feedback**: The UI immediately switches from the upload form to a progress screen, setting its state to `uploading`.

## 3. User Authentication (Supabase)

A critical step before uploading is ensuring the request is associated with a user. This is handled silently in the background by functions in `supabase.ts`.

1.  **Check for Existing User**: `handleUploadAndProcessing` first calls `getCurrentUser()` from `supabase.ts` to see if there's an active session.
2.  **Create Demo User**: If `getCurrentUser()` returns `null` (meaning the user is not logged in), the `uploadVideoFile` function automatically calls `createDemoUser()`.
    - `createDemoUser` generates a unique, non-verifiable email address and password.
    - It signs up a new user in Supabase Auth. This creates a user session for the current visitor without requiring them to go through a sign-up flow.
3.  **User ID**: The flow now has a `user.id`, whether from an existing session or a new demo user. This ID is essential for securing user data.

## 4. File Upload to Supabase Storage

1.  **Function Call**: `uploadVideoFile` is called from `handleUploadAndProcessing`.
2.  **Path Generation**: It creates a unique path for the file in Supabase Storage using the format: `${user.id}/${Date.now()}-${random-string}.${fileExt}`.
    - **Security**: Using the `user.id` as a top-level folder is the key mechanism for data isolation. Row-Level Security (RLS) policies in Supabase Storage are configured to ensure a user can only access files within their own folder.
3.  **Upload**: The function uses `supabase.storage.from('conversation-videos').upload()` to stream the file to the cloud.
4.  **Return Path**: On success, it returns the full `filePath` of the stored object.

## 5. Creating the Conversation Record in Database

After the file is securely stored, a corresponding record is created in the `conversations` database table.

1.  **Function Call**: Back in `UploadPage.tsx`, the `createConversation` function from `supabase.ts` is called.
2.  **Payload Assembly**: It gathers data into a payload object, including:
    - `user_id` (from the authenticated session).
    - `file_name` and `file_path`.
    - Metadata collected in previous steps (e.g., relationship type, emotional tone) from the `ConversationContext`.
3.  **Database Insert**: It uses `supabase.from('conversations').insert()` to create a new row. RLS policies on the `conversations` table ensure a user can only insert rows with their own `user_id`.
4.  **Return Record**: On success, the function returns the complete database record for the new conversation, including its unique `id`.

## 6. Finalizing and Redirection (Frontend)

1.  **UI State Update**: The UI state is updated to `processing` and then `complete`.
2.  **Simulated Delay**: Currently, a `setTimeout` simulates a backend analysis process.
3.  **Redirection**: Once the "processing" is complete, the app uses `react-router`'s `navigate` function to redirect the user to the results page.
    - The URL is formatted as `/results?id=${conversation.id}`. The `id` of the conversation record is passed as a query parameter, allowing the results page to fetch the correct analysis data.
