'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Star, 
  Calendar, 
  Gauge, 
  Zap, 
  MapPin, 
  Shield, 
  Phone, 
  Mail, 
  MessageCircle,
  Heart,
  Share2,
  Download,
  Car,
  Users,
  Award,
  CheckCircle,
  Cylinder,
  Settings,
  DollarSign,
  AlertTriangle,
  X,
  Package,
  Fuel,
  Ruler,
  Droplets
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface CarDetail {
  id?: string;
  name: string;
  brand?: string;
  model?: string;
  year: number;
  price: number;
  mileage: number;
  engineVolume?: number;
  fuelType?: string;
  transmission?: string;
  bodyType?: string;
  color?: string;
  location?: string;
  images: string[];
  rating?: number;
  isHit?: boolean;
  isNew?: boolean;
  creditFrom?: number;
  description?: string;
  features?: string[];
  specifications?: Record<string, string>;
  // Новые поля из парсера
  complectation?: string;
  carPrice?: number;
  duty?: number;
  sanctions?: boolean;
  power?: string;
  drive?: string;
  auctionDate?: string;
  rate?: string;
  auctionSheet?: string;
  // Поля из китайского парсера
  engine_type?: string;
  customs?: number;
  equipment?: string;
  dimensions?: string;
  max_speed?: string;
  fuel_consumption?: string;
  body?: string;
  // Поле полной цены из парсера
  total_price?: number;
}

function CarDetailContent() {
  const searchParams = useSearchParams();
  const url = searchParams.get('url');
  const country = searchParams.get('country');
  
  const [car, setCar] = useState<CarDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showAllImages, setShowAllImages] = useState(false);
  const [showWhatsAppForm, setShowWhatsAppForm] = useState(false);

  useEffect(() => {
    loadCarDetail();
  }, [url, country]);

  const loadCarDetail = async () => {
    if (!url || !country) {
      setError('Отсутствуют необходимые параметры');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Извлекаем ID из URL или используем хэш URL как ID
      const urlHash = btoa(url).replace(/[^a-zA-Z0-9]/g, '').substring(0, 10);
      const response = await fetch(`/api/cars/${country}/${urlHash}?detail_url=${encodeURIComponent(url)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Преобразуем данные из парсера в формат компонента
        const carDetail: CarDetail = {
          id: data.data.lot || data.data.id || 'unknown',
          name: country === 'china' 
            ? `${data.data.brand || ''} ${data.data.name || data.data.model || ''}`.trim()
            : (data.data.name || `${data.data.brand || ''} ${data.data.model || ''}`.trim()) + (data.data.complectation ? ` ${data.data.complectation}` : ''),
          brand: data.data.brand || '',
          model: data.data.model || '',
          year: data.data.year ? parseInt(data.data.year) : 2024,
          price: data.data.price || data.data.car_price || 0,
          mileage: data.data.mileage || 0,
          engineVolume: data.data.engine_volume || data.data.engineVolume,
          fuelType: data.data.engine_type || data.data.fuelType || 'Бензин',
          transmission: data.data.transmission || data.data.kpp || 'Автомат',
          bodyType: data.data.body || data.data.bodyType || 'Седан',
          color: data.data.color || 'Не указан',
          location: data.data.location || country,
          images: Array.isArray(data.data.images) ? data.data.images : (data.data.photos ? data.data.photos : ['/placeholder-car.jpg']),
          rating: data.data.rating || undefined,
          isHit: data.data.isHit || false,
          isNew: data.data.isNew || false,
          creditFrom: data.data.creditFrom || Math.floor((data.data.car_price || 0) / 60),
          description: data.data.description || '',
          features: data.data.features || [],
          specifications: data.data.specifications || {},
          // Новые поля
          complectation: data.data.equipment || data.data.complectation,
          carPrice: data.data.car_price,
          duty: data.data.duty,
          sanctions: data.data.sanctions,
          power: data.data.power,
          drive: data.data.drive,
          auctionDate: data.data.auction_date,
          rate: data.data.rate,
          auctionSheet: data.data.auction_sheet,
          // Поля из китайского парсера
          engine_type: data.data.engine_type,
          customs: data.data.customs,
          equipment: data.data.equipment,
          dimensions: data.data.dimensions,
          max_speed: data.data.max_speed,
          fuel_consumption: data.data.fuel_consumption,
          body: data.data.body,
          // Поле полной цены из парсера
          total_price: data.data.total_price
        };
        
        setCar(carDetail);
      } else {
        console.error('API error:', data.error);
        setCar(null);
      }
    } catch (error) {
      console.error('Error loading car detail:', error);
      setCar(null);
    } finally {
      setLoading(false);
    }
  };

  // Курсы валют для перевода в ₽ (при необходимости скорректируем)
  const RATES = {
    USD: 90,   // 1 USD -> RUB
    JPY: 0.6,  // 1 JPY -> RUB
    KRW: 0.07, // 1 KRW -> RUB
    CNY: 13    // 1 CNY -> RUB
  } as const;

  const toRub = (amount: number, currency: keyof typeof RATES) => Math.round(amount * RATES[currency]);
  const rubToJpy = (rub: number) => Math.round(rub / RATES.JPY);

  // Расчёт доставки по стране/санкциям
  const calculateDeliveryRub = (countryParam: string | null, carPriceRub: number, sanctions?: boolean): number => {
    const countryKey = (countryParam || '').toLowerCase();
    if (countryKey === 'japan') {
      if (!sanctions) {
        // Несанкционные: фикс 164 500 йен
        return toRub(164500, 'JPY');
      }
      // Санкции: пороги по стоимости авто в йенах
      const priceJpy = rubToJpy(Math.max(0, carPriceRub));
      if (priceJpy <= 1000000) {
        return toRub(3120, 'USD');
      }
      if (priceJpy <= 2000000) {
        return toRub(3320, 'USD');
      }
      if (priceJpy <= 10000000) {
        return toRub(3520, 'USD');
      }
      // От 10 млн йен: 3% от стоимости + 3 520$ (процент считаем от рублёвой цены)
      return Math.round(carPriceRub * 0.03) + toRub(3520, 'USD');
    }
    if (countryKey === 'korea') {
      // 2 000 000 вон
      return toRub(2000000, 'KRW');
    }
    if (countryKey === 'china') {
      // 15 000 юаней
      return toRub(15000, 'CNY');
    }
    return 0;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat('ru-RU').format(mileage);
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

  // Расчёт комиссии по шкале
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

  // Вычисляем итоговую цену
  const getTotalPrice = () => {
    if (!car) return 0;
    const carPrice = car.price || car.carPrice || 0;
    const duty = car.duty || car.customs || 0;
    const commissionBase = carPrice + duty;
    const commission = calculateCommission(commissionBase);
    const delivery = calculateDeliveryRub(country, carPrice, car.sanctions);
    const broker = getBrokerCost(country);
    return carPrice + duty + commission + delivery + broker;
  };



  // Выводим полную цену из парсера в консоль (с применением правил каталога)
  const getCatalogAdjustedPrice = () => {
    if (!car) return 0;
    
    // Если есть total_price из парсера, используем его как базовую цену
    const basePrice = car.total_price || car.price || car.carPrice || 0;
    
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
    
    // Применяем правила каталога (точно как в car-card.tsx)
    if (country === 'korea') {
      const minus165k = Math.max(0, basePrice - 165000);
      const commission = calculateCommission(minus165k);
      const deliveryRub = Math.round(2000000 * KRW_TO_RUB);
      const broker = getBrokerCost(country);
      return minus165k + commission + deliveryRub + broker;
    }
    
    if (country === 'china') {
      const subtractCnyRub = Math.round(5000 * CNY_TO_RUB);
      const adjusted = Math.max(0, basePrice - subtractCnyRub - 100000);
      const commission = calculateCommission(adjusted);
      const broker = getBrokerCost(country);
      return adjusted + commission + broker;
    }
    
    if (country === 'japan') {
      const isSanctioned = Boolean(car.sanctions);
      // Шаг 1: вычесть нужные значения (точно как в car-card.tsx)
      const subtractionRub = isSanctioned
        ? toRubJpy(3500) + 500000
        : toRubJpy(165000) + 134000;
      const adjusted = Math.max(0, basePrice - subtractionRub);
      // Шаг 2: доставка от скорректированной цены + комиссия от скорректированной цены
      const deliveryRub = calculateJapanDeliveryRub(adjusted, isSanctioned);
      const commission = calculateCommission(adjusted);
      const broker = getBrokerCost(country);
      return adjusted + deliveryRub + commission + broker;
    }
    
    return basePrice;
  };

  // Функция для корректировки компонентов цены
  const getAdjustedPriceComponents = () => {
    if (!car) return {
      carPrice: 0,
      duty: 0,
      delivery: 0,
      broker: 0,
      commission: 0,
      total: 0
    };
    
    const totalPrice = getCatalogAdjustedPrice();
    
    // Исходные компоненты
    const carPrice = car.price || car.carPrice || 0;
    const duty = car.duty || car.customs || 0;
    const delivery = calculateDeliveryRub(country, carPrice, car.sanctions);
    const broker = getBrokerCost(country);
    const commission = calculateCommission(carPrice + duty);
    
    // Текущая сумма
    const currentSum = carPrice + duty + delivery + broker + commission;
    
    // Разница
    const difference = totalPrice - currentSum;
    
    if (difference === 0) {
      // Если разницы нет, возвращаем исходные значения
      return {
        carPrice,
        duty,
        delivery,
        broker,
        commission,
        total: totalPrice
      };
    }
    
    // Корректируем компоненты
    let adjustedCarPrice = carPrice;
    let adjustedDuty = duty;
    
    if (duty === 189738) {
      // Если пошлина = 189738, добавляем всю разницу к стоимости авто
      adjustedCarPrice = carPrice + difference;
    } else {
      // Иначе 60% к стоимости авто, 40% к пошлине
      const carPriceAdjustment = Math.round(difference * 0.6);
      const dutyAdjustment = Math.round(difference * 0.4);
      
      adjustedCarPrice = carPrice + carPriceAdjustment;
      adjustedDuty = duty + dutyAdjustment;
    }
    
    return {
      carPrice: adjustedCarPrice,
      duty: adjustedDuty,
      delivery,
      broker,
      commission,
      total: totalPrice
    };
  };

  // Выводим total_price с применением правил каталога
          if (car) {
          console.log('Car data:', car);
          console.log('Total price from parser:', getCatalogAdjustedPrice());
          console.log('Sanctions flag:', car.sanctions);
          console.log('Base price:', car.total_price);
        }
  
  // Логируем корректировку компонентов цены
  const components = getAdjustedPriceComponents();
  console.log('Adjusted price components:', {
    carPrice: components.carPrice,
    duty: components.duty,
    delivery: components.delivery,
    broker: components.broker,
    commission: components.commission,
    total: components.total
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0e1720] via-[#1a2332] to-[#0e1720] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c9a86e]"></div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0e1720] via-[#1a2332] to-[#0e1720] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Автомобиль не найден</h1>
          <p className="text-gray-400 mb-6">Запрашиваемый автомобиль не найден в каталоге.</p>
          <Link href={`/catalog/${country}`}>
            <Button className="bg-gradient-to-r from-[#c9a86e] to-[#d4b876] hover:from-[#d4b876] hover:to-[#c9a86e] text-[#0e1720] font-semibold shadow-lg hover:shadow-[#c9a86e]/25">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Вернуться в каталог
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0e1720] via-[#1a2332] to-[#0e1720]">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href={`/catalog/${country}`} className="text-gray-400 hover:text-[#c9a86e] transition-colors flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад к каталогу
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Images */}
            <div className="mb-8">
              <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-4">
                <Image
                  src={car.images[selectedImage] || '/placeholder-car.jpg'}
                  alt={car.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  {car.isHit && (
                    <Badge className="bg-gradient-to-r from-[#c9a86e] to-[#d4b876] text-[#0e1720] font-semibold">ХИТ</Badge>
                  )}
                  {car.isNew && (
                    <Badge className="bg-green-600 hover:bg-green-700 text-white">NEW</Badge>
                  )}
                </div>
                
                {/* Navigation arrows */}
                {car.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImage((prev) => (prev === 0 ? car.images.length - 1 : prev - 1))}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-colors"
                      aria-label="Предыдущее фото"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setSelectedImage((prev) => (prev === car.images.length - 1 ? 0 : prev + 1))}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-colors"
                      aria-label="Следующее фото"
                    >
                      <ArrowLeft className="w-5 h-5 rotate-180" />
                    </button>
                  </>
                )}
              </div>
              
              {/* Thumbnails */}
              {car.images.length > 1 && (
                <div className="grid grid-cols-5 gap-2 max-w-[70%]">
                  {car.images.slice(0, showAllImages ? car.images.length : 5).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative aspect-[4/3] rounded overflow-hidden transition-all duration-300 ${
                        selectedImage === index ? 'ring-2 ring-[#c9a86e] scale-105' : 'hover:ring-2 hover:ring-[#c9a86e]/50'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${car.name} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                  {car.images.length > 5 && !showAllImages && (
                    <button
                      onClick={() => setShowAllImages(true)}
                      className="relative aspect-[4/3] rounded overflow-hidden bg-[#1a2332]/80 border border-[#c9a86e]/20 flex items-center justify-center text-[#c9a86e] hover:bg-[#c9a86e]/10 transition-colors"
                    >
                      +{car.images.length - 5}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Mobile: Название под фото, над ценой */}
            <div className="lg:hidden mb-4">
              <h1 className="text-2xl font-bold text-white mb-2">{car.name}</h1>
              {getRatingStars(car.rating)}
            </div>

            {/* Mobile: Цена и контакты под фото, над характеристиками */}
            <div className="lg:hidden space-y-6 mb-8">
              {/* Price Card (mobile) */}
              <Card className="bg-[#1a2332]/80 backdrop-blur-sm border border-[#c9a86e]/20">
                <CardHeader>
                  <CardTitle className="text-white">Цена</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white mb-4">
                    {formatPrice(getAdjustedPriceComponents().total)} ₽
                  </div>
                  <div className="space-y-2 mb-4 text-sm">
                    {(getAdjustedPriceComponents().carPrice > 0) && (
                      <div className="flex justify-between text-gray-300">
                        <span>Стоимость автомобиля:</span>
                        <span>{formatPrice(getAdjustedPriceComponents().carPrice)} ₽</span>
                      </div>
                    )}
                    <div className="flex justify-between text-gray-300">
                      <span>Доставка:</span>
                      <span>{formatPrice(getAdjustedPriceComponents().delivery)} ₽</span>
                    </div>
                    {(getAdjustedPriceComponents().duty > 0) && (
                      <div className="flex justify-between text-gray-300">
                        <span>Пошлины:</span>
                        <span>{formatPrice(getAdjustedPriceComponents().duty)} ₽</span>
                      </div>
                    )}
                    <div className="flex justify-between text-gray-300">
                      <span>Услуги брокера:</span>
                      <span>{formatPrice(getAdjustedPriceComponents().broker)} ₽</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Комиссия компании:</span>
                      <span>{formatPrice(getAdjustedPriceComponents().commission)} ₽</span>
                    </div>
                  </div>
                  {car.sanctions && (
                    <div className="mb-4 p-3 bg-[#c9a86e]/10 border border-[#c9a86e]/30 rounded-lg">
                      <div className="flex items-center text-[#c9a86e]">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        <span className="text-sm font-medium">Санкционная машина</span>
                      </div>
                    </div>
                  )}
                  <div className="space-y-3">
                    <Button className="w-full bg-gradient-to-r from-[#c9a86e] to-[#d4b876] hover:from-[#d4b876] hover:to-[#c9a86e] text-[#0e1720] font-semibold shadow-lg hover:shadow-[#c9a86e]/25">
                      <Phone className="w-4 h-4 mr-2" />
                      Позвонить
                    </Button>
                    <Button 
                      onClick={() => setShowWhatsAppForm(true)}
                      variant="outline" 
                      className="w-full border-[#c9a86e]/30 text-gray-300 hover:bg-[#c9a86e]/10 hover:border-[#c9a86e]/50"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Написать
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Info (mobile) */}
              <Card className="bg-[#1a2332]/80 backdrop-blur-sm border border-[#c9a86e]/20">
                <CardHeader>
                  <CardTitle className="text-white">Контакты</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 text-[#c9a86e] mr-2" />
                      <span className="text-gray-300">+7 (995) 868−97−68</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 text-[#c9a86e] mr-2" />
                      <span className="text-gray-300">orient.cars@mail.ru</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Car Info */}
            <div className="space-y-6">
              <div className="hidden lg:block">
                <h1 className="text-3xl font-bold text-white mb-2">{car.name}</h1>
                {getRatingStars(car.rating)}
              </div>

              {/* Single Specifications Table */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Always shown for China */}
                <div className="flex items-center justify-between p-3 bg-[#1a2332]/50 rounded-lg border border-[#c9a86e]/20">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-[#c9a86e]" />
                    <span className="text-gray-400">Год</span>
                  </div>
                  <span className="font-semibold text-white">{car.year}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#1a2332]/50 rounded-lg border border-[#c9a86e]/20">
                  <div className="flex items-center">
                    <Gauge className="w-5 h-5 mr-2 text-[#c9a86e]" />
                    <span className="text-gray-400">Пробег</span>
                  </div>
                  <span className="font-semibold text-white">{formatMileage(car.mileage)} км</span>
                </div>

                {/* Conditional characteristics for China */}
                {car.engineVolume && Number(car.engineVolume) > 0 && (
                  <div className="flex items-center justify-between p-3 bg-[#1a2332]/50 rounded-lg border border-[#c9a86e]/20">
                    <div className="flex items-center">
                      <Cylinder className="w-5 h-5 mr-2 text-[#c9a86e]" />
                      <span className="text-gray-400">Двигатель, см³</span>
                    </div>
                    <span className="font-semibold text-white">{car.engineVolume}</span>
                  </div>
                )}
                {car.equipment && car.equipment !== '' && (
                  <div className="flex items-center justify-between p-3 bg-[#1a2332]/50 rounded-lg border border-[#c9a86e]/20">
                    <div className="flex items-center">
                      <Package className="w-5 h-5 mr-2 text-[#c9a86e]" />
                      <span className="text-gray-400">Комплектация</span>
                    </div>
                    <div className="flex-1 ml-4">
                      <span className="font-semibold text-white text-xs leading-tight block">{car.equipment}</span>
                    </div>
                  </div>
                )}
                {car.power && car.power !== '' && (
                  <div className="flex items-center justify-between p-3 bg-[#1a2332]/30 rounded-lg border border-[#c9a86e]/10">
                    <div className="flex items-center">
                      <Zap className="w-5 h-5 mr-2 text-[#c9a86e]" />
                      <span className="text-gray-400">Мощность</span>
                    </div>
                    <span className="font-semibold text-white">{car.power}</span>
                  </div>
                )}
                {car.drive && car.drive !== '' && (
                  <div className="flex items-center justify-between p-3 bg-[#1a2332]/30 rounded-lg border border-[#c9a86e]/10">
                    <div className="flex items-center">
                      <Settings className="w-5 h-5 mr-2 text-[#c9a86e]" />
                      <span className="text-gray-400">Привод</span>
                    </div>
                    <span className="font-semibold text-white">{car.drive}</span>
                  </div>
                )}
                {car.engine_type && car.engine_type !== '' && (
                  <div className="flex items-center justify-between p-3 bg-[#1a2332]/30 rounded-lg border border-[#c9a86e]/10">
                    <div className="flex items-center">
                      <Fuel className="w-5 h-5 mr-2 text-[#c9a86e]" />
                      <span className="text-gray-400">Тип двигателя</span>
                    </div>
                    <span className="font-semibold text-white">{car.engine_type}</span>
                  </div>
                )}
                {car.transmission && car.transmission !== '' && car.transmission !== 'Не указана' && (
                  <div className="flex items-center justify-between p-3 bg-[#1a2332]/30 rounded-lg border border-[#c9a86e]/10">
                    <div className="flex items-center">
                      <Settings className="w-5 h-5 mr-2 text-[#c9a86e]" />
                      <span className="text-gray-400">Коробка передач</span>
                    </div>
                    <span className="font-semibold text-white">{car.transmission}</span>
                  </div>
                )}
                {car.body && car.body !== '' && (
                  <div className="flex items-center justify-between p-3 bg-[#1a2332]/30 rounded-lg border border-[#c9a86e]/10">
                    <div className="flex items-center">
                      <Car className="w-5 h-5 mr-2 text-[#c9a86e]" />
                      <span className="text-gray-400">Тип кузова</span>
                    </div>
                    <span className="font-semibold text-white">{car.body}</span>
                  </div>
                )}
                {car.dimensions && car.dimensions !== '' && (
                  <div className="flex items-center justify-between p-3 bg-[#1a2332]/30 rounded-lg border border-[#c9a86e]/10">
                    <div className="flex items-center">
                      <Ruler className="w-5 h-5 mr-2 text-[#c9a86e]" />
                      <span className="text-gray-400">Размеры</span>
                    </div>
                    <span className="font-semibold text-white">{car.dimensions}</span>
                  </div>
                )}
                {car.max_speed && car.max_speed !== '' && (
                  <div className="flex items-center justify-between p-3 bg-[#1a2332]/30 rounded-lg border border-[#c9a86e]/10">
                    <div className="flex items-center">
                      <Gauge className="w-5 h-5 mr-2 text-[#c9a86e]" />
                      <span className="text-gray-400">Максимальная скорость</span>
                    </div>
                    <span className="font-semibold text-white">{car.max_speed} км/ч</span>
                  </div>
                )}
                {car.fuel_consumption && car.fuel_consumption !== '' && (
                  <div className="flex items-center justify-between p-3 bg-[#1a2332]/30 rounded-lg border border-[#c9a86e]/10">
                    <div className="flex items-center">
                      <Droplets className="w-5 h-5 mr-2 text-[#c9a86e]" />
                      <span className="text-gray-400">Расход топлива</span>
                    </div>
                    <span className="font-semibold text-white">{car.fuel_consumption} л/100км</span>
                  </div>
                )}

                {/* Additional rows for other countries - Only if data exists */}
                {country !== 'china' && car.power && car.power !== '' && (
                  <div className="flex items-center justify-between p-3 bg-[#1a2332]/30 rounded-lg border border-[#c9a86e]/10">
                    <div className="flex items-center">
                      <Zap className="w-5 h-5 mr-2 text-[#c9a86e]" />
                      <span className="text-gray-400">Мощность</span>
                    </div>
                    <span className="font-semibold text-white">{car.power}</span>
                  </div>
                )}
                {country !== 'china' && car.drive && car.drive !== '' && (
                  <div className="flex items-center justify-between p-3 bg-[#1a2332]/30 rounded-lg border border-[#c9a86e]/10">
                    <div className="flex items-center">
                      <Settings className="w-5 h-5 mr-2 text-[#c9a86e]" />
                      <span className="text-gray-400">Привод</span>
                    </div>
                    <span className="font-semibold text-white">{car.drive}</span>
                  </div>
                )}
                {country !== 'china' && car.rate && car.rate !== '' && (
                  <div className="flex items-center justify-between p-3 bg-[#1a2332]/30 rounded-lg border border-[#c9a86e]/10">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 mr-2 text-[#c9a86e]" />
                      <span className="text-gray-400">Рейтинг</span>
                    </div>
                    <span className="font-semibold text-white">{car.rate}</span>
                  </div>
                )}
                {country !== 'china' && car.color && car.color !== '' && car.color !== 'Не указан' && (
                  <div className="flex items-center justify-between p-3 bg-[#1a2332]/30 rounded-lg border border-[#c9a86e]/10">
                    <div className="flex items-center">
                      <div className="w-5 h-5 mr-2 rounded-full border-2 border-[#c9a86e]" />
                      <span className="text-gray-400">Цвет</span>
                    </div>
                    <span className="font-semibold text-white">{car.color}</span>
                  </div>
                )}
                {country !== 'china' && car.auctionDate && car.auctionDate !== '' && country !== 'japan' && (
                  <div className="flex items-center justify-between p-3 bg-[#1a2332]/30 rounded-lg border border-[#c9a86e]/10">
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-[#c9a86e]" />
                      <span className="text-gray-400">Дата аукциона</span>
                    </div>
                    <span className="font-semibold text-white">{car.auctionDate}</span>
                  </div>
                )}
                {country !== 'china' && car.auctionSheet && car.auctionSheet !== '' && country !== 'japan' && (
                  <div className="flex items-center justify-between p-3 bg-[#1a2332]/30 rounded-lg border border-[#c9a86e]/10">
                    <div className="flex items-center">
                      <Award className="w-5 h-5 mr-2 text-[#c9a86e]" />
                      <span className="text-gray-400">Лист аукциона</span>
                    </div>
                    <span className="font-semibold text-white">{car.auctionSheet}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              {car.description && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
                    <span className="w-1 h-6 bg-gradient-to-b from-[#c9a86e] to-[#d4b876] rounded mr-3"></span>
                    Описание
                  </h3>
                  <p className="text-gray-300">{car.description}</p>
                </div>
              )}

              {/* Features */}
              {car.features && car.features.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
                    <span className="w-1 h-6 bg-gradient-to-b from-[#c9a86e] to-[#d4b876] rounded mr-3"></span>
                    Особенности
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {car.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-gray-300">
                        <CheckCircle className="w-4 h-4 text-[#c9a86e] mr-2" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Specifications */}
              {car.specifications && Object.keys(car.specifications).length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
                    <span className="w-1 h-6 bg-gradient-to-b from-[#c9a86e] to-[#d4b876] rounded mr-3"></span>
                    Технические характеристики
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(car.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-gray-400">{key}:</span>
                        <span className="text-white">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar (desktop only) */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Price Card */}
              <Card className="bg-[#1a2332]/80 backdrop-blur-sm border border-[#c9a86e]/20">
                <CardHeader>
                  <CardTitle className="text-white">Цена</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white mb-4">
                    {formatPrice(getAdjustedPriceComponents().total)} ₽
                  </div>
                  
                  {/* Price Breakdown */}
                  <div className="space-y-2 mb-4 text-sm">
                    {(getAdjustedPriceComponents().carPrice > 0) && (
                      <div className="flex justify-between text-gray-300">
                        <span>Стоимость автомобиля:</span>
                        <span>{formatPrice(getAdjustedPriceComponents().carPrice)} ₽</span>
                      </div>
                    )}
                    <div className="flex justify-between text-gray-300">
                      <span>Доставка:</span>
                      <span>{formatPrice(getAdjustedPriceComponents().delivery)} ₽</span>
                    </div>
                    {(getAdjustedPriceComponents().duty > 0) && (
                      <div className="flex justify-between text-gray-300">
                        <span>Пошлины:</span>
                        <span>{formatPrice(getAdjustedPriceComponents().duty)} ₽</span>
                      </div>
                    )}
                    <div className="flex justify-between text-gray-300">
                      <span>Услуги брокера:</span>
                      <span>{formatPrice(getAdjustedPriceComponents().broker)} ₽</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Комиссия компании:</span>
                      <span>{formatPrice(getAdjustedPriceComponents().commission)} ₽</span>
                    </div>
                  </div>

                  {/* Sanctions Warning */}
                  {car.sanctions && (
                    <div className="mb-4 p-3 bg-[#c9a86e]/10 border border-[#c9a86e]/30 rounded-lg">
                      <div className="flex items-center text-[#c9a86e]">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        <span className="text-sm font-medium">Санкционная машина</span>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <Button className="w-full bg-gradient-to-r from-[#c9a86e] to-[#d4b876] hover:from-[#d4b876] hover:to-[#c9a86e] text-[#0e1720] font-semibold shadow-lg hover:shadow-[#c9a86e]/25">
                      <Phone className="w-4 h-4 mr-2" />
                      Позвонить
                    </Button>
                    <Button 
                      onClick={() => setShowWhatsAppForm(true)}
                      variant="outline" 
                      className="w-full border-[#c9a86e]/30 text-gray-300 hover:bg-[#c9a86e]/10 hover:border-[#c9a86e]/50"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Написать
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <Card className="bg-[#1a2332]/80 backdrop-blur-sm border border-[#c9a86e]/20">
                <CardHeader>
                  <CardTitle className="text-white">Контакты</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 text-[#c9a86e] mr-2" />
                      <span className="text-gray-300">+7 (995) 868−97−68</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 text-[#c9a86e] mr-2" />
                      <span className="text-gray-300">orient.cars@mail.ru</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Form Modal */}
      {showWhatsAppForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1a2332] border border-[#c9a86e]/20 rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Написать в WhatsApp</h3>
              <button
                onClick={() => setShowWhatsAppForm(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Ваше имя
                </label>
                <input
                  type="text"
                  placeholder="Введите ваше имя"
                  className="w-full px-3 py-2 bg-[#0e1720] border border-[#c9a86e]/30 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-[#c9a86e]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Номер телефона
                </label>
                <input
                  type="tel"
                  placeholder="+7 (995) 868−97−68"
                  className="w-full px-3 py-2 bg-[#0e1720] border border-[#c9a86e]/30 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-[#c9a86e]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Сообщение
                </label>
                <textarea
                  placeholder={`Здравствуйте! Интересует автомобиль ${car?.name || ''}`}
                  rows={3}
                  className="w-full px-3 py-2 bg-[#0e1720] border border-[#c9a86e]/30 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-[#c9a86e] resize-none"
                />
              </div>
              
              <Button 
                className="w-full bg-gradient-to-r from-[#c9a86e] to-[#d4b876] hover:from-[#d4b876] hover:to-[#c9a86e] text-[#0e1720] font-semibold shadow-lg hover:shadow-[#c9a86e]/25"
                onClick={() => {
                  // Здесь будет логика отправки в WhatsApp
                  window.open(`https://wa.me/79991234567?text=${encodeURIComponent(`Здравствуйте! Интересует автомобиль ${car?.name || ''}`)}`, '_blank');
                  setShowWhatsAppForm(false);
                }}
              >
                Отправить в WhatsApp
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CarDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-[#0e1720] via-[#1a2332] to-[#0e1720] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c9a86e]"></div>
      </div>
    }>
      <CarDetailContent />
    </Suspense>
  );
} 