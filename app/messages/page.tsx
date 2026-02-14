'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Send, ArrowLeft, User, MessageCircle } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  read: boolean;
  createdAt: string;
  sender: { id: string; name: string | null; image: string | null };
  receiver: { id: string; name: string | null; image: string | null };
}

interface Conversation {
  user: { id: string; name: string | null; image: string | null };
  lastMessage: Message;
  unreadCount: number;
}

function MessagesContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const withUserId = searchParams.get('with');

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatUser, setChatUser] = useState<{ id: string; name: string | null; image: string | null } | null>(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sohbet listesi
  useEffect(() => {
    if (!session?.user?.id) return;

    if (!withUserId) {
      fetch('/api/messages')
        .then((res) => res.json())
        .then((data) => setConversations(data.data || []))
        .finally(() => setLoading(false));
    }
  }, [session, withUserId]);

  // Mesajlar
  useEffect(() => {
    if (!session?.user?.id || !withUserId) return;

    setLoading(true);
    fetch(`/api/messages?with=${withUserId}`)
      .then((res) => res.json())
      .then((data) => {
        setMessages(data.data || []);
        if (data.data?.length > 0) {
          const msg = data.data[0];
          setChatUser(
            msg.senderId === session.user.id ? msg.receiver : msg.sender
          );
        } else {
          // Kullanıcı bilgisini al
          fetch(`/api/users/${withUserId}`)
            .then((res) => res.json())
            .then((d) => {
              if (d.success) {
                setChatUser({
                  id: d.data.id,
                  name: d.data.name,
                  image: d.data.image,
                });
              }
            });
        }
      })
      .finally(() => setLoading(false));

    // Mesajları her 5 saniyede yenile
    const interval = setInterval(() => {
      fetch(`/api/messages?with=${withUserId}`)
        .then((res) => res.json())
        .then((data) => setMessages(data.data || []));
    }, 5000);

    return () => clearInterval(interval);
  }, [session, withUserId]);

  // Yeni mesajda aşağı kaydır
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !withUserId) return;

    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ receiverId: withUserId, content: newMessage }),
    });

    const data = await res.json();
    if (data.success) {
      setMessages((prev) => [...prev, data.data]);
      setNewMessage('');
    }
  };

  if (!session?.user) {
    return (
      <div className="text-center py-20">
        <MessageCircle className="w-16 h-16 text-spotify-lighter-gray mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Mesajlar</h1>
        <p className="text-spotify-lighter-gray">
          Mesajlarınızı görmek için giriş yapın.
        </p>
      </div>
    );
  }

  // Mesaj detay görünümü
  if (withUserId) {
    return (
      <div className="max-w-3xl mx-auto">
        {/* Başlık */}
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
          <Link
            href="/messages"
            className="text-spotify-lighter-gray hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          {chatUser && (
            <Link href={`/profile/${chatUser.id}`} className="flex items-center gap-3 hover:opacity-80">
              {chatUser.image ? (
                <Image src={chatUser.image} alt={chatUser.name || ''} width={40} height={40} className="rounded-full" unoptimized />
              ) : (
                <div className="w-10 h-10 rounded-full bg-spotify-light-gray flex items-center justify-center">
                  <User className="w-5 h-5 text-spotify-lighter-gray" />
                </div>
              )}
              <span className="font-semibold">{chatUser.name || 'Kullanıcı'}</span>
            </Link>
          )}
        </div>

        {/* Mesajlar */}
        <div className="h-[60vh] overflow-y-auto space-y-3 mb-4 pr-2">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-spotify-green border-t-transparent rounded-full animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-20">
              <MessageCircle className="w-12 h-12 text-spotify-lighter-gray mx-auto mb-3" />
              <p className="text-spotify-lighter-gray">
                Henüz mesaj yok. İlk mesajı gönder!
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMine = msg.senderId === session.user.id;
              return (
                <div
                  key={msg.id}
                  className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                      isMine
                        ? 'bg-spotify-green text-black rounded-br-sm'
                        : 'bg-spotify-light-gray text-white rounded-bl-sm'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p
                      className={`text-[10px] mt-1 ${
                        isMine ? 'text-black/50' : 'text-spotify-lighter-gray'
                      }`}
                    >
                      {new Date(msg.createdAt).toLocaleTimeString('tr-TR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Mesaj Gönder */}
        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Mesajınızı yazın..."
            className="flex-1 bg-spotify-light-gray text-white px-4 py-3 rounded-full
              focus:outline-none focus:ring-2 focus:ring-spotify-green placeholder:text-gray-500"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-spotify-green text-black p-3 rounded-full hover:bg-spotify-green-dark
              transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    );
  }

  // Sohbet listesi
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <MessageCircle className="w-7 h-7 text-spotify-green" />
        Mesajlarım
      </h1>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-spotify-medium-gray rounded-xl p-4 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-spotify-light-gray" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-spotify-light-gray rounded w-1/3" />
                  <div className="h-3 bg-spotify-light-gray rounded w-2/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : conversations.length === 0 ? (
        <div className="text-center py-16">
          <MessageCircle className="w-16 h-16 text-spotify-lighter-gray mx-auto mb-4" />
          <p className="text-spotify-lighter-gray text-lg mb-4">
            Henüz mesajınız yok
          </p>
          <Link href="/discover" className="btn-spotify">
            Kişileri Keşfet
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {conversations.map((conv) => (
            <Link
              key={conv.user.id}
              href={`/messages?with=${conv.user.id}`}
              className="flex items-center gap-4 bg-spotify-medium-gray hover:bg-spotify-light-gray
                rounded-xl p-4 transition-colors"
            >
              {conv.user.image ? (
                <Image
                  src={conv.user.image}
                  alt={conv.user.name || ''}
                  width={48}
                  height={48}
                  className="rounded-full"
                  unoptimized
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-spotify-light-gray flex items-center justify-center">
                  <User className="w-6 h-6 text-spotify-lighter-gray" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold truncate">
                    {conv.user.name || 'Kullanıcı'}
                  </h3>
                  <span className="text-xs text-spotify-lighter-gray flex-shrink-0">
                    {new Date(conv.lastMessage.createdAt).toLocaleDateString('tr-TR')}
                  </span>
                </div>
                <p className="text-sm text-spotify-lighter-gray truncate">
                  {conv.lastMessage.senderId === session.user.id && (
                    <span className="text-spotify-green">Sen: </span>
                  )}
                  {conv.lastMessage.content}
                </p>
              </div>
              {conv.unreadCount > 0 && (
                <span className="bg-spotify-green text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">
                  {conv.unreadCount}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-spotify-green border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <MessagesContent />
    </Suspense>
  );
}
