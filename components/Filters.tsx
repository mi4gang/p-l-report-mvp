
import React from 'react';
import { FilterState } from '../types';

interface FiltersProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  managers: string[];
  logisticians: string[];
  terminals: string[];
}

export const Filters: React.FC<FiltersProps> = ({ 
  filters, 
  onFilterChange, 
  managers, 
  logisticians, 
  terminals 
}) => {
  const inputClasses = "w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all";
  const labelClasses = "block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 px-1";

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-wrap gap-6 items-end">
      <div className="flex-1 min-w-[140px]">
        <label className={labelClasses}>Период С</label>
        <input 
          type="date" 
          value={filters.startDate} 
          onChange={(e) => onFilterChange('startDate', e.target.value)}
          className={inputClasses}
        />
      </div>
      <div className="flex-1 min-w-[140px]">
        <label className={labelClasses}>Период По</label>
        <input 
          type="date" 
          value={filters.endDate} 
          onChange={(e) => onFilterChange('endDate', e.target.value)}
          className={inputClasses}
        />
      </div>
      <div className="flex-1 min-w-[180px]">
        <label className={labelClasses}>Отв. Менеджер</label>
        <select 
          value={filters.manager} 
          onChange={(e) => onFilterChange('manager', e.target.value)}
          className={inputClasses}
        >
          <option value="">Все менеджеры</option>
          {managers.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>
      <div className="flex-1 min-w-[180px]">
        <label className={labelClasses}>Отв. Логист</label>
        <select 
          value={filters.logistician} 
          onChange={(e) => onFilterChange('logistician', e.target.value)}
          className={inputClasses}
        >
          <option value="">Все логисты</option>
          {logisticians.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>
      <div className="flex-1 min-w-[180px]">
        <label className={labelClasses}>Терминал</label>
        <select 
          value={filters.terminal} 
          onChange={(e) => onFilterChange('terminal', e.target.value)}
          className={`${inputClasses} border-orange-200 bg-orange-50/30 font-semibold`}
        >
          <option value="">Все терминалы</option>
          {terminals.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div className="flex items-center pb-2">
        <button 
          onClick={() => {
            onFilterChange('startDate', '');
            onFilterChange('endDate', '');
            onFilterChange('manager', '');
            onFilterChange('logistician', '');
            onFilterChange('terminal', '');
          }}
          className="text-xs font-bold text-blue-600 hover:text-blue-800 uppercase tracking-widest transition-colors"
        >
          Сбросить
        </button>
      </div>
    </div>
  );
};
