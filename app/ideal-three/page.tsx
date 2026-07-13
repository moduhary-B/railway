"use client"

// Форк главной — /ideal — премиум-редакция:
// - редакционный сериф Cormorant Garamond для акцентных слов
// - JetBrains Mono для цифр/kicker/section-index
// - kicker с чёрточкой слева, section-counter "01 / КАТАЛОГ"
// - shadow-lux (inset блик + тёплая тень) вместо shadow-xl
// - btn-sweep с movement-градиентом
// - grain overlay на всей странице
// - softened top-edge между секциями
export const dynamic = "force-dynamic"

console.log('=== ГЛАВНАЯ /ideal ЗАГРУЖЕНА ===');

import { useState, useRef, useEffect, createRef } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ChevronRight,
  ChevronLeft,
  Phone,
  Mail,
  Clock,
  Star,
  Shield,
  Award,
  Users,
  Truck,
  FileCheck,
  Headphones,
  CheckCircle,
  Play,
  ArrowRight,
  Menu,
  X,
  Instagram,
  Youtube,
  TextIcon as Telegram,
  Facebook,
  Car,
  Maximize2,
  XIcon,
  MapPin,
  Badge,
  ShieldCheck,
  ParkingCircle,
  Banknote,
} from "lucide-react"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel"
import ChatIllustrationIdeal from '@/components/ChatIllustrationIdeal';
import YandexMap from "@/components/YandexMap";
import DebugBreakpoints from "@/components/DebugBreakpoints"; // eslint-disable-line @typescript-eslint/no-unused-vars
void DebugBreakpoints;
import { SocialIcon, SocialLinkButton, ORIENT_SOCIALS } from "@/components/social-icons";
import { useConsultationModal } from "@/components/consultation-modal";
import SmartWidgetsLoader from "@/components/smart-widgets-loader";
import ReviewsWidget from "@/components/reviews-widget";
import {
  ReviewsVariantGrid,
  ReviewsVariantHero,
  VariantDivider,
} from "@/components/reviews-variants";
import FloatingContactWidget from "@/components/floating-contact-widget";
import CountryPattern from "@/components/country-pattern";
import HowWeWorkScroll from "@/components/HowWeWorkScroll";
import HowWeWorkScrollV2 from "@/components/HowWeWorkScrollV2";
import { motion } from "framer-motion";

export default function Home() {
  const consultation = useConsultationModal()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeReviewIndex, setActiveReviewIndex] = useState(0)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const reviewsRef = useRef<HTMLDivElement>(null)
  const aboutCarouselRef = useRef<HTMLDivElement>(null)
  const [selectedVideo, setSelectedVideo] = useState<null | { src: string; title: string; car: string }>(null)
  const previewVideoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  // refs для превью-видео (отзывы)
  const reviewPreviewVideoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const videoTouchStartX = useRef<number | null>(null)

  // Touch/swipe handlers
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = (currentIndex: number, maxIndex: number, setIndex: (index: number) => void) => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      // Свайп влево - переход к следующему элементу
      setIndex(Math.min(currentIndex + 1, maxIndex));
    } else if (isRightSwipe) {
      // Свайп вправо - переход к предыдущему элементу
      setIndex(Math.max(currentIndex - 1, 0));
    }
  };

  const reviews = [
    {
      name: "Иван Петров",
      rating: 5,
      text: "Отличный сервис! Заказывал Toyota Land Cruiser из Японии. Все привезли в срок, состояние автомобиля полностью соответствует описанию. Рекомендую!",
      car: "Toyota Land Cruiser",
    },
    {
      name: "Алексей Смирнов",
      rating: 5,
      text: "Заказывал Kia K5 из Кореи. Очень доволен работой компании. Профессиональный подход, постоянная связь с менеджером, прозрачность на всех этапах сделки.",
      car: "Kia K5",
    },
    {
      name: "Мария Иванова",
      rating: 4,
      text: "Хорошая компания, привезли Mazda CX-5 в отличном состоянии. Единственный минус - немного затянули с доставкой, но в целом все хорошо.",
      car: "Mazda CX-5",
    },
    {
      name: "Дмитрий Козлов",
      rating: 5,
      text: "Заказывал Lexus RX из Японии. Очень доволен качеством автомобиля и сервисом компании. Все документы оформлены правильно, автомобиль доставлен в срок.",
      car: "Lexus RX",
    },
    {
      name: "Елена Соколова",
      rating: 5,
      text: "Отличная компания! Помогли подобрать и привезти Honda CR-V из Японии. Автомобиль в идеальном состоянии, все как на фото с аукциона.",
      car: "Honda CR-V",
    },
  ]

  const clientCars = [
    {
      id: 1,
      name: "Toyota Land Cruiser 300",
      year: 2022,
      country: "Япония",
      image: "/p/r1.jpg?height=400&width=600",
    },
    { id: 2, name: "Lexus LX 600", year: 2025, country: "Япония", image: "/p/r3.jpg?height=400&width=600" },
    { id: 3, name: "Kia K5", year: 2022, country: "Корея", image: "/p/r2.jpg?height=400&width=600" },
    { id: 4, name: "Hyundai Palisade", year: 2025, country: "Корея", image: "/p/r4.webp?height=400&width=600" },
    { id: 5, name: "Chery Tiggo 8 Pro", year: 2025, country: "Китай", image: "/p/r5.jpg?height=400&width=600" },
    { id: 6, name: "Geely Monjaro", year: 2022, country: "Китай", image: "/p/r6.jpg?height=400&width=600" },
  ]

  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 300
      if (direction === "left") {
        carouselRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" })
      } else {
        carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
      }
    }
  }

  const nextReview = () => {
    setActiveReviewIndex((prev) => (prev + 1) % 2) // Теперь у нас 2 страницы отзывов
  }

  const prevReview = () => {
    setActiveReviewIndex((prev) => (prev - 1 + 2) % 2) // Теперь у нас 2 страницы отзывов
  }

  useEffect(() => {
    if (carouselRef.current) {
      const autoScroll = () => {
        carouselRef.current!.scrollLeft += 2
        if (carouselRef.current!.scrollLeft >= carouselRef.current!.scrollWidth - carouselRef.current!.clientWidth) {
          carouselRef.current!.scrollLeft = 0
        }
      }

      const intervalId = setInterval(autoScroll, 20)

      return () => clearInterval(intervalId)
    }
  }, [])

  const openImageModal = (imageSrc: string) => {
    setSelectedImage(imageSrc)
    document.body.style.overflow = "hidden" // Prevent scrolling when modal is open
  }

  const closeImageModal = () => {
    setSelectedImage(null)
    document.body.style.overflow = "" // Re-enable scrolling
  }

  // --- Карусель видео ---
  const videoSlides = [
    {
      title: "Сравним стоимость АВТО на вторичном рынке и ПОД ЗАКАЗ!",
      desc: "Подробный обзор процесса покупки автомобилей на аукционах",
      video: "/usvid/v1.mp4",
      preview: "/usvid/v1.JPG",
      original: { url: "https://youtube.com/shorts/89BmYyKqhxc?si=9Jugwg8UyJ1z-ZQl", type: "youtube" },
    },
    {
      title: "Как не лишиться машины в 2025",
      desc: "Финальный этап - получение ключей",
      video: "/usvid/v12.mp4",
      preview: "/usvid/v12.JPG",
      original: { url: "https://www.youtube.com/shorts/GESHST9Domg", type: "youtube" },
    },
    {
      title: "Как мы экономим Вам до 500.000₽ при покупке АВТО?",
      desc: "Все этапы таможенного оформления",
      video: "/usvid/v3.mp4",
      preview: "/usvid/v3.PNG",
      original: { url: "https://www.youtube.com/shorts/AHkYz7h7tXg", type: "youtube" },
    },
    {
      title: "3 + автомобиля на правом руле",
      desc: "Как происходит доставка от аукциона до клиента",
      video: "/usvid/v2.MOV",
      preview: "/usvid/v2.PNG",
      original: { url: "https://t.me/orientauto_vl/580", type: "telegram" },
    },
    {
      title: "Лучшие предложения АВТО по приятным ценам!",
      desc: "Критерии выбора лучших лотов",
      video: "/usvid/v4.MP4",
      preview: "/usvid/v4.PNG",
      original: { url: "https://t.me/orientauto_vl/524", type: "telegram" },
    },
    {
      title: "Стоит ли брать автомобиль из-за границы с пробегом более 100.000 км?",
      desc: "Финальный этап - получение ключей",
      video: "/usvid/v11.mp4",
      preview: "/usvid/v11.PNG",
      original: { url: "https://www.youtube.com/shorts/TZg_o5mGw3U", type: "youtube" },
    },
    {
      title: "Почему GEELY купила VOLVO?",
      desc: "Финальный этап - получение ключей",
      video: "/usvid/v10.MOV",
      preview: "/usvid/v10.PNG",
      original: { url: "https://t.me/orientauto_vl/588", type: "telegram" },
    },
    {
      title: "Штрав запрогрев двигателя",
      desc: "Оформление всех необходимых документов",
      video: "/usvid/v7.mp4",
      preview: "/usvid/v7.PNG",
      original: { url: "https://www.youtube.com/shorts/vFUSF8B4CSg?si=okbWE95IiBLW_TzO", type: "youtube" },
    },
    {
      title: "Как не попасть на мошенников при заказе авто",
      desc: "Независимая экспертиза каждого автомобиля",
      video: "/usvid/v6.MOV",
      preview: "/usvid/v6.PNG",
      original: { url: "https://t.me/orientauto_vl/410", type: "telegram" },
    },
    {
      title: "Для чего нужна временная регистрация при таможне АВТО?",
      desc: "Критерии выбора лучших лотов",
      video: "/usvid/v5.mp4",
      preview: "/usvid/v5.PNG",
      original: { url: "https://www.youtube.com/shorts/hpiTckX8lDw?si=0Iy5NNvO393TvyAt", type: "youtube" },
    },
    {
      title: "ПОЧЕМУ АВТО У ДИЛЕРА ДОРОЖЕ,ЧЕМ ПОД ЗАКАЗ?",
      desc: "Организация перевозки в любой регион",
      video: "/usvid/v8.MOV",
      preview: "/usvid/v8.PNG",
      original: { url: "https://t.me/orientauto_vl/596", type: "telegram" },
    },
    {
      title: "Китайски авто = плохо ?",
      desc: "Финальный этап - получение ключей",
      video: "/usvid/v9.mp4",
      preview: "/usvid/v9.PNG",
      original: { url: "https://youtube.com/shorts/7xsXj_-qMPU?si=Q6YVozFPMyKjX5f_", type: "youtube" },
    },
  ];
  const VIDEOS_PER_SLIDE = 4;
  const videoSlidesChunks = Array.from({ length: Math.ceil(videoSlides.length / VIDEOS_PER_SLIDE) }, (_, i) =>
    videoSlides.slice(i * VIDEOS_PER_SLIDE, i * VIDEOS_PER_SLIDE + VIDEOS_PER_SLIDE)
  );
  const extendedVideoSlides = videoSlidesChunks.length > 1 ? [...videoSlidesChunks, videoSlidesChunks[0]] : videoSlidesChunks;
  const [activeVideoSlide, setActiveVideoSlide] = useState(0);
  const [activeVideoSlideMobile, setActiveVideoSlideMobile] = useState(0);
  const videoWithTransition = true;
  const goToVideoSlide = (target: number, _animated = true) => setActiveVideoSlide(target);
  const changeActiveVideo = (step: number) => {
    setActiveVideoSlide((current) => (current + step + videoSlides.length) % videoSlides.length)
  }

  const mediaSocials = [
    { href: "https://t.me/orientauto_ru", net: "telegram" as const, label: "Telegram", detail: "Новости и поставки", color: "#26A5E4" },
    { href: "https://www.instagram.com/orientauto.ru?igsh=MTc3c3k0Z2J0ZWRtOA==", net: "instagram" as const, label: "Instagram", detail: "Авто и команда", color: "#d6249f" },
    { href: "https://max.ru/id253401357515_biz", net: "max" as const, label: "MAX", detail: "Канал компании", color: "#7357ff" },
    { href: "https://youtube.com/@orientauto_ru?si=5clsE_vZHCv3Iawc", net: "youtube" as const, label: "YouTube", detail: "Видео и разборы", color: "#FF0000" },
  ]

  const renderMediaIcon = (network: (typeof mediaSocials)[number]["net"], size = 23) => {
    if (network === "instagram" || network === "max") {
      return (
        <Image
          src={network === "instagram" ? "/icons/instagram.svg" : "/icons/max-mark.svg"}
          alt=""
          width={size}
          height={size}
          className={network === "max" ? "rounded-[22%]" : undefined}
          loading="eager"
          unoptimized
        />
      )
    }

    return <SocialIcon network={network} size={size} />
  }

  const handleVideoTouchEnd = (event: React.TouchEvent) => {
    if (videoTouchStartX.current === null) return

    const distance = videoTouchStartX.current - event.changedTouches[0].clientX
    videoTouchStartX.current = null
    if (Math.abs(distance) < minSwipeDistance) return

    changeActiveVideo(distance > 0 ? 1 : -1)
  }

  // --- Фото для блока 'О нас' ---
  const aboutPhotos = [
    { src: "/kupl/p1.PNG?height=300&width=300", alt: "Orient Auto Team 1" },
    { src: "/kupl/p2.PNG?height=300&width=300", alt: "Orient Auto Team 2" },
    { src: "/kupl/p3.PNG?height=300&width=300", alt: "Orient Auto Team 3" },
    { src: "/kupl/p4.PNG?height=300&width=300", alt: "Orient Auto Team 4" },
    { src: "/kupl/p5.PNG?height=300&width=300", alt: "Orient Auto Team 5" },
    { src: "/kupl/p6.PNG?height=300&width=300", alt: "Orient Auto Team 6" },
    { src: "/kupl/p7.PNG?height=300&width=300", alt: "Orient Auto Team 7" },
    { src: "/kupl/p8.PNG?height=300&width=300", alt: "Orient Auto Team 2" },
    { src: "/kupl/p9.PNG?height=300&width=300", alt: "Orient Auto Team 3" },
    { src: "/kupl/p10.PNG?height=300&width=300", alt: "Orient Auto Team 4" },
    { src: "/kupl/p11.PNG?height=300&width=300", alt: "Orient Auto Team 5" },
    { src: "/kupl/p12.PNG?height=300&width=300", alt: "Orient Auto Team 6" },
    { src: "/kupl/p13.PNG?height=300&width=300", alt: "Orient Auto Team 7" },
    { src: "/kupl/p14.PNG?height=300&width=300", alt: "Orient Auto Team 2" },
    { src: "/kupl/p15.PNG?height=300&width=300", alt: "Orient Auto Team 3" },
    { src: "/kupl/p16.PNG?height=300&width=300", alt: "Orient Auto Team 4" },
    { src: "/kupl/p17.PNG?height=300&width=300", alt: "Orient Auto Team 5" },
    { src: "/kupl/p18.PNG?height=300&width=300", alt: "Orient Auto Team 6" },
    { src: "/kupl/p19.PNG?height=300&width=300", alt: "Orient Auto Team 7" },
    { src: "/kupl/p20.PNG?height=300&width=300", alt: "Orient Auto Team 3" },
    { src: "/kupl/p21.PNG?height=300&width=300", alt: "Orient Auto Team 4" },
    { src: "/kupl/p22.PNG?height=300&width=300", alt: "Orient Auto Team 5" },
    { src: "/kupl/p23.PNG?height=300&width=300", alt: "Orient Auto Team 6" },
    { src: "/kupl/p24.PNG?height=300&width=300", alt: "Orient Auto Team 7" },
    { src: "/kupl/p25.PNG?height=300&width=300", alt: "Orient Auto Team 2" },
    { src: "/kupl/p26.PNG?height=300&width=300", alt: "Orient Auto Team 3" },
    { src: "/kupl/p27.PNG?height=300&width=300", alt: "Orient Auto Team 4" },
    { src: "/kupl/p28.PNG?height=300&width=300", alt: "Orient Auto Team 5" },
    { src: "/kupl/p29.PNG?height=300&width=300", alt: "Orient Auto Team 6" },
    // Можно добавить больше фото
  ];
  const ABOUT_PHOTOS_PER_SLIDE = 4;
  const aboutPhotoSlides = Array.from({ length: Math.ceil(aboutPhotos.length / ABOUT_PHOTOS_PER_SLIDE) }, (_, i) =>
    aboutPhotos.slice(i * ABOUT_PHOTOS_PER_SLIDE, i * ABOUT_PHOTOS_PER_SLIDE + ABOUT_PHOTOS_PER_SLIDE)
  );
  // --- Новый бесшовный слайдер с автопрокруткой и паузой ---
  const [activeAboutSlide, setActiveAboutSlide] = useState(0);
  const [withTransition, setWithTransition] = useState(true);
  const [noAuto, setNoAuto] = useState(false);
  const noAutoRef = useRef(false);
  const autoTimeout = useRef<NodeJS.Timeout | null>(null);
  const pauseTimeout = useRef<NodeJS.Timeout | null>(null);
  const ABOUT_SLIDE_ANIMATION = 500; // ms
  const AUTO_SLIDE = 5000; // ms
  const PAUSE_AFTER_MANUAL = 10000; // ms
  // extendedSlides нужен для бесконечной анимации
  const extendedSlides = aboutPhotoSlides.length > 1 ? [...aboutPhotoSlides, aboutPhotoSlides[0]] : aboutPhotoSlides;

  // Автопрокрутка
  useEffect(() => {
    if (aboutPhotoSlides.length <= 1) return;
    if (noAutoRef.current || !withTransition) return;
    if (autoTimeout.current) clearTimeout(autoTimeout.current);
    autoTimeout.current = setTimeout(() => {
      // Проверяем ещё раз перед переходом
      if (!noAutoRef.current && withTransition) goToSlide(activeAboutSlide + 1, true);
    }, AUTO_SLIDE);
    return () => {
      if (autoTimeout.current) clearTimeout(autoTimeout.current);
    };
  }, [activeAboutSlide, withTransition, aboutPhotoSlides.length]);

  // Сброс transition и индекса после анимации (вперёд)
  useEffect(() => {
    if (!withTransition) return;
    if (activeAboutSlide === aboutPhotoSlides.length) {
      // Дождаться окончания анимации, затем мгновенно вернуть к первому без transition
      const timeout = setTimeout(() => {
        setWithTransition(false);
        setActiveAboutSlide(0);
      }, ABOUT_SLIDE_ANIMATION);
      return () => clearTimeout(timeout);
    } else if (activeAboutSlide < 0) {
      // Если назад с первого — мгновенно на последний без transition
      const timeout = setTimeout(() => {
        setWithTransition(false);
        setActiveAboutSlide(aboutPhotoSlides.length - 1);
      }, ABOUT_SLIDE_ANIMATION);
      return () => clearTimeout(timeout);
    }
  }, [activeAboutSlide, withTransition, aboutPhotoSlides.length]);

  // Включаем transition обратно после "скачка"
  useEffect(() => {
    if (!withTransition) {
      // Включаем transition обратно на следующем тике
      const timeout = setTimeout(() => setWithTransition(true), 20);
      return () => clearTimeout(timeout);
    }
  }, [withTransition]);

  // Функции для переходов
  const goToSlide = (target: number, animated = true) => {
    if (!withTransition) return; // не делать переход, если transition отключён (идёт "скачок")
    setWithTransition(!!animated);
    setActiveAboutSlide(target);
  };
  // Точка/клик — сброс автопрокрутки
  const handleManual = (target: number) => {
    if (autoTimeout.current) clearTimeout(autoTimeout.current);
    if (pauseTimeout.current) clearTimeout(pauseTimeout.current);
    noAutoRef.current = true;
    goToSlide(target, true);
    pauseTimeout.current = setTimeout(() => {
      noAutoRef.current = false;
    }, PAUSE_AFTER_MANUAL);
  };

  useEffect(() => {
    if (aboutCarouselRef.current) {
      const autoScroll = () => {
        aboutCarouselRef.current!.scrollLeft += 2
        if (aboutCarouselRef.current!.scrollLeft >= aboutCarouselRef.current!.scrollWidth - aboutCarouselRef.current!.clientWidth) {
          aboutCarouselRef.current!.scrollLeft = 0
        }
      }
      const intervalId = setInterval(autoScroll, 20)
      return () => clearInterval(intervalId)
    }
  }, [])

  // --- Видео-отзывы наших клиентов ---
  const REVIEWS_PER_SLIDE = 4;
  const videoReviews = [
    {
      video: "/v-rev/o1.MOV",
      preview: "/v-rev/previews/prew1.PNG",
      clientName: "Елена из Ростова-на-Дону",
      carModel: "HONDA FREED"
    },
    {
      video: "/v-rev/o2.MOV",
      preview: "/v-rev/previews/prew2.PNG",
      clientName: "Нина из Новороссийска",
      carModel: "KIA SELTOS"
    },
    {
      video: "/v-rev/o3.MOV",
      preview: "/v-rev/previews/prew3.PNG",
      clientName: "Али из Мегиона",
      carModel: "GEELY ATLAS"
    },
    {
      video: "/v-rev/o4.MOV",
      preview: "/v-rev/previews/prew4.PNG",
      clientName: "Павел из Воронежа",
      carModel: "GENESIS GV70"
    },
    {
      video: "/v-rev/o5.MOV",
      preview: "/v-rev/previews/prew5.PNG",
      clientName: "Виталий из Екатеринбурга",
      carModel: "BMW 2 SERIES"
    },
    {
      video: "/v-rev/o11.MOV",
      preview: "/v-rev/previews/prew6.PNG",
      clientName: "Игорь из Новосибирска",
      carModel: "VOLKSWAGEN GOLF"
    },
    {
      video: "/v-rev/o7.MOV",
      preview: "/v-rev/previews/prew7.PNG",
      clientName: "Татьяна",
      carModel: "HYUNDAI SANTA FE"
    },
    {
      video: "/v-rev/o8.MOV",
      preview: "/v-rev/previews/prew8.PNG",
      clientName: "Кристина",
      carModel: "MAZDA DEMIO"
    },
    {
      video: "/v-rev/o9.MOV",
      preview: "/v-rev/previews/prew9.PNG",
      clientName: "Наталья из Старой Руссы",
      carModel: "HONDA N-WGN"
    },
    {
      video: "/v-rev/o10.MOV",
      preview: "/v-rev/previews/prew10.PNG",
      clientName: "Руслан из Тулы",
      carModel: "HONDA FREED"
    },
    {
      video: "/v-rev/o6.MOV",
      preview: "/v-rev/previews/prew11.PNG",
      clientName: "Владимир из Кирова",
      carModel: "NISSAN DAYZ ROOX"
    },
    {
      video: "/v-rev/o12.MOV",
      preview: "/v-rev/previews/prew12.PNG",
      clientName: "Наталия из Иркутска",
      carModel: "TOYOTA COROLLA FIELDER"
    },
    {
      video: "/v-rev/o13.MOV",
      preview: "/v-rev/previews/prew13.PNG",
      clientName: "Эдуард из Екатеринбурга",
      carModel: "VOLKSWAGEN GOLF ALLTRACK"
    },
    {
      video: "/v-rev/o14.MOV",
      preview: "/v-rev/previews/prew14.PNG",
      clientName: "Сергей из Иркутска",
      carModel: "TOYOTA COROLLA FIELDER"
    },
    {
      video: "/v-rev/o15.MOV",
      preview: "/v-rev/previews/prew15.PNG",
      clientName: "Владимир из Новочебоксарска",
      carModel: "SKODA OCTAVIA"
    },
    {
      video: "/v-rev/o16.MOV",
      preview: "/v-rev/previews/prew16.PNG",
      clientName: "Сергей",
      carModel: "TOYOTA SIENTA"
    }
  ];
  const videoReviewSlides = Array.from({ length: Math.ceil(videoReviews.length / REVIEWS_PER_SLIDE) }, (_, i) =>
    videoReviews.slice(i * REVIEWS_PER_SLIDE, i * REVIEWS_PER_SLIDE + REVIEWS_PER_SLIDE)
  );
  const extendedReviewSlides = videoReviewSlides.length > 1 ? [...videoReviewSlides, videoReviewSlides[0]] : videoReviewSlides;
  const [activeReviewSlide, setActiveReviewSlide] = useState(0);
  const [activeReviewSlideMobile, setActiveReviewSlideMobile] = useState(0);
  const [reviewWithTransition, setReviewWithTransition] = useState(true);
  const REVIEW_SLIDE_ANIMATION = 500;
  useEffect(() => {
    if (!reviewWithTransition) return;
    if (activeReviewSlide === videoReviewSlides.length) {
      const timeout = setTimeout(() => {
        setReviewWithTransition(false);
        setActiveReviewSlide(0);
      }, REVIEW_SLIDE_ANIMATION);
      return () => clearTimeout(timeout);
    } else if (activeReviewSlide < 0) {
      const timeout = setTimeout(() => {
        setReviewWithTransition(false);
        setActiveReviewSlide(videoReviewSlides.length - 1);
      }, REVIEW_SLIDE_ANIMATION);
      return () => clearTimeout(timeout);
    }
  }, [activeReviewSlide, reviewWithTransition, videoReviewSlides.length]);
  useEffect(() => {
    if (!reviewWithTransition) {
      const timeout = setTimeout(() => setReviewWithTransition(true), 20);
      return () => clearTimeout(timeout);
    }
  }, [reviewWithTransition]);
  const goToReviewSlide = (target: number, animated = true) => {
    if (!reviewWithTransition) return;
    setReviewWithTransition(!!animated);
    setActiveReviewSlide(target);
  };

  // --- Карусель для блока 'Команда ORIENT AUTO' ---
  // msg_19: должность + имя вынесены ПОД фото (не на фото), под каждым — телефон.
  // Финальные номера и обновлённые фото придут от клиента отдельно (заглушки того же формата).
  const teamMembers = [
    { name: "Алихан", position: "Руководитель компании", photo: "/personal/p1.PNG", phone: "+7 (995) 868-97-68" },
    { name: "Кирилл", position: "Руководитель отдела продаж", photo: "/personal/p2.PNG", phone: "+7 (995) 868-97-68" },
    { name: "Арина", position: "SMM-специалист", photo: "/personal/p3.PNG", phone: "+7 (995) 868-97-68" },
    { name: "Валентин", position: "Менеджер отдела продаж", photo: "/personal/p4.PNG", phone: "+7 (995) 868-97-68" },
    { name: "Вадим", position: "Менеджер отдела продаж", photo: "/personal/p5.PNG", phone: "+7 (995) 868-97-68" },
    { name: "Павел", position: "Менеджер отдела продаж", photo: "/personal/p6.PNG", phone: "+7 (995) 868-97-68" },
    { name: "Андрей", position: "Менеджер отдела продаж", photo: "/personal/p7.PNG", phone: "+7 (995) 868-97-68" },
    { name: "Павел", position: "Менеджер отдела продаж", photo: "/personal/p8.PNG", phone: "+7 (995) 868-97-68" },
    { name: "Владислав", position: "Менеджер отдела продаж", photo: "/personal/p9.PNG", phone: "+7 (995) 868-97-68" },
    { name: "Владислав", position: "Менеджер отдела продаж", photo: "/personal/p10.PNG", phone: "+7 (995) 868-97-68" },
  ];
  const TEAM_VISIBLE = 4;
  const CARD_WIDTH = 325; // Увеличено на ~10% при сохранении видимых 4 карточек
  const GAP = 24;
  // Адаптивные значения для мобильных устройств
  const MOBILE_CARD_WIDTH = 280;
  const MOBILE_GAP = 16;
  const MOBILE_TEAM_VISIBLE = 1;
  const SCALE = 1.07;
  const scalePadding = ((CARD_WIDTH * SCALE) - CARD_WIDTH) / 2;
  const [activeTeamSlide, setActiveTeamSlide] = useState(0);
  const [teamWithTransition, setTeamWithTransition] = useState(true);
  const TEAM_SLIDE_ANIMATION = 500;
  const teamLength = teamMembers.length;
  // Для бесшовности: дублируем последние 3 и первые 3
  const extendedTeam = [
    ...teamMembers.slice(-TEAM_VISIBLE),
    ...teamMembers,
    ...teamMembers.slice(0, TEAM_VISIBLE),
  ];
  // Адаптивная версия для мобильных
  const mobileExtendedTeam = [
    ...teamMembers.slice(-MOBILE_TEAM_VISIBLE),
    ...teamMembers,
    ...teamMembers.slice(0, MOBILE_TEAM_VISIBLE),
  ];
  const maxIndex = teamLength - 1;
  const totalSlides = teamLength;
  const realIndex = activeTeamSlide;
  const visualIndex = activeTeamSlide + TEAM_VISIBLE; // сдвиг из-за дублированных
  const mobileVisualIndex = activeTeamSlide + MOBILE_TEAM_VISIBLE; // сдвиг для мобильных
  useEffect(() => {
    if (!teamWithTransition) return;
    if (activeTeamSlide < 0) {
      const timeout = setTimeout(() => {
        setTeamWithTransition(false);
        setActiveTeamSlide(maxIndex);
      }, TEAM_SLIDE_ANIMATION);
      return () => clearTimeout(timeout);
    } else if (activeTeamSlide > maxIndex) {
      const timeout = setTimeout(() => {
        setTeamWithTransition(false);
        setActiveTeamSlide(0);
      }, TEAM_SLIDE_ANIMATION);
      return () => clearTimeout(timeout);
    }
  }, [activeTeamSlide, teamWithTransition, maxIndex]);
  useEffect(() => {
    if (!teamWithTransition) {
      const timeout = setTimeout(() => setTeamWithTransition(true), 20);
      return () => clearTimeout(timeout);
    }
  }, [teamWithTransition]);
  const goToTeamSlide = (target: number, animated = true) => {
    if (!teamWithTransition) return;
    setTeamWithTransition(!!animated);
    setActiveTeamSlide(target);
  };

  // --- Новый блок-карусель "Как заказать авто?" ---
  const orderSteps = [
    {
      step: "1",
      title: "Бесплатная консультация",
      description:
        "Оставьте заявку на сайте или позвоните нам. Менеджер расскажет о преимуществах нашей компании, и ответит на интересующие вопросы.",
      Icon: Headphones,
    },
    {
      step: "2",
      title: "Подбор авто",
      description:
        "Наши менеджера тщательно разбирают пожелания клиента и предоставляют актуальные варианты - исходя из предпочтений, бюджета и среды эксплуатации автомобиля.",
      Icon: Car,
    },
    {
      step: "3",
      title: "Оформление договора",
      description: "Составляем договор, прописываем все критерии к авто и конечный бюджет. Взнос - 50 000 / 100 000 рублей (ВОЗВРАТНЫЙ до момента покупки / бронирования авто).",
      Icon: FileCheck,
    },
    {
      step: "4",
      title: "Покупка авто",
      description: "Клиент подбирает авто под свой запрос, согласовывает ставку и бронирование. После этого оплачивает стоимость авто с доставкой во Владивосток.",
      Icon: Banknote,
    },
    {
      step: "5",
      title: "Доставка в РФ",
      description:
        "С момента покупки авто, доставка осуществляется от 7 до 20 дней (в зависимости от страны - Кореи, Японии или Китая). Далее таможенное оформление - в среднем 5 рабочих дней.",
      Icon: Truck,
    },
    {
      step: "6",
      title: "Передача клиенту / отправка клиенту",
      description: "При вручении или отправке через ТК / ЖД, у клиента на руках уже имеется полный пакет документов для постановки авто на учет.",
      Icon: CheckCircle,
    },
  ];
  const [activeOrderStep, setActiveOrderStep] = useState(0);
  const [prevOrderStep, setPrevOrderStep] = useState(0);
  const handleOrderStepChange = (nextStep: number) => {
    setPrevOrderStep(activeOrderStep);
    setActiveOrderStep(nextStep);
  };

  // 1. Вынести преимущества в массив
  const advantages = [
    {
      icon: <Shield className="w-8 h-8" />, // ВОЗВРАТ ГАРАНТИЙНОГО ВЗНОСА
      title: "ВОЗВРАТ ГАРАНТИЙНОГО ВЗНОСА",
      description: "До приобретения или бронирования автомобиля — гарантийный взнос полностью возвратный.",
    },
    {
      icon: <Truck className="w-8 h-8" />, // СРОКИ ПОСТАВКИ ВАШЕГО АВТО
      title: "СРОКИ ПОСТАВКИ ВАШЕГО АВТО",
      description: "С момента покупки авто из стран Азии до 30 дней с учетом таможенного сопровождения авто.",
    },
    {
      icon: <Banknote className="w-8 h-8" />, // ФИКСИРОВАННЫЙ ВЗНОС
      title: "ФИКСИРОВАННЫЙ ВЗНОС",
      description: "В зависимости от стоимости авто, предоплата варьируется от 50 000 до 100 000 рублей.",
    },
    {
      icon: <Headphones className="w-8 h-8" />, // РАБОТАЕМ 24/7
      title: "РАБОТАЕМ 24/7",
      description: "Постоянная связь с менеджером вне зависимости от часового пояса.",
    },
    {
      icon: <Users className="w-8 h-8" />, // Опытный штат сотрудников
      title: "ОПЫТНЫЙ ШТАТ СОТРУДНИКОВ",
       description: "У нас работают профессионалы с многолетним опытом работы на рынке автомобилей из Азии.",
    },
    {
      icon: <ShieldCheck className="w-8 h-8" />, // Страхование авто
      title: "СТРАХОВАНИЕ АВТО",
      description: "Страхование автомобиля на каждом этапе доставки и оформления.",
    },
    {
      icon: <ParkingCircle className="w-8 h-8" />, // Охраняемая стоянка
      title: "ОХРАНЯЕМАЯ СТОЯНКА ДЛЯ ВАШЕГО АВТО",
      description: "Безопасное хранение вашего автомобиля на охраняемой стоянке до передачи клиенту.",
    },
    {
      icon: <FileCheck className="w-8 h-8" />, // Прозрачность сделки
      title: "ПРОЗРАЧНОСТЬ СДЕЛКИ",
      description: "Полная отчетность и прозрачность на каждом этапе: от подбора до передачи авто клиенту.",
    },
  ];
  const ADV_VISIBLE = 4;
  const ADV_CARD_WIDTH = 270;
  const ADV_GAP = 24;
  const [activeAdvSlide, setActiveAdvSlide] = useState(0);
  const [advWithTransition, setAdvWithTransition] = useState(true);
  const ADV_SLIDE_ANIMATION = 500;
  const advLength = advantages.length;
  const extendedAdvantages = [
    ...advantages.slice(-ADV_VISIBLE),
    ...advantages,
    ...advantages.slice(0, ADV_VISIBLE),
  ];
  const advVisualIndex = activeAdvSlide + ADV_VISIBLE;
  const advMaxIndex = advLength - 1;
  // Сброс transition и индекса после анимации (вперёд/назад)
  useEffect(() => {
    if (!advWithTransition) return;
    if (activeAdvSlide === advLength) {
      const timeout = setTimeout(() => {
        setAdvWithTransition(false);
        setActiveAdvSlide(0);
      }, ADV_SLIDE_ANIMATION);
      return () => clearTimeout(timeout);
    } else if (activeAdvSlide < 0) {
      const timeout = setTimeout(() => {
        setAdvWithTransition(false);
        setActiveAdvSlide(advLength - 1);
      }, ADV_SLIDE_ANIMATION);
      return () => clearTimeout(timeout);
    }
  }, [activeAdvSlide, advWithTransition, advLength]);
  useEffect(() => {
    if (!advWithTransition) {
      const timeout = setTimeout(() => setAdvWithTransition(true), 20);
      return () => clearTimeout(timeout);
    }
  }, [advWithTransition]);
  const goToAdvSlide = (target: number, animated = true) => {
    if (!advWithTransition) return;
    setAdvWithTransition(!!animated);
    setActiveAdvSlide(target);
  };

  // --- СТЕЙТЫ ДЛЯ ФОРМЫ WhatsApp ---
  const [formData, setFormData] = useState({ name: "", phone: "", message: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    try {
      await fetch("/api/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setIsSubmitted(true);
      setFormData({ name: "", phone: "", message: "" });
      setTimeout(() => setIsSubmitted(false), 3000);
    } catch (error) {
      alert("Ошибка отправки. Попробуйте позже.");
    } finally {
      setIsSending(false);
    }
  };

  // --- Независимая карусель преимуществ для блока 'О нас' ---
  const [activeAdvCarouselSlide, setActiveAdvCarouselSlide] = useState(0);
  const goToAdvCarouselSlide = (idx: number) => setActiveAdvCarouselSlide(idx);

  // === ДОБАВИТЬ ПЕРЕД Team Section ===
  // --- Для анимации мобильной карусели ---
  const [mobileAnim, setMobileAnim] = useState({ direction: 0, isAnimating: false });
  const animTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleMobileSlide = (dir: 1 | -1) => {
    if (mobileAnim.isAnimating) return;
    setMobileAnim({ direction: dir, isAnimating: true });
    if (animTimeout.current) clearTimeout(animTimeout.current);
    animTimeout.current = setTimeout(() => {
      goToTeamSlide((activeTeamSlide + dir + teamLength) % teamLength, false);
      setMobileAnim({ direction: 0, isAnimating: false });
    }, 400); // длительность анимации
  };

  useEffect(() => {
    return () => { if (animTimeout.current) clearTimeout(animTimeout.current); };
  }, []);

  return (
    <div className="ideal2 flex flex-col min-h-screen bg-gradient-to-b from-[#0a0f1a] via-[#0e1720] to-[#1a2332] overflow-x-clip w-full">
      {/* Modern Header — уменьшенный лого, меню сдвинуто правее (ml-auto),
          вместо CSS-иконок соцсетей — MAX/WhatsApp/Telegram в бренд-цветах (msg_1) */}
      <header className="bg-[#0a0f1a]/90 backdrop-blur-md sticky top-0 z-50 border-b border-[#c9a86e]/20 w-full overflow-hidden">
        <div className="container mx-auto px-4 max-w-full">
          <div className="flex items-center gap-6 py-3 md:px-6">
            <Link href="/" className="flex items-center group z-20 flex-shrink-0">
              <div className="relative">
                <Image
                  src="/logo-new.png"
                  alt="Orient Auto"
                  width={140}
                  height={46}
                  className="h-9 md:h-10 w-auto transition-transform group-hover:scale-105"
                />
              </div>
            </Link>

            {/* Desktop Navigation — сдвинута к правому блоку через ml-auto */}
            <nav className="hidden lg:flex items-center gap-8 ml-auto">
              {[
                { name: "Главная", href: "#hero", isAnchor: true },
                { name: "Каталог", href: "#catalog", isAnchor: false },
                { name: "Отзывы", href: "#reviews", isAnchor: true },
                { name: "Контакты", href: "#contacts", isAnchor: true }
              ].map((item) => (
                item.isAnchor ? (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={e => {
                      if (window.location.pathname === "/" && item.name === "Главная") {
                        e.preventDefault();
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }
                    }}
                    className="text-white/90 hover:text-[#c9a86e] transition-all duration-300 font-medium tracking-wide relative group py-6"
                  >
                    {item.name}
                    <span className="absolute bottom-4 left-0 w-0 h-0.5 bg-gradient-to-r from-[#c9a86e] to-[#d4b876] group-hover:w-full transition-all duration-300"></span>
                  </a>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-white/90 hover:text-[#c9a86e] transition-all duration-300 font-medium tracking-wide relative group py-6"
                  >
                    {item.name}
                    <span className="absolute bottom-4 left-0 w-0 h-0.5 bg-gradient-to-r from-[#c9a86e] to-[#d4b876] group-hover:w-full transition-all duration-300"></span>
                  </Link>
                )
              ))}
            </nav>

            {/* Contact Info: Позвонить нам + Написать нам (MAX/WA/TG в бренд-цветах) */}
            <div className="hidden lg:flex items-center gap-6">
              {/* Позвонить нам */}
              <a
                href="tel:+79958689768"
                className="text-[#c9a86e] font-semibold hover:text-[#d4b876] transition-colors flex items-center gap-2"
              >
                <div className="w-9 h-9 rounded-full bg-[#1a2332] flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-[#c9a86e]" />
                </div>
                <div className="leading-tight">
                  <span className="block text-[11px] text-white/70">Позвонить нам</span>
                  <span className="text-base">+7 (995) 868−97−68</span>
                </div>
              </a>
              {/* Написать нам: MAX → WhatsApp → Telegram (msg_1) */}
              <div className="flex flex-col items-start">
                <span className="text-[11px] text-white/70 mb-1">Написать нам</span>
                <div className="flex items-center gap-3">
                  <SocialLinkButton network="max" href={ORIENT_SOCIALS.max.href} variant="bare" size={26} />
                  <SocialLinkButton network="whatsapp" href={ORIENT_SOCIALS.whatsapp.href} variant="bare" size={24} />
                  <SocialLinkButton network="telegram" href={ORIENT_SOCIALS.telegram.href} variant="bare" size={24} />
                </div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <Sheet>
              <SheetTrigger asChild>
                <button
                  className="lg:hidden z-20 text-white hover:text-[#c9a86e] transition-colors"
                >
                  <Menu size={24} />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="p-0 bg-[#0a0f1a] w-[300px] sm:w-[400px] h-full max-h-[100vh] overflow-y-auto">
                <div className="container mx-auto px-4 py-20 pb-8">
                  <nav className="flex flex-col space-y-6">
                    {[
                      { name: "Главная", href: "#hero" },
                      { name: "Каталог", href: "#catalog" },
                      { name: "Отзывы", href: "#reviews" },
                      { name: "Контакты", href: "#contacts" }
                    ].map((item) => (
                      item.name === "Главная" ? (
                        <a
                          key={item.name}
                          href="#hero"
                          onClick={e => {
                            if (window.location.pathname === "/") {
                              e.preventDefault();
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }
                          }}
                          className="text-white/90 hover:text-[#c9a86e] transition-all duration-300 font-medium tracking-wide text-2xl"
                        >
                          {item.name}
                        </a>
                      ) : (
                        <a
                          key={item.name}
                          href={item.href}
                          className="text-white/90 hover:text-[#c9a86e] transition-all duration-300 font-medium tracking-wide text-2xl"
                        >
                          {item.name}
                        </a>
                      )
                    ))}
                  </nav>
                  <div className="mt-12 space-y-6">
                    <a
                      href="tel:+79958689768"
                      className="text-[#c9a86e] font-semibold hover:text-[#d4b876] transition-colors flex items-center gap-3"
                    >
                      <Phone className="w-6 h-6" />
                      <span>
                        <span className="block text-sm font-normal text-white/70">Позвонить нам</span>
                        <span className="text-xl">+7 (995) 868-97-68</span>
                      </span>
                    </a>
                    <a
                      href="mailto:orient.cars@mail.ru"
                      className="text-white/80 text-lg hover:text-white transition-colors flex items-center gap-3"
                    >
                      <Mail className="w-6 h-6" />
                      orient.cars@mail.ru
                    </a>
                    <div className="pt-4">
                      <div className="text-white/70 text-sm mb-2">Написать нам</div>
                      <div className="flex items-center gap-4">
                        <SocialLinkButton network="max" href={ORIENT_SOCIALS.max.href} variant="bare" size={30} />
                        <SocialLinkButton network="whatsapp" href={ORIENT_SOCIALS.whatsapp.href} variant="bare" size={28} />
                        <SocialLinkButton network="telegram" href={ORIENT_SOCIALS.telegram.href} variant="bare" size={28} />
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* 
        === СТАРЫЕ ВАРИАНТЫ HERO (закомментированы для быстрого отката) ===
        Здесь были предыдущие реализации HERO 1 и HERO 2.
        Если клиент скажет "верни как было" — раскомментируй этот блок и закомментируй новые варианты ниже.
      */}

      {/*
      <section id="hero-old1"> ... старый код HERO1 ... </section>
      <section id="hero-old2"> ... старый код HERO2 ... </section>
      */}

      {/* ВАРИАНТ 1 — БАЗОВЫЙ (закомментирован, только V2 активен) */}

      {/* ======================================================
          ВАРИАНТ 2 — С КОМПАКТНЫМ ЗАГОЛОВКОМ
          + "с гарантией качества" в одну строчку (понравилось)
          + остальные требования соблюдены
          ====================================================== */}
      <section id="hero-v2" className="relative pt-16 pb-20 md:pt-16 md:pb-32 lg:pt-10 lg:pb-8 overflow-hidden min-h-[90vh] flex items-center scroll-mt-24">
        <div className="absolute inset-0 z-0" id="hero2">
          <div className="w-full h-full bg-gradient-to-br from-[#0a0f1a] via-[#0e1720] to-[#1a2332]">
            <div className="absolute inset-0 overflow-hidden">
              <video src="/back2.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover opacity-40" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(201,168,110,0.15)_0%,_transparent_70%)]"></div>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a] via-transparent to-[#0a0f1a]/80"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
              <div className="text-center lg:text-left">
                <div className="mb-5 flex justify-center lg:justify-start">
                  <span className="kicker">Подбор · Доставка · Сопровождение</span>
                </div>

                <motion.h1
                  initial={{ x: 60, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="text-4xl md:text-6xl lg:text-7xl font-light mb-6 text-white leading-[1.05]"
                >
                  Автомобили из<br />
                  <span className="text-[#c9a86e] font-extrabold">Азии</span><br />
                  <span className="text-white/90 text-[clamp(1.5rem,6.5vw,1.875rem)] md:text-5xl lg:text-6xl">
                    с&nbsp;гарантией качества
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.35, ease: "easeOut" }}
                  className="text-white/70 text-base md:text-lg mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed"
                >
                  Мы специализируемся на подборе и доставке автомобилей из Японии, Кореи и Китая{" "}
                  <span className="text-white/95">с полным сопровождением сделки</span>.
                </motion.p>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.7 }} className="flex items-center justify-center mb-8">
                  <button onClick={() => consultation.open("hero")} className="btn-sweep focus-lux text-[#0e1720] font-semibold px-8 py-4 md:px-10 md:py-4 rounded-xl min-h-[54px] flex items-center gap-3 uppercase tracking-[0.15em] text-sm md:text-base shadow-[0_0_40px_-8px_rgba(201,168,110,0.55)]">
                    Оставить заявку <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>

                <div className="max-w-xl mx-auto lg:mx-0">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-8 h-px bg-[#c9a86e]" />
                    <span className="font-mono-num text-[10px] uppercase text-[#c9a86e]">Для вопросов</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <a href={ORIENT_SOCIALS.max.href} target="_blank" rel="noopener noreferrer" className="group w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 rounded-2xl border border-[#7357ff]/35 bg-[#7357ff]/10 px-4 text-sm font-medium text-white/90 hover:bg-[#7357ff]/20 hover:border-[#8d77ff]/60 hover:text-white transition-all focus-lux">
                      <SocialIcon network="max" size={22} /> <span>MAX</span> <span className="text-white/45">·</span> <span className="font-mono-num">+7 (995) 868-97-68</span>
                    </a>
                    <a href={ORIENT_SOCIALS.whatsapp.href} target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-none min-h-[48px] inline-flex items-center justify-center gap-2 rounded-2xl border border-[#25D366]/30 bg-[#25D366]/[0.07] px-4 text-sm font-medium text-white/85 hover:bg-[#25D366]/15 hover:border-[#25D366]/50 hover:text-white transition-all focus-lux">
                      <SocialIcon network="whatsapp" size={21} /> WhatsApp
                    </a>
                    <a href={ORIENT_SOCIALS.telegram.href} target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-none min-h-[48px] inline-flex items-center justify-center gap-2 rounded-2xl border border-[#26A5E4]/30 bg-[#26A5E4]/[0.07] px-4 text-sm font-medium text-white/85 hover:bg-[#26A5E4]/15 hover:border-[#26A5E4]/50 hover:text-white transition-all focus-lux">
                      <SocialIcon network="telegram" size={21} /> Telegram
                    </a>
                  </div>
                </div>
              </div>

              <div className="hidden lg:block">
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-[#c9a86e]/20 to-[#d4b876]/20 rounded-full blur-3xl opacity-30"></div>
                  <motion.div initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15, delayChildren: 0.5 } } }} className="grid grid-cols-2 gap-4 relative">
                    <div className="space-y-4">
                      {[{ Icon: Shield, title: "Полное сопровождение", text: "От выбора до получения ключей" }, { Icon: Award, title: "Независимая оценка", text: "Экспертиза каждого автомобиля" }].map(({ Icon, title, text }) => (
                        <motion.div key={title} variants={{ hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0 } }} transition={{ duration: 0.5, ease: "easeOut" }} className="bg-[#1a2332]/25 backdrop-blur-sm border border-[#c9a86e]/5 p-6 rounded-2xl transform hover:scale-105 hover:border-[#c9a86e]/20 transition-all duration-300">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#c9a86e] to-[#d4b876] flex items-center justify-center text-[#0e1720] mb-4"><Icon className="w-6 h-6" /></div>
                          <h3 className="text-white font-semibold mb-2">{title}</h3><p className="text-white/70 text-sm">{text}</p>
                        </motion.div>
                      ))}
                    </div>
                    <div className="space-y-4 mt-8">
                      {[{ Icon: FileCheck, title: "Юридическая чистота", text: "Гарантия легальности сделки" }, { Icon: Clock, title: "Короткие сроки", text: "Быстрая доставка в любой регион" }].map(({ Icon, title, text }) => (
                        <motion.div key={title} variants={{ hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0 } }} transition={{ duration: 0.5, ease: "easeOut" }} className="bg-[#1a2332]/25 backdrop-blur-sm border border-[#c9a86e]/5 p-6 rounded-2xl transform hover:scale-105 hover:border-[#c9a86e]/20 transition-all duration-300">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#c9a86e] to-[#d4b876] flex items-center justify-center text-[#0e1720] mb-4"><Icon className="w-6 h-6" /></div>
                          <h3 className="text-white font-semibold mb-2">{title}</h3><p className="text-white/70 text-sm">{text}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-5 border-t border-[#c9a86e]/20">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-20px" }} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } } }} className="flex flex-wrap justify-center items-center gap-3 sm:gap-6 md:gap-20">
                <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}>
                  <Link href="/catalog/japan" className="flex flex-col items-center group cursor-pointer md:flex-row md:gap-4" aria-label="Каталог авто из Японии">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-white to-gray-100 flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-110"><div className="w-4 h-4 sm:w-6 sm:h-6 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-red-500 to-red-600 shadow-inner"></div></div>
                    <span className="text-white text-sm sm:text-base md:text-4xl font-bold tracking-wider bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mt-2 md:mt-0 group-hover:from-[#c9a86e] group-hover:to-[#d4b876] transition-all">ЯПОНИИ</span>
                  </Link>
                </motion.div>
                <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}>
                  <Link href="/catalog/china" className="flex flex-col items-center group cursor-pointer md:flex-row md:gap-4" aria-label="Каталог авто из Китая">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-16 md:h-16 rounded-full overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-110 ring-2 ring-white/60 relative" style={{backgroundColor: '#EE1C25'}}>
                      {/* Большая звезда по центру */}
                      <div className="absolute text-[#FFDE00]" style={{fontSize: '1.8em', top: '32%', left: '32%'}}>★</div>
                      {/* Маленькие звёзды внутри кружка */}
                      <div className="absolute text-[#FFDE00]" style={{fontSize: '0.45em', top: '18%', left: '58%'}}>★</div>
                      <div className="absolute text-[#FFDE00]" style={{fontSize: '0.45em', top: '28%', left: '65%'}}>★</div>
                      <div className="absolute text-[#FFDE00]" style={{fontSize: '0.45em', top: '38%', left: '60%'}}>★</div>
                      <div className="absolute text-[#FFDE00]" style={{fontSize: '0.45em', top: '48%', left: '65%'}}>★</div>
                    </div>
                    <span className="text-white text-sm sm:text-base md:text-4xl font-bold tracking-wider bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mt-2 md:mt-0 group-hover:from-[#c9a86e] group-hover:to-[#d4b876] transition-all">КИТАЯ</span>
                  </Link>
                </motion.div>
                <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}>
                  <Link href="/catalog/korea" className="flex flex-col items-center group cursor-pointer md:flex-row md:gap-4" aria-label="Каталог авто из Кореи">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-16 md:h-16 rounded-full overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-110 ring-2 ring-white/60 relative">
                      {/* Настоящий флаг Кореи (Taegeukgi) */}
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        <circle cx="50" cy="50" r="48" fill="#ffffff"/>
                        {/* Taegeuk */}
                        <path d="M50 5 A45 45 0 0 1 50 95 A22.5 22.5 0 0 1 50 50 A22.5 22.5 0 0 0 50 5" fill="#CD2E3A"/>
                        <path d="M50 5 A45 45 0 0 0 50 95 A22.5 22.5 0 0 0 50 50 A22.5 22.5 0 0 1 50 5" fill="#0047A0"/>
                        <circle cx="50" cy="50" r="8" fill="#ffffff"/>
                        {/* Trigrams (simplified) */}
                        <g stroke="#000000" strokeWidth="3" strokeLinecap="round">
                          {/* Top left */}
                          <line x1="15" y1="15" x2="32" y2="15"/>
                          <line x1="15" y1="20" x2="32" y2="20"/>
                          <line x1="15" y1="25" x2="32" y2="25"/>
                          {/* Top right */}
                          <line x1="68" y1="15" x2="85" y2="15"/>
                          <line x1="68" y1="20" x2="78" y2="20"/>
                          <line x1="75" y1="25" x2="85" y2="25"/>
                          {/* Bottom left */}
                          <line x1="15" y1="75" x2="32" y2="75"/>
                          <line x1="15" y1="80" x2="25" y2="80"/>
                          <line x1="15" y1="85" x2="32" y2="85"/>
                          {/* Bottom right */}
                          <line x1="68" y1="75" x2="85" y2="75"/>
                          <line x1="68" y1="80" x2="85" y2="80"/>
                          <line x1="68" y1="85" x2="85" y2="85"/>
                        </g>
                      </svg>
                    </div>
                    <span className="text-white text-sm sm:text-base md:text-4xl font-bold tracking-wider bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mt-2 md:mt-0 group-hover:from-[#c9a86e] group-hover:to-[#d4b876] transition-all">КОРЕИ</span>
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee галерея выданных авто клиентам — msg_5 */}
      <section className="py-8 md:py-12 w-full bg-[#0a0f1a] relative overflow-hidden section-soft-top">
        <div className="container mx-auto px-4 flex justify-between items-center text-white/40 mb-6">
          <span className="section-index">02 / КЛИЕНТЫ</span>
          <span className="section-index hidden md:inline font-mono-num">500+ VYDANO</span>
        </div>
        <div className="relative w-full overflow-hidden shadow-lux border-y border-[#c9a86e]/15 bg-[#0a0f1a]">
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-[#0a0f1a] to-transparent"></div>
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-[#0a0f1a] to-transparent"></div>
          <div className="marquee-track flex gap-4 md:gap-8 py-8">
            {[...aboutPhotos, ...aboutPhotos].map((photo, idx) => (
              <div key={idx} className="flex-none w-[160px] h-[200px] md:w-[280px] md:h-[340px] group relative overflow-hidden rounded-xl shadow-lg border border-[#c9a86e]/10 bg-[#181f2a] transition-transform duration-500 hover:scale-105">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={280}
                  height={340}
                  className="w-full h-full object-cover object-center select-none"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e1720]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Блок 'О нас' — msg_6: sereif акцент, редакционная типографика */}
      <section className="py-16 md:py-24 bg-[#0a0f1a] w-full overflow-hidden orient-glow section-soft-top">
        <div className="container mx-auto px-4 flex justify-between items-center text-white/40 mb-6">
          <span className="section-index">03 / О НАС</span>
          <span className="section-index hidden md:inline font-mono-num">EST. 2019</span>
        </div>
        {/* Контейнер с текстом и цифрами */}
        <div className="mx-auto px-4 max-w-7xl relative">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7 }}
              className="space-y-8 w-full"
            >
              <div className="mb-2">
                <span className="kicker">Философия компании</span>
              </div>
              <div className="space-y-6 leading-relaxed">
                <p className="text-2xl md:text-3xl font-light text-white leading-snug">
                  Профессиональный подбор и доставка автомобилей из{" "}
                  <span className="text-[#c9a86e] font-semibold">Японии</span>,{" "}
                  <span className="text-[#c9a86e] font-semibold">Китая</span> и{" "}
                  <span className="text-[#c9a86e] font-semibold">Кореи</span>.
                </p>
                <p className="text-lg md:text-xl text-white/70 leading-relaxed">
                  Работаем{" "}
                  <span className="text-[#c9a86e] font-medium">напрямую</span> с аукционами и дилерами,
                  сопровождая клиента на всех этапах —{" "}
                  <span className="text-white/95">от подбора автомобиля до передачи ключей</span>.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  {["Просто", "Надёжно", "Прозрачно"].map((tag, i) => (
                    <motion.span
                      key={tag}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                      className="inline-flex items-center px-4 py-2 rounded-full bg-[#1a2332]/60 border border-[#c9a86e]/25 text-[#c9a86e] font-medium tracking-[0.15em] text-sm uppercase shadow-lux"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
              </div>
              {/* Статистика — mono цифры, редакционный стиль */}
              <div className="grid grid-cols-3 gap-0 pt-6 divide-x divide-white/[0.06]">
                {[
                  { value: "500+", label: "Довольных клиентов" },
                  { value: "5+", label: "Лет опыта" },
                  { value: "100%", label: "Гарантия качества" },
                ].map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                    className={"text-center px-3 py-2 " + (i === 0 ? "pl-0" : "")}
                  >
                    <div className="font-mono-num text-3xl md:text-4xl font-light text-[#c9a86e]">
                      {s.value}
                    </div>
                    <div className="text-white/50 text-[10px] md:text-xs mt-2 leading-tight uppercase tracking-[0.2em] font-mono-num">
                      {s.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            {/* Правая колонка: карусель преимуществ с анимацией как у 'Этапы работы' */}
            {/* Десктопная версия */}
            <div className="w-full flex flex-col items-center hidden md:flex">
              <div className="relative w-full max-w-md min-h-[340px] mx-auto">
                {advantages.map((item, idx) => {
                  const isActive = idx === activeAdvCarouselSlide;
                  const isNext = idx === (activeAdvCarouselSlide + 1) % advantages.length;
                  let style: React.CSSProperties = {};
                  if (isActive) {
                    style = {
                      transform: "translateX(-50%) scale(1)",
                      zIndex: 40,
                      opacity: 1,
                      filter: "none"
                    };
                  } else if (isNext) {
                    style = {
                      transform: "translateX(20%) scale(0.9)",
                      zIndex: 20,
                      opacity: 0.6,
                      filter: "blur(4px)"
                    };
                  } else {
                    style = {
                      transform: "translateX(-50%) scale(0.7)",
                      zIndex: 10,
                      opacity: 0,
                      pointerEvents: "none"
                    };
                  }
                  return (
                    <div
                      key={idx}
                      className={
                        "absolute left-1/2 top-0 w-full max-w-md transition-all duration-500 ease-in-out group bg-gradient-to-br from-[#1a2332] to-[#0e1720] border border-[#c9a86e]/20 p-8 rounded-xl shadow-xl"
                        + (isActive ? " border-[#c9a86e]/40 shadow-2xl" : " pointer-events-none")
                      }
                      style={style}
                    >
                      <div className="flex flex-col items-center justify-center h-full w-full">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#c9a86e] to-[#d4b876] flex items-center justify-center text-[#0e1720] mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg relative z-10">
                          {item.icon}
                        </div>
                        <h3 className="text-white text-lg font-semibold mb-4 tracking-wide group-hover:text-[#c9a86e] transition-colors text-center">
                          {item.title}
                        </h3>
                        <p className="text-white/70 leading-relaxed group-hover:text-white/90 transition-colors text-center">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-center mt-4 gap-3 w-full">
                <button
                  onClick={() => goToAdvCarouselSlide((activeAdvCarouselSlide - 1 + advantages.length) % advantages.length)}
                  className="w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center border border-[#c9a86e]/20 hover:border-[#c9a86e]/40 transition-all duration-300"
                  aria-label="Предыдущее преимущество"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex gap-2">
                  {advantages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => goToAdvCarouselSlide(idx)}
                      className={`carousel-dot w-3 h-3 rounded-full transition-all duration-300 ${idx === activeAdvCarouselSlide ? 'bg-[#c9a86e]' : 'bg-white/30 hover:bg-white/50'}`}
                      aria-label={`Перейти к преимуществу ${idx + 1}`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => goToAdvCarouselSlide((activeAdvCarouselSlide + 1) % advantages.length)}
                  className="w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center border border-[#c9a86e]/20 hover:border-[#c9a86e]/40 transition-all duration-300"
                  aria-label="Следующее преимущество"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
            {/* Мобильная версия */}
            <div className="w-full flex flex-col items-center md:hidden max-w-full">
              <div className="relative w-full min-h-[340px] mx-auto overflow-hidden max-w-full">
                <div 
                  className="relative w-full max-w-[320px] h-[340px] mx-auto overflow-hidden"
                  onTouchStart={onTouchStart}
                  onTouchMove={onTouchMove}
                  onTouchEnd={() => onTouchEnd(activeAdvCarouselSlide, advantages.length - 1, goToAdvCarouselSlide)}
                >
                  {advantages.map((item, idx) => {
                    // Используем ту же логику, что у работающей карусели команды
                    let offset = idx - activeAdvCarouselSlide;
                    // Для бесшовности
                    if (offset < -Math.floor(advantages.length / 2)) offset += advantages.length;
                    if (offset > Math.floor(advantages.length / 2)) offset -= advantages.length;
                    
                    let style: React.CSSProperties = {
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      width: '100%',
                      height: '100%',
                      transition: 'all 0.5s cubic-bezier(0.4,0,0.2,1)',
                      zIndex: 10 - Math.abs(offset),
                      pointerEvents: offset === 0 ? 'auto' : 'none',
                      opacity: offset === 0 ? 1 : offset === 1 ? 0.3 : 0,
                    };
                    
                    // Трансформация: активная — по центру, следующая — чуть позади справа
                    if (offset === 0) {
                      style.transform = 'translateX(0%) scale(1)';
                    } else if (offset === 1) {
                      style.transform = 'translateX(35%) scale(0.8)';
                    } else if (offset === -1) {
                      style.transform = 'translateX(-35%) scale(0.8)';
                    } else {
                      style.transform = `translateX(${offset * 60}%) scale(0.7)`;
                    }
                    
                    return (
                      <div key={idx} className="px-4" style={style}>
                        <div className="group bg-gradient-to-br from-[#1a2332] to-[#0e1720] border border-[#c9a86e]/20 p-6 rounded-xl shadow-xl flex flex-col items-center justify-center min-h-[320px] max-w-xs mx-auto w-full">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#c9a86e] to-[#d4b876] flex items-center justify-center text-[#0e1720] mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg relative z-10">
                            {item.icon}
                          </div>
                          <h3 className="text-white text-lg font-semibold mb-4 tracking-wide group-hover:text-[#c9a86e] transition-colors text-center">
                            {item.title}
                          </h3>
                          <p className="text-white/70 leading-relaxed group-hover:text-white/90 transition-colors text-center">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {/* Стрелки внутри области */}
                <button
                  onClick={() => goToAdvCarouselSlide((activeAdvCarouselSlide - 1 + advantages.length) % advantages.length)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/70 hover:bg-black/90 text-white rounded-full flex items-center justify-center border border-[#c9a86e]/20 hover:border-[#c9a86e]/40 transition-all duration-300 z-10"
                  aria-label="Предыдущее преимущество"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => goToAdvCarouselSlide((activeAdvCarouselSlide + 1) % advantages.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/70 hover:bg-black/90 text-white rounded-full flex items-center justify-center border border-[#c9a86e]/20 hover:border-[#c9a86e]/40 transition-all duration-300 z-10"
                  aria-label="Следующее преимущество"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              {/* Индикаторы */}
              <div className="flex justify-center mt-4 gap-2">
                {advantages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => goToAdvCarouselSlide(idx)}
                    className={`carousel-dot w-3 h-3 rounded-full transition-all duration-300 ${idx === activeAdvCarouselSlide ? 'bg-[#c9a86e]' : 'bg-white/30 hover:bg-white/50'}`}
                    aria-label={`Перейти к преимуществу ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

     

      {/* Catalog Section */}
      <div id="catalog" className="relative top-8 h-0 pointer-events-none"></div>
      <section className="scroll-mt-0 bg-gradient-to-b from-[#0e1720] to-[#0e1720] relative overflow-hidden section-soft-top">
        {/* Section index в верхнем углу */}
        <div className="container mx-auto px-4 pt-8 flex justify-between items-center text-white/40">
          <span className="section-index">01 / КАТАЛОГ</span>
          <span className="section-index hidden md:inline">JAPAN · CHINA · KOREA</span>
        </div>
        <div className="container mx-auto px-4 relative z-10 pt-8 md:pt-14">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex justify-center mb-5">
              <span className="kicker kicker--center">Три рынка · Один подбор</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight">
              Каталог{" "}
              <span className="text-[#c9a86e] font-extrabold">
                автомобилей
              </span>
            </h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto mt-5 leading-relaxed">
              Выберите страну происхождения и найдите идеальный автомобиль для себя
            </p>
          </motion.div>

          {/* Countries Grid — msg_7: порядок Япония → Китай → Корея,
              шапки цвета флагов (белый / красный / синий) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[
              {
                id: 'japan',
                name: 'Япония',
                nameLat: 'JAPAN',
                description: 'Надёжные автомобили из Японии',
                accent: '#eef1f5', // белый — по указанию клиента (msg_7: Япония/белый)
                pattern: 'sakura',
                stats: { cars: '3000+', brands: '12', avgPrice: '3.2M ₽' },
                features: [
                  'Toyota, Honda, Nissan',
                  'Высокая надёжность',
                  'Отличная репутация',
                  'Долговечность'
                ]
              },
              {
                id: 'china',
                name: 'Китай',
                nameLat: 'CHINA',
                description: 'Доступные автомобили из Китая',
                accent: '#e63946', // красный флага
                pattern: 'lanterns',
                stats: { cars: '2000+', brands: '8', avgPrice: '1.8M ₽' },
                features: [
                  'BYD, Chery, Geely',
                  'Современный дизайн',
                  'Богатая комплектация',
                  'Доступные цены'
                ]
              },
              {
                id: 'korea',
                name: 'Корея',
                nameLat: 'KOREA',
                description: 'Качественные автомобили из Южной Кореи',
                accent: '#0047a0', // синий флага
                pattern: 'meander',
                stats: { cars: '1500+', brands: '5', avgPrice: '2.5M ₽' },
                features: [
                  'Kia, Hyundai, Genesis',
                  'Современные технологии',
                  'Высокое качество сборки',
                  'Экономичный расход'
                ]
              }
            ].map((country, cIdx) => (
              <motion.div
                key={country.id}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: cIdx * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="relative bg-[#1a2332]/80 backdrop-blur-sm border border-[#c9a86e]/15 hover:border-[#c9a86e]/45 transition-all duration-500 group shadow-lux shadow-lux-hover rounded-2xl overflow-hidden"
              >
                {/* Цветная тонкая полоса сверху карточки — маркер страны */}
                <div className="absolute top-0 left-0 right-0 h-1 z-20" style={{ background: country.accent }} />

                {/* Шапка с национальным паттерном + читаемый текст */}
                <div
                  className="relative overflow-hidden rounded-t-2xl p-6 pb-8 min-h-[180px]"
                  style={{
                    background: `linear-gradient(135deg, ${country.accent}40 0%, ${country.accent}15 40%, #0e1720 100%)`,
                  }}
                >
                  <CountryPattern kind={country.pattern as any} color={country.accent} />
                  {/* Мягкая тень слева-снизу, чтобы текст всегда читался поверх паттерна */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#0e1720]/70 via-[#0e1720]/20 to-transparent pointer-events-none" />
                  <div className="relative z-10">
                    <div
                      className="text-[11px] uppercase tracking-[0.4em] font-mono-num mb-2 font-medium"
                      style={{ color: country.accent }}
                    >
                      {country.nameLat}
                    </div>
                    <h3 className="text-white text-3xl font-medium leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                      {country.name}
                    </h3>
                    <p className="text-white/80 text-sm mt-2 max-w-[78%] drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
                      {country.description}
                    </p>
                  </div>
                </div>
                <div className="p-6">
                  {/* Stats — редакционный ряд с разделителями, mono, без жирного золота */}
                  <div className="grid grid-cols-3 gap-0 divide-x divide-white/[0.06] mb-5">
                    <div className="text-center px-2">
                      <div className="font-mono-num text-xl font-light text-white/90">{country.stats.cars}</div>
                      <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 mt-1 font-mono-num">Авто</div>
                    </div>
                    <div className="text-center px-2">
                      <div className="font-mono-num text-xl font-light text-white/90">{country.stats.brands}</div>
                      <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 mt-1 font-mono-num">Брендов</div>
                    </div>
                    <div className="text-center px-2">
                      <div className="font-mono-num text-xl font-light text-white/90">{country.stats.avgPrice}</div>
                      <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 mt-1 font-mono-num">Ср. цена</div>
                    </div>
                  </div>

                  {/* Features — тихая заливка, без ярких звёздочек */}
                  <ul className="space-y-1.5 mb-6 text-sm">
                    {country.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-white/60">
                        <span className="w-1 h-1 rounded-full bg-[#c9a86e]/50 mr-3 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA — тонкий outline вместо яркой sweep-плашки, чтобы не конкурировать с шапкой */}
                  <Link href={`/catalog/${country.id}`}>
                    <button className="group/btn w-full text-white/90 font-medium rounded-lg py-3 px-4 flex items-center justify-center gap-2 uppercase tracking-[0.2em] text-xs border border-[#c9a86e]/30 hover:border-[#c9a86e] hover:bg-[#c9a86e]/5 transition-all focus-lux">
                      Перейти в каталог
                      <ChevronRight className="w-3.5 h-3.5 text-[#c9a86e] group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Additional Info — заголовок "Почему выбирают Orient Auto?" убран (msg_7) */}
          <div className="bg-[#1a2332]/80 backdrop-blur-sm border border-[#c9a86e]/20 rounded-xl p-8 text-center">
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
      </section>

      {/* Chat Section — msg_9: "Чат менеджеров" (не только Telegram),
          единый шрифт, две кнопки MAX + TG в бренд-цветах, порядок MAX -> TG */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-[#0e1720] to-[#1a2332] relative overflow-hidden section-soft-top">
        <div className="container mx-auto px-4 pb-4 flex justify-between items-center text-white/40 mb-6">
          <span className="section-index">04 / СВЯЗЬ</span>
          <span className="section-index hidden md:inline">MAX · TELEGRAM</span>
        </div>
        <div className="absolute top-24 left-1/2 md:left-6 -translate-x-1/2 md:translate-x-0 w-96 h-96 bg-gradient-to-br from-[#c9a86e]/20 to-[#d4b876]/10 rounded-full blur-3xl opacity-40 z-0 pointer-events-none"></div>
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-center relative z-10 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7 }}
            className="flex-1 flex flex-col items-center md:items-start overflow-visible"
          >
            <div className="mb-4">
              <span className="kicker">Живая связь</span>
            </div>
            <h2 className="text-white text-4xl md:text-5xl lg:text-6xl mb-8 text-center md:text-left font-light leading-[1.05]">
              Чат{" "}
              <span className="text-[#c9a86e] font-extrabold">
                менеджеров
              </span>
            </h2>
            {/* Единый шрифт (font-light для всех абзацев), цвет для смысловых акцентов */}
            <div className="max-w-2xl text-center md:text-left mb-12 space-y-4">
              <p className="text-white/90 text-xl md:text-2xl font-light">
                Общайтесь в реальном времени с опытными специалистами Orient Auto!
              </p>
              <p className="text-lg md:text-xl font-light text-white/80">
                <span className="text-[#c9a86e]">Мгновенные ответы</span> на любые вопросы,{" "}
                <span className="text-[#c9a86e]">честные консультации</span> и поддержка без ожидания.
              </p>
              <p className="text-base md:text-lg font-light text-white/70">
                В наших чатах — <span className="text-[#c9a86e]">MAX</span> и{" "}
                <span className="text-[#c9a86e]">Telegram</span> — вы получите профессиональную помощь
                напрямую от менеджеров компании.
              </p>
            </div>
            {/* Две кнопки — стеклянные, с брендовой левой полосой; MAX первая */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <a
                href="https://max.ru/join/KGMDARU6jZYZPJfs54YSA7tfnt3W8xzc0shptRANxVc"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden inline-flex items-center gap-4 pl-4 pr-6 py-4 rounded-xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm hover:bg-white/[0.06] hover:border-[#5E3FE3]/40 transition-all duration-300 shadow-lux shadow-lux-hover focus-lux"
              >
                {/* Левая брендовая полоса */}
                <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#4CC1FF] via-[#5E3FE3] to-[#9333EA]" />
                <span className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#4CC1FF]/15 to-[#9333EA]/15 flex items-center justify-center flex-shrink-0">
                  <SocialIcon network="max" size={22} />
                </span>
                <span className="flex flex-col text-left">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-mono-num">Написать в</span>
                  <span className="text-white text-base font-medium">MAX-чат</span>
                </span>
                <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white/80 group-hover:translate-x-1 transition-all ml-2" />
              </a>
              <a
                href="https://t.me/orientauto_chat"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden inline-flex items-center gap-4 pl-4 pr-6 py-4 rounded-xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm hover:bg-white/[0.06] hover:border-[#26A5E4]/40 transition-all duration-300 shadow-lux shadow-lux-hover focus-lux"
              >
                <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#26A5E4]" />
                <span className="w-10 h-10 rounded-lg bg-[#26A5E4]/15 flex items-center justify-center flex-shrink-0">
                  <SocialIcon network="telegram" size={22} />
                </span>
                <span className="flex flex-col text-left">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-mono-num">Написать в</span>
                  <span className="text-white text-base font-medium">Telegram-чат</span>
                </span>
                <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white/80 group-hover:translate-x-1 transition-all ml-2" />
              </a>
            </div>
          </motion.div>
          {/* SVG-иллюстрация чата — обновлена в компоненте ChatIllustration (msg_9) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="hidden md:block flex-1"
          >
            <ChatIllustrationIdeal />
          </motion.div>
        </div>
      </section>

      




      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={closeImageModal}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh] p-4">
            <button
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              onClick={closeImageModal}
            >
              <XIcon className="w-6 h-6" />
            </button>
            <div className="relative w-full h-full">
              <Image
                src={selectedImage || "/placeholder.svg"}
                alt="Enlarged view"
                width={1200}
                height={800}
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        </div>
      )}

      {/* Video Section — msg_12+13: 3D-карусель слева + виджет соцсетей справа,
          убраны иконки соцсетей из правого верхнего угла, убраны описания под видео,
          новый заголовок в акцентном стиле */}
      <section id="videos" className="py-16 md:py-24 bg-gradient-to-b from-[#1a2332] to-[#0e1720] w-full overflow-hidden orient-glow scroll-mt-20">
        <div className="container mx-auto px-4 max-w-7xl relative">
          {/* Заголовок — сериф на акцентной части */}
          <div className="text-center mb-14">
            <div className="flex justify-between items-center text-white/40 mb-8">
              <span className="section-index">05 / КОНТЕНТ</span>
              <span className="section-index hidden md:inline">YOUTUBE · TELEGRAM · MAX</span>
            </div>
            <div className="flex justify-center mb-5">
              <span className="kicker kicker--center">Наш YouTube и Telegram</span>
            </div>
            <h2 className="text-white text-4xl md:text-5xl lg:text-6xl font-light leading-[1.05]">
              Полезные видео{" "}
              <span className="text-[#c9a86e] font-extrabold">
                о нас и импорте
              </span>
            </h2>
          </div>

          {/* Grid: слева 3D-карусель, справа виджет соцсетей */}
          <div className="grid lg:grid-cols-[1.55fr_1fr] gap-10 lg:gap-12 items-start">
            {/* 3D-карусель видео (desktop + mobile) */}
            <div
              className="relative flex flex-col justify-center min-w-0 touch-pan-y"
              onTouchStart={(event) => {
                videoTouchStartX.current = event.touches[0].clientX
              }}
              onTouchEnd={handleVideoTouchEnd}
            >
              {/* Градиенты по краям — обрезка боковых видео */}
              <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 md:w-24 z-20 bg-gradient-to-r from-[#0e1720] to-transparent" />
              <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 md:w-24 z-20 bg-gradient-to-l from-[#0e1720] to-transparent" />

              {/* Центральная область: 3 карточки (боковые уменьшены), можно перелистывать */}
              <div className="relative h-[390px] sm:h-[440px] md:h-[520px] flex items-center justify-center overflow-hidden">
                {videoSlides.map((slide, idx) => {
                  const total = videoSlides.length
                  let offset = idx - activeVideoSlide
                  // wrap
                  if (offset > total / 2) offset -= total
                  if (offset < -total / 2) offset += total
                  const abs = Math.abs(offset)
                  const isCenter = offset === 0
                  const visible = abs <= 1
                  const scale = isCenter ? 1 : 0.78
                  const translateX = offset * 72
                  const opacity = visible ? (isCenter ? 1 : 0.5) : 0
                  const blur = isCenter ? 0 : 1.5
                  const z = 30 - abs * 5
                  if (!visible) return null

                  return (
                    <div
                      key={slide.video}
                      className="absolute top-1/2 left-1/2 transition-all duration-500 ease-out cursor-pointer"
                      style={{
                        transform: `translate(-50%, -50%) translateX(${translateX}%) scale(${scale})`,
                        opacity,
                        zIndex: z,
                        filter: `blur(${blur}px)`,
                        pointerEvents: "auto",
                      }}
                      onClick={() => {
                        if (!isCenter) {
                          setActiveVideoSlide((idx + total) % total)
                          return
                        }
                        setSelectedVideo({ src: slide.video, title: slide.title, car: "" })
                      }}
                    >
                      <div className="relative w-[210px] sm:w-[240px] md:w-[280px] aspect-[9/16] rounded-lg overflow-hidden bg-gradient-to-br from-[#1a2332] to-[#0e1720] border border-[#c9a86e]/25 shadow-2xl">
                        <Image
                          src={slide.preview || "/placeholder.svg?height=430&width=240"}
                          alt={slide.title}
                          width={360}
                          height={640}
                          className="w-full h-full object-cover"
                          loading="eager"
                        />
                        {/* Play в центре только на активном */}
                        {isCenter && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-xl transition-transform hover:scale-110">
                              <Play className="w-7 h-7 text-white ml-1" />
                            </div>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0e1720]/70 to-transparent" />
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Кнопки навигации */}
              <div className="flex justify-center items-center gap-4 mt-3 md:mt-4">
                <button
                  type="button"
                  onClick={() => changeActiveVideo(-1)}
                  className="w-11 h-11 rounded-full bg-[#1a2332] hover:bg-[#0e1720] border border-[#c9a86e]/30 hover:border-[#c9a86e]/60 flex items-center justify-center transition-colors z-30"
                  aria-label="Предыдущее видео"
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>
                <div className="w-16 text-center font-mono-num text-xs text-white/50 tabular-nums" aria-live="polite">
                  <span className="text-white">{String(activeVideoSlide + 1).padStart(2, "0")}</span>
                  <span className="mx-1 text-white/25">/</span>
                  {String(videoSlides.length).padStart(2, "0")}
                </div>
                <button
                  type="button"
                  onClick={() => changeActiveVideo(1)}
                  className="w-11 h-11 rounded-full bg-[#1a2332] hover:bg-[#0e1720] border border-[#c9a86e]/30 hover:border-[#c9a86e]/60 flex items-center justify-center transition-colors z-30"
                  aria-label="Следующее видео"
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Временная витрина вариантов правого виджета для выбора дизайна. */}
            <div className="w-full lg:pt-[11px]">
              {/* Вариант 1: без внешней карточки, продолжает геометрию секции. */}
              <div className="hidden">
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-mono-num text-[10px] text-[#c9a86e]">ВАРИАНТ 01</span>
                  <span className="h-px flex-1 bg-[#c9a86e]/25" />
                  <span className="text-[10px] uppercase text-white/30">Линии</span>
                </div>
                <div className="relative border-y border-white/15 py-8 sm:py-10">
                  <div className="absolute left-0 top-10 bottom-10 w-px bg-[#c9a86e]" />
                  <div className="pl-6 sm:pl-8 mb-8">
                    <span className="font-mono-num text-[10px] uppercase text-white/35">Orient Auto Media</span>
                    <h3 className="mt-3 text-4xl md:text-5xl font-light leading-[0.98] text-white">
                      Следим за<br /><span className="font-extrabold text-[#c9a86e]">контентом</span>
                    </h3>
                    <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/50">
                      Новости автоимпорта, обзоры и живые видео с аукционов.
                    </p>
                  </div>
                  <nav className="border-t border-white/10" aria-label="Социальные сети Orient Auto, вариант 1">
                    {mediaSocials.map((social, index) => (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group grid grid-cols-[34px_1fr_auto] items-center gap-3 min-h-[62px] border-b border-white/10 px-2 hover:px-4 hover:bg-white/[0.04] transition-all focus-lux"
                      >
                        <span className="flex justify-center" aria-hidden="true">{renderMediaIcon(social.net, 22)}</span>
                        <span className="text-sm font-medium text-white">{social.label}</span>
                        <span className="flex items-center gap-3 font-mono-num text-[10px] text-white/30">
                          0{index + 1}<ArrowRight className="w-4 h-4 group-hover:translate-x-1 group-hover:text-[#c9a86e] transition-all" />
                        </span>
                      </a>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Вариант 2: заметный постер с контрастными кнопками. */}
              <div className="hidden">
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-mono-num text-[10px] text-[#c9a86e]">ВАРИАНТ 02</span>
                  <span className="h-px flex-1 bg-[#c9a86e]/25" />
                  <span className="text-[10px] uppercase text-white/30">Акцент</span>
                </div>
                <div className="relative overflow-hidden rounded-lg bg-[#c9a86e] p-6 sm:p-8 text-[#0a0f1a] shadow-lux">
                  <div className="absolute right-3 top-0 font-mono-num text-[150px] leading-none text-[#0a0f1a]/[0.06] select-none">04</div>
                  <div className="relative flex items-center justify-between gap-4 border-b border-[#0a0f1a]/20 pb-4">
                    <span className="font-mono-num text-[10px] uppercase">Orient Auto / Media</span>
                    <span className="w-2 h-2 rounded-full bg-[#0a0f1a]" />
                  </div>
                  <div className="relative py-9">
                    <h3 className="max-w-sm text-4xl md:text-5xl font-extrabold leading-[0.94] uppercase">
                      Следим за контентом
                    </h3>
                    <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#0a0f1a]/65">
                      Все о покупке и доставке автомобилей из Азии в наших каналах.
                    </p>
                  </div>
                  <nav className="relative grid grid-cols-2 gap-px overflow-hidden rounded-md bg-[#c9a86e]/50 border border-[#0a0f1a]/20" aria-label="Социальные сети Orient Auto, вариант 2">
                    {mediaSocials.map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex min-w-0 items-center gap-3 bg-[#0d131c] px-4 py-4 text-white hover:bg-[#182230] transition-colors focus-lux"
                      >
                        <span className="shrink-0" aria-hidden="true">{renderMediaIcon(social.net, 23)}</span>
                        <span className="min-w-0 truncate text-xs sm:text-sm font-semibold">{social.label}</span>
                      </a>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Вариант 3: светлая журнальная карточка. */}
              <div className="hidden">
                <div className="hidden">
                  <span className="font-mono-num text-[10px] text-[#c9a86e]">ВАРИАНТ 03</span>
                  <span className="h-px flex-1 bg-[#c9a86e]/25" />
                  <span className="text-[10px] uppercase text-white/30">Редакция</span>
                </div>
                <div className="overflow-hidden rounded-lg bg-[#f1f2f3] text-[#10151c] shadow-lux">
                  <div className="grid grid-cols-[1fr_auto] gap-6 p-6 sm:p-8 border-b border-black/15">
                    <div>
                      <span className="font-mono-num text-[10px] uppercase text-black/45">Новости / обзоры / импорт</span>
                      <h3 className="mt-4 text-4xl font-bold leading-[0.98]">Следим за<br />контентом</h3>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <span className="font-mono-num text-4xl font-light text-[#a98244]">04</span>
                      <span className="text-[9px] uppercase text-black/40">канала</span>
                    </div>
                  </div>
                  <p className="px-6 sm:px-8 py-5 text-sm leading-relaxed text-black/55 border-b border-black/15">
                    Актуальные автомобили, разборы рынка и жизнь компании без лишнего шума.
                  </p>
                  <nav className="divide-y divide-black/10" aria-label="Социальные сети Orient Auto, вариант 3">
                    {mediaSocials.map((social, index) => (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group grid grid-cols-[28px_1fr_auto] items-center gap-3 px-6 sm:px-8 min-h-[61px] hover:bg-black/[0.05] transition-colors focus-lux"
                      >
                        <span aria-hidden="true">{renderMediaIcon(social.net, 22)}</span>
                        <span>
                          <span className="block text-sm font-semibold">{social.label}</span>
                          <span className="block text-[11px] text-black/40">{social.detail}</span>
                        </span>
                        <span className="font-mono-num text-[10px] text-black/30 group-hover:text-black">0{index + 1} ↗</span>
                      </a>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Вариант 4: компактная темная панель с крупным брендингом. */}
              <div>
                <div className="hidden">
                  <span className="font-mono-num text-[10px] text-[#c9a86e]">ВАРИАНТ 04</span>
                  <span className="h-px flex-1 bg-[#c9a86e]/25" />
                  <span className="text-[10px] uppercase text-white/30">Пульт</span>
                </div>
                <div className="relative min-h-[440px] lg:min-h-0 lg:h-[498px] overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-[#1a2636] via-[#151f2c] to-[#101923] p-6 sm:p-8 shadow-lux flex flex-col">
                  <div className="absolute inset-x-0 top-0 h-px bg-[#c9a86e]/75" />
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <span className="font-mono-num text-[10px] uppercase text-[#c9a86e]">OA / MEDIA</span>
                      <h3 className="mt-3 text-3xl sm:text-4xl font-light leading-none text-white">
                        Следим за<br /><span className="font-extrabold">контентом</span>
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="w-2 h-2 rounded-full bg-[#c9a86e]" />
                      <span className="font-mono-num text-[9px] text-white/35">ONLINE</span>
                    </div>
                  </div>
                  <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/55">
                    Выберите площадку и оставайтесь в курсе новостей автоимпорта.
                  </p>
                  <div className="mt-7 grid grid-cols-3 border-y border-white/[0.08]">
                    {["Аукционы", "Обзоры", "Импорт"].map((topic, index) => (
                      <div
                        key={topic}
                        className={`py-3.5 text-center ${index > 0 ? "border-l border-white/[0.08]" : ""}`}
                      >
                        <span className="block font-mono-num text-[8px] text-[#c9a86e]/65">0{index + 1}</span>
                        <span className="mt-1 block text-[9px] uppercase text-white/45">{topic}</span>
                      </div>
                    ))}
                  </div>
                  <nav className="mt-7 grid grid-cols-2 gap-2" aria-label="Социальные сети Orient Auto">
                    {mediaSocials.map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex min-w-0 items-center gap-3 rounded-md border border-white/10 bg-[#0e1720]/55 px-3 py-3.5 hover:border-[#c9a86e]/50 hover:bg-[#1a2332] transition-all focus-lux"
                      >
                        <span className="shrink-0" aria-hidden="true">{renderMediaIcon(social.net, 22)}</span>
                        <span className="min-w-0 truncate text-xs sm:text-sm font-medium text-white/80 group-hover:text-white">{social.label}</span>
                      </a>
                    ))}
                  </nav>
                  <div className="mt-auto pt-5 flex items-center gap-3">
                    <span className="h-px flex-1 bg-white/10" />
                    <span className="font-mono-num text-[9px] text-white/25">VLADIVOSTOK / ASIA / AUTO</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Скрытая старая версия — сохранена в hidden для возможного отката */}
          {false && (
          <>
          <div className="hidden">
            <div className="reviews-container overflow-hidden md:w-[70%] md:mx-auto">
              <div
                className={`reviews-track flex ${videoWithTransition ? 'transition-transform duration-500 ease-in-out' : ''}`}
                style={{ transform: `translateX(-${activeVideoSlide * 100}%)` }}
              >
                {extendedVideoSlides.map((page, pageIdx) => (
                  <div key={pageIdx} className="reviews-page w-full flex-none flex">
                    {page.map((slide, i) => (
                      <div
                        key={i}
                        className="flex flex-col group cursor-pointer basis-1/4 flex-none px-4 relative"
                        onClick={() => {
                          previewVideoRefs.current.forEach(v => v && v.pause());
                          setSelectedVideo({ src: slide.video, title: slide.title, car: '' });
                        }}
                      >
                        <div className="relative overflow-hidden rounded-xl mb-4 aspect-[9/16] bg-gradient-to-br from-[#1a2332] to-[#0e1720] border border-[#c9a86e]/20">
                          {selectedVideo ? (
                            <Image
                              src={slide.preview || "/placeholder.svg?height=430&width=240"}
                              alt={slide.title}
                              width={360}
                              height={640}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <video
                              ref={el => {
                                previewVideoRefs.current[pageIdx * VIDEOS_PER_SLIDE + i] = el;
                              }}
                              src={slide.video}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              preload="none"
                              muted
                              playsInline
                              poster={slide.preview || "/placeholder.svg?height=430&width=240"}
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0e1720]/60 to-transparent"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-[#c9a86e]/80 transition-all duration-300">
                              <Play className="w-8 h-8 text-white ml-1" />
                            </div>
                          </div>
                          {slide.original && (
                            <div className="absolute top-3 right-3">
                              <a
                                href={slide.original.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center bg-black/70 backdrop-blur-sm text-white hover:text-[#c9a86e] transition-colors text-xs font-medium px-2 py-1 rounded-md border border-white/20 hover:border-[#c9a86e]/40"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {slide.original.type === 'youtube' ? (
                                  <>
                                    <Youtube className="w-3 h-3 mr-1" />
                                    YouTube
                                  </>
                                ) : slide.original.type === 'telegram' ? (
                                  <>
                                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.25l-2.173 10.244c-.168.78-.621.936-1.26.578l-3.478-2.568-1.68 1.614c-.189.182-.345.336-.708.336l.257-3.596 6.531-5.903c.285-.248-.062-.384-.441-.136L7.926 13.8l-3.475-1.086c-.755-.236-.77-.755.157-1.118l13.563-5.229c.631-.231 1.178.349.891 1.883z" />
                                    </svg>
                                    TG
                                  </>
                                ) : (
                                  'Источник'
                                )}
                              </a>
                            </div>
                          )}
                        </div>
                        <h3 className="text-white text-lg font-semibold mb-2 group-hover:text-[#c9a86e] transition-colors">
                          {slide.title}
                        </h3>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            {/* Стрелки по бокам для десктопа */}
            <button
              onClick={() => videoWithTransition && goToVideoSlide(activeVideoSlide - 1, true)}
              className="absolute left-[10%] top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 z-10 border border-[#c9a86e]/20 hover:border-[#c9a86e]/40"
              aria-label="Предыдущая страница видео"
              disabled={!videoWithTransition}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => videoWithTransition && goToVideoSlide(activeVideoSlide + 1, true)}
              className="absolute right-[10%] top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 z-10 border border-[#c9a86e]/20 hover:border-[#c9a86e]/40"
              aria-label="Следующая страница видео"
              disabled={!videoWithTransition}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            {/* Индикаторы для десктопа */}
            <div className="flex justify-center mt-8 gap-2">
              {videoSlidesChunks.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => videoWithTransition && goToVideoSlide(idx, true)}
                  className={`carousel-dot w-3 h-3 rounded-full transition-all duration-300 ${idx === (activeVideoSlide === videoSlidesChunks.length ? 0 : activeVideoSlide) ? "bg-[#c9a86e]" : "bg-white/30 hover:bg-white/50"}`}
                  aria-label={`Перейти к странице видео ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Mobile Version - скрыта на десктопе */}
          <div className="hidden">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${activeVideoSlideMobile * 100}%)` }}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={() => onTouchEnd(activeVideoSlideMobile, videoSlides.length - 1, setActiveVideoSlideMobile)}
              >
                {videoSlides.map((slide, i) => (
                  <div
                    key={i}
                    className="w-full flex-none px-4"
                  >
                    <div
                      className="flex flex-col group cursor-pointer relative overflow-hidden"
                      onClick={() => {
                        previewVideoRefs.current.forEach(v => v && v.pause());
                        setSelectedVideo({ src: slide.video, title: slide.title, car: '' });
                      }}
                    >
                      <div className="relative overflow-hidden rounded-xl mb-4 aspect-[9/16] max-w-[220px] mx-auto bg-gradient-to-br from-[#1a2332] to-[#0e1720] border border-[#c9a86e]/20">
                        {selectedVideo ? (
                          <Image
                            src={slide.preview || "/placeholder.svg?height=430&width=240"}
                            alt={slide.title}
                            width={360}
                            height={640}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <video
                            ref={el => {
                              previewVideoRefs.current[i] = el;
                            }}
                            src={slide.video}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            preload="none"
                            muted
                            playsInline
                            poster={slide.preview || "/placeholder.svg?height=430&width=240"}
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0e1720]/80 to-transparent"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-[#c9a86e]/80 transition-all duration-300 group-hover:scale-110">
                            <Play className="w-8 h-8 text-white ml-1" />
                          </div>
                        </div>
                        {slide.original && (
                          <div className="absolute top-2 right-2">
                            <a
                              href={slide.original.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center bg-black/70 backdrop-blur-sm text-white hover:text-[#c9a86e] transition-colors text-xs font-medium px-2 py-1 rounded-md border border-white/20 hover:border-[#c9a86e]/40"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {slide.original.type === 'youtube' ? (
                                <>
                                  <Youtube className="w-3 h-3 mr-1" />
                                  YouTube
                                </>
                              ) : slide.original.type === 'telegram' ? (
                                <>
                                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.25l-2.173 10.244c-.168.78-.621.936-1.26.578l-3.478-2.568-1.68 1.614c-.189.182-.345.336-.708.336l.257-3.596 6.531-5.903c.285-.248-.062-.384-.441-.136L7.926 13.8l-3.475-1.086c-.755-.236-.77-.755.157-1.118l13.563-5.229c.631-.231 1.178.349.891 1.883z" />
                                  </svg>
                                  TG
                                </>
                              ) : (
                                'Источник'
                              )}
                            </a>
                          </div>
                        )}
                      </div>
                      <h3 className="text-white text-lg font-semibold mb-2 group-hover:text-[#c9a86e] transition-colors text-center max-w-[220px] mx-auto leading-tight">
                        {slide.title}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Стрелки внутри экрана для мобильных */}
            <button
              onClick={() => setActiveVideoSlideMobile((activeVideoSlideMobile - 1 + videoSlides.length) % videoSlides.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/70 hover:bg-black/90 text-white p-2 rounded-full transition-all duration-300 hover:scale-110 z-10 border border-[#c9a86e]/20 hover:border-[#c9a86e]/40"
              aria-label="Предыдущее видео"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => setActiveVideoSlideMobile((activeVideoSlideMobile + 1) % videoSlides.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/70 hover:bg-black/90 text-white p-2 rounded-full transition-all duration-300 hover:scale-110 z-10 border border-[#c9a86e]/20 hover:border-[#c9a86e]/40"
              aria-label="Следующее видео"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            {/* Индикаторы для мобильных */}
            <div className="flex justify-center mt-8 gap-2">
              {videoSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveVideoSlideMobile(idx)}
                  className={`carousel-dot w-3 h-3 rounded-full transition-all duration-300 ${idx === activeVideoSlideMobile ? "bg-[#c9a86e]" : "bg-white/30 hover:bg-white/50"}`}
                  aria-label={`Перейти к видео ${idx + 1}`}
                />
              ))}
            </div>
          </div>
          </>
          )}
        </div>
      </section>

      {/* Модальное окно с видео */}
      {/*
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm" onClick={() => setSelectedVideo(null)}>
          <div className="relative max-w-2xl w-full max-h-[90vh] p-4" onClick={e => e.stopPropagation()}>
            <button
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              onClick={() => setSelectedVideo(null)}
            >
              <XIcon className="w-6 h-6" />
            </button>
            <div className="relative w-full h-full flex flex-col items-center">
              <video src={selectedVideo.src} controls autoPlay className="w-full max-h-[70vh] rounded-lg bg-black" />
              <div className="text-white mt-4 text-lg font-semibold text-center">{selectedVideo.title}</div>
              <div className="text-[#c9a86e] text-center">{selectedVideo.car}</div>
            </div>
          </div>
        </div>
      )}
      */}

      {/* How to Order — msg_14+15. Scroll-pin вариант: секция «прилипает»
          на десктопе, шаги сменяются по прокрутке, активная карточка
          чередуется лево/право (зигзаг). Реализовано в отдельном компоненте
          HowWeWorkScroll — прежний статичный список сохранён в git для отката. */}
      <HowWeWorkScroll steps={orderSteps} />

      {/* ===== ВРЕМЕННО: две версии блока «Как мы работаем» для сравнения.
           Ниже — версия 2 (зигзаг-таймлайн без фиксации). После выбора
           лучшей — удалить проигравшую и этот разделитель. ===== */}
      <div className="w-full bg-[#0e1720] py-6 text-center">
        <span className="section-index">↓ ВАРИАНТ 2 (зигзаг, без фиксации) ↓</span>
      </div>
      <HowWeWorkScrollV2 steps={orderSteps} />

      {/* Reviews Section - Grid with Animation */}
      <section id="reviews" className="py-16 md:py-24 bg-gradient-to-b from-[#1a2332] to-[#1a2332] scroll-mt-24 section-soft-top">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex justify-between items-center text-white/40 mb-8">
            <span className="section-index">08 / ДОКАЗАТЕЛЬСТВА</span>
            <span className="section-index hidden md:inline">2GIS · YANDEX</span>
          </div>
          {/* ===== ВАРИАНТЫ БЛОКА «ОТЗЫВЫ НАШИХ КЛИЕНТОВ» =====
               Как и с блоком «Как мы работаем» выше (HowWeWorkScroll +
               HowWeWorkScrollV2) — сделано несколько вариантов друг под
               другом, чтобы клиент выбрал лучший. После выбора удалить
               проигравшие из /ideal-two и reviews-variants.tsx.
               Реализовано в components/reviews-variants.tsx:
                  ВАРИАНТ 1 — Editorial Grid   (референс msg_25)
                 ВАРИАНТ 2 — Mosaic Video      (референс msg_17) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <div className="flex justify-center mb-5">
              <span className="kicker kicker--center">Реальные оценки · 2ГИС · Яндекс · YouTube</span>
            </div>
            <h2 className="text-white text-4xl md:text-5xl lg:text-6xl font-light leading-[1.05]">
              Отзывы{" "}
              <span className="text-[#c9a86e] font-extrabold">
                наших клиентов
              </span>
            </h2>
          </motion.div>

          {/*          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-8 h-8 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="text-white text-xl ml-4 font-medium">4.9 из 5</span>
            </div>
            <h2 className="text-white text-4xl md:text-5xl font-light tracking-wide overflow-hidden">Отзывы наших клиентов</h2>
          </div>

          <div className="relative">
            <div className="reviews-container overflow-hidden">
              <div
                className="reviews-track flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${activeReviewIndex * 100}%)` }}
              >
                {[0, 1].map((page) => (
                  <div key={page} className="reviews-page w-full flex-none grid md:grid-cols-3 gap-6">
                    {reviews.slice(page * 3, page * 3 + 3).map((review, index) => (
                      <div
                        key={index}
                        className={`bg-gradient-to-br from-[#1a2332] to-[#0e1720] border border-[#c9a86e]/20 p-6 rounded-xl shadow-lg hover:shadow-2xl hover:border-[#c9a86e]/40 transition-all duration-300 ${
                          activeReviewIndex === page ? "animate-fade-in" : ""
                        }`}
                      >
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#c9a86e] to-[#d4b876] flex items-center justify-center text-[#0e1720] font-bold text-xl mr-4 shadow-lg">
                            {review.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="text-white font-semibold">{review.name}</h4>
                            <p className="text-[#c9a86e] text-sm">{review.car}</p>
                            <div className="flex mt-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-3 h-3 ${
                                    star <= review.rating ? "text-yellow-400 fill-current" : "text-gray-600"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-white/80 leading-relaxed text-sm">"{review.text}"</p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center mt-8 gap-4">
              <button
                onClick={prevReview}
                className="bg-[#1a2332] hover:bg-[#0e1720] text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 border border-[#c9a86e]/20 hover:border-[#c9a86e]/40"
                aria-label="Previous reviews"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <div className="flex items-center gap-2">
                {[0, 1].map((index) => (
                  <button
                    key={index}
                    onClick={() => setActiveReviewIndex(index)}
                    className={`carousel-dot w-3 h-3 rounded-full transition-all duration-300 ${
                      index === activeReviewIndex ? "bg-[#c9a86e]" : "bg-white/30 hover:bg-white/50"
                    }`}
                    aria-label={`Go to review page ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={nextReview}
                className="bg-[#1a2332] hover:bg-[#0e1720] text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 border border-[#c9a86e]/20 hover:border-[#c9a86e]/40"
                aria-label="Next reviews"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="mt-12 text-center">
            <a
              href="/reviews"
              className="inline-flex items-center text-[#c9a86e] hover:text-[#d4b876] transition-colors text-lg font-medium group"
            >
              Смотреть все отзывы
              <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
          */}
          
          {/* ===== ВАРИАНТ 1 — Editorial Grid (референс msg_25) ===== */}
          <VariantDivider title="↑ ВАРИАНТ 1 (editorial-сетка, референс msg_25) ↑" />
          <ReviewsVariantGrid />

          <VariantDivider title="↓ ВАРИАНТ 2 (mosaic-video, референс msg_17) ↓" />

          {/* ===== ВАРИАНТ 2 — Mosaic Video (референс msg_17) ===== */}
          <ReviewsVariantHero />

          <div className="mt-12 text-center">
            <a
              href="/reviews"
              className="inline-flex items-center gap-2 text-[#c9a86e] hover:text-[#d4b876] transition-colors text-base font-medium group"
            >
              Смотреть все отзывы
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

        </div>
      </section>

      {/* Video Reviews Section — msg_18: убрана карусель, вместо неё грид-плитка
          с эффектным заголовком, рамкой и паттерном лого в фоне */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-[#1a2332] to-[#0e1720] w-full overflow-hidden orient-glow">
        <div className="container mx-auto px-4 max-w-7xl relative">
          {/* Заголовок — сериф и kicker */}
          <div className="text-center mb-16">
            <div className="flex justify-between items-center text-white/40 mb-8">
              <span className="section-index">07 / КЛИЕНТЫ</span>
              <span className="section-index hidden md:inline">VIDEO · REAL PEOPLE</span>
            </div>
            <div className="flex justify-center mb-5">
              <span className="kicker kicker--center">Видео-отзывы</span>
            </div>
            <h2 className="text-white text-4xl md:text-5xl lg:text-6xl font-light leading-[1.05]">
              <span className="text-[#c9a86e] font-extrabold">
                Orient Auto
              </span>{" "}
              глазами клиентов
            </h2>
            <p className="text-white/60 text-base md:text-lg max-w-2xl mx-auto mt-6 leading-relaxed">
              Послушайте, что говорят наши клиенты о работе с Orient Auto и качестве приобретённых автомобилей
            </p>
          </div>

          {/* Grid-плитка — msg_18: не карусель */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {videoReviews.slice(0, 8).map((review, i) => (
              <motion.div
                key={review.video}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
                className="group cursor-pointer"
                onClick={() => {
                  reviewPreviewVideoRefs.current.forEach(v => v && v.pause());
                  setSelectedVideo({ src: review.video, title: review.clientName, car: review.carModel });
                }}
              >
                <div className="relative overflow-hidden rounded-2xl aspect-[9/16] bg-gradient-to-br from-[#1a2332] to-[#0e1720] border border-[#c9a86e]/20 group-hover:border-[#c9a86e]/60 group-hover:shadow-2xl group-hover:shadow-[#c9a86e]/20 transition-all duration-300 group-hover:-translate-y-1">
                  <Image
                    src={review.preview || "/placeholder.svg?height=430&width=240"}
                    alt={review.clientName}
                    width={360}
                    height={640}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e1720]/90 via-transparent to-transparent"></div>
                  {/* Play кнопка */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center group-hover:bg-[#c9a86e]/90 transition-all duration-300 group-hover:scale-110 border border-white/30">
                      <Play className="w-6 h-6 md:w-8 md:h-8 text-white ml-1" />
                    </div>
                  </div>
                  {/* Подписи */}
                  <div className="absolute left-0 bottom-0 w-full flex flex-col items-start p-3 md:p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                    <span className="text-white text-xs md:text-sm font-semibold drop-shadow-md line-clamp-1">{review.clientName}</span>
                    <span className="text-[#c9a86e] text-xs md:text-sm drop-shadow-md">{review.carModel}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Скрытый блок легаси-каруселей (не рендерится) — оставлен для быстрого отката, если клиент передумает */}
          <div className="hidden">
            <div className="reviews-container overflow-hidden md:w-[70%] md:mx-auto">
              <div
                className={`reviews-track flex ${reviewWithTransition ? 'transition-transform duration-500 ease-in-out' : ''}`}
                style={{ transform: `translateX(-${activeReviewSlide * 100}%)` }}
              >
                {extendedReviewSlides.map((page, pageIdx) => (
                  <div key={pageIdx} className="reviews-page w-full flex-none flex">
                    {page.map((review, i) => (
                      <div
                        key={review.video}
                        className="flex flex-col group cursor-pointer basis-1/4 flex-none px-4 relative"
                        onClick={() => {
                          reviewPreviewVideoRefs.current.forEach(v => v && v.pause());
                          setSelectedVideo({ src: review.video, title: review.clientName, car: review.carModel });
                        }}
                      >
                        <div className="relative overflow-hidden rounded-xl mb-4 aspect-[9/16] bg-gradient-to-br from-[#1a2332] to-[#0e1720] border border-[#c9a86e]/20">
                          {selectedVideo ? (
                            <Image
                              src={review.preview || "/placeholder.svg?height=430&width=240"}
                              alt={review.clientName}
                              width={360}
                              height={640}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <video
                              ref={el => {
                                reviewPreviewVideoRefs.current[pageIdx * REVIEWS_PER_SLIDE + i] = el;
                              }}
                              src={review.video}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              preload="metadata"
                              muted
                              playsInline
                              poster={review.preview || "/placeholder.svg?height=430&width=240"}
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0e1720]/80 to-transparent"></div>
                          {/* Play Button */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-[#c9a86e]/80 transition-all duration-300 group-hover:scale-110">
                              <Play className="w-8 h-8 text-white ml-1" />
                            </div>
                          </div>
                          {/* Подписи на видео */}
                          <div className="absolute left-0 bottom-0 w-full flex flex-col items-start p-3 bg-gradient-to-t from-black/70 via-black/30 to-transparent rounded-b-xl">
                            <span className="text-white text-base font-semibold drop-shadow-md">{review.clientName}</span>
                            <span className="text-[#c9a86e] text-sm drop-shadow-md">{review.carModel}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            {/* Стрелки по бокам */}
            <button
              onClick={() => reviewWithTransition && goToReviewSlide(activeReviewSlide - 1, true)}
              className="absolute left-[10%] top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 z-10 border border-[#c9a86e]/20 hover:border-[#c9a86e]/40"
              aria-label="Предыдущая страница видео"
              disabled={!reviewWithTransition}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => reviewWithTransition && goToReviewSlide(activeReviewSlide + 1, true)}
              className="absolute right-[10%] top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 z-10 border border-[#c9a86e]/20 hover:border-[#c9a86e]/40"
              aria-label="Следующая страница видео"
              disabled={!reviewWithTransition}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            {/* Индикаторы */}
            <div className="flex justify-center mt-8 gap-2">
              {videoReviewSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => reviewWithTransition && goToReviewSlide(idx, true)}
                  className={`carousel-dot w-3 h-3 rounded-full transition-all duration-300 ${idx === (activeReviewSlide === videoReviewSlides.length ? 0 : activeReviewSlide) ? "bg-[#c9a86e]" : "bg-white/30 hover:bg-white/50"}`}
                  aria-label={`Перейти к странице видео ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Мобильная версия */}
          <div className="md:hidden relative">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${activeReviewSlideMobile * 100}%)` }}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={() => onTouchEnd(activeReviewSlideMobile, videoReviews.length - 1, setActiveReviewSlideMobile)}
              >
                {videoReviews.map((review, i) => (
                  <div
                    key={review.video}
                    className="w-full flex-none px-4"
                  >
                    <div
                      className="flex flex-col group cursor-pointer relative overflow-hidden"
                      onClick={() => {
                        reviewPreviewVideoRefs.current.forEach(v => v && v.pause());
                        setSelectedVideo({ src: review.video, title: review.clientName, car: review.carModel });
                      }}
                    >
                      <div className="relative overflow-hidden rounded-xl mb-4 aspect-[9/16] max-w-[220px] mx-auto bg-gradient-to-br from-[#1a2332] to-[#0e1720] border border-[#c9a86e]/20">
                        <video
                          ref={el => {
                            reviewPreviewVideoRefs.current[i] = el;
                          }}
                          src={review.video}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          preload="metadata"
                          muted
                          playsInline
                          poster={review.preview || "/placeholder.svg?height=430&width=240"}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0e1720]/80 to-transparent"></div>
                        {/* Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-[#c9a86e]/80 transition-all duration-300 group-hover:scale-110">
                            <Play className="w-8 h-8 text-white ml-1" />
                          </div>
                        </div>
                        {/* Подписи на видео */}
                        <div className="absolute left-0 bottom-0 w-full flex flex-col items-start p-3 bg-gradient-to-t from-black/70 via-black/30 to-transparent rounded-b-xl">
                          <span className="text-white text-base font-semibold drop-shadow-md">{review.clientName}</span>
                          <span className="text-[#c9a86e] text-sm drop-shadow-md">{review.carModel}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Стрелки внутри экранной области */}
            <button
              onClick={() => setActiveReviewSlideMobile((activeReviewSlideMobile - 1 + videoReviews.length) % videoReviews.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/70 hover:bg-black/90 text-white p-2 rounded-full transition-all duration-300 hover:scale-110 z-10 border border-[#c9a86e]/20 hover:border-[#c9a86e]/40"
              aria-label="Предыдущее видео"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => setActiveReviewSlideMobile((activeReviewSlideMobile + 1) % videoReviews.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/70 hover:bg-black/90 text-white p-2 rounded-full transition-all duration-300 hover:scale-110 z-10 border border-[#c9a86e]/20 hover:border-[#c9a86e]/40"
              aria-label="Следующее видео"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            {/* Индикаторы для мобильных */}
            <div className="flex justify-center mt-8 gap-2">
              {videoReviews.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveReviewSlideMobile(idx)}
                  className={`carousel-dot w-3 h-3 rounded-full transition-all duration-300 ${idx === activeReviewSlideMobile ? "bg-[#c9a86e]" : "bg-white/30 hover:bg-white/50"}`}
                  aria-label={`Перейти к видео ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Модальное окно для видео */}
          {selectedVideo && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm" onClick={() => setSelectedVideo(null)}>
              <div className="relative max-w-xs md:max-w-md w-full max-h-[90vh] p-4" onClick={e => e.stopPropagation()}>
                <button
                  className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                  onClick={() => setSelectedVideo(null)}
                >
                  <XIcon className="w-6 h-6" />
                </button>
                <div className="relative w-full h-full flex flex-col items-center">
                  <video src={selectedVideo.src} controls autoPlay className="w-full max-h-[70vh] rounded-lg bg-black aspect-[9/16]" />
                  <div className="text-white mt-4 text-lg font-semibold text-center">{selectedVideo.title}</div>
                  <div className="text-[#c9a86e] text-center">{selectedVideo.car}</div>
                </div>
              </div>
            </div>
          )}
          <p className="text-xs text-white/50 mt-8 text-center max-w-3xl mx-auto leading-relaxed">
            Все фотографии людей, используемые на данном сайте, размещены с их письменного согласия в соответствии с Федеральным законом от 27.07.2006 г. № 152-ФЗ «О персональных данных».
          </p>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-[#0e1720] to-[#1a2332]">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-white/40 mb-8">
            <span className="section-index">09 / КОМАНДА</span>
            <span className="section-index hidden md:inline font-mono-num">10 SPECIALISTOV</span>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <div className="flex justify-center mb-5">
              <span className="kicker kicker--center">Наши люди</span>
            </div>
            <h2 className="text-white text-4xl md:text-5xl lg:text-6xl font-light leading-[1.05]">
              <span className="text-[#c9a86e] font-extrabold">
                Команда
              </span>{" "}
              Orient Auto
            </h2>
          </motion.div>
          {/* Desktop версия карусели */}
          <div className="hidden md:block">
            <div
              className="mx-auto pt-16 relative max-w-full"
              style={{ width: '100%', maxWidth: (CARD_WIDTH * TEAM_VISIBLE + GAP * (TEAM_VISIBLE - 1)) + 'px' }}
            >
              <div className="relative min-h-[360px] flex justify-center items-center">
                {/* Левая стрелка */}
                <button
                  onClick={() => teamWithTransition && goToTeamSlide(activeTeamSlide - 1, true)}
                  className="absolute -left-14 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-300 hover:scale-110 z-20 border border-[#c9a86e]/20 hover:border-[#c9a86e]/40 flex items-center justify-center"
                  aria-label="Предыдущая страница команды"
                  disabled={!teamWithTransition}
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                {/* Карусель карточек — msg_19: подписи под фото, градиенты по краям */}
                <div className="overflow-hidden max-w-full relative" style={{
                  width: '100%',
                  maxWidth: TEAM_VISIBLE * CARD_WIDTH + (TEAM_VISIBLE - 1) * GAP + 'px',
                }}>
                  {/* Градиенты по краям */}
                  <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-r from-[#0e1720] to-transparent" />
                  <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-l from-[#1a2332] to-transparent" />
                  <div
                    className={`flex gap-6 ${teamWithTransition ? 'transition-transform duration-500 ease-in-out' : ''}`}
                    style={{
                      width: extendedTeam.length * CARD_WIDTH + (extendedTeam.length - 1) * GAP + 'px',
                      transform: `translateX(-${visualIndex * (CARD_WIDTH + GAP)}px)`,
                      minWidth: '100%'
                    }}
                  >
                    {extendedTeam.map((member, idx) => {
                      const isAccent = idx === visualIndex;
                      return (
                        <div
                          key={idx}
                          className={`flex flex-col items-center group relative transition-all duration-500 ${isAccent ? 'scale-103 z-10' : 'scale-90 opacity-60'}`}
                          style={{ width: CARD_WIDTH + 'px' }}
                        >
                          <div className="relative aspect-[8/10] w-full flex items-center justify-center overflow-hidden rounded-xl shadow-lg">
                            <Image
                              src={member.photo}
                              alt={member.name}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 60vw, 20vw"
                            />
                          </div>
                          {/* Подписи ПОД фото (msg_19): должность, имя, телефон */}
                          <div className="w-full text-center mt-4 space-y-1">
                            <div className="text-[#c9a86e]/80 text-xs uppercase tracking-widest">
                              {member.position}
                            </div>
                            <div className="text-white text-lg font-semibold">
                              {member.name}
                            </div>
                            <a
                              href={`tel:${member.phone.replace(/[^\d+]/g, "")}`}
                              className="inline-flex items-center gap-1.5 text-white/70 hover:text-[#c9a86e] transition-colors text-sm"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              {member.phone}
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {/* Правая стрелка */}
                <button
                  onClick={() => teamWithTransition && goToTeamSlide(activeTeamSlide + 1, true)}
                  className="absolute -right-14 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-300 hover:scale-110 z-20 border border-[#c9a86e]/20 hover:border-[#c9a86e]/40 flex items-center justify-center"
                  aria-label="Следующая страница команды"
                  disabled={!teamWithTransition}
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
              {/* Индикаторы */}
              <div className="flex justify-center mt-8 gap-2">
                {teamMembers.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => teamWithTransition && goToTeamSlide(idx, true)}
                    className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${idx === (activeTeamSlide > maxIndex ? 0 : activeTeamSlide) ? "bg-[#c9a86e]" : "bg-white/30 hover:bg-white/50"}`}
                    aria-label={`Перейти к сотруднику ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Новый мобильный блок команды */}
          <div className="md:hidden">
            <div className="relative flex justify-center items-center min-h-[420px] px-2 select-none">
              {/* Левая стрелка */}
              <button
                onClick={() => handleMobileSlide(-1)}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-300 hover:scale-110 z-20 border border-[#c9a86e]/20 hover:border-[#c9a86e]/40 flex items-center justify-center"
                aria-label="Предыдущая страница команды"
                disabled={mobileAnim.isAnimating}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Карусель с плавной анимацией через translateX */}
              <div 
                className="relative w-full max-w-[320px] h-[400px] mx-auto overflow-hidden"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={() => onTouchEnd(activeTeamSlide, teamMembers.length - 1, setActiveTeamSlide)}
              >
                {teamMembers.map((member, idx) => {
                  // Вычисляем смещение относительно активной карточки
                  let offset = idx - activeTeamSlide;
                  // Для бесшовности
                  if (offset < -Math.floor(teamMembers.length / 2)) offset += teamMembers.length;
                  if (offset > Math.floor(teamMembers.length / 2)) offset -= teamMembers.length;
                  // Стили
                  let style: React.CSSProperties = {
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: '100%',
                    height: '100%',
                    transition: 'all 0.5s cubic-bezier(0.4,0,0.2,1)',
                    zIndex: 10 - Math.abs(offset),
                    pointerEvents: offset === 0 || offset === 1 ? 'auto' : 'none',
                    opacity: offset === 0 ? 1 : offset === 1 ? 0.7 : 0,
                    filter: offset === 1 ? 'blur(5px) brightness(0.7)' : 'none',
                  };
                  // Трансформация: активная — по центру, следующая — чуть позади справа, остальные — вне экрана
                  if (offset === 0) {
                    style.transform = 'translateX(0%) scale(1)';
                  } else if (offset === 1) {
                    style.transform = 'translateX(35%) scale(0.8)';
                  } else if (offset === -1) {
                    style.transform = 'translateX(-60%) scale(0.8)';
                  } else {
                    style.transform = `translateX(${offset * 60}%) scale(0.7)`;
                  }
                  return (
                    <div
                      key={idx}
                      className="rounded-xl overflow-hidden bg-[#181e2a] shadow-lg border-2 border-transparent"
                      style={style}
                    >
                      <div className="relative w-full h-full">
                        <Image
                          src={member.photo}
                          alt={member.name}
                          fill
                          className="object-cover rounded-xl"
                          sizes="240px"
                        />
                        {/* Оверлей для затемнения next-карточки */}
                        {offset === 1 && <div className="absolute inset-0 bg-black/40 rounded-xl" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Правая стрелка */}
              <button
                onClick={() => handleMobileSlide(1)}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-300 hover:scale-110 z-20 border border-[#c9a86e]/20 hover:border-[#c9a86e]/40 flex items-center justify-center"
                aria-label="Следующая страница команды"
                disabled={mobileAnim.isAnimating}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            {/* Подпись активного сотрудника ПОД мобильной каруселью (msg_19) */}
            {(() => {
              const active = teamMembers[activeTeamSlide > maxIndex ? 0 : Math.max(0, activeTeamSlide)]
              if (!active) return null
              return (
                <div className="text-center mt-4 space-y-1 min-h-[70px]">
                  <div className="text-[#c9a86e]/80 text-xs uppercase tracking-widest">
                    {active.position}
                  </div>
                  <div className="text-white text-lg font-semibold">
                    {active.name}
                  </div>
                  <a
                    href={`tel:${active.phone.replace(/[^\d+]/g, "")}`}
                    className="inline-flex items-center gap-1.5 text-white/70 hover:text-[#c9a86e] transition-colors text-sm"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    {active.phone}
                  </a>
                </div>
              )
            })()}
            {/* Индикаторы для мобильных */}
            <div className="flex justify-center mt-6 gap-2">
              {teamMembers.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => !mobileAnim.isAnimating && goToTeamSlide(idx, true)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${idx === (activeTeamSlide > maxIndex ? 0 : activeTeamSlide) ? "bg-[#c9a86e]" : "bg-white/30 hover:bg-white/50"}`}
                  aria-label={`Перейти к сотруднику ${idx + 1}`}
                  disabled={mobileAnim.isAnimating}
                />
              ))}
            </div>
          </div>
          <p className="text-xs text-white/50 mt-8 text-center max-w-3xl mx-auto leading-relaxed">
            Все фотографии людей, используемые на данном сайте, размещены с их письменного согласия в соответствии с Федеральным законом от 27.07.2006 г. № 152-ФЗ «О персональных данных».
          </p>
        </div>
      </section>

      {/* Вариант 2: Сетка команды (альтернатива карусели — клиент устал от каруселей) */}
      {/* Текущая карусель выше сохранена полностью. Сетка ниже — по пожеланию. */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-[#0e1720] to-[#1a2332]">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-white/40 mb-8">
            <span className="section-index">09 / КОМАНДА (Сетка)</span>
            <span className="section-index hidden md:inline font-mono-num">10 SPECIALISTOV</span>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <div className="flex justify-center mb-5">
              <span className="kicker kicker--center">Наши люди</span>
            </div>
            <h2 className="text-white text-4xl md:text-5xl lg:text-6xl font-light leading-[1.05]">
              <span className="text-[#c9a86e] font-extrabold">
                Команда
              </span>{" "}
              Orient Auto
            </h2>
            <p className="mt-3 text-white/50 max-w-sm mx-auto">Профессионалы, на которых можно положиться</p>
          </motion.div>

          {/* Сетка — красивая, не пустая, с градиентами и hover */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 md:gap-6">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.3) }}
                className="group bg-[#1a2332] border border-[#c9a86e]/10 rounded-2xl overflow-hidden hover:border-[#c9a86e]/60 hover:shadow-2xl hover:shadow-[#c9a86e]/10 transition-all duration-300 hover:-translate-y-1 flex flex-col"
              >
                <div className="relative">
                  <Image
                    src={member.photo}
                    alt={member.name}
                    width={400}
                    height={400}
                    className="w-full aspect-square object-cover"
                  />
                  {/* Градиент как просил клиент (адаптировано под сетку) */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40" />
                </div>

                {/* Инфо ПОД фото — строго как хотел клиент */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="text-[#c9a86e] text-[10px] uppercase tracking-[2.5px] font-medium mb-1">
                    {member.position}
                  </div>
                  <div className="text-white text-xl font-semibold tracking-[-0.2px] mb-3 leading-tight">
                    {member.name}
                  </div>

                  <div className="mt-auto">
                    <a
                      href={`tel:${member.phone.replace(/[^\d+]/g, "")}`}
                      className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-[#c9a86e] transition-colors group-hover:underline"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      {member.phone}
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <p className="text-xs text-white/50 mt-10 text-center max-w-3xl mx-auto leading-relaxed">
            Все фотографии людей, используемые на данном сайте, размещены с их письменного согласия в соответствии с Федеральным законом от 27.07.2006 г. № 152-ФЗ «О персональных данных».
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacts" className="py-16 md:py-24 bg-gradient-to-b from-[#1a2332] to-[#0e1720] scroll-mt-24">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-white/40 mb-8">
            <span className="section-index">10 / КОНТАКТЫ</span>
            <span className="section-index hidden md:inline">VLADIVOSTOK · RUSSIA</span>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <div className="flex justify-center mb-5">
              <span className="kicker kicker--center">Свяжитесь с нами</span>
            </div>
            <h2 className="text-white text-4xl md:text-5xl lg:text-6xl font-light leading-[1.05]">
              Наши{" "}
              <span className="text-[#c9a86e] font-extrabold">
                контакты
              </span>
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* Телефон */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#c9a86e] to-[#d4b876] flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-[#0e1720]" />
                </div>
                <div>
                  <a href="tel:+79958689768" className="text-white text-xl font-semibold hover:text-[#d4b876] transition-colors block">+7 (995) 868-97-68</a>
                  <span className="text-white/70 text-sm block">Звоните нам ежедневно в любое время</span>
                </div>
              </div>
              {/* Почта */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#c9a86e] to-[#d4b876] flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-[#0e1720]" />
                </div>
                <div>
                  <a href="mailto:orient.cars@mail.ru" className="text-white text-xl font-semibold hover:text-[#d4b876] transition-colors block">orient.cars@mail.ru</a>
                  <span className="text-white/70 text-sm block">Пишите нам на почту</span>
                </div>
              </div>
              {/* Офис */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#c9a86e] to-[#d4b876] flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-[#0e1720]" />
                </div>
                <div>
                  <div className="text-white text-xl font-semibold mb-1">Офис</div>
                  <p className="text-white/80 text-lg">Приморский край, г. Владивосток, ул. Борисенко 35г</p>
                </div>
              </div>
              {/* Время работы — msg_20: 11:00 - 19:00 */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#c9a86e] to-[#d4b876] flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-[#0e1720]" />
                </div>
                <div>
                  <div className="text-white text-xl font-semibold mb-1">Режим работы</div>
                  <div className="space-y-1">
                    <p className="text-white/80">Пн-Пт: 11:00 - 19:00</p>
                    <p className="text-white/80">Сб-Вс: выходной</p>
                  </div>
                </div>
              </div>
              {/* Соцсети — msg_20: бренд-иконки, порядок Инст -> YT -> TG -> MAX */}
              <div>
                <div className="text-white/80 text-lg mb-3">Мы в соцсетях:</div>
                <div className="flex gap-4 mt-2">
                  <SocialLinkButton
                    network="instagram"
                    href="https://www.instagram.com/orientauto.ru"
                    label="Instagram"
                    size={26}
                  />
                  <SocialLinkButton
                    network="youtube"
                    href="https://youtube.com/@orientauto_ru"
                    label="YouTube"
                    size={28}
                  />
                  <SocialLinkButton
                    network="telegram"
                    href="https://t.me/orientauto_ru"
                    label="Telegram-канал"
                    size={26}
                  />
                  <SocialLinkButton
                    network="max"
                    href="https://max.ru/id253401357515_biz"
                    label="MAX-канал"
                    size={30}
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <div className="relative h-96 w-full bg-gradient-to-br from-[#1a2332] to-[#0e1720] rounded-xl border border-[#c9a86e]/20 mb-6 overflow-hidden">
                <div className="absolute inset-0 w-full h-full rounded-xl overflow-hidden z-10">
                  <div className="w-full h-full rounded-xl overflow-hidden">
                    <YandexMap
                      coords={[43.09796815819245, 131.95709114374563]}
                      hint="Офис Orient Auto"
                      balloon="Здесь находится наш офис"
                      className="w-full h-full rounded-xl"
                    />
                  </div>
                </div>
              </div>
              <p className="text-white/70 leading-relaxed">
                Вы можете посетить наш офис в рабочее время или связаться с нами по телефону или электронной почте.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Секция "Оставьте заявку" — msg_21: убрана, заменена на модальное окно.
          Триггеры "Оставить заявку" / "Бесплатная консультация" открывают <ConsultationModal>.
          Легаси-якорь #consultation оставлен как no-op для старых внутренних ссылок. */}
      <div id="consultation" className="h-0 pointer-events-none" aria-hidden="true"></div>

      {/* Footer — msg_22: уменьшенное лого, копирайт 2024–2026, иконки у телефона/почты */}
      <footer className="py-10 bg-gradient-to-r from-[#0a0f1a] via-[#0e1720] to-[#0a0f1a] border-t border-[#c9a86e]/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-6 md:gap-8">
            {/* Лого — слева */}
            <div className="flex justify-center md:justify-start">
              <Image
                src="/logo-new.png"
                alt="Orient Auto"
                width={160}
                height={54}
                className="h-10 w-auto"
              />
            </div>

            {/* Копирайт — по центру */}
            <div className="text-center">
              <p className="text-white/70 mb-2 text-sm">© 2024 – 2026 Orient Auto. Все права защищены.</p>
              <a href="/privacy-policy" className="text-white/50 hover:text-[#c9a86e] transition-colors text-xs underline underline-offset-2">
                Политика конфиденциальности
              </a>
            </div>

            {/* Контакты — справа, с иконками */}
            <div className="flex flex-col gap-2 items-center md:items-end">
              <a
                href="tel:+79958689768"
                className="text-[#c9a86e] font-semibold hover:text-[#d4b876] transition-colors flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                +7 (995) 868−97−68
              </a>
              <a
                href="mailto:orient.cars@mail.ru"
                className="text-white/70 hover:text-white transition-colors text-sm flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                orient.cars@mail.ru
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Плавающий виджет обратной связи в правом нижнем углу — msg_11
          (клиент прислал 5 референсов) */}
      <FloatingContactWidget />
    </div>
  )
}
