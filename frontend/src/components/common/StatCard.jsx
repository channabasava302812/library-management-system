import React from 'react';
import Tooltip from './Tooltip';

const StatCard = ({ icon: Icon, iconBg, iconColor, value, title, statusPrimary, statusSecondary, tooltipText }) => {
  return (
    <div className="bg-white border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
          <Icon className={iconColor} size={20} />
        </div>
        {tooltipText && (
          <Tooltip content={tooltipText}>
            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full cursor-help">
              Live
            </span>
          </Tooltip>
        )}
      </div>

      <div className="my-3">
        <h3 className="text-3xl font-bold tracking-tight text-slate-800">{value}</h3>
        <p className="text-xs font-medium text-slate-400 mt-0.5">{title}</p>
      </div>

      <div className="flex items-center gap-3 pt-2 border-t border-slate-50 text-xs text-slate-500">
        {statusPrimary && (
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {statusPrimary}
          </span>
        )}
        {statusSecondary && (
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            {statusSecondary}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;