'use client';

console.log('=== ФАЙЛ ФИЛЬТРОВ КИТАЯ ЗАГРУЖЕН ===');

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Filter, X, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { logger } from '@/lib/logger';

export interface FilterValues {
  priceMin?: number;
  priceMax?: number;
  yearMin?: number;
  yearMax?: number;
  mileageMin?: number;
  mileageMax?: number;
  engineVolumeMin?: number;
  engineVolumeMax?: number;
  brand?: string;
  model?: string;
  bodyType?: string;
  // Фильтры, поддерживаемые китайским парсером
  engType?: string;
  drive?: string;
  sort?: string;
}

interface CatalogFiltersProps {
  filters: FilterValues;
  onFiltersChange: (filters: FilterValues) => void;
  brands: Array<{ id: string; name: string }>;
  models: Array<{ id: string; name: string }>;
  bodyTypes: Array<{ id: string; name: string }>;
  marksAndModels?: Array<{ id: string; name: string; models?: Array<{ id: string; name: string }> }>;
  className?: string;
  onMobileClose?: () => void;
}

export function CatalogFiltersChina({
  filters,
  onFiltersChange,
  brands,
  models,
  bodyTypes,
  marksAndModels = [],
  className = '',
  onMobileClose
}: CatalogFiltersProps) {
  console.log('=== КОМПОНЕНТ ФИЛЬТРОВ КИТАЯ ЗАГРУЖЕН ===');
  
  // Два состояния: временные и примененные фильтры
  const [tempFilters, setTempFilters] = useState<FilterValues>(filters);
  const [appliedFilters, setAppliedFilters] = useState<FilterValues>(filters);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Обновляем состояния при изменении props
  useEffect(() => {
    setTempFilters(filters);
    setAppliedFilters(filters);
  }, [filters]);

  // Проверяем есть ли несохраненные изменения (используем useMemo)
  const hasUnsavedChanges = useMemo(() => {
    return JSON.stringify(tempFilters) !== JSON.stringify(appliedFilters);
  }, [tempFilters, appliedFilters]);

  const handleApply = useCallback(() => {
    console.log('=== ПРИМЕНЕНИЕ ФИЛЬТРОВ КИТАЯ ===');
    console.log('Применяем фильтры:', tempFilters);
    setAppliedFilters(tempFilters);
    onFiltersChange(tempFilters);
    // Закрываем мобильное окно если функция передана
    if (onMobileClose) {
      onMobileClose();
    }
  }, [tempFilters, onFiltersChange, onMobileClose]);

  const handleReset = useCallback(() => {
    console.log('=== СБРОС ФИЛЬТРОВ КИТАЯ ===');
    const emptyFilters: FilterValues = {};
    setTempFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  }, [onFiltersChange]);

  const getActiveFiltersCount = useCallback(() => {
    return Object.keys(appliedFilters).filter(key => appliedFilters[key as keyof FilterValues] !== undefined && appliedFilters[key as keyof FilterValues] !== '').length;
  }, [appliedFilters]);

  // Собственный компонент выпадающего списка
  const CustomSelect = useCallback(({ 
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
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(option => option.id === value);

    return (
      <div className="relative" ref={dropdownRef}>
        <Label className="text-white font-semibold">{label}</Label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full mt-2 px-3 py-2 bg-[#1a2332]/50 border border-[#c9a86e]/20 rounded-lg text-left text-white hover:border-[#c9a86e]/40 transition-colors flex items-center justify-between"
          >
            <span className={selectedOption ? 'text-white' : 'text-gray-400'}>
              {selectedOption ? selectedOption.name : placeholder}
            </span>
            {isOpen ? <ChevronUp className="w-4 h-4 text-[#c9a86e]" /> : <ChevronDown className="w-4 h-4 text-[#c9a86e]" />}
          </button>
          
          {isOpen && (
            <div className="absolute z-50 w-full mt-1 bg-[#1a2332] border border-[#c9a86e]/20 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              <div className="p-2">
                <button
                  type="button"
                  onClick={() => {
                    onValueChange('');
                    setIsOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left text-gray-400 hover:text-white hover:bg-[#c9a86e]/10 rounded transition-colors"
                >
                  {placeholder}
                </button>
                {options.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      onValueChange(option.id);
                      setIsOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left text-white hover:bg-[#c9a86e]/10 rounded transition-colors flex items-center justify-between"
                  >
                    <span>{option.name}</span>
                    {value === option.id && <Check className="w-4 h-4 text-[#c9a86e]" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }, []);

  // Компоненты фильтров для Китая
  const PriceRangeFilter = useMemo(() => (
    <div className="space-y-4">
      <Label className="text-white font-semibold">Цена (₽)</Label>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm text-gray-400">От</Label>
          <Input
            type="number"
            min="0"
            placeholder="0"
            value={tempFilters.priceMin || ''}
            onChange={(e) => {
              const value = Math.max(0, Number(e.target.value) || 0);
              setTempFilters(prev => ({ ...prev, priceMin: value > 0 ? value : undefined }));
            }}
            onBlur={(e) => {
              const value = Number(e.target.value);
              if (value <= 0) {
                setTempFilters(prev => ({ ...prev, priceMin: undefined }));
              }
            }}
            className="mt-1 bg-[#1a2332]/50 border-[#c9a86e]/20 text-white placeholder-gray-400 focus:border-[#c9a86e]/50"
          />
        </div>
        <div>
          <Label className="text-sm text-gray-400">До</Label>
          <Input
            type="number"
            min="0"
            placeholder="∞"
            value={tempFilters.priceMax || ''}
            onChange={(e) => {
              const value = Math.max(0, Number(e.target.value) || 0);
              setTempFilters(prev => ({ ...prev, priceMax: value > 0 ? value : undefined }));
            }}
            onBlur={(e) => {
              const value = Number(e.target.value);
              if (value <= 0) {
                setTempFilters(prev => ({ ...prev, priceMax: undefined }));
              }
            }}
            className="mt-1 bg-[#1a2332]/50 border-[#c9a86e]/20 text-white placeholder-gray-400 focus:border-[#c9a86e]/50"
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
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm text-gray-400">От</Label>
            <Input
              type="number"
              min="0"
              max={currentYear}
              placeholder="0"
              value={tempFilters.yearMin || ''}
              onChange={(e) => {
                const value = Math.max(0, Math.min(currentYear, Number(e.target.value) || 0));
                setTempFilters(prev => ({ ...prev, yearMin: value > 0 ? value : undefined }));
              }}
              onBlur={(e) => {
                const value = Number(e.target.value);
                if (value <= 0) {
                  setTempFilters(prev => ({ ...prev, yearMin: undefined }));
                }
              }}
              className="mt-1 bg-[#1a2332]/50 border-[#c9a86e]/20 text-white placeholder-gray-400 focus:border-[#c9a86e]/50"
            />
          </div>
          <div>
            <Label className="text-sm text-gray-400">До</Label>
            <Input
              type="number"
              min="0"
              max={currentYear}
              placeholder={currentYear.toString()}
              value={tempFilters.yearMax || ''}
              onChange={(e) => {
                const value = Math.max(0, Math.min(currentYear, Number(e.target.value) || 0));
                setTempFilters(prev => ({ ...prev, yearMax: value > 0 ? value : undefined }));
              }}
              onBlur={(e) => {
                const value = Number(e.target.value);
                if (value <= 0) {
                  setTempFilters(prev => ({ ...prev, yearMax: undefined }));
                }
              }}
              className="mt-1 bg-[#1a2332]/50 border-[#c9a86e]/20 text-white placeholder-gray-400 focus:border-[#c9a86e]/50"
            />
          </div>
        </div>
      </div>
    );
  }, [tempFilters.yearMin, tempFilters.yearMax]);

  const MileageRangeFilter = useMemo(() => (
    <div className="space-y-4">
      <Label className="text-white font-semibold">Пробег (км)</Label>
      <div className="grid grid-cols-2 gap-4">
        <div className="relative">
          <Label className="text-sm text-gray-400">От</Label>
          <Input
            type="number"
            min="0"
            placeholder="0"
            value={tempFilters.mileageMin || ''}
            onChange={(e) => {
              const value = Math.max(0, Number(e.target.value) || 0);
              setTempFilters(prev => ({ ...prev, mileageMin: value > 0 ? value : undefined }));
            }}
            onFocus={() => {
              setFocusedField('mileageMin');
            }}
            onBlur={(e) => {
              const value = Number(e.target.value);
              if (value <= 0) {
                setTempFilters(prev => ({ ...prev, mileageMin: undefined }));
              }
              setTimeout(() => {
                setFocusedField(null);
              }, 150);
            }}
            className="mt-1 bg-[#1a2332]/50 border-[#c9a86e]/20 text-white placeholder-gray-400 focus:border-[#c9a86e]/50"
          />
          <div className={`absolute top-full left-0 right-0 mt-1 bg-[#0e1720] border border-[#c9a86e]/30 rounded-md shadow-lg z-50 transition-all duration-200 ease-in-out ${
            focusedField === 'mileageMin'
              ? 'opacity-100 transform translate-y-0'
              : 'opacity-0 transform -translate-y-2 pointer-events-none'
          }`}>
            <div className="p-2 space-y-1">
              <button
                type="button"
                className="w-full text-left px-2 py-1 text-sm text-white hover:bg-[#c9a86e]/20 rounded transition-colors"
                onClick={() => {
                  setTempFilters(prev => ({ ...prev, mileageMin: 0 }));
                  setFocusedField(null);
                }}
              >
                0
              </button>
              <button
                type="button"
                className="w-full text-left px-2 py-1 text-sm text-white hover:bg-[#c9a86e]/20 rounded transition-colors"
                onClick={() => {
                  setTempFilters(prev => ({ ...prev, mileageMin: 25000 }));
                  setFocusedField(null);
                }}
              >
                25 000
              </button>
              <button
                type="button"
                className="w-full text-left px-2 py-1 text-sm text-white hover:bg-[#c9a86e]/20 rounded transition-colors"
                onClick={() => {
                  setTempFilters(prev => ({ ...prev, mileageMin: 50000 }));
                  setFocusedField(null);
                }}
              >
                50 000
              </button>
              <button
                type="button"
                className="w-full text-left px-2 py-1 text-sm text-white hover:bg-[#c9a86e]/20 rounded transition-colors"
                onClick={() => {
                  setTempFilters(prev => ({ ...prev, mileageMin: 75000 }));
                  setFocusedField(null);
                }}
              >
                75 000
              </button>
              <button
                type="button"
                className="w-full text-left px-2 py-1 text-sm text-white hover:bg-[#c9a86e]/20 rounded transition-colors"
                onClick={() => {
                  setTempFilters(prev => ({ ...prev, mileageMin: 100000 }));
                  setFocusedField(null);
                }}
              >
                100 000
              </button>
              <button
                type="button"
                className="w-full text-left px-2 py-1 text-sm text-white hover:bg-[#c9a86e]/20 rounded transition-colors"
                onClick={() => {
                  setTempFilters(prev => ({ ...prev, mileageMin: 125000 }));
                  setFocusedField(null);
                }}
              >
                125 000
              </button>
              <button
                type="button"
                className="w-full text-left px-2 py-1 text-sm text-white hover:bg-[#c9a86e]/20 rounded transition-colors"
                onClick={() => {
                  setTempFilters(prev => ({ ...prev, mileageMin: 150000 }));
                  setFocusedField(null);
                }}
              >
                150 000
              </button>
              <button
                type="button"
                className="w-full text-left px-2 py-1 text-sm text-white hover:bg-[#c9a86e]/20 rounded transition-colors"
                onClick={() => {
                  setTempFilters(prev => ({ ...prev, mileageMin: 175000 }));
                  setFocusedField(null);
                }}
              >
                175 000
              </button>
              <button
                type="button"
                className="w-full text-left px-2 py-1 text-sm text-white hover:bg-[#c9a86e]/20 rounded transition-colors"
                onClick={() => {
                  setTempFilters(prev => ({ ...prev, mileageMin: 200000 }));
                  setFocusedField(null);
                }}
              >
                200 000
              </button>
            </div>
          </div>
        </div>
        <div className="relative">
          <Label className="text-sm text-gray-400">До</Label>
          <Input
            type="number"
            min="0"
            placeholder="∞"
            value={tempFilters.mileageMax || ''}
            onChange={(e) => {
              const value = Math.max(0, Number(e.target.value) || 0);
              setTempFilters(prev => ({ ...prev, mileageMax: value > 0 ? value : undefined }));
            }}
            onFocus={() => {
              setFocusedField('mileageMax');
            }}
            onBlur={(e) => {
              const value = Number(e.target.value);
              if (value <= 0) {
                setTempFilters(prev => ({ ...prev, mileageMax: undefined }));
              }
              setTimeout(() => {
                setFocusedField(null);
              }, 150);
            }}
            className="mt-1 bg-[#1a2332]/50 border-[#c9a86e]/20 text-white placeholder-gray-400 focus:border-[#c9a86e]/50"
          />
          <div className={`absolute top-full left-0 right-0 mt-1 bg-[#0e1720] border border-[#c9a86e]/30 rounded-md shadow-lg z-50 transition-all duration-200 ease-in-out ${
            focusedField === 'mileageMax'
              ? 'opacity-100 transform translate-y-0'
              : 'opacity-0 transform -translate-y-2 pointer-events-none'
          }`}>
            <div className="p-2 space-y-1">
              <button
                type="button"
                className="w-full text-left px-2 py-1 text-sm text-white hover:bg-[#c9a86e]/20 rounded transition-colors"
                onClick={() => {
                  setTempFilters(prev => ({ ...prev, mileageMax: 0 }));
                  setFocusedField(null);
                }}
              >
                0
              </button>
              <button
                type="button"
                className="w-full text-left px-2 py-1 text-sm text-white hover:bg-[#c9a86e]/20 rounded transition-colors"
                onClick={() => {
                  setTempFilters(prev => ({ ...prev, mileageMax: 25000 }));
                  setFocusedField(null);
                }}
              >
                25 000
              </button>
              <button
                type="button"
                className="w-full text-left px-2 py-1 text-sm text-white hover:bg-[#c9a86e]/20 rounded transition-colors"
                onClick={() => {
                  setTempFilters(prev => ({ ...prev, mileageMax: 50000 }));
                  setFocusedField(null);
                }}
              >
                50 000
              </button>
              <button
                type="button"
                className="w-full text-left px-2 py-1 text-sm text-white hover:bg-[#c9a86e]/20 rounded transition-colors"
                onClick={() => {
                  setTempFilters(prev => ({ ...prev, mileageMax: 75000 }));
                  setFocusedField(null);
                }}
              >
                75 000
              </button>
              <button
                type="button"
                className="w-full text-left px-2 py-1 text-sm text-white hover:bg-[#c9a86e]/20 rounded transition-colors"
                onClick={() => {
                  setTempFilters(prev => ({ ...prev, mileageMax: 100000 }));
                  setFocusedField(null);
                }}
              >
                100 000
              </button>
              <button
                type="button"
                className="w-full text-left px-2 py-1 text-sm text-white hover:bg-[#c9a86e]/20 rounded transition-colors"
                onClick={() => {
                  setTempFilters(prev => ({ ...prev, mileageMax: 125000 }));
                  setFocusedField(null);
                }}
              >
                125 000
              </button>
              <button
                type="button"
                className="w-full text-left px-2 py-1 text-sm text-white hover:bg-[#c9a86e]/20 rounded transition-colors"
                onClick={() => {
                  setTempFilters(prev => ({ ...prev, mileageMax: 150000 }));
                  setFocusedField(null);
                }}
              >
                150 000
              </button>
              <button
                type="button"
                className="w-full text-left px-2 py-1 text-sm text-white hover:bg-[#c9a86e]/20 rounded transition-colors"
                onClick={() => {
                  setTempFilters(prev => ({ ...prev, mileageMax: 175000 }));
                  setFocusedField(null);
                }}
              >
                175 000
              </button>
              <button
                type="button"
                className="w-full text-left px-2 py-1 text-sm text-white hover:bg-[#c9a86e]/20 rounded transition-colors"
                onClick={() => {
                  setTempFilters(prev => ({ ...prev, mileageMax: 200000 }));
                  setFocusedField(null);
                }}
              >
                200 000
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ), [tempFilters.mileageMin, tempFilters.mileageMax, focusedField]);

  const EngineVolumeRangeFilter = useMemo(() => (
    <div className="space-y-4">
      <Label className="text-white font-semibold">Объем двигателя (см³)</Label>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm text-gray-400">От</Label>
          <Input
            type="number"
            placeholder="0"
            value={tempFilters.engineVolumeMin || ''}
            onChange={(e) => setTempFilters(prev => ({ ...prev, engineVolumeMin: e.target.value ? Number(e.target.value) : undefined }))}
            onFocus={() => {
              // Убеждаемся, что фокус на поле объема двигателя не влияет на поля пробега
              if (focusedField && focusedField.startsWith('mileage')) {
                setFocusedField(null);
              }
            }}
            className="mt-1 bg-[#1a2332]/50 border-[#c9a86e]/20 text-white placeholder-gray-400 focus:border-[#c9a86e]/50"
          />
        </div>
        <div>
          <Label className="text-sm text-gray-400">До</Label>
          <Input
            type="number"
            placeholder="∞"
            value={tempFilters.engineVolumeMax || ''}
            onChange={(e) => setTempFilters(prev => ({ ...prev, engineVolumeMax: e.target.value ? Number(e.target.value) : undefined }))}
            onFocus={() => {
              // Убеждаемся, что фокус на поле объема двигателя не влияет на поля пробега
              if (focusedField && focusedField.startsWith('mileage')) {
                setFocusedField(null);
              }
            }}
            className="mt-1 bg-[#1a2332]/50 border-[#c9a86e]/20 text-white placeholder-gray-400 focus:border-[#c9a86e]/50"
          />
        </div>
      </div>
    </div>
  ), [tempFilters.engineVolumeMin, tempFilters.engineVolumeMax, focusedField]);

  // Локально вычисляем модели для выбранной марки по tempFilters.brand
  const availableModels = useMemo(() => {
    if (!tempFilters.brand) return [] as Array<{ id: string; name: string }>;
    const brandObj = marksAndModels.find((b) => b.id === tempFilters.brand);
    return brandObj?.models || [];
  }, [tempFilters.brand, marksAndModels]);

  // Фильтры, поддерживаемые китайским парсером
  const engTypeOptions = [
    { id: 'petrol', name: 'Бензин' },
    { id: 'diesel', name: 'Дизель' },
    { id: 'hybrid', name: 'Гибрид' },
    { id: 'mild-hybrid-24v', name: 'Мягкий гибрид 24V' },
    { id: 'mild-hybrid-48v', name: 'Мягкий гибрид 48V' },
    { id: 'series-hybrid', name: 'Последовательный гибрид' },
    { id: 'electric', name: 'Электрический' },
    { id: 'gas', name: 'Газ' },
    { id: 'petrol-gas-mix', name: 'Смешивание нефти и газа' }
  ];

  const driveOptions = [
    { id: 'fwd', name: 'Передний' },
    { id: 'rwd', name: 'Задний' },
    { id: 'awd', name: 'Полный' }
  ];

  const bodyTypeOptions = [
    { id: 'suv', name: 'Внедорожник' },
    { id: 'cabriolet', name: 'Кабриолет' },
    { id: 'minibus', name: 'Микроавтобус' },
    { id: 'minivan', name: 'Минивэн' },
    { id: 'pickup', name: 'Пикап' },
    { id: 'sedan', name: 'Седан' },
    { id: 'sportscar', name: 'Спорткар' },
    { id: 'universal', name: 'Универсал' },
    { id: 'hatchback', name: 'Хетчбек' }
  ];

  const sortOptions = [
    { id: 'low_price', name: 'Цена: по возрастанию' },
    { id: 'high_price', name: 'Цена: по убыванию' },
    { id: 'old', name: 'Год: по возрастанию' },
    { id: 'new', name: 'Год: по убыванию' }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Desktop Filters */}
      <div className="hidden lg:block space-y-6">
        {/* Шапка компонента */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Filter className="w-5 h-5 text-[#c9a86e] mr-2" />
            <h3 className="text-lg font-semibold text-white">Фильтры</h3>
          </div>
          <div className="flex items-center gap-2">
            {getActiveFiltersCount() > 0 && (
              <Badge className="bg-[#c9a86e] text-[#0e1720] font-semibold">
                {getActiveFiltersCount()}
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-gray-400 hover:text-white hover:bg-[#c9a86e]/10"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
        {PriceRangeFilter}
        {YearRangeFilter}
        {MileageRangeFilter}
        {EngineVolumeRangeFilter}

        <CustomSelect
          label="Марка"
          value={tempFilters.brand}
          onValueChange={(value) => setTempFilters(prev => ({ ...prev, brand: value, model: undefined }))}
          options={brands}
          placeholder="Выберите марку"
        />

        <CustomSelect
          label="Модель"
          value={tempFilters.model}
          onValueChange={(value) => setTempFilters(prev => ({ ...prev, model: value }))}
          options={availableModels}
          placeholder="Выберите модель"
        />

        <CustomSelect
          label="Тип кузова"
          value={tempFilters.bodyType}
          onValueChange={(value) => setTempFilters(prev => ({ ...prev, bodyType: value }))}
          options={bodyTypeOptions}
          placeholder="Выберите тип кузова"
        />

        <CustomSelect
          label="Тип двигателя"
          value={tempFilters.engType}
          onValueChange={(value) => setTempFilters(prev => ({ ...prev, engType: value }))}
          options={engTypeOptions}
          placeholder="Выберите тип двигателя"
        />

        <CustomSelect
          label="Привод"
          value={tempFilters.drive}
          onValueChange={(value) => setTempFilters(prev => ({ ...prev, drive: value }))}
          options={driveOptions}
          placeholder="Выберите привод"
        />

        <CustomSelect
          label="Сортировка"
          value={tempFilters.sort}
          onValueChange={(value) => setTempFilters(prev => ({ ...prev, sort: value }))}
          options={sortOptions}
          placeholder="Выберите сортировку"
        />
        {/* Кнопки */}
        <div className="space-y-3">
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
    </div>
  );
} 