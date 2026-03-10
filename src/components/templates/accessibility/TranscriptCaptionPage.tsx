import React, { useMemo, useState } from 'react';
import { Captions, Download, Search } from 'lucide-react';
import type { ComponentEditorProps, ComponentPreviewProps } from '../../../types/registry';
import './TranscriptCaptionPage.css';

export interface TranscriptSegment {
  id: string;
  startTime: number;
  endTime?: number;
  text: string;
  speaker?: string;
}

export type DownloadFormat = 'txt' | 'srt' | 'vtt';

export interface TranscriptCaptionPageData {
  title?: string;
  mediaId?: string;
  languageCode?: string;
  segments?: TranscriptSegment[];
  searchable?: boolean;
  seekOnClick?: boolean;
  downloadableFormats?: DownloadFormat[];
}

function formatTime(secs: number): string {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = Math.floor(secs % 60);
  return h > 0
    ? `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    : `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function buildSRT(segments: TranscriptSegment[]): string {
  return segments
    .map((seg, i) => {
      const start = seg.startTime;
      const end = seg.endTime ?? seg.startTime + 3;
      const toSRT = (s: number) => {
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        const ss = Math.floor(s % 60);
        const ms = Math.round((s % 1) * 1000);
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(ss).padStart(2, '0')},${String(ms).padStart(3, '0')}`;
      };
      return `${i + 1}\n${toSRT(start)} --> ${toSRT(end)}\n${seg.text}`;
    })
    .join('\n\n');
}

function buildVTT(segments: TranscriptSegment[]): string {
  const toVTT = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const ss = (s % 60).toFixed(3);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(Number(ss).toFixed(3)).padStart(6, '0')}`;
  };
  const body = segments
    .map((seg) => `${toVTT(seg.startTime)} --> ${toVTT(seg.endTime ?? seg.startTime + 3)}\n${seg.text}`)
    .join('\n\n');
  return `WEBVTT\n\n${body}`;
}

function triggerDownload(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export const TranscriptCaptionPagePreview: React.FC<ComponentPreviewProps> = ({
  data,
  componentId,
  onInteraction,
}) => {
  const d = data as TranscriptCaptionPageData;
  const segments = d.segments ?? [];
  const formats = d.downloadableFormats ?? [];
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? segments.filter((s) => s.text.toLowerCase().includes(q)) : segments;
  }, [query, segments]);

  const handleSearch = (q: string) => {
    setQuery(q);
    if (q.trim()) {
      onInteraction?.({
        componentId,
        interactionType: 'transcript_searched',
        interactionId: 'search',
        value: q,
        completed: false,
      });
    }
  };

  const handleTimestampClick = (seg: TranscriptSegment) => {
    if (!d.seekOnClick) return;
    onInteraction?.({
      componentId,
      interactionType: 'timestamp_clicked',
      interactionId: seg.id,
      value: seg.startTime,
      completed: false,
    });
  };

  const handleDownload = (format: DownloadFormat) => {
    const title = d.title?.trim() || 'transcript';
    let content = '';
    let mime = 'text/plain';
    if (format === 'txt') {
      content = segments.map((s) => `[${formatTime(s.startTime)}] ${s.speaker ? `${s.speaker}: ` : ''}${s.text}`).join('\n');
    } else if (format === 'srt') {
      content = buildSRT(segments);
    } else if (format === 'vtt') {
      content = buildVTT(segments);
      mime = 'text/vtt';
    }
    triggerDownload(content, `${title}.${format}`, mime);
    onInteraction?.({
      componentId,
      interactionType: 'transcript_downloaded',
      interactionId: format,
      value: format,
      completed: false,
    });
  };

  const highlight = (text: string) => {
    if (!query.trim()) return <span>{text}</span>;
    const pattern = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(pattern);
    return (
      <>
        {parts.map((part, i) =>
          pattern.test(part) ? <mark key={i} className="tpl-transcript__highlight">{part}</mark> : <span key={i}>{part}</span>
        )}
      </>
    );
  };

  return (
    <article className="tpl-transcript">
      <h2 className="tpl-transcript__title">
        <Captions size={20} aria-hidden="true" />
        {d.title?.trim() || 'Transcript'}
        {d.languageCode && <span className="tpl-transcript__lang">{d.languageCode.toUpperCase()}</span>}
      </h2>

      <div className="tpl-transcript__toolbar">
        {d.searchable !== false && (
          <label className="tpl-transcript__search">
            <Search size={16} aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search transcript…"
              aria-label="Search transcript"
            />
          </label>
        )}
        {formats.length > 0 && (
          <div className="tpl-transcript__downloads" aria-label="Download options">
            <Download size={16} aria-hidden="true" />
            {formats.map((fmt) => (
              <button key={fmt} type="button" className="tpl-transcript__dl-btn" onClick={() => handleDownload(fmt)}>
                {fmt.toUpperCase()}
              </button>
            ))}
          </div>
        )}
      </div>

      {segments.length === 0 ? (
        <p className="tpl-transcript__empty">No transcript segments configured yet.</p>
      ) : filtered.length === 0 ? (
        <p className="tpl-transcript__empty" role="status">No results for "{query}"</p>
      ) : (
        <ol className="tpl-transcript__segments">
          {filtered.map((seg) => (
            <li key={seg.id} className="tpl-transcript__segment">
              <button
                type="button"
                className={`tpl-transcript__time${d.seekOnClick ? ' tpl-transcript__time--clickable' : ''}`}
                onClick={() => handleTimestampClick(seg)}
                disabled={!d.seekOnClick}
                aria-label={d.seekOnClick ? `Seek to ${formatTime(seg.startTime)}` : undefined}
              >
                {formatTime(seg.startTime)}
              </button>
              {seg.speaker && <span className="tpl-transcript__speaker">{seg.speaker}:</span>}
              <span className="tpl-transcript__text">{highlight(seg.text)}</span>
            </li>
          ))}
        </ol>
      )}
    </article>
  );
};

export const TranscriptCaptionPageEditor: React.FC<ComponentEditorProps> = ({ data, onChange }) => {
  const d = data as TranscriptCaptionPageData;
  const segments = d.segments ?? [];
  const fmts: DownloadFormat[] = ['txt', 'srt', 'vtt'];
  const dlFmts = d.downloadableFormats ?? [];
  const update = (patch: Partial<TranscriptCaptionPageData>) => onChange({ data: { ...d, ...patch } });

  const toggleFormat = (fmt: DownloadFormat) => {
    const next = dlFmts.includes(fmt) ? dlFmts.filter((f) => f !== fmt) : [...dlFmts, fmt];
    update({ downloadableFormats: next });
  };

  return (
    <section className="tpl-transcript-editor">
      <label>Title<input value={d.title ?? ''} onChange={(e) => update({ title: e.target.value })} /></label>
      <label>Media ID<input value={d.mediaId ?? ''} placeholder="video-id-123" onChange={(e) => update({ mediaId: e.target.value })} /></label>
      <label>Language Code<input value={d.languageCode ?? ''} placeholder="en" onChange={(e) => update({ languageCode: e.target.value })} /></label>
      <label><input type="checkbox" checked={d.searchable !== false} onChange={(e) => update({ searchable: e.target.checked })} /> &nbsp;Enable search</label>
      <label><input type="checkbox" checked={d.seekOnClick === true} onChange={(e) => update({ seekOnClick: e.target.checked })} /> &nbsp;Click timestamps to seek</label>

      <fieldset className="tpl-transcript-editor__formats">
        <legend>Download Formats</legend>
        {fmts.map((fmt) => (
          <label key={fmt}>
            <input type="checkbox" checked={dlFmts.includes(fmt)} onChange={() => toggleFormat(fmt)} />
            &nbsp;{fmt.toUpperCase()}
          </label>
        ))}
      </fieldset>

      <div className="tpl-transcript-editor__head">
        <h3>Segments</h3>
        <button type="button" onClick={() => update({ segments: [...segments, { id: `seg-${Date.now()}`, startTime: 0, text: '' }] })}>+ Add Segment</button>
      </div>
      {segments.map((seg, idx) => (
        <div key={seg.id} className="tpl-transcript-editor__row">
          <input
            type="number" min="0" step="0.1"
            value={seg.startTime}
            placeholder="Start (s)"
            style={{ width: '80px' }}
            onChange={(e) => update({ segments: segments.map((x) => x.id === seg.id ? { ...x, startTime: Number(e.target.value) } : x) })}
          />
          <input
            type="number" min="0" step="0.1"
            value={seg.endTime ?? ''}
            placeholder="End (s)"
            style={{ width: '80px' }}
            onChange={(e) => update({ segments: segments.map((x) => x.id === seg.id ? { ...x, endTime: Number(e.target.value) } : x) })}
          />
          <input value={seg.speaker ?? ''} placeholder="Speaker" style={{ width: '80px' }} onChange={(e) => update({ segments: segments.map((x) => x.id === seg.id ? { ...x, speaker: e.target.value } : x) })} />
          <input value={seg.text} placeholder={`Segment ${idx + 1} text`} onChange={(e) => update({ segments: segments.map((x) => x.id === seg.id ? { ...x, text: e.target.value } : x) })} />
          <button type="button" onClick={() => update({ segments: segments.filter((x) => x.id !== seg.id) })}>Remove</button>
        </div>
      ))}
    </section>
  );
};
