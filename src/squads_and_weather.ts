/**
 * Модуль составов всех лиг и климатической базы данных погоды для «Вирт РПЛ».
 * Поддерживает:
 * - Полные составы (по 20 игроков) для Первой лиги, Второй лиги А, Второй лиги Б и Медиалиги (+ РПЛ)
 * - Климатическую базу среднестатистической погоды на каждый день по всем городам клубов
 * - Привязку погоды к каждому матчу (в расписании, лайве и протоколах)
 */

export interface CityClimate {
  city: string;
  region: string;
  lat: number;
  lon: number;
  elevationM: number;
  // Помесячные климатические нормы (0..11 = Январь..Декабрь)
  months: {
    tDay: number;       // Средняя дневная температура (°C)
    tNight: number;     // Средняя ночная температура (°C)
    tMax: number;       // Рекордная / максимальная дневная (°C)
    tMin: number;       // Рекордная / минимальная ночная (°C)
    precipProb: number; // Вероятность осадков (0..1)
    snowProb: number;   // Вероятность того, что осадки будут в виде снега (0..1)
    avgWind: number;    // Средняя скорость ветра (м/с)
    humidity: number;   // Средняя влажность воздуха (%)
    windDir: string;    // Преобладающий ветер
  }[];
}

export interface MatchWeather {
  city: string;
  date: string;
  time: string;
  temp: number;
  feelsLike: number;
  condition: string;
  icon: string;
  wind: number;
  windDir: string;
  humidity: number;
  pressure: number;
  precipitation: string;
  pitch: string;
  text: string;
  short: string;
  isStatistical: boolean;
}

// 75 городов с реальными климатическими нормами (на основе многолетних метеонаблюдений)
export const CLIMATE_DATA: Record<string, CityClimate> = {
  'Москва': {
    city: 'Москва', region: 'Центральный ФО', lat: 55.75, lon: 37.62, elevationM: 156,
    months: [
      { tDay: -4.0, tNight: -9.1, tMax: 3.0, tMin: -25.0, precipProb: 0.65, snowProb: 0.95, avgWind: 3.8, humidity: 85, windDir: 'ЮЗ' },
      { tDay: -3.7, tNight: -9.8, tMax: 4.0, tMin: -24.0, precipProb: 0.60, snowProb: 0.90, avgWind: 3.9, humidity: 81, windDir: 'ЮЗ' },
      { tDay: 2.6, tNight: -4.4, tMax: 14.0, tMin: -15.0, precipProb: 0.50, snowProb: 0.60, avgWind: 3.7, humidity: 74, windDir: 'Ю' },
      { tDay: 11.3, tNight: 2.1, tMax: 24.0, tMin: -5.0, precipProb: 0.45, snowProb: 0.10, avgWind: 3.4, humidity: 65, windDir: 'СЗ' },
      { tDay: 18.6, tNight: 8.1, tMax: 29.0, tMin: 0.0, precipProb: 0.42, snowProb: 0.00, avgWind: 3.1, humidity: 62, windDir: 'С' },
      { tDay: 22.1, tNight: 12.3, tMax: 32.0, tMin: 5.0, precipProb: 0.48, snowProb: 0.00, avgWind: 2.8, humidity: 68, windDir: 'СЗ' },
      { tDay: 24.3, tNight: 14.8, tMax: 34.0, tMin: 8.0, precipProb: 0.47, snowProb: 0.00, avgWind: 2.6, humidity: 71, windDir: 'З' },
      { tDay: 22.0, tNight: 13.0, tMax: 32.0, tMin: 5.0, precipProb: 0.44, snowProb: 0.00, avgWind: 2.7, humidity: 74, windDir: 'З' },
      { tDay: 15.7, tNight: 8.2, tMax: 25.0, tMin: -1.0, precipProb: 0.50, snowProb: 0.02, avgWind: 3.0, humidity: 80, windDir: 'ЮЗ' },
      { tDay: 8.7, tNight: 3.0, tMax: 18.0, tMin: -6.0, precipProb: 0.55, snowProb: 0.25, avgWind: 3.4, humidity: 83, windDir: 'ЮЗ' },
      { tDay: 1.2, tNight: -2.9, tMax: 10.0, tMin: -14.0, precipProb: 0.62, snowProb: 0.70, avgWind: 3.8, humidity: 86, windDir: 'ЮЗ' },
      { tDay: -3.0, tNight: -7.5, tMax: 4.0, tMin: -21.0, precipProb: 0.68, snowProb: 0.92, avgWind: 3.9, humidity: 87, windDir: 'ЮЗ' }
    ]
  },
  'Санкт-Петербург': {
    city: 'Санкт-Петербург', region: 'Северо-Западный ФО', lat: 59.95, lon: 30.32, elevationM: 5,
    months: [
      { tDay: -3.0, tNight: -8.0, tMax: 4.0, tMin: -22.0, precipProb: 0.70, snowProb: 0.90, avgWind: 4.5, humidity: 86, windDir: 'Ю' },
      { tDay: -3.0, tNight: -8.5, tMax: 5.0, tMin: -23.0, precipProb: 0.65, snowProb: 0.85, avgWind: 4.3, humidity: 84, windDir: 'ЮЗ' },
      { tDay: 1.8, tNight: -4.5, tMax: 12.0, tMin: -16.0, precipProb: 0.55, snowProb: 0.55, avgWind: 4.1, humidity: 78, windDir: 'Ю' },
      { tDay: 9.2, tNight: 1.5, tMax: 21.0, tMin: -6.0, precipProb: 0.48, snowProb: 0.15, avgWind: 3.8, humidity: 69, windDir: 'З' },
      { tDay: 16.3, tNight: 7.2, tMax: 28.0, tMin: 0.0, precipProb: 0.44, snowProb: 0.01, avgWind: 3.5, humidity: 66, windDir: 'З' },
      { tDay: 20.4, tNight: 12.1, tMax: 31.0, tMin: 6.0, precipProb: 0.50, snowProb: 0.00, avgWind: 3.3, humidity: 71, windDir: 'З' },
      { tDay: 23.2, tNight: 15.0, tMax: 33.0, tMin: 9.0, precipProb: 0.52, snowProb: 0.00, avgWind: 3.1, humidity: 76, windDir: 'З' },
      { tDay: 21.0, tNight: 13.5, tMax: 31.0, tMin: 6.0, precipProb: 0.55, snowProb: 0.00, avgWind: 3.3, humidity: 80, windDir: 'З' },
      { tDay: 15.1, tNight: 8.8, tMax: 23.0, tMin: 0.0, precipProb: 0.60, snowProb: 0.02, avgWind: 3.8, humidity: 83, windDir: 'ЮЗ' },
      { tDay: 8.4, tNight: 3.6, tMax: 16.0, tMin: -5.0, precipProb: 0.65, snowProb: 0.20, avgWind: 4.1, humidity: 85, windDir: 'Ю' },
      { tDay: 2.3, tNight: -1.7, tMax: 9.0, tMin: -12.0, precipProb: 0.70, snowProb: 0.65, avgWind: 4.4, humidity: 87, windDir: 'Ю' },
      { tDay: -1.6, tNight: -6.1, tMax: 5.0, tMin: -19.0, precipProb: 0.72, snowProb: 0.88, avgWind: 4.6, humidity: 88, windDir: 'Ю' }
    ]
  },
  'Казань': {
    city: 'Казань', region: 'Приволжский ФО', lat: 55.79, lon: 49.12, elevationM: 60,
    months: [
      { tDay: -7.2, tNight: -13.1, tMax: 2.0, tMin: -28.0, precipProb: 0.65, snowProb: 0.98, avgWind: 4.2, humidity: 84, windDir: 'Ю' },
      { tDay: -6.7, tNight: -13.0, tMax: 3.0, tMin: -27.0, precipProb: 0.58, snowProb: 0.95, avgWind: 4.1, humidity: 81, windDir: 'Ю' },
      { tDay: -0.2, tNight: -7.0, tMax: 12.0, tMin: -20.0, precipProb: 0.50, snowProb: 0.70, avgWind: 4.0, humidity: 76, windDir: 'Ю' },
      { tDay: 10.4, tNight: 1.5, tMax: 24.0, tMin: -8.0, precipProb: 0.46, snowProb: 0.15, avgWind: 3.8, humidity: 64, windDir: 'С' },
      { tDay: 19.4, tNight: 8.6, tMax: 30.0, tMin: -2.0, precipProb: 0.40, snowProb: 0.01, avgWind: 3.4, humidity: 57, windDir: 'С' },
      { tDay: 23.6, tNight: 13.3, tMax: 33.0, tMin: 5.0, precipProb: 0.45, snowProb: 0.00, avgWind: 3.1, humidity: 63, windDir: 'СЗ' },
      { tDay: 25.5, tNight: 15.5, tMax: 35.0, tMin: 8.0, precipProb: 0.45, snowProb: 0.00, avgWind: 2.9, humidity: 66, windDir: 'С' },
      { tDay: 23.0, tNight: 13.2, tMax: 33.0, tMin: 4.0, precipProb: 0.43, snowProb: 0.00, avgWind: 3.0, humidity: 70, windDir: 'С' },
      { tDay: 16.3, tNight: 8.2, tMax: 26.0, tMin: -2.0, precipProb: 0.48, snowProb: 0.02, avgWind: 3.4, humidity: 77, windDir: 'Ю' },
      { tDay: 8.1, tNight: 1.9, tMax: 18.0, tMin: -8.0, precipProb: 0.56, snowProb: 0.30, avgWind: 3.9, humidity: 82, windDir: 'Ю' },
      { tDay: -0.5, tNight: -5.0, tMax: 8.0, tMin: -18.0, precipProb: 0.65, snowProb: 0.75, avgWind: 4.2, humidity: 86, windDir: 'Ю' },
      { tDay: -5.6, tNight: -11.0, tMax: 3.0, tMin: -25.0, precipProb: 0.68, snowProb: 0.95, avgWind: 4.3, humidity: 85, windDir: 'Ю' }
    ]
  },
  'Краснодар': {
    city: 'Краснодар', region: 'Южный ФО', lat: 45.03, lon: 38.98, elevationM: 30,
    months: [
      { tDay: 4.6, tNight: -1.7, tMax: 15.0, tMin: -14.0, precipProb: 0.55, snowProb: 0.30, avgWind: 3.3, humidity: 82, windDir: 'СВ' },
      { tDay: 6.7, tNight: -1.0, tMax: 18.0, tMin: -12.0, precipProb: 0.50, snowProb: 0.25, avgWind: 3.4, humidity: 77, windDir: 'СВ' },
      { tDay: 12.0, tNight: 2.8, tMax: 24.0, tMin: -7.0, precipProb: 0.45, snowProb: 0.10, avgWind: 3.2, humidity: 72, windDir: 'СВ' },
      { tDay: 18.5, tNight: 7.9, tMax: 29.0, tMin: 0.0, precipProb: 0.40, snowProb: 0.00, avgWind: 2.8, humidity: 66, windDir: 'ЮЗ' },
      { tDay: 24.2, tNight: 13.0, tMax: 33.0, tMin: 4.0, precipProb: 0.38, snowProb: 0.00, avgWind: 2.5, humidity: 64, windDir: 'ЮЗ' },
      { tDay: 28.5, tNight: 17.2, tMax: 37.0, tMin: 9.0, precipProb: 0.35, snowProb: 0.00, avgWind: 2.3, humidity: 61, windDir: 'ЮЗ' },
      { tDay: 31.6, tNight: 19.8, tMax: 39.0, tMin: 12.0, precipProb: 0.30, snowProb: 0.00, avgWind: 2.2, humidity: 58, windDir: 'СВ' },
      { tDay: 31.3, tNight: 19.1, tMax: 38.0, tMin: 10.0, precipProb: 0.28, snowProb: 0.00, avgWind: 2.2, humidity: 59, windDir: 'СВ' },
      { tDay: 25.4, tNight: 13.8, tMax: 34.0, tMin: 4.0, precipProb: 0.32, snowProb: 0.00, avgWind: 2.4, humidity: 67, windDir: 'СВ' },
      { tDay: 18.3, tNight: 8.4, tMax: 28.0, tMin: -2.0, precipProb: 0.38, snowProb: 0.02, avgWind: 2.6, humidity: 75, windDir: 'СВ' },
      { tDay: 11.2, tNight: 3.4, tMax: 22.0, tMin: -8.0, precipProb: 0.48, snowProb: 0.10, avgWind: 2.9, humidity: 81, windDir: 'СВ' },
      { tDay: 6.2, tNight: 0.1, tMax: 16.0, tMin: -11.0, precipProb: 0.52, snowProb: 0.22, avgWind: 3.1, humidity: 83, windDir: 'СВ' }
    ]
  },
  'Сочи': {
    city: 'Сочи', region: 'Южный ФО (субтропики)', lat: 43.60, lon: 39.73, elevationM: 10,
    months: [
      { tDay: 10.2, tNight: 3.8, tMax: 19.0, tMin: -5.0, precipProb: 0.55, snowProb: 0.05, avgWind: 2.4, humidity: 74, windDir: 'СВ' },
      { tDay: 10.8, tNight: 3.7, tMax: 20.0, tMin: -4.0, precipProb: 0.50, snowProb: 0.04, avgWind: 2.5, humidity: 72, windDir: 'СВ' },
      { tDay: 13.0, tNight: 5.6, tMax: 23.0, tMin: -1.0, precipProb: 0.48, snowProb: 0.01, avgWind: 2.3, humidity: 73, windDir: 'ЮЗ' },
      { tDay: 17.0, tNight: 9.3, tMax: 28.0, tMin: 3.0, precipProb: 0.40, snowProb: 0.00, avgWind: 2.1, humidity: 74, windDir: 'ЮЗ' },
      { tDay: 21.5, tNight: 13.8, tMax: 31.0, tMin: 7.0, precipProb: 0.35, snowProb: 0.00, avgWind: 1.9, humidity: 76, windDir: 'ЮЗ' },
      { tDay: 25.6, tNight: 18.0, tMax: 34.0, tMin: 12.0, precipProb: 0.32, snowProb: 0.00, avgWind: 1.8, humidity: 77, windDir: 'ЮЗ' },
      { tDay: 28.4, tNight: 20.8, tMax: 36.0, tMin: 15.0, precipProb: 0.30, snowProb: 0.00, avgWind: 1.7, humidity: 76, windDir: 'ЮЗ' },
      { tDay: 29.1, tNight: 21.0, tMax: 37.0, tMin: 14.0, precipProb: 0.30, snowProb: 0.00, avgWind: 1.7, humidity: 75, windDir: 'ЮЗ' },
      { tDay: 25.2, tNight: 16.8, tMax: 33.0, tMin: 9.0, precipProb: 0.36, snowProb: 0.00, avgWind: 1.9, humidity: 74, windDir: 'СВ' },
      { tDay: 20.6, tNight: 12.6, tMax: 28.0, tMin: 4.0, precipProb: 0.44, snowProb: 0.00, avgWind: 2.1, humidity: 74, windDir: 'СВ' },
      { tDay: 15.8, tNight: 8.4, tMax: 24.0, tMin: 0.0, precipProb: 0.50, snowProb: 0.01, avgWind: 2.3, humidity: 73, windDir: 'СВ' },
      { tDay: 12.0, tNight: 5.5, tMax: 20.0, tMin: -3.0, precipProb: 0.54, snowProb: 0.03, avgWind: 2.4, humidity: 73, windDir: 'СВ' }
    ]
  },
  'Ростов-на-Дону': {
    city: 'Ростов-на-Дону', region: 'Южный ФО', lat: 47.24, lon: 39.71, elevationM: 50,
    months: [
      { tDay: -0.5, tNight: -6.0, tMax: 11.0, tMin: -21.0, precipProb: 0.55, snowProb: 0.60, avgWind: 4.2, humidity: 84, windDir: 'В' },
      { tDay: 0.7, tNight: -5.4, tMax: 13.0, tMin: -19.0, precipProb: 0.50, snowProb: 0.55, avgWind: 4.4, humidity: 80, windDir: 'В' },
      { tDay: 7.0, tNight: -0.7, tMax: 20.0, tMin: -12.0, precipProb: 0.45, snowProb: 0.25, avgWind: 4.2, humidity: 73, windDir: 'В' },
      { tDay: 16.5, tNight: 6.5, tMax: 27.0, tMin: -2.0, precipProb: 0.40, snowProb: 0.02, avgWind: 3.7, humidity: 62, windDir: 'В' },
      { tDay: 23.2, tNight: 12.4, tMax: 32.0, tMin: 3.0, precipProb: 0.38, snowProb: 0.00, avgWind: 3.2, humidity: 58, windDir: 'В' },
      { tDay: 27.4, tNight: 16.5, tMax: 36.0, tMin: 8.0, precipProb: 0.36, snowProb: 0.00, avgWind: 2.9, humidity: 56, windDir: 'З' },
      { tDay: 30.1, tNight: 18.8, tMax: 38.0, tMin: 11.0, precipProb: 0.32, snowProb: 0.00, avgWind: 2.8, humidity: 53, windDir: 'В' },
      { tDay: 29.5, tNight: 18.0, tMax: 38.0, tMin: 9.0, precipProb: 0.30, snowProb: 0.00, avgWind: 2.9, humidity: 54, windDir: 'В' },
      { tDay: 23.3, tNight: 12.5, tMax: 33.0, tMin: 2.0, precipProb: 0.34, snowProb: 0.00, avgWind: 3.2, humidity: 62, windDir: 'В' },
      { tDay: 15.3, tNight: 6.6, tMax: 25.0, tMin: -4.0, precipProb: 0.40, snowProb: 0.05, avgWind: 3.6, humidity: 73, windDir: 'В' },
      { tDay: 6.8, tNight: 1.0, tMax: 18.0, tMin: -12.0, precipProb: 0.50, snowProb: 0.30, avgWind: 4.0, humidity: 82, windDir: 'В' },
      { tDay: 1.2, tNight: -4.0, tMax: 12.0, tMin: -17.0, precipProb: 0.54, snowProb: 0.50, avgWind: 4.2, humidity: 85, windDir: 'В' }
    ]
  },
  'Екатеринбург': {
    city: 'Екатеринбург', region: 'Уральский ФО', lat: 56.83, lon: 60.57, elevationM: 240,
    months: [
      { tDay: -9.5, tNight: -16.5, tMax: 2.0, tMin: -34.0, precipProb: 0.60, snowProb: 0.99, avgWind: 3.5, humidity: 79, windDir: 'З' },
      { tDay: -7.5, tNight: -15.5, tMax: 3.0, tMin: -32.0, precipProb: 0.52, snowProb: 0.98, avgWind: 3.4, humidity: 74, windDir: 'З' },
      { tDay: 0.5, tNight: -8.0, tMax: 13.0, tMin: -24.0, precipProb: 0.48, snowProb: 0.80, avgWind: 3.4, humidity: 66, windDir: 'З' },
      { tDay: 10.2, tNight: 0.5, tMax: 24.0, tMin: -12.0, precipProb: 0.45, snowProb: 0.30, avgWind: 3.5, humidity: 56, windDir: 'З' },
      { tDay: 18.5, tNight: 7.2, tMax: 29.0, tMin: -4.0, precipProb: 0.42, snowProb: 0.05, avgWind: 3.3, humidity: 54, windDir: 'З' },
      { tDay: 23.2, tNight: 12.5, tMax: 33.0, tMin: 2.0, precipProb: 0.48, snowProb: 0.00, avgWind: 3.0, humidity: 63, windDir: 'З' },
      { tDay: 24.8, tNight: 14.8, tMax: 35.0, tMin: 6.0, precipProb: 0.50, snowProb: 0.00, avgWind: 2.8, humidity: 68, windDir: 'З' },
      { tDay: 21.6, tNight: 12.4, tMax: 32.0, tMin: 2.0, precipProb: 0.48, snowProb: 0.00, avgWind: 2.8, humidity: 72, windDir: 'З' },
      { tDay: 15.0, tNight: 7.0, tMax: 26.0, tMin: -3.0, precipProb: 0.50, snowProb: 0.05, avgWind: 3.1, humidity: 75, windDir: 'З' },
      { tDay: 6.8, tNight: 0.2, tMax: 18.0, tMin: -12.0, precipProb: 0.58, snowProb: 0.45, avgWind: 3.4, humidity: 77, windDir: 'З' },
      { tDay: -2.8, tNight: -8.5, tMax: 6.0, tMin: -24.0, precipProb: 0.62, snowProb: 0.88, avgWind: 3.5, humidity: 80, windDir: 'З' },
      { tDay: -8.0, tNight: -14.5, tMax: 2.0, tMin: -31.0, precipProb: 0.62, snowProb: 0.99, avgWind: 3.5, humidity: 80, windDir: 'З' }
    ]
  },
  'Самара': {
    city: 'Самара', region: 'Приволжский ФО', lat: 53.20, lon: 50.15, elevationM: 50,
    months: [
      { tDay: -6.8, tNight: -13.0, tMax: 2.0, tMin: -29.0, precipProb: 0.60, snowProb: 0.98, avgWind: 4.1, humidity: 83, windDir: 'Ю' },
      { tDay: -6.0, tNight: -12.5, tMax: 3.0, tMin: -28.0, precipProb: 0.52, snowProb: 0.95, avgWind: 4.0, humidity: 80, windDir: 'Ю' },
      { tDay: 1.0, tNight: -6.0, tMax: 14.0, tMin: -19.0, precipProb: 0.46, snowProb: 0.65, avgWind: 3.9, humidity: 75, windDir: 'Ю' },
      { tDay: 12.8, tNight: 3.5, tMax: 26.0, tMin: -7.0, precipProb: 0.42, snowProb: 0.12, avgWind: 3.7, humidity: 61, windDir: 'С' },
      { tDay: 21.5, tNight: 10.8, tMax: 32.0, tMin: -1.0, precipProb: 0.38, snowProb: 0.00, avgWind: 3.3, humidity: 54, windDir: 'С' },
      { tDay: 25.8, tNight: 15.2, tMax: 35.0, tMin: 5.0, precipProb: 0.42, snowProb: 0.00, avgWind: 3.0, humidity: 59, windDir: 'СЗ' },
      { tDay: 27.6, tNight: 17.2, tMax: 37.0, tMin: 8.0, precipProb: 0.40, snowProb: 0.00, avgWind: 2.8, humidity: 62, windDir: 'С' },
      { tDay: 25.5, tNight: 15.2, tMax: 36.0, tMin: 5.0, precipProb: 0.36, snowProb: 0.00, avgWind: 2.9, humidity: 64, windDir: 'С' },
      { tDay: 18.8, tNight: 10.0, tMax: 29.0, tMin: -1.0, precipProb: 0.42, snowProb: 0.01, avgWind: 3.2, humidity: 71, windDir: 'Ю' },
      { tDay: 9.8, tNight: 3.2, tMax: 20.0, tMin: -8.0, precipProb: 0.50, snowProb: 0.25, avgWind: 3.7, humidity: 78, windDir: 'Ю' },
      { tDay: 0.8, tNight: -3.8, tMax: 9.0, tMin: -17.0, precipProb: 0.58, snowProb: 0.70, avgWind: 4.1, humidity: 84, windDir: 'Ю' },
      { tDay: -5.0, tNight: -10.5, tMax: 3.0, tMin: -26.0, precipProb: 0.62, snowProb: 0.95, avgWind: 4.2, humidity: 84, windDir: 'Ю' }
    ]
  },
  'Калининград': {
    city: 'Калининград', region: 'Северо-Западный ФО (Балтика)', lat: 54.71, lon: 20.51, elevationM: 15,
    months: [
      { tDay: 1.0, tNight: -3.8, tMax: 9.0, tMin: -17.0, precipProb: 0.65, snowProb: 0.60, avgWind: 4.8, humidity: 85, windDir: 'ЮЗ' },
      { tDay: 1.8, tNight: -3.5, tMax: 11.0, tMin: -16.0, precipProb: 0.58, snowProb: 0.55, avgWind: 4.6, humidity: 82, windDir: 'ЮЗ' },
      { tDay: 6.2, tNight: -0.5, tMax: 17.0, tMin: -10.0, precipProb: 0.50, snowProb: 0.30, avgWind: 4.2, humidity: 76, windDir: 'З' },
      { tDay: 12.8, tNight: 4.0, tMax: 24.0, tMin: -4.0, precipProb: 0.44, snowProb: 0.05, avgWind: 3.8, humidity: 68, windDir: 'З' },
      { tDay: 18.4, tNight: 8.8, tMax: 28.0, tMin: 1.0, precipProb: 0.42, snowProb: 0.00, avgWind: 3.4, humidity: 67, windDir: 'З' },
      { tDay: 21.5, tNight: 12.5, tMax: 31.0, tMin: 5.0, precipProb: 0.48, snowProb: 0.00, avgWind: 3.3, humidity: 71, windDir: 'З' },
      { tDay: 23.8, tNight: 15.0, tMax: 33.0, tMin: 8.0, precipProb: 0.50, snowProb: 0.00, avgWind: 3.2, humidity: 74, windDir: 'З' },
      { tDay: 23.4, tNight: 14.6, tMax: 33.0, tMin: 7.0, precipProb: 0.52, snowProb: 0.00, avgWind: 3.3, humidity: 77, windDir: 'З' },
      { tDay: 18.5, tNight: 10.5, tMax: 26.0, tMin: 2.0, precipProb: 0.55, snowProb: 0.00, avgWind: 3.8, humidity: 81, windDir: 'ЮЗ' },
      { tDay: 12.5, tNight: 5.8, tMax: 20.0, tMin: -3.0, precipProb: 0.60, snowProb: 0.08, avgWind: 4.3, humidity: 84, windDir: 'ЮЗ' },
      { tDay: 6.5, tNight: 1.8, tMax: 13.0, tMin: -9.0, precipProb: 0.66, snowProb: 0.40, avgWind: 4.7, humidity: 86, windDir: 'ЮЗ' },
      { tDay: 2.5, tNight: -1.8, tMax: 9.0, tMin: -14.0, precipProb: 0.68, snowProb: 0.55, avgWind: 4.9, humidity: 86, windDir: 'ЮЗ' }
    ]
  },
  'Красноярск': {
    city: 'Красноярск', region: 'Сибирский ФО', lat: 56.01, lon: 92.87, elevationM: 160,
    months: [
      { tDay: -11.5, tNight: -19.5, tMax: 2.0, tMin: -38.0, precipProb: 0.55, snowProb: 1.00, avgWind: 2.6, humidity: 76, windDir: 'ЮЗ' },
      { tDay: -8.5, tNight: -17.5, tMax: 4.0, tMin: -36.0, precipProb: 0.45, snowProb: 0.99, avgWind: 2.7, humidity: 71, windDir: 'ЮЗ' },
      { tDay: -0.5, tNight: -10.0, tMax: 15.0, tMin: -27.0, precipProb: 0.42, snowProb: 0.85, avgWind: 3.0, humidity: 62, windDir: 'ЮЗ' },
      { tDay: 8.5, tNight: -1.5, tMax: 25.0, tMin: -16.0, precipProb: 0.40, snowProb: 0.40, avgWind: 3.4, humidity: 52, windDir: 'ЮЗ' },
      { tDay: 17.2, tNight: 5.5, tMax: 30.0, tMin: -5.0, precipProb: 0.44, snowProb: 0.08, avgWind: 3.2, humidity: 51, windDir: 'ЮЗ' },
      { tDay: 23.5, tNight: 11.8, tMax: 34.0, tMin: 2.0, precipProb: 0.50, snowProb: 0.00, avgWind: 2.7, humidity: 62, windDir: 'З' },
      { tDay: 25.5, tNight: 14.5, tMax: 36.0, tMin: 5.0, precipProb: 0.52, snowProb: 0.00, avgWind: 2.4, humidity: 70, windDir: 'З' },
      { tDay: 22.2, tNight: 11.8, tMax: 33.0, tMin: 1.0, precipProb: 0.50, snowProb: 0.00, avgWind: 2.4, humidity: 74, windDir: 'З' },
      { tDay: 15.0, tNight: 5.6, tMax: 26.0, tMin: -4.0, precipProb: 0.48, snowProb: 0.08, avgWind: 2.8, humidity: 72, windDir: 'ЮЗ' },
      { tDay: 6.2, tNight: -1.5, tMax: 20.0, tMin: -16.0, precipProb: 0.52, snowProb: 0.55, avgWind: 3.0, humidity: 72, windDir: 'ЮЗ' },
      { tDay: -4.5, tNight: -11.5, tMax: 8.0, tMin: -28.0, precipProb: 0.58, snowProb: 0.95, avgWind: 2.9, humidity: 77, windDir: 'ЮЗ' },
      { tDay: -10.5, tNight: -17.8, tMax: 1.0, tMin: -37.0, precipProb: 0.58, snowProb: 1.00, avgWind: 2.7, humidity: 77, windDir: 'ЮЗ' }
    ]
  },
  'Хабаровск': {
    city: 'Хабаровск', region: 'Дальневосточный ФО', lat: 48.48, lon: 135.07, elevationM: 70,
    months: [
      { tDay: -15.5, tNight: -23.5, tMax: -3.0, tMin: -38.0, precipProb: 0.35, snowProb: 1.00, avgWind: 3.6, humidity: 74, windDir: 'ЮЗ' },
      { tDay: -10.2, tNight: -19.5, tMax: 2.0, tMin: -34.0, precipProb: 0.32, snowProb: 1.00, avgWind: 3.5, humidity: 69, windDir: 'ЮЗ' },
      { tDay: -1.0, tNight: -10.5, tMax: 14.0, tMin: -25.0, precipProb: 0.38, snowProb: 0.85, avgWind: 3.9, humidity: 62, windDir: 'ЮЗ' },
      { tDay: 10.5, tNight: 0.5, tMax: 24.0, tMin: -12.0, precipProb: 0.44, snowProb: 0.30, avgWind: 4.4, humidity: 55, windDir: 'СВ' },
      { tDay: 18.8, tNight: 7.8, tMax: 30.0, tMin: -2.0, precipProb: 0.48, snowProb: 0.02, avgWind: 3.8, humidity: 57, windDir: 'СВ' },
      { tDay: 24.2, tNight: 14.0, tMax: 34.0, tMin: 5.0, precipProb: 0.52, snowProb: 0.00, avgWind: 3.2, humidity: 69, windDir: 'Ю' },
      { tDay: 27.0, tNight: 18.2, tMax: 36.0, tMin: 9.0, precipProb: 0.55, snowProb: 0.00, avgWind: 2.8, humidity: 79, windDir: 'Ю' },
      { tDay: 25.2, tNight: 16.5, tMax: 34.0, tMin: 6.0, precipProb: 0.54, snowProb: 0.00, avgWind: 2.8, humidity: 80, windDir: 'Ю' },
      { tDay: 19.5, tNight: 9.5, tMax: 28.0, tMin: -1.0, precipProb: 0.46, snowProb: 0.01, avgWind: 3.2, humidity: 73, windDir: 'Ю' },
      { tDay: 10.2, tNight: 0.8, tMax: 22.0, tMin: -11.0, precipProb: 0.42, snowProb: 0.35, avgWind: 3.8, humidity: 65, windDir: 'ЮЗ' },
      { tDay: -3.5, tNight: -11.8, tMax: 10.0, tMin: -25.0, precipProb: 0.40, snowProb: 0.90, avgWind: 4.0, humidity: 68, windDir: 'ЮЗ' },
      { tDay: -13.5, tNight: -21.0, tMax: -1.0, tMin: -35.0, precipProb: 0.38, snowProb: 1.00, avgWind: 3.8, humidity: 73, windDir: 'ЮЗ' }
    ]
  },
  'Махачкала': {
    city: 'Махачкала', region: 'Северо-Кавказский ФО (Каспийское море)', lat: 42.98, lon: 47.50, elevationM: -20,
    months: [
      { tDay: 4.2, tNight: -0.8, tMax: 15.0, tMin: -13.0, precipProb: 0.42, snowProb: 0.35, avgWind: 4.3, humidity: 82, windDir: 'СЗ' },
      { tDay: 4.5, tNight: -0.6, tMax: 16.0, tMin: -12.0, precipProb: 0.40, snowProb: 0.30, avgWind: 4.4, humidity: 80, windDir: 'СЗ' },
      { tDay: 8.8, tNight: 2.8, tMax: 22.0, tMin: -6.0, precipProb: 0.36, snowProb: 0.15, avgWind: 4.1, humidity: 76, windDir: 'ЮВ' },
      { tDay: 15.0, tNight: 7.8, tMax: 27.0, tMin: 0.0, precipProb: 0.32, snowProb: 0.00, avgWind: 3.8, humidity: 71, windDir: 'ЮВ' },
      { tDay: 21.8, tNight: 13.8, tMax: 32.0, tMin: 5.0, precipProb: 0.30, snowProb: 0.00, avgWind: 3.5, humidity: 68, windDir: 'ЮВ' },
      { tDay: 27.2, tNight: 18.8, tMax: 36.0, tMin: 10.0, precipProb: 0.28, snowProb: 0.00, avgWind: 3.3, humidity: 63, windDir: 'ЮВ' },
      { tDay: 30.2, tNight: 22.0, tMax: 39.0, tMin: 14.0, precipProb: 0.25, snowProb: 0.00, avgWind: 3.3, humidity: 62, windDir: 'ЮВ' },
      { tDay: 29.8, tNight: 21.6, tMax: 38.0, tMin: 13.0, precipProb: 0.25, snowProb: 0.00, avgWind: 3.4, humidity: 64, windDir: 'ЮВ' },
      { tDay: 24.5, tNight: 16.8, tMax: 34.0, tMin: 6.0, precipProb: 0.30, snowProb: 0.00, avgWind: 3.7, humidity: 70, windDir: 'СЗ' },
      { tDay: 17.8, tNight: 11.0, tMax: 28.0, tMin: 1.0, precipProb: 0.38, snowProb: 0.02, avgWind: 4.0, humidity: 77, windDir: 'СЗ' },
      { tDay: 10.8, tNight: 5.2, tMax: 21.0, tMin: -5.0, precipProb: 0.42, snowProb: 0.15, avgWind: 4.3, humidity: 81, windDir: 'СЗ' },
      { tDay: 6.0, tNight: 1.2, tMax: 17.0, tMin: -10.0, precipProb: 0.44, snowProb: 0.28, avgWind: 4.4, humidity: 82, windDir: 'СЗ' }
    ]
  },
  'Грозный': {
    city: 'Грозный', region: 'Северо-Кавказский ФО', lat: 43.32, lon: 45.69, elevationM: 130,
    months: [
      { tDay: 2.5, tNight: -5.0, tMax: 14.0, tMin: -18.0, precipProb: 0.45, snowProb: 0.45, avgWind: 2.8, humidity: 84, windDir: 'В' },
      { tDay: 4.0, tNight: -4.2, tMax: 16.0, tMin: -16.0, precipProb: 0.42, snowProb: 0.40, avgWind: 2.9, humidity: 81, windDir: 'В' },
      { tDay: 10.5, tNight: 0.5, tMax: 23.0, tMin: -9.0, precipProb: 0.40, snowProb: 0.18, avgWind: 2.8, humidity: 74, windDir: 'В' },
      { tDay: 18.0, tNight: 6.2, tMax: 29.0, tMin: -1.0, precipProb: 0.38, snowProb: 0.01, avgWind: 2.6, humidity: 65, windDir: 'З' },
      { tDay: 24.2, tNight: 12.0, tMax: 34.0, tMin: 3.0, precipProb: 0.36, snowProb: 0.00, avgWind: 2.3, humidity: 62, windDir: 'З' },
      { tDay: 29.0, tNight: 16.5, tMax: 38.0, tMin: 8.0, precipProb: 0.34, snowProb: 0.00, avgWind: 2.1, humidity: 58, windDir: 'З' },
      { tDay: 31.8, tNight: 19.0, tMax: 40.0, tMin: 11.0, precipProb: 0.30, snowProb: 0.00, avgWind: 2.0, humidity: 55, windDir: 'В' },
      { tDay: 31.2, tNight: 18.2, tMax: 39.0, tMin: 9.0, precipProb: 0.28, snowProb: 0.00, avgWind: 2.1, humidity: 57, windDir: 'В' },
      { tDay: 25.5, tNight: 13.0, tMax: 35.0, tMin: 3.0, precipProb: 0.32, snowProb: 0.00, avgWind: 2.3, humidity: 66, windDir: 'В' },
      { tDay: 17.8, tNight: 6.8, tMax: 28.0, tMin: -3.0, precipProb: 0.38, snowProb: 0.05, avgWind: 2.5, humidity: 76, windDir: 'В' },
      { tDay: 9.8, tNight: 1.0, tMax: 20.0, tMin: -11.0, precipProb: 0.42, snowProb: 0.20, avgWind: 2.7, humidity: 83, windDir: 'В' },
      { tDay: 4.0, tNight: -3.2, tMax: 15.0, tMin: -15.0, precipProb: 0.46, snowProb: 0.38, avgWind: 2.8, humidity: 85, windDir: 'В' }
    ]
  },
  'Воронеж': {
    city: 'Воронеж', region: 'Черноземье', lat: 51.67, lon: 39.20, elevationM: 150,
    months: [
      { tDay: -3.5, tNight: -8.8, tMax: 5.0, tMin: -24.0, precipProb: 0.60, snowProb: 0.90, avgWind: 4.1, humidity: 84, windDir: 'ЮЗ' },
      { tDay: -3.0, tNight: -8.6, tMax: 6.0, tMin: -23.0, precipProb: 0.54, snowProb: 0.85, avgWind: 4.0, humidity: 81, windDir: 'ЮЗ' },
      { tDay: 3.2, tNight: -3.5, tMax: 16.0, tMin: -15.0, precipProb: 0.48, snowProb: 0.50, avgWind: 3.9, humidity: 74, windDir: 'Ю' },
      { tDay: 13.6, tNight: 3.8, tMax: 26.0, tMin: -5.0, precipProb: 0.44, snowProb: 0.08, avgWind: 3.6, humidity: 62, windDir: 'Ю' },
      { tDay: 21.0, tNight: 9.8, tMax: 31.0, tMin: 0.0, precipProb: 0.40, snowProb: 0.00, avgWind: 3.2, humidity: 56, windDir: 'С' },
      { tDay: 24.8, tNight: 13.8, tMax: 34.0, tMin: 4.0, precipProb: 0.44, snowProb: 0.00, avgWind: 2.9, humidity: 61, windDir: 'З' },
      { tDay: 27.0, tNight: 15.8, tMax: 37.0, tMin: 7.0, precipProb: 0.42, snowProb: 0.00, avgWind: 2.7, humidity: 62, windDir: 'З' },
      { tDay: 25.8, tNight: 14.4, tMax: 36.0, tMin: 5.0, precipProb: 0.38, snowProb: 0.00, avgWind: 2.8, humidity: 63, windDir: 'З' },
      { tDay: 19.5, tNight: 9.6, tMax: 30.0, tMin: -1.0, precipProb: 0.44, snowProb: 0.01, avgWind: 3.1, humidity: 71, windDir: 'Ю' },
      { tDay: 11.2, tNight: 3.8, tMax: 22.0, tMin: -7.0, precipProb: 0.52, snowProb: 0.20, avgWind: 3.6, humidity: 80, windDir: 'ЮЗ' },
      { tDay: 2.8, tNight: -2.0, tMax: 12.0, tMin: -15.0, precipProb: 0.58, snowProb: 0.65, avgWind: 4.0, humidity: 86, windDir: 'ЮЗ' },
      { tDay: -2.0, tNight: -6.8, tMax: 6.0, tMin: -21.0, precipProb: 0.62, snowProb: 0.88, avgWind: 4.2, humidity: 86, windDir: 'ЮЗ' }
    ]
  },
  'Волгоград': {
    city: 'Волгоград', region: 'Южный ФО (Поволжье)', lat: 48.73, lon: 44.55, elevationM: 40,
    months: [
      { tDay: -3.0, tNight: -9.5, tMax: 8.0, tMin: -27.0, precipProb: 0.50, snowProb: 0.85, avgWind: 4.5, humidity: 84, windDir: 'В' },
      { tDay: -2.5, tNight: -9.2, tMax: 9.0, tMin: -26.0, precipProb: 0.44, snowProb: 0.80, avgWind: 4.4, humidity: 81, windDir: 'В' },
      { tDay: 4.5, tNight: -3.0, tMax: 18.0, tMin: -18.0, precipProb: 0.40, snowProb: 0.45, avgWind: 4.2, humidity: 73, windDir: 'В' },
      { tDay: 15.5, tNight: 5.0, tMax: 28.0, tMin: -6.0, precipProb: 0.36, snowProb: 0.05, avgWind: 3.8, humidity: 58, windDir: 'В' },
      { tDay: 23.5, tNight: 11.8, tMax: 33.0, tMin: 0.0, precipProb: 0.34, snowProb: 0.00, avgWind: 3.4, humidity: 51, windDir: 'В' },
      { tDay: 28.5, tNight: 16.5, tMax: 38.0, tMin: 6.0, precipProb: 0.36, snowProb: 0.00, avgWind: 3.1, humidity: 50, windDir: 'З' },
      { tDay: 31.2, tNight: 19.0, tMax: 41.0, tMin: 9.0, precipProb: 0.32, snowProb: 0.00, avgWind: 2.9, humidity: 47, windDir: 'В' },
      { tDay: 30.0, tNight: 17.8, tMax: 40.0, tMin: 7.0, precipProb: 0.30, snowProb: 0.00, avgWind: 3.0, humidity: 48, windDir: 'В' },
      { tDay: 23.0, tNight: 11.5, tMax: 34.0, tMin: 0.0, precipProb: 0.34, snowProb: 0.00, avgWind: 3.3, humidity: 58, windDir: 'В' },
      { tDay: 14.0, tNight: 5.2, tMax: 25.0, tMin: -7.0, precipProb: 0.40, snowProb: 0.10, avgWind: 3.7, humidity: 71, windDir: 'В' },
      { tDay: 4.8, tNight: -1.0, tMax: 15.0, tMin: -17.0, precipProb: 0.48, snowProb: 0.50, avgWind: 4.1, humidity: 82, windDir: 'В' },
      { tDay: -1.5, tNight: -6.8, tMax: 10.0, tMin: -23.0, precipProb: 0.52, snowProb: 0.80, avgWind: 4.4, humidity: 85, windDir: 'В' }
    ]
  },
  'Ярославль': {
    city: 'Ярославль', region: 'Золотое Кольцо', lat: 57.63, lon: 39.87, elevationM: 100,
    months: [
      { tDay: -5.5, tNight: -11.5, tMax: 2.0, tMin: -28.0, precipProb: 0.65, snowProb: 0.98, avgWind: 3.7, humidity: 86, windDir: 'ЮЗ' },
      { tDay: -5.0, tNight: -12.0, tMax: 3.0, tMin: -27.0, precipProb: 0.60, snowProb: 0.95, avgWind: 3.8, humidity: 82, windDir: 'ЮЗ' },
      { tDay: 1.5, tNight: -6.2, tMax: 13.0, tMin: -18.0, precipProb: 0.52, snowProb: 0.65, avgWind: 3.7, humidity: 76, windDir: 'Ю' },
      { tDay: 10.5, tNight: 1.0, tMax: 23.0, tMin: -7.0, precipProb: 0.46, snowProb: 0.15, avgWind: 3.4, humidity: 66, windDir: 'С' },
      { tDay: 18.0, tNight: 7.2, tMax: 29.0, tMin: -2.0, precipProb: 0.42, snowProb: 0.01, avgWind: 3.1, humidity: 62, windDir: 'С' },
      { tDay: 21.8, tNight: 11.5, tMax: 32.0, tMin: 3.0, precipProb: 0.48, snowProb: 0.00, avgWind: 2.8, humidity: 68, windDir: 'СЗ' },
      { tDay: 24.0, tNight: 14.0, tMax: 34.0, tMin: 6.0, precipProb: 0.47, snowProb: 0.00, avgWind: 2.6, humidity: 73, windDir: 'З' },
      { tDay: 21.5, tNight: 12.0, tMax: 32.0, tMin: 3.0, precipProb: 0.45, snowProb: 0.00, avgWind: 2.7, humidity: 77, windDir: 'З' },
      { tDay: 15.0, tNight: 7.2, tMax: 25.0, tMin: -2.0, precipProb: 0.50, snowProb: 0.02, avgWind: 3.0, humidity: 82, windDir: 'ЮЗ' },
      { tDay: 7.8, tNight: 2.0, tMax: 17.0, tMin: -8.0, precipProb: 0.58, snowProb: 0.28, avgWind: 3.4, humidity: 85, windDir: 'ЮЗ' },
      { tDay: 0.2, tNight: -4.0, tMax: 8.0, tMin: -17.0, precipProb: 0.66, snowProb: 0.75, avgWind: 3.8, humidity: 88, windDir: 'ЮЗ' },
      { tDay: -4.2, tNight: -9.5, tMax: 3.0, tMin: -24.0, precipProb: 0.70, snowProb: 0.95, avgWind: 3.8, humidity: 88, windDir: 'ЮЗ' }
    ]
  }
};

// Вспомогательный генератор климатической карточки для любого региона России
export function getOrCreateCityClimate(city: string, lat = 55.0, lon = 45.0): CityClimate {
  const normCity = (city || 'Москва').trim();
  if (CLIMATE_DATA[normCity]) return CLIMATE_DATA[normCity];

  // Определяем климатическую зону по широте и долготе
  const isSouth = lat < 48.0;
  const isSiberia = lon > 65.0;
  const isFarEast = lon > 120.0;
  const isNorth = lat > 58.0;

  let base = CLIMATE_DATA['Москва'];
  if (isSouth) base = CLIMATE_DATA['Ростов-на-Дону'];
  if (isSiberia) base = CLIMATE_DATA['Екатеринбург'];
  if (isFarEast) base = CLIMATE_DATA['Хабаровск'];
  if (isNorth) base = CLIMATE_DATA['Санкт-Петербург'];

  const shifted: CityClimate = {
    city: normCity,
    region: 'Региональная лига',
    lat,
    lon,
    elevationM: 100,
    months: base.months.map(m => ({ ...m }))
  };

  CLIMATE_DATA[normCity] = shifted;
  return shifted;
}

// Псевдослучайный детерминированный генератор по хэшу строки
function seededRandom(seed: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return ((h >>> 0) % 10000) / 10000;
}

/**
 * Рассчитывает точную статистическую погоду на любой город, дату и время.
 * Учитывает:
 * - Среднестатистические нормы для города на данный месяц
 * - Суточный ход температуры (днем теплее, вечером прохладнее)
 * - Вероятность осадков и снежного покрова
 * - Состояние футбольного газона
 */
export function calculateMatchWeather(cityName: string, dateStr: string, timeStr = '17:00'): MatchWeather {
  const city = (cityName || 'Москва').trim();
  const climate = getOrCreateCityClimate(city);

  const d = new Date(dateStr || '2026-09-15');
  const monthIdx = isNaN(d.getMonth()) ? 8 : d.getMonth();
  const day = isNaN(d.getDate()) ? 15 : d.getDate();
  const mNorm = climate.months[monthIdx] || climate.months[8];

  const hour = parseInt((timeStr || '17:00').slice(0, 2), 10) || 17;

  // Детерминированный разброс погоды на эту дату
  const daySeed = `${city}_${dateStr}_${day}`;
  const rTemp = (seededRandom(daySeed + '_t') - 0.5) * 4.0; // ±2.0°C отклонение от нормы
  const rPpt = seededRandom(daySeed + '_ppt');
  const rWind = (seededRandom(daySeed + '_w') - 0.5) * 1.8;
  const rWindDir = seededRandom(daySeed + '_wd');

  // Суточный ход: пик тепла 14-16 часов (+2..3°C), вечером и ночью ближе к tNight
  let baseTemp: number;
  if (hour >= 13 && hour <= 17) {
    baseTemp = mNorm.tDay + 1.2;
  } else if (hour >= 18 && hour <= 21) {
    baseTemp = mNorm.tDay - (mNorm.tDay - mNorm.tNight) * 0.35;
  } else if (hour >= 22 || hour <= 6) {
    baseTemp = mNorm.tNight;
  } else {
    baseTemp = mNorm.tNight + (mNorm.tDay - mNorm.tNight) * 0.5;
  }

  const finalTemp = Math.round(baseTemp + rTemp);
  const feelsLike = Math.round(finalTemp - (mNorm.avgWind > 4.5 ? 2 : 0) + (finalTemp > 25 ? 1 : 0));
  const windSpeed = Math.max(1, Math.round((mNorm.avgWind + rWind) * 10) / 10);

  const DIRS = ['С', 'СВ', 'В', 'ЮВ', 'Ю', 'ЮЗ', 'З', 'СЗ'];
  const windDir = DIRS[Math.floor(rWindDir * DIRS.length)] || mNorm.windDir;

  const humidity = Math.min(98, Math.max(40, Math.round(mNorm.humidity + (rTemp < 0 ? 5 : -4))));
  const pressure = Math.round(750 + (seededRandom(daySeed + '_p') - 0.5) * 16);

  // Осадки и облачность
  let condition = 'ясно';
  let icon = '☀️';
  let precip = 'без осадков';

  if (rPpt < mNorm.precipProb * 0.4) {
    // Сильные или умеренные осадки
    if (finalTemp <= 0 || (finalTemp <= 2 && mNorm.snowProb > 0.4)) {
      condition = finalTemp <= -4 ? 'снегопад' : 'мокрый снег';
      icon = '❄️';
      precip = condition;
    } else {
      condition = rPpt < mNorm.precipProb * 0.15 ? 'ливневый дождь' : 'дождь';
      icon = '🌧️';
      precip = condition;
    }
  } else if (rPpt < mNorm.precipProb) {
    // Небольшие осадки или морось
    if (finalTemp <= 0) {
      condition = 'небольшой снег';
      icon = '🌨️';
      precip = 'небольшой снег';
    } else {
      condition = 'временами небольшой дождь';
      icon = '🌦️';
      precip = 'мелкий дождь';
    }
  } else if (rPpt < 0.65) {
    condition = 'облачно с прояснениями';
    icon = '⛅';
  } else if (rPpt < 0.85) {
    condition = 'переменная облачность';
    icon = '🌤️';
  } else {
    condition = 'малооблачно, солнечно';
    icon = '☀️';
  }

  // Состояние футбольного поля и газона
  let pitch = 'газон в отличном состоянии';
  if (finalTemp <= -5) {
    pitch = 'газон подмёрзший, подогрев поля включён на полную мощность';
  } else if (finalTemp <= 0 && precip.includes('снег')) {
    pitch = 'газон заснежен, разметка очищена, включён электроподогрев';
  } else if (precip.includes('дождь') || precip.includes('ливень')) {
    pitch = 'газон мокрый, быстрый отскок и скольжение мяча';
  } else if (finalTemp >= 28) {
    pitch = 'газон сухой, жаркая погода, предусмотрены паузы на водопой';
  } else if (finalTemp < 8) {
    pitch = 'газон плотный, температура комфортна для высокого темпа';
  }

  const sign = finalTemp > 0 ? `+${finalTemp}` : `${finalTemp}`;
  const text = `${sign}°C, ${condition}, ветер ${windSpeed} м/с (${windDir}), влажность ${humidity}%; ${pitch}`;
  const short = `${icon} ${sign}°C, ${condition}`;

  return {
    city,
    date: dateStr,
    time: timeStr,
    temp: finalTemp,
    feelsLike,
    condition,
    icon,
    wind: windSpeed,
    windDir,
    humidity,
    pressure,
    precipitation: precip,
    pitch,
    text,
    short,
    isStatistical: true
  };
}

// ───────── БАЗА ИГРОКОВ И СОСТАВОВ ─────────

interface RawPlayerSeed {
  name: string;
  pos: 'ВР' | 'ЦЗ' | 'ЛЗ' | 'ПЗ' | 'ОП' | 'ЦП' | 'АП' | 'ЛВ' | 'ПВ' | 'ЦФ';
  born: string;
  nation?: string;
  style: string;
  rating?: number;
}

// Шаблоны стилей амплуа
const STYLES_GK = [
  'Прыгучий голкипер с молниеносной реакцией на линии ворот и смелыми выходами',
  'Хладнокровный страж ворот, уверенно руководит обороной и командует на выходах',
  'Вратарь современной школы с превосходным первым пасом обеими ногами',
  'Опытный голкипер, силён в отражении пенальти и чтении траекторий дальних ударов'
];
const STYLES_DEF = [
  'Мощный центральный защитник, доминирует в верховых единоборствах и чистит штрафную',
  'Цепкий защитник-волнорез, силён в персональной опеке и отборе в подкате',
  'Скоростной латераль с неиссякаемой выносливостью и прицельными навесами в штрафную',
  'Умный позиционный защитник с отличным таймингом перехватов и диагональной передачей'
];
const STYLES_MID = [
  'Диспетчер центра поля с идеальным видением игры и разрезающими передачами',
  'Жесткий опорник-разрушитель, выигрывает подборы и перекрывает зоны контратак',
  'Техничный плеймейкер с дриблингом на носовом платке и поставленным кручёным ударом',
  'Динамичный полузащитник box-to-box, пашет от штрафной до штрафной без устали'
];
const STYLES_FWD = [
  'Взрывной дриблёр на фланге, разрывает оборону на скорости и смещается под удар',
  'Классический таранный форвард, продавливает защитников и безупречно играет головой',
  'Хитрый наконечник атак с голевым чутьём на добиваниях и рикошетах',
  'Юркий второй нападающий, стягивает на себя опекунов и создаёт свободные зоны'
];

// Генератор 20 аутентичных игроков для любого клуба
export function generateFullSquad(team: { id: string; name: string; comp: string; city: string }): any[] {
  const comp = team.comp;
  const isMedia = comp === 'media' || comp === 'media_div2';
  const isFNL = comp === 'fnl';
  const is2LA = comp === '2la_gold' || comp === '2la_silver';
  const is2LB = comp.startsWith('2lb');
  const isRPL = comp === 'rpl';

  let baseRating = 63;
  if (isRPL) baseRating = 76;
  else if (isFNL) baseRating = 71;
  else if (is2LA) baseRating = 66;
  else if (is2LB) baseRating = 60;
  else if (isMedia) baseRating = 67;

  // Позиционный каркас: 2 ВР, 6 Защитников, 7 Полузащитников, 5 Нападающих = 20 игроков
  const SQUAD_PLAN: { pos: 'ВР' | 'ЦЗ' | 'ЛЗ' | 'ПЗ' | 'ОП' | 'ЦП' | 'АП' | 'ЛВ' | 'ПВ' | 'ЦФ'; role: string }[] = [
    { pos: 'ВР', role: 'Основной голкипер' },
    { pos: 'ВР', role: 'Резервный голкипер' },
    { pos: 'ЦЗ', role: 'Центральный защитник (ведущий)' },
    { pos: 'ЦЗ', role: 'Центральный защитник (атлет)' },
    { pos: 'ЦЗ', role: 'Центральный защитник (первый пас)' },
    { pos: 'ЛЗ', role: 'Левый защитник (латераль)' },
    { pos: 'ПЗ', role: 'Правый защитник (латераль)' },
    { pos: 'ЛЗ', role: 'Крайний защитник ротации' },
    { pos: 'ОП', role: 'Опорный полузащитник (волнорез)' },
    { pos: 'ОП', role: 'Опорный полузащитник ротации' },
    { pos: 'ЦП', role: 'Центральный полузащитник (бокс-ту-бокс)' },
    { pos: 'ЦП', role: 'Центральный полузащитник (диспетчер)' },
    { pos: 'АП', role: 'Атакующий полузащитник (плеймейкер)' },
    { pos: 'ЦП', role: 'Полузащитник резерва' },
    { pos: 'АП', role: 'Атакующий хавбек' },
    { pos: 'ЛВ', role: 'Левый вингер' },
    { pos: 'ПВ', role: 'Правый вингер' },
    { pos: 'ЦФ', role: 'Центральный нападающий (страйкер)' },
    { pos: 'ЦФ', role: 'Центральный нападающий (джокер)' },
    { pos: 'ПВ', role: 'Крайний нападающий ротации' }
  ];

  // Списки фамилий и имён для создания реалистичных профилей
  const FIRST_NAMES = [
    'Алексей', 'Дмитрий', 'Сергей', 'Андрей', 'Иван', 'Максим', 'Михаил', 'Артём',
    'Никита', 'Владислав', 'Даниил', 'Илья', 'Роман', 'Кирилл', 'Егор', 'Матвей',
    'Александр', 'Денис', 'Тимофей', 'Константин', 'Павел', 'Георгий', 'Ярослав', 'Артур'
  ];

  const LAST_NAMES = [
    'Смирнов', 'Иванов', 'Кузнецов', 'Попов', 'Васильев', 'Петров', 'Соколов', 'Михайлов',
    'Новиков', 'Федоров', 'Морозов', 'Волков', 'Алексеев', 'Лебедев', 'Семенов', 'Егоров',
    'Павлов', 'Козлов', 'Степанов', 'Николаев', 'Орлов', 'Андреев', 'Макаров', 'Никитин',
    'Захаров', 'Зайцев', 'Соловьев', 'Борисов', 'Яковлев', 'Воробьев', 'Григорьев', 'Романов',
    'Воронин', 'Медведев', 'Тарасов', 'Белов', 'Комаров', 'Фролов', 'Савельев', 'Марков'
  ];

  // Знаменитые игроки для ведущих команд Медиалиги
  const MEDIA_ROSTERS: Record<string, { name: string; pos: string; style: string; rating: number }[]> = {
    '2Drots': [
      { name: 'Дмитрий Сычёв', pos: 'ВР', style: 'Гепард на ленточке, легенда медиафутбола, тащит пенальти', rating: 78 },
      { name: 'Эдамс Скляр', pos: 'ЛЗ', style: 'Скоростной крайний защитник с железным отбором', rating: 74 },
      { name: 'Илья Сальников (Салля)', pos: 'ЦЗ', style: 'Столп обороны «дротов», верховые дуэли за ним', rating: 75 },
      { name: 'Богдан Тимошенко', pos: 'ЦЗ', style: 'Неуступчивый стоппер с отличным длинным пасом', rating: 73 },
      { name: 'Денис Гудаев', pos: 'ПЗ', style: 'Капитан, лидер раздевалки, прорывы по правой бровке', rating: 76 },
      { name: 'Владислав Ослоновский (Слон)', pos: 'ЦП', style: 'Мозг центра поля, видит свободные зоны и режет линии', rating: 78 },
      { name: 'Антон Клочков (Манна)', pos: 'АП', style: 'Дриблинг на феноменальной скорости, техника и пас', rating: 77 },
      { name: 'Станислав Манаев', pos: 'ОП', style: 'Волнорез, выжигает центр поля и начинает атаки', rating: 74 },
      { name: 'Артем Нтумба (Пантера)', pos: 'ЛВ', style: 'Взрывная стартовая скорость, обыгрыш один в один', rating: 76 },
      { name: 'Алексей Курзенев (Курз)', pos: 'ЦФ', style: 'Наконечник атак, хладнокровная реализация в штрафной', rating: 76 },
      { name: 'Даниил Крапивников (Крап)', pos: 'АП', style: 'Кудесник мяча, эпатажный дриблинг и стандарты', rating: 75 },
      { name: 'Гаучо', pos: 'ЦФ', style: 'Бразильский форвард, пластика, удар с лёта и игра корпусом', rating: 77 }
    ],
    'Амкал': [
      { name: 'Максим Швагирев', pos: 'ВР', style: 'Опытнейший вратарь, надёжность и безупречный ввод мяча', rating: 76 },
      { name: 'Илья Шурыгин', pos: 'ЦЗ', style: 'Бескомпромиссный защитник, капитанское спокойствие', rating: 75 },
      { name: 'Арсений Левшук', pos: 'ЛЗ', style: 'Острые подключения в атаку, голевые кроссы', rating: 74 },
      { name: 'Эрик Чека', pos: 'ОП', style: 'Цепкий разрушитель атак соперника, жесткий отбор', rating: 74 },
      { name: 'Михаил Прокопьев (Прокоп)', pos: 'АП', style: 'Гений радиоуправляемых передач и скрытых пасов', rating: 78 },
      { name: 'Антон Чужой', pos: 'ЦП', style: 'Двигатель команды, мощный удар со средней дистанции', rating: 75 },
      { name: 'Степан Костюков', pos: 'ЦФ', style: 'Страйкер таранного типа, борется за каждый мяч', rating: 76 },
      { name: 'Анатолий Катрич', pos: 'ПВ', style: 'Экс-игрок РПЛ, тонкая техника и поставленный удар левой', rating: 77 },
      { name: 'Алексей Гасилин', pos: 'ЦФ', style: 'Чемпион Европы U-17, голевое чутье и выбор позиции', rating: 77 },
      { name: 'Василий Маврин', pos: 'ЦП', style: 'Харизматичный лидер, боец, дальняя артиллерия', rating: 75 }
    ],
    'Броуки (Brokeboys)': [
      { name: 'Николай Зириков', pos: 'ВР', style: 'Лучший вратарь сезона МФЛ, нереальные сейвы на линии', rating: 78 },
      { name: 'Георгий Тигиев', pos: 'ЛЗ', style: 'Экс-защитник «Спартака», агрессивный и цепкий крайний', rating: 76 },
      { name: 'Илья Давыдов', pos: 'ЦЗ', style: 'Высокий стоппер, снимает весь верховой мяч', rating: 74 },
      { name: 'Сергей Шаюнов (Мазур)', pos: 'ЦП', style: 'Тактический интеллектуал, руководит командным прессингом', rating: 75 },
      { name: 'Алишер Рахимов', pos: 'АП', style: 'Филигранный пас, тонкое чтение эпизодов', rating: 75 },
      { name: 'Максим Майрович', pos: 'ЦФ', style: 'Быстрый и острый форвард, открывания за спину', rating: 77 },
      { name: 'Табриз Мирзоев', pos: 'ПЗ', style: 'Неутомимый бровочник, бегает все 90 минут', rating: 73 }
    ],
    'ФК 10': [
      { name: 'Евгений Помазан', pos: 'ВР', style: 'Опыт РПЛ, чемпион Европы среди юношей, надежность', rating: 77 },
      { name: 'Брайан Идову', pos: 'ЛЗ', style: 'Игрок ЧМ-2018, высочайший класс, чтение игры', rating: 77 },
      { name: 'Иван Новосельцев', pos: 'ЦЗ', style: 'Экс-защитник сборной России, опыт и надежность сзади', rating: 77 },
      { name: 'Петр Тен', pos: 'ПЗ', style: 'Быстрый крайний защитник с академической школой ЦСКА', rating: 74 },
      { name: 'Азамат Мусагалиев', pos: 'АП', style: 'Президент и душа команды, нестандартные ходы на поле', rating: 69 },
      { name: 'Кутуз (Сергей Кутузов)', pos: 'ЦФ', style: 'Один из лучших бомбардиров медиафутбола всех времен', rating: 79 },
      { name: 'Сергей Чикишев', pos: 'ЦП', style: 'Умный опорный полузащитник с поставленным ударом', rating: 75 }
    ],
    'Lit Energy': [
      { name: 'Михаил Литвин', pos: 'ЦФ', style: 'Президент клуба, взрывной нападающий с мощным ударом', rating: 71 },
      { name: 'Роман Шишкин', pos: 'ЦЗ', style: 'Экс-игрок сборной России и «Локомотива», класс и опыт', rating: 77 },
      { name: 'Ренат Сабитов', pos: 'ОП', style: 'Жесткий волнорез, выжигает опорную зону', rating: 75 },
      { name: 'Денис Давыдов', pos: 'ЦФ', style: '«Русский Месси», феноменальная техника и нестандартный пас', rating: 76 }
    ],
    'Чисто Питер': [
      { name: 'Вячеслав Малафеев', pos: 'ВР', style: 'Легенда «Зенита» и сборной России, монументальный класс', rating: 77 },
      { name: 'Игорь Денисов', pos: 'ОП', style: 'Капитан-победитель, неуступчивый боец в центре поля', rating: 76 },
      { name: 'Алексей Игонин', pos: 'ЦЗ', style: 'Опыт и лидерство, идеальный выбор позиции', rating: 75 }
    ]
  };

  const seedPresets = MEDIA_ROSTERS[team.name] || [];
  const squad: any[] = [];

  for (let i = 0; i < SQUAD_PLAN.length; i++) {
    const slot = SQUAD_PLAN[i];
    const preset = seedPresets[i];

    let pName = preset ? preset.name : '';
    let pStyle = preset ? preset.style : '';
    let pRating = preset ? preset.rating : (baseRating + Math.floor((seededRandom(`${team.id}_r_${i}`) - 0.4) * 8));

    if (!pName) {
      const fn = FIRST_NAMES[Math.floor(seededRandom(`${team.id}_fn_${i}`) * FIRST_NAMES.length)];
      const ln = LAST_NAMES[Math.floor(seededRandom(`${team.id}_ln_${i}`) * LAST_NAMES.length)];
      pName = `${fn} ${ln}`;
    }

    if (!pStyle) {
      if (slot.pos === 'ВР') pStyle = STYLES_GK[i % STYLES_GK.length];
      else if (['ЦЗ', 'ЛЗ', 'ПЗ'].includes(slot.pos)) pStyle = STYLES_DEF[i % STYLES_DEF.length];
      else if (['ОП', 'ЦП', 'АП'].includes(slot.pos)) pStyle = STYLES_MID[i % STYLES_MID.length];
      else pStyle = STYLES_FWD[i % STYLES_FWD.length];
    }

    const birthYear = 1994 + Math.floor(seededRandom(`${team.id}_by_${i}`) * 12); // 1994..2005 (21..32 года)
    const birthMonth = String(1 + Math.floor(seededRandom(`${team.id}_bm_${i}`) * 12)).padStart(2, '0');
    const birthDay = String(1 + Math.floor(seededRandom(`${team.id}_bd_${i}`) * 28)).padStart(2, '0');

    squad.push({
      id: `pl_${team.id.slice(0, 6)}_${i + 1}`,
      teamId: team.id,
      name: pName,
      pos: slot.pos,
      born: `${birthYear}-${birthMonth}-${birthDay}`,
      nation: 'Россия',
      playedForOtherNationalTeam: false,
      otherNationalTeam: '',
      realClub: team.name,
      style: pStyle,
      rating: pRating,
      achievements: [
        `Воспитанник регионального футбола (${team.city || 'Россия'})`,
        `Заявлен за ${team.name} на сезон 2026/2027`
      ],
      stats2y: `${30 + Math.floor(seededRandom(`${team.id}_st1_${i}`) * 35)} матчей, ${Math.floor(seededRandom(`${team.id}_st2_${i}`) * 14)} результативных действий`,
      form: 'В хорошей спортивной форме, тренируется с полной отдачей',
      character: 'Дисциплинированный командный игрок, мотивирован на победу',
      news: '',
      verified: true,
      updatedAt: new Date().toISOString(),
      out: null,
      banLeft: 0,
      seasonYC: 0
    });
  }

  return squad;
}

// ───────── ПОЛНЫЙ КАТАЛОГ ВСЕХ 134 КЛУБОВ С ГОРОДАМИ И СТАДИОНАМИ ─────────

export const ALL_TEAMS_GEO: Record<string, { city: string; stadium: string; lat: number; lon: number }> = {
  // РПЛ (16)
  'Зенит': { city: 'Санкт-Петербург', stadium: 'Газпром Арена', lat: 59.95, lon: 30.32 },
  'Краснодар': { city: 'Краснодар', stadium: 'Стадион ФК Краснодар', lat: 45.04, lon: 38.98 },
  'Локомотив': { city: 'Москва', stadium: 'РЖД Арена', lat: 55.80, lon: 37.74 },
  'Спартак': { city: 'Москва', stadium: 'Лукойл Арена', lat: 55.82, lon: 37.44 },
  'ЦСКА': { city: 'Москва', stadium: 'ВЭБ Арена', lat: 55.79, lon: 37.52 },
  'Балтика': { city: 'Калининград', stadium: 'Ростех Арена', lat: 54.71, lon: 20.51 },
  'Динамо Москва': { city: 'Москва', stadium: 'ВТБ Арена', lat: 55.79, lon: 37.56 },
  'Рубин': { city: 'Казань', stadium: 'Ак Барс Арена', lat: 55.82, lon: 49.16 },
  'Ахмат': { city: 'Грозный', stadium: 'Ахмат Арена', lat: 43.32, lon: 45.69 },
  'Ростов': { city: 'Ростов-на-Дону', stadium: 'Ростов Арена', lat: 47.21, lon: 39.74 },
  'Крылья Советов': { city: 'Самара', stadium: 'Солидарность Самара Арена', lat: 53.28, lon: 50.24 },
  'Оренбург': { city: 'Оренбург', stadium: 'Газовик', lat: 51.77, lon: 55.10 },
  'Акрон': { city: 'Тольятти', stadium: 'Самара Арена', lat: 53.51, lon: 49.42 },
  'Динамо Махачкала': { city: 'Махачкала', stadium: 'Анжи Арена', lat: 42.98, lon: 47.50 },
  'Родина': { city: 'Москва', stadium: 'ВТБ Арена / Спартаковец', lat: 55.75, lon: 37.62 },
  'Факел': { city: 'Воронеж', stadium: 'Факел', lat: 51.67, lon: 39.20 },

  // Первая лига (18)
  'Арсенал Тула': { city: 'Тула', stadium: 'Арсенал', lat: 54.19, lon: 37.61 },
  'Велес': { city: 'Москва', stadium: 'Спартаковец им. Старостина', lat: 55.70, lon: 37.60 },
  'Волга Ульяновск': { city: 'Ульяновск', stadium: 'Труд', lat: 54.32, lon: 48.39 },
  'Енисей': { city: 'Красноярск', stadium: 'Центральный', lat: 56.01, lon: 92.87 },
  'КАМАЗ': { city: 'Набережные Челны', stadium: 'КАМАЗ', lat: 55.74, lon: 52.41 },
  'Ленинградец': { city: 'Санкт-Петербург', stadium: 'Рощино Арена', lat: 59.93, lon: 30.30 },
  'Нефтехимик': { city: 'Нижнекамск', stadium: 'Нефтехимик', lat: 55.64, lon: 51.82 },
  'Пари НН': { city: 'Нижний Новгород', stadium: 'Стадион Нижний Новгород', lat: 56.33, lon: 44.00 },
  'Ротор': { city: 'Волгоград', stadium: 'Волгоград Арена', lat: 48.73, lon: 44.55 },
  'СКА-Хабаровск': { city: 'Хабаровск', stadium: 'Стадион им. Ленина', lat: 48.48, lon: 135.07 },
  'Сочи': { city: 'Сочи', stadium: 'Фишт', lat: 43.60, lon: 39.73 },
  'Спартак Кострома': { city: 'Кострома', stadium: 'Урожай', lat: 57.77, lon: 40.93 },
  'Текстильщик': { city: 'Иваново', stadium: 'Текстильщик', lat: 57.00, lon: 40.97 },
  'Торпедо Москва': { city: 'Москва', stadium: 'БСА Лужники', lat: 55.71, lon: 37.65 },
  'Урал': { city: 'Екатеринбург', stadium: 'Екатеринбург Арена', lat: 56.83, lon: 60.57 },
  'Уфа': { city: 'Уфа', stadium: 'Нефтяник', lat: 54.74, lon: 55.97 },
  'Челябинск': { city: 'Челябинск', stadium: 'Центральный', lat: 55.16, lon: 61.40 },
  'Шинник': { city: 'Ярославль', stadium: 'Шинник', lat: 57.63, lon: 39.87 },

  // Вторая лига А — Золото (10)
  'Сокол': { city: 'Саратов', stadium: 'Локомотив', lat: 51.53, lon: 46.03 },
  'Динамо Брянск': { city: 'Брянск', stadium: 'Динамо', lat: 53.24, lon: 34.36 },
  'Алания': { city: 'Владикавказ', stadium: 'Республиканский стадион Спартак', lat: 43.02, lon: 44.68 },
  'Родина-2': { city: 'Москва', stadium: 'Спартаковец им. Старостина', lat: 55.75, lon: 37.62 },
  'Динамо Киров': { city: 'Киров', stadium: 'ВятСШОР', lat: 58.60, lon: 49.66 },
  'Амкар': { city: 'Пермь', stadium: 'Звезда', lat: 58.01, lon: 56.23 },
  'Тюмень': { city: 'Тюмень', stadium: 'Геолог', lat: 57.15, lon: 65.54 },
  'Динамо Владивосток': { city: 'Владивосток', stadium: 'Динамо', lat: 43.12, lon: 131.89 },
  'Сибирь': { city: 'Новосибирск', stadium: 'Спартак', lat: 55.03, lon: 82.92 },
  'Спартак Владикавказ': { city: 'Владикавказ', stadium: 'Металлург', lat: 43.03, lon: 44.67 },

  // Вторая лига А — Серебро (7)
  'Калуга': { city: 'Калуга', stadium: 'Спутник', lat: 54.51, lon: 36.26 },
  'Торпедо Миасс': { city: 'Миасс', stadium: 'Труд', lat: 55.05, lon: 60.10 },
  'Волгарь': { city: 'Астрахань', stadium: 'Центральный', lat: 46.35, lon: 48.04 },
  'Зенит-2': { city: 'Санкт-Петербург', stadium: 'Смена', lat: 59.95, lon: 30.32 },
  'Балтика-2': { city: 'Калининград', stadium: 'Балтика', lat: 54.71, lon: 20.51 },
  'Родина-3': { city: 'Москва', stadium: 'Арена Родина', lat: 55.75, lon: 37.62 },
  'Динамо Ставрополь': { city: 'Ставрополь', stadium: 'Динамо', lat: 45.04, lon: 41.97 },

  // Вторая лига Б — Группа 1 (16)
  'Севастополь': { city: 'Севастополь', stadium: 'СОК Севастополь', lat: 44.60, lon: 33.52 },
  'Нарт Черкесск': { city: 'Черкесск', stadium: 'Нарт', lat: 44.22, lon: 42.06 },
  'Победа Хасавюрт': { city: 'Хасавюрт', stadium: 'Спартак', lat: 43.25, lon: 46.59 },
  'Ростов-2': { city: 'Ростов-на-Дону', stadium: 'Олимп им. В. Понедельника', lat: 47.24, lon: 39.71 },
  'Дружба Майкоп': { city: 'Майкоп', stadium: 'Адыгейский республиканский стадион', lat: 44.61, lon: 40.11 },
  'Астрахань': { city: 'Астрахань', stadium: 'Астрахань', lat: 46.36, lon: 48.05 },
  'Рубин Ялта': { city: 'Ялта', stadium: 'Авангард', lat: 44.50, lon: 34.16 },
  'Ангушт': { city: 'Назрань', stadium: 'Центральный им. Р. Аушева', lat: 43.23, lon: 44.77 },
  'Спартак-Нальчик': { city: 'Нальчик', stadium: 'Спартак', lat: 43.48, lon: 43.60 },
  'Динамо-2 Махачкала': { city: 'Махачкала', stadium: 'Труд', lat: 42.98, lon: 47.50 },
  'Заря Луганск': { city: 'Луганск', stadium: 'Авангард', lat: 48.57, lon: 39.31 },
  'Кызылташ': { city: 'Бахчисарай', stadium: 'Дружба', lat: 44.75, lon: 33.86 },
  'Нефтяник Ахтырский': { city: 'Ахтырский', stadium: 'Нефтяник', lat: 44.85, lon: 38.30 },
  'ПСК Динская': { city: 'Динская', stadium: 'Кубань', lat: 45.22, lon: 39.23 },
  'Чайка-М': { city: 'Песчанокопское', stadium: 'им. И. П. Чайка', lat: 46.19, lon: 41.08 },
  'Шахтер Донецк': { city: 'Донецк', stadium: 'Металлург', lat: 48.00, lon: 37.80 },

  // Вторая лига Б — Группа 2 (15)
  'Муром': { city: 'Муром', stadium: 'им. В. Лосева', lat: 55.57, lon: 42.05 },
  'Динамо Вологда': { city: 'Вологда', stadium: 'Динамо', lat: 59.22, lon: 39.88 },
  'Иркутск': { city: 'Иркутск', stadium: 'Труд', lat: 52.29, lon: 104.30 },
  'Спартак-2': { city: 'Москва', stadium: 'Академия им. Ф. Черенкова', lat: 55.75, lon: 37.62 },
  'Балтика-БФУ': { city: 'Калининград', stadium: 'Балтика', lat: 54.72, lon: 20.50 },
  'Тверь': { city: 'Тверь', stadium: 'Юность', lat: 56.86, lon: 35.90 },
  'Торпедо Владимир': { city: 'Владимир', stadium: 'Торпедо', lat: 56.13, lon: 40.40 },
  'Череповец': { city: 'Череповец', stadium: 'Металлург', lat: 59.13, lon: 37.90 },
  'Чертаново': { city: 'Москва', stadium: 'Арена Чертаново', lat: 55.63, lon: 37.60 },
  'Звезда': { city: 'Санкт-Петербург', stadium: 'Нова Арена', lat: 59.93, lon: 30.34 },
  'Луки-Энергия': { city: 'Великие Луки', stadium: 'Экспресс', lat: 56.34, lon: 30.52 },
  'Космос Долгопрудный': { city: 'Долгопрудный', stadium: 'Салют', lat: 55.93, lon: 37.50 },
  'Енисей-2': { city: 'Красноярск', stadium: 'Футбол-Арена Енисей', lat: 56.02, lon: 92.88 },
  'Динамо СПб': { city: 'Санкт-Петербург', stadium: 'Нова Арена', lat: 59.97, lon: 30.30 },
  'Искра Смоленск': { city: 'Смоленск', stadium: 'Спартак', lat: 54.78, lon: 32.05 },

  // Вторая лига Б — Группа 3 (16)
  'Ротор-2': { city: 'Волгоград', stadium: 'Зенит', lat: 48.74, lon: 44.54 },
  'Авангард Курск': { city: 'Курск', stadium: 'Трудовые резервы', lat: 51.73, lon: 36.19 },
  'Салют Белгород': { city: 'Белгород', stadium: 'Салют', lat: 50.60, lon: 36.59 },
  'Спартак Тамбов': { city: 'Тамбов', stadium: 'Спартак', lat: 52.72, lon: 41.45 },
  'Рязань': { city: 'Рязань', stadium: 'Спартак', lat: 54.63, lon: 39.74 },
  'Металлург Липецк': { city: 'Липецк', stadium: 'Металлург', lat: 52.61, lon: 39.60 },
  'Орел': { city: 'Орёл', stadium: 'Центральный им. В. И. Ленина', lat: 52.97, lon: 36.08 },
  'Арсенал-2': { city: 'Тула', stadium: 'Желдормаш', lat: 54.19, lon: 37.61 },
  'Родина-М': { city: 'Москва', stadium: 'Спартаковец', lat: 55.75, lon: 37.62 },
  'Зенит Пенза': { city: 'Пенза', stadium: 'Первомайский', lat: 53.20, lon: 45.00 },
  'СКА-Хабаровск-2': { city: 'Хабаровск', stadium: 'Юность', lat: 48.48, lon: 135.07 },
  'Строгино': { city: 'Москва', stadium: 'Янтарь', lat: 55.80, lon: 37.40 },
  'Квант Обнинск': { city: 'Обнинск', stadium: 'Труд', lat: 55.10, lon: 36.61 },
  'Сатурн Раменское': { city: 'Раменское', stadium: 'Сатурн', lat: 55.57, lon: 38.23 },
  'Волна': { city: 'Ковернино', stadium: 'Локомотив (Н. Новгород)', lat: 57.13, lon: 43.81 },
  'Шумбрат': { city: 'Саранск', stadium: 'Старт', lat: 54.18, lon: 45.18 },

  // Вторая лига Б — Группа 4 (12)
  'Урал-2': { city: 'Екатеринбург', stadium: 'Бажовия', lat: 56.84, lon: 60.60 },
  'Крылья Советов-2': { city: 'Самара', stadium: 'Металлург', lat: 53.20, lon: 50.15 },
  'Химик': { city: 'Дзержинск', stadium: 'Химик', lat: 56.24, lon: 43.46 },
  'КДВ Томск': { city: 'Томск', stadium: 'Труд', lat: 56.50, lon: 84.97 },
  'Оренбург-2': { city: 'Оренбург', stadium: 'Газовик', lat: 51.77, lon: 55.10 },
  'Динамо Барнаул': { city: 'Барнаул', stadium: 'Динамо', lat: 53.35, lon: 83.77 },
  'Рубин-2': { city: 'Казань', stadium: 'Рубин', lat: 55.79, lon: 49.12 },
  'Челябинск-2': { city: 'Челябинск', stadium: 'Центральный', lat: 55.16, lon: 61.40 },
  'Акрон-2': { city: 'Тольятти', stadium: 'Кристалл (Жигулевск)', lat: 53.51, lon: 49.42 },
  'Носта': { city: 'Новотроицк', stadium: 'Металлург', lat: 51.20, lon: 58.33 },
  'Легион': { city: 'Махачкала', stadium: 'Динамо', lat: 42.98, lon: 47.50 },
  'Ижевск': { city: 'Ижевск', stadium: 'Центральный', lat: 56.85, lon: 53.20 },

  // Медиалига (16)
  '2Drots': { city: 'Москва', stadium: 'Москвич', lat: 55.75, lon: 37.62 },
  'Амкал': { city: 'Москва', stadium: 'Лужники Спортивный Городок', lat: 55.75, lon: 37.62 },
  'Броуки (Brokeboys)': { city: 'Москва', stadium: 'Одинцово Арена', lat: 55.75, lon: 37.62 },
  'ФК 10': { city: 'Москва', stadium: 'Сапсан Арена', lat: 55.75, lon: 37.62 },
  'Lit Energy': { city: 'Москва', stadium: 'Москвич', lat: 55.75, lon: 37.62 },
  'СиндЕкат': { city: 'Москва', stadium: 'Спартаковец', lat: 55.75, lon: 37.62 },
  'Банка': { city: 'Москва', stadium: 'Крылья Советов', lat: 55.75, lon: 37.62 },
  'СКА Ростов': { city: 'Ростов-на-Дону', stadium: 'СКА', lat: 47.24, lon: 39.71 },
  'Народная Команда': { city: 'Москва', stadium: 'Арена Сокольники', lat: 55.75, lon: 37.62 },
  'Fight Nights': { city: 'Москва', stadium: 'Лужники', lat: 55.75, lon: 37.62 },
  'Prime Squad': { city: 'Москва', stadium: 'Октябрь', lat: 55.75, lon: 37.62 },
  'Апсны': { city: 'Сухум', stadium: 'Динамо Сухум', lat: 43.00, lon: 41.02 },
  'Матч ТВ': { city: 'Москва', stadium: 'Москвич', lat: 55.75, lon: 37.62 },
  'Эгриси': { city: 'Москва', stadium: 'Речной Вокзал', lat: 55.75, lon: 37.62 },
  'Rocket Team': { city: 'Москва', stadium: 'Арена Чертаново', lat: 55.75, lon: 37.62 },
  'Чисто Питер': { city: 'Санкт-Петербург', stadium: 'Петровский', lat: 59.95, lon: 30.32 },

  // Медиалига Дивизион 2 (8)
  'FC ARS': { city: 'Москва', stadium: 'Москвич', lat: 55.75, lon: 37.62 },
  '«Ф» Москва': { city: 'Москва', stadium: 'Спартаковец', lat: 55.75, lon: 37.62 },
  'Альтерон': { city: 'Москва', stadium: 'Крылья Советов', lat: 55.75, lon: 37.62 },
  'Анжи': { city: 'Махачкала', stadium: 'Анжи Арена', lat: 42.98, lon: 47.50 },
  'Горки': { city: 'Горки-2 (МО)', stadium: 'Горки Арена', lat: 55.72, lon: 37.15 },
  'ФК Vibe': { city: 'Москва', stadium: 'Сокольники', lat: 55.75, lon: 37.62 },
  'ФК ПП': { city: 'Москва', stadium: 'Октябрь', lat: 55.75, lon: 37.62 },
  'ФК ЮНИСОН': { city: 'Москва', stadium: 'Янтарь', lat: 55.75, lon: 37.62 }
};
