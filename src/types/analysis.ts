export interface Clip {
  startTime: string;
  endTime: string;
  transcript: string;
  tactic: string;
  justification: string;
  confidence: number;
  solution: string;
}

export interface Analysis {
  clips: Clip[];
  summary?: string;
  mediatorPerspective?: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  created_at: string;
  video_url: string;
  analysis: Analysis | null;
  processing_status: "pending" | "processing" | "complete" | "failed";
}
