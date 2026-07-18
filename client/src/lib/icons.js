// Ünite kodu → lucide-react ikon eşlemesi (minimal, flat)
import { Scale, TrendingUp, Landmark, Repeat, BookOpen } from 'lucide-react';

export const UNIT_ICON = {
  1001: Scale, // Dar Kapsamlı Mevzuat
  1003: TrendingUp, // Sermaye Piyasası Araçları
  1005: Landmark, // Yatırım Kuruluşları
  1012: Repeat, // Takas ve Operasyon
};

export function unitIcon(code) {
  return UNIT_ICON[code] || BookOpen;
}
