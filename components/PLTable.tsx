
import React, { useMemo } from 'react';
import { Deal } from '../types';
import { Money, Margin, ExternalLink } from './Formatters';

interface PLTableProps {
  deals: Deal[];
  terminalFilter: string;
}

export const PLTable: React.FC<PLTableProps> = ({ deals, terminalFilter }) => {
  // Calculate footer totals
  const totals = useMemo(() => {
    const t = {
      dealCount: deals.length,
      spCount: 0,
      contCount: 0,
      contCost: 0,
      contSale: 0,
      transCost: 0,
      transSale: 0,
      craneCost: 0,
      craneSale: 0,
      extrasCost: 0,
      extrasSale: 0,
      logTotalCost: 0,
      logTotalSale: 0,
      dealTotalCost: 0,
      dealTotalSale: 0
    };

    deals.forEach(deal => {
      const displayedContainers = terminalFilter 
        ? deal.containers.filter(c => c.terminal === terminalFilter)
        : deal.containers;

      const cCost = displayedContainers.reduce((sum, c) => sum + c.cost, 0);
      const cSale = displayedContainers.reduce((sum, c) => sum + c.sale, 0);

      t.contCount += displayedContainers.length;
      t.contCost += cCost;
      t.contSale += cSale;

      const log = deal.logistics;
      if (log) {
        t.spCount += 1;
        t.transCost += log.transport.cost;
        t.transSale += log.transport.sale;
        t.craneCost += log.crane.cost;
        t.craneSale += log.crane.sale;
        t.extrasCost += log.extras.cost;
        t.extrasSale += log.extras.sale;

        const lCost = log.transport.cost + log.crane.cost + log.extras.cost;
        const lSale = log.transport.sale + log.crane.sale + log.extras.sale;
        t.logTotalCost += lCost;
        t.logTotalSale += lSale;
      }

      const dCost = cCost + (log ? (log.transport.cost + log.crane.cost + log.extras.cost) : 0);
      const dSale = cSale + (log ? (log.transport.sale + log.crane.sale + log.extras.sale) : 0);
      t.dealTotalCost += dCost;
      t.dealTotalSale += dSale;
    });

    return t;
  }, [deals, terminalFilter]);

  // Vivid background constants for visual separation
  const BG_DEAL = "bg-blue-50/70";
  const BG_CONT = "bg-indigo-50/70";
  const BG_LOG = "bg-emerald-50/70";
  const BG_SUMMARY = "bg-amber-50/70";

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-slate-200">
      <table className="w-full text-left border-collapse min-w-[1700px]">
        <thead>
          <tr className="border-b border-slate-200 text-[10px] uppercase font-black tracking-widest text-slate-600">
            <th colSpan={4} className={`px-4 py-3 border-r border-slate-200 ${BG_DEAL} text-blue-800`}>1. Блок Сделка</th>
            <th colSpan={3} className={`px-4 py-3 border-r border-slate-200 ${BG_CONT} text-indigo-800`}>2. Блок Контейнеры (Свод)</th>
            <th colSpan={11} className={`px-4 py-3 border-r border-slate-200 ${BG_LOG} text-emerald-800`}>3. Блок Логистика</th>
            <th colSpan={3} className={`px-4 py-3 ${BG_SUMMARY} text-amber-800 text-right pr-8`}>4. Свод по сделке (P&L)</th>
          </tr>
          <tr className="bg-white border-b border-slate-200 text-xs font-bold text-slate-700 sticky top-0 z-10 shadow-sm">
            <th className={`px-3 py-3 w-28 ${BG_DEAL}`}>Дата</th>
            <th className={`px-3 py-3 w-80 ${BG_DEAL}`}>Сделка</th>
            <th className={`px-3 py-3 w-40 ${BG_DEAL}`}>Контакт</th>
            <th className={`px-3 py-3 w-40 border-r border-slate-200 ${BG_DEAL}`}>Отв. менеджер</th>
            
            <th className={`px-3 py-3 w-32 ${BG_CONT}`}>Себес Конт.</th>
            <th className={`px-3 py-3 w-32 ${BG_CONT}`}>Продажа Конт.</th>
            <th className={`px-3 py-3 w-32 border-r border-slate-200 ${BG_CONT}`}>Маржа Конт.</th>
            
            <th className={`px-3 py-3 w-40 ${BG_LOG}`}>СП Логиста</th>
            <th className={`px-3 py-3 w-40 border-r border-slate-200 ${BG_LOG}`}>Отв. логист</th>
            
            <th className={`px-2 py-3 ${BG_LOG} text-[10px]`}>Себес Перевозка</th>
            <th className={`px-2 py-3 ${BG_LOG} text-[10px]`}>Прод Перевозка</th>
            <th className={`px-2 py-3 ${BG_LOG} text-[10px] border-r border-slate-200`}>Маржа</th>
            
            <th className={`px-2 py-3 ${BG_LOG} text-[10px]`}>Себес Кран</th>
            <th className={`px-2 py-3 ${BG_LOG} text-[10px]`}>Прод Кран</th>
            <th className={`px-2 py-3 ${BG_LOG} text-[10px] border-r border-slate-200`}>Маржа</th>
            
            <th className={`px-2 py-3 ${BG_LOG} text-[10px]`}>Себес Доп</th>
            <th className={`px-2 py-3 ${BG_LOG} text-[10px]`}>Прод Доп</th>
            <th className={`px-2 py-3 ${BG_LOG} text-[10px] border-r border-slate-200`}>Маржа</th>
            
            <th className={`px-3 py-3 w-32 ${BG_SUMMARY}`}>Себес Итого</th>
            <th className={`px-3 py-3 w-32 ${BG_SUMMARY}`}>Продажа Итого</th>
            <th className={`px-3 py-3 w-32 font-black ${BG_SUMMARY}`}>Маржа Итого</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {deals.map(deal => {
            const displayedContainers = terminalFilter 
              ? deal.containers.filter(c => c.terminal === terminalFilter)
              : deal.containers;

            const contCost = displayedContainers.reduce((sum, c) => sum + c.cost, 0);
            const contSale = displayedContainers.reduce((sum, c) => sum + c.sale, 0);
            const contMargin = contSale - contCost;

            const log = deal.logistics;
            const logCost = log ? (log.transport.cost + log.crane.cost + log.extras.cost) : 0;
            const logSale = log ? (log.transport.sale + log.crane.sale + log.extras.sale) : 0;

            const totalCost = contCost + logCost;
            const totalSale = contSale + logSale;
            const totalMargin = totalSale - totalCost;

            return (
              <React.Fragment key={deal.id}>
                <tr className={`hover:bg-slate-100/50 group ${displayedContainers.length === 0 ? 'opacity-40 grayscale' : ''}`}>
                  <td className={`px-3 py-4 text-xs text-slate-500 ${BG_DEAL} bg-opacity-20`}>{deal.closeDate}</td>
                  <td className={`px-3 py-4 text-sm font-bold ${BG_DEAL} bg-opacity-20`}>
                    <ExternalLink href="#">{deal.title}</ExternalLink>
                  </td>
                  <td className={`px-3 py-4 text-xs ${BG_DEAL} bg-opacity-20`}>
                    <div className="font-semibold text-slate-700">{deal.contact.name}</div>
                    <div className="text-slate-400 text-[10px]">{deal.contact.phone}</div>
                  </td>
                  <td className={`px-3 py-4 text-xs border-r border-slate-100 ${BG_DEAL} bg-opacity-20 font-medium`}>{deal.manager}</td>
                  
                  <td className={`px-3 py-4 text-xs ${BG_CONT} bg-opacity-20`}><Money value={contCost} /></td>
                  <td className={`px-3 py-4 text-xs ${BG_CONT} bg-opacity-20`}><Money value={contSale} /></td>
                  <td className={`px-3 py-4 text-xs border-r border-slate-100 ${BG_CONT} bg-opacity-20 font-bold`}><Margin value={contMargin} /></td>
                  
                  <td className={`px-3 py-4 text-xs ${BG_LOG} bg-opacity-20 font-mono italic`}>
                    {log ? <ExternalLink href={log.spLink}>СП-{log.id.split('-')[1]}</ExternalLink> : <span className="text-slate-300">—</span>}
                  </td>
                  <td className={`px-3 py-4 text-xs border-r border-slate-100 ${BG_LOG} bg-opacity-20`}>
                    {log?.logistician || <span className="text-slate-300">—</span>}
                  </td>

                  <td className={`px-2 py-4 text-[10px] ${BG_LOG} bg-opacity-10`}><Money value={log?.transport.cost || 0} /></td>
                  <td className={`px-2 py-4 text-[10px] ${BG_LOG} bg-opacity-10`}><Money value={log?.transport.sale || 0} /></td>
                  <td className={`px-2 py-4 text-[10px] border-r border-slate-100 ${BG_LOG} bg-opacity-10`}><Margin value={(log?.transport.sale || 0) - (log?.transport.cost || 0)} /></td>
                  <td className={`px-2 py-4 text-[10px] ${BG_LOG} bg-opacity-10`}><Money value={log?.crane.cost || 0} /></td>
                  <td className={`px-2 py-4 text-[10px] ${BG_LOG} bg-opacity-10`}><Money value={log?.crane.sale || 0} /></td>
                  <td className={`px-2 py-4 text-[10px] border-r border-slate-100 ${BG_LOG} bg-opacity-10`}><Margin value={(log?.crane.sale || 0) - (log?.crane.cost || 0)} /></td>
                  <td className={`px-2 py-4 text-[10px] ${BG_LOG} bg-opacity-10`}><Money value={log?.extras.cost || 0} /></td>
                  <td className={`px-2 py-4 text-[10px] ${BG_LOG} bg-opacity-10`}><Money value={log?.extras.sale || 0} /></td>
                  <td className={`px-2 py-4 text-[10px] border-r border-slate-100 ${BG_LOG} bg-opacity-10 font-medium`}><Margin value={(log?.extras.sale || 0) - (log?.extras.cost || 0)} /></td>

                  <td className={`px-3 py-4 text-xs ${BG_SUMMARY} bg-opacity-20`}><Money value={totalCost} /></td>
                  <td className={`px-3 py-4 text-xs ${BG_SUMMARY} bg-opacity-20`}><Money value={totalSale} /></td>
                  <td className={`px-3 py-4 text-sm font-black ${BG_SUMMARY} bg-opacity-40`}><Margin value={totalMargin} /></td>
                </tr>
                {displayedContainers.map((container) => (
                  <tr key={container.id} className="bg-white/50 text-[10px] text-slate-400">
                    <td colSpan={1} className={`px-3 py-1 text-right border-r border-slate-100 italic opacity-40 ${BG_DEAL} bg-opacity-5`}>∟</td>
                    <td className={`px-3 py-1 font-mono uppercase text-slate-400 ${BG_DEAL} bg-opacity-5`}>{container.number}</td>
                    <td className={`px-3 py-1 font-medium text-indigo-400/80 ${BG_DEAL} bg-opacity-5`}>{container.terminal}</td>
                    <td className={`border-r border-slate-100 ${BG_DEAL} bg-opacity-5`}></td>
                    <td className={`px-3 py-1 italic opacity-70 ${BG_CONT} bg-opacity-5`}><Money value={container.cost} /></td>
                    <td className={`px-3 py-1 italic opacity-70 ${BG_CONT} bg-opacity-5`}><Money value={container.sale} /></td>
                    <td className={`px-3 py-1 italic font-bold text-slate-500 border-r border-slate-100 ${BG_CONT} bg-opacity-10`}>
                       <Margin value={container.sale - container.cost} />
                    </td>
                    <td colSpan={10} className={`border-r border-slate-100 ${BG_CONT} bg-opacity-5`}></td>
                    <td colSpan={3} className={`${BG_SUMMARY} bg-opacity-5`}></td>
                  </tr>
                ))}
              </React.Fragment>
            );
          })}
        </tbody>
        <tfoot className="bg-slate-50 border-t-4 border-slate-400 sticky bottom-0 z-20 shadow-[0_-8px_20px_rgba(0,0,0,0.1)]">
          <tr className="text-xs">
            <td className="px-3 py-6 uppercase text-[9px] font-black text-slate-400 tracking-[0.2em] bg-slate-100/50">ИТОГО:</td>
            <td className="px-3 py-6 min-w-[300px] border-r border-slate-200">
              <div className="flex gap-8 items-center justify-start">
                <div>
                  <div className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1 opacity-80">Закрытых сделок</div>
                  <div className="text-xl font-black text-slate-900 leading-none">{totals.dealCount}</div>
                </div>
                <div className="h-10 w-px bg-slate-300"></div>
                <div>
                  <div className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1 opacity-80">Всего контейнеров</div>
                  <div className="text-xl font-black text-slate-900 leading-none">{totals.contCount}</div>
                </div>
              </div>
            </td>
            <td colSpan={2} className="border-r border-slate-200"></td>
            
            <td className="px-3 py-6 border-r border-slate-100 bg-indigo-50/30">
              <div className="text-[8px] text-indigo-500 uppercase font-black mb-1 opacity-70">Себес Конт.</div>
              <Money value={totals.contCost} />
            </td>
            <td className="px-3 py-6 border-r border-slate-100 bg-indigo-50/30">
              <div className="text-[8px] text-indigo-500 uppercase font-black mb-1 opacity-70">Продажа Конт.</div>
              <Money value={totals.contSale} />
            </td>
            <td className="px-3 py-6 border-r border-slate-200 bg-indigo-50/50">
              <div className="text-[8px] text-indigo-600 uppercase font-black mb-1 opacity-90">Маржа Конт.</div>
              <Margin value={totals.contSale - totals.contCost} />
            </td>

            <td className="px-3 py-6 bg-emerald-50/30 border-r border-slate-100">
              <div className="text-[9px] text-emerald-600 uppercase font-black mb-1 tracking-widest opacity-80">Смарт-процессов</div>
              <div className="text-xl font-black text-slate-900">{totals.spCount}</div>
            </td>
            <td className="border-r border-slate-200 bg-emerald-50/30"></td>

            <td className="px-2 py-6 bg-emerald-50/20 border-r border-slate-100">
              <div className="text-[8px] text-emerald-600 uppercase font-black mb-1 opacity-50 leading-none">Себес Лог</div>
              <Money value={totals.transCost} />
            </td>
            <td className="px-2 py-6 bg-emerald-50/20 border-r border-slate-100">
              <div className="text-[8px] text-emerald-600 uppercase font-black mb-1 opacity-50 leading-none">Прод Лог</div>
              <Money value={totals.transSale} />
            </td>
            <td className="px-2 py-6 bg-emerald-50/20 border-r border-slate-200">
              <div className="text-[8px] text-emerald-600 uppercase font-black mb-1 opacity-50 leading-none">Маржа Лог</div>
              <Margin value={totals.transSale - totals.transCost} />
            </td>

            <td className="px-2 py-6 bg-teal-50/20 border-r border-slate-100">
              <div className="text-[8px] text-teal-600 uppercase font-black mb-1 opacity-50 leading-none">Себес Кран</div>
              <Money value={totals.craneCost} />
            </td>
            <td className="px-2 py-6 bg-teal-50/20 border-r border-slate-100">
              <div className="text-[8px] text-teal-600 uppercase font-black mb-1 opacity-50 leading-none">Прод Кран</div>
              <Money value={totals.craneSale} />
            </td>
            <td className="px-2 py-6 bg-teal-50/20 border-r border-slate-200">
              <div className="text-[8px] text-teal-600 uppercase font-black mb-1 opacity-50 leading-none">Маржа Кран</div>
              <Margin value={totals.craneSale - totals.craneCost} />
            </td>

            <td className="px-2 py-6 bg-slate-100/50 border-r border-slate-100">
              <div className="text-[8px] text-slate-500 uppercase font-black mb-1 opacity-60 leading-none">Себес Доп</div>
              <Money value={totals.extrasCost} />
            </td>
            <td className="px-2 py-6 bg-slate-100/50 border-r border-slate-100">
              <div className="text-[8px] text-slate-500 uppercase font-black mb-1 opacity-60 leading-none">Прод Доп</div>
              <Money value={totals.extrasSale} />
            </td>
            <td className="px-2 py-6 bg-slate-100/50 border-r border-slate-200">
              <div className="text-[8px] text-slate-500 uppercase font-black mb-1 opacity-60 leading-none">Маржа Доп</div>
              <Margin value={totals.extrasSale - totals.extrasCost} />
            </td>

            <td className="px-3 py-6 bg-amber-50/40 border-r border-slate-100">
              <div className="text-[8px] text-amber-600 uppercase font-black mb-1 opacity-70">Себес Сделок</div>
              <Money value={totals.dealTotalCost} />
            </td>
            <td className="px-3 py-6 bg-amber-50/40 border-r border-slate-100">
              <div className="text-[8px] text-amber-600 uppercase font-black mb-1 opacity-70">Продажа Сделок</div>
              <Money value={totals.dealTotalSale} />
            </td>
            <td className="px-3 py-6 bg-green-50 border-l-2 border-green-200 relative overflow-hidden group">
              <div className="relative z-10">
                <div className="text-[9px] text-green-700 uppercase font-black mb-1 tracking-widest">ФИНАЛЬНАЯ МАРЖА</div>
                <div className="text-xl font-black">
                  <Margin value={totals.dealTotalSale - totals.dealTotalCost} />
                </div>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};
