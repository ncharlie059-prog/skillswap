import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Send,
  Paperclip,
  Search,
  MoreVertical,
  Circle,
  Image,
  FileText,
  Smile,
  Phone,
  Video,
  ArrowLeft,
  Check,
  CheckCheck,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import type { Message, Conversation, Profile } from '../../types';

/* ------------------------------------------------------------------ */
/*  Mock Data                                                          */
/* ------------------------------------------------------------------ */

const MOCK_USERS: Record<string, Profile> = {
  'user-2': {
    id: 'user-2',
    email: 'priya@university.edu',
    full_name: 'Priya Sharma',
    avatar_url: '',
    role: 'freelancer',
    phone: '',
    college: 'IIT Delhi',
    college_id_verified: true,
    is_verified: true,
    is_online: true,
    last_seen: '2026-04-27T10:30:00Z',
    created_at: '',
    updated_at: '',
  },
  'user-3': {
    id: 'user-3',
    email: 'arjun@university.edu',
    full_name: 'Arjun Mehta',
    avatar_url: '',
    role: 'client',
    phone: '',
    college: 'NIT Trichy',
    college_id_verified: true,
    is_verified: true,
    is_online: false,
    last_seen: '2026-04-27T08:15:00Z',
    created_at: '',
    updated_at: '',
  },
  'user-4': {
    id: 'user-4',
    email: 'sneha@university.edu',
    full_name: 'Sneha Kulkarni',
    avatar_url: '',
    role: 'freelancer',
    phone: '',
    college: 'BITS Pilani',
    college_id_verified: true,
    is_verified: false,
    is_online: true,
    last_seen: '2026-04-27T10:28:00Z',
    created_at: '',
    updated_at: '',
  },
  'user-5': {
    id: 'user-5',
    email: 'vikram@university.edu',
    full_name: 'Vikram Desai',
    avatar_url: '',
    role: 'client',
    phone: '',
    college: 'VIT Vellore',
    college_id_verified: false,
    is_verified: true,
    is_online: false,
    last_seen: '2026-04-26T22:45:00Z',
    created_at: '',
    updated_at: '',
  },
  'user-6': {
    id: 'user-6',
    email: 'ananya@university.edu',
    full_name: 'Ananya Reddy',
    avatar_url: '',
    role: 'freelancer',
    phone: '',
    college: 'IIIT Hyderabad',
    college_id_verified: true,
    is_verified: true,
    is_online: true,
    last_seen: '2026-04-27T10:32:00Z',
    created_at: '',
    updated_at: '',
  },
  'user-7': {
    id: 'user-7',
    email: 'rahul@university.edu',
    full_name: 'Rahul Joshi',
    avatar_url: '',
    role: 'client',
    phone: '',
    college: 'DTU',
    college_id_verified: true,
    is_verified: true,
    is_online: false,
    last_seen: '2026-04-27T06:00:00Z',
    created_at: '',
    updated_at: '',
  },
};

const CURRENT_USER_ID = 'user-1';

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    participant_1: CURRENT_USER_ID,
    participant_2: 'user-2',
    last_message: 'I have sent the updated mockups for the landing page!',
    last_message_at: '2026-04-27T10:25:00Z',
    created_at: '2026-04-20T09:00:00Z',
    other_user: MOCK_USERS['user-2'],
    unread_count: 2,
  },
  {
    id: 'conv-2',
    participant_1: CURRENT_USER_ID,
    participant_2: 'user-3',
    last_message: 'Can we discuss the project timeline?',
    last_message_at: '2026-04-27T09:10:00Z',
    created_at: '2026-04-18T14:00:00Z',
    other_user: MOCK_USERS['user-3'],
    unread_count: 0,
  },
  {
    id: 'conv-3',
    participant_1: CURRENT_USER_ID,
    participant_2: 'user-4',
    last_message: 'The logo designs are ready for review',
    last_message_at: '2026-04-27T08:45:00Z',
    created_at: '2026-04-15T11:00:00Z',
    other_user: MOCK_USERS['user-4'],
    unread_count: 1,
  },
  {
    id: 'conv-4',
    participant_1: CURRENT_USER_ID,
    participant_2: 'user-5',
    last_message: 'Payment has been released for the order',
    last_message_at: '2026-04-26T22:30:00Z',
    created_at: '2026-04-10T08:00:00Z',
    other_user: MOCK_USERS['user-5'],
    unread_count: 0,
  },
  {
    id: 'conv-5',
    participant_1: CURRENT_USER_ID,
    participant_2: 'user-6',
    last_message: 'Thanks for the quick turnaround!',
    last_message_at: '2026-04-27T10:30:00Z',
    created_at: '2026-04-22T16:00:00Z',
    other_user: MOCK_USERS['user-6'],
    unread_count: 3,
  },
  {
    id: 'conv-6',
    participant_1: CURRENT_USER_ID,
    participant_2: 'user-7',
    last_message: 'Let me check the API docs and get back to you',
    last_message_at: '2026-04-27T06:00:00Z',
    created_at: '2026-04-12T10:00:00Z',
    other_user: MOCK_USERS['user-7'],
    unread_count: 0,
  },
];

const MOCK_MESSAGES: Record<string, Message[]> = {
  'conv-1': [
    {
      id: 'msg-1-1',
      conversation_id: 'conv-1',
      sender_id: CURRENT_USER_ID,
      content: 'Hey Priya! How is the landing page design coming along?',
      file_url: null,
      is_read: true,
      created_at: '2026-04-27T09:00:00Z',
      sender: undefined,
    },
    {
      id: 'msg-1-2',
      conversation_id: 'conv-1',
      sender_id: 'user-2',
      content: 'It is going great! I have been working on the hero section and the color palette. Should have a draft ready by tonight.',
      file_url: null,
      is_read: true,
      created_at: '2026-04-27T09:05:00Z',
      sender: MOCK_USERS['user-2'],
    },
    {
      id: 'msg-1-3',
      conversation_id: 'conv-1',
      sender_id: CURRENT_USER_ID,
      content: 'Awesome! Can you also prepare a mobile version? We need it to be responsive.',
      file_url: null,
      is_read: true,
      created_at: '2026-04-27T09:10:00Z',
      sender: undefined,
    },
    {
      id: 'msg-1-4',
      conversation_id: 'conv-1',
      sender_id: 'user-2',
      content: 'Of course! I always design mobile-first. Here is a preview of the desktop layout:',
      file_url: 'https://placeholder.com/mockup-desktop.png',
      is_read: true,
      created_at: '2026-04-27T09:30:00Z',
      sender: MOCK_USERS['user-2'],
    },
    {
      id: 'msg-1-5',
      conversation_id: 'conv-1',
      sender_id: CURRENT_USER_ID,
      content: 'This looks amazing! The gradient is perfect. Can we tweak the CTA button color slightly?',
      file_url: null,
      is_read: true,
      created_at: '2026-04-27T10:00:00Z',
      sender: undefined,
    },
    {
      id: 'msg-1-6',
      conversation_id: 'conv-1',
      sender_id: 'user-2',
      content: 'Sure! I will update that. Also attaching the brand guidelines document for reference.',
      file_url: 'brand-guidelines.pdf',
      is_read: true,
      created_at: '2026-04-27T10:15:00Z',
      sender: MOCK_USERS['user-2'],
    },
    {
      id: 'msg-1-7',
      conversation_id: 'conv-1',
      sender_id: 'user-2',
      content: 'I have sent the updated mockups for the landing page!',
      file_url: null,
      is_read: false,
      created_at: '2026-04-27T10:25:00Z',
      sender: MOCK_USERS['user-2'],
    },
  ],
  'conv-2': [
    {
      id: 'msg-2-1',
      conversation_id: 'conv-2',
      sender_id: 'user-3',
      content: 'Hi! I saw your portfolio and I am interested in hiring you for a web app project.',
      file_url: null,
      is_read: true,
      created_at: '2026-04-27T08:00:00Z',
      sender: MOCK_USERS['user-3'],
    },
    {
      id: 'msg-2-2',
      conversation_id: 'conv-2',
      sender_id: CURRENT_USER_ID,
      content: 'Thank you, Arjun! I would love to hear more about the project. What are the requirements?',
      file_url: null,
      is_read: true,
      created_at: '2026-04-27T08:15:00Z',
      sender: undefined,
    },
    {
      id: 'msg-2-3',
      conversation_id: 'conv-2',
      sender_id: 'user-3',
      content: 'We need a student management portal with dashboards, attendance tracking, and grade reports. Timeline is around 4 weeks.',
      file_url: null,
      is_read: true,
      created_at: '2026-04-27T08:30:00Z',
      sender: MOCK_USERS['user-3'],
    },
    {
      id: 'msg-2-4',
      conversation_id: 'conv-2',
      sender_id: CURRENT_USER_ID,
      content: 'That sounds like a solid project. I can start next week. Let me put together a proposal.',
      file_url: null,
      is_read: true,
      created_at: '2026-04-27T08:50:00Z',
      sender: undefined,
    },
    {
      id: 'msg-2-5',
      conversation_id: 'conv-2',
      sender_id: 'user-3',
      content: 'Can we discuss the project timeline?',
      file_url: null,
      is_read: true,
      created_at: '2026-04-27T09:10:00Z',
      sender: MOCK_USERS['user-3'],
    },
  ],
  'conv-3': [
    {
      id: 'msg-3-1',
      conversation_id: 'conv-3',
      sender_id: 'user-4',
      content: 'Hey! I finished the three logo concepts we discussed.',
      file_url: null,
      is_read: true,
      created_at: '2026-04-27T08:00:00Z',
      sender: MOCK_USERS['user-4'],
    },
    {
      id: 'msg-3-2',
      conversation_id: 'conv-3',
      sender_id: CURRENT_USER_ID,
      content: 'Great! Can you share them?',
      file_url: null,
      is_read: true,
      created_at: '2026-04-27T08:20:00Z',
      sender: undefined,
    },
    {
      id: 'msg-3-3',
      conversation_id: 'conv-3',
      sender_id: 'user-4',
      content: 'Here is the first concept with the emerald color scheme you requested:',
      file_url: 'https://placeholder.com/logo-concept-1.png',
      is_read: true,
      created_at: '2026-04-27T08:30:00Z',
      sender: MOCK_USERS['user-4'],
    },
    {
      id: 'msg-3-4',
      conversation_id: 'conv-3',
      sender_id: 'user-4',
      content: 'The logo designs are ready for review',
      file_url: null,
      is_read: false,
      created_at: '2026-04-27T08:45:00Z',
      sender: MOCK_USERS['user-4'],
    },
  ],
  'conv-4': [
    {
      id: 'msg-4-1',
      conversation_id: 'conv-4',
      sender_id: 'user-5',
      content: 'The final deliverables look great. I am approving the order.',
      file_url: null,
      is_read: true,
      created_at: '2026-04-26T21:00:00Z',
      sender: MOCK_USERS['user-5'],
    },
    {
      id: 'msg-4-2',
      conversation_id: 'conv-4',
      sender_id: CURRENT_USER_ID,
      content: 'Thank you, Vikram! It was a pleasure working on this project.',
      file_url: null,
      is_read: true,
      created_at: '2026-04-26T21:15:00Z',
      sender: undefined,
    },
    {
      id: 'msg-4-3',
      conversation_id: 'conv-4',
      sender_id: 'user-5',
      content: 'Payment has been released for the order',
      file_url: null,
      is_read: true,
      created_at: '2026-04-26T22:30:00Z',
      sender: MOCK_USERS['user-5'],
    },
  ],
  'conv-5': [
    {
      id: 'msg-5-1',
      conversation_id: 'conv-5',
      sender_id: CURRENT_USER_ID,
      content: 'Ananya, I finished the data analysis report you requested.',
      file_url: null,
      is_read: true,
      created_at: '2026-04-27T10:00:00Z',
      sender: undefined,
    },
    {
      id: 'msg-5-2',
      conversation_id: 'conv-5',
      sender_id: CURRENT_USER_ID,
      content: 'Here is the PDF with all the visualizations:',
      file_url: 'data-analysis-report.pdf',
      is_read: true,
      created_at: '2026-04-27T10:05:00Z',
      sender: undefined,
    },
    {
      id: 'msg-5-3',
      conversation_id: 'conv-5',
      sender_id: 'user-6',
      content: 'Wow, this is exactly what I needed! The charts are so clear.',
      file_url: null,
      is_read: true,
      created_at: '2026-04-27T10:20:00Z',
      sender: MOCK_USERS['user-6'],
    },
    {
      id: 'msg-5-4',
      conversation_id: 'conv-5',
      sender_id: 'user-6',
      content: 'Thanks for the quick turnaround!',
      file_url: null,
      is_read: false,
      created_at: '2026-04-27T10:30:00Z',
      sender: MOCK_USERS['user-6'],
    },
  ],
  'conv-6': [
    {
      id: 'msg-6-1',
      conversation_id: 'conv-6',
      sender_id: 'user-7',
      content: 'Hey, I need help integrating a payment gateway for my project. Can you take a look?',
      file_url: null,
      is_read: true,
      created_at: '2026-04-27T05:00:00Z',
      sender: MOCK_USERS['user-7'],
    },
    {
      id: 'msg-6-2',
      conversation_id: 'conv-6',
      sender_id: CURRENT_USER_ID,
      content: 'Sure! Which payment gateway are you planning to use? Razorpay or Stripe?',
      file_url: null,
      is_read: true,
      created_at: '2026-04-27T05:15:00Z',
      sender: undefined,
    },
    {
      id: 'msg-6-3',
      conversation_id: 'conv-6',
      sender_id: 'user-7',
      content: 'Let me check the API docs and get back to you',
      file_url: null,
      is_read: true,
      created_at: '2026-04-27T06:00:00Z',
      sender: MOCK_USERS['user-7'],
    },
  ],
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date('2026-04-27T10:35:00Z');
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  if (diffDays === 1) {
    return 'Yesterday';
  }
  if (diffDays < 7) {
    return date.toLocaleDateString([], { weekday: 'short' });
  }
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function formatMessageTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function isImageFile(url: string | null): boolean {
  if (!url) return false;
  return /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(url) || url.includes('placeholder.com');
}

function isPdfFile(url: string | null): boolean {
  if (!url) return false;
  return /\.pdf$/i.test(url);
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

const AVATAR_COLORS = [
  'bg-emerald-500',
  'bg-teal-500',
  'bg-cyan-500',
  'bg-emerald-600',
  'bg-teal-600',
  'bg-green-500',
];

function getAvatarColor(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

/* ------------------------------------------------------------------ */
/*  Typing Indicator                                                   */
/* ------------------------------------------------------------------ */

function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 px-4 py-2">
      <div className="flex items-center gap-1 rounded-2xl bg-white dark:bg-gray-800 px-4 py-3 shadow-sm">
        <span className="text-xs text-gray-500 dark:text-gray-400 mr-1">typing</span>
        <span className="flex gap-0.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0ms]" />
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:150ms]" />
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:300ms]" />
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Avatar Component                                                   */
/* ------------------------------------------------------------------ */

function UserAvatar({ user, size = 'md' }: { user: Profile; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
  };

  return (
    <div className="relative flex-shrink-0">
      {user.avatar_url ? (
        <img
          src={user.avatar_url}
          alt={user.full_name}
          className={`${sizeClasses[size]} rounded-full object-cover`}
        />
      ) : (
        <div
          className={`${sizeClasses[size]} ${getAvatarColor(user.id)} flex items-center justify-center rounded-full font-semibold text-white`}
        >
          {getInitials(user.full_name)}
        </div>
      )}
      {user.is_online && (
        <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full border-2 border-white dark:border-gray-900 bg-emerald-500" />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Conversation List Item                                             */
/* ------------------------------------------------------------------ */

function ConversationItem({
  conversation,
  isSelected,
  onClick,
}: {
  conversation: Conversation;
  isSelected: boolean;
  onClick: () => void;
}) {
  const other = conversation.other_user;

  if (!other) return null;

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 transition-all duration-150 hover:bg-gray-50 dark:hover:bg-gray-800/60 ${
        isSelected
          ? 'bg-emerald-50 dark:bg-emerald-900/20 border-l-2 border-emerald-500'
          : 'border-l-2 border-transparent'
      }`}
    >
      <UserAvatar user={other} size="md" />

      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">
            {other.full_name}
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0 ml-2">
            {formatTime(conversation.last_message_at)}
          </span>
        </div>
        <div className="flex items-center justify-between mt-0.5">
          <span className="text-sm text-gray-500 dark:text-gray-400 truncate pr-2">
            {conversation.last_message}
          </span>
          {(conversation.unread_count ?? 0) > 0 && (
            <span className="flex-shrink-0 inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-emerald-500 text-white text-xs font-bold">
              {conversation.unread_count}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Message Bubble                                                     */
/* ------------------------------------------------------------------ */

function MessageBubble({
  message,
  isLastInGroup,
}: {
  message: Message;
  isLastInGroup: boolean;
}) {
  const isSent = message.sender_id === CURRENT_USER_ID;

  return (
    <div className={`flex ${isSent ? 'justify-end' : 'justify-start'} ${isLastInGroup ? 'mb-3' : 'mb-0.5'}`}>
      <div className={`max-w-[75%] sm:max-w-[65%] ${isSent ? 'items-end' : 'items-start'} flex flex-col`}>
        {/* File attachment */}
        {message.file_url && isImageFile(message.file_url) && (
          <div
            className={`rounded-2xl overflow-hidden mb-1 shadow-sm ${
              isSent ? 'rounded-br-sm' : 'rounded-bl-sm'
            }`}
          >
            <div className="relative bg-gray-100 dark:bg-gray-700 h-48 w-64 flex items-center justify-center">
              <Image className="h-8 w-8 text-gray-400" />
              <span className="absolute bottom-2 left-2 text-xs text-gray-500 dark:text-gray-400 bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-full">
                image
              </span>
            </div>
          </div>
        )}

        {message.file_url && isPdfFile(message.file_url) && (
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-sm mb-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 ${
              isSent ? 'rounded-br-sm' : 'rounded-bl-sm'
            }`}
          >
            <div className="h-10 w-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
              <FileText className="h-5 w-5 text-red-500" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {message.file_url.split('/').pop()}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">PDF Document</p>
            </div>
          </div>
        )}

        {/* Text content */}
        {message.content && (
          <div
            className={`px-4 py-2.5 rounded-2xl shadow-sm ${
              isSent
                ? 'bg-emerald-500 text-white rounded-br-sm'
                : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-sm'
            } ${message.file_url ? 'mt-1' : ''}`}
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
          </div>
        )}

        {/* Timestamp and read receipt */}
        {isLastInGroup && (
          <div className={`flex items-center gap-1 mt-1 px-1 ${isSent ? 'justify-end' : 'justify-start'}`}>
            <span className="text-[11px] text-gray-400 dark:text-gray-500">
              {formatMessageTime(message.created_at)}
            </span>
            {isSent && (
              message.is_read ? (
                <CheckCheck className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <Check className="h-3.5 w-3.5 text-gray-400" />
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Empty State                                                        */
/* ------------------------------------------------------------------ */

function EmptyChatState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900/50 px-6">
      <div className="h-20 w-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-6">
        <Send className="h-8 w-8 text-emerald-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
        Your Messages
      </h3>
      <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm">
        Select a conversation to start chatting with freelancers and clients on SkillSwap Campus.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function MessagingPage() {
  const { profile: _profile } = useAuth();
  const [conversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [showTyping, setShowTyping] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  const selectedConversation = conversations.find((c) => c.id === selectedConversationId) ?? null;
  const messages = selectedConversationId ? MOCK_MESSAGES[selectedConversationId] ?? [] : [];

  const filteredConversations = conversations.filter((c) => {
    if (!searchQuery) return true;
    const other = c.other_user;
    if (!other) return false;
    return (
      other.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.last_message.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (selectedConversationId) {
      scrollToBottom();
    }
  }, [selectedConversationId, scrollToBottom]);

  // Simulate typing indicator for a brief moment after selecting a conversation
  useEffect(() => {
    if (selectedConversationId && selectedConversation?.other_user?.is_online) {
      const timer = setTimeout(() => {
        setShowTyping(true);
        const hideTimer = setTimeout(() => setShowTyping(false), 3000);
        return () => clearTimeout(hideTimer);
      }, 1500);
      return () => clearTimeout(timer);
    }
    setShowTyping(false);
  }, [selectedConversationId, selectedConversation?.other_user?.is_online]);

  const handleSelectConversation = (id: string) => {
    setSelectedConversationId(id);
    setShowMobileChat(true);
  };

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    setMessageInput('');
    if (messageInputRef.current) {
      messageInputRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageInput(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  };

  const handleBack = () => {
    setShowMobileChat(false);
  };

  // Group messages by sender for visual grouping
  const groupedMessages = messages.map((msg, idx) => {
    const prev = idx > 0 ? messages[idx - 1] : null;
    const isLastInGroup = !prev || prev.sender_id !== msg.sender_id;
    return { message: msg, isLastInGroup };
  });

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
      {/* -------------------------------------------------------------- */}
      {/* Left Sidebar: Conversation List                                 */}
      {/* -------------------------------------------------------------- */}
      <aside
        className={`w-full md:w-80 lg:w-96 flex-shrink-0 border-r border-gray-200 dark:border-gray-800 flex flex-col bg-white dark:bg-gray-900 ${
          showMobileChat ? 'hidden md:flex' : 'flex'
        }`}
      >
        {/* Sidebar header */}
        <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Messages</h2>
            <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <MoreVertical className="h-4 w-4 text-gray-500" />
            </button>
          </div>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-shadow"
            />
          </div>
        </div>

        {/* Online filter tabs */}
        <div className="flex gap-1 px-4 py-2 border-b border-gray-100 dark:border-gray-800/50">
          <button className="px-3 py-1.5 text-xs font-semibold rounded-full bg-emerald-500 text-white">
            All
          </button>
          <button className="px-3 py-1.5 text-xs font-medium rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            Online
          </button>
          <button className="px-3 py-1.5 text-xs font-medium rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            Unread
          </button>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <Search className="h-8 w-8 text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                No conversations found
              </p>
            </div>
          )}
          {filteredConversations.map((conv) => (
            <ConversationItem
              key={conv.id}
              conversation={conv}
              isSelected={conv.id === selectedConversationId}
              onClick={() => handleSelectConversation(conv.id)}
            />
          ))}
        </div>
      </aside>

      {/* -------------------------------------------------------------- */}
      {/* Right Chat Area                                                  */}
      {/* -------------------------------------------------------------- */}
      <main
        className={`flex-1 flex flex-col min-w-0 bg-gray-50 dark:bg-gray-900/50 ${
          showMobileChat ? 'flex' : 'hidden md:flex'
        }`}
      >
        {selectedConversation ? (
          <>
            {/* Chat header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
              {/* Mobile back button */}
              <button
                onClick={handleBack}
                className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors -ml-1 mr-1"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>

              <UserAvatar user={selectedConversation.other_user!} size="md" />

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {selectedConversation.other_user?.full_name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {selectedConversation.other_user?.is_online ? (
                    <span className="flex items-center gap-1">
                      <Circle className="h-2 w-2 fill-emerald-500 text-emerald-500" />
                      Online
                    </span>
                  ) : (
                    `Last seen ${formatTime(selectedConversation.other_user?.last_seen ?? '')}`
                  )}
                </p>
              </div>

              <div className="flex items-center gap-1">
                <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <Phone className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <Video className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <MoreVertical className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-0">
              {/* Date divider */}
              <div className="flex items-center justify-center py-3">
                <span className="px-3 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-200/60 dark:bg-gray-800/60 rounded-full">
                  Today
                </span>
              </div>

              {groupedMessages.map(({ message, isLastInGroup }) => (
                <MessageBubble key={message.id} message={message} isLastInGroup={isLastInGroup} />
              ))}

              {/* Typing indicator */}
              {showTyping && <TypingIndicator />}

              <div ref={messagesEndRef} />
            </div>

            {/* Message input */}
            <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3">
              <div className="flex items-end gap-2">
                <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0 mb-0.5">
                  <Paperclip className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </button>

                <div className="flex-1 relative">
                  <textarea
                    ref={messageInputRef}
                    value={messageInput}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    rows={1}
                    className="w-full resize-none rounded-2xl bg-gray-100 dark:bg-gray-800 border-0 px-4 py-2.5 pr-10 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-shadow max-h-[120px]"
                  />
                  <button className="absolute right-2 bottom-2 p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    <Smile className="h-4 w-4 text-gray-400" />
                  </button>
                </div>

                <button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                  className={`p-2.5 rounded-xl flex-shrink-0 mb-0.5 transition-all duration-200 ${
                    messageInput.trim()
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/25 scale-100'
                      : 'bg-gray-200 dark:bg-gray-800 text-gray-400 scale-95'
                  }`}
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <EmptyChatState />
        )}
      </main>
    </div>
  );
}
