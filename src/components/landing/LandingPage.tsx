import { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  Star,
  Shield,
  Zap,
  Users,
  Briefcase,
  DollarSign,
  CheckCircle,
  ChevronRight,
  Play,
  GraduationCap,
  Award,
  TrendingUp,
  MessageSquare,
  Clock,
  Heart,
} from "lucide-react";

interface LandingPageProps {
  onGetStarted: () => void;
  onSignIn: () => void;
}

// ─── Animated counter hook ────────────────────────────────────────────────
function useCountUp(target: number, duration = 1600) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLElement | null>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const step = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

// ─── Scroll-reveal wrapper ─────────────────────────────────────────────────
function RevealOnScroll({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8"
      } ${className}`}
    >
      {children}
    </div>
  );
}

// ─── Feature card data ────────────────────────────────────────────────────
const features = [
  {
    icon: Zap,
    title: "Micro Tasks",
    description:
      "Quick gigs that wrap up in 24-72 hours. Perfect for squeezing work between classes.",
    accent: "from-emerald-400 to-teal-500",
  },
  {
    icon: Shield,
    title: "Secure Escrow",
    description:
      "Razorpay-powered escrow payments. Your money stays safe until the work is delivered.",
    accent: "from-teal-400 to-emerald-500",
  },
  {
    icon: TrendingUp,
    title: "Smart Matching",
    description:
      "AI-powered recommendations connect you with the right tasks and talent instantly.",
    accent: "from-emerald-400 to-cyan-500",
  },
  {
    icon: MessageSquare,
    title: "Real-time Chat",
    description:
      "Instant messaging with file sharing. No more waiting on email threads.",
    accent: "from-cyan-400 to-teal-500",
  },
  {
    icon: Award,
    title: "Gamification",
    description:
      "Earn XP, unlock badges, and climb the leaderboard. Work feels less like work.",
    accent: "from-teal-400 to-cyan-500",
  },
  {
    icon: GraduationCap,
    title: "Verified Profiles",
    description:
      "College ID verification builds trust. Every profile is backed by a real student.",
    accent: "from-emerald-400 to-teal-500",
  },
];

// ─── Pricing tiers ────────────────────────────────────────────────────────
const pricingTiers = [
  {
    name: "Starter",
    price: "Free",
    priceSub: "",
    description: "Get started and explore the marketplace",
    features: [
      "5 active gigs at a time",
      "Basic search & filters",
      "Standard escrow support",
      "Community forum access",
      "Email support",
    ],
    cta: "Get Started Free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "INR 299",
    priceSub: "/mo",
    description: "For serious freelancers & clients",
    features: [
      "Unlimited active gigs",
      "Priority listing in search",
      "Advanced analytics dashboard",
      "Priority support (24h)",
      "Custom portfolio URL",
      "Skill endorsement badges",
    ],
    cta: "Start Pro Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "INR 999",
    priceSub: "/mo",
    description: "For teams and organizations",
    features: [
      "Everything in Pro",
      "Dedicated account manager",
      "API access & webhooks",
      "Bulk task posting",
      "Custom branding",
      "Invoicing & compliance tools",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

// ─── Testimonials ──────────────────────────────────────────────────────────
const testimonials = [
  {
    name: "Priya Sharma",
    college: "IIT Bombay",
    quote:
      "SkillSwap helped me earn enough to cover my tuition while building a real portfolio. The escrow system means I never worry about getting paid.",
    rating: 5,
    avatar: "PS",
  },
  {
    name: "Arjun Reddy",
    college: "BITS Pilani",
    quote:
      "As a startup founder on campus, finding student talent used to be painfully slow. Smart matching changed everything — I posted a task and had three solid applicants in an hour.",
    rating: 5,
    avatar: "AR",
  },
  {
    name: "Sneha Patel",
    college: "VIT Vellore",
    quote:
      "The gamification is surprisingly addictive. I went from doing one gig a month to five. The XP system and leaderboard actually make freelancing fun.",
    rating: 4,
    avatar: "SP",
  },
];

// ─── College logos (text-based) ───────────────────────────────────────────
const colleges = ["IIT", "BITS", "NIT", "VIT", "DTU", "IIIT"];

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
export default function LandingPage({ onGetStarted, onSignIn }: LandingPageProps) {
  const [activeTab, setActiveTab] = useState<"freelancer" | "client">(
    "freelancer"
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ── Smooth scroll helper ─────────────────────────────────────────────────
  const scrollTo = (id: string) => {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileMenuOpen(false);
  };

  // ── Animated stat counters ───────────────────────────────────────────────
  const stat10k = useCountUp(10);
  const stat5k = useCountUp(5);
  const stat500 = useCountUp(500);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 overflow-x-hidden">
      {/* ── NAVBAR ──────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg border-b border-gray-200/60 dark:border-gray-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2 font-bold text-lg tracking-tight"
          >
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-sm">
              <Zap className="w-4 h-4" />
            </span>
            <span className="text-emerald-600 dark:text-emerald-400">
              SkillSwap
            </span>{" "}
            Campus
          </button>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600 dark:text-gray-400">
            <button
              onClick={() => scrollTo("features")}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollTo("how-it-works")}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollTo("pricing")}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollTo("testimonials")}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              Testimonials
            </button>
          </div>

          {/* CTA buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onSignIn}
              className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={onGetStarted}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
            >
              Get Started
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200/60 dark:border-gray-800/60 bg-white dark:bg-gray-950 px-4 pb-4 pt-2 space-y-2">
            {["Features", "How It Works", "Pricing", "Testimonials"].map(
              (label) => (
                <button
                  key={label}
                  onClick={() =>
                    scrollTo(
                      label
                        .toLowerCase()
                        .replace(/\s+/g, "-")
                    )
                  }
                  className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {label}
                </button>
              )
            )}
            <div className="pt-2 border-t border-gray-200/60 dark:border-gray-800/60 flex gap-3">
              <button
                onClick={onSignIn}
                className="flex-1 text-sm font-medium py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={onGetStarted}
                className="flex-1 text-sm font-semibold py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
        {/* Background gradient */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-gradient-to-br from-emerald-400/20 via-teal-400/10 to-cyan-400/5 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-gradient-to-tl from-teal-400/15 to-emerald-400/5 blur-3xl" />
          <div className="absolute top-20 left-0 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-emerald-300/10 to-transparent blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <RevealOnScroll>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 mb-6">
              <Zap className="w-3 h-3" />
              Now in 500+ colleges across India
            </span>
          </RevealOnScroll>

          {/* Headline */}
          <RevealOnScroll delay={100}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
              The Student Marketplace
              <br />
              <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                That Pays
              </span>
            </h1>
          </RevealOnScroll>

          {/* Subtext */}
          <RevealOnScroll delay={200}>
            <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              Turn your skills into income between classes. Post tasks, find
              gigs, and get paid securely — all within your campus community.
            </p>
          </RevealOnScroll>

          {/* CTA buttons */}
          <RevealOnScroll delay={300}>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onGetStarted}
                className="group inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </button>
              <button className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-300">
                <Play className="w-4 h-4 text-emerald-500" />
                Watch Demo
              </button>
            </div>
          </RevealOnScroll>

          {/* Floating stat badges */}
          <RevealOnScroll delay={400}>
            <div className="mt-16 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              {[
                {
                  ...stat10k,
                  label: "Students",
                  suffix: "K+",
                  icon: Users,
                },
                {
                  ...stat5k,
                  label: "Tasks Completed",
                  suffix: "K+",
                  icon: Briefcase,
                },
                {
                  ...stat500,
                  label: "Colleges",
                  suffix: "+",
                  icon: GraduationCap,
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/70 dark:bg-gray-900/70 backdrop-blur border border-gray-200/60 dark:border-gray-800/60 shadow-lg shadow-gray-200/20 dark:shadow-black/20"
                >
                  <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white">
                    <stat.icon className="w-5 h-5" />
                  </span>
                  <span className="text-left">
                    <span
                      ref={stat.ref}
                      className="block text-2xl font-bold tracking-tight"
                    >
                      {stat.count}
                      {stat.suffix}
                    </span>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      {stat.label}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* ── TRUSTED BY ─────────────────────────────────────────────────── */}
      <section className="py-12 border-y border-gray-200/60 dark:border-gray-800/60 bg-gray-50/50 dark:bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-8">
            Trusted by students at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
            {colleges.map((name) => (
              <span
                key={name}
                className="text-2xl sm:text-3xl font-extrabold tracking-tighter text-gray-300 dark:text-gray-600 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors duration-300 cursor-default select-none"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────────────────── */}
      <section id="features" className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 mb-4">
                <Zap className="w-3 h-3" />
                Features
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Everything you need to{" "}
                <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                  earn & hire
                </span>
              </h2>
              <p className="mt-4 text-gray-600 dark:text-gray-400 text-lg">
                Built specifically for the student ecosystem — from discovering
                gigs to getting paid.
              </p>
            </div>
          </RevealOnScroll>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <RevealOnScroll key={feature.title} delay={i * 100}>
                <div className="group relative p-6 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-gray-900/50 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5">
                  {/* Icon */}
                  <span
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${feature.accent} text-white mb-4 shadow-lg`}
                  >
                    <feature.icon className="w-6 h-6" />
                  </span>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                  {/* Hover corner accent */}
                  <div
                    aria-hidden="true"
                    className={`absolute -top-px -right-px w-16 h-16 rounded-bl-3xl rounded-tr-2xl bg-gradient-to-bl ${feature.accent} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                  />
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────────── */}
      <section
        id="how-it-works"
        className="py-20 sm:py-28 bg-gray-50 dark:bg-gray-900/30"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 mb-4">
                <ChevronRight className="w-3 h-3" />
                How It Works
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Simple steps to{" "}
                <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                  get started
                </span>
              </h2>
            </div>
          </RevealOnScroll>

          {/* Tabs */}
          <RevealOnScroll>
            <div className="flex items-center justify-center gap-2 mb-12">
              <button
                onClick={() => setActiveTab("freelancer")}
                className={`px-5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${
                  activeTab === "freelancer"
                    ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                I want to work
              </button>
              <button
                onClick={() => setActiveTab("client")}
                className={`px-5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${
                  activeTab === "client"
                    ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                I want to hire
              </button>
            </div>
          </RevealOnScroll>

          {/* Steps */}
          <div className="grid md:grid-cols-3 gap-8">
            {(
              activeTab === "freelancer"
                ? [
                    {
                      step: "01",
                      title: "Create Your Profile",
                      description:
                        "Sign up with your college email, verify your student ID, and showcase your skills and portfolio.",
                      icon: Users,
                    },
                    {
                      step: "02",
                      title: "Browse & Apply",
                      description:
                        "Explore micro-tasks filtered by skill, duration, and pay. Apply with one click — smart matching boosts your visibility.",
                      icon: Briefcase,
                    },
                    {
                      step: "03",
                      title: "Deliver & Earn",
                      description:
                        "Complete the work, get client approval, and receive payment instantly via secure escrow. No more chasing invoices.",
                      icon: DollarSign,
                    },
                  ]
                : [
                    {
                      step: "01",
                      title: "Post a Task",
                      description:
                        "Describe what you need, set a budget and deadline. Your task goes live to thousands of verified students instantly.",
                      icon: Briefcase,
                    },
                    {
                      step: "02",
                      title: "Review Applicants",
                      description:
                        "Receive applications from verified students. Check profiles, ratings, and portfolios before making your pick.",
                      icon: Users,
                    },
                    {
                      step: "03",
                      title: "Approve & Pay",
                      description:
                        "Review the delivered work, approve it, and payment is released from escrow to the freelancer. Fair and secure.",
                      icon: CheckCircle,
                    },
                  ]
            ).map((item, i) => (
              <RevealOnScroll key={`${activeTab}-${i}`} delay={i * 100}>
                <div className="relative p-6 rounded-2xl bg-white dark:bg-gray-900/60 border border-gray-200/80 dark:border-gray-800/80">
                  {/* Step number */}
                  <span className="inline-block text-5xl font-extrabold bg-gradient-to-br from-emerald-400/20 to-teal-400/10 bg-clip-text text-transparent mb-2">
                    {item.step}
                  </span>
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 mb-3">
                    <item.icon className="w-5 h-5" />
                  </span>
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Connector line (not on last) */}
                  {i < 2 && (
                    <div
                      aria-hidden="true"
                      className="hidden md:block absolute top-1/2 -right-4 w-8 border-t-2 border-dashed border-emerald-300 dark:border-emerald-700"
                    />
                  )}
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ─────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 mb-4">
                <DollarSign className="w-3 h-3" />
                Pricing
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Plans that{" "}
                <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                  grow with you
                </span>
              </h2>
              <p className="mt-4 text-gray-600 dark:text-gray-400 text-lg">
                Start free and upgrade when you are ready. No hidden fees, no
                surprises.
              </p>
            </div>
          </RevealOnScroll>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-start">
            {pricingTiers.map((tier, i) => (
              <RevealOnScroll key={tier.name} delay={i * 100}>
                <div
                  className={`relative p-6 sm:p-8 rounded-2xl border transition-all duration-300 ${
                    tier.highlighted
                      ? "border-emerald-400 dark:border-emerald-600 bg-gradient-to-b from-emerald-50/80 to-teal-50/40 dark:from-emerald-950/30 dark:to-teal-950/20 shadow-xl shadow-emerald-500/10 scale-[1.02]"
                      : "border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-gray-900/50 hover:shadow-lg hover:shadow-gray-200/20 dark:hover:shadow-black/20"
                  }`}
                >
                  {/* Popular badge */}
                  {tier.highlighted && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25">
                      Most Popular
                    </span>
                  )}

                  <h3 className="text-lg font-bold mb-1">{tier.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {tier.description}
                  </p>

                  <div className="mb-6">
                    <span className="text-4xl font-extrabold tracking-tight">
                      {tier.price}
                    </span>
                    {tier.priceSub && (
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {tier.priceSub}
                      </span>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-sm"
                      >
                        <CheckCircle className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={onGetStarted}
                    className={`w-full py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      tier.highlighted
                        ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98]"
                        : "border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    {tier.cta}
                  </button>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────────────────── */}
      <section
        id="testimonials"
        className="py-20 sm:py-28 bg-gray-50 dark:bg-gray-900/30"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 mb-4">
                <Heart className="w-3 h-3" />
                Testimonials
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Loved by{" "}
                <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                  students everywhere
                </span>
              </h2>
            </div>
          </RevealOnScroll>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <RevealOnScroll key={t.name} delay={i * 100}>
                <div className="p-6 rounded-2xl bg-white dark:bg-gray-900/60 border border-gray-200/80 dark:border-gray-800/80 hover:shadow-lg transition-shadow duration-300">
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        className={`w-4 h-4 ${
                          idx < t.rating
                            ? "text-amber-400 fill-amber-400"
                            : "text-gray-300 dark:text-gray-600"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                    &ldquo;{t.quote}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-white text-xs font-bold">
                      {t.avatar}
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{t.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {t.college}
                      </p>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ───────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 relative overflow-hidden">
        {/* Gradient background */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(255,255,255,0.08) 0%, transparent 50%)",
          }}
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <RevealOnScroll>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Ready to turn your skills
              <br />
              into real income?
            </h2>
            <p className="mt-6 text-lg text-emerald-100/80 max-w-xl mx-auto">
              Join 10,000+ students already earning on SkillSwap Campus. It
              takes less than 2 minutes to sign up.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onGetStarted}
                className="group inline-flex items-center gap-2 px-8 py-4 text-base font-bold rounded-xl bg-white text-emerald-700 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </button>
              <button className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold rounded-xl border-2 border-white/30 text-white hover:bg-white/10 transition-all duration-300">
                <Clock className="w-4 h-4" />
                Schedule a Demo
              </button>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="py-12 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200/60 dark:border-gray-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 font-bold text-lg tracking-tight mb-4">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-sm">
                  <Zap className="w-4 h-4" />
                </span>
                <span className="text-emerald-600 dark:text-emerald-400">
                  SkillSwap
                </span>{" "}
                Campus
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                The student marketplace that pays. Earn while you learn, hire
                while you build.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-sm font-semibold mb-4">Product</h4>
              <ul className="space-y-2.5 text-sm text-gray-500 dark:text-gray-400">
                <li>
                  <button
                    onClick={() => scrollTo("features")}
                    className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  >
                    Features
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollTo("pricing")}
                    className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  >
                    Pricing
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollTo("how-it-works")}
                    className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  >
                    How It Works
                  </button>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  >
                    API Docs
                  </a>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-sm font-semibold mb-4">Company</h4>
              <ul className="space-y-2.5 text-sm text-gray-500 dark:text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-sm font-semibold mb-4">Legal</h4>
              <ul className="space-y-2.5 text-sm text-gray-500 dark:text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  >
                    Refund Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  >
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-gray-200/60 dark:border-gray-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              &copy; {new Date().getFullYear()} SkillSwap Campus Ultimate v2.
              All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              {/* Social icons (simple SVG) */}
              {[
                {
                  label: "Twitter",
                  d: "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z",
                },
                {
                  label: "LinkedIn",
                  d: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 2a2 2 0 110 4 2 2 0 010-4z",
                },
                {
                  label: "GitHub",
                  d: "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22",
                },
                {
                  label: "Instagram",
                  d: "M7.5 2h9A5.5 5.5 0 0122 7.5v9a5.5 5.5 0 01-5.5 5.5h-9A5.5 5.5 0 012 16.5v-9A5.5 5.5 0 017.5 2zm4.5 5a5 5 0 105 5 5 5 0 00-5-5zm5.5-.75a.75.75 0 11-.75-.75.75.75 0 01.75.75z",
                },
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  className="text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <path d={social.d} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
