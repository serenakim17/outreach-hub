import React from 'react';
import { ContactStatus } from '../types';
import { Clock, CheckCircle2, Send, FileEdit, PauseCircle, Ban, CircleDot } from 'lucide-react';

interface StatusBadgeProps {
  status: ContactStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const getStatusConfig = (st: ContactStatus) => {
    switch (st) {
      case 'Follow-up Due':
        return {
          label: 'Follow-up Due',
          textColor: 'text-amber-800',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
          icon: Clock,
          iconColor: 'text-amber-600',
        };
      case 'Draft Ready':
        return {
          label: 'Draft Ready',
          textColor: 'text-indigo-800',
          bgColor: 'bg-indigo-50',
          borderColor: 'border-indigo-200',
          icon: FileEdit,
          iconColor: 'text-indigo-600',
        };
      case 'Sent':
        return {
          label: 'Sent',
          textColor: 'text-sky-800',
          bgColor: 'bg-sky-50',
          borderColor: 'border-sky-200',
          icon: Send,
          iconColor: 'text-sky-600',
        };
      case 'Replied':
        return {
          label: 'Replied',
          textColor: 'text-emerald-800',
          bgColor: 'bg-emerald-50',
          borderColor: 'border-emerald-200',
          icon: CheckCircle2,
          iconColor: 'text-emerald-600',
        };
      case 'Paused':
        return {
          label: 'Paused',
          textColor: 'text-slate-700',
          bgColor: 'bg-slate-100',
          borderColor: 'border-slate-300',
          icon: PauseCircle,
          iconColor: 'text-slate-500',
        };
      case 'Opted Out':
        return {
          label: 'Opted Out',
          textColor: 'text-rose-800',
          bgColor: 'bg-rose-50',
          borderColor: 'border-rose-200',
          icon: Ban,
          iconColor: 'text-rose-600',
        };
      case 'Not Contacted':
      default:
        return {
          label: 'Not Contacted',
          textColor: 'text-slate-700',
          bgColor: 'bg-slate-50',
          borderColor: 'border-slate-200',
          icon: CircleDot,
          iconColor: 'text-slate-400',
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  const isSmall = size === 'sm';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-md border ${config.bgColor} ${config.borderColor} ${config.textColor} ${
        isSmall ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
      }`}
    >
      <Icon className={`shrink-0 ${isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5'} ${config.iconColor}`} />
      <span>{config.label}</span>
    </span>
  );
};
