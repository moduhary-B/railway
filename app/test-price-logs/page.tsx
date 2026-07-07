'use client';

import { useState } from 'react';

export default function TestPriceLogsPage() {
  const [logOutput, setLogOutput] = useState<string>('');
  
  // Перехватываем console.log для отображения в интерфейсе
  const originalLog = console.log;
  console.log = function(...args: any[]) {
    originalLog.apply(console, args);
    setLogOutput(prev => prev + args.join(' ') + '\n');
  };

  const clearLogs = () => {
    setLogOutput('');
  };

  async function loadCarDetail(country: string, id: string, detailUrl: string) {
    setLogOutput('');
    console.log(`=== Загрузка автомобиля ${country}/${id} ===`);
    
    try {
      const response = await fetch(`/api/cars/${country}/${id}?detail_url=${encodeURIComponent(detailUrl)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API Response:', data);
      
      if (data.success) {
        const car = data.data;
        
        // Симулируем логику из car-detail/page.tsx
        console.log('Total price from parser:', car.total_price);
        
        // Применяем правила каталога к полной цене из детальной страницы
        const getCatalogAdjustedPrice = () => {
          if (!car) return 0;
          
          // Если есть total_price из парсера, используем его как базовую цену
          const basePrice = car.total_price || car.price || car.car_price || 0;
          
          // Курсы валют
          const KRW_TO_RUB = 0.07;
          const CNY_TO_RUB = 13;
          const USD_TO_RUB = 90;
          const JPY_TO_RUB = 0.6;
          
          const toRubJpy = (jpy: number) => Math.round(jpy * JPY_TO_RUB);
          
          // Комиссия
          const calculateCommission = (carPriceValue: number) => {
            const price = Math.max(0, Math.floor(carPriceValue));
            if (price < 1500000) return 50000;
            if (price < 2000000) return 65000;
            if (price < 3000000) return 80000;
            if (price < 4000000) return 90000;
            if (price < 5000000) return 100000;
            if (price <= 6000000) return 120000;
            return Math.round(price * 0.03);
          };
          
          // Доставка для Японии
          const calculateJapanDeliveryRub = (carPriceRub: number, sanctions?: boolean) => {
            if (!sanctions) {
              return toRubJpy(164500);
            }
            const priceJpy = Math.round(carPriceRub / JPY_TO_RUB);
            if (priceJpy <= 1_000_000) return Math.round(3120 * USD_TO_RUB);
            if (priceJpy <= 2_000_000) return Math.round(3320 * USD_TO_RUB);
            if (priceJpy <= 10_000_000) return Math.round(3520 * USD_TO_RUB);
            return Math.round(carPriceRub * 0.03) + Math.round(3520 * USD_TO_RUB);
          };
          
          // Цены брокера
          const getBrokerCost = (countryParam: string) => {
            switch (countryParam.toLowerCase()) {
              case 'japan': return 20000;
              case 'korea': return 100000;
              case 'china': return 75000;
              default: return 0;
            }
          };
          
          // Применяем правила каталога
          if (country === 'korea') {
            const minus165k = Math.max(0, basePrice - 165000);
            const commission = calculateCommission(minus165k);
            const deliveryRub = Math.round(2000000 * KRW_TO_RUB);
            const broker = getBrokerCost(country);
            const adjustedPrice = minus165k + commission + deliveryRub + broker;
            console.log('Korea catalog adjusted price:', adjustedPrice, 'from base:', basePrice);
            return adjustedPrice;
          }
          
          if (country === 'china') {
            const subtractCnyRub = Math.round(5000 * CNY_TO_RUB);
            const adjusted = Math.max(0, basePrice - subtractCnyRub - 100000);
            const commission = calculateCommission(adjusted);
            const broker = getBrokerCost(country);
            const adjustedPrice = adjusted + commission + broker;
            console.log('China catalog adjusted price:', adjustedPrice, 'from base:', basePrice);
            return adjustedPrice;
          }
          
          if (country === 'japan') {
            const isSanctioned = Boolean(car.sanctions);
            const subtractionRub = isSanctioned
              ? toRubJpy(3500) + 500000
              : toRubJpy(165000) + 134000;
            const adjusted = Math.max(0, basePrice - subtractionRub);
            const deliveryRub = calculateJapanDeliveryRub(adjusted, isSanctioned);
            const commission = calculateCommission(adjusted);
            const broker = getBrokerCost(country);
            const adjustedPrice = adjusted + deliveryRub + commission + broker;
            console.log('Japan catalog adjusted price:', adjustedPrice, 'from base:', basePrice);
            return adjustedPrice;
          }
          
          return basePrice;
        };
        
        const catalogAdjustedPrice = getCatalogAdjustedPrice();
        console.log('Catalog adjusted price:', catalogAdjustedPrice);
        
        console.log('=== Резюме ===');
        console.log(`Базовая цена (total_price): ${car.total_price}`);
        console.log(`Скорректированная цена каталога: ${catalogAdjustedPrice}`);
        console.log(`Разница: ${catalogAdjustedPrice - (car.total_price || 0)}`);
        
      } else {
        console.error('API error:', data.error);
      }
    } catch (error) {
      console.error('Error loading car detail:', error);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Тест логирования цен</h1>
        <p className="text-gray-300 mb-6">
          Откройте консоль браузера (F12 → Console) чтобы увидеть логи цен.
        </p>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Тестовые автомобили</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => loadCarDetail('korea', '39494361', '/korea/hyundai/sonata%20dn8/5atfhnz1dmgshu/')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
            >
              Корея: Hyundai Sonata
            </button>
            <button 
              onClick={() => loadCarDetail('korea', '39604552', '/korea/hyundai/avante%20cn7/5bpctgeqrsce6d/')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
            >
              Корея: Hyundai Avante
            </button>
            <button 
              onClick={() => loadCarDetail('korea', '39604673', '/korea/audi/a6%20c8/5bpdogkbqz06lh/')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
            >
              Корея: Audi A6
            </button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Логи</h2>
            <button 
              onClick={clearLogs}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
            >
              Очистить
            </button>
          </div>
          <div 
            className="bg-black text-green-400 p-4 rounded font-mono text-sm whitespace-pre-wrap overflow-y-auto max-h-96"
          >
            {logOutput || 'Логи появятся здесь после нажатия на кнопки...'}
          </div>
        </div>
      </div>
    </div>
  );
}
