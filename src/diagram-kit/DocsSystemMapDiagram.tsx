import React from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import { diagramPaletteDark, diagramPaletteLight } from './palettes';
import { SystemMapDiagram } from './SystemMapDiagram';

/**
 * Bridges Docusaurus color mode → shared palette for MDX embedding.
 */
export default function DocsSystemMapDiagram(props: Omit<React.ComponentProps<typeof SystemMapDiagram>, 'palette'>) {
  const { colorMode } = useColorMode();
  const palette = colorMode === 'dark' ? diagramPaletteDark : diagramPaletteLight;
  return <SystemMapDiagram {...props} palette={palette} />;
}
