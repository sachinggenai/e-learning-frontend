import React, { useEffect, useMemo, useState } from 'react';
import { BadgeCheck } from 'lucide-react';
import type { ComponentEditorProps, ComponentPreviewProps } from '../../../types/registry';
import './PolicyAcknowledgement.css';

export interface PolicyAcknowledgementRecord {
  userId: string;
  acknowledged: boolean;
  signature?: string;
  submittedAt: string;
  policyVersion: string;
}

export interface PolicyAcknowledgementData {
  title?: string;
  policyText?: string;
  policyVersion?: string;
  acknowledgementLabel?: string;
  requireSignature?: boolean;
  confirmationMessage?: string;
  legalFooter?: string;
  userId?: string;
  lockAfterSubmission?: boolean;
  allowAdminOverride?: boolean;
  record?: PolicyAcknowledgementRecord;
}

export const PolicyAcknowledgementPreview: React.FC<ComponentPreviewProps> = ({
  data,
  componentId,
  onInteraction,
  onComplete,
}) => {
  const d = data as PolicyAcknowledgementData;
  const existing = d.record;
  const isInitiallyLocked = Boolean(existing?.acknowledged) && d.lockAfterSubmission !== false;

  const [checked, setChecked] = useState(Boolean(existing?.acknowledged));
  const [signature, setSignature] = useState(existing?.signature ?? '');
  const [record, setRecord] = useState<PolicyAcknowledgementRecord | undefined>(existing);
  const [isLocked, setIsLocked] = useState(isInitiallyLocked);
  const requireSignature = d.requireSignature === true;

  useEffect(() => {
    onInteraction?.({
      componentId,
      interactionType: 'policy_viewed',
      interactionId: 'policy',
      value: d.policyVersion ?? 'v1.0',
      completed: false,
    });
  }, [componentId, d.policyVersion, onInteraction]);

  const canSubmit = checked && (!requireSignature || signature.trim().length > 0) && !isLocked;

  const statusText = useMemo(() => {
    if (record?.acknowledged) {
      return `Acknowledged on ${new Date(record.submittedAt).toLocaleString()}`;
    }
    return 'Pending acknowledgement';
  }, [record]);

  const handleSubmit = () => {
    const submission: PolicyAcknowledgementRecord = {
      userId: d.userId?.trim() || 'current-user',
      acknowledged: true,
      signature: signature.trim() || undefined,
      submittedAt: new Date().toISOString(),
      policyVersion: d.policyVersion?.trim() || 'v1.0',
    };

    setRecord(submission);
    if (d.lockAfterSubmission !== false) {
      setIsLocked(true);
    }

    onInteraction?.({
      componentId,
      interactionType: 'policy_submitted',
      interactionId: submission.policyVersion,
      value: submission,
      completed: true,
    });
    onComplete?.(componentId);
  };

  return (
    <article className="tpl-policy-acknowledgement">
      <h2 className="tpl-policy-acknowledgement__title">
        <BadgeCheck size={20} />
        {d.title?.trim() || 'Policy Acknowledgement'}
      </h2>

      <p className="tpl-policy-acknowledgement__meta">Version: {d.policyVersion?.trim() || 'v1.0'}</p>
      <div className="tpl-policy-acknowledgement__body">{d.policyText?.trim() || 'Policy text is not configured yet.'}</div>

      <label className="tpl-policy-acknowledgement__checkbox">
        <input
          type="checkbox"
          checked={checked}
          disabled={isLocked}
          onChange={(e) => {
            setChecked(e.target.checked);
            onInteraction?.({
              componentId,
              interactionType: 'acknowledgement_checked',
              interactionId: 'ack-check',
              value: e.target.checked,
              completed: false,
            });
          }}
        />
        <span>{d.acknowledgementLabel?.trim() || 'I have read and acknowledge this policy.'}</span>
      </label>

      {requireSignature && (
        <label className="tpl-policy-acknowledgement__field">
          E-signature
          <input
            type="text"
            value={signature}
            disabled={isLocked}
            onChange={(e) => setSignature(e.target.value)}
            placeholder="Type full name"
          />
        </label>
      )}

      <div className="tpl-policy-acknowledgement__actions">
        <button type="button" disabled={!canSubmit} onClick={handleSubmit}>Submit Acknowledgement</button>
        {d.allowAdminOverride && isLocked && (
          <button type="button" onClick={() => setIsLocked(false)}>Admin Override</button>
        )}
      </div>

      <p className="tpl-policy-acknowledgement__status">{statusText}</p>
      {record?.acknowledged && <p className="tpl-policy-acknowledgement__confirmation">{d.confirmationMessage?.trim() || 'Acknowledgement recorded successfully.'}</p>}
      {d.legalFooter?.trim() && <p className="tpl-policy-acknowledgement__legal">{d.legalFooter}</p>}
    </article>
  );
};

export const PolicyAcknowledgementEditor: React.FC<ComponentEditorProps> = ({ data, onChange }) => {
  const d = data as PolicyAcknowledgementData;
  const update = (patch: Partial<PolicyAcknowledgementData>) => onChange({ data: { ...d, ...patch } });

  return (
    <section className="tpl-policy-acknowledgement-editor">
      <label>Title<input value={d.title ?? ''} onChange={(e) => update({ title: e.target.value })} /></label>
      <label>Policy Version<input value={d.policyVersion ?? ''} onChange={(e) => update({ policyVersion: e.target.value })} /></label>
      <label>Policy Text<textarea rows={6} value={d.policyText ?? ''} onChange={(e) => update({ policyText: e.target.value })} /></label>
      <label>Acknowledgement Label<input value={d.acknowledgementLabel ?? ''} onChange={(e) => update({ acknowledgementLabel: e.target.value })} /></label>
      <label>User ID<input value={d.userId ?? ''} onChange={(e) => update({ userId: e.target.value })} /></label>
      <label>Confirmation Message<input value={d.confirmationMessage ?? ''} onChange={(e) => update({ confirmationMessage: e.target.value })} /></label>
      <label>Legal Footer<textarea rows={2} value={d.legalFooter ?? ''} onChange={(e) => update({ legalFooter: e.target.value })} /></label>
      <label><input type="checkbox" checked={d.requireSignature === true} onChange={(e) => update({ requireSignature: e.target.checked })} /> Require signature</label>
      <label><input type="checkbox" checked={d.lockAfterSubmission !== false} onChange={(e) => update({ lockAfterSubmission: e.target.checked })} /> Lock after submission</label>
      <label><input type="checkbox" checked={d.allowAdminOverride === true} onChange={(e) => update({ allowAdminOverride: e.target.checked })} /> Allow admin override</label>
    </section>
  );
};
