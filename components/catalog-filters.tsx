'use client';

console.log('=== ФАЙЛ ФИЛЬТРОВ ЗАГРУЖЕН ===');

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
  powerMin?: number;
  powerMax?: number;
  brand?: string;
  model?: string;
  bodyType?: string;
  rate?: string;
}

interface CatalogFiltersProps {
  filters: FilterValues;
  onFiltersChange: (filters: FilterValues) => void;
  brands: Array<{ id: string; name: string }>;
  models: Array<{ id: string; name: string }>;
  bodyTypes: Array<{ id: string; name: string }>;
  className?: string;
  onMobileClose?: () => void;
}

export function CatalogFilters({
  filters,
  onFiltersChange,
  brands,
  models,
  bodyTypes,
  className = '',
  onMobileClose
}: CatalogFiltersProps) {
  console.log('=== КОМПОНЕНТ ФИЛЬТРОВ ЗАГРУЖЕН ===');
  
  // Два состояния: временные и примененные фильтры
  const [tempFilters, setTempFilters] = useState<FilterValues>(filters);
  const [appliedFilters, setAppliedFilters] = useState<FilterValues>(filters);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState<string | null>(null);

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
    console.log('=== ПРИМЕНЕНИЕ ФИЛЬТРОВ ===');
    console.log('Применяем фильтры:', tempFilters);
    setAppliedFilters(tempFilters);
    onFiltersChange(tempFilters);
    // Закрываем мобильное окно если функция передана
    if (onMobileClose) {
      onMobileClose();
    }
  }, [tempFilters, onFiltersChange, onMobileClose]);

  const handleReset = useCallback(() => {
    console.log('=== СБРОС ФИЛЬТРОВ ===');
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
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
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
            onClick={() => setIsOpen(!isOpen)}
            className="w-full bg-[#0e1720] border border-[#c9a86e]/30 text-white focus:border-[#c9a86e] rounded-md px-3 py-2 text-left flex items-center justify-between transition-all duration-200 hover:border-[#c9a86e]/50"
          >
            <span className={selectedOption ? 'text-white' : 'text-white/50'}>
              {selectedOption ? selectedOption.name : placeholder}
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </button>
          
          <div className={`absolute top-full left-0 right-0 mt-1 bg-[#0e1720] border border-[#c9a86e]/30 rounded-md max-h-[400px] overflow-y-auto z-50 transition-all duration-200 ease-out ${
            isOpen 
              ? 'opacity-100 scale-100 translate-y-0' 
              : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
          }`}>
            {/* Опция "Пусто" */}
            <button
              type="button"
              onClick={() => {
                onValueChange('');
                setIsOpen(false);
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
                  setIsOpen(false);
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
  }, []);

  // Мемоизированные компоненты фильтров
  const PriceRangeFilter = useMemo(() => (
    <div className="space-y-4">
      <Label className="text-white font-semibold">Цена (₽)</Label>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-sm text-white/70">От</Label>
          <Input
            type="number"
            min="0"
            placeholder="0"
            value={tempFilters.priceMin || ''}
            onChange={(e) => {
              const value = Math.max(0, Number(e.target.value) || 0);
              setTempFilters(prev => ({ ...prev, priceMin: value > 0 ? value : undefined }));
            }}
            className="bg-[#0e1720] border-[#c9a86e]/30 text-white focus:border-[#c9a86e]"
          />
        </div>
        <div>
          <Label className="text-sm text-white/70">До</Label>
          <Input
            type="number"
            min="0"
            placeholder="∞"
            value={tempFilters.priceMax || ''}
            onChange={(e) => {
              const value = Math.max(0, Number(e.target.value) || 0);
              setTempFilters(prev => ({ ...prev, priceMax: value > 0 ? value : undefined }));
            }}
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
              min="0"
              max={currentYear}
              placeholder="0"
              value={tempFilters.yearMin || ''}
              onChange={(e) => {
                const value = Math.max(0, Math.min(currentYear, Number(e.target.value) || 0));
                setTempFilters(prev => ({ ...prev, yearMin: value > 0 ? value : undefined }));
              }}
              className="bg-[#0e1720] border-[#c9a86e]/30 text-white focus:border-[#c9a86e]"
            />
          </div>
          <div>
            <Label className="text-sm text-white/70">До</Label>
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
        <div className="relative">
          <Label className="text-sm text-white/70">От</Label>
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
              setIsClosing(null);
            }}
            onBlur={(e) => {
              const value = Number(e.target.value);
              if (value <= 0) {
                setTempFilters(prev => ({ ...prev, mileageMin: undefined }));
              }
              setIsClosing('mileageMin');
              setTimeout(() => {
                setFocusedField(null);
                setIsClosing(null);
              }, 200);
            }}
            className="bg-[#0e1720] border-[#c9a86e]/30 text-white focus:border-[#c9a86e]"
          />
          <div className={`absolute top-full left-0 right-0 mt-1 bg-[#0e1720] border border-[#c9a86e]/30 rounded-md shadow-lg z-50 transition-all duration-200 ease-in-out ${
            focusedField === 'mileageMin' && !isClosing
              ? 'opacity-100 transform translate-y-0' 
              : 'opacity-0 transform -translate-y-2'
          } ${isClosing === 'mileageMin' ? 'pointer-events-none' : ''}`}>
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
                  setTempFilters(prev => ({ ...prev, mileageMin: 150000 }));
                  setFocusedField(null);
                }}
              >
                150 000
              </button>
            </div>
          </div>
        </div>
        <div className="relative">
          <Label className="text-sm text-white/70">До</Label>
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
              setIsClosing(null);
            }}
            onBlur={(e) => {
              const value = Number(e.target.value);
              if (value <= 0) {
                setTempFilters(prev => ({ ...prev, mileageMax: undefined }));
              }
              setIsClosing('mileageMax');
              setTimeout(() => {
                setFocusedField(null);
                setIsClosing(null);
              }, 200);
            }}
            className="bg-[#0e1720] border-[#c9a86e]/30 text-white focus:border-[#c9a86e]"
          />
          <div className={`absolute top-full left-0 right-0 mt-1 bg-[#0e1720] border border-[#c9a86e]/30 rounded-md shadow-lg z-50 transition-all duration-200 ease-in-out ${
            focusedField === 'mileageMax' && !isClosing
              ? 'opacity-100 transform translate-y-0' 
              : 'opacity-0 transform -translate-y-2'
          } ${isClosing === 'mileageMax' ? 'pointer-events-none' : ''}`}>
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
                  setTempFilters(prev => ({ ...prev, mileageMax: 150000 }));
                  setFocusedField(null);
                }}
              >
                150 000
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
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-sm text-white/70">От</Label>
          <Input
            type="number"
            placeholder="1000"
            value={tempFilters.engineVolumeMin || ''}
            onChange={(e) => setTempFilters(prev => ({ ...prev, engineVolumeMin: e.target.value ? Number(e.target.value) : undefined }))}
            className="bg-[#0e1720] border-[#c9a86e]/30 text-white focus:border-[#c9a86e]"
          />
        </div>
        <div>
          <Label className="text-sm text-white/70">До</Label>
          <Input
            type="number"
            placeholder="5000"
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

  // Создаем опции для оценок (реальные значения с японского сайта)
  const rateOptions = [
    { id: '5.5', name: '5.5 - Отличное состояние' },
    { id: '5', name: '5 - Очень хорошее состояние' },
    { id: '4.5', name: '4.5 - Хорошее состояние' },
    { id: '4', name: '4 - Удовлетворительное состояние' },
    { id: '3.5', name: '3.5 - Среднее состояние' },
    { id: '3', name: '3 - Ниже среднего' },
    { id: 'R', name: 'R - Требует ремонта' },
    { id: 'RA', name: 'RA - Требует серьезного ремонта' }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Desktop Filters */}
      <div className="hidden lg:block space-y-6">
        {PriceRangeFilter}
        <Separator className="bg-[#c9a86e]/20" />
        {YearRangeFilter}
        <Separator className="bg-[#c9a86e]/20" />
        {MileageRangeFilter}
        <Separator className="bg-[#c9a86e]/20" />
        {EngineVolumeRangeFilter}
        <Separator className="bg-[#c9a86e]/20" />
        {PowerRangeFilter}
        <Separator className="bg-[#c9a86e]/20" />
        
        <CustomSelect
          label="Марка"
          value={tempFilters.brand}
          onValueChange={(value) => setTempFilters(prev => ({ ...prev, brand: value || undefined, model: value ? prev.model : undefined }))}
          options={brands}
          placeholder="Выберите марку"
        />
        
        <CustomSelect
          label="Модель"
          value={tempFilters.model}
          onValueChange={(value) => setTempFilters(prev => ({ ...prev, model: value || undefined }))}
          options={models}
          placeholder="Выберите модель"
        />
        

        
        <CustomSelect
          label="Тип кузова"
          value={tempFilters.bodyType}
          onValueChange={(value) => setTempFilters(prev => ({ ...prev, bodyType: value || undefined }))}
          options={bodyTypes}
          placeholder="Выберите кузов"
        />
        
        <CustomSelect
          label="Оценка состояния"
          value={tempFilters.rate}
          onValueChange={(value) => setTempFilters(prev => ({ ...prev, rate: value || undefined }))}
          options={rateOptions}
          placeholder="Выберите оценку"
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