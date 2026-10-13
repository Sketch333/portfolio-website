import { ogTypography, type OgPayload } from '@/lib/metadata/og';
import { siteConfig } from '@/lib/metadata/site';

/** Inline layout and bundled ImageResponse fonts keep rendering independent of remote assets. */
export function OgCard({ payload }: { payload: OgPayload }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', background: '#101719', color: '#f2f1e9', padding: '48px 64px', fontFamily: ogTypography.family }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ display: 'flex', width: 66, height: 66, alignItems: 'center', justifyContent: 'center', background: '#c9f08a', color: '#101719', fontSize: 30, fontWeight: 700 }}>AK</div>
          <span style={{ fontSize: 24 }}>{siteConfig.name}</span>
        </div>
        <span style={{ fontSize: 19, color: '#c9f08a' }}>DATA → PRODUCT</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
        <div style={{ fontSize: 22, color: '#c9f08a', marginBottom: 22 }}>{payload.eyebrow}</div>
        <div style={{ fontSize: ogTypography.titleSize, fontWeight: 700, lineHeight: 1.08, letterSpacing: '-1.5px' }}>{payload.title}</div>
        <div style={{ fontSize: ogTypography.subtitleSize, color: '#c9cfca', marginTop: 24, lineHeight: 1.35 }}>{payload.subtitle}</div>
      </div>
      <div style={{ display: 'flex', marginTop: 28, borderTop: '1px solid #3c4742', paddingTop: 18, fontSize: 18, color: '#c9cfca' }}>Aon Kazmi / Portfolio</div>
    </div>
  );
}
