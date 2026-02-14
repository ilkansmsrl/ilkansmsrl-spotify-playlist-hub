'use client';

import { useSession, signIn } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

interface SavePlaylistButtonProps {
  spotifyId: string;
  name: string;
  description?: string;
  imageUrl?: string;
  ownerName?: string;
  totalTracks?: number;
  spotifyUrl?: string;
  category?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function SavePlaylistButton({
  spotifyId,
  name,
  description,
  imageUrl,
  ownerName,
  totalTracks,
  spotifyUrl,
  category,
  size = 'md',
}: SavePlaylistButtonProps) {
  const { data: session } = useSession();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!session?.user?.id) return;

    fetch(`/api/save-playlist?spotifyId=${spotifyId}`)
      .then((res) => res.json())
      .then((data) => setSaved(data.saved || false));
  }, [session, spotifyId]);

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session?.user) {
      signIn('spotify');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/save-playlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spotifyId,
          name,
          description,
          imageUrl,
          ownerName,
          totalTracks,
          spotifyUrl,
          category,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSaved(data.action === 'saved');
      }
    } finally {
      setLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'w-7 h-7 p-1',
    md: 'w-9 h-9 p-1.5',
    lg: 'w-11 h-11 p-2',
  };

  return (
    <button
      onClick={handleSave}
      disabled={loading}
      className={`${sizeClasses[size]} rounded-full transition-all duration-200 flex items-center justify-center
        ${
          saved
            ? 'text-spotify-green hover:text-red-400'
            : 'text-spotify-lighter-gray hover:text-spotify-green'
        }
        ${loading ? 'opacity-50 cursor-wait' : 'hover:scale-110'}
      `}
      title={saved ? 'Kayıttan kaldır' : 'Kaydet'}
    >
      <Heart className={`w-full h-full ${saved ? 'fill-current' : ''}`} />
    </button>
  );
}
