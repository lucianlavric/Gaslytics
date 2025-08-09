# Architectural Decision: Backend Server for TwelveLabs API

This document explains the critical architectural decision to use a dedicated Node.js backend server to interact with the TwelveLabs API instead of making calls directly from the frontend (browser).

While direct frontend calls seem simpler initially, they are not feasible due to fundamental browser security limitations and the design of the official TwelveLabs Node.js SDK.

---

## The Core Problem: Browser vs. Node.js Environments

The primary issue is that a web browser and a Node.js server are two completely different JavaScript environments. They have different tools, capabilities, and security models.

- **Browser (Frontend):** A highly restrictive, sandboxed environment designed to protect the user. It has no direct access to the user's file system and has strict rules about network requests (CORS).
- **Node.js (Backend):** A trusted, server-side environment with full access to the server's file system, unrestricted network capabilities, and tools for handling large amounts of data efficiently.

The `twelvelabs-js` SDK was built specifically for the **Node.js environment**.

## SDK Incompatibility: The `instanceof` Error

Our testing revealed a critical error when attempting to upload a file from the browser:

```
Right hand side of instanceof is not an object
```

This error occurs because the SDK's file upload function was written to expect file formats that only exist in Node.js.

### What the SDK Expects

According to the [official TwelveLabs SDK documentation](https://docs.twelvelabs.io/v1.3/sdk-reference/node-js/upload-videos#create-a-video-indexing-task), the `file` parameter for creating an upload task must be one of:

- `string` (a file path on the server)
- `Buffer` (a Node.js object for raw binary data)
- `NodeJS.ReadableStream` (a Node.js "data hose" for streaming large files efficiently)

### What the Browser Provides

When a user selects a file in the browser, JavaScript receives it as a **`File` object**. This is a browser-specific object that contains metadata (name, size, type) and provides a secure way to access the file's contents.

**The `twelvelabs-js` SDK was not designed to understand or accept the browser's `File` object.**

The `instanceof` error happens because the SDK's internal code checks if the provided file is an `instanceof NodeJS.ReadableStream` or `instanceof Buffer`. Since those classes do not exist in the browser, the check fails immediately, and the code crashes before a network request is even attempted.

## The Solution: A Backend-for-Frontend (BFF) Proxy

The architecture we've implemented uses the Node.js backend as a secure and compatible **proxy** or intermediary.

The flow is as follows:

1.  **Frontend -> Supabase:** The user uploads the video file directly to Supabase Storage. This is secure and efficient.
2.  **Frontend -> Backend:** The frontend sends a simple, secure request to our own backend API, providing the URL of the video in Supabase.
3.  **Backend -> TwelveLabs:** Our Node.js server, running in its native environment, can:
    - Securely use the TwelveLabs API key.
    - Provide the video URL to the TwelveLabs SDK, which knows how to handle it.
    - Manage the long-running indexing task.
    - Update the database with the results once complete.

This architecture respects the boundaries of each environment, ensuring security, compatibility, and reliability for the entire video analysis process.
