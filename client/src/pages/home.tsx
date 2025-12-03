import { useState } from "react";
import { DownloaderForm } from "@/components/downloader-form";
import { DownloadResult } from "@/components/download-result";
import { useDownload, DownloadResponse } from "@/lib/api";
import { motion } from "framer-motion";
import { Download, Share2, Zap, Shield, Globe, Music, Video } from "lucide-react";
import generatedImage from '@assets/generated_images/dark_abstract_cybernetic_background_with_glowing_lines.png';

export default function Home() {
  const [result, setResult] = useState<DownloadResponse | null>(null);
  const { mutate: download, isPending } = useDownload();

  const handleDownload = (url: string) => {
    setResult(null);
    download(url, {
      onSuccess: (data) => {
        setResult(data);
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      
      {/* Navbar */}
      <header className="border-b border-white/5 bg-background/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)]">
              <Download className="text-white w-5 h-5" />
            </div>
            <span className="font-heading font-bold text-xl tracking-tight">AIODownloader</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#supported" className="hover:text-primary transition-colors">Supported Sites</a>
            <a href="#faq" className="hover:text-primary transition-colors">FAQ</a>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
           {/* Background Image */}
           <div className="absolute inset-0 z-0 opacity-40">
                <img src={generatedImage} alt="Background" className="w-full h-full object-cover" />
           </div>
           <div className="absolute inset-0 z-0 bg-gradient-to-b from-background/0 via-background/50 to-background"></div>

          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                Download Videos from <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-gradient-x">
                  Any Platform
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
                The ultimate all-in-one video downloader. Save videos from TikTok, Instagram, Facebook, YouTube, Twitter, and more in high quality without watermarks.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <DownloaderForm onSubmit={handleDownload} isLoading={isPending} />
            </motion.div>

            {result && <DownloadResult data={result} />}
          </div>
        </section>

        {/* Supported Platforms */}
        <section id="supported" className="py-20 border-t border-white/5 bg-black/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Supported Platforms</h2>
              <p className="text-muted-foreground">We support downloading from all major social media platforms.</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { name: "TikTok", icon: Video, color: "text-pink-500" },
                { name: "Instagram", icon: Share2, color: "text-purple-500" },
                { name: "YouTube", icon: Video, color: "text-red-500" },
                { name: "Facebook", icon: Globe, color: "text-blue-500" },
                { name: "Twitter / X", icon: Share2, color: "text-white" },
                { name: "Spotify", icon: Music, color: "text-green-500" },
                { name: "Pinterest", icon: Share2, color: "text-red-600" },
                { name: "Threads", icon: Share2, color: "text-white" },
              ].map((platform, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -5 }}
                  className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all cursor-default"
                >
                  <div className={`w-12 h-12 rounded-full bg-white/5 flex items-center justify-center ${platform.color}`}>
                    <platform.icon className="w-6 h-6" />
                  </div>
                  <span className="font-medium text-lg">{platform.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features / SEO Text */}
        <section id="features" className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/5">
                <Zap className="w-10 h-10 text-yellow-400 mb-6" />
                <h3 className="text-xl font-bold mb-3">Lightning Fast</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our advanced servers process your request instantly. Get your download links in seconds, no matter the file size or platform.
                </p>
              </div>
              <div className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/5">
                <Shield className="w-10 h-10 text-green-400 mb-6" />
                <h3 className="text-xl font-bold mb-3">Secure & Safe</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We don't store any of your downloaded files or personal data. Your privacy is our top priority. No registration required.
                </p>
              </div>
              <div className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/5">
                <Globe className="w-10 h-10 text-blue-400 mb-6" />
                <h3 className="text-xl font-bold mb-3">Universal Support</h3>
                <p className="text-muted-foreground leading-relaxed">
                  One tool for everything. Whether it's a TikTok video without watermark or a YouTube MP3, we handle it all seamlessly.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section for SEO */}
        <section id="faq" className="py-20 border-t border-white/5 bg-black/20">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-primary">Is this downloader free?</h3>
                <p className="text-muted-foreground">Yes, AIODownloader is 100% free to use. You can download as many videos as you like without any hidden costs.</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-primary">How to download videos from TikTok without watermark?</h3>
                <p className="text-muted-foreground">Simply paste the TikTok video link into the input box above and click Download. Our system automatically detects and provides a watermark-free version.</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-primary">Does it work on mobile?</h3>
                <p className="text-muted-foreground">Absolutely! Our website is fully responsive and works perfectly on iPhone, Android, tablets, and desktop computers.</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-primary">Where are files saved?</h3>
                <p className="text-muted-foreground">Files are saved to your device's default download folder. On mobile, you can find them in your Gallery or Files app.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 border-t border-white/5 text-center text-muted-foreground text-sm">
        <div className="container mx-auto px-4">
          <p>&copy; {new Date().getFullYear()} AIODownloader. All rights reserved.</p>
          <p className="mt-2 opacity-50">Not affiliated with TikTok, Instagram, Facebook, or YouTube.</p>
        </div>
      </footer>
    </div>
  );
}
