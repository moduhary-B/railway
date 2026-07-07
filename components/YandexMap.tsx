"use client";
import { useEffect, useRef } from "react";

let ymapsScriptLoading = false;

export default function YandexMap({
  coords = [43.134132, 131.937687],
  hint = "Офис Orient Auto",
  balloon = "Здесь находится наш офис"
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const placemarkRef = useRef<any>(null);

  useEffect(() => {
    const init = () => {
      if (!mapRef.current || !window.ymaps || mapInstance.current) return;

      const map = new window.ymaps.Map(mapRef.current, {
        center: coords,
        zoom: 15,
        controls: ['zoomControl']
      });

      const placemark = new window.ymaps.Placemark(coords, {
        hintContent: hint,
        balloonContent: balloon
      }, {
        preset: "islands#redDotIcon"
      });

      map.geoObjects.add(placemark);
      mapInstance.current = map;
      placemarkRef.current = placemark;
    };

    if (typeof window !== "undefined") {
      if (window.ymaps) {
        window.ymaps.ready(init);
      } else if (!ymapsScriptLoading) {
        ymapsScriptLoading = true;
        const script = document.createElement("script");
        script.src = "https://api-maps.yandex.ru/2.1/?apikey=724593b6-52ca-4bbe-9fd5-89bedeb84fc4&lang=ru_RU";
        script.async = true;
        script.onload = () => window.ymaps?.ready(init);
        document.body.appendChild(script);
      }
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.destroy();
        mapInstance.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (mapInstance.current && placemarkRef.current) {
      placemarkRef.current.geometry.setCoordinates(coords);
      placemarkRef.current.properties.set({
        hintContent: hint,
        balloonContent: balloon
      });
    }
  }, [coords, hint, balloon]);

  return (
    <div
      ref={mapRef}
      className="w-full h-full rounded-xl overflow-hidden"
      style={{ minHeight: "300px" }}
    />
  );
}
