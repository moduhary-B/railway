'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
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
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface CarDetail {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  engineVolume: number;
  fuelType: string;
  transmission: string;
  bodyType: string;
  color: string;
  location: string;
  images: string[];
  rating?: number;
  isHit?: boolean;
  isNew?: boolean;
  creditFrom?: number;
  description?: string;
  features?: string[];
  specifications?: Record<string, string>;
  seller?: {
    name: string;
    phone: string;
    email: string;
    rating: number;
  };
}

export default function CarDetailPage() {
  const params = useParams();
  const { country, id } = params;
  
  const [car, setCar] = useState<CarDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showAllImages, setShowAllImages] = useState(false);

  useEffect(() => {
    loadCarDetail();
  }, [country, id]);

  const loadCarDetail = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/cars/${country}/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Преобразуем данные из парсера в формат компонента
        const carDetail: CarDetail = {
          id: data.data.id || id as string,
          name: data.data.name || `${data.data.brand || ''} ${data.data.model || ''}`.trim(),
          brand: data.data.brand || '',
          model: data.data.model || '',
          year: data.data.year || 2024,
          price: data.data.price || 0,
          mileage: data.data.mileage || 0,
          engineVolume: data.data.engine_volume || data.data.engineVolume || 0,
          fuelType: data.data.engine_type || data.data.fuelType || 'Бензин',
          transmission: data.data.transmission || 'Автомат',
          bodyType: data.data.body || data.data.bodyType || 'Седан',
          color: data.data.color || 'Не указан',
          location: data.data.location || country as string,
          images: Array.isArray(data.data.photo) ? data.data.photo : [data.data.photo || '/placeholder-car.jpg'],
          rating: data.data.rating || undefined,
          isHit: data.data.isHit || false,
          isNew: data.data.isNew || false,
          creditFrom: data.data.creditFrom || Math.floor((data.data.price || 0) / 60),
          description: data.data.description || '',
          features: data.data.features || [],
          specifications: data.data.specifications || {},
          seller: data.data.seller || {
            name: 'Orient Auto',
            phone: '+7 (999) 123-45-67',
            email: 'info@orientavto.com',
            rating: 4.8
          }
        };
        
        setCar(carDetail);
      } else {
        console.error('API error:', data.error);
        // В случае ошибки показываем заглушку
        setCar(null);
      }
    } catch (error) {
      console.error('Error loading car detail:', error);
      setCar(null);
    } finally {
      setLoading(false);
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Автомобиль не найден</h1>
          <p className="text-gray-400 mb-6">Запрашиваемый автомобиль не найден в каталоге.</p>
          <Link href={`/catalog/${country}`}>
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Вернуться в каталог
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href={`/catalog/${country}`} className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4 inline mr-2" />
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
                    <Badge className="bg-red-600 text-white">ХИТ</Badge>
                  )}
                  {car.isNew && (
                    <Badge className="bg-green-600 text-white">NEW</Badge>
                  )}
                </div>
              </div>
              
              {/* Thumbnails */}
              {car.images.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {car.images.slice(0, showAllImages ? car.images.length : 5).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative aspect-[4/3] rounded overflow-hidden ${
                        selectedImage === index ? 'ring-2 ring-red-500' : ''
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
                      className="relative aspect-[4/3] rounded overflow-hidden bg-gray-700 flex items-center justify-center text-white hover:bg-gray-600"
                    >
                      +{car.images.length - 5}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Car Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{car.name}</h1>
                {getRatingStars(car.rating)}
              </div>

              {/* Key Specs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center text-gray-300">
                  <Calendar className="w-5 h-5 mr-2 text-red-500" />
                  <span>{car.year}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Gauge className="w-5 h-5 mr-2 text-red-500" />
                  <span>{formatMileage(car.mileage)} км</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Zap className="w-5 h-5 mr-2 text-red-500" />
                  <span>{car.engineVolume} см³</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <MapPin className="w-5 h-5 mr-2 text-red-500" />
                  <span>{car.location}</span>
                </div>
              </div>

              {/* Additional Specs */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="border-gray-600 text-gray-300">
                  {car.fuelType}
                </Badge>
                <Badge variant="outline" className="border-gray-600 text-gray-300">
                  {car.transmission}
                </Badge>
                <Badge variant="outline" className="border-gray-600 text-gray-300">
                  {car.bodyType}
                </Badge>
                <Badge variant="outline" className="border-gray-600 text-gray-300">
                  {car.color}
                </Badge>
              </div>

              {/* Description */}
              {car.description && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Описание</h3>
                  <p className="text-gray-300">{car.description}</p>
                </div>
              )}

              {/* Features */}
              {car.features && car.features.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Особенности</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {car.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-gray-300">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Specifications */}
              {car.specifications && Object.keys(car.specifications).length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Технические характеристики</h3>
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

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Price Card */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Цена</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white mb-2">
                    {formatPrice(car.price)} ₽
                  </div>
                  {car.creditFrom && (
                    <div className="text-gray-300 mb-4">
                      Кредит от {formatPrice(car.creditFrom)} ₽/мес
                    </div>
                  )}
                  <div className="space-y-3">
                    <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                      <Phone className="w-4 h-4 mr-2" />
                      Позвонить
                    </Button>
                    <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Написать
                    </Button>
                    <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                      <Heart className="w-4 h-4 mr-2" />
                      В избранное
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Seller Info */}
              {car.seller && (
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Продавец</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 text-red-500 mr-2" />
                        <span className="text-white">{car.seller.name}</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-2" />
                        <span className="text-gray-300">{car.seller.rating} / 5</span>
                      </div>
                      <div className="flex items-center">
                        <Award className="w-4 h-4 text-green-500 mr-2" />
                        <span className="text-gray-300">Проверенный продавец</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Contact Info */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Контакты</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 text-red-500 mr-2" />
                      <span className="text-gray-300">{car.seller?.phone || '+7 (999) 123-45-67'}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 text-red-500 mr-2" />
                      <span className="text-gray-300">{car.seller?.email || 'info@orientavto.com'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 