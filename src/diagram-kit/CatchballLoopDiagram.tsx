import { useId } from 'react';
import type { DiagramPalette } from './palettes';

export interface CatchballLoopDiagramProps {
  palette: DiagramPalette;
  className?: string;
}

function sanitizeSvgId(raw: string): string {
  return raw.replace(/[^a-zA-Z0-9_-]/g, '');
}

/**
 * One catchball iteration: authority request → team work → propose up → accept or revise.
 */
export function CatchballLoopDiagram({ palette: p, className }: CatchballLoopDiagramProps) {
  const uid = sanitizeSvgId(useId()) || '0';
  const arrowRightId = `cb-loop-arrow-r-${uid}`;
  const arrowAmberId = `cb-loop-arrow-am-${uid}`;

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
        padding: 20,
        overflowX: 'auto',
      }}
    >
      <svg viewBox="0 0 720 230" style={{ width: '100%', minWidth: 560, display: 'block' }}>
        <defs>
          <marker id={arrowRightId} markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L7,3 z" fill={p.arrowColor} />
          </marker>
          <marker id={arrowAmberId} markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L7,3 z" fill={p.amberBorder} />
          </marker>
        </defs>

        <rect x="10" y="10" width="700" height="55" rx="8" fill={p.amberBg} stroke={p.amberBorder} strokeWidth="1.5" />
        <text x="30" y="34" fontSize="10" fontWeight="700" fill={p.amberText} fontFamily="sans-serif">
          Executive / Authority Tier
        </text>
        <text x="30" y="50" fontSize="8.5" fill={p.nodeSubText} fontFamily="sans-serif">
          Initiates requests · Reviews proposals · Ratifies · Publishes
        </text>

        <rect x="10" y="165" width="700" height="55" rx="8" fill={p.indigoBg} stroke={p.indigoBorder} strokeWidth="1.5" />
        <text x="30" y="189" fontSize="10" fontWeight="700" fill={p.indigoText} fontFamily="sans-serif">
          Team / Execution Tier
        </text>
        <text x="30" y="205" fontSize="8.5" fill={p.nodeSubText} fontFamily="sans-serif">
          Runs sessions · Produces rankings · Forms proposals
        </text>

        <rect x="60" y="80" width="100" height="72" rx="7" fill={p.amberBg} stroke={p.amberBorder} strokeWidth="1.5" />
        <text x="110" y="100" textAnchor="middle" fontSize="10" fontWeight="700" fill={p.amberText} fontFamily="sans-serif">
          1. Request
        </text>
        <text x="110" y="115" textAnchor="middle" fontSize="8.5" fill={p.nodeSubText} fontFamily="sans-serif">
          Intent, constraints
        </text>
        <text x="110" y="127" textAnchor="middle" fontSize="8.5" fill={p.nodeSubText} fontFamily="sans-serif">
          scope, guardrails
        </text>
        <text x="110" y="144" textAnchor="middle" fontSize="9" fill={p.amberText} fontFamily="sans-serif">
          ↓ Ball sent down
        </text>

        <rect x="210" y="80" width="100" height="72" rx="7" fill={p.violetBg} stroke={p.violetBorder} strokeWidth="1.5" />
        <text x="260" y="100" textAnchor="middle" fontSize="10" fontWeight="700" fill={p.violetText} fontFamily="sans-serif">
          2. Work
        </text>
        <text x="260" y="115" textAnchor="middle" fontSize="8.5" fill={p.nodeSubText} fontFamily="sans-serif">
          Sessions, scoring,
        </text>
        <text x="260" y="127" textAnchor="middle" fontSize="8.5" fill={p.nodeSubText} fontFamily="sans-serif">
          ranking in tracks
        </text>
        <text x="260" y="144" textAnchor="middle" fontSize="9" fill={p.violetText} fontFamily="sans-serif">
          Judgment lane
        </text>

        <rect x="360" y="80" width="100" height="72" rx="7" fill={p.greenBg} stroke={p.greenBorder} strokeWidth="1.5" />
        <text x="410" y="100" textAnchor="middle" fontSize="10" fontWeight="700" fill={p.greenText} fontFamily="sans-serif">
          3. Propose
        </text>
        <text x="410" y="115" textAnchor="middle" fontSize="8.5" fill={p.nodeSubText} fontFamily="sans-serif">
          Ranked list +
        </text>
        <text x="410" y="127" textAnchor="middle" fontSize="8.5" fill={p.nodeSubText} fontFamily="sans-serif">
          rationale submitted
        </text>
        <text x="410" y="144" textAnchor="middle" fontSize="9" fill={p.greenText} fontFamily="sans-serif">
          ↑ Ball returned up
        </text>

        <rect x="510" y="80" width="100" height="72" rx="7" fill={p.amberBg} stroke={p.amberBorder} strokeWidth="1.5" />
        <text x="560" y="100" textAnchor="middle" fontSize="10" fontWeight="700" fill={p.amberText} fontFamily="sans-serif">
          4. Accept /
        </text>
        <text x="560" y="113" textAnchor="middle" fontSize="10" fontWeight="700" fill={p.amberText} fontFamily="sans-serif">
          Revise
        </text>
        <text x="560" y="128" textAnchor="middle" fontSize="8.5" fill={p.nodeSubText} fontFamily="sans-serif">
          Accept → ratify
        </text>
        <text x="560" y="140" textAnchor="middle" fontSize="8.5" fill={p.nodeSubText} fontFamily="sans-serif">
          Revise → new loop
        </text>

        <rect x="630" y="90" width="78" height="52" rx="7" fill={p.emeraldBg} stroke={p.emeraldBorder} strokeWidth="1.5" />
        <text x="669" y="114" textAnchor="middle" fontSize="10" fontWeight="700" fill={p.emeraldText} fontFamily="sans-serif">
          Ratify &amp;
        </text>
        <text x="669" y="128" textAnchor="middle" fontSize="10" fontWeight="700" fill={p.emeraldText} fontFamily="sans-serif">
          Publish
        </text>

        <line
          x1="160"
          y1="116"
          x2="207"
          y2="116"
          stroke={p.arrowColor}
          strokeWidth="1.5"
          markerEnd={`url(#${arrowRightId})`}
        />
        <line
          x1="310"
          y1="116"
          x2="357"
          y2="116"
          stroke={p.arrowColor}
          strokeWidth="1.5"
          markerEnd={`url(#${arrowRightId})`}
        />
        <line
          x1="460"
          y1="116"
          x2="507"
          y2="116"
          stroke={p.arrowColor}
          strokeWidth="1.5"
          markerEnd={`url(#${arrowRightId})`}
        />
        <line
          x1="610"
          y1="116"
          x2="627"
          y2="116"
          stroke={p.arrowColor}
          strokeWidth="1.5"
          markerEnd={`url(#${arrowRightId})`}
        />

        <path
          d="M 510 152 Q 435 175 360 152"
          stroke={p.amberBorder}
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="4,3"
          markerEnd={`url(#${arrowAmberId})`}
        />
        <text x="435" y="178" textAnchor="middle" fontSize="8" fill={p.amberText} fontFamily="sans-serif">
          Revision requested → new loop
        </text>
      </svg>
      <p style={{ textAlign: 'center', fontSize: 12, marginTop: 6, marginBottom: 0, color: p.canvasText }}>
        One catchball loop: authority tier requests → teams work → propose back up → accept or revise
      </p>
    </div>
  );
}
