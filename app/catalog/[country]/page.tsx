'use client';

console.log('=== СТРАНИЦА КАТАЛОГА ЗАГРУЖЕНА ===');

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import CarCard from '@/components/car-card';
import { CatalogFilters, FilterValues } from '@/components/catalog-filters';
import { CatalogFiltersJapan } from '@/components/catalog-filters-japan';
import { CatalogFiltersKorea } from '@/components/catalog-filters-korea';
import { CatalogFiltersChina } from '@/components/catalog-filters-china';
import Pagination from '@/components/pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Filter, Check, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

// Импорт JSON файлов с марками и моделями
import marksAndModelsJapan from '@/app/marks_and_models_japan.json';
import marksAndModelsKorea from '@/app/marks_and_models_korea.json';
import marksAndModelsChina from '@/app/marks_and_models_china.json';

export default function CatalogPage() {
  console.log('=== КАТАЛОГ ВЫЗВАН ===');
  
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const country = params.country as string;
  
  console.log('=== ПАРАМЕТРЫ ===');
  console.log('Country:', country);
  console.log('Params:', params);
  console.log('Search params:', Object.fromEntries(searchParams.entries()));
  
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCars, setTotalCars] = useState(0);
  const [filters, setFilters] = useState<FilterValues>({});
  const [sortBy, setSortBy] = useState('price_asc');
  const [models, setModels] = useState<Array<{ id: string; name: string }>>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  // Получаем марки в зависимости от страны
  const getMarksAndModels = () => {
    switch (country) {
      case 'japan':
        return marksAndModelsJapan;
      case 'korea':
        return marksAndModelsKorea;
      case 'china':
        return marksAndModelsChina;
      default:
        return [];
    }
  };

  const getFiltersComponent = () => {
    switch (country) {
      case 'japan':
        return CatalogFiltersJapan;
      case 'korea':
        return CatalogFiltersKorea;
      case 'china':
        return CatalogFiltersChina;
      default:
        return CatalogFilters;
    }
  };

  const marksAndModels = getMarksAndModels();
  const brands = marksAndModels.map(brand => ({ id: brand.id, name: brand.name }));

  // Обновляем модели при изменении марки
  useEffect(() => {
    if (filters.brand) {
      const brandObj = marksAndModels.find((item: any) => item.id === filters.brand);
      if (brandObj && Array.isArray(brandObj.models)) {
        setModels(brandObj.models);
      } else {
        setModels([]);
      }
    } else {
      setModels([]);
    }
  }, [filters.brand, marksAndModels]);



  const bodyTypes = [
    { id: 'sedan', name: 'Седан' },
    { id: 'hatchback', name: 'Хэтчбэк' },
    { id: 'wagon', name: 'Универсал' },
    { id: 'suv', name: 'SUV' },
    { id: 'minivan', name: 'Минивен' },
    { id: 'coupe', name: 'Купе' },
    { id: 'cabriolet', name: 'Кабриолет' },
    { id: 'pickup', name: 'Пикап' },
    { id: 'hardtop', name: 'Хардтоп' },
    { id: 'keicar', name: 'Кейкар' },
    { id: 'truck', name: 'Грузовик' }
  ];

  const sortOptions = [
    { id: 'default', name: 'По умолчанию' },
    { id: 'price_asc', name: 'Цена: по возрастанию' },
    { id: 'price_desc', name: 'Цена: по убыванию' },
    { id: 'year_desc', name: 'Год: новые первыми' },
    { id: 'year_asc', name: 'Год: старые первыми' },
    { id: 'mileage_asc', name: 'Пробег: по возрастанию' },
    { id: 'mileage_desc', name: 'Пробег: по убыванию' }
  ];

  const updateURL = (newFilters: FilterValues, newPage: number, newSort: string) => {
    const params = new URLSearchParams();
    
    // Добавляем фильтры
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.set(key, String(value));
      }
    });
    
    // Добавляем пагинацию и сортировку
    params.set('page', String(newPage));
    if (newSort && newSort !== 'default') {
      params.set('sort', newSort);
    }
    
    router.push(`/catalog/${country}?${params.toString()}`);
  };

  const handleFiltersChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
    setCurrentPage(1); // Сбрасываем на первую страницу при изменении фильтров
    updateURL(newFilters, 1, sortBy);
  };

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    updateURL(filters, currentPage, newSort);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    updateURL(filters, newPage, sortBy);
  };

  // Функция для дополнительной сортировки на клиентской стороне
  const applyClientSideSorting = (cars: any[], sortType: string) => {
    console.log('=== ПРИМЕНЯЕМ ДОПОЛНИТЕЛЬНУЮ СОРТИРОВКУ ===');
    console.log('Тип сортировки:', sortType);
    console.log('Количество машин до сортировки:', cars.length);
    
    const sortedCars = [...cars];
    
    switch (sortType) {
      case 'price_asc':
        sortedCars.sort((a, b) => {
          const priceA = a.price || 0;
          const priceB = b.price || 0;
          console.log(`Сравниваем цены: ${priceA} vs ${priceB}`);
          return priceA - priceB;
        });
        break;
      case 'price_desc':
        sortedCars.sort((a, b) => {
          const priceA = a.price || 0;
          const priceB = b.price || 0;
          console.log(`Сравниваем цены: ${priceA} vs ${priceB}`);
          return priceB - priceA;
        });
        break;
      case 'year_desc':
        sortedCars.sort((a, b) => {
          const yearA = a.year || 0;
          const yearB = b.year || 0;
          console.log(`Сравниваем годы: ${yearA} vs ${yearB}`);
          return yearB - yearA;
        });
        break;
      case 'year_asc':
        sortedCars.sort((a, b) => {
          const yearA = a.year || 0;
          const yearB = b.year || 0;
          console.log(`Сравниваем годы: ${yearA} vs ${yearB}`);
          return yearA - yearB;
        });
        break;
      case 'mileage_asc':
        sortedCars.sort((a, b) => {
          const mileageA = a.mileage || 0;
          const mileageB = b.mileage || 0;
          console.log(`Сравниваем пробег: ${mileageA} vs ${mileageB}`);
          return mileageA - mileageB;
        });
        break;
      case 'mileage_desc':
        sortedCars.sort((a, b) => {
          const mileageA = a.mileage || 0;
          const mileageB = b.mileage || 0;
          console.log(`Сравниваем пробег: ${mileageA} vs ${mileageB}`);
          return mileageB - mileageA;
        });
        break;
      default:
        console.log('Сортировка по умолчанию - оставляем как есть');
        break;
    }
    
    console.log('=== СОРТИРОВКА ЗАВЕРШЕНА ===');
    console.log('Количество машин после сортировки:', sortedCars.length);
    
    // Проверяем правильность сортировки для первых нескольких элементов
    if (sortedCars.length > 1) {
      console.log('=== ПРОВЕРКА СОРТИРОВКИ ===');
      const firstFew = sortedCars.slice(0, 3);
      firstFew.forEach((car, index) => {
        console.log(`Машина ${index + 1}:`, {
          name: car.name,
          price: car.price,
          year: car.year,
          mileage: car.mileage
        });
      });
    }
    
    return sortedCars;
  };

  useEffect(() => {
    console.log('=== USE EFFECT ВЫЗВАН ===');
    console.log('Загружаем данные для страны:', country);
    
    // Инициализируем фильтры из URL
    const urlFilters: FilterValues = {};
    const filtersToCheck = country === 'china' 
      ? ['priceMin', 'priceMax', 'yearMin', 'yearMax', 'mileageMin', 'mileageMax', 
         'engineVolumeMin', 'engineVolumeMax', 'brand', 'model', 'engType', 
         'bodyType', 'drive', 'sort']
      : ['priceMin', 'priceMax', 'yearMin', 'yearMax', 'mileageMin', 'mileageMax', 
         'engineVolumeMin', 'engineVolumeMax', 'powerMin', 'powerMax', 'brand', 'model', 'fuelType', 
         'bodyType', 'color', 'rate'];
    
    filtersToCheck.forEach(filter => {
      const value = searchParams.get(filter);
      if (value) {
        if (country === 'china') {
          if (['priceMin', 'priceMax', 'yearMin', 'yearMax', 'mileageMin', 'mileageMax', 'engineVolumeMin', 'engineVolumeMax'].includes(filter)) {
            (urlFilters as any)[filter] = Number(value);
          } else {
            (urlFilters as any)[filter] = value;
          }
        } else {
          if (['priceMin', 'priceMax', 'yearMin', 'yearMax', 'mileageMin', 'mileageMax', 'engineVolumeMin', 'engineVolumeMax', 'powerMin', 'powerMax'].includes(filter)) {
            (urlFilters as any)[filter] = Number(value);
          } else {
            (urlFilters as any)[filter] = value;
          }
        }
      }
    });
    
    setFilters(urlFilters);
    
    const urlPage = Number(searchParams.get('page')) || 1;
    const urlSort = searchParams.get('sort') || 'default';
    
    setCurrentPage(urlPage);
    setSortBy(urlSort);
    
    const loadCars = async () => {
      console.log('=== LOADCARS ВЫЗВАНА ===');
      setLoading(true);
      setError(null);
      
      try {
        // Формируем параметры запроса
        const queryParams = new URLSearchParams();
        queryParams.set('page', String(urlPage));
        if (urlSort && urlSort !== 'default') {
          queryParams.set('sort', urlSort);
        }
        
        // Добавляем фильтры
        Object.entries(urlFilters).forEach(([key, value]) => {
          if (value !== undefined && value !== '') {
            queryParams.set(key, String(value));
          }
        });
        
        console.log('=== ПЕРЕД FETCH ===');
        console.log('URL:', `/api/cars/${country}?${queryParams.toString()}`);
        
        const response = await fetch(`/api/cars/${country}?${queryParams.toString()}`);
        console.log('=== ПОСЛЕ FETCH ===');
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        
        if (response.ok) {
          const data = await response.json();
          console.log('=== ДАННЫЕ ПОЛУЧЕНЫ ===');
          console.log('Full response:', data);
          console.log('Cars count:', data.data?.length || 0);
          
          if (data.data && Array.isArray(data.data)) {
            // Трансформируем данные в формат CarCard
            const transformedCars = data.data.map((car: any, index: number) => {
              console.log(`=== ТРАНСФОРМАЦИЯ МАШИНЫ ${index} ===`);
              console.log('Original car data:', car);
              
              const transformedCar = {
                id: car.id || `car-${index}`,
                name: car.name || `${car.brand || 'Unknown'} ${car.model || ''}`.trim(),
                brand: car.brand || 'Unknown',
                model: car.model || 'Unknown',
                year: car.year || 2020,
                price: car.price || 0,
                mileage: car.mileage || 0,
                engineVolume: car.engine_volume || car.engineVolume,
                fuelType: car.eng_type || car.fuelType || 'petrol',
                transmission: car.transmission,
                bodyType: car.body || car.bodyType || 'sedan',
                color: car.color || 'unknown',
                location: car.location || country,
                images: car.images || car.photo || [],
                rating: car.rating,
                rate: car.rate,
                power: car.power,
                drive: car.drive,
                isHit: car.isHit || false,
                isNew: car.isNew || false,
                creditFrom: car.creditFrom,
                url: car.detail_url || car.url || `#`,
                // Дополнительные поля для китайского каталога
                eng_type: car.eng_type,
                max_speed: car.max_speed,
                acceleration_0_100: car.acceleration_0_100,
                fuel_consumption: car.fuel_consumption,
                dimensions: car.dimensions,
                  customs: car.customs,
                  complectation: car.complectation,
                  sanctions: car.sanctions
              };
              
              console.log('Transformed car:', transformedCar);
              return transformedCar;
            });
            
            console.log('=== ВСЕ МАШИНЫ ТРАНСФОРМИРОВАНЫ ===');
            console.log('Total transformed cars:', transformedCars.length);
            
            // Применяем дополнительную сортировку на клиентской стороне
            const sortedCars = applyClientSideSorting(transformedCars, urlSort);
            setCars(sortedCars);
            
            // Обновляем общее количество автомобилей и страниц
            const total = data.total || 0;
            const pageSize = data.pageSize || 24; // Используем pageSize из API
            const totalPagesFromAPI = data.totalPages || Math.ceil(total / pageSize);
            
            setTotalCars(total);
            setTotalPages(totalPagesFromAPI);
            
            console.log('=== ПАГИНАЦИЯ ===');
            console.log('Total cars:', total);
            console.log('Total pages:', totalPagesFromAPI);
          } else {
            console.log('=== НЕТ ДАННЫХ В ОТВЕТЕ ===');
            setCars([]);
            setTotalPages(1);
          }
        } else {
          console.log('=== ОШИБКА API ===');
          console.log('Status:', response.status);
          const errorText = await response.text();
          console.log('Error response:', errorText);
          setError(`Ошибка загрузки данных: ${response.status}`);
        }
      } catch (error) {
        console.log('=== ОШИБКА FETCH ===');
        console.log('Error:', error);
        setError('Ошибка сети');
      } finally {
        setLoading(false);
      }
    };
    
    if (country) {
      loadCars();
    }
  }, [country, searchParams]);

  // Дополнительная сортировка при изменении sortBy
  useEffect(() => {
    if (cars.length > 0 && sortBy !== 'default') {
      console.log('=== ПЕРЕСОРТИРОВКА ПРИ ИЗМЕНЕНИИ SORTBY ===');
      console.log('Текущая сортировка:', sortBy);
      console.log('Количество машин для пересортировки:', cars.length);
      
      const sortedCars = applyClientSideSorting(cars, sortBy);
      setCars(sortedCars);
    }
  }, [sortBy, cars.length]);
  
  const getCountryName = (countryCode: string) => {
    switch (countryCode) {
      case 'japan': return 'Японии';
      case 'korea': return 'Кореи';
      case 'china': return 'Китая';
      default: return countryCode;
    }
  };

  // Кастомный компонент для мобильных фильтров
  const MobileFilters = ({ 
    filters, 
    onFiltersChange, 
    brands, 
    models, 
    bodyTypes,
    marksAndModels
  }: {
    filters: FilterValues;
    onFiltersChange: (filters: FilterValues) => void;
    brands: Array<{ id: string; name: string }>;
    models: Array<{ id: string; name: string }>;
    bodyTypes: Array<{ id: string; name: string }>;
    marksAndModels: Array<{ id: string; name: string; models?: Array<{ id: string; name: string }> }>;
  }) => {
    const [tempFilters, setTempFilters] = useState<FilterValues>(filters);
    const [appliedFilters, setAppliedFilters] = useState<FilterValues>(filters);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
      setTempFilters(filters);
      setAppliedFilters(filters);
    }, [filters]);

    const hasUnsavedChanges = JSON.stringify(tempFilters) !== JSON.stringify(appliedFilters);

    // Локально считаем модели по выбранной марке (без применения)
    const availableModels = useMemo(() => {
      if (!tempFilters.brand) return [] as Array<{ id: string; name: string }>;
      const brandObj = marksAndModels.find((b) => b.id === tempFilters.brand);
      return brandObj?.models || [];
    }, [tempFilters.brand, marksAndModels]);

    const handleApply = () => {
      setAppliedFilters(tempFilters);
      onFiltersChange(tempFilters);
      setIsOpen(false);
    };

    const handleReset = () => {
      const emptyFilters: FilterValues = {};
      setTempFilters(emptyFilters);
      setAppliedFilters(emptyFilters);
      onFiltersChange(emptyFilters);
      setIsOpen(false);
    };

    const getActiveFiltersCount = () => {
      return Object.keys(appliedFilters).filter(key => appliedFilters[key as keyof FilterValues] !== undefined && appliedFilters[key as keyof FilterValues] !== '').length;
    };

    // Компонент выпадающего списка для мобильной версии
    const MobileSelect = ({ 
      label, 
      value, 
      onValueChange, 
      options, 
      placeholder 
    }: {
      label: string;
      value?: string;
      onValueChange: (value: string) => void;
      options: Array<{ id: string; name: string }>;
      placeholder: string;
    }) => {
      const [isDropdownOpen, setIsDropdownOpen] = useState(false);
      const containerRef = useRef<HTMLDivElement>(null);

      useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
            setIsDropdownOpen(false);
          }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }, []);

      const selectedOption = options.find(option => option.id === value);

      return (
        <div className="space-y-3 relative" ref={containerRef}>
          <Label className="text-white font-semibold">{label}</Label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full bg-[#0e1720] border border-[#c9a86e]/30 text-white focus:border-[#c9a86e] rounded-md px-3 py-2 text-left flex items-center justify-between transition-all duration-200 hover:border-[#c9a86e]/50"
            >
              <span className={selectedOption ? 'text-white' : 'text-white/50'}>
                {selectedOption ? selectedOption.name : placeholder}
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            <div className={`absolute top-full left-0 right-0 mt-1 bg-[#0e1720] border border-[#c9a86e]/30 rounded-md max-h-[400px] overflow-y-auto z-50 transition-all duration-200 ease-out ${
              isDropdownOpen 
                ? 'opacity-100 scale-100 translate-y-0' 
                : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
            }`}>
              {/* Опция "Пусто" */}
              <button
                type="button"
                onClick={() => {
                  onValueChange('');
                  setIsDropdownOpen(false);
                }}
                className="w-full px-3 py-2 text-left text-white/70 hover:bg-[#c9a86e]/20 first:rounded-t-md transition-colors duration-150 border-b border-[#c9a86e]/10"
              >
                Пусто
              </button>
              
              {options.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    onValueChange(option.id);
                    setIsDropdownOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left text-white hover:bg-[#c9a86e]/20 last:rounded-b-md transition-colors duration-150"
                >
                  {option.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    };

    // Компоненты фильтров для мобильной версии
    const PriceRangeFilter = useMemo(() => (
      <div className="space-y-4">
        <Label className="text-white font-semibold">Цена (₽)</Label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-sm text-white/70">От</Label>
            <Input
              type="number"
              placeholder="0"
              value={tempFilters.priceMin || ''}
              onChange={(e) => setTempFilters(prev => ({ ...prev, priceMin: e.target.value ? Number(e.target.value) : undefined }))}
              className="bg-[#0e1720] border-[#c9a86e]/30 text-white focus:border-[#c9a86e]"
            />
          </div>
          <div>
            <Label className="text-sm text-white/70">До</Label>
            <Input
              type="number"
              placeholder="∞"
              value={tempFilters.priceMax || ''}
              onChange={(e) => setTempFilters(prev => ({ ...prev, priceMax: e.target.value ? Number(e.target.value) : undefined }))}
              className="bg-[#0e1720] border-[#c9a86e]/30 text-white focus:border-[#c9a86e]"
            />
          </div>
        </div>
      </div>
    ), [tempFilters.priceMin, tempFilters.priceMax]);

    const YearRangeFilter = useMemo(() => {
      const currentYear = new Date().getFullYear();
      return (
        <div className="space-y-4">
          <Label className="text-white font-semibold">Год выпуска</Label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-sm text-white/70">От</Label>
              <Input
                type="number"
                placeholder="1980"
                value={tempFilters.yearMin || ''}
                onChange={(e) => setTempFilters(prev => ({ ...prev, yearMin: e.target.value ? Number(e.target.value) : undefined }))}
                className="bg-[#0e1720] border-[#c9a86e]/30 text-white focus:border-[#c9a86e]"
              />
            </div>
            <div>
              <Label className="text-sm text-white/70">До</Label>
              <Input
                type="number"
                placeholder={currentYear.toString()}
                value={tempFilters.yearMax || ''}
                onChange={(e) => setTempFilters(prev => ({ ...prev, yearMax: e.target.value ? Number(e.target.value) : undefined }))}
                className="bg-[#0e1720] border-[#c9a86e]/30 text-white focus:border-[#c9a86e]"
              />
            </div>
          </div>
        </div>
      );
    }, [tempFilters.yearMin, tempFilters.yearMax]);

    const MileageRangeFilter = useMemo(() => (
      <div className="space-y-4">
        <Label className="text-white font-semibold">Пробег (км)</Label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-sm text-white/70">От</Label>
            <Input
              type="number"
              placeholder="0"
              value={tempFilters.mileageMin || ''}
              onChange={(e) => setTempFilters(prev => ({ ...prev, mileageMin: e.target.value ? Number(e.target.value) : undefined }))}
              className="bg-[#0e1720] border-[#c9a86e]/30 text-white focus:border-[#c9a86e]"
            />
          </div>
          <div>
            <Label className="text-sm text-white/70">До</Label>
            <Input
              type="number"
              placeholder="500000"
              value={tempFilters.mileageMax || ''}
              onChange={(e) => setTempFilters(prev => ({ ...prev, mileageMax: e.target.value ? Number(e.target.value) : undefined }))}
              className="bg-[#0e1720] border-[#c9a86e]/30 text-white focus:border-[#c9a86e]"
            />
          </div>
        </div>
      </div>
    ), [tempFilters.mileageMin, tempFilters.mileageMax]);

    const EngineVolumeRangeFilter = useMemo(() => (
      <div className="space-y-4">
        <Label className="text-white font-semibold">Объем двигателя (л)</Label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-sm text-white/70">От</Label>
            <Input
              type="number"
              step="0.1"
              placeholder="0.6"
              value={tempFilters.engineVolumeMin || ''}
              onChange={(e) => setTempFilters(prev => ({ ...prev, engineVolumeMin: e.target.value ? Number(e.target.value) : undefined }))}
              className="bg-[#0e1720] border-[#c9a86e]/30 text-white focus:border-[#c9a86e]"
            />
          </div>
          <div>
            <Label className="text-sm text-white/70">До</Label>
            <Input
              type="number"
              step="0.1"
              placeholder="8.0"
              value={tempFilters.engineVolumeMax || ''}
              onChange={(e) => setTempFilters(prev => ({ ...prev, engineVolumeMax: e.target.value ? Number(e.target.value) : undefined }))}
              className="bg-[#0e1720] border-[#c9a86e]/30 text-white focus:border-[#c9a86e]"
            />
          </div>
        </div>
      </div>
    ), [tempFilters.engineVolumeMin, tempFilters.engineVolumeMax]);

    const PowerRangeFilter = useMemo(() => (
      <div className="space-y-4">
        <Label className="text-white font-semibold">Мощность (л.с.)</Label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-sm text-white/70">От</Label>
            <Input
              type="number"
              placeholder="50"
              value={tempFilters.powerMin || ''}
              onChange={(e) => setTempFilters(prev => ({ ...prev, powerMin: e.target.value ? Number(e.target.value) : undefined }))}
              className="bg-[#0e1720] border-[#c9a86e]/30 text-white focus:border-[#c9a86e]"
            />
          </div>
          <div>
            <Label className="text-sm text-white/70">До</Label>
            <Input
              type="number"
              placeholder="500"
              value={tempFilters.powerMax || ''}
              onChange={(e) => setTempFilters(prev => ({ ...prev, powerMax: e.target.value ? Number(e.target.value) : undefined }))}
              className="bg-[#0e1720] border-[#c9a86e]/30 text-white focus:border-[#c9a86e]"
            />
          </div>
        </div>
      </div>
    ), [tempFilters.powerMin, tempFilters.powerMax]);

    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button className="w-full bg-[#1a2332]/80 border border-[#c9a86e]/20 text-white hover:bg-[#c9a86e]/10 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]">
            <Filter className="w-4 h-4 mr-2" />
            Фильтры ({getActiveFiltersCount()})
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="bg-[#0e1720] border-[#c9a86e]/20 w-80 h-full">
          <SheetHeader>
            <SheetTitle className="text-white">Фильтры</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-6 h-[calc(100vh-120px)] overflow-y-auto pr-4">
            {PriceRangeFilter}
            <Separator className="bg-[#c9a86e]/20" />
            {YearRangeFilter}
            <Separator className="bg-[#c9a86e]/20" />
            {MileageRangeFilter}
            <Separator className="bg-[#c9a86e]/20" />
            {EngineVolumeRangeFilter}
            <Separator className="bg-[#c9a86e]/20" />
            {country !== 'china' && PowerRangeFilter}
            {country !== 'china' && <Separator className="bg-[#c9a86e]/20" />}
            
            <MobileSelect
              label="Марка"
              value={tempFilters.brand}
              onValueChange={(value) => setTempFilters(prev => ({ ...prev, brand: value || undefined, model: value ? prev.model : undefined }))}
              options={brands}
              placeholder="Выберите марку"
            />
            
            <MobileSelect
              label="Модель"
              value={tempFilters.model}
              onValueChange={(value) => setTempFilters(prev => ({ ...prev, model: value || undefined }))}
              options={availableModels}
              placeholder="Выберите модель"
            />
            

            
            <MobileSelect
              label="Тип кузова"
              value={tempFilters.bodyType}
              onValueChange={(value) => setTempFilters(prev => ({ ...prev, bodyType: value || undefined }))}
              options={bodyTypes}
              placeholder="Выберите кузов"
            />

            {/* Кнопки */}
            <div className="space-y-3 pt-4">
              <div className="flex gap-3">
                <Button 
                  onClick={handleApply}
                  disabled={!hasUnsavedChanges}
                  className="flex-1 bg-gradient-to-r from-[#c9a86e] to-[#d4b876] hover:from-[#d4b876] hover:to-[#c9a86e] text-[#0e1720] font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Применить
                </Button>
                <Button 
                  onClick={handleReset}
                  variant="outline"
                  className="border-[#c9a86e]/30 text-white hover:bg-[#c9a86e]/10 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Сбросить
                </Button>
              </div>
              
              <div className={`text-sm text-yellow-400 text-center transition-all duration-300 ${
                hasUnsavedChanges 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 -translate-y-2'
              }`}>
                Есть несохраненные изменения
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  };

  // Кастомный компонент для мобильной сортировки
  const MobileSortSelect = ({ 
    value, 
    onValueChange, 
    options 
  }: {
    value: string;
    onValueChange: (value: string) => void;
    options: Array<{ id: string; name: string }>;
  }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsDropdownOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(option => option.id === value);

    return (
      <div className="relative w-full" ref={containerRef}>
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full bg-[#1a2332]/80 border border-[#c9a86e]/30 text-white focus:border-[#c9a86e] rounded-md px-3 py-2 text-left flex items-center justify-between transition-all duration-200 hover:border-[#c9a86e]/50 truncate"
        >
          <span className={selectedOption ? 'text-white' : 'text-white/50'}>
            {selectedOption ? selectedOption.name : 'Выберите сортировку'}
          </span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>
        
        <div className={`absolute top-full left-0 right-0 mt-1 bg-[#0e1720] border border-[#c9a86e]/30 rounded-md max-h-[400px] overflow-y-auto z-50 transition-all duration-200 ease-out ${
          isDropdownOpen 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
        }`}>
          {options.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => {
                onValueChange(option.id);
                setIsDropdownOpen(false);
              }}
              className="w-full px-3 py-2 text-left text-white hover:bg-[#c9a86e]/20 first:rounded-t-md last:rounded-b-md transition-colors duration-150"
            >
              {option.name}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // Кастомный компонент для десктопной сортировки
  const DesktopSortSelect = ({ 
    value, 
    onValueChange, 
    options 
  }: {
    value: string;
    onValueChange: (value: string) => void;
    options: Array<{ id: string; name: string }>;
  }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsDropdownOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(option => option.id === value);

    return (
      <div className="relative" ref={containerRef}>
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-64 bg-[#1a2332]/80 border border-[#c9a86e]/30 text-white focus:border-[#c9a86e] rounded-md px-3 py-2 text-left flex items-center justify-between transition-all duration-200 hover:border-[#c9a86e]/50"
        >
          <span className={selectedOption ? 'text-white' : 'text-white/50'}>
            {selectedOption ? selectedOption.name : 'Выберите сортировку'}
          </span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>
        
        <div className={`absolute top-full left-0 right-0 mt-1 bg-[#0e1720] border border-[#c9a86e]/30 rounded-md max-h-[400px] overflow-y-auto z-50 transition-all duration-200 ease-out ${
          isDropdownOpen 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
        }`}>
          {options.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => {
                onValueChange(option.id);
                setIsDropdownOpen(false);
              }}
              className="w-full px-3 py-2 text-left text-white hover:bg-[#c9a86e]/20 first:rounded-t-md last:rounded-b-md transition-colors duration-150"
            >
              {option.name}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">
          Автомобили из {getCountryName(country)}
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filters */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-[#1a2332]/80 backdrop-blur-sm border border-[#c9a86e]/20 rounded-xl p-6 relative">
              {(() => {
                const FiltersComponent = getFiltersComponent();
                return (
                  <FiltersComponent
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                    brands={brands}
                    models={models}
                    bodyTypes={bodyTypes}
                    marksAndModels={marksAndModels}
                  />
                );
              })()}
            </div>
          </div>
          
          {/* Mobile Filters */}
          <div className="lg:hidden mb-4">
            <MobileFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              brands={brands}
              models={models}
              bodyTypes={bodyTypes}
              marksAndModels={marksAndModels}
            />
          </div>
          
          {/* Основной контент */}
          <div className="lg:col-span-3">
            {/* Desktop: Сортировка и количество */}
            <div className="hidden lg:flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <span className="text-white">Сортировка:</span>
                <DesktopSortSelect
                  value={sortBy}
                  onValueChange={handleSortChange}
                  options={sortOptions}
                />
              </div>
              
              <div className="text-white">
                Найдено {totalCars} автомобилей
              </div>
            </div>
            
            {/* Mobile: Количество автомобилей */}
            <div className="lg:hidden text-white text-center mb-4">
              Найдено {totalCars} автомобилей
            </div>
            
            {/* Mobile: Сортировка */}
            <div className="lg:hidden flex items-center gap-4 mb-6">
              <span className="text-white text-sm whitespace-nowrap">Сортировка:</span>
              <div className="flex-1">
                <MobileSortSelect
                  value={sortBy}
                  onValueChange={handleSortChange}
                  options={sortOptions}
                />
              </div>
            </div>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c9a86e] mx-auto mb-4"></div>
                <p className="text-white">Загрузка автомобилей...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-400 mb-4">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="bg-[#c9a86e] text-black px-6 py-2 rounded-lg hover:bg-[#d4b876] transition-colors"
                >
                  Попробовать снова
                </button>
              </div>
            ) : (
              <div>
                {cars.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-400">Автомобили не найдены</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                      {cars.map((car: any, index: number) => (
                        <CarCard key={car.id || index} car={car} country={country} />
                      ))}
                    </div>
                    
                    {/* Пагинация */}
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                      className="mt-8"
                    />
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 