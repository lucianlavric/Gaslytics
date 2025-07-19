# Gaslytics Codebase Analysis

This document provides a detailed analysis of the Gaslytics application's frontend codebase.

## 1. Project Overview

Gaslytics is a React-based web application designed to analyze conversations from video recordings. Users can upload videos, provide context about the conversation, and receive an analysis that identifies potential manipulation techniques, emotional dynamics, and communication patterns. The application aims to provide users with insights to help them understand their conversations and build healthier communication habits.

The application is built with React, TypeScript, and Tailwind CSS. It uses React Router for navigation and a custom React Context for state management.

## 2. File Structure

The main application logic is contained within the `src` directory.

```
src/
├── App.tsx
├── components/
│   ├── ConsentPage.tsx
│   ├── LandingPage.tsx
│   ├── Navigation.tsx
│   ├── ResourcesPage.tsx
│   ├── ResultsPage.tsx
│   ├── SavedConversations.tsx
│   ├── TechniqueModal.tsx
│   ├── UploadPage.tsx
│   └── VideoPlayer.tsx
├── context/
│   └── ConversationContext.tsx
├── index.css
├── main.tsx
└── vite-env.d.ts
```

- **`main.tsx`**: The entry point of the application, where the root React component is rendered.
- **`App.tsx`**: The main application component that sets up routing and the overall layout.
- **`components/`**: This directory contains all the React components that make up the user interface.
- **`context/`**: This directory contains the React Context for managing shared state across the application.

## 3. Core Components and Functionality

### 3.1. `App.tsx`

This component serves as the root of the application. It wraps the entire application in a `ConversationProvider` to manage global state and sets up all the routes using `react-router-dom`. The main pages are:

- `/`: `LandingPage`
- `/consent`: `ConsentPage`
- `/upload`: `UploadPage`
- `/results`: `ResultsPage`
- `/saved`: `SavedConversations`
- `/resources`: `ResourcesPage`

### 3.2. `context/ConversationContext.tsx`

This file defines the `ConversationContext`, which manages the state of a conversation analysis. It stores data such as user consent, relationship context, tags, emotional tone, and the uploaded video file.

- **`ConversationProvider`**: A component that provides the conversation context to its children.
- **`useConversation`**: A custom hook for easy access to the conversation context.
- **State**:
  - `conversationData`: An object holding all the contextual information about the conversation.
- **Actions**:
  - `updateContext`: Updates the conversation data.
  - `updateVideoFile`: Updates the video file in the state.

### 3.3. Page Components

- **`LandingPage.tsx`**: The main entry point for users, featuring a hero section, an interactive demo, and a features grid. It has an animated background with floating conversation bubbles.
- **`ConsentPage.tsx`**: A form where users must give consent for the analysis and provide context about the conversation, such as their relationship with the other person, the emotional tone, and descriptive tags. This data is then stored in the `ConversationContext`.
- **`UploadPage.tsx`**: This page handles the video file upload. It includes a drag-and-drop area, file validation (type and size), and a simulated upload and processing flow with progress indicators.
- **`ResultsPage.tsx`**: Displays the analysis results. It uses mock data to show a summary, a "Gaslight Score," and a list of detected manipulation techniques. It also includes a `VideoPlayer` component.
- **`SavedConversations.tsx`**: Shows a list of previously saved conversation analyses. The current implementation uses mock data to display a list of conversations with their analysis summaries.
- **`ResourcesPage.tsx`**: Provides a curated list of resources, including communication guides, professional support contacts, and crisis support hotlines.

### 3.4. Reusable Components

- **`Navigation.tsx`**: A sticky navigation bar at the top of the page with links to Home, Saved Conversations, and Resources.
- **`TechniqueModal.tsx`**: A modal window that displays detailed information about a specific manipulation technique, including a definition, the quote from the conversation, an explanation, and response strategies.
- **`VideoPlayer.tsx`**: A mock video player that shows a timeline with markers for detected techniques. It allows users to "jump" to specific timestamps in the video.

## 4. State Management

The application uses React's Context API for global state management. The `ConversationContext` is well-suited for the current scope, as it manages a single, shared piece of state—the conversation being analyzed.

## 5. Styling

The application is styled using **Tailwind CSS**. The class names in the components indicate a utility-first approach to styling, which allows for rapid UI development. The overall design is clean, modern, and user-friendly, with a consistent color scheme and typography.

## 6. Areas for Improvement and Future Development

- **Backend Integration**: The application currently uses mock data for the analysis results. The next logical step would be to integrate a backend service that performs the actual video and conversation analysis. This would involve:
  - An API for uploading the video file.
  - A backend service to process the video, transcribe the audio, and run the analysis.
  - An API to fetch the analysis results.
- **Authentication**: To support saving conversations, user authentication will be necessary. This would allow users to have their own accounts and view their conversation history.
- **Real Video Playback**: The `VideoPlayer` component is currently a mock. It needs to be integrated with a real video player library (e.g., `ReactPlayer`) to play the uploaded video files.
- **Error Handling**: The application could benefit from more robust error handling, especially for API requests and file uploads.
- **Testing**: There are no tests in the codebase. Adding unit and integration tests would improve the reliability and maintainability of the application.

## 7. Conclusion

The Gaslytics application has a solid foundation with a well-organized component structure and a clear, user-friendly interface. The use of modern technologies like React, TypeScript, and Tailwind CSS makes it a scalable and maintainable project. The main focus for future development will be on building out the backend functionality to replace the mock data with real analysis results and implementing user authentication to support saved conversations.
