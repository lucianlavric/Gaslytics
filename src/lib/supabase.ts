import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log("🔧 Supabase config:", {
  url: supabaseUrl ? "Set" : "Missing",
  key: supabaseAnonKey ? "Set" : "Missing",
});

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test connection
export const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from("conversations")
      .select("count");
    if (error) throw error;
    console.log("✅ Supabase connection successful");
    return true;
  } catch (err) {
    console.error("❌ Supabase connection failed:", err);
    return false;
  }
};

// Get current user
export const getCurrentUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) {
    console.error("❌ Error getting user:", error);
    return null;
  }
  return user;
};

// Create a demo user account (for testing without email verification)
export const createDemoUser = async () => {
  // Generate a unique email for demo
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 8);
  const demoEmail = `demo-user-${timestamp}-${randomId}@gaslytics-demo.com`;
  const demoPassword = `demo-password-${timestamp}`;

  console.log("👤 Creating demo user with email:", demoEmail);

  const { data, error } = await supabase.auth.signUp({
    email: demoEmail,
    password: demoPassword,
    options: {
      emailRedirectTo: undefined, // Skip email confirmation for demo
    },
  });

  if (error) {
    console.error("❌ Demo user creation failed:", error);
    throw error;
  }

  console.log("✅ Demo user created:", data.user?.id);
  return data.user;
};

// Upload video file to Supabase Storage with user isolation
export const uploadVideoFile = async (file: File) => {
  console.log("📤 Starting file upload to Supabase Storage");

  // Get current user or create demo user
  let user = await getCurrentUser();
  if (!user) {
    console.log("👤 No user found, creating demo user...");
    user = await createDemoUser();
  }

  if (!user) {
    throw new Error("Unable to authenticate user");
  }

  console.log("👤 User ID:", user.id);

  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random()
    .toString(36)
    .substring(2)}.${fileExt}`;
  // Use user ID as folder name for isolation
  const filePath = `${user.id}/${fileName}`;

  console.log("📁 Upload details:", {
    fileName,
    filePath,
    fileSize: file.size,
    userId: user.id,
  });

  const { data, error } = await supabase.storage
    .from("conversation-videos")
    .upload(filePath, file);

  if (error) {
    console.error("❌ Storage upload error:", error);
    throw error;
  }

  console.log("✅ File uploaded successfully:", data);
  return { filePath: data.path, fileName, userId: user.id };
};

// Create conversation record with user ID
export const createConversation = async (conversationData: {
  fileName: string;
  filePath: string;
  relationshipType: string;
  emotionalState: string;
  conversationTags: string[];
  fileSize: number;
  fileType: string;
  conversationContent?: string;
  conversationType?: string;
}) => {
  console.log("💾 Creating conversation record with data:", conversationData);

  // Get current user
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  const insertData = {
    user_id: user.id, // Always use the authenticated user's ID
    file_name: conversationData.fileName,
    file_path: conversationData.filePath,
    relationship_type: conversationData.relationshipType,
    emotional_state: conversationData.emotionalState,
    conversation_tags: conversationData.conversationTags,
    file_size: conversationData.fileSize,
    file_type: conversationData.fileType,
    conversation_content: conversationData.conversationContent,
    conversation_type: conversationData.conversationType,
    upload_timestamp: new Date().toISOString(),
    consent_given: true,
  };

  console.log("📋 Insert payload:", insertData);

  const { data, error } = await supabase
    .from("conversations")
    .insert([insertData])
    .select()
    .single();

  if (error) {
    console.error("❌ Database insert error:", error);
    throw error;
  }

  console.log("✅ Conversation created successfully:", data);
  return data;
};

// Get user's conversations only
export const getUserConversations = async () => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("❌ Error fetching user conversations:", error);
    throw error;
  }

  return data;
};

// Get conversation by ID (only if user owns it)
export const getConversationById = async (id: string) => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id) // Only get if user owns it
    .single();

  if (error) {
    console.error("❌ Error fetching conversation:", error);
    throw error;
  }

  return data;
};

// Get signed URL for user's file
export const getFileUrl = async (filePath: string) => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  // Verify the file path starts with user's ID for security
  if (!filePath.startsWith(user.id + "/")) {
    throw new Error("Unauthorized file access");
  }

  const { data, error } = await supabase.storage
    .from("conversation-videos")
    .createSignedUrl(filePath, 3600); // 1 hour expiry

  if (error) {
    console.error("❌ Error creating signed URL:", error);
    throw error;
  }

  return data.signedUrl;
};

// Validate JSON analysis data against the expected schema from prompt.txt
export const validateAnalysisData = (
  analysisData: any
): { isValid: boolean; error?: string; validatedData?: any } => {
  try {
    // Check if analysisData has the expected structure
    if (!analysisData || typeof analysisData !== "object") {
      return { isValid: false, error: "Analysis data must be an object" };
    }

    // If it's raw data (not parsed JSON), return as is
    if (analysisData.raw) {
      return { isValid: true, validatedData: analysisData };
    }

    // Check if clips array exists
    if (!analysisData.clips || !Array.isArray(analysisData.clips)) {
      return {
        isValid: false,
        error: 'Analysis data must contain a "clips" array',
      };
    }

    // Validate each clip in the array
    const validTactics = [
      "Gaslighting",
      "Blame-shifting",
      "Emotional blackmail",
      "Self-presentation as victim",
      "Exaggeration / overstatement",
      "Dominance & control",
    ];

    const validatedClips = analysisData.clips.map(
      (clip: any, index: number) => {
        // Check required fields
        if (
          !clip.startTime ||
          !clip.endTime ||
          !clip.transcript ||
          !clip.tactic ||
          !clip.justification ||
          !clip.confidence ||
          !clip.solution
        ) {
          throw new Error(
            `Clip ${
              index + 1
            } is missing required fields. Required: startTime, endTime, transcript, tactic, justification, confidence, solution`
          );
        }

        // Validate time format (HH:MM:SS.ss or HH:MM:SS)
        const timeRegex = /^\d{2}:\d{2}:\d{2}(\.\d{2})?$/;
        if (!timeRegex.test(clip.startTime) || !timeRegex.test(clip.endTime)) {
          throw new Error(
            `Clip ${
              index + 1
            } has invalid time format. Expected: HH:MM:SS.ss or HH:MM:SS`
          );
        }

        // Validate tactic is one of the allowed values
        if (!validTactics.includes(clip.tactic)) {
          throw new Error(
            `Clip ${index + 1} has invalid tactic. Allowed: ${validTactics.join(
              ", "
            )}`
          );
        }

        // Validate confidence is a number between 0-100
        if (
          typeof clip.confidence !== "number" ||
          clip.confidence < 0 ||
          clip.confidence > 100
        ) {
          throw new Error(
            `Clip ${
              index + 1
            } has invalid confidence. Must be a number between 0-100`
          );
        }

        // Validate all fields are strings (except confidence)
        if (
          typeof clip.transcript !== "string" ||
          typeof clip.justification !== "string" ||
          typeof clip.solution !== "string"
        ) {
          throw new Error(
            `Clip ${
              index + 1
            } has invalid field types. transcript, justification, and solution must be strings`
          );
        }

        return {
          startTime: clip.startTime,
          endTime: clip.endTime,
          transcript: clip.transcript,
          tactic: clip.tactic,
          justification: clip.justification,
          confidence: clip.confidence,
          solution: clip.solution,
        };
      }
    );

    // Return validated data with proper structure
    return {
      isValid: true,
      validatedData: {
        clips: validatedClips,
      },
    };
  } catch (error) {
    return {
      isValid: false,
      error:
        error instanceof Error ? error.message : "Unknown validation error",
    };
  }
};

// Update conversation with analysis results
export const updateConversationAnalysis = async (
  conversationId: string,
  analysisData: {
    overallManipulationScore?: number;
    twelveLabsIndexId?: string;
    twelveLabsVideoId?: string;
    clips?: any; // JSONB data for analysis results
    summary?: string;
    mediatorPerspective?: string;
  }
) => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  const updateData: any = {};

  if (analysisData.overallManipulationScore !== undefined) {
    updateData.overall_manipulation_score =
      analysisData.overallManipulationScore;
  }
  if (analysisData.twelveLabsIndexId !== undefined) {
    updateData.twelve_labs_index_id = analysisData.twelveLabsIndexId;
  }
  if (analysisData.twelveLabsVideoId !== undefined) {
    updateData.twelve_labs_video_id = analysisData.twelveLabsVideoId;
  }
  if (analysisData.clips !== undefined) {
    // Validate the clips data before inserting
    const validation = validateAnalysisData(analysisData.clips);

    if (!validation.isValid) {
      console.error("❌ Analysis data validation failed:", validation.error);
      throw new Error(`Analysis data validation failed: ${validation.error}`);
    }

    console.log("✅ Analysis data validation passed");
    updateData.clips = validation.validatedData;
  }
  if (analysisData.summary !== undefined) {
    updateData.summary = analysisData.summary;
  }
  if (analysisData.mediatorPerspective !== undefined) {
    updateData.mediator_perspective = analysisData.mediatorPerspective;
  }

  const { data, error } = await supabase
    .from("conversations")
    .update(updateData)
    .eq("id", conversationId)
    .eq("user_id", user.id) // Only update if user owns it
    .select()
    .single();

  if (error) {
    console.error("❌ Error updating conversation:", error);
    throw error;
  }

  return data;
};

// Process video with TwelveLabs backend server (no CORS issues)
export const processVideoWithBackend = async (
  conversationId: string,
  filePath: string,
  progressCallback?: (stage: string, progress: number, message?: string) => void
) => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  try {
    // Get signed URL for the video file
    const signedUrl = await getFileUrl(filePath);
    console.log("🔗 Got signed URL for video processing");

    // Call backend API to process video
    const backendUrl =
      "https://gaslytics-backend-production.up.railway.app/api/process-video";

    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ videoUrl: signedUrl }),
    });

    if (!response.ok) {
      throw new Error(`Backend processing failed: ${response.status}`);
    }

    // Handle Server-Sent Events for progress with enhanced logging
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("Failed to get response reader");
    }

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            const data = JSON.parse(line.slice(6));

            if (data.type === "connected") {
              console.log("🔗 Connected to backend processing server");
            } else if (data.type === "progress") {
              console.log(
                `📊 Backend progress: ${data.progress}% - ${data.stage}`
              );
              if (data.message) {
                console.log(`💬 ${data.message}`);
              }
              progressCallback?.(data.stage, data.progress, data.message);
            } else if (data.type === "log") {
              console.log(`📋 Backend log [${data.level}]: ${data.message}`);
            } else if (data.type === "complete") {
              // Processing complete, update database with results
              const result = data.result;

              if (result.success) {
                console.log("✅ Backend processing completed successfully");
                await updateConversationAnalysis(conversationId, {
                  twelveLabsVideoId: result.videoId,
                  twelveLabsIndexId: result.indexId,
                  clips: result.analysisResult,
                  summary: result.analysisResult.summary,
                  mediatorPerspective:
                    result.analysisResult.mediatorPerspective,
                });

                progressCallback?.(
                  "Complete",
                  100,
                  "Analysis saved to database"
                );
                return { success: true, analysisResult: result.analysisResult };
              } else {
                throw new Error(result.error || "Processing failed");
              }
            } else if (data.type === "error") {
              throw new Error(data.error);
            }
          } catch (parseError) {
            console.warn("Failed to parse SSE data:", line);
          }
        }
      }
    }
  } catch (error) {
    console.error("❌ Error processing video:", error);
    throw error;
  }
};
