
import React, { useState, useMemo } from 'react';
import { generateDeals } from './mockData';
import { FilterState, Deal } from './types';
import { Filters } from './components/Filters';
import { PLTable } from './components/PLTable';
import { Money, Margin } from './components/Formatters';

const App: React.FC = () => {
  // Increased mock data to 75 deals for better MVP testing and UX feel
  const [deals] = useState<Deal[]>(() => generateDeals(75)); 
  const [filters, setFilters] = useState<FilterState>({
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    manager: '',
    logistician: '',
    terminal: ''
  });

  const managers = useMemo(() => Array.from(new Set(deals.map(d => d.manager))).sort(), [deals]);
  const logisticians = useMemo(() => Array.from(new Set(deals.filter(d => d.logistics).map(d => d.logistics!.logistician))).sort(), [deals]);
  const terminals = useMemo(() => {
    const ts = new Set<string>();
    deals.forEach(d => d.containers.forEach(c => ts.add(c.terminal)));
    return Array.from(ts).sort();
  }, [deals]);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredDeals = useMemo(() => {
    return deals.filter(deal => {
      const dateMatch = (!filters.startDate || deal.closeDate >= filters.startDate) &&
                        (!filters.endDate || deal.closeDate <= filters.endDate);
      const managerMatch = !filters.manager || deal.manager === filters.manager;
      const logisticianMatch = !filters.logistician || deal.logistics?.logistician === filters.logistician;
      
      const terminalMatch = !filters.terminal || deal.containers.some(c => c.terminal === filters.terminal);

      return dateMatch && managerMatch && logisticianMatch && terminalMatch;
    }).sort((a, b) => new Date(b.closeDate).getTime() - new Date(a.closeDate).getTime());
  }, [deals, filters]);

  // Totals for the Top Dashboard Header
  const totals = useMemo(() => {
    return filteredDeals.reduce((acc, deal) => {
      const slicedContainers = filters.terminal 
        ? deal.containers.filter(c => c.terminal === filters.terminal)
        : deal.containers;

      const contCost = slicedContainers.reduce((sum, c) => sum + c.cost, 0);
      const contSale = slicedContainers.reduce((sum, c) => sum + c.sale, 0);
      
      const log = deal.logistics;
      const logCost = log ? (log.transport.cost + log.crane.cost + log.extras.cost) : 0;
      const logSale = log ? (log.transport.sale + log.crane.sale + log.extras.sale) : 0;

      acc.cost += contCost + logCost;
      acc.sale += contSale + logSale;
      acc.margin += (contSale + logSale) - (contCost + logCost);
      return acc;
    }, { cost: 0, sale: 0, margin: 0 });
  }, [filteredDeals, filters.terminal]);

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col p-6 space-y-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200 gap-4">
        <div className="flex items-center gap-5">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-4 rounded-2xl text-white shadow-lg shadow-blue-200">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 leading-tight tracking-tight uppercase">P&L Closed Deals Report</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">Real-time Transactional Analytics v1.2</p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-10 bg-slate-50 p-5 rounded-2xl border border-slate-100 shadow-inner">
          <div className="text-right border-r pr-10 border-slate-200">
            <div className="text-[10px] uppercase text-slate-400 font-black tracking-widest mb-2">Общая Продажа</div>
            <div className="text-3xl font-black text-slate-900 tracking-tighter leading-none"><Money value={totals.sale} /></div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase text-slate-400 font-black tracking-widest mb-2">Итоговая Маржа</div>
            <div className="text-3xl font-black leading-none"><Margin value={totals.margin} /></div>
          </div>
        </div>
      </header>

      <Filters 
        filters={filters} 
        onFilterChange={handleFilterChange}
        managers={managers}
        logisticians={logisticians}
        terminals={terminals}
      />

      {filters.terminal && (
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-[1px] rounded-2xl shadow-md overflow-hidden animate-in fade-in slide-in-from-top-2 duration-500">
          <div className="bg-white px-6 py-4 flex items-center gap-5">
            <div className="p-3 bg-orange-100 rounded-xl text-orange-600 shadow-sm border border-orange-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-orange-600 text-[10px] font-black text-white rounded uppercase tracking-widest">Active</span>
                <span className="font-black text-slate-900 text-base uppercase tracking-tight">Terminal Slice Mode Activated</span>
              </div>
              <p className="text-slate-500 text-sm mt-0.5">
                Displaying data strictly for terminal <strong className="text-orange-600 font-extrabold uppercase tracking-wide">"{filters.terminal}"</strong>. 
                Logistics and aggregated totals are scoped to this terminal's contribution.
              </p>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 shadow-2xl rounded-2xl overflow-hidden border border-slate-200 bg-white">
        <PLTable deals={filteredDeals} terminalFilter={filters.terminal} />
      </main>

      <footer className="flex justify-between items-center text-slate-400 text-[9px] font-black uppercase tracking-[0.3em] py-10 px-2">
        <div>&copy; 2025 CRM BI Analytics Engine</div>
        <div className="flex gap-4">
          <span className="hover:text-blue-500 cursor-pointer transition-colors">Documentation</span>
          <span className="hover:text-blue-500 cursor-pointer transition-colors">Support</span>
          <span className="hover:text-blue-500 cursor-pointer transition-colors">Privacy Policy</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
