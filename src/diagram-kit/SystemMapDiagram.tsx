import type { DiagramPalette } from './palettes';

export interface SystemMapDiagramProps {
  palette: DiagramPalette;
  className?: string;
}

/**
 * Stateless system relationship map — consumers choose light/dark palette
 * (Docusaurus color mode vs in-app ThemeContext).
 */
export function SystemMapDiagram({ palette: p, className }: SystemMapDiagramProps) {
  const arrowId = 'sm-arrow-diagram-kit';

  return (
    <div
      className={className}
      style={{
        width: '100%',
        borderRadius: 12,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: p.canvasBorder,
        backgroundColor: p.canvasBg,
        padding: 24,
        overflowX: 'auto',
      }}
    >
      <svg viewBox="0 0 780 180" style={{ width: '100%', maxWidth: 768, margin: '0 auto', display: 'block', minWidth: 580 }}>
        <defs>
          <marker id={arrowId} markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill={p.arrowColor} />
          </marker>
        </defs>

        <rect x="10" y="60" width="120" height="60" rx="10" fill={p.greenBg} stroke={p.greenBorder} strokeWidth="1.5" />
        <text x="70" y="84" textAnchor="middle" fontSize="11" fontWeight="700" fill={p.greenText} fontFamily="sans-serif">
          Items
        </text>
        <text x="70" y="100" textAnchor="middle" fontSize="9" fill={p.nodeSubText} fontFamily="sans-serif">
          Work objects
        </text>
        <text x="70" y="114" textAnchor="middle" fontSize="9" fill={p.nodeSubText} fontFamily="sans-serif">
          Always-on
        </text>

        <line x1="130" y1="90" x2="168" y2="90" stroke={p.arrowColor} strokeWidth="1.5" markerEnd={`url(#${arrowId})`} />

        <rect x="170" y="30" width="140" height="120" rx="10" fill={p.indigoBg} stroke={p.indigoBorder} strokeWidth="1.5" />
        <text x="240" y="52" textAnchor="middle" fontSize="11" fontWeight="700" fill={p.indigoText} fontFamily="sans-serif">
          Cycles
        </text>
        <text x="240" y="66" textAnchor="middle" fontSize="9" fill={p.nodeSubText} fontFamily="sans-serif">
          Governance container
        </text>

        <rect x="182" y="74" width="116" height="32" rx="6" fill={p.violetBg} stroke={p.violetBorder} strokeWidth="1" />
        <text x="240" y="90" textAnchor="middle" fontSize="10" fontWeight="600" fill={p.violetText} fontFamily="sans-serif">
          Tracks
        </text>
        <text x="240" y="102" textAnchor="middle" fontSize="8.5" fill={p.violetText} fontFamily="sans-serif">
          Comparability geometry
        </text>

        <rect x="182" y="112" width="116" height="28" rx="6" fill={p.emeraldBg} stroke={p.emeraldBorder} strokeWidth="1" />
        <text x="240" y="129" textAnchor="middle" fontSize="10" fontWeight="600" fill={p.emeraldText} fontFamily="sans-serif">
          Sessions
        </text>
        <text x="240" y="140" textAnchor="middle" fontSize="8.5" fill={p.emeraldText} fontFamily="sans-serif">
          Judgment execution
        </text>

        <line x1="310" y1="90" x2="348" y2="90" stroke={p.arrowColor} strokeWidth="1.5" markerEnd={`url(#${arrowId})`} />

        <rect x="350" y="50" width="130" height="80" rx="10" fill={p.amberBg} stroke={p.amberBorder} strokeWidth="1.5" />
        <text x="415" y="74" textAnchor="middle" fontSize="11" fontWeight="700" fill={p.amberText} fontFamily="sans-serif">
          Catchball
        </text>
        <text x="415" y="89" textAnchor="middle" fontSize="9" fill={p.nodeSubText} fontFamily="sans-serif">
          Authority lane
        </text>
        <text x="415" y="103" textAnchor="middle" fontSize="9" fill={p.nodeSubText} fontFamily="sans-serif">
          Request → Propose
        </text>
        <text x="415" y="117" textAnchor="middle" fontSize="9" fill={p.nodeSubText} fontFamily="sans-serif">
          → Ratify → Publish
        </text>

        <line x1="480" y1="90" x2="518" y2="90" stroke={p.arrowColor} strokeWidth="1.5" markerEnd={`url(#${arrowId})`} />

        <rect x="520" y="55" width="130" height="70" rx="10" fill={p.emeraldBg} stroke={p.emeraldBorder} strokeWidth="1.5" />
        <text x="585" y="78" textAnchor="middle" fontSize="11" fontWeight="700" fill={p.emeraldText} fontFamily="sans-serif">
          Published
        </text>
        <text x="585" y="93" textAnchor="middle" fontSize="11" fontWeight="700" fill={p.emeraldText} fontFamily="sans-serif">
          Priorities
        </text>
        <text x="585" y="112" textAnchor="middle" fontSize="9" fill={p.nodeSubText} fontFamily="sans-serif">
          Plans of record
        </text>

        <text x="70" y="148" textAnchor="middle" fontSize="8" fill={p.canvasText} fontFamily="sans-serif" fontStyle="italic">
          Always-on
        </text>
        <text x="240" y="168" textAnchor="middle" fontSize="8" fill={p.canvasText} fontFamily="sans-serif" fontStyle="italic">
          Cycle readiness &amp; execution
        </text>
        <text x="415" y="148" textAnchor="middle" fontSize="8" fill={p.canvasText} fontFamily="sans-serif" fontStyle="italic">
          Governance
        </text>
        <text x="585" y="140" textAnchor="middle" fontSize="8" fill={p.canvasText} fontFamily="sans-serif" fontStyle="italic">
          Output
        </text>
      </svg>
      <p style={{ textAlign: 'center', fontSize: 12, marginTop: 8, color: p.canvasText, marginBottom: 0 }}>
        How the five functional areas connect in a prioritization cycle
      </p>
    </div>
  );
}
