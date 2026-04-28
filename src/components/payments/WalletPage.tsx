import { useState } from 'react';
import {
  Wallet,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  IndianRupee,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import type { Transaction, Wallet as WalletType } from '../../types';
import { AIPriceAdvisor } from '../ai/AIAssistant';

// --------------- helpers ---------------

function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

// --------------- mock data ---------------

const MOCK_WALLET: WalletType = {
  id: 'w-1',
  user_id: 'u-1',
  balance: 12450.0,
  escrow_balance: 3500.0,
  total_earned: 48500.0,
  total_spent: 23100.0,
  created_at: '2025-09-01T00:00:00Z',
  updated_at: '2026-04-25T00:00:00Z',
};

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'txn-1',
    order_id: 'ord-1',
    user_id: 'u-1',
    amount: 3500.0,
    type: 'escrow_deposit',
    status: 'completed',
    description: 'Escrow deposit for E-commerce Landing Page Design',
    created_at: '2026-04-25T14:30:00Z',
  },
  {
    id: 'txn-2',
    order_id: 'ord-4',
    user_id: 'u-1',
    amount: 1500.0,
    type: 'escrow_release',
    status: 'completed',
    description: 'Payment released for Python Script for Data Scraping',
    created_at: '2026-04-22T11:15:00Z',
  },
  {
    id: 'txn-3',
    order_id: '',
    user_id: 'u-1',
    amount: 5000.0,
    type: 'wallet_add',
    status: 'completed',
    description: 'Added funds via Razorpay UPI',
    created_at: '2026-04-20T09:00:00Z',
  },
  {
    id: 'txn-4',
    order_id: '',
    user_id: 'u-1',
    amount: 2000.0,
    type: 'wallet_withdraw',
    status: 'completed',
    description: 'Withdrawn to bank account (HDFC ****4521)',
    created_at: '2026-04-18T16:45:00Z',
  },
  {
    id: 'txn-5',
    order_id: 'ord-5',
    user_id: 'u-1',
    amount: 150.0,
    type: 'commission',
    status: 'completed',
    description: 'Platform commission (10%) for WordPress Blog Customization',
    created_at: '2026-04-17T10:20:00Z',
  },
  {
    id: 'txn-6',
    order_id: 'ord-6',
    user_id: 'u-1',
    amount: 2750.0,
    type: 'escrow_refund',
    status: 'completed',
    description: 'Escrow refund for cancelled order - Mobile App UI Kit',
    created_at: '2026-04-15T13:00:00Z',
  },
  {
    id: 'txn-7',
    order_id: 'ord-7',
    user_id: 'u-1',
    amount: 4200.0,
    type: 'escrow_deposit',
    status: 'pending',
    description: 'Escrow deposit for React Dashboard with Charts',
    created_at: '2026-04-14T08:30:00Z',
  },
  {
    id: 'txn-8',
    order_id: '',
    user_id: 'u-1',
    amount: 10000.0,
    type: 'wallet_add',
    status: 'failed',
    description: 'Failed - Added funds via Razorpay Card',
    created_at: '2026-04-12T19:10:00Z',
  },
  {
    id: 'txn-9',
    order_id: 'ord-8',
    user_id: 'u-1',
    amount: 1800.0,
    type: 'escrow_release',
    status: 'completed',
    description: 'Payment released for Logo Design & Brand Identity',
    created_at: '2026-04-10T15:30:00Z',
  },
  {
    id: 'txn-10',
    order_id: '',
    user_id: 'u-1',
    amount: 3500.0,
    type: 'wallet_withdraw',
    status: 'pending',
    description: 'Payout requested to bank account (SBI ****7890)',
    created_at: '2026-04-08T12:00:00Z',
  },
];

// --------------- sub-components ---------------

function TypeIcon({ type }: { type: Transaction['type'] }) {
  const map: Record<Transaction['type'], { icon: React.ReactNode; bg: string; color: string }> = {
    escrow_deposit: {
      icon: <Shield className="w-4 h-4" />,
      bg: 'bg-amber-100 dark:bg-amber-900/30',
      color: 'text-amber-600 dark:text-amber-400',
    },
    escrow_release: {
      icon: <ArrowDownLeft className="w-4 h-4" />,
      bg: 'bg-emerald-100 dark:bg-emerald-900/30',
      color: 'text-emerald-600 dark:text-emerald-400',
    },
    escrow_refund: {
      icon: <ArrowUpRight className="w-4 h-4" />,
      bg: 'bg-sky-100 dark:bg-sky-900/30',
      color: 'text-sky-600 dark:text-sky-400',
    },
    wallet_add: {
      icon: <Plus className="w-4 h-4" />,
      bg: 'bg-teal-100 dark:bg-teal-900/30',
      color: 'text-teal-600 dark:text-teal-400',
    },
    wallet_withdraw: {
      icon: <ArrowUpRight className="w-4 h-4" />,
      bg: 'bg-rose-100 dark:bg-rose-900/30',
      color: 'text-rose-600 dark:text-rose-400',
    },
    commission: {
      icon: <CreditCard className="w-4 h-4" />,
      bg: 'bg-slate-100 dark:bg-slate-700',
      color: 'text-slate-500 dark:text-slate-400',
    },
  };

  const entry = map[type] ?? map.commission;
  return (
    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg ${entry.bg} ${entry.color} transition-colors`}>
      {entry.icon}
    </span>
  );
}

function StatusBadge({ status }: { status: Transaction['status'] }) {
  const map: Record<Transaction['status'], { label: string; icon: React.ReactNode; cls: string }> = {
    pending: {
      label: 'Pending',
      icon: <Clock className="w-3 h-3" />,
      cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    },
    completed: {
      label: 'Completed',
      icon: <CheckCircle className="w-3 h-3" />,
      cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    },
    failed: {
      label: 'Failed',
      icon: <XCircle className="w-3 h-3" />,
      cls: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    },
  };

  const entry = map[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${entry.cls}`}>
      {entry.icon}
      {entry.label}
    </span>
  );
}

function amountSign(type: Transaction['type']): '+' | '-' | '' {
  if (['escrow_release', 'escrow_refund', 'wallet_add'].includes(type)) return '+';
  if (['escrow_deposit', 'wallet_withdraw', 'commission'].includes(type)) return '-';
  return '';
}

function typeLabel(type: Transaction['type']): string {
  const labels: Record<Transaction['type'], string> = {
    escrow_deposit: 'Escrow Deposit',
    escrow_release: 'Payment Received',
    escrow_refund: 'Refund',
    wallet_add: 'Added Funds',
    wallet_withdraw: 'Withdrawal',
    commission: 'Commission',
  };
  return labels[type];
}

// --------------- main component ---------------

export default function WalletPage() {
  const { profile } = useAuth();
  const isFreelancer = profile?.role === 'freelancer';

  const wallet = MOCK_WALLET;
  const transactions = MOCK_TRANSACTIONS;

  const [balanceVisible, setBalanceVisible] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | Transaction['status']>('all');
  const [filterType, setFilterType] = useState<'all' | Transaction['type']>('all');

  const filteredTransactions = transactions.filter((t) => {
    if (filterStatus !== 'all' && t.status !== filterStatus) return false;
    if (filterType !== 'all' && t.type !== filterType) return false;
    return true;
  });

  const totalBalance = wallet.balance + wallet.escrow_balance;

  // ---------- balance cards ----------
  const balanceCards = [
    {
      label: 'Available Balance',
      value: balanceVisible ? formatINR(wallet.balance) : '****',
      icon: <Wallet className="w-6 h-6" />,
      gradient: 'from-emerald-500 to-teal-600',
      subtext: 'Ready to withdraw',
    },
    {
      label: 'Escrow Balance',
      value: balanceVisible ? formatINR(wallet.escrow_balance) : '****',
      icon: <Shield className="w-6 h-6" />,
      gradient: 'from-amber-500 to-orange-600',
      subtext: 'Held in escrow',
    },
    {
      label: isFreelancer ? 'Total Earned' : 'Total Spent',
      value: balanceVisible
        ? formatINR(isFreelancer ? wallet.total_earned : wallet.total_spent)
        : '****',
      icon: <TrendingUp className="w-6 h-6" />,
      gradient: 'from-teal-500 to-cyan-600',
      subtext: isFreelancer ? 'Lifetime earnings' : 'Lifetime spending',
    },
  ];

  // ---------- quick actions ----------
  const freelancerActions = [
    { label: 'Add Funds', icon: <Plus className="w-5 h-5" />, color: 'emerald' },
    { label: 'Withdraw', icon: <ArrowUpRight className="w-5 h-5" />, color: 'teal' },
    { label: 'Request Payout', icon: <IndianRupee className="w-5 h-5" />, color: 'cyan' },
  ];
  const clientActions = [
    { label: 'Add Funds', icon: <Plus className="w-5 h-5" />, color: 'emerald' },
    { label: 'Request Payout', icon: <IndianRupee className="w-5 h-5" />, color: 'teal' },
  ];
  const quickActions = isFreelancer ? freelancerActions : clientActions;

  const actionColorMap: Record<string, { bg: string; hover: string; text: string }> = {
    emerald: {
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      hover: 'hover:bg-emerald-100 dark:hover:bg-emerald-900/30',
      text: 'text-emerald-700 dark:text-emerald-400',
    },
    teal: {
      bg: 'bg-teal-50 dark:bg-teal-900/20',
      hover: 'hover:bg-teal-100 dark:hover:bg-teal-900/30',
      text: 'text-teal-700 dark:text-teal-400',
    },
    cyan: {
      bg: 'bg-cyan-50 dark:bg-cyan-900/20',
      hover: 'hover:bg-cyan-100 dark:hover:bg-cyan-900/30',
      text: 'text-cyan-700 dark:text-cyan-400',
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* ---- header ---- */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Wallet
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Manage your funds, transactions, and payouts
            </p>
          </div>
          <button
            onClick={() => setBalanceVisible((v) => !v)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
              bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700
              text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700
              transition-colors duration-200 self-start"
          >
            {balanceVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            {balanceVisible ? 'Hide balances' : 'Show balances'}
          </button>
        </div>

        {/* ---- total balance hero ---- */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 p-6 sm:p-8 text-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative z-10">
            <p className="text-emerald-100 text-sm font-medium">Total Balance</p>
            <p className="text-3xl sm:text-4xl font-bold mt-2 tracking-tight">
              {balanceVisible ? formatINR(totalBalance) : '****'}
            </p>
            <p className="text-emerald-200 text-sm mt-2">
              Available + Escrow
            </p>
          </div>
        </div>

        {/* ---- balance cards ---- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {balanceCards.map((card) => (
            <div
              key={card.label}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700
                hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{card.label}</p>
                  <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-2 truncate">
                    {card.value}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">{card.subtext}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-white shrink-0`}>
                  {card.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ---- quick actions ---- */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            {quickActions.map((action) => {
              const colors = actionColorMap[action.color];
              return (
                <button
                  key={action.label}
                  className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium
                    ${colors.bg} ${colors.hover} ${colors.text}
                    border border-transparent hover:border-slate-200 dark:hover:border-slate-600
                    transition-all duration-200`}
                >
                  {action.icon}
                  {action.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ---- transaction history ---- */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          {/* filters */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Transaction History</h2>
              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as typeof filterType)}
                  className="px-3 py-2 rounded-lg text-sm border border-slate-200 dark:border-slate-600
                    bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300
                    focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-colors"
                >
                  <option value="all">All Types</option>
                  <option value="wallet_add">Added Funds</option>
                  <option value="wallet_withdraw">Withdrawal</option>
                  <option value="escrow_deposit">Escrow Deposit</option>
                  <option value="escrow_release">Payment Received</option>
                  <option value="escrow_refund">Refund</option>
                  <option value="commission">Commission</option>
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
                  className="px-3 py-2 rounded-lg text-sm border border-slate-200 dark:border-slate-600
                    bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300
                    focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-colors"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>
          </div>

          {/* table — desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-700/50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Type</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Description</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Amount</th>
                  <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {filteredTransactions.map((txn) => {
                  const sign = amountSign(txn.type);
                  const isPositive = sign === '+';
                  return (
                    <tr
                      key={txn.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors duration-150"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <TypeIcon type={txn.type} />
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {typeLabel(txn.type)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xs truncate">
                          {txn.description}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`text-sm font-semibold ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>
                          {sign}{formatINR(txn.amount)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <StatusBadge status={txn.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="text-sm text-slate-600 dark:text-slate-400">{formatDate(txn.created_at)}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">{formatTime(txn.created_at)}</p>
                      </td>
                    </tr>
                  );
                })}
                {filteredTransactions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-400 dark:text-slate-500">
                      No transactions found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* cards — mobile */}
          <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-700">
            {filteredTransactions.map((txn) => {
              const sign = amountSign(txn.type);
              const isPositive = sign === '+';
              return (
                <div
                  key={txn.id}
                  className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors duration-150"
                >
                  <div className="flex items-center gap-3">
                    <TypeIcon type={txn.type} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {typeLabel(txn.type)}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {txn.description}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`text-sm font-semibold ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>
                        {sign}{formatINR(txn.amount)}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                        {formatDate(txn.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 ml-11">
                    <StatusBadge status={txn.status} />
                  </div>
                </div>
              );
            })}
            {filteredTransactions.length === 0 && (
              <div className="p-8 text-center text-sm text-slate-400 dark:text-slate-500">
                No transactions found matching your filters.
              </div>
            )}
          </div>
        </div>

        {/* ---- payment method & invoice ---- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AI Price Advisor */}
          <AIPriceAdvisor />
          {/* payment method */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Payment Method</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Powered by Razorpay</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-800 flex items-center justify-center">
                  <IndianRupee className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">UPI</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Pay via any UPI app</p>
                </div>
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-800 px-2 py-0.5 rounded-full">
                  Active
                </span>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
                <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-600 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Card</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Credit / Debit card</p>
                </div>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-600 px-2 py-0.5 rounded-full">
                  Available
                </span>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
                <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-600 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Net Banking</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">All major banks supported</p>
                </div>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-600 px-2 py-0.5 rounded-full">
                  Available
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 dark:text-slate-500 mt-4">
              All transactions are secured with 256-bit encryption. Razorpay integration placeholder -- connect your Razorpay keys to enable live payments.
            </p>
          </div>

          {/* invoice & info */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Generate Invoice</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                Download a detailed invoice for your transactions. Useful for tax filing and accounting.
              </p>
              <button
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium
                  bg-gradient-to-r from-emerald-600 to-teal-600 text-white
                  hover:from-emerald-700 hover:to-teal-700
                  focus:outline-none focus:ring-2 focus:ring-emerald-500/40
                  transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <CreditCard className="w-4 h-4" />
                Generate Invoice
              </button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Wallet Info</h2>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-sm text-slate-500 dark:text-slate-400">Wallet ID</dt>
                  <dd className="text-sm font-medium text-slate-700 dark:text-slate-300 font-mono">{wallet.id}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-slate-500 dark:text-slate-400">Account Type</dt>
                  <dd className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">{profile?.role ?? 'freelancer'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-slate-500 dark:text-slate-400">Currency</dt>
                  <dd className="text-sm font-medium text-slate-700 dark:text-slate-300">INR (Indian Rupee)</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-slate-500 dark:text-slate-400">Created</dt>
                  <dd className="text-sm font-medium text-slate-700 dark:text-slate-300">{formatDate(wallet.created_at)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-slate-500 dark:text-slate-400">Last Updated</dt>
                  <dd className="text-sm font-medium text-slate-700 dark:text-slate-300">{formatDate(wallet.updated_at)}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
