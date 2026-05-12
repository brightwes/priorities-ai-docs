import React from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import { diagramPaletteDark, diagramPaletteLight } from './palettes';
import { CatchballLoopDiagram } from './CatchballLoopDiagram';

export default function DocsCatchballLoopDiagram(
  props: Omit<React.ComponentProps<typeof CatchballLoopDiagram>, 'palette'>,
) {
  const { colorMode } = useColorMode();
  const palette = colorMode === 'dark' ? diagramPaletteDark : diagramPaletteLight;
  return <CatchballLoopDiagram {...props} palette={palette} />;
}
