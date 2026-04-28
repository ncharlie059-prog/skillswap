import { useState, useRef, useCallback } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle, User, Briefcase, GraduationCap, Upload, Star, MapPin, Globe, Zap, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import ProgressBar from '../common/ProgressBar';

/* ------------------------------------------------------------------ */
/*  Types & Data                                                       */
/* ------------------------------------------------------------------ */

type OnboardingRole = 'freelancer' | 'client';
type OnboardingStep = 1 | 2 | 3 | 4 | 5 | 6;

interface OnboardingData {
  role: OnboardingRole | null;
  headline: string;
  bio: string;
  location: string;
  college: string;
  skills: string[];
  companyName: string;
  industry: string;
  website: string;
  portfolioUrl: string;
  experienceYears: number;
  hourlyRate: number;
  collegeIdFile: File | null;
}

const TOTAL_STEPS = 6;

const AVAILABLE_SKILLS = [
  'React', 'TypeScript', 'Python', 'Figma', 'Illustrator', 'Photoshop',
  'Premiere Pro', 'WordPress', 'Flutter', 'SEO', 'Node.js', 'Django',
  'Swift', 'Kotlin', 'R', 'Tableau', 'After Effects', 'Blender',
  'SolidWorks', 'AutoCAD', 'Java', 'C++', 'Go', 'Rust',
  'Content Writing', 'Copywriting', 'Social Media', 'Email Marketing',
  'Data Analysis', 'Machine Learning', 'UI/UX Design', '3D Modeling',
];

const INDUSTRIES = [
  'Technology', 'Education', 'Healthcare', 'Finance', 'Marketing',
  'Design', 'Media', 'E-commerce', 'Research', 'Other',
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

interface OnboardingFlowProps {
  onComplete?: () => void;
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const { profile, user } = useAuth();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(1);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [data, setData] = useState<OnboardingData>({
    role: null,
    headline: '',
    bio: '',
    location: '',
    college: profile?.college ?? '',
    skills: [],
    companyName: '',
    industry: '',
    website: '',
    portfolioUrl: '',
    experienceYears: 0,
    hourlyRate: 15,
    collegeIdFile: null,
  });

  const updateData = useCallback((updates: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  }, []);

  const toggleSkill = useCallback((skill: string) => {
    setData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : prev.skills.length < 8
        ? [...prev.skills, skill]
        : prev.skills,
    }));
  }, []);

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 1: return data.role !== null;
      case 2: return data.headline.trim().length > 0;
      case 3: return data.role === 'client' ? data.companyName.trim().length > 0 : data.skills.length > 0;
      case 4: return true;
      case 5: return true;
      case 6: return true;
      default: return false;
    }
  };

  const goNext = () => {
    if (currentStep < TOTAL_STEPS && canProceed()) {
      setCurrentStep((prev) => (prev + 1) as OnboardingStep);
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as OnboardingStep);
    }
  };

  const skipStep = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => (prev + 1) as OnboardingStep);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.type.startsWith('image/') || file.type === 'application/pdf')) {
      updateData({ collegeIdFile: file });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateData({ collegeIdFile: file });
    }
  };

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      if (user && data.role) {
        await supabase.from('profiles').update({
          college_name: data.college,
          updated_at: new Date().toISOString(),
        }).eq('id', user.id);

        if (data.role === 'freelancer') {
          await supabase.from('freelancer_profiles').update({
            title: data.headline,
            bio: data.bio,
            portfolio_url: data.portfolioUrl,
            experience_years: data.experienceYears,
            hourly_rate: data.hourlyRate,
            updated_at: new Date().toISOString(),
          }).eq('user_id', user.id);
        } else if (data.role === 'client') {
          await supabase.from('client_profiles').update({
            company_name: data.companyName,
            industry: data.industry,
            website_url: data.website,
            bio: data.bio,
            updated_at: new Date().toISOString(),
          }).eq('user_id', user.id);
        }
      }
    } catch {
      /* Silently handle - mock mode */
    }
    setIsCompleting(false);
    setIsCompleted(true);
  };

  /* ---------------------------------------------------------------- */
  /*  Step Components                                                  */
  /* ---------------------------------------------------------------- */

  const StepWelcome = () => (
    <div className="text-center max-w-lg mx-auto">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white mx-auto mb-6 shadow-lg shadow-emerald-200 dark:shadow-emerald-900/40">
        <GraduationCap className="w-10 h-10" />
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
        Welcome to SkillSwap!
      </h2>
      <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
        Let us set up your profile so you can start collaborating. Choose how you want to use SkillSwap.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => updateData({ role: 'freelancer' })}
          className={`group p-6 rounded-2xl border-2 text-left transition-all duration-300 ${
            data.role === 'freelancer'
              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-500 shadow-lg shadow-emerald-100 dark:shadow-emerald-900/30'
              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700'
          }`}
        >
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${
            data.role === 'freelancer'
              ? 'bg-emerald-500 text-white'
              : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 group-hover:bg-emerald-100 group-hover:text-emerald-600 dark:group-hover:bg-emerald-900/30 dark:group-hover:text-emerald-400'
          }`}>
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">I am a Freelancer</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">I want to offer my skills and services to campus clients.</p>
          {data.role === 'freelancer' && (
            <div className="flex items-center gap-1.5 mt-3 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
              <CheckCircle className="w-4 h-4" />
              Selected
            </div>
          )}
        </button>

        <button
          onClick={() => updateData({ role: 'client' })}
          className={`group p-6 rounded-2xl border-2 text-left transition-all duration-300 ${
            data.role === 'client'
              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-500 shadow-lg shadow-emerald-100 dark:shadow-emerald-900/30'
              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700'
          }`}
        >
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${
            data.role === 'client'
              ? 'bg-emerald-500 text-white'
              : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 group-hover:bg-emerald-100 group-hover:text-emerald-600 dark:group-hover:bg-emerald-900/30 dark:group-hover:text-emerald-400'
          }`}>
            <User className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">I am a Client</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">I want to hire talented students for projects and tasks.</p>
          {data.role === 'client' && (
            <div className="flex items-center gap-1.5 mt-3 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
              <CheckCircle className="w-4 h-4" />
              Selected
            </div>
          )}
        </button>
      </div>
    </div>
  );

  const StepBasicInfo = () => (
    <div className="max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Basic Information</h2>
      <p className="text-slate-500 dark:text-slate-400 mb-8">Tell the community about yourself so they know who you are.</p>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Headline <span className="text-emerald-600">*</span>
          </label>
          <input
            type="text"
            value={data.headline}
            onChange={(e) => updateData({ headline: e.target.value })}
            placeholder={data.role === 'freelancer' ? 'e.g. Full-Stack Developer & UI Designer' : 'e.g. Startup Founder Looking for Design Talent'}
            className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Bio</label>
          <textarea
            value={data.bio}
            onChange={(e) => updateData({ bio: e.target.value })}
            placeholder="Tell the community about yourself, your passions, and what you bring to the table..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Location</span>
            </label>
            <input
              type="text"
              value={data.location}
              onChange={(e) => updateData({ location: e.target.value })}
              placeholder="e.g. Boston, MA"
              className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              <span className="inline-flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5" /> College</span>
            </label>
            <input
              type="text"
              value={data.college}
              onChange={(e) => updateData({ college: e.target.value })}
              placeholder="e.g. MIT"
              className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const StepSkillsCompany = () => (
    <div className="max-w-lg mx-auto">
      {data.role === 'freelancer' ? (
        <>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Your Skills</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-2">Select up to 8 skills that best describe your expertise.</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-6">{data.skills.length}/8 selected</p>

          <div className="flex flex-wrap gap-2">
            {AVAILABLE_SKILLS.map((skill) => {
              const isSelected = data.skills.includes(skill);
              return (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-200 dark:shadow-emerald-900/40 scale-105'
                      : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-emerald-300 dark:hover:border-emerald-700 hover:text-emerald-700 dark:hover:text-emerald-400'
                  }`}
                >
                  {skill}
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Company Info</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8">Tell freelancers about your organization or project.</p>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Company Name <span className="text-emerald-600">*</span>
              </label>
              <input
                type="text"
                value={data.companyName}
                onChange={(e) => updateData({ companyName: e.target.value })}
                placeholder="e.g. LaunchPad Startup"
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Industry</label>
              <select
                value={data.industry}
                onChange={(e) => updateData({ industry: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all appearance-none cursor-pointer"
              >
                <option value="">Select an industry</option>
                {INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                <span className="inline-flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> Website</span>
              </label>
              <input
                type="url"
                value={data.website}
                onChange={(e) => updateData({ website: e.target.value })}
                placeholder="https://yourcompany.com"
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );

  const StepPortfolio = () => (
    <div className="max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
        {data.role === 'freelancer' ? 'Portfolio & Experience' : 'Project Preferences'}
      </h2>
      <p className="text-slate-500 dark:text-slate-400 mb-8">
        {data.role === 'freelancer' ? 'Showcase your work and set your rates.' : 'Set your project preferences and budget range.'}
      </p>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            <Globe className="w-3.5 h-3.5 inline mr-1" />
            {data.role === 'freelancer' ? 'Portfolio URL' : 'Project Board URL'}
          </label>
          <input
            type="url"
            value={data.portfolioUrl}
            onChange={(e) => updateData({ portfolioUrl: e.target.value })}
            placeholder={data.role === 'freelancer' ? 'https://yourportfolio.com' : 'https://yourproject.com'}
            className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
          />
        </div>

        {data.role === 'freelancer' ? (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Years of Experience</label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={data.experienceYears}
                  onChange={(e) => updateData({ experienceYears: parseInt(e.target.value) })}
                  className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-emerald-600"
                />
                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400 w-12 text-center">{data.experienceYears}yr</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                <span className="inline-flex items-center gap-1"><Star className="w-3.5 h-3.5" /> Hourly Rate (USD)</span>
              </label>
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-500 dark:text-slate-400">$</span>
                <input
                  type="number"
                  value={data.hourlyRate}
                  onChange={(e) => updateData({ hourlyRate: parseInt(e.target.value) || 0 })}
                  min="5"
                  max="200"
                  className="w-32 px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
                />
                <span className="text-sm text-slate-500 dark:text-slate-400">/hour</span>
              </div>
            </div>
          </>
        ) : (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
            <h4 className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 mb-2">Client Tips</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                Post clear, detailed project descriptions for better proposals
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                Set realistic budgets based on project scope and complexity
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                Review freelancer profiles and ratings before hiring
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );

  const StepCollegeId = () => (
    <div className="max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">College ID Verification</h2>
      <p className="text-slate-500 dark:text-slate-400 mb-8">
        Upload your student ID to get a verified badge and build trust with the community.
      </p>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleFileDrop}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
          dragOver
            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 scale-[1.02]'
            : data.collegeIdFile
            ? 'border-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/10'
            : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/50 hover:border-emerald-400 dark:hover:border-emerald-600'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf"
          onChange={handleFileSelect}
          className="hidden"
        />

        {data.collegeIdFile ? (
          <div className="space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{data.collegeIdFile.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {(data.collegeIdFile.size / 1024).toFixed(1)} KB
            </p>
            <button
              onClick={() => updateData({ collegeIdFile: null })}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
            >
              <X className="w-3 h-3" />
              Remove
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto">
              <Upload className="w-8 h-8 text-slate-400 dark:text-slate-500" />
            </div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Drag & drop your college ID here
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              or click to browse &middot; JPG, PNG, PDF up to 10MB
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors shadow-sm shadow-emerald-200 dark:shadow-emerald-900/30"
            >
              <Upload className="w-4 h-4" />
              Choose File
            </button>
          </div>
        )}
      </div>

      <p className="mt-4 text-xs text-slate-400 dark:text-slate-500 text-center">
        Your ID is encrypted and only used for verification. You can skip this step and verify later.
      </p>
    </div>
  );

  const StepPreview = () => (
    <div className="max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Profile Preview</h2>
      <p className="text-slate-500 dark:text-slate-400 mb-8">This is how your profile will look to others on SkillSwap.</p>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-lg shadow-emerald-500/5">
        {/* Header */}
        <div className="relative h-32 bg-gradient-to-br from-emerald-500 to-teal-600 dark:from-emerald-700 dark:to-teal-800">
          <div className="absolute -bottom-10 left-6">
            <div className="w-20 h-20 rounded-2xl bg-white dark:bg-slate-900 border-4 border-white dark:border-slate-800 flex items-center justify-center shadow-lg">
              <div className="w-full h-full rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-2xl font-bold">
                {getInitials(profile?.full_name ?? 'U')}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-14 px-6 pb-6">
          {/* Name & headline */}
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">{profile?.full_name ?? 'New User'}</h3>
          <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">{data.headline || 'No headline set'}</p>

          {/* Location & college */}
          <div className="flex items-center gap-4 mt-2 text-sm text-slate-500 dark:text-slate-400">
            {data.location && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {data.location}
              </span>
            )}
            {data.college && (
              <span className="inline-flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5" />
                {data.college}
              </span>
            )}
          </div>

          {/* Role badge */}
          <div className="mt-3">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
              data.role === 'freelancer'
                ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                : 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400'
            }`}>
              {data.role === 'freelancer' ? <Briefcase className="w-3 h-3" /> : <User className="w-3 h-3" />}
              {data.role === 'freelancer' ? 'Freelancer' : 'Client'}
            </span>
            {data.collegeIdFile && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 ml-2">
                <CheckCircle className="w-3 h-3" />
                Verified
              </span>
            )}
          </div>

          {/* Bio */}
          {data.bio && (
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{data.bio}</p>
          )}

          {/* Skills (freelancer) */}
          {data.role === 'freelancer' && data.skills.length > 0 && (
            <div className="mt-4">
              <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Skills</h4>
              <div className="flex flex-wrap gap-1.5">
                {data.skills.map((skill) => (
                  <span key={skill} className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Company (client) */}
          {data.role === 'client' && data.companyName && (
            <div className="mt-4">
              <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Company</h4>
              <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">{data.companyName}</p>
              {data.industry && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{data.industry}</p>}
            </div>
          )}

          {/* Rates (freelancer) */}
          {data.role === 'freelancer' && (
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <div>
                <span className="text-xl font-bold text-slate-900 dark:text-white">${data.hourlyRate}</span>
                <span className="text-sm text-slate-400 dark:text-slate-500">/hr</span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">{data.experienceYears} years experience</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  /* ---------------------------------------------------------------- */
  /*  Completion View                                                  */
  /* ---------------------------------------------------------------- */

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4">
        {/* Confetti animation (CSS only) */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-5%',
                backgroundColor: ['#10b981', '#14b8a6', '#f59e0b', '#ec4899', '#3b82f6', '#8b5cf6'][i % 6],
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        <div className="relative text-center max-w-md mx-auto">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-emerald-200 dark:shadow-emerald-900/40 animate-bounce-slow">
            <CheckCircle className="w-12 h-12" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-3">
            You are All Set!
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 mb-2 leading-relaxed">
            {data.role === 'freelancer'
              ? 'Your freelancer profile is ready. Start browsing tasks and apply to projects that match your skills.'
              : 'Your client profile is ready. Post your first task and find talented students to bring your ideas to life.'}
          </p>
          <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium mb-8">
            +50 XP earned for completing your profile!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button onClick={onComplete} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors shadow-sm shadow-emerald-200 dark:shadow-emerald-900/30">
              {data.role === 'freelancer' ? (
                <>
                  <Briefcase className="w-5 h-5" />
                  Browse Tasks
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Post a Task
                </>
              )}
              <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={onComplete} className="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-400 hover:border-emerald-300 dark:hover:border-emerald-700 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">
              View Profile
            </button>
          </div>
        </div>

        <style>{`
          @keyframes confetti {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
          }
          .animate-confetti {
            animation: confetti linear forwards;
          }
          @keyframes bounce-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          .animate-bounce-slow {
            animation: bounce-slow 2s ease-in-out infinite;
          }
        `}</style>
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /*  Main Onboarding Wizard                                           */
  /* ---------------------------------------------------------------- */

  const stepLabels: Record<OnboardingStep, string> = {
    1: 'Welcome',
    2: 'Basic Info',
    3: data.role === 'freelancer' ? 'Skills' : 'Company',
    4: data.role === 'freelancer' ? 'Portfolio' : 'Preferences',
    5: 'Verification',
    6: 'Preview',
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Progress bar */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-slate-900 dark:text-white">
              Step {currentStep} of {TOTAL_STEPS}
            </span>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {stepLabels[currentStep]}
            </span>
          </div>
          <ProgressBar value={currentStep} max={TOTAL_STEPS} size="sm" color="emerald" showLabel={false} />

          {/* Step indicators */}
          <div className="flex items-center justify-between mt-3">
            {([1, 2, 3, 4, 5, 6] as OnboardingStep[]).map((step) => (
              <div key={step} className="flex items-center">
                <button
                  onClick={() => step < currentStep && setCurrentStep(step)}
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step < currentStep
                      ? 'bg-emerald-600 text-white cursor-pointer hover:bg-emerald-700'
                      : step === currentStep
                      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 ring-2 ring-emerald-500'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {step < currentStep ? <CheckCircle className="w-4 h-4" /> : step}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="transition-all duration-300 ease-out">
          {currentStep === 1 && <StepWelcome />}
          {currentStep === 2 && <StepBasicInfo />}
          {currentStep === 3 && <StepSkillsCompany />}
          {currentStep === 4 && <StepPortfolio />}
          {currentStep === 5 && <StepCollegeId />}
          {currentStep === 6 && <StepPreview />}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-200 dark:border-slate-700">
          {currentStep > 1 ? (
            <button
              onClick={goBack}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-400 hover:border-emerald-300 dark:hover:border-emerald-700 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-3">
            {currentStep < TOTAL_STEPS && currentStep !== 1 && (
              <button
                onClick={skipStep}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
              >
                Skip for now
              </button>
            )}

            {currentStep < TOTAL_STEPS ? (
              <button
                onClick={goNext}
                disabled={!canProceed()}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  canProceed()
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-200 dark:shadow-emerald-900/30'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                }`}
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                disabled={isCompleting}
                className="flex items-center gap-2 px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-all shadow-sm shadow-emerald-200 dark:shadow-emerald-900/30 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isCompleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Setting up...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Complete Setup
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
