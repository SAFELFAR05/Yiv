import { useState } from "react";
import { DownloadResponse } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Download, 
  FileVideo, 
  Music, 
  Clock, 
  User, 
  FileJson, 
  ChevronDown, 
  ChevronUp, 
  Check 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface DownloadResultProps {
  data: DownloadResponse;
}

export function DownloadResult({ data }: DownloadResultProps) {
  const { title, thumbnail, author, medias, url, duration } = data;
  const [showRaw, setShowRaw] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Normalize medias to a common structure
  let downloadLinks: Array<{ url: string; label: string; icon: any; type: 'video' | 'audio'; size?: string }> = [];

  if (medias && Array.isArray(medias)) {
    downloadLinks = medias.map((media, idx) => ({
      url: media.url,
      label: `${media.quality || 'HD'} ${media.extension || 'mp4'}`,
      size: media.formattedSize,
      icon: media.audioAvailable === false ? Music : FileVideo, // Heuristic
      type: media.extension === 'mp3' ? 'audio' : 'video'
    }));
  } else if (Array.isArray(url)) {
      downloadLinks = url.map((item, idx) => ({
          url: item.url,
          label: `Download ${item.ext || 'File'} ${item.quality || ''}`,
          icon: FileVideo,
          type: 'video'
      }));
  } else if (typeof url === 'string') {
      downloadLinks.push({
          url: url,
          label: 'Download Video',
          icon: FileVideo,
          type: 'video'
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
              
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {author && (
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                    <User className="w-3.5 h-3.5 text-primary" />
                    <span>{author}</span>
                  </div>
                )}
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
                        asChild
                      >
                        <a href={link.url} target="_blank" rel="noopener noreferrer" download>
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                              <link.icon className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col items-start gap-0.5 truncate">
                              <span className="font-medium truncate">{link.label}</span>
                              {link.size && <span className="text-[10px] opacity-60">{link.size}</span>}
                            </div>
                          </div>
                          <Download className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                        </a>
                      </Button>
                      
                      {/* Copy Link Button */}
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
                     No direct download links found in response.
                   </div>
                )}
              </div>
            </div>
          </div>
        </div>
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
