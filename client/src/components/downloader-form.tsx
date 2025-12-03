import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Download, Link2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const formSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL" }).min(1, "URL is required"),
});

interface DownloaderFormProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

export function DownloaderForm({ onSubmit, isLoading }: DownloaderFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  });

  function handleSubmit(values: z.infer<typeof formSchema>) {
    onSubmit(values.url);
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="relative flex flex-col sm:flex-row gap-3">
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                      <Link2 className="w-5 h-5" />
                    </div>
                    <Input
                      placeholder="Paste video URL here (TikTok, IG, YouTube...)"
                      className="pl-11 h-14 text-lg bg-background/50 border-white/10 focus:border-primary/50 backdrop-blur-md shadow-inner rounded-xl transition-all"
                      {...field}
                      disabled={isLoading}
                    />
                  </div>
                </FormControl>
                <FormMessage className="absolute -bottom-6 left-2 text-red-400" />
              </FormItem>
            )}
          />
          <Button 
            type="submit" 
            size="lg" 
            className="h-14 px-8 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all hover:scale-105 active:scale-95"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Download className="w-5 h-5 mr-2" />
                Download
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
