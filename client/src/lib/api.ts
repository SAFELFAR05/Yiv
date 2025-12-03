import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

// Define a flexible schema for the API response since we don't have strict docs
// We'll try to adapt to common downloader API patterns
export interface DownloadResponse {
  title?: string;
  thumbnail?: string;
  duration?: string;
  author?: string;
  medias?: Array<{
    url: string;
    quality?: string;
    extension?: string;
    size?: number;
    formattedSize?: string;
    videoAvailable?: boolean;
    audioAvailable?: boolean;
  }>;
  url?: Array<{
      url: string;
      ext: string;
      quality?: string;
  }> | string; // Some APIs return direct url or array
  // specific fields that might appear
  hd?: string;
  sd?: string;
  audio?: string;
}

export async function fetchDownload(videoUrl: string): Promise<DownloadResponse> {
  const apiKey = "key-elfs";
  const apiUrl = `https://api.ferdev.my.id/downloader/allinone?link=${encodeURIComponent(videoUrl)}&apikey=${apiKey}`;

  const res = await fetch(apiUrl);
  
  if (!res.ok) {
    throw new Error("Failed to fetch download links. Please check the URL and try again.");
  }

  const data = await res.json();
  
  // Simple normalization to handle different API response structures
  // If the API returns the result directly or wrapped in 'data' or 'result'
  const result = data.data || data.result || data;

  if (!result) {
    throw new Error("No data found for this link.");
  }

  return result;
}

export function useDownload() {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: fetchDownload,
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
