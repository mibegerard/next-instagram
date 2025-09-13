"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UploadButton } from "@/lib/uploadthing";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const CreateReel = z.object({
  file: z.instanceof(File, { message: "Veuillez sélectionner une vidéo" }),
  caption: z.string().optional(),
});

type CreateReelType = z.infer<typeof CreateReel>;

export default function ReelsClient({ reels }: { reels: any[] }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm<CreateReelType>({
    resolver: zodResolver(CreateReel),
    defaultValues: {
      caption: "",
      file: undefined,
    },
  });

  const handleFileSelect = (files: File[]) => {
    if (files[0]) {
      setSelectedFile(files[0]);
      setPreviewUrl(URL.createObjectURL(files[0]));
      form.setValue("file", files[0]);
    }
  };

  const handleCreate = async (values: CreateReelType) => {
    if (!selectedFile) return toast.error("Veuillez sélectionner une vidéo.");

    try {
      // L'upload réel est déclenché par UploadButton via onClientUploadComplete
      toast.success("Reel créé avec succès !");
      setIsDialogOpen(false);
      window.location.reload();
    } catch (error: any) {
      console.error(error);
      toast.error(`Erreur: ${error.message}`);
    }
  };

  return (
    <main className="flex flex-col items-center min-h-screen pb-10">
      {/* Header avec bouton Upload flottant à droite */}
      <div className="flex w-full items-center justify-between mb-6 px-4 max-w-5xl">
        <h1 className="text-2xl font-bold">Reels</h1>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-semibold"
        >
          Upload Reel
        </Button>
      </div>

      {/* Dialog pour créer un Reel */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Reel</DialogTitle>
          </DialogHeader>

          <form
            onSubmit={form.handleSubmit(handleCreate)}
            className="flex flex-col gap-4 mt-4"
          >
            {/* UploadButton pour sélectionner le fichier */}
            <UploadButton
              endpoint="reelUploader"
              onClientUploadComplete={(res) => {
                if (res[0]?.url) {
                  toast.success("Upload complet !");
                  setIsDialogOpen(false);
                  window.location.reload();
                }
              }}
              onUploadError={(error: Error) => {
                console.error(error);
                toast.error("Upload échoué");
              }}
              onChange={(files) => handleFileSelect(files)}
              appearance={{
                button: ({ isUploading }) =>
                  `px-4 py-2 rounded ${
                    isUploading ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-600"
                  } text-white font-semibold w-full`,
              }}
            />

            {/* Prévisualisation */}
            {previewUrl && (
              <video
                src={previewUrl}
                controls
                className="w-full h-80 object-cover rounded shadow"
              />
            )}

            {/* Caption */}
            {previewUrl && (
              <Input
                placeholder="Ajouter une caption..."
                {...form.register("caption")}
              />
            )}

            {/* Bouton Create */}
            {previewUrl && (
              <Button type="submit" className="bg-green-500 hover:bg-green-600">
                Create Reel
              </Button>
            )}
          </form>
        </DialogContent>
      </Dialog>

      {/* Liste des reels existants */}
      {reels.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl mt-10 px-4">
          {reels.map((reel) => (
            <div key={reel.id} className="flex flex-col items-center">
              <video
                src={reel.fileUrl}
                controls
                className="w-full h-80 object-cover rounded shadow"
                preload="metadata"
              />
              {reel.caption && (
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-200 text-center w-full truncate">
                  {reel.caption}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
