/**
 * Shared palettes for conceptual SVG diagrams rendered in docs-site MDX and
 * in-product documentation. Keep in sync visually with app ThemeContext parity.
 */

export interface DiagramPalette {
  canvasBg: string;
  canvasBorder: string;
  canvasText: string;
  nodeBg: string;
  nodeBorder: string;
  nodeText: string;
  nodeSubText: string;
  greenBg: string;
  greenBorder: string;
  greenText: string;
  indigoBg: string;
  indigoBorder: string;
  indigoText: string;
  violetBg: string;
  violetBorder: string;
  violetText: string;
  amberBg: string;
  amberBorder: string;
  amberText: string;
  emeraldBg: string;
  emeraldBorder: string;
  emeraldText: string;
  redBg: string;
  redBorder: string;
  redText: string;
  grayBg: string;
  grayBorder: string;
  grayText: string;
  skyBg: string;
  skyBorder: string;
  skyText: string;
  skyInnerBorder: string;
  arrowColor: string;
  arrowDashedColor: string;
}

export const diagramPaletteLight: DiagramPalette = {
  canvasBg: '#F9FAFB',
  canvasBorder: '#E5E7EB',
  canvasText: '#9CA3AF',
  nodeBg: '#FFFFFF',
  nodeBorder: '#E5E7EB',
  nodeText: '#111827',
  nodeSubText: '#6B7280',
  greenBg: '#F2F7F3',
  greenBorder: '#5A7D5E',
  greenText: '#354738',
  indigoBg: '#F0F4FF',
  indigoBorder: '#818CF8',
  indigoText: '#3730A3',
  violetBg: '#EDE9FE',
  violetBorder: '#A78BFA',
  violetText: '#5B21B6',
  amberBg: '#FFF7ED',
  amberBorder: '#F59E0B',
  amberText: '#92400E',
  emeraldBg: '#F0FDF4',
  emeraldBorder: '#16A34A',
  emeraldText: '#14532D',
  redBg: '#FEF2F2',
  redBorder: '#FCA5A5',
  redText: '#991B1B',
  grayBg: '#F9FAFB',
  grayBorder: '#9CA3AF',
  grayText: '#4B5563',
  skyBg: '#F0F9FF',
  skyBorder: '#38BDF8',
  skyText: '#0C4A6E',
  skyInnerBorder: '#BAE6FD',
  arrowColor: '#9CA3AF',
  arrowDashedColor: '#D1D5DB',
};

export const diagramPaletteDark: DiagramPalette = {
  canvasBg: '#1C1F26',
  canvasBorder: '#374151',
  canvasText: '#6B7280',
  nodeBg: '#252830',
  nodeBorder: '#374151',
  nodeText: '#D8DDE8',
  nodeSubText: '#6B7280',
  greenBg: '#1A2E1E',
  greenBorder: '#3D6B44',
  greenText: '#86EFAC',
  indigoBg: '#1E2045',
  indigoBorder: '#4F46E5',
  indigoText: '#A5B4FC',
  violetBg: '#21183A',
  violetBorder: '#7C3AED',
  violetText: '#C4B5FD',
  amberBg: '#2A1F0A',
  amberBorder: '#D97706',
  amberText: '#FCD34D',
  emeraldBg: '#0A2A18',
  emeraldBorder: '#16A34A',
  emeraldText: '#6EE7B7',
  redBg: '#2A0F0F',
  redBorder: '#EF4444',
  redText: '#FCA5A5',
  grayBg: '#1F2229',
  grayBorder: '#4B5563',
  grayText: '#9CA3AF',
  skyBg: '#0B1E2E',
  skyBorder: '#0EA5E9',
  skyText: '#7DD3FC',
  skyInnerBorder: '#1D4E6A',
  arrowColor: '#4B5563',
  arrowDashedColor: '#374151',
};
