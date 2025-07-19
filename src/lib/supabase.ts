import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('🔧 Supabase config:', { 
  url: supabaseUrl ? 'Set' : 'Missing', 
  key: supabaseAnonKey ? 'Set' : 'Missing' 
});

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test connection
export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('conversations').select('count');
    if (error) throw error;
    console.log('✅ Supabase connection successful');
    return true;
  } catch (err) {
    console.error('❌ Supabase connection failed:', err);
    return false;
  }
};

// Get current user
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error('❌ Error getting user:', error);
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
  
  console.log('👤 Creating demo user with email:', demoEmail);
  
  const { data, error } = await supabase.auth.signUp({
    email: demoEmail,
    password: demoPassword,
    options: {
      emailRedirectTo: undefined // Skip email confirmation for demo
    }
  });

  if (error) {
    console.error('❌ Demo user creation failed:', error);
    throw error;
  }

  console.log('✅ Demo user created:', data.user?.id);
  return data.user;
};

// Upload video file to Supabase Storage with user isolation
export const uploadVideoFile = async (file: File) => {
  console.log('📤 Starting file upload to Supabase Storage');
  
  // Get current user or create demo user
  let user = await getCurrentUser();
  if (!user) {
    console.log('👤 No user found, creating demo user...');
    user = await createDemoUser();
  }

  if (!user) {
    throw new Error('Unable to authenticate user');
  }

  console.log('👤 User ID:', user.id);
  
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  // Use user ID as folder name for isolation
  const filePath = `${user.id}/${fileName}`;

  console.log('📁 Upload details:', { fileName, filePath, fileSize: file.size, userId: user.id });

  const { data, error } = await supabase.storage
    .from('conversation-videos')
    .upload(filePath, file);

  if (error) {
    console.error('❌ Storage upload error:', error);
    throw error;
  }

  console.log('✅ File uploaded successfully:', data);
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
  console.log('💾 Creating conversation record with data:', conversationData);

  // Get current user
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  // Only include columns that exist in your table
  const insertData = {
    user_id: user.id,
    file_name: conversationData.fileName,
    file_path: conversationData.filePath,
    relationship_type: conversationData.relationshipType,
    emotional_state: conversationData.emotionalState,
    conversation_tags: conversationData.conversationTags,
    file_size: conversationData.fileSize,
    file_type: conversationData.fileType,
    upload_timestamp: new Date().toISOString(),
    consent_given: true
    // Remove conversation_content and conversation_type for now
  };

  console.log('📋 Insert payload:', insertData);

  const { data, error } = await supabase
    .from('conversations')
    .insert([insertData])
    .select()
    .single();

  if (error) {
    console.error('❌ Database insert error:', error);
    throw error;
  }

  console.log('✅ Conversation created successfully:', data);
  return data;
};

// Get user's conversations only
export const getUserConversations = async () => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Error fetching user conversations:', error);
    throw error;
  }

  return data;
};

// Get conversation by ID (only if user owns it)
export const getConversationById = async (id: string) => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id) // Only get if user owns it
    .single();

  if (error) {
    console.error('❌ Error fetching conversation:', error);
    throw error;
  }

  return data;
};

// Get signed URL for user's file
export const getFileUrl = async (filePath: string) => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  // Verify the file path starts with user's ID for security
  if (!filePath.startsWith(user.id + '/')) {
    throw new Error('Unauthorized file access');
  }

  const { data, error } = await supabase.storage
    .from('conversation-videos')
    .createSignedUrl(filePath, 3600); // 1 hour expiry

  if (error) {
    console.error('❌ Error creating signed URL:', error);
    throw error;
  }

  return data.signedUrl;
};

// Update conversation with analysis results
export const updateConversationAnalysis = async (
  conversationId: string, 
  analysisData: {
    overallManipulationScore?: number;
    twelveLabsIndexId?: string;
    twelveLabsVideoId?: string;
  }
) => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('conversations')
    .update({
      overall_manipulation_score: analysisData.overallManipulationScore,
      twelve_labs_index_id: analysisData.twelveLabsIndexId,
      twelve_labs_video_id: analysisData.twelveLabsVideoId,
    })
    .eq('id', conversationId)
    .eq('user_id', user.id) // Only update if user owns it
    .select()
    .single();

  if (error) {
    console.error('❌ Error updating conversation:', error);
    throw error;
  }

  return data;
};