"use client";

import { useState, useEffect, useRef } from "react";
import { LogOut, Check, Sparkles, Upload, Loader2, User, Trash2, LayoutGrid } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { getProfile, updateProfile } from "@/lib/supabase/profiles";
import { uploadImage, listProfileImages, deleteImage } from "@/lib/supabase/storage";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface UploadedPhoto {
  id: string;
  url: string;
  createdAt: Date;
}

export default function ProfilePage() {
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState<string | null>(null);
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [photoPendingDelete, setPhotoPendingDelete] = useState<UploadedPhoto | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingPhoto, setDeletingPhoto] = useState(false);
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadPhotos();
    }
  }, [user]);

  const loadPhotos = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const [storedImages, profile] = await Promise.all([
        listProfileImages(user.id),
        getProfile(user.id),
      ]);

      const sortedPhotos = storedImages
        .map((image) => ({
          id: image.path,
          url: image.url,
          createdAt: image.createdAt,
        }))
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      setPhotos(sortedPhotos);

      const fallbackPhoto = sortedPhotos[0]?.url || null;

      if (profile?.avatarUrl) {
        setCurrentAvatarUrl(profile.avatarUrl);
        setSelectedPhotoUrl(profile.avatarUrl);
      } else if (fallbackPhoto) {
        setCurrentAvatarUrl(fallbackPhoto);
        setSelectedPhotoUrl(fallbackPhoto);
      }
    } catch (err) {
      console.error("Error loading photos:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSetAsProfilePic = async () => {
    if (!user || !selectedPhotoUrl || selectedPhotoUrl === currentAvatarUrl) return;

    try {
      setSaving(true);
      await updateProfile(user.id, { avatarUrl: selectedPhotoUrl });
      setCurrentAvatarUrl(selectedPhotoUrl);
      toast.success("Profile picture updated!");
    } catch (err) {
      console.error("Error updating profile picture:", err);
      toast.error("Failed to update profile picture", {
        description: "Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleUploadNew = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);

    // Read file as base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64Data = reader.result as string;

        // Upload to storage
        const filename = `profile-${Date.now()}.jpg`;
        const url = await uploadImage(user.id, base64Data, filename);

        // Add to photos list
        const newPhoto: UploadedPhoto = {
          id: `new-${Date.now()}`,
          url,
          createdAt: new Date(),
        };
        setPhotos((prev) => [newPhoto, ...prev]);
        setSelectedPhotoUrl(url);
        toast.success("Photo uploaded!");
      } catch (err) {
        console.error("Error uploading photo:", err);
        toast.error("Failed to upload photo", {
          description: "Please try again.",
        });
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateFromPhoto = () => {
    if (!selectedPhotoUrl) return;

    // Store the selected photo URL in sessionStorage so the visualize page can use it
    sessionStorage.setItem("preselectedImage", selectedPhotoUrl);
    router.push("/visualize");
  };

  const openDeleteDialog = (photo: UploadedPhoto) => {
    setPhotoPendingDelete(photo);
    setDeleteDialogOpen(true);
  };

  const handleDeletePhoto = async () => {
    if (!user || !photoPendingDelete) return;

    try {
      setDeletingPhoto(true);
      await deleteImage(photoPendingDelete.url);

      const updatedPhotos = photos.filter((p) => p.url !== photoPendingDelete.url);
      setPhotos(updatedPhotos);

      if (selectedPhotoUrl === photoPendingDelete.url) {
        const nextSelection = updatedPhotos[0]?.url || null;
        setSelectedPhotoUrl(nextSelection);
      }

      if (currentAvatarUrl === photoPendingDelete.url) {
        const nextAvatar = updatedPhotos[0]?.url || null;
        await updateProfile(user.id, { avatarUrl: nextAvatar || null });
        setCurrentAvatarUrl(nextAvatar);
      }

      toast.success("Photo deleted");
    } catch (err) {
      console.error("Error deleting photo:", err);
      toast.error("Failed to delete photo", {
        description: "Please try again.",
      });
    } finally {
      setDeletingPhoto(false);
      setDeleteDialogOpen(false);
      setPhotoPendingDelete(null);
    }
  };

  // Show loading state while checking auth
  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dreamr-gradient">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-dreamr-button mx-auto mb-4 animate-pulse" />
          <p className="text-dreamr-text font-sans">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!user) return null;

  return (
    <main className="relative min-h-screen overflow-hidden bg-dreamr-gradient">
      {/* Decorative background elements */}
      <div className="fixed top-[-20%] right-[-10%] w-[600px] h-[600px] bg-dreamr-glow-1 rounded-full pointer-events-none" />
      <div className="fixed bottom-[-30%] left-[-15%] w-[800px] h-[800px] bg-dreamr-glow-2 rounded-full pointer-events-none" />

      {/* Navigation Header */}
      <header className="fixed inset-x-0 top-0 z-40 border-b border-[#E8D5C4]/70 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
          <Link
            href="/"
            className="font-serif text-lg sm:text-xl uppercase tracking-[0.3em] text-[#B89B7A]"
          >
            Dreamr
          </Link>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-base">
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 text-[#3D3225] font-medium"
            >
              <User className="h-5 w-5" />
              Your Photos
            </Link>
            <Link
              href="/board"
              className="inline-flex items-center gap-2 text-[#7A6B5A] transition hover:text-[#3D3225]"
            >
              <LayoutGrid className="h-5 w-5" />
              Vision Board
            </Link>
            <button
              onClick={signOut}
              className="inline-flex items-center gap-2 text-[#7A6B5A] transition hover:text-[#3D3225]"
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </button>
          </nav>
          {/* Mobile Navigation */}
          <nav className="flex md:hidden items-center gap-3">
            <Link
              href="/profile"
              className="p-2 text-[#3D3225]"
              aria-label="Your Photos"
            >
              <User className="h-6 w-6" />
            </Link>
            <Link
              href="/board"
              className="p-2 text-[#7A6B5A] hover:text-[#3D3225] transition"
              aria-label="Vision Board"
            >
              <LayoutGrid className="h-6 w-6" />
            </Link>
            <button
              onClick={signOut}
              className="p-2 text-[#7A6B5A] hover:text-[#3D3225] transition"
              aria-label="Sign Out"
            >
              <LogOut className="h-6 w-6" />
            </button>
          </nav>
        </div>
      </header>

      <div className="relative z-10 px-4 sm:px-5 py-8 sm:py-10 pt-20 sm:pt-24">
        {/* Page Title */}
        <div className="max-w-4xl mx-auto mb-8 sm:mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-light text-dreamr-text-dark mb-3 sm:mb-4">
            Your Photos
          </h1>
          <p className="text-base sm:text-lg text-dreamr-text font-light">
            Manage your uploaded photos and profile picture
          </p>
        </div>

        {/* Upload New Photo */}
        <div className="max-w-4xl mx-auto mb-8">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleUploadNew}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full bg-dreamr-bg-card backdrop-blur-sm rounded-2xl p-6 shadow-dreamr-sm hover:shadow-dreamr-gold transition-all border-2 border-dashed border-dreamr-gold/30 hover:border-dreamr-gold flex items-center justify-center gap-3 text-dreamr-text font-sans disabled:opacity-50"
          >
            {uploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Upload New Photo
              </>
            )}
          </button>
        </div>

        {/* Photos Grid */}
        {photos.length === 0 ? (
          <div className="max-w-4xl mx-auto text-center py-20">
            <div className="text-6xl mb-6">📸</div>
            <h2 className="text-2xl text-dreamr-text-dark font-light mb-4">
              No photos yet
            </h2>
            <p className="text-dreamr-text mb-8">
              Upload a photo or create a manifestation to get started
            </p>
            <Link
              href="/visualize"
              className="inline-block bg-dreamr-button text-white px-12 py-4 text-sm font-sans tracking-[2px] uppercase rounded-full shadow-dreamr-gold hover:shadow-dreamr-gold-lg hover:translate-y-[-2px] transition-all"
            >
              Create a New You
            </Link>
          </div>
        ) : (
          <>
            <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => setSelectedPhotoUrl(photo.url)}
                  className={`relative aspect-square rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${selectedPhotoUrl === photo.url
                    ? "ring-4 ring-dreamr-gold scale-[1.02] shadow-dreamr-gold"
                    : "shadow-dreamr-sm hover:shadow-dreamr-gold hover:scale-[1.02]"
                    }`}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${photo.url})` }}
                  />
                  <button
                    aria-label="Delete photo"
                    onClick={(event) => {
                      event.stopPropagation();
                      openDeleteDialog(photo);
                    }}
                    className="absolute top-2 left-2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center shadow-lg backdrop-blur-sm hover:bg-black/70 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  {selectedPhotoUrl === photo.url && (
                    <div className="absolute top-2 right-2 w-8 h-8 bg-dreamr-gold rounded-full flex items-center justify-center shadow-lg">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  )}
                  {currentAvatarUrl === photo.url && (
                    <div className="absolute bottom-2 left-2 bg-white/90 px-2 py-1 rounded-full text-xs font-sans text-dreamr-text">
                      Current
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            {selectedPhotoUrl && (
              <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleSetAsProfilePic}
                  disabled={saving || selectedPhotoUrl === currentAvatarUrl}
                  className="bg-dreamr-bg-card backdrop-blur-sm text-dreamr-text border border-dreamr-gold/30 px-8 py-4 text-sm font-sans tracking-[2px] uppercase rounded-full shadow-dreamr-sm hover:shadow-dreamr-gold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <User className="w-4 h-4" />
                      Set as Profile Picture
                    </>
                  )}
                </button>
                <button
                  onClick={handleGenerateFromPhoto}
                  className="bg-dreamr-button text-white px-8 py-4 text-sm font-sans tracking-[2px] uppercase rounded-full shadow-dreamr-gold hover:shadow-dreamr-gold-lg hover:translate-y-[-2px] transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Create a New You
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open && !deletingPhoto) {
            setPhotoPendingDelete(null);
          }
        }}
      >
        <AlertDialogContent className="bg-white/90 text-dreamr-text-dark border-none">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this photo?</AlertDialogTitle>
            <AlertDialogDescription>
              This photo will be permanently removed from storage. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {photoPendingDelete && (
            <div className="overflow-hidden rounded-2xl border border-dreamr-gold/20">
              <div
                className="h-48 w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${photoPendingDelete.url})` }}
              />
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletingPhoto}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePhoto}
              disabled={deletingPhoto}
              className="bg-[#D97706] hover:bg-[#b35f05]"
            >
              {deletingPhoto ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Photo
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
