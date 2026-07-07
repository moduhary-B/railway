'use client';

console.log('=== ФАЙЛ CAR-CARD ЗАГРУЖЕН ===');

import Image from 'next/image';
import Link from 'next/link';
import { Star, Calendar, Gauge, Settings, Cylinder, Award, Zap, Car, Fuel, Clock, Ruler } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export interface Car {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  engineVolume?: number;
  fuelType: string;
  transmission?: string;
  bodyType: string;
  color: string;
  location: string;
  images: string[];
  rating?: number;
  rate?: string;
  power?: number;
  drive?: string;
  isHit?: boolean;
  isNew?: boolean;
  creditFrom?: number;
  url: string;
  // Дополнительные поля для китайского каталога
  eng_type?: string;
  max_speed?: string;
  acceleration_0_100?: string;
  fuel_consumption?: string;
  dimensions?: string;
  customs?: number;
  // Признак санкционности для Японии
  sanctions?: boolean;
}

interface CarCardProps {
  car: Car;
  className?: string;
  country?: string;
}

export default function CarCard({ car, className = '', country }: CarCardProps) {
  // Временный лог для отладки
  if (car.name === 'Hongqi E-HS9') {
    console.log('Hongqi E-HS9 data:', car);
    console.log('Hongqi E-HS9 engineVolume:', car.engineVolume);
    console.log('Hongqi E-HS9 engineVolume type:', typeof car.engineVolume);
    console.log('Hongqi E-HS9 all keys:', Object.keys(car));
    console.log('Hongqi E-HS9 JSON:', JSON.stringify(car, null, 2));
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat('ru-RU').format(mileage);
  };

  const translateDrive = (drive?: string) => {
    if (!drive) return drive;
    
    const driveMapping: { [key: string]: string } = {
      'FF': 'Передний',
      'FR': 'Задний', 
      '4WD': 'Полный',
      'AWD': 'Полный',
      'FWD': 'Передний',
      'RWD': 'Задний',
      'FULLTIME4WD': 'Полный',
      'PARTTIME4WD': 'Подключаемый полный',
      '4X4': 'Полный',
      '2WD': 'Передний',
      '4wd': 'Полный',
      'fwd': 'Передний',
      'rwd': 'Задний',
      'полный': 'Полный',
      'передний': 'Передний',
      'задний': 'Задний'
    };
    
    return driveMapping[drive.toLowerCase()] || drive;
  };

  // Комиссия как на детальной странице
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

  // Курс для конвертации KRW → RUB, как на детальной странице
  const KRW_TO_RUB = 0.07;
  // Курс для конвертации CNY → RUB, как на детальной странице
  const CNY_TO_RUB = 13;
  // Курсы для Японии (детальная страница)
  const USD_TO_RUB = 90;
  const JPY_TO_RUB = 0.6;

  const toRubUsd = (usd: number) => Math.round(usd * USD_TO_RUB);
  const toRubJpy = (jpy: number) => Math.round(jpy * JPY_TO_RUB);
  const rubToJpy = (rub: number) => Math.round(rub / JPY_TO_RUB);

  // Доставка для Японии по правилам детальной страницы, от скорректированной цены
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

  // Цены брокера по странам
  const getBrokerCost = (countryParam: string | null): number => {
    const countryKey = (countryParam || '').toLowerCase();
    switch (countryKey) {
      case 'japan':
        return 20000;
      case 'korea':
        return 100000;
      case 'china':
        return 75000;
      default:
        return 0;
    }
  };

  // Цена для отображения в каталоге (правила для Кореи)
  const getDisplayedPrice = (): number => {
    const basePrice = car.price || 0;
    if ((country || '').toLowerCase() === 'korea') {
      const minus165k = Math.max(0, basePrice - 165000);
      const commission = calculateCommission(minus165k);
      const deliveryRub = Math.round(2000000 * KRW_TO_RUB);
      const broker = getBrokerCost(country || null);
      return minus165k + commission + deliveryRub + broker;
    }
    if ((country || '').toLowerCase() === 'china') {
      const subtractCnyRub = Math.round(5000 * CNY_TO_RUB);
      const adjusted = Math.max(0, basePrice - subtractCnyRub - 100000);
      const commission = calculateCommission(adjusted);
      const broker = getBrokerCost(country || null);
      // Клиентская наценка на все авто из Китая (правка msg_7)
      const CHINA_MARKUP_RUB = 150000;
      return adjusted + commission + broker + CHINA_MARKUP_RUB;
    }
    if ((country || '').toLowerCase() === 'japan') {
      const isSanctioned = Boolean((car as any).sanctions);
      // Шаг 1: вычесть нужные значения
      const subtractionRub = isSanctioned
        ? toRubJpy(3500) + 500000
        : toRubJpy(165000) + 134000;
      const adjusted = Math.max(0, basePrice - subtractionRub);
      // Шаг 2: доставка от скорректированной цены + комиссия от скорректированной цены
      const deliveryRub = calculateJapanDeliveryRub(adjusted, isSanctioned);
      const commission = calculateCommission(adjusted);
      const broker = getBrokerCost(country || null);
      return adjusted + deliveryRub + commission + broker;
    }
    return basePrice;
  };

  const getRatingStars = (rating?: number) => {
    if (!rating) return null;
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < Math.floor(rating) ? 'text-yellow-500 fill-current' : 'text-gray-400'
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-400">({rating})</span>
      </div>
    );
  };

  // Формируем ссылку на страницу с подробной информацией
  const detailUrl = country ? `/car-detail?url=${encodeURIComponent(car.url)}&country=${country}` : car.url;

  return (
    <Card className={`bg-[#1a2332]/80 backdrop-blur-sm border border-[#c9a86e]/20 hover:border-[#c9a86e]/40 transition-all duration-300 group overflow-hidden hover:shadow-2xl hover:shadow-[#c9a86e]/10 transform hover:-translate-y-1 ${className}`}>
      <CardHeader className="p-0 relative">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={car.images[0] || '/placeholder-car.jpg'}
            alt={car.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {car.isHit && (
              <Badge className="bg-gradient-to-r from-[#c9a86e] to-[#d4b876] text-[#0e1720] font-semibold">
                ХИТ
              </Badge>
            )}
            {car.isNew && (
              <Badge className="bg-green-600 hover:bg-green-700 text-white">
                NEW
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        {/* Title and Rating */}
        <div className="mb-3">
          <h3 className="font-semibold text-lg text-white mb-1 line-clamp-2 min-h-[3rem] flex items-start">
            {car.name}
          </h3>
          {getRatingStars(car.rating)}
        </div>

        {/* Price - перемещена в карточку */}
        <div className="mb-4">
          <div className="text-xl font-bold text-white">
            {formatPrice(getDisplayedPrice())} ₽
          </div>
          {car.creditFrom && (
            <div className="text-sm text-white/70">
              Кредит от {formatPrice(car.creditFrom)} ₽/мес
            </div>
          )}
        </div>

        {/* Car Details */}
        <div className={`grid grid-cols-2 gap-3 mb-4 ${country === 'japan' ? 'min-h-[6rem]' : ''}`}>
          {/* Год */}
          <div className="flex items-center text-sm text-white/70">
            <Calendar className="w-4 h-4 mr-2 text-[#c9a86e]" />
            <span>{car.year}</span>
          </div>
          
          {/* Пробег */}
          <div className="flex items-center text-sm text-white/70">
            <Gauge className="w-4 h-4 mr-2 text-[#c9a86e]" />
            <span>{formatMileage(car.mileage)} км</span>
          </div>
          
          {/* Объем двигателя - показываем для всех автомобилей */}
          {car.engineVolume && car.engineVolume > 0 && (
            <div className="flex items-center text-sm text-white/70">
              <Cylinder className="w-4 h-4 mr-2 text-[#c9a86e]" />
              <span>{car.engineVolume} см³</span>
            </div>
          )}
          
          {/* Тип кузова - только для китайского каталога */}
          {car.bodyType && country === 'china' && (
            <div className="flex items-center text-sm text-white/70">
              <Car className="w-4 h-4 mr-2 text-[#c9a86e]" />
              <span>{car.bodyType}</span>
            </div>
          )}
          
          {/* Привод */}
          {car.drive && (
            <div className="flex items-center text-sm text-white/70">
              <Settings className="w-4 h-4 mr-2 text-[#c9a86e]" />
              <span>{translateDrive(car.drive)}</span>
            </div>
          )}
          
          {/* Тип двигателя - только если есть данные */}
          {car.eng_type && car.eng_type.trim() !== "" && (
            <div className="flex items-center text-sm text-white/70">
              <Fuel className="w-4 h-4 mr-2 text-[#c9a86e]" />
              <span>{car.eng_type.replace(' полный привод', '')}</span>
            </div>
          )}
          
          {/* Мощность */}
          {car.power && (
            <div className="flex items-center text-sm text-white/70">
              <Zap className="w-4 h-4 mr-2 text-[#c9a86e]" />
              <span>{car.power} л.с.</span>
            </div>
          )}
          
          {/* Трансмиссия - только если указана и не "Не указана" */}
          {car.transmission && car.transmission !== "Не указана" && car.transmission.trim() !== "" && (
            <div className="flex items-center text-sm text-white/70">
              <Settings className="w-4 h-4 mr-2 text-[#c9a86e]" />
              <span>{car.transmission}</span>
            </div>
          )}
          
          {/* Максимальная скорость */}
          {car.max_speed && (
            <div className="flex items-center text-sm text-white/70">
              <Zap className="w-4 h-4 mr-2 text-[#c9a86e]" />
              <span>{car.max_speed} км/ч</span>
            </div>
          )}
          
          {/* Разгон до 100 км/ч */}
          {car.acceleration_0_100 && (
            <div className="flex items-center text-sm text-white/70">
              <Clock className="w-4 h-4 mr-2 text-[#c9a86e]" />
              <span>{car.acceleration_0_100} с</span>
            </div>
          )}
          
          {/* Расход топлива */}
          {car.fuel_consumption && (
            <div className="flex items-center text-sm text-white/70">
              <Fuel className="w-4 h-4 mr-2 text-[#c9a86e]" />
              <span>{car.fuel_consumption}</span>
            </div>
          )}
          
          {/* Размеры */}
          {car.dimensions && (
            <div className="flex items-center text-sm text-white/70">
              <Ruler className="w-4 h-4 mr-2 text-[#c9a86e]" />
              <span>{car.dimensions}</span>
            </div>
          )}
          
          {/* Для японского каталога - оценка состояния */}
          {country === 'japan' && car.rate && (
            <div className="flex items-center text-sm text-white/70">
              <Award className="w-4 h-4 mr-2 text-[#c9a86e]" />
              <span>{car.rate}</span>
            </div>
          )}
        </div>

        {/* Actions - убрана кнопка с щитом */}
        <div className="flex gap-2">
          <Link href={detailUrl} className="flex-1">
            <Button className="w-full bg-gradient-to-r from-[#c9a86e] to-[#d4b876] hover:from-[#d4b876] hover:to-[#c9a86e] text-[#0e1720] font-semibold shadow-lg hover:shadow-[#c9a86e]/25">
              Подробнее
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
} 