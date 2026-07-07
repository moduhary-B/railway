'use client';

import { useState, useEffect } from 'react';

export default function TestApiPage() {
  const [japanCars, setJapanCars] = useState([]);
  const [koreaCars, setKoreaCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requestData, setRequestData] = useState<any>(null);
  const [responseData, setResponseData] = useState<any>(null);

  const testApi = async (country: string) => {
    setLoading(true);
    setError(null);
    setRequestData(null);
    setResponseData(null);
    
    try {
      // Подготавливаем данные запроса
      const requestParams = {
        page: 1,
        marka: undefined,
        model: undefined,
        year_from: undefined,
        year_to: undefined,
        price_from: undefined,
        price_to: undefined,
        mileage_from: undefined,
        mileage_to: undefined,
        eng_v_from: undefined,
        eng_v_to: undefined,
        kuzov_manual: undefined,
        kpp_type: undefined
      };
      
      setRequestData({
        url: `/api/cars/${country}`,
        method: 'GET',
        params: requestParams,
        fullUrl: `/api/cars/${country}?page=1`
      });
      
      console.log(`Тестируем API для ${country}...`);
      console.log('Request data:', requestParams);
      
      const response = await fetch(`/api/cars/${country}?page=1`);
      console.log(`Ответ API ${country}:`, response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`Данные ${country}:`, data);
        
        setResponseData({
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          data: data
        });
        
        if (country === 'japan') {
          setJapanCars(data.data || []);
        } else if (country === 'korea') {
          setKoreaCars(data.data || []);
        }
      } else {
        const errorText = await response.text();
        console.error(`Ошибка API ${country}:`, errorText);
        
        setResponseData({
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          error: errorText
        });
        
        setError(`Ошибка ${country}: ${response.status}`);
      }
    } catch (err) {
      console.error(`Ошибка запроса ${country}:`, err);
      
      setResponseData({
        error: err instanceof Error ? err.message : 'Unknown error',
        type: 'network_error'
      });
      
      setError(`Ошибка сети ${country}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Тест API</h1>
        
        <div className="flex gap-4 mb-8">
          <button 
            onClick={() => testApi('japan')}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg"
          >
            Тест Япония
          </button>
          <button 
            onClick={() => testApi('korea')}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg"
          >
            Тест Корея
          </button>
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white">Загрузка...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 mb-8">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* URL парсера */}
        {responseData?.data?.parserUrl && (
          <div className="bg-gray-800 rounded-lg p-4 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">URL парсера</h3>
            <div className="bg-black rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-yellow-400 text-sm font-semibold">Сформированная ссылка:</span>
                <a 
                  href={responseData.data.parserUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  Открыть в новой вкладке
                </a>
              </div>
              <div className="bg-gray-900 rounded p-2">
                <code className="text-green-400 text-sm break-all">
                  {responseData.data.parserUrl}
                </code>
              </div>
            </div>
            
            {responseData.data.parserInfo && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Базовый URL:</span>
                  <div className="text-blue-400 break-all">{responseData.data.parserInfo.baseUrl}</div>
                </div>
                <div>
                  <span className="text-gray-400">Путь к парсеру:</span>
                  <div className="text-green-400 break-all">{responseData.data.parserInfo.path}</div>
                </div>
                <div>
                  <span className="text-gray-400">Директория:</span>
                  <div className="text-purple-400 break-all">{responseData.data.parserInfo.directory}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* JSON данные запроса и ответа */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Запрос к API</h3>
            <div className="bg-black rounded-lg p-3 h-64 overflow-y-auto">
              <pre className="text-blue-400 text-xs whitespace-pre-wrap">
                {requestData ? JSON.stringify(requestData, null, 2) : 'Нет данных запроса'}
              </pre>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Ответ API</h3>
            <div className="bg-black rounded-lg p-3 h-64 overflow-y-auto">
              <pre className="text-green-400 text-xs whitespace-pre-wrap">
                {responseData ? JSON.stringify(responseData, null, 2) : 'Нет данных ответа'}
              </pre>
            </div>
          </div>
        </div>

        {/* Результаты */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Япония ({japanCars.length})</h2>
            <div className="space-y-4">
              {japanCars.map((car: any, index: number) => (
                <div key={index} className="bg-gray-800 rounded-lg p-4">
                  <h3 className="text-white font-semibold">{car.name}</h3>
                  <p className="text-gray-300">{car.price} ₽</p>
                  <p className="text-gray-400">{car.year} год, {car.mileage} км</p>
                  <p className="text-gray-400">{car.engineVolume} см³, {car.fuelType}</p>
                  <p className="text-gray-400">{car.transmission}, {car.bodyType}</p>
                  <div className="mt-2">
                    <details className="text-xs">
                      <summary className="text-gray-400 cursor-pointer">Полные данные</summary>
                      <pre className="text-gray-500 mt-2 whitespace-pre-wrap">
                        {JSON.stringify(car, null, 2)}
                      </pre>
                    </details>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Корея ({koreaCars.length})</h2>
            <div className="space-y-4">
              {koreaCars.map((car: any, index: number) => (
                <div key={index} className="bg-gray-800 rounded-lg p-4">
                  <h3 className="text-white font-semibold">{car.name}</h3>
                  <p className="text-gray-300">{car.price} ₽</p>
                  <p className="text-gray-400">{car.year} год, {car.mileage} км</p>
                  <p className="text-gray-400">{car.engineVolume} см³, {car.fuelType}</p>
                  <p className="text-gray-400">{car.transmission}, {car.bodyType}</p>
                  <div className="mt-2">
                    <details className="text-xs">
                      <summary className="text-gray-400 cursor-pointer">Полные данные</summary>
                      <pre className="text-gray-500 mt-2 whitespace-pre-wrap">
                        {JSON.stringify(car, null, 2)}
                      </pre>
                    </details>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Информация о системе */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Информация о системе</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
            <div>
              <p><strong>Парсеры:</strong></p>
              <p>• Япония: /auto-pars/japan/J-priority-auto.py</p>
              <p>• Корея: /auto-pars/korea/K-priority-auto.py</p>
              <p>• Китай: /auto-pars/batareyka125/batareyka125_catalog.py</p>
            </div>
            <div>
              <p><strong>API Endpoints:</strong></p>
              <p>• GET /api/cars/[country]</p>
              <p>• GET /api/cars/[country]/[id]</p>
              <p>• GET /api/logs</p>
            </div>
            <div>
              <p><strong>Логи:</strong></p>
              <p>• /logs/api-cars.log</p>
              <p>• /logs/api-car-detail.log</p>
              <p>• <a href="/logs" className="text-blue-400 hover:underline">Просмотр логов</a></p>
            </div>
            <div>
              <p><strong>Страницы:</strong></p>
              <p>• <a href="/catalog/japan" className="text-blue-400 hover:underline">Каталог Япония</a></p>
              <p>• <a href="/catalog/korea" className="text-blue-400 hover:underline">Каталог Корея</a></p>
              <p>• <a href="/logs" className="text-blue-400 hover:underline">Логи</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 