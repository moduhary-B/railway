'use client';

console.log('=== ТЕСТОВЫЙ КОМПОНЕНТ ЗАГРУЖЕН ===');

import { useParams } from 'next/navigation';

export default function TestPage() {
  console.log('=== ТЕСТОВАЯ ФУНКЦИЯ ВЫЗВАНА ===');
  
  const params = useParams();
  const country = params.country as string;
  
  console.log('=== ТЕСТОВЫЕ ПАРАМЕТРЫ ===');
  console.log('Params:', params);
  console.log('Country:', country);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Тестовая страница</h1>
        <p className="text-gray-400">Страна: {country}</p>
        <p className="text-gray-400">Параметры: {JSON.stringify(params)}</p>
      </div>
    </div>
  );
} 