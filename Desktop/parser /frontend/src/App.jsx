import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Search,
  ChevronRight,
  ChevronLeft,
  Loader2,
} from "lucide-react";

/**
 * Minimalist, modern demo admin for MEDBLUE MARBELLA
 * Stack: React + Tailwind + Framer Motion
 * How it works:
 * - By default, fetches /medblue.json (place the provided JSON in your Vite project's public folder)
 * - Or drag & drop the JSON anywhere on the page to load dynamically
 * - Cards: Media, Plans, Specs, Location, Links
 * - Click a card to drill into a slide-in panel with content
 * - Fully responsive with smooth transitions
 */



export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchDefault = async () => {
      try {
        const res = await fetch("/sunset_bay.json", { cache: "no-store" });
        if (!res.ok) throw new Error("Missing /sunset_bay.json in public/");
        const json = await res.json();
        setData(json);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDefault();
  }, []);

  // Drag & Drop JSON loader
  useEffect(() => {
    const onDrop = (e) => {
      if (!e.dataTransfer) return;
      const file = Array.from(e.dataTransfer.files || []).find((f) =>
        f.name.endsWith(".json")
      );
      if (!file) return;
      e.preventDefault();
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const json = JSON.parse(reader.result);
          setData(json);
          setError("");
        } catch (err) {
          setError("Invalid JSON file");
        }
      };
      reader.readAsText(file);
    };
    const onDragOver = (e) => e.preventDefault();
    window.addEventListener("drop", onDrop);
    window.addEventListener("dragover", onDragOver);
    return () => {
      window.removeEventListener("drop", onDrop);
      window.removeEventListener("dragover", onDragOver);
    };
  }, []);

  const projectName = data?.project_info?.project_name || data?.general_info?.project_name || "SUNSET BAY ESTEPONA";
  const description = data?.project_info?.description || data?.general_info?.description || "";
  const url = data?.project_info?.url || data?.general_info?.url || "";

  // Галерея зображень (спочатку pictures, потім renders)
  const galleryImages = useMemo(() => {
    const renders = data?.media?.renders || [];
    const photos = data?.media?.photos || [];
    
    // Повертаємо спочатку photos, потім renders (без фільтрації)
    return [...photos, ...renders];
  }, [data]);

  // Локація та зручності
  const locationData = useMemo(() => {
    return data?.ai_analysis?.location_analysis || {};
  }, [data]);

  // Планування юнітів (тільки квартири, без майстерплану)
  const unitsData = useMemo(() => {
    const allUnits = data?.ai_analysis?.units_analysis?.units_data || [];
    return allUnits.filter(unit => unit.unit_type === 'apartment_unit_plan');
  }, [data]);

  // Таблиця цін
  const priceData = useMemo(() => {
    return data?.price_availability?.responsive_table?.units_data || [];
  }, [data]);

  const filteredGalleryImages = useMemo(() => {
    if (!query) return galleryImages;
    return galleryImages.filter((m) =>
      (m.alt || "").toLowerCase().includes(query.toLowerCase()) ||
      (m.filename || "").toLowerCase().includes(query.toLowerCase())
    );
  }, [galleryImages, query]);

  try {
    return (
      <div className="min-h-screen bg-white text-slate-900">
        <Header projectName={projectName} url={url} description={description} />

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
          <TopBar query={query} setQuery={setQuery} mediaCount={galleryImages.length} />

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2 text-sm">Loading data…</span>
            </div>
          ) : error ? (
            <ErrorBox message={error} />
          ) : (
            <>
              {/* 1. Галерея проекту (pictures + renders) */}
              <section className="mb-16">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-semibold tracking-tight">Галерея проекту</h2>
                  <span className="text-sm text-slate-500">
                    {galleryImages.length} зображень 
                    {data?.media?.photos?.length > 0 && ` (${data.media.photos.length} фото, ${data?.media?.renders?.length || 0} рендерів)`}
                  </span>
                </div>
                <GalleryGrid images={filteredGalleryImages} />
              </section>

              {/* 2. Опис проекту */}
              <section className="mb-16">
                <h2 className="text-2xl font-semibold tracking-tight mb-6">Опис проекту</h2>
                <div className="prose prose-slate max-w-none">
                  <p className="text-lg leading-relaxed text-slate-700 whitespace-pre-line">
                    {description}
                  </p>
                </div>
              </section>

              {/* 3. Картка з локацією та зручностями */}
              <section className="mb-16">
                <h2 className="text-2xl font-semibold tracking-tight mb-6">Локація та зручності</h2>
                <LocationCard locationData={locationData} projectName={projectName} />
              </section>

              {/* 4. Таблиця цін */}
              {priceData.length > 0 && (
                <section className="mb-16">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-semibold tracking-tight">Ціни та доступність</h2>
                    <span className="text-sm text-slate-500">{priceData.length} квартир</span>
                  </div>
                  <PriceTable prices={priceData} />
                </section>
              )}

              {/* 5. Планування юнітів */}
              <section className="mb-16">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-semibold tracking-tight">Планування квартир</h2>
                  <span className="text-sm text-slate-500">{unitsData.length} квартир</span>
                </div>
                <UnitsGrid units={unitsData} />
              </section>
            </>
          )}
        </main>
    </div>
  );
  } catch (error) {
    console.error("❌ Помилка рендерингу:", error);
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1 style={{ color: 'red' }}>🚨 Помилка рендерингу</h1>
        <p>Сталася помилка при відображенні додатку:</p>
        <pre style={{ 
          backgroundColor: '#f0f0f0', 
          padding: '10px', 
          borderRadius: '5px',
          overflow: 'auto'
        }}>
          {error.message}
        </pre>
        <button 
          onClick={() => window.location.reload()} 
          style={{
            marginTop: '10px',
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Перезавантажити сторінку
        </button>
      </div>
    );
  }
}

function Header({ projectName, url, description }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute -top-12 -right-12 h-64 w-64 rounded-full bg-slate-100 blur-2xl" />
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-8">
        <motion.h1
          className="text-2xl sm:text-3xl font-semibold tracking-tight"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {projectName}
        </motion.h1>
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex text-sm text-slate-500 hover:text-slate-700 underline underline-offset-4"
          >
            Official website
          </a>
        )}
        {description && (
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 line-clamp-3">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}

function TopBar({ query, setQuery, mediaCount, plansCount }) {
  return (
    <div className="sticky top-0 z-30 -mx-4 sm:-mx-6 lg:-mx-8 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${mediaCount} media…`}
            className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-sm outline-none focus:ring-4 ring-slate-100"
          />
        </div>
        <div className="text-xs text-slate-500 hidden sm:block">{plansCount} plans</div>
      </div>
    </div>
  );
}



function ErrorBox({ message }) {
  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
      {message}. Drag & drop a JSON file to load it here.
    </div>
  );
}





function GalleryGrid({ images }) {
  const [openIndex, setOpenIndex] = useState(-1);
  
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {images.map((img, idx) => (
          <button 
            key={idx} 
            className="group relative overflow-hidden rounded-xl border border-slate-200 hover:shadow-lg transition-shadow"
            onClick={() => setOpenIndex(idx)}
          >
            <img
              src={img.url}
              alt={img.alt || "gallery image"}
              loading="lazy"
              className="h-64 w-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-3 left-3 right-3 text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-sm font-medium truncate">{img.alt || "Зображення"}</p>
            </div>
          </button>
        ))}
      </div>
      
      <Lightbox
        items={images.map((img) => ({ src: img.url, alt: img.alt }))}
        index={openIndex}
        onClose={() => setOpenIndex(-1)}
        onNavigate={(i) => setOpenIndex(i)}
      />
    </>
  );
}

function PriceTable({ prices }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-slate-200 rounded-xl overflow-hidden">
        <thead className="bg-slate-50">
          <tr>
            <th className="border border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-900">Референс</th>
            <th className="border border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-900">Тип</th>
            <th className="border border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-900">Поверх</th>
            <th className="border border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-900">Спальні</th>
            <th className="border border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-900">Ванні</th>
            <th className="border border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-900">Площа (м²)</th>
            <th className="border border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-900">Тераса (м²)</th>
            <th className="border border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-900">Ціна (€)</th>
            <th className="border border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-900">Статус</th>
          </tr>
        </thead>
        <tbody>
          {prices.map((price, idx) => (
            <tr key={idx} className="hover:bg-slate-50 transition-colors">
              <td className="border border-slate-200 px-4 py-3 text-sm font-medium text-slate-900">{price.ref}</td>
              <td className="border border-slate-200 px-4 py-3 text-sm text-slate-700">{price.type}</td>
              <td className="border border-slate-200 px-4 py-3 text-sm text-slate-700">{price.floor}</td>
              <td className="border border-slate-200 px-4 py-3 text-sm text-slate-700">{price.beds}</td>
              <td className="border border-slate-200 px-4 py-3 text-sm text-slate-700">{price.baths}</td>
              <td className="border border-slate-200 px-4 py-3 text-sm text-slate-700">{price.built}</td>
              <td className="border border-slate-200 px-4 py-3 text-sm text-slate-700">{price.terrace}</td>
              <td className="border border-slate-200 px-4 py-3 text-sm font-semibold text-green-600">{price.price}</td>
              <td className="border border-slate-200 px-4 py-3 text-sm">
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  price.availability === 'Disponible' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {price.availability}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function UnitsGrid({ units }) {
  const [openIndex, setOpenIndex] = useState(-1);
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {units.map((unit, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
            {/* Зображення плану */}
            <div className="relative">
              <button 
                onClick={() => setOpenIndex(idx)}
                className="w-full h-48 overflow-hidden group"
              >
                <img
                  src={unit.image_url}
                  alt={unit.unit_identification?.unit_title || unit.unit_id || 'План юніту'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-3 right-3 bg-white/90 rounded-full px-2 py-1 text-xs font-medium">
                  {unit.unit_type === 'community_master_plan' ? '🏗️ Майстерплан' : '🏠 Квартира'}
                </div>
              </button>
            </div>

            {/* Інформація про юніт */}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-2">
                {unit.unit_identification?.unit_title || unit.unit_id || 'Без назви'}
              </h3>
              
              {/* Основні параметри */}
              <div className="space-y-3 mb-4">
                {unit.unit_identification?.total_area && unit.unit_identification.total_area !== "" && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500">Площа:</span>
                    <span className="text-sm font-medium text-slate-900">{unit.unit_identification.total_area}</span>
                  </div>
                )}
                
                {unit.unit_id && unit.unit_id !== "UNKNOWN" && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500">ID:</span>
                    <span className="text-sm font-medium text-slate-900">{unit.unit_id}</span>
                  </div>
                )}

                {unit.text_analysis?.all_text_labels && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500">Елементи:</span>
                    <span className="text-sm font-medium text-slate-900">{unit.text_analysis.all_text_labels.length}</span>
                  </div>
                )}
              </div>

              {/* Детальні параметри кімнат */}
              {unit.unit_identification?.room_areas && Object.keys(unit.unit_identification.room_areas).length > 0 && (
                <div className="border-t border-slate-100 pt-4">
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Площа кімнат:</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(unit.unit_identification.room_areas).slice(0, 6).map(([room, area]) => (
                      <div key={room} className="flex justify-between">
                        <span className="text-slate-600 truncate">{room}:</span>
                        <span className="font-medium text-slate-900">{area}</span>
                      </div>
                    ))}
                    {Object.keys(unit.unit_identification.room_areas).length > 6 && (
                      <div className="col-span-2 text-xs text-slate-500 text-center">
                        +{Object.keys(unit.unit_identification.room_areas).length - 6} ще
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Опис */}
              {unit.unit_description && (
                <div className="border-t border-slate-100 pt-4 mt-4">
                  <p className="text-xs text-slate-600 line-clamp-3">
                    {unit.unit_description}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <Lightbox
        items={units.map((unit) => ({ src: unit.image_url, alt: unit.unit_identification?.unit_title || unit.unit_id || 'План юніту' }))}
        index={openIndex}
        onClose={() => setOpenIndex(-1)}
        onNavigate={(i) => setOpenIndex(i)}
      />
    </>
  );
}

function LocationCard({ locationData, projectName }) {
  const aiAnalysis = locationData?.ai_analysis;
  const nearbyAmenities = aiAnalysis?.nearby_amenities;
  const areaFeatures = aiAnalysis?.area_features;
  const coordinates = aiAnalysis?.coordinates;
  const areaDescription = aiAnalysis?.area_description;
  
  return (
    <div className="space-y-8">
      {/* Опис району */}
      {areaDescription && (
        <div className="bg-slate-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-3">Про район</h3>
          <p className="text-slate-700 leading-relaxed">{areaDescription}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Карта */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Розташування</h3>
          <div className="rounded-xl border border-slate-200 overflow-hidden">
                                            <iframe
                                  title="map"
                                  src={`https://www.google.com/maps?q=${coordinates?.latitude || 36.5293},${coordinates?.longitude || -4.8439}&output=embed`}
                                  className="w-full h-64"
                                  allowFullScreen
                                />
          </div>
          <p className="text-sm text-slate-600">
            {aiAnalysis?.location_name || "Los Monteros, Marbella"}
          </p>
        </div>

        {/* Зручності */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Найближчі зручності</h3>
          
          {nearbyAmenities && (
            <div className="grid grid-cols-1 gap-4">
              {Object.entries(nearbyAmenities).map(([key, value]) => (
                <div key={key} className="p-4 rounded-xl border border-slate-200 bg-white hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                    <span className="text-sm font-semibold text-slate-800 capitalize">
                      {key === 'airport' && '✈️ Аеропорт'}
                      {key === 'schools' && '🏫 Школи'}
                      {key === 'beach' && '🏖️ Пляж'}
                      {key === 'supermarket' && '🛒 Супермаркет'}
                      {key === 'golf' && '⛳ Гольф'}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-700 mb-1">
                    {value.name || value.nearest_school || value.nearest_beach || value.nearest_supermarket || value.nearest_golf_course}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>📍 {value.distance}</span>
                    <span>⏱️ {value.travel_time}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Особливості району */}
          {areaFeatures && (
            <div className="space-y-3">
              <h4 className="text-md font-semibold">Особливості району</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg border border-slate-200 bg-white">
                  <p className="text-xs text-slate-500 mb-1">Тип району</p>
                  <p className="text-sm font-medium">{areaFeatures.neighborhood_type}</p>
                </div>
                <div className="p-3 rounded-lg border border-slate-200 bg-white">
                  <p className="text-xs text-slate-500 mb-1">Доступність</p>
                  <p className="text-sm font-medium">{areaFeatures.accessibility}</p>
                </div>
                <div className="p-3 rounded-lg border border-slate-200 bg-white">
                  <p className="text-xs text-slate-500 mb-1">Вид</p>
                  <p className="text-sm font-medium">{areaFeatures.views}</p>
                </div>
                <div className="p-3 rounded-lg border border-slate-200 bg-white">
                  <p className="text-xs text-slate-500 mb-1">Атмосфера</p>
                  <p className="text-sm font-medium">{areaFeatures.atmosphere}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



function Lightbox({ items, index, onClose, onNavigate }) {
  const [i, setI] = useState(index);
  const esc = (e) => e.key === "Escape" && onClose();
  useEffect(() => setI(index), [index]);
  useEffect(() => {
    if (index < 0) return;
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [index]);

  if (index < 0) return null;
  const prev = () => onNavigate(Math.max(0, i - 1));
  const next = () => onNavigate(Math.min(items.length - 1, i + 1));

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg bg-white/10 p-2 text-white hover:bg-white/20"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-3 w-full max-w-5xl">
          <button onClick={prev} className="rounded-lg bg-white/10 p-2 text-white hover:bg-white/20">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <img
            src={items[i].src}
            alt={items[i].alt || "image"}
            className="max-h-[80vh] w-full object-contain rounded-xl shadow-2xl"
          />
          <button onClick={next} className="rounded-lg bg-white/10 p-2 text-white hover:bg-white/20">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}




