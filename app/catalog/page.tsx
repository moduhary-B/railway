'use client';

console.log('=== СТРАНИЦА КАТАЛОГА ЗАГРУЖЕНА ===');

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Car, MapPin, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const countries = [
  {
    id: 'korea',
    name: 'Корея',
    description: 'Качественные автомобили из Южной Кореи',
    image: '/images/korea-cars.jpg',
    color: 'from-[#c9a86e] to-[#d4b876]',
    stats: {
      cars: '1500+',
      brands: '5',
      avgPrice: '2.5M ₽'
    },
    features: [
      'Kia, Hyundai, Genesis',
      'Современные технологии',
      'Высокое качество сборки',
      'Экономичный расход топлива'
    ]
  },
  {
    id: 'china',
    name: 'Китай',
    description: 'Доступные автомобили из Китая',
    image: '/images/china-cars.jpg',
    color: 'from-[#c9a86e] to-[#d4b876]',
    stats: {
      cars: '2000+',
      brands: '8',
      avgPrice: '1.8M ₽'
    },
    features: [
      'BYD, Chery, Geely',
      'Современный дизайн',
      'Богатая комплектация',
      'Доступные цены'
    ]
  },
  {
    id: 'japan',
    name: 'Япония',
    description: 'Надежные автомобили из Японии',
    image: '/images/japan-cars.jpg',
    color: 'from-[#c9a86e] to-[#d4b876]',
    stats: {
      cars: '3000+',
      brands: '12',
      avgPrice: '3.2M ₽'
    },
    features: [
      'Toyota, Honda, Nissan',
      'Высокая надежность',
      'Отличная репутация',
      'Долговечность'
    ]
  }
];

export default function CatalogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1a] via-[#0e1720] to-[#1a2332]">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Каталог автомобилей
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Выберите страну происхождения и найдите идеальный автомобиль для себя
          </p>
        </div>

        {/* Countries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {countries.map((country) => (
            <Card key={country.id} className="bg-[#1a2332]/80 backdrop-blur-sm border border-[#c9a86e]/20 hover:border-[#c9a86e]/40 transition-all duration-300 group hover:shadow-2xl hover:shadow-[#c9a86e]/10 transform hover:-translate-y-2">
              <CardHeader className="relative overflow-hidden rounded-t-lg">
                <div className={`absolute inset-0 bg-gradient-to-r ${country.color} opacity-20 group-hover:opacity-30 transition-opacity`} />
                <div className="relative z-10">
                  <CardTitle className="text-2xl font-bold text-white mb-2">
                    {country.name}
                  </CardTitle>
                  <p className="text-white/70">{country.description}</p>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#c9a86e]">{country.stats.cars}</div>
                    <div className="text-sm text-white/60">Автомобилей</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#c9a86e]">{country.stats.brands}</div>
                    <div className="text-sm text-white/60">Брендов</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#c9a86e]">{country.stats.avgPrice}</div>
                    <div className="text-sm text-white/60">Средняя цена</div>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2 mb-6">
                  {country.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-white/80">
                      <Star className="w-4 h-4 text-[#c9a86e] mr-2 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Link href={`/catalog/${country.id}`}>
                  <Button className="w-full bg-gradient-to-r from-[#c9a86e] to-[#d4b876] hover:from-[#d4b876] hover:to-[#c9a86e] text-[#0e1720] font-semibold rounded-lg group-hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-[#c9a86e]/25">
                    Перейти в каталог
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="bg-[#1a2332]/80 backdrop-blur-sm border border-[#c9a86e]/20 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Почему выбирают Orient Auto?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#c9a86e] to-[#d4b876] flex items-center justify-center text-[#0e1720] mb-3">
                <Car className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Большой выбор</h3>
              <p className="text-white/70 text-sm">
                Более 6000 автомобилей в каталоге
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#c9a86e] to-[#d4b876] flex items-center justify-center text-[#0e1720] mb-3">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Прямые поставки</h3>
              <p className="text-white/70 text-sm">
                Работаем напрямую с дилерами
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#c9a86e] to-[#d4b876] flex items-center justify-center text-[#0e1720] mb-3">
                <Star className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Гарантия качества</h3>
              <p className="text-white/70 text-sm">
                30 дней гарантии после получения
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 