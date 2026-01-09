import { useState } from "react";
import { DownloadResponse } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Download, 
  FileVideo, 
  Music, 
  Image as ImageIcon,
  Clock, 
  User, 
  FileJson, 
  ChevronDown, 
  ChevronUp, 
  Check,
  Info,
  Hash,
  Eye,
  Heart,
  Share2,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { forceDownloadBlob } from "@/lib/utils";

interface DownloadResultProps {
  data: DownloadResponse;
}

// Helper to format keys into readable labels
const formatLabel = (key: string) => {
  return key
    .replace(/([A-Z])/g, ' $1') // camelCase to Space
    .replace(/_/g, ' ') // snake_case to Space
    .replace(/^\w/, c => c.toUpperCase()); // Capitalize first letter
};

// Helper to detect if value is a URL
const isUrl = (val: string) => {
  return typeof val === 'string' && (val.startsWith('http') || val.startsWith('www'));
};

// Helper to detect media type from extension or URL
const getMediaType = (url: string, ext?: string) => {
  const extension = ext?.toLowerCase() || url.split('.').pop()?.split('?')[0]?.toLowerCase() || '';
  
  if (['mp3', 'm4a', 'wav', 'aac', 'ogg'].includes(extension)) return 'audio';
  if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'heic'].includes(extension)) return 'image';
  if (['mp4', 'webm', 'mkv', 'mov', 'avi', 'flv'].includes(extension)) return 'video';
  
  return 'video'; // Default to video if unknown
};

const getFileIcon = (type: string) => {
  switch (type) {
    case 'audio': return Music;
    case 'image': return ImageIcon;
    case 'video': return FileVideo;
    default: return FileVideo;
  }
};

const getLabel = (type: string, quality?: string, ext?: string) => {
    const extLabel = ext ? `.${ext}` : '';
    const qualLabel = quality ? `${quality}` : '';
    
    switch(type) {
        case 'audio': return `Download Audio ${qualLabel} ${extLabel}`;
        case 'image': return `Download Image ${qualLabel} ${extLabel}`;
        case 'video': return `Download Video ${qualLabel} ${extLabel}`;
        default: return `Download File ${extLabel}`;
    }
}


// Component to render generic key-value pairs nicely
const DetailItem = ({ label, value, icon: Icon }: { label: string, value: any, icon?: any }) => {
  if (!value || (Array.isArray(value) && value.length === 0) || typeof value === 'object') return null;
  
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
      <div className="flex items-center gap-2 text-muted-foreground text-sm">
        {Icon && <Icon className="w-3.5 h-3.5" />}
        <span>{formatLabel(label)}</span>
      </div>
      <div className="font-medium text-sm text-right truncate max-w-[50%]">
        {isUrl(value) ? (
          <a href={value} target="_blank" rel="noreferrer" className="text-primary hover:underline flex items-center gap-1 justify-end">
            Link <Share2 className="w-3 h-3" />
          </a>
        ) : (
          <span>{String(value)}</span>
        )}
      </div>
    </div>
  );
};

export function DownloadResult({ data }: DownloadResultProps) {
  const { title, thumbnail, author, medias, url, duration, ...rest } = data;
  const [showRaw, setShowRaw] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [downloadingIndex, setDownloadingIndex] = useState<number | null>(null);

  // Normalize medias to a common structure
  let downloadLinks: Array<{ url: string; label: string; icon: any; type: string; size?: string }> = [];

  if (medias && Array.isArray(medias)) {
    downloadLinks = medias.map((media) => {
      const type = media.extension === 'mp3' || media.audioAvailable === false ? 'audio' : getMediaType(media.url, media.extension);
      const icon = getFileIcon(type);
      // Use provided extension or try to guess from URL if not provided
      const ext = media.extension || media.url.split('.').pop()?.split('?')[0] || '';
      
      return {
        url: media.url,
        label: media.quality || getLabel(type, undefined, ext),
        size: media.formattedSize || (media.size ? `${(media.size / 1024 / 1024).toFixed(2)} MB` : ''),
        icon: icon,
        type: type
      };
    });
  } else if (Array.isArray(url)) {
      downloadLinks = url.map((item) => {
          const type = getMediaType(item.url, item.ext);
          return {
            url: item.url,
            label: item.quality ? `${item.quality} ${item.ext || ''}` : getLabel(type, undefined, item.ext),
            icon: getFileIcon(type),
            type: type
          }
      });
  } else if (typeof url === 'string') {
      const type = getMediaType(url);
      downloadLinks.push({
          url: url,
          label: getLabel(type),
          icon: getFileIcon(type),
          type: type
      });
  }

  // Deduplicate links based on URL
  downloadLinks = downloadLinks.filter((link, index, self) =>
    index === self.findIndex((t) => (
      t.url === link.url
    ))
  );

  const handleCopy = (link: string, index: number) => {
    navigator.clipboard.writeText(link);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Filter out complex objects for the dynamic details view
  const dynamicDetails = Object.entries(rest).filter(([key, value]) => {
    // Skip internal or complex objects we've already handled or shouldn't show
    if (['status', 'code', 'success', 'message', 'medias', 'url', 'thumbnail', 'title', 'author'].includes(key)) return false;
    if (typeof value === 'object' && value !== null) return false; 
    return true;
  });

  const handleDownload = async (link: { url: string, type: string, label: string }, index: number) => {
    setDownloadingIndex(index);
    const filename = `${title || 'download'}_${link.label}.${link.type === 'audio' ? 'mp3' : 'mp4'}`.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
    await forceDownloadBlob(link.url, filename);
    setDownloadingIndex(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto mt-12 space-y-6"
    >
      <Card className="bg-card/40 backdrop-blur-xl border-white/10 overflow-hidden shadow-2xl shadow-black/40">
        <div className="flex flex-col md:flex-row">
          {/* Thumbnail Section */}
          <div className="w-full md:w-2/5 relative group min-h-[250px]">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent md:bg-gradient-to-r z-10" />
            {thumbnail ? (
              <img 
                src={thumbnail} 
                alt={title || "Video thumbnail"} 
                className="w-full h-full object-cover absolute inset-0 transition-transform duration-700 group-hover:scale-110" 
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center absolute inset-0">
                <FileVideo className="w-16 h-16 text-muted-foreground/30" />
              </div>
            )}
            
            {/* Overlay Info */}
            <div className="absolute bottom-4 left-4 z-20 flex flex-col gap-2">
              {duration && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-xs font-medium text-white border border-white/10">
                  <Clock className="w-3 h-3" />
                  {duration}
                </div>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 p-6 flex flex-col relative z-20">
            <div className="mb-6">
              <h3 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 mb-3 line-clamp-2 leading-tight">
                {title || "Download Ready"}
              </h3>
              
              <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                {author && (
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                    <User className="w-3.5 h-3.5 text-primary" />
                    <span>{author}</span>
                  </div>
                )}
                {/* Dynamically show a few common stats if available in root */}
                {rest.views && <Badge variant="secondary" className="gap-1"><Eye className="w-3 h-3"/> {rest.views}</Badge>}
                {rest.likes && <Badge variant="secondary" className="gap-1"><Heart className="w-3 h-3"/> {rest.likes}</Badge>}
              </div>
            </div>

            <div className="mt-auto space-y-4">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Download className="w-3.5 h-3.5" />
                Download Options
              </h4>
              
              <div className="grid gap-3">
                {downloadLinks.length > 0 ? (
                  downloadLinks.map((link, idx) => (
                    <div key={idx} className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1 justify-between group border-white/10 hover:bg-primary/10 hover:border-primary/50 hover:text-primary transition-all h-12"
                        disabled={downloadingIndex === idx}
                        onClick={() => handleDownload(link, idx)}
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            {downloadingIndex === idx ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <link.icon className="w-4 h-4" />
                            )}
                          </div>
                          <div className="flex flex-col items-start gap-0.5 truncate">
                            <span className="font-medium truncate uppercase">{link.type} • {link.label}</span>
                            {link.size && <span className="text-[10px] opacity-60">{link.size}</span>}
                          </div>
                        </div>
                        {downloadingIndex === idx ? (
                          <Loader2 className="w-4 h-4 animate-spin opacity-50" />
                        ) : (
                          <Download className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                        )}
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-12 w-12 border border-white/10 hover:bg-white/5 hover:text-white"
                        onClick={() => handleCopy(link.url, idx)}
                      >
                        {copiedIndex === idx ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <span className="font-mono text-xs font-bold opacity-50">COPY</span>
                        )}
                      </Button>
                    </div>
                  ))
                ) : (
                   <div className="text-yellow-500 text-sm bg-yellow-500/10 p-3 rounded border border-yellow-500/20">
                     No direct download links found. Check the "Details" below.
                   </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Info Section - Renders any extra data from API */}
        {dynamicDetails.length > 0 && (
          <div className="border-t border-white/5 bg-black/20 p-6">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2 mb-4">
              <Info className="w-3.5 h-3.5" />
              Video Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {dynamicDetails.map(([key, value]) => (
                 <DetailItem key={key} label={key} value={value} icon={Hash} />
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Raw JSON Viewer */}
      <Collapsible open={showRaw} onOpenChange={setShowRaw}>
        <div className="flex items-center justify-center">
           <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-white gap-2">
              <FileJson className="w-3 h-3" />
              {showRaw ? "Hide Raw Data" : "Show Raw Data (JSON)"}
              {showRaw ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </Button>
          </CollapsibleTrigger>
        </div>
       
        <CollapsibleContent>
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4"
          >
            <Card className="bg-black/40 border-white/5 p-4 overflow-hidden">
              <pre className="text-xs text-green-400 font-mono overflow-x-auto p-2">
                {JSON.stringify(data, null, 2)}
              </pre>
            </Card>
          </motion.div>
        </CollapsibleContent>
      </Collapsible>
    </motion.div>
  );
}
