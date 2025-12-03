import { DownloadResponse } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileVideo, Music, Smartphone, Monitor, HardDrive, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

interface DownloadResultProps {
  data: DownloadResponse;
}

export function DownloadResult({ data }: DownloadResultProps) {
  const { title, thumbnail, author, medias, url } = data;

  // Normalize medias to a common structure
  let downloadLinks: Array<{ url: string; label: string; icon: any; type: 'video' | 'audio' }> = [];

  if (medias && Array.isArray(medias)) {
    downloadLinks = medias.map((media, idx) => ({
      url: media.url,
      label: `${media.quality || 'HD'} ${media.extension || ''} ${media.formattedSize ? `(${media.formattedSize})` : ''}`,
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto mt-12"
    >
      <Card className="bg-card/40 backdrop-blur-xl border-white/10 overflow-hidden shadow-2xl shadow-black/40">
        <div className="flex flex-col md:flex-row">
          {/* Thumbnail Section */}
          <div className="w-full md:w-2/5 relative group">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent md:bg-gradient-to-r z-10" />
            {thumbnail ? (
              <img 
                src={thumbnail} 
                alt={title || "Video thumbnail"} 
                className="w-full h-64 md:h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
            ) : (
              <div className="w-full h-64 md:h-full bg-muted flex items-center justify-center">
                <FileVideo className="w-16 h-16 text-muted-foreground/30" />
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="flex-1 p-6 flex flex-col justify-between relative z-20">
            <div>
              <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 mb-2 line-clamp-2">
                {title || "Download Ready"}
              </h3>
              {author && (
                <p className="text-muted-foreground text-sm mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  by {author}
                </p>
              )}
            </div>

            <div className="space-y-3 mt-4">
              <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Available Formats</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {downloadLinks.length > 0 ? (
                  downloadLinks.map((link, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      className="w-full justify-start group border-white/10 hover:bg-primary/10 hover:border-primary/50 hover:text-primary transition-all"
                      asChild
                    >
                      <a href={link.url} target="_blank" rel="noopener noreferrer" download>
                        <link.icon className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                        <span className="truncate">{link.label}</span>
                        <Download className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </Button>
                  ))
                ) : (
                   <div className="text-yellow-500 text-sm">No direct download links found. Try checking the source.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
