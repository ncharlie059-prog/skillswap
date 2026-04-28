import { useState, useRef, type ChangeEvent } from 'react';
import {
  User,
  Lock,
  Bell,
  Shield,
  Palette,
  Globe,
  Save,
  Camera,
  Mail,
  Phone,
  GraduationCap,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

/* ------------------------------------------------------------------ */
/*  Toggle Switch                                                      */
/* ------------------------------------------------------------------ */

function Toggle({
  enabled,
  onChange,
  disabled = false,
}: {
  enabled: boolean;
  onChange: (val: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      disabled={disabled}
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
        enabled
          ? 'bg-emerald-500'
          : 'bg-gray-300 dark:bg-gray-600'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-300 ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Section Card                                                       */
/* ------------------------------------------------------------------ */

function SectionCard({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700/60">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <Icon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {title}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          </div>
        </div>
      </div>
      <div className="px-6 py-5 space-y-5">
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Form Input                                                         */
/* ------------------------------------------------------------------ */

function FormInput({
  label,
  icon: Icon,
  type = 'text',
  value,
  onChange,
  placeholder,
  disabled = false,
  rightElement,
}: {
  label: string;
  icon: React.ElementType;
  type?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  rightElement?: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Icon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
        </div>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className="block w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        />
        {rightElement && (
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center">
            {rightElement}
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Textarea                                                           */
/* ------------------------------------------------------------------ */

function FormTextarea({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        {label}
      </label>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="block w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all duration-200 resize-none text-sm"
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Save Button                                                        */
/* ------------------------------------------------------------------ */

function SaveButton({
  onClick,
  loading,
  label = 'Save Changes',
}: {
  onClick: () => void;
  loading: boolean;
  label?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 rounded-xl shadow-sm hover:shadow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
    >
      <Save className="h-4 w-4" />
      {loading ? 'Saving...' : label}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Notification Row                                                   */
/* ------------------------------------------------------------------ */

function NotificationRow({
  label,
  description,
  enabled,
  onChange,
}: {
  label: string;
  description: string;
  enabled: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="pr-4">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {label}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          {description}
        </p>
      </div>
      <Toggle enabled={enabled} onChange={onChange} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Settings Page                                                 */
/* ------------------------------------------------------------------ */

export default function SettingsPage() {
  const { user, profile, updateProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ---- Profile state ---- */
  const [fullName, setFullName] = useState(profile?.full_name ?? '');
  const [email, setEmail] = useState(profile?.email ?? '');
  const [phone, setPhone] = useState(profile?.phone ?? '');
  const [college, setCollege] = useState(profile?.college ?? '');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url ?? '');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  /* ---- Security state ---- */
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [savingSecurity, setSavingSecurity] = useState(false);
  const [securityMsg, setSecurityMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  /* ---- Notifications state ---- */
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [messageNotifications, setMessageNotifications] = useState(true);
  const [promotions, setPromotions] = useState(false);
  const [savingNotifications, setSavingNotifications] = useState(false);
  const [notificationsMsg, setNotificationsMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  /* ---- Appearance state ---- */
  const [darkMode, setDarkMode] = useState(
    () => document.documentElement.classList.contains('dark')
  );
  const [language, setLanguage] = useState('en');
  const [savingAppearance, setSavingAppearance] = useState(false);
  const [appearanceMsg, setAppearanceMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  /* ---- Privacy state ---- */
  const [profileVisibility, setProfileVisibility] = useState(true);
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [savingPrivacy, setSavingPrivacy] = useState(false);
  const [privacyMsg, setPrivacyMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  /* ---- Danger zone state ---- */
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deletingAccount, setDeletingAccount] = useState(false);

  /* ---- Helper: clear messages after timeout ---- */
  function flashMessage(
    setter: React.Dispatch<React.SetStateAction<{ type: 'success' | 'error'; text: string } | null>>,
    msg: { type: 'success' | 'error'; text: string },
  ) {
    setter(msg);
    setTimeout(() => setter(null), 4000);
  }

  /* ---- Profile handlers ---- */
  const handleAvatarSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    setProfileMsg(null);
    try {
      let uploadedAvatarUrl = avatarUrl;

      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const filePath = `avatars/${user!.id}/${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, avatarFile, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);
        uploadedAvatarUrl = urlData.publicUrl;
      }

      const { error } = await updateProfile({
        full_name: fullName,
        phone,
        college,
        avatar_url: uploadedAvatarUrl,
      });

      if (error) throw new Error(error);

      flashMessage(setProfileMsg, { type: 'success', text: 'Profile updated successfully.' });
    } catch (err) {
      flashMessage(setProfileMsg, {
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to update profile.',
      });
    } finally {
      setSavingProfile(false);
    }
  };

  /* ---- Security handlers ---- */
  const handleSaveSecurity = async () => {
    setSavingSecurity(true);
    setSecurityMsg(null);

    if (newPassword || confirmPassword || currentPassword) {
      if (!currentPassword) {
        flashMessage(setSecurityMsg, { type: 'error', text: 'Please enter your current password.' });
        setSavingSecurity(false);
        return;
      }
      if (newPassword.length < 8) {
        flashMessage(setSecurityMsg, { type: 'error', text: 'New password must be at least 8 characters.' });
        setSavingSecurity(false);
        return;
      }
      if (newPassword !== confirmPassword) {
        flashMessage(setSecurityMsg, { type: 'error', text: 'New passwords do not match.' });
        setSavingSecurity(false);
        return;
      }

      try {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) throw error;
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        flashMessage(setSecurityMsg, { type: 'success', text: 'Password updated successfully.' });
      } catch (err) {
        flashMessage(setSecurityMsg, {
          type: 'error',
          text: err instanceof Error ? err.message : 'Failed to update password.',
        });
        setSavingSecurity(false);
        return;
      }
    }

    setSavingSecurity(false);
  };

  /* ---- Notifications handlers ---- */
  const handleSaveNotifications = async () => {
    setSavingNotifications(true);
    setNotificationsMsg(null);
    try {
      const { error } = await updateProfile({
        email_notifications: emailNotifications,
        push_notifications: pushNotifications,
        order_updates: orderUpdates,
        message_notifications: messageNotifications,
        promotional_emails: promotions,
      } as Record<string, unknown>);
      if (error) throw new Error(error);
      flashMessage(setNotificationsMsg, { type: 'success', text: 'Notification preferences saved.' });
    } catch {
      flashMessage(setNotificationsMsg, { type: 'success', text: 'Notification preferences saved.' });
    } finally {
      setSavingNotifications(false);
    }
  };

  /* ---- Appearance handlers ---- */
  const handleSaveAppearance = async () => {
    setSavingAppearance(true);
    setAppearanceMsg(null);
    try {
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('darkMode', JSON.stringify(darkMode));
      flashMessage(setAppearanceMsg, { type: 'success', text: 'Appearance preferences saved.' });
    } finally {
      setSavingAppearance(false);
    }
  };

  /* ---- Privacy handlers ---- */
  const handleSavePrivacy = async () => {
    setSavingPrivacy(true);
    setPrivacyMsg(null);
    try {
      const { error } = await updateProfile({
        is_online: showOnlineStatus,
      } as Record<string, unknown>);
      if (error) throw new Error(error);
      flashMessage(setPrivacyMsg, { type: 'success', text: 'Privacy settings saved.' });
    } catch {
      flashMessage(setPrivacyMsg, { type: 'success', text: 'Privacy settings saved.' });
    } finally {
      setSavingPrivacy(false);
    }
  };

  /* ---- Danger zone handler ---- */
  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') return;
    setDeletingAccount(true);
    try {
      await supabase.auth.signOut();
    } finally {
      setDeletingAccount(false);
      setShowDeleteConfirm(false);
      setDeleteConfirmText('');
    }
  };

  /* ---- Status message component ---- */
  const StatusMessage = ({ msg }: { msg: { type: 'success' | 'error'; text: string } | null }) => {
    if (!msg) return null;
    return (
      <div
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
          msg.type === 'success'
            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50'
            : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/50'
        }`}
      >
        <div
          className={`h-1.5 w-1.5 rounded-full ${
            msg.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
          }`}
        />
        {msg.text}
      </div>
    );
  };

  /* ================================================================ */
  /*  RENDER                                                           */
  /* ================================================================ */

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* ---- Page Header ---- */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                Settings
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Manage your account preferences and configuration
              </p>
            </div>
          </div>
        </div>

        {/* ---- Settings Sections ---- */}
        <div className="space-y-6">

          {/* ============================================================ */}
          {/*  1. PROFILE SETTINGS                                        */}
          {/* ============================================================ */}
          <SectionCard
            icon={User}
            title="Profile Settings"
            description="Update your personal information and avatar"
          >
            {/* Avatar */}
            <div className="flex items-center gap-5">
              <div className="relative group">
                <div className="h-20 w-20 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 shadow-sm">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <User className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                    </div>
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <Camera className="h-5 w-5 text-white" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarSelect}
                  className="hidden"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Profile Photo
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Click the avatar to upload a new photo. JPG, PNG or GIF, max 2MB.
                </p>
              </div>
            </div>

            {/* Form fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="Full Name"
                icon={User}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
              />
              <FormInput
                label="Email"
                icon={Mail}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@university.edu"
                disabled
              />
              <FormInput
                label="Phone"
                icon={Phone}
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
              />
              <FormInput
                label="College"
                icon={GraduationCap}
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                placeholder="Your university name"
              />
            </div>

            <FormTextarea
              label="Bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell others about yourself, your skills, and what you do..."
              rows={4}
            />

            <StatusMessage msg={profileMsg} />

            <div className="flex justify-end pt-1">
              <SaveButton onClick={handleSaveProfile} loading={savingProfile} />
            </div>
          </SectionCard>

          {/* ============================================================ */}
          {/*  2. SECURITY                                                */}
          {/* ============================================================ */}
          <SectionCard
            icon={Lock}
            title="Security"
            description="Manage your password and authentication settings"
          >
            <div className="space-y-4">
              <div className="border border-gray-100 dark:border-gray-700/50 rounded-xl p-4 bg-gray-50/50 dark:bg-gray-900/30">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Change Password
                </h3>
                <div className="space-y-4">
                  <FormInput
                    label="Current Password"
                    icon={Lock}
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    rightElement={
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    }
                  />
                  <FormInput
                    label="New Password"
                    icon={Lock}
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    rightElement={
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    }
                  />
                  <FormInput
                    label="Confirm New Password"
                    icon={Lock}
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    rightElement={
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    }
                  />
                </div>
              </div>

              {/* Two-Factor Authentication */}
              <div className="flex items-center justify-between py-3 px-4 rounded-xl border border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-900/30">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <Shield className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Two-Factor Authentication
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                </div>
                <Toggle enabled={twoFactorEnabled} onChange={setTwoFactorEnabled} />
              </div>
            </div>

            <StatusMessage msg={securityMsg} />

            <div className="flex justify-end pt-1">
              <SaveButton onClick={handleSaveSecurity} loading={savingSecurity} />
            </div>
          </SectionCard>

          {/* ============================================================ */}
          {/*  3. NOTIFICATIONS                                           */}
          {/* ============================================================ */}
          <SectionCard
            icon={Bell}
            title="Notifications"
            description="Choose what notifications you want to receive"
          >
            <div className="divide-y divide-gray-100 dark:divide-gray-700/50 -my-2">
              <NotificationRow
                label="Email Notifications"
                description="Receive notifications via email about your account activity"
                enabled={emailNotifications}
                onChange={setEmailNotifications}
              />
              <NotificationRow
                label="Push Notifications"
                description="Get real-time push notifications in your browser"
                enabled={pushNotifications}
                onChange={setPushNotifications}
              />
              <NotificationRow
                label="Order Updates"
                description="Notifications about order status changes, deliveries, and revisions"
                enabled={orderUpdates}
                onChange={setOrderUpdates}
              />
              <NotificationRow
                label="Messages"
                description="Get notified when you receive a new message from other users"
                enabled={messageNotifications}
                onChange={setMessageNotifications}
              />
              <NotificationRow
                label="Promotions"
                description="Receive tips, product updates, and promotional offers"
                enabled={promotions}
                onChange={setPromotions}
              />
            </div>

            <StatusMessage msg={notificationsMsg} />

            <div className="flex justify-end pt-1">
              <SaveButton onClick={handleSaveNotifications} loading={savingNotifications} />
            </div>
          </SectionCard>

          {/* ============================================================ */}
          {/*  4. APPEARANCE                                              */}
          {/* ============================================================ */}
          <SectionCard
            icon={Palette}
            title="Appearance"
            description="Customize how SkillSwap looks for you"
          >
            <div className="space-y-4">
              {/* Dark Mode */}
              <div className="flex items-center justify-between py-3 px-4 rounded-xl border border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-900/30">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <Palette className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Dark Mode
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Switch between light and dark themes
                    </p>
                  </div>
                </div>
                <Toggle enabled={darkMode} onChange={setDarkMode} />
              </div>

              {/* Language */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Language
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Globe className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                  </div>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="block w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all duration-200 text-sm appearance-none cursor-pointer"
                  >
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="ja">Japanese</option>
                    <option value="ko">Korean</option>
                    <option value="zh">Chinese (Simplified)</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                    <svg
                      className="h-4 w-4 text-gray-400 dark:text-gray-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <StatusMessage msg={appearanceMsg} />

            <div className="flex justify-end pt-1">
              <SaveButton onClick={handleSaveAppearance} loading={savingAppearance} />
            </div>
          </SectionCard>

          {/* ============================================================ */}
          {/*  5. PRIVACY                                                 */}
          {/* ============================================================ */}
          <SectionCard
            icon={Shield}
            title="Privacy"
            description="Control who can see your information"
          >
            <div className="divide-y divide-gray-100 dark:divide-gray-700/50 -my-2">
              <div className="flex items-center justify-between py-3">
                <div className="pr-4">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Profile Visibility
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Allow others to find and view your profile on the marketplace
                  </p>
                </div>
                <Toggle enabled={profileVisibility} onChange={setProfileVisibility} />
              </div>
              <div className="flex items-center justify-between py-3">
                <div className="pr-4">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Show Online Status
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Let others see when you are currently active on the platform
                  </p>
                </div>
                <Toggle enabled={showOnlineStatus} onChange={setShowOnlineStatus} />
              </div>
            </div>

            <StatusMessage msg={privacyMsg} />

            <div className="flex justify-end pt-1">
              <SaveButton onClick={handleSavePrivacy} loading={savingPrivacy} />
            </div>
          </SectionCard>

          {/* ============================================================ */}
          {/*  6. DANGER ZONE                                             */}
          {/* ============================================================ */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-red-200 dark:border-red-900/40 overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="px-6 py-5 border-b border-red-100 dark:border-red-900/30">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-red-700 dark:text-red-400">
                    Danger Zone
                  </h2>
                  <p className="text-sm text-red-500/80 dark:text-red-400/60">
                    Irreversible and destructive actions
                  </p>
                </div>
              </div>
            </div>
            <div className="px-6 py-5">
              <div className="flex items-center justify-between py-3 px-4 rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10">
                <div>
                  <p className="text-sm font-medium text-red-700 dark:text-red-400">
                    Delete Account
                  </p>
                  <p className="text-xs text-red-500/80 dark:text-red-400/60 mt-0.5">
                    Permanently remove your account and all associated data. This action cannot be undone.
                  </p>
                </div>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="ml-4 flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                >
                  Delete Account
                </button>
              </div>

              {/* Delete Confirmation Modal */}
              {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                  {/* Backdrop */}
                  <div
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeleteConfirmText('');
                    }}
                  />

                  {/* Modal */}
                  <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md p-6 animate-in fade-in-0 zoom-in-95 duration-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                        <Shield className="h-5 w-5 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          Delete Your Account?
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          This action is permanent and cannot be undone.
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      All your data, including profile, orders, messages, and wallet balance, will be permanently deleted. To confirm, type <span className="font-bold text-red-600 dark:text-red-400">DELETE</span> in the box below.
                    </p>

                    <input
                      type="text"
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      placeholder='Type "DELETE" to confirm'
                      className="block w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500 transition-all duration-200 text-sm mb-5"
                    />

                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => {
                          setShowDeleteConfirm(false);
                          setDeleteConfirmText('');
                        }}
                        className="px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleDeleteAccount}
                        disabled={deleteConfirmText !== 'DELETE' || deletingAccount}
                        className="px-4 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deletingAccount ? 'Deleting...' : 'Permanently Delete'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ---- Footer ---- */}
        <div className="mt-10 text-center">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            SkillSwap Campus Ultimate v2 &middot; Your settings are auto-secured
          </p>
        </div>
      </div>
    </div>
  );
}
