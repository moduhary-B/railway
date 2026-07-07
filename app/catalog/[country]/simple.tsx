'use client';

console.log('=== ПРОСТОЙ КОМПОНЕНТ ЗАГРУЖЕН ===');

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function SimpleCatalogPage() {
  console.log('=== ПРОСТАЯ ФУНКЦИЯ ВЫЗВАНА ===');
  
  const params = useParams();
  const country = params.country as string;
  
  console.log('=== ПАРАМЕТРЫ ===');
  console.log('Country:', country);
  console.log('Params:', params);
  
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    console.log('=== USE EFFECT ВЫЗВАН ===');
    console.log('Загружаем данные для страны:', country);
    
    const loadCars = async () => {
      console.log('=== LOADCARS ВЫЗВАНА ===');
      setLoading(true);
      
      try {
        console.log('=== ПЕРЕД FETCH ===');
        const response = await fetch(`/api/cars/${country}?page=1&sort=price_asc`);
        console.log('=== ПОСЛЕ FETCH ===');
        console.log('Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('=== ДАННЫЕ ПОЛУЧЕНЫ ===');
          console.log('Data:', data);
          setCars(data.data || []);
        } else {
          console.log('=== ОШИБКА API ===');
          console.log('Status:', response.status);
        }
      } catch (error) {
        console.log('=== ОШИБКА FETCH ===');
        console.log('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (country) {
      loadCars();
    }
  }, [country]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">
          Автомобили из {country === 'korea' ? 'Кореи' : country === 'japan' ? 'Японии' : 'Китая'}
        </h1>
        
        {loading ? (
          <div className="text-center">
            <p className="text-white">Загрузка...</p>
          </div>
        ) : (
          <div>
            <p className="text-white mb-4">Найдено {cars.length} автомобилей</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cars.map((car: any, index: number) => (
                <div key={index} className="bg-gray-800 rounded-lg p-4">
                  <h3 className="text-white font-semibold">{car.name}</h3>
                  <p className="text-gray-300">{car.price} ₽</p>
                  <p className="text-gray-400">{car.year} год</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 