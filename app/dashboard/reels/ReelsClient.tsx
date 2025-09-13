"use client";
import { UploadButton } from "@/lib/uploadthing";

export default function ReelsClient({ reels }: { reels: any[] }) {
  return (
    <main className="flex flex-col items-center min-h-screen pb-10">
      <div className="flex w-full items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Reels</h1>
        {reels.length > 0 && <UploadVideoButton />}
      </div>
      {reels.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-gray-400 mb-4">Aucun reel pour l&apos;instant.</p>
          <UploadVideoButton />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl">
          {reels.map(reel => (
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

function UploadVideoButton() {
  return (
    <UploadButton
      endpoint="reelUploader"
      onClientUploadComplete={() => {
        alert("Vidéo envoyée !");
        window.location.reload();
      }}
      onUploadError={error => {
        alert(`Erreur lors de l'upload: ${error.message}`);
      }}
      appearance={{
        button: ({ isUploading }) =>
          `px-4 py-2 rounded ${isUploading ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'} text-white font-semibold`
      }}
    />
  );
}
