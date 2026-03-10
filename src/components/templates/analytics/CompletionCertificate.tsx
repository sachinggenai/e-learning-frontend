import React, { useEffect } from 'react';
import { Award, Download, Printer } from 'lucide-react';
import type { ComponentEditorProps, ComponentPreviewProps } from '../../../types/registry';
import './CompletionCertificate.css';

export interface CompletionCertificateData {
  title?: string;
  learnerName?: string;
  courseName?: string;
  completionDate?: string;
  certificateId?: string;
  issuerName?: string;
  signatoryName?: string;
  signatoryTitle?: string;
  badgeUrl?: string;
}

export const CompletionCertificatePreview: React.FC<ComponentPreviewProps> = ({ data, componentId, onInteraction }) => {
  const d = data as CompletionCertificateData;
  const date = d.completionDate ? new Date(d.completionDate).toLocaleDateString() : 'N/A';

  useEffect(() => {
    onInteraction?.({
      componentId,
      interactionType: 'certificate_viewed',
      interactionId: d.certificateId ?? 'certificate',
      value: d.learnerName ?? 'learner',
      completed: false,
    });
  }, [componentId, d.certificateId, d.learnerName, onInteraction]);

  return (
    <article className="tpl-completion-certificate">
      <header className="tpl-completion-certificate__header">
        <h2 className="tpl-completion-certificate__title"><Award size={20} /> {d.title?.trim() || 'Certificate of Completion'}</h2>
      </header>

      <section className="tpl-completion-certificate__paper">
        <p>This certifies that</p>
        <h3>{d.learnerName?.trim() || 'Learner Name'}</h3>
        <p>has successfully completed</p>
        <h4>{d.courseName?.trim() || 'Course Name'}</h4>
        <p>on {date}</p>
        <p>Certificate ID: {d.certificateId || 'N/A'}</p>

        {(d.signatoryName || d.signatoryTitle) && (
          <div className="tpl-completion-certificate__signatory">
            <strong>{d.signatoryName}</strong>
            <span>{d.signatoryTitle}</span>
          </div>
        )}
      </section>

      <div className="tpl-completion-certificate__actions">
        <button type="button" onClick={() => onInteraction?.({ componentId, interactionType: 'certificate_printed', interactionId: 'print', value: d.certificateId, completed: false })}><Printer size={14} /> Print</button>
        <button type="button" onClick={() => onInteraction?.({ componentId, interactionType: 'certificate_downloaded', interactionId: 'download', value: d.certificateId, completed: false })}><Download size={14} /> Download</button>
      </div>
    </article>
  );
};

export const CompletionCertificateEditor: React.FC<ComponentEditorProps> = ({ data, onChange }) => {
  const d = data as CompletionCertificateData;
  const update = (patch: Partial<CompletionCertificateData>) => onChange({ data: { ...d, ...patch } });

  return (
    <section className="tpl-completion-certificate-editor">
      <label>Title<input value={d.title ?? ''} onChange={(e) => update({ title: e.target.value })} /></label>
      <label>Learner Name<input value={d.learnerName ?? ''} onChange={(e) => update({ learnerName: e.target.value })} /></label>
      <label>Course Name<input value={d.courseName ?? ''} onChange={(e) => update({ courseName: e.target.value })} /></label>
      <label>Completion Date<input type="date" value={d.completionDate ?? ''} onChange={(e) => update({ completionDate: e.target.value })} /></label>
      <label>Certificate ID<input value={d.certificateId ?? ''} onChange={(e) => update({ certificateId: e.target.value })} /></label>
      <label>Signatory Name<input value={d.signatoryName ?? ''} onChange={(e) => update({ signatoryName: e.target.value })} /></label>
      <label>Signatory Title<input value={d.signatoryTitle ?? ''} onChange={(e) => update({ signatoryTitle: e.target.value })} /></label>
    </section>
  );
};
