
import { Deal, Container, LogisticsInfo } from './types';

const managers = ['Иван Иванов', 'Петр Сидоров', 'Мария Петрова', 'Алексей Смирнов'];
const logisticians = ['Дмитрий Лог', 'Сергей Транс', 'Елена Склад'];
const terminals = ['ТЛЦ Белый Раст', 'Ворсино', 'Ховрино', 'Электроугли', 'Селятино'];

const generateContainers = (count: number): Container[] => {
  return Array.from({ length: count }).map((_, i) => {
    const cost = Math.floor(Math.random() * 50000) + 100000;
    const sale = cost + Math.floor(Math.random() * 30000) + 5000;
    return {
      id: `cont-${Math.random().toString(36).substr(2, 9)}`,
      number: `CONT${Math.floor(Math.random() * 900000) + 100000}U`,
      terminal: terminals[Math.floor(Math.random() * terminals.length)],
      cost,
      sale
    };
  });
};

const generateLogistics = (hasLogistics: boolean): LogisticsInfo | undefined => {
  if (!hasLogistics) return undefined;

  const transportCost = Math.floor(Math.random() * 20000) + 15000;
  const craneCost = Math.random() > 0.3 ? Math.floor(Math.random() * 5000) + 3000 : 0;
  const extrasCost = Math.random() > 0.5 ? Math.floor(Math.random() * 3000) + 1000 : 0;

  return {
    id: `log-${Math.random().toString(36).substr(2, 9)}`,
    spLink: `https://crm.example.com/logistics/${Math.floor(Math.random() * 1000)}`,
    logistician: logisticians[Math.floor(Math.random() * logisticians.length)],
    transport: { cost: transportCost, sale: transportCost + Math.floor(Math.random() * 5000) },
    crane: { cost: craneCost, sale: craneCost > 0 ? craneCost + 1000 : 0 },
    extras: { cost: extrasCost, sale: extrasCost } // Usually sold at cost
  };
};

export const generateDeals = (count: number): Deal[] => {
  return Array.from({ length: count }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 60));
    
    return {
      id: `deal-${i}`,
      closeDate: date.toISOString().split('T')[0],
      title: `Сделка №${1024 + i} (${i % 2 === 0 ? 'Контейнеры' : 'Опт'})`,
      contact: {
        id: `c-${i}`,
        name: `Клиент ${i + 1}`,
        phone: `+7 999 000 ${String(i).padStart(4, '0')}`
      },
      manager: managers[Math.floor(Math.random() * managers.length)],
      containers: generateContainers(Math.floor(Math.random() * 3) + 1),
      logistics: generateLogistics(Math.random() > 0.2)
    };
  });
};
