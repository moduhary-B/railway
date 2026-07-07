"use client"

console.log('=== ГЛАВНАЯ СТРАНИЦА ЗАГРУЖЕНА ===');

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
import ChatIllustration from '../components/ChatIllustration';
import YandexMap from "../components/YandexMap";
import DebugBreakpoints from "../components/DebugBreakpoints";
import { SocialIcon, SocialLinkButton, ORIENT_SOCIALS } from "@/components/social-icons";
import { useConsultationModal } from "@/components/consultation-modal";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeReviewIndex, setActiveReviewIndex] = useState(0)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const reviewsRef = useRef<HTMLDivElement>(null)
  const aboutCarouselRef = useRef<HTMLDivElement>(null)
  const [selectedVideo, setSelectedVideo] = useState<null | { src: string; title: string; car: string }>(null)
  // refs для превью-видео
  const previewVideoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  // refs для превью-видео (отзывы)
  const reviewPreviewVideoRefs = useRef<Array<HTMLVideoElement | null>>([]);

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
  const [videoWithTransition, setVideoWithTransition] = useState(true);
  const VIDEO_SLIDE_ANIMATION = 500;
  // Сброс transition и индекса после анимации (вперёд)
  useEffect(() => {
    if (!videoWithTransition) return;
    if (activeVideoSlide === videoSlidesChunks.length) {
      const timeout = setTimeout(() => {
        setVideoWithTransition(false);
        setActiveVideoSlide(0);
      }, VIDEO_SLIDE_ANIMATION);
      return () => clearTimeout(timeout);
    } else if (activeVideoSlide < 0) {
      const timeout = setTimeout(() => {
        setVideoWithTransition(false);
        setActiveVideoSlide(videoSlidesChunks.length - 1);
      }, VIDEO_SLIDE_ANIMATION);
      return () => clearTimeout(timeout);
    }
  }, [activeVideoSlide, videoWithTransition, videoSlidesChunks.length]);
  useEffect(() => {
    if (!videoWithTransition) {
      const timeout = setTimeout(() => setVideoWithTransition(true), 20);
      return () => clearTimeout(timeout);
    }
  }, [videoWithTransition]);
  const goToVideoSlide = (target: any, animated = true) => {
    if (!videoWithTransition) return;
    setVideoWithTransition(!!animated);
    setActiveVideoSlide(target);
  };

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
  const teamMembers = [
    { name: "Алихан", position: "Руководитель компании", photo: "/personal/p1.PNG" },
    { name: "Кирилл", position: "Руководитель отдела продаж", photo: "/personal/p2.PNG" },
    { name: "Арина", position: "SMM-специалист", photo: "/personal/p3.PNG" },
    { name: "Валентин", position: "Менеджер отдела продаж", photo: "/personal/p4.PNG" },
    { name: "Вадим", position: "Менеджер отдела продаж", photo: "/personal/p5.PNG" },
    { name: "Павел", position: "Менеджер отдела продаж", photo: "/personal/p6.PNG" },
    { name: "Андрей", position: "Менеджер отдела продаж", photo: "/personal/p7.PNG" },
    { name: "Павел", position: "Менеджер отдела продаж", photo: "/personal/p8.PNG" },
    { name: "Владислав", position: "Менеджер отдела продаж", photo: "/personal/p9.PNG" },
    { name: "Владислав", position: "Менеджер отдела продаж", photo: "/personal/p10.PNG" },
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
    },
    {
      step: "2",
      title: "Подбор авто",
      description:
        "Наши менеджера тщательно разбирают пожелания клиента и предоставляют актуальные варианты - исходя из предпочтений, бюджета и среды эксплуатации автомобиля.",
    },
    {
      step: "3",
      title: "Оформление договора",
      description: "Составляем договор, прописываем все критерии к авто и конечный бюджет. Взнос - 50 000 / 100 000 рублей (ВОЗВРАТНЫЙ до момента покупки / бронирования авто).",
    },
    {
      step: "4",
      title: "Покупка авто",
      description: "Клиент подбирает авто под свой запрос, согласовывает ставку и бронирование. После этого оплачивает стоимость авто с доставкой во Владивосток.",
    },
    {
      step: "5",
      title: "Доставка в РФ",
      description:
        "С момента покупки авто, доставка осуществляется от 7 до 20 дней (в зависимости от страны - Кореи, Японии или Китая). Далее таможенное оформление - в среднем 5 рабочих дней.",
    },
    {
      step: "6",
      title: "Передача клиенту / отправка клиенту",
      description: "При вручении или отправке через ТК / ЖД, у клиента на руках уже имеется полный пакет документов для постановки авто на учет.",
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
      description: "Профессиональная команда с большим опытом работы на рынке авто из Азии.",
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
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#0a0f1a] via-[#0e1720] to-[#1a2332] overflow-x-hidden w-full">
      <DebugBreakpoints />
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
                  width={180}
                  height={60}
                  className="h-10 md:h-12 w-auto transition-transform group-hover:scale-105"
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
                      className="text-[#c9a86e] font-semibold text-xl hover:text-[#d4b876] transition-colors flex items-center gap-3"
                    >
                      <Phone className="w-6 h-6" />
                      +7 (995) 868-97-68
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

      {/* Hero Section with Video Placeholder */}
      <section id="hero" className="relative pt-16 pb-20 md:pt-16 md:pb-32 overflow-hidden min-h-[90vh] flex items-center scroll-mt-24">
        {/* Video Placeholder */}
        <div className="absolute inset-0 z-0" id="hero1">
          <div className="w-full h-full bg-gradient-to-br from-[#0a0f1a] via-[#0e1720] to-[#1a2332]">
            <div className="absolute inset-0 overflow-hidden">
              <video
                src="/back2.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover opacity-40"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(201,168,110,0.15)_0%,_transparent_70%)]"></div>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a] via-transparent to-[#0a0f1a]/80"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left">
                

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight">
                  Автомобили из{" "}
                  <span className="bg-gradient-to-r from-[#c9a86e] to-[#d4b876] bg-clip-text text-transparent">
                    Азии
                  </span>{" "}
                  с гарантией качества
                </h1>

                <p className="text-white/80 text-lg md:text-xl mb-10 max-w-xl mx-auto lg:mx-0">
                  Мы специализируемся на подборе и доставке автомобилей из Японии, Кореи и Китая с полным
                  сопровождением сделки.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start mb-8">
                  <a
                    href="#consultation"
                    className="bg-gradient-to-r from-[#c9a86e] to-[#d4b876] hover:from-[#d4b876] hover:to-[#c9a86e] text-[#0e1720] font-semibold px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-[#c9a86e]/25 transform hover:scale-105 active:scale-95 text-sm sm:text-base md:text-lg min-h-[44px] flex items-center justify-center text-center"
                  >
                    Бесплатная консультация
                  </a>
                  <a
                    href="https://t.me/orientauto_chat"
                    className="bg-transparent border-2 border-[#c9a86e] text-[#c9a86e] hover:bg-[#c9a86e]/10 font-semibold px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-4 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 text-sm sm:text-base md:text-lg min-h-[44px] flex items-center justify-center text-center"
                  >
                    Telegram чат
                  </a>
                </div>

                <div className="flex flex-col items-center justify-center lg:items-start gap-4">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="text-white/80">Для вопросов:</div>
                    <div className="flex items-center gap-4 justify-center lg:justify-start">
                    <a
                      href="https://wa.me/79958689768"
                      className="flex items-center gap-2 text-white/80 hover:text-[#c9a86e] transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#1a2332] flex items-center justify-center">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.106" />
                        </svg>
                      </div>
                      WhatsApp
                    </a>
                    <a
                      href="https://t.me/al_orientauto"
                      className="flex items-center gap-2 text-white/80 hover:text-[#c9a86e] transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#1a2332] flex items-center justify-center">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.25l-2.173 10.244c-.168.78-.621.936-1.26.578l-3.478-2.568-1.68 1.614c-.189.182-.345.336-.708.336l.257-3.596 6.531-5.903c.285-.248-.062-.384-.441-.136L7.926 13.8l-3.475-1.086c-.755-.236-.77-.755.157-1.118l13.563-5.229c.631-.231 1.178.349.891 1.883z" />
                        </svg>
                      </div>
                      Telegram
                    </a>
                  
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop feature cards */}
              <div className="hidden lg:block">
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-[#c9a86e]/20 to-[#d4b876]/20 rounded-full blur-3xl opacity-30"></div>
                  <div className="grid grid-cols-2 gap-4 relative">
                    <div className="space-y-4">
                      <div className="bg-[#1a2332]/80 backdrop-blur-sm border border-[#c9a86e]/20 p-6 rounded-2xl transform hover:scale-105 transition-all duration-300">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#c9a86e] to-[#d4b876] flex items-center justify-center text-[#0e1720] mb-4">
                          <Shield className="w-6 h-6" />
                        </div>
                        <h3 className="text-white font-semibold mb-2">Полное сопровождение</h3>
                        <p className="text-white/70 text-sm">От выбора до получения ключей</p>
                      </div>
                      <div className="bg-[#1a2332]/80 backdrop-blur-sm border border-[#c9a86e]/20 p-6 rounded-2xl transform hover:scale-105 transition-all duration-300">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#c9a86e] to-[#d4b876] flex items-center justify-center text-[#0e1720] mb-4">
                          <Award className="w-6 h-6" />
                        </div>
                        <h3 className="text-white font-semibold mb-2">Независимая оценка</h3>
                        <p className="text-white/70 text-sm">Экспертиза каждого автомобиля</p>
                      </div>
                    </div>
                    <div className="space-y-4 mt-8">
                      <div className="bg-[#1a2332]/80 backdrop-blur-sm border border-[#c9a86e]/20 p-6 rounded-2xl transform hover:scale-105 transition-all duration-300">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#c9a86e] to-[#d4b876] flex items-center justify-center text-[#0e1720] mb-4">
                          <FileCheck className="w-6 h-6" />
                        </div>
                        <h3 className="text-white font-semibold mb-2">Юридическая чистота</h3>
                        <p className="text-white/70 text-sm">Гарантия легальности сделки</p>
                      </div>
                      <div className="bg-[#1a2332]/80 backdrop-blur-sm border border-[#c9a86e]/20 p-6 rounded-2xl transform hover:scale-105 transition-all duration-300">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#c9a86e] to-[#d4b876] flex items-center justify-center text-[#0e1720] mb-4">
                          <Clock className="w-6 h-6" />
                        </div>
                        <h3 className="text-white font-semibold mb-2">Короткие сроки</h3>
                        <p className="text-white/70 text-sm">Быстрая доставка в любой регион</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile feature cards - скрыты на мобильных */}
              <div className="hidden">
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-4 bg-[#1a2332]/80 backdrop-blur-sm border border-[#c9a86e]/20 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#c9a86e] to-[#d4b876] flex items-center justify-center text-[#0e1720] mx-auto mb-2">
                      <Shield className="w-4 h-4" />
                    </div>
                    <p className="text-xs text-white font-medium">Полное сопровождение</p>
                  </div>
                  <div className="text-center p-4 bg-[#1a2332]/80 backdrop-blur-sm border border-[#c9a86e]/20 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#c9a86e] to-[#d4b876] flex items-center justify-center text-[#0e1720] mx-auto mb-2">
                      <Award className="w-4 h-4" />
                    </div>
                    <p className="text-xs text-white font-medium">Независимая оценка</p>
                  </div>
                  <div className="text-center p-4 bg-[#1a2332]/80 backdrop-blur-sm border border-[#c9a86e]/20 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#c9a86e] to-[#d4b876] flex items-center justify-center text-[#0e1720] mx-auto mb-2">
                      <FileCheck className="w-4 h-4" />
                    </div>
                    <p className="text-xs text-white font-medium">Юридическая чистота</p>
                  </div>
                  <div className="text-center p-4 bg-[#1a2332]/80 backdrop-blur-sm border border-[#c9a86e]/20 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#c9a86e] to-[#d4b876] flex items-center justify-center text-[#0e1720] mx-auto mb-2">
                      <Clock className="w-4 h-4" />
                    </div>
                    <p className="text-xs text-white font-medium">Короткие сроки</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-16 pt-8 border-t border-[#c9a86e]/20">
              <div className="flex flex-row flex-nowrap justify-center items-center gap-4 md:gap-20">
                <div className="flex flex-col items-center group cursor-pointer md:flex-row md:gap-4">
                  <div className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-white to-gray-100 flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-110">
                    <div className="w-6 h-6 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-red-500 to-red-600 shadow-inner"></div>
                  </div>
                  <span className="text-white text-base md:text-4xl font-bold tracking-wider bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mt-2 md:mt-0">ЯПОНИИ</span>
                </div>
                <div className="flex flex-col items-center group cursor-pointer md:flex-row md:gap-4">
                  <div className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-white to-gray-100 flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-110">
                    <div className="relative w-6 h-6 md:w-10 md:h-10">
                      <div className="absolute inset-0 bg-white rounded-full"></div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 md:w-8 md:h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-inner"></div>
                      <div className="absolute top-0.5 right-0.5 w-2 h-2 md:w-4 md:h-4 bg-gradient-to-br from-red-500 to-red-600 rounded-sm shadow-inner"></div>
                    </div>
                  </div>
                  <span className="text-white text-base md:text-4xl font-bold tracking-wider bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mt-2 md:mt-0">КОРЕИ</span>
                </div>
                <div className="flex flex-col items-center group cursor-pointer md:flex-row md:gap-4">
                  <div className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-110">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 md:w-3 md:h-3 bg-gradient-to-br from-yellow-400 to-yellow-500 mb-0.5 md:mb-1 shadow-inner"></div>
                      <div className="flex gap-0.5 md:gap-1">
                        <div className="w-2 h-2 md:w-3 md:h-3 bg-gradient-to-br from-yellow-400 to-yellow-500 shadow-inner"></div>
                        <div className="w-2 h-2 md:w-3 md:h-3 bg-gradient-to-br from-yellow-400 to-yellow-500 shadow-inner"></div>
                      </div>
                    </div>
                  </div>
                  <span className="text-white text-base md:text-4xl font-bold tracking-wider bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mt-2 md:mt-0">КИТАЯ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* После Hero Section вставляю marquee: */}
      <section className="py-24 w-full bg-[#0a0f1a] relative overflow-hidden">
        <div className="relative w-full overflow-hidden shadow-xl border-y border-[#c9a86e]/20 bg-[#0a0f1a]">
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
          <style jsx>{`
            @keyframes marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .marquee-track {
              min-width: 200%;
              will-change: transform;
              overflow: hidden;
            }
          `}</style>
        </div>
      </section>



      {/* Затем блок 'О нас', но marquee внутри удаляю, оставляю только текст, цифры и картинку. */}
      <section className="py-24 bg-gradient-to-b from-[#0a0f1a] to-[#0e1720] w-full overflow-hidden">
        {/* Контейнер с текстом и цифрами */}
        <div className="mx-auto px-4 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="space-y-8 w-full">
              <h2 className="text-5xl md:text-6xl font-light tracking-wide">
                <span className="bg-gradient-to-r from-[#c9a86e] to-[#d4b876] bg-clip-text text-transparent">
                  ORIENT AUTO
                </span>
              </h2>
              <div className="space-y-6 text-lg leading-relaxed">
                <p className="text-white/90">
                  ORIENT AUTO — команда профессионалов, которая сопровождает клиента на каждом этапе: от подбора до передачи ключей от автомобиля вашей мечты.
                </p>
                <p className="text-white/80">
                  Мы работаем напрямую с аукционами и дилерами Японии, Кореи и Китая, тщательно проверяем автомобили и берём на себя все вопросы логистики, оформления и доставки.
                </p>
                <p className="text-white/80">
                  Наша миссия — сделать покупку авто из Азии простой, прозрачной и комфортной для каждого клиента.
                </p>
                <p className="text-[#c9a86e] font-medium">
                  Доверьте нам заботу о вашем будущем автомобиле!
                </p>
              </div>
              <div className="flex gap-4 pt-4 justify-center overflow-hidden">
                <div className="text-center flex-1 min-w-0">
                  <div className="text-4xl font-bold text-[#c9a86e] overflow-hidden">500+</div>
                  <div className="text-white/70 text-base overflow-hidden">Довольных клиентов</div>
                </div>
                <div className="text-center flex-1 min-w-0">
                  <div className="text-4xl font-bold text-[#c9a86e] overflow-hidden">5+</div>
                  <div className="text-white/70 text-base overflow-hidden">Лет опыта</div>
                </div>
                <div className="text-center flex-1 min-w-0">
                  <div className="text-4xl font-bold text-[#c9a86e] overflow-hidden">100%</div>
                  <div className="text-white/70 text-base overflow-hidden">Гарантия качества</div>
                </div>
              </div>
            </div>
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
      <section className="scroll-mt-0 bg-gradient-to-b from-[#0e1720] to-[#0e1720] relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 pt-24">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-4">
              Каталог автомобилей
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Выберите страну происхождения и найдите идеальный автомобиль для себя
            </p>
          </div>

          {/* Countries Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[
              {
                id: 'korea',
                name: 'Корея',
                description: 'Качественные автомобили из Южной Кореи',
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
            ].map((country) => (
              <div key={country.id} className="bg-[#1a2332]/80 backdrop-blur-sm border border-[#c9a86e]/20 hover:border-[#c9a86e]/40 transition-all duration-300 group hover:shadow-2xl hover:shadow-[#c9a86e]/10 transform hover:-translate-y-2 rounded-xl overflow-hidden">
                <div className="relative overflow-hidden rounded-t-lg p-6">
                  <div className={`absolute inset-0 bg-gradient-to-r ${country.color} opacity-20 group-hover:opacity-30 transition-opacity`} />
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {country.name}
                    </h3>
                    <p className="text-white/70">{country.description}</p>
                  </div>
                </div>
                <div className="p-6">
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
                    <button className="w-full bg-gradient-to-r from-[#c9a86e] to-[#d4b876] hover:from-[#d4b876] hover:to-[#c9a86e] text-[#0e1720] font-semibold rounded-lg group-hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-[#c9a86e]/25 py-3 px-4 flex items-center justify-center">
                      Перейти в каталог
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </button>
                  </Link>
                </div>
              </div>
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
      </section>

      {/* Telegram Chat Section - Улучшенная иллюстрация и стрелка на кнопке */}
      <section className="pt-[14.5rem] pb-24 bg-gradient-to-b from-[#0e1720] to-[#1a2332] relative md:overflow-hidden overflow-visible">
        {/* Пятнышко вынесено за пределы родительского блока */}
        <div className="absolute -top-32 md:top-24 mb:left-6  w-96 h-96 bg-gradient-to-br from-[#c9a86e]/20 to-[#d4b876]/10 rounded-full blur-3xl opacity-40 z-0"></div>
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-center relative z-10 gap-12">
          <div className="flex-1 flex flex-col items-center md:items-start overflow-visible">
            <h2 className="text-white text-4xl md:text-5xl mb-8 text-center md:text-left font-bold tracking-wide drop-shadow-xl">
              <span className="bg-gradient-to-r from-[#c9a86e] to-[#d4b876] bg-clip-text text-transparent">TELEGRAM-ЧАТ МЕНЕДЖЕРОВ</span>
            </h2>
            <div className="max-w-2xl text-center md:text-left mb-12">
              <p className="text-white/90 text-xl md:text-2xl font-light mb-4">Общайтесь в реальном времени с опытными специалистами Orient Auto!</p>
              <p className="text-[#c9a86e] text-lg md:text-xl font-medium">Мгновенные ответы на любые вопросы, честные консультации и поддержка без ожидания!</p>
              <p className="text-white/70 mt-4">В нашем Telegram-чате <span className="text-[#c9a86e] font-semibold">@orientauto_chat</span> вы получите профессиональную помощь напрямую от менеджеров компании. Присоединяйтесь — конкуренты такого не предлагают!</p>
            </div>
            <a
              href="https://t.me/orientauto_chat"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 md:gap-3 px-6 py-3 md:px-10 md:py-5 rounded-xl md:rounded-2xl bg-gradient-to-r from-[#c9a86e] to-[#d4b876] text-[#181f2a] text-base md:text-2xl font-semibold md:font-bold shadow-xl hover:scale-105 hover:from-[#d4b876] hover:to-[#c9a86e] transition-all duration-300 drop-shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" className="md:w-8 md:h-8 w-5 h-5"><path fill="#181f2a" d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.25l-2.173 10.244c-.168.78-.621.936-1.26.578l-3.478-2.568-1.68 1.614c-.189.182-.345.336-.708.336l.257-3.596 6.531-5.903c.285-.248-.062-.384-.441-.136L7.926 13.8l-3.475-1.086c-.755-.236-.77-.755.157-1.118l13.563-5.229c.631-.231 1.178.349.891 1.883z"/></svg>
              Перейти в Telegram-чат
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" className="md:w-7 md:h-7 w-5 h-5"><path d="M5 12h14M13 6l6 6-6 6" stroke="#181f2a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
          </div>
          {/* SVG-иллюстрация чата — современный стиль, скрыта на мобильных */}
          <div className="hidden md:block flex-1">
            <ChatIllustration />
          </div>
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

      {/* Video Section - Vertical Videos */}
      <section className="py-24 bg-gradient-to-b from-[#1a2332] to-[#0e1720] w-full overflow-hidden">
        <div className="container mx-auto px-12 max-w-full">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-16">
            <h2 className="text-white text-4xl md:text-5xl font-light tracking-wide mb-6 md:mb-0">
              Полезные видео о нас и импорте
            </h2>
            <div className="flex items-center gap-4 relative">
              <a href="https://www.instagram.com/orientauto.ru?igsh=MTl0ZXk4ZDZ4YTB6aw==" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#c9a86e] transition-colors"><Instagram className="w-8 h-8" /></a>
              <a href="https://youtube.com/@orientauto_ru" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#c9a86e] transition-colors"><Youtube className="w-8 h-8" /></a>
              <a href="https://t.me/orientauto_ru" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#c9a86e] transition-colors">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.25l-2.173 10.244c-.168.78-.621.936-1.26.578l-3.478-2.568-1.68 1.614c-.189.182-.345.336-.708.336l.257-3.596 6.531-5.903c.285-.248-.062-.384-.441-.136L7.926 13.8l-3.475-1.086c-.755-.236-.77-.755.157-1.118l13.563-5.229c.631-.231 1.178.349.891 1.883z" />
                </svg>
              </a>
              <a href="https://wa.me/79958689768" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#c9a86e] transition-colors">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.106" />
                </svg>
              </a>
            </div>
          </div>

          {/* Desktop Version - скрыта на мобильных */}
          <div className="hidden md:block relative">
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
                              preload="metadata"
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
          <div className="md:hidden relative">
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
                            preload="metadata"
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

      {/* How to Order Section - With Arrows */}
      <section className="py-24 bg-gradient-to-b from-[#0e1720] to-[#1a2332] w-full overflow-hidden">
        <div className="container mx-auto px-4 max-w-full">
          <h2 className="text-white text-4xl md:text-5xl mb-20 text-center font-light tracking-wide">
            Этапы работы
          </h2>

          <div className="relative flex items-center justify-center min-h-[500px] lg:min-h-[520px]">
            {/* Левая стрелка */}
            <button
              onClick={() => handleOrderStepChange(Math.max(activeOrderStep - 1, 0))}
              className="absolute left-4 md:left-[25%] bottom-4 md:top-1/2 md:-translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-300 hover:scale-110 border border-[#c9a86e]/20 hover:border-[#c9a86e]/40 flex items-center justify-center z-50"
              aria-label="Предыдущий шаг"
              disabled={activeOrderStep === 0}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div 
              className="flex justify-center items-center w-full gap-4 md:gap-12 relative overflow-x-hidden overflow-y-visible pb-8" 
              style={{minHeight: 400}}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={() => onTouchEnd(activeOrderStep, orderSteps.length - 1, handleOrderStepChange)}
            >
              {orderSteps.map((item, idx) => {
                // Определяем позицию карточки относительно активной
                let position = idx - activeOrderStep;
                let isActive = idx === activeOrderStep;
                let isPrev = idx === activeOrderStep - 1;
                let isNext = idx === activeOrderStep + 1;
                // Анимация направления
                let direction = activeOrderStep > prevOrderStep ? 1 : -1;
                // Стили для анимации
                let base = "absolute left-1/2 top-0 w-full max-w-md lg:max-w-lg transition-all duration-500 ease-in-out";
                let style = {};
                if (isActive) {
                  style = {
                    transform: "translateX(-50%) scale(1)",
                    zIndex: 40,
                    opacity: 1,
                    filter: "none"
                  };
                } else if (isPrev) {
                  style = {
                    transform: "translateX(-100%) scale(0.9)",
                    zIndex: 20,
                    opacity: 0.6,
                    filter: "blur(4px)"
                  };
                } else if (isNext) {
                  style = {
                    transform: "translateX(0%) scale(0.9)",
                    zIndex: 20,
                    opacity: 0.6,
                    filter: "blur(4px)"
                  };
                } else {
                  style = {
                    transform: `translateX(${position * 100}%) scale(0.7)`,
                    zIndex: 10,
                    opacity: 0,
                    pointerEvents: "none"
                  };
                }
                return (
                  <div
                    key={idx}
                    className={base + (isActive ? " group bg-gradient-to-br from-[#1a2332] to-[#0e1720] border border-[#c9a86e]/40 p-8 lg:p-10 rounded-xl shadow-2xl" : " group bg-gradient-to-br from-[#1a2332] to-[#0e1720] border border-[#c9a86e]/20 p-8 lg:p-10 rounded-xl shadow-xl pointer-events-none")}
                    style={style}
                  >
                    <div className="w-16 h-16 lg:w-18 lg:h-18 rounded-full bg-gradient-to-br from-[#c9a86e] to-[#d4b876] flex items-center justify-center text-[#0e1720] font-bold text-2xl lg:text-3xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg relative z-10">
                      {item.step}
                    </div>
                    <h3 className="text-white text-xl lg:text-2xl font-semibold mb-4 group-hover:text-[#c9a86e] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-white/70 lg:text-lg leading-relaxed group-hover:text-white/90 transition-colors">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
            {/* Правая стрелка */}
            <button
              onClick={() => handleOrderStepChange(Math.min(activeOrderStep + 1, orderSteps.length - 1))}
              className="absolute right-4 md:right-[25%] bottom-4 md:top-1/2 md:-translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-300 hover:scale-110 z-50 border border-[#c9a86e]/20 hover:border-[#c9a86e]/40 flex items-center justify-center"
              aria-label="Следующий шаг"
              disabled={activeOrderStep === orderSteps.length - 1}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
          {/* Индикаторы */}
          <div className="flex justify-center gap-2">
            {orderSteps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleOrderStepChange(idx)}
                className={`carousel-dot w-3 h-3 rounded-full transition-all duration-300 ${idx === activeOrderStep ? "bg-[#c9a86e]" : "bg-white/30 hover:bg-white/50"}`}
                aria-label={`Перейти к шагу ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section - Grid with Animation */}
      <section id="reviews" className="py-24 bg-gradient-to-b from-[#1a2332] to-[#1a2332] scroll-mt-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
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
          
          <div className="w-full">
            <script src="https://res.smartwidgets.ru/app.js" defer></script>
            <div className="sw-app" data-app="7b48850d9c7da346aae2677ecfa009b1"></div>
          </div>



        </div>
      </section>

      {/* Video Reviews Section */}
      <section className="py-24 bg-gradient-to-b from-[#1a2332] to-[#0e1720] w-full overflow-hidden">
        <div className="container mx-auto px-4 max-w-full">
          <div className="text-center mb-16">
            <h2 className="text-white text-4xl md:text-5xl font-light tracking-wide mb-6">
              <span className="bg-gradient-to-r from-[#c9a86e] to-[#d4b876] bg-clip-text text-transparent font-medium">
                ORIENT AUTO{" "}
              </span>
              глазами клиентов
            </h2>

            <p className="text-white/70 text-lg max-w-3xl mx-auto">
              Послушайте, что говорят наши клиенты о работе с Orient Auto и качестве приобретенных автомобилей
            </p>
          </div>

          {/* Десктопная версия */}
          <div className="hidden md:block relative">
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
      <section className="py-24 bg-gradient-to-b from-[#0e1720] to-[#1a2332]">
        <div className="container mx-auto px-4">
          
          <h2 className="text-white text-4xl md:text-5xl mb-20 text-center font-light tracking-wide">Команда</h2>
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
                {/* Карусель карточек */}
                <div className="overflow-hidden max-w-full" style={{
                  width: '100%',
                  maxWidth: TEAM_VISIBLE * CARD_WIDTH + (TEAM_VISIBLE - 1) * GAP + 'px',
                }}>
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
                          <div className="relative aspect-[8/10] w-full flex items-center justify-center">
                            <Image
                              src={member.photo}
                              alt={member.name}
                              fill
                              className="object-cover rounded-xl shadow-lg"
                              sizes="(max-width: 768px) 60vw, 20vw"
                            />
                          </div>
                          {/* Подписи под фото убраны по требованию */}
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

      {/* Contact Section */}
      <section id="contacts" className="py-24 bg-gradient-to-b from-[#1a2332] to-[#0e1720] scroll-mt-24">
        <div className="container mx-auto px-4">
          <h2 className="text-white text-4xl md:text-5xl mb-16 text-center font-light tracking-wide">Наши контакты</h2>

          <div className="grid lg:grid-cols-2 gap-16">
            <div className="space-y-8">
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
              {/* Время работы */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#c9a86e] to-[#d4b876] flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-[#0e1720]" />
                </div>
                <div>
                  <div className="text-white text-xl font-semibold mb-1">Режим работы</div>
                  <div className="space-y-1">
                    <p className="text-white/80">Пн-Пт: 10:00 - 19:00</p>
                    <p className="text-white/80">Сб-Вс: выходной</p>
                  </div>
                </div>
              </div>
              {/* Соцсети */}
              <div>
                <div className="text-white/80 text-lg mb-2">Мы в соцсетях:</div>
                <div className="flex gap-4 mt-2">
                  <a href="https://t.me/orientauto_ru" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1a2332] to-[#0e1720] border border-[#c9a86e]/20 flex items-center justify-center hover:border-[#c9a86e]/40 transition-all duration-300 hover:scale-110 group" title="Telegram">
                    <svg className="w-6 h-6 text-[#c9a86e] group-hover:text-[#d4b876] transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.25l-2.173 10.244c-.168.78-.621.936-1.26.578l-3.478-2.568-1.68 1.614c-.189.182-.345.336-.708.336l.257-3.596 6.531-5.903c.285-.248-.062-.384-.441-.136L7.926 13.8l-3.475-1.086c-.755-.236-.77-.755.157-1.118l13.563-5.229c.631-.231 1.178.349.891 1.883z"/></svg>
                  </a>
                  <a href="https://wa.me/79958689768" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1a2332] to-[#0e1720] border border-[#c9a86e]/20 flex items-center justify-center hover:border-[#c9a86e]/40 transition-all duration-300 hover:scale-110 group" title="WhatsApp">
                    <svg className="w-6 h-6 text-[#c9a86e] group-hover:text-[#d4b876] transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.571-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.363.709.306 1.262.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.288.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 5.421h-.001a8.933 8.933 0 01-4.548-1.252l-.326-.194-3.377.896.902-3.289-.213-.338a8.933 8.933 0 01-1.364-4.725c.001-4.962 4.037-9 9-9 2.406 0 4.663.936 6.364 2.636a8.924 8.924 0 012.635 6.363c-.002 4.962-4.038 9-9 9m7.5-16.5C19.151 2.151 16.209 1 12.999 1c-7.065 0-12 5.935-12 12 0 2.122.555 4.197 1.607 6.032L1 23l6.115-1.605A11.96 11.96 0 0013 25c7.065 0 12-5.935 12-12 0-3.21-1.151-6.152-3.428-8.428z"/></svg>
                  </a>
                  <a href="https://www.youtube.com/@orientauto_ru" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1a2332] to-[#0e1720] border border-[#c9a86e]/20 flex items-center justify-center hover:border-[#c9a86e]/40 transition-all duration-300 hover:scale-110 group" title="YouTube">
                    <Youtube className="w-6 h-6 text-[#c9a86e] group-hover:text-[#d4b876] transition-colors" />
                  </a>
                  <a href="https://www.instagram.com/orientauto.ru" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1a2332] to-[#0e1720] border border-[#c9a86e]/20 flex items-center justify-center hover:border-[#c9a86e]/40 transition-all duration-300 hover:scale-110 group" title="Instagram">
                    <Instagram className="w-6 h-6 text-[#c9a86e] group-hover:text-[#d4b876] transition-colors" />
                  </a>
                </div>
              </div>
            </div>

            <div>
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
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <div id="consultation" className="relative -top-32 h-0 pointer-events-none"></div>
      <section className="py-24 bg-gradient-to-b from-[#0e1720] to-[#0e1720]">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-white text-4xl md:text-5xl mb-8 font-light tracking-wide">Оставьте заявку на подбор</h2>
            <p className="text-white/70 text-lg mb-12">Наши специалисты свяжутся с вами в течение 15 минут</p>

            <form className="space-y-6" onSubmit={handleFormSubmit}>
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="Ваше имя"
                  className="w-full p-4 bg-gradient-to-br from-[#1a2332] to-[#0e1720] border border-[#c9a86e]/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#c9a86e] transition-colors text-lg"
                  required
                />
              </div>

              <div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  placeholder="Ваш телефон"
                  className="w-full p-4 bg-gradient-to-br from-[#1a2332] to-[#0e1720] border border-[#c9a86e]/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#c9a86e] transition-colors text-lg"
                  required
                />
              </div>

              <div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleFormChange}
                  placeholder="Ваш комментарий"
                  rows={4}
                  className="w-full p-4 bg-gradient-to-br from-[#1a2332] to-[#0e1720] border border-[#c9a86e]/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#c9a86e] transition-colors text-lg resize-none"
                ></textarea>
              </div>

              <div className="flex items-start space-x-2 pt-2 text-left">
                <input type="checkbox" id="consent" name="consent" required className="mt-1" />
                <label htmlFor="consent" className="text-sm text-white/50">
                  Я согласен на обработку персональных данных и принимаю{" "}
                  <a href="/privacy-policy" className="text-[#c9a86e] hover:text-[#d4b876] transition-colors">
                    политику конфиденциальности
                  </a>
                </label>
              </div>

              {isSubmitted ? (
                <div className="text-green-400 text-lg font-semibold py-4">Спасибо за заявку!</div>
              ) : (
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#c9a86e] to-[#d4b876] hover:from-[#d4b876] hover:to-[#c9a86e] text-[#0e1720] font-semibold p-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-[#c9a86e]/25 transform hover:scale-105 text-lg"
                  disabled={isSending}
                >
                  {isSending ? "Отправка..." : "ОТПРАВИТЬ ЗАЯВКУ"}
                </button>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gradient-to-r from-[#0a0f1a] via-[#0e1720] to-[#0a0f1a] border-t border-[#c9a86e]/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
            <div className="text-center lg:text-left">
              <Image
                src="logo-new.png"
                alt="Orient Auto"
                width={270}
                height={90}
                className="h-16 w-auto mx-auto lg:mx-0 mb-4"
              />
              {/* <p className="text-white/70">Премиальные автомобили из Азии</p> */}
            </div>

            <div className="text-center">
              <p className="text-white/70 mb-4">© 2026 Orient Auto. Все права защищены.</p>
              <div className="flex flex-wrap justify-center gap-6">
                <a href="/privacy-policy" className="text-white/50 hover:text-[#c9a86e] transition-colors text-sm underline">
                  Политика конфиденциальности
                </a>
              </div>
            </div>

            <div className="text-center lg:text-right">
              <div className="flex flex-col gap-2">
                <a
                  href="tel:+79958689768"
                  className="text-[#c9a86e] font-semibold hover:text-[#d4b876] transition-colors"
                >
                  +7 (995) 868−97−68
                </a>
                <a href="mailto:orient.cars@mail.ru" className="text-white/70 hover:text-white transition-colors">
                  orient.cars@mail.ru
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      
    </div>
  )
}
