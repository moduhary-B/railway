'use client';

import { useEffect, useState } from 'react';

export default function DebugPricePage() {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const debugPrice = async () => {
      try {
        // Реальные данные Nissan Caravan 送
        const testData = {
          total_price: 2603478,
          car_price: 1391434,
          duty: 689730,
          country: 'japan',
          sanctions: true // У этой машины sanctions: true
        };

        // Курсы валют (точно как в car-card.tsx)
        const KRW_TO_RUB = 0.07;
        const CNY_TO_RUB = 13;
        const USD_TO_RUB = 90;
        const JPY_TO_RUB = 0.6;
        
        const toRubJpy = (jpy: number) => Math.round(jpy * JPY_TO_RUB);
        const toRubUsd = (usd: number) => Math.round(usd * USD_TO_RUB);
        const rubToJpy = (rub: number) => Math.round(rub / JPY_TO_RUB);
        
        // Комиссия (точно как в car-card.tsx)
        const calculateCommission = (carPriceValue: number): number => {
          const price = Math.max(0, Math.floor(carPriceValue));
          if (price < 1500000) return 50000;
          if (price < 2000000) return 65000;
          if (price < 3000000) return 80000;
          if (price < 4000000) return 90000;
          if (price < 5000000) return 100000;
          if (price <= 6000000) return 120000;
          return Math.round(price * 0.03);
        };
        
        // Доставка для Японии (точно как в car-card.tsx)
        const calculateJapanDeliveryRub = (carPriceRub: number, sanctions?: boolean): number => {
          if (!sanctions) {
            return toRubJpy(164500);
          }
          const priceJpy = rubToJpy(Math.max(0, carPriceRub));
          if (priceJpy <= 1_000_000) return toRubUsd(3120);
          if (priceJpy <= 2_000_000) return toRubUsd(3320);
          if (priceJpy <= 10_000_000) return toRubUsd(3520);
          return Math.round(carPriceRub * 0.03) + toRubUsd(3520);
        };
        
        // Цены брокера (точно как в car-card.tsx)
        const getBrokerCost = (countryParam: string): number => {
          switch (countryParam.toLowerCase()) {
            case 'japan': return 20000;
            case 'korea': return 100000;
            case 'china': return 75000;
            default: return 0;
          }
        };

        // Применяем правила каталога для Японии (санкции = true)
        const basePrice = testData.total_price;
        const isSanctioned = testData.sanctions;
        
        // Шаг 1: вычесть нужные значения (точно как в car-card.tsx)
        const subtractionRub = isSanctioned
          ? toRubJpy(3500) + 500000
          : toRubJpy(165000) + 134000;
        const adjusted = Math.max(0, basePrice - subtractionRub);
        
        // Шаг 2: доставка от скорректированной цены + комиссия от скорректированной цены
        const deliveryRub = calculateJapanDeliveryRub(adjusted, isSanctioned);
        const commission = calculateCommission(adjusted);
        const broker = getBrokerCost(testData.country);
        
        const catalogPrice = adjusted + deliveryRub + commission + broker;

        setDebugInfo({
          input: testData,
          calculations: {
            basePrice,
            isSanctioned,
            subtractionRub,
            adjusted,
            deliveryRub,
            commission,
            broker,
            catalogPrice
          },
          expected: {
            catalogPrice: 2518178,
            difference: catalogPrice - 2518178
          }
        });

      } catch (error) {
        console.error('Debug error:', error);
      } finally {
        setLoading(false);
      }
    };

    debugPrice();
  }, []);

  if (loading) {
    return <div className="p-8">Загрузка...</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Отладка цен Nissan Caravan 送</h1>
      
      {debugInfo && (
        <div className="space-y-6">
          <div className="bg-gray-100 p-4 rounded">
            <h2 className="text-lg font-semibold mb-2">Входные данные</h2>
            <pre className="text-sm">{JSON.stringify(debugInfo.input, null, 2)}</pre>
          </div>
          
          <div className="bg-blue-100 p-4 rounded">
            <h2 className="text-lg font-semibold mb-2">Расчеты</h2>
            <pre className="text-sm">{JSON.stringify(debugInfo.calculations, null, 2)}</pre>
          </div>
          
          <div className="bg-yellow-100 p-4 rounded">
            <h2 className="text-lg font-semibold mb-2">Ожидаемый результат</h2>
            <pre className="text-sm">{JSON.stringify(debugInfo.expected, null, 2)}</pre>
          </div>
          
          <div className="bg-red-100 p-4 rounded">
            <h2 className="text-lg font-semibold mb-2">Проблема</h2>
            <p>Разница между расчетной ценой каталога и ожидаемой: <strong>{debugInfo.expected.difference} ₽</strong></p>
          </div>
        </div>
      )}
    </div>
  );
}
