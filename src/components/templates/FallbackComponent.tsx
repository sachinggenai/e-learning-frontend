/**
 * FallbackComponent — Renders when a component type is unknown or fails to load.
 *
 * Graceful degradation: shows a warning banner with the unknown type ID
 * so authors can identify and fix the issue.
 */

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { ComponentPreviewProps, ComponentEditorProps } from '../../types/registry';

const containerStyle: React.CSSProperties = {
  padding: '24px',
  border: '2px dashed #f59e0b',
  borderRadius: '8px',
  backgroundColor: '#fffbeb',
  textAlign: 'center',
};

const iconStyle: React.CSSProperties = {
  color: '#f59e0b',
  marginBottom: '8px',
};

export const FallbackPreview: React.FC<ComponentPreviewProps> = ({ componentType, data }) => (
  <div style={containerStyle} role="alert" aria-live="polite">
    <AlertTriangle size={32} style={iconStyle} aria-hidden="true" />
    <h4 style={{ margin: '0 0 8px', color: '#92400e' }}>Unknown Component</h4>
    <p style={{ margin: 0, color: '#78350f', fontSize: '14px' }}>
      Component type <code style={{ background: '#fef3c7', padding: '2px 6px', borderRadius: '4px' }}>{componentType}</code> is not registered.
    </p>
    {data && Object.keys(data).length > 0 && (
      <details style={{ marginTop: '12px', textAlign: 'left' }}>
        <summary style={{ cursor: 'pointer', color: '#92400e', fontSize: '13px' }}>View data</summary>
        <pre style={{ fontSize: '12px', overflowX: 'auto', padding: '8px', background: '#fef3c7', borderRadius: '4px', marginTop: '4px' }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      </details>
    )}
  </div>
);

export const FallbackEditor: React.FC<ComponentEditorProps> = ({ componentType }) => (
  <div style={containerStyle} role="alert">
    <AlertTriangle size={24} style={iconStyle} aria-hidden="true" />
    <p style={{ margin: 0, color: '#92400e', fontSize: '14px' }}>
      No editor available for <code>{componentType}</code>. This component type may need to be installed or updated.
    </p>
  </div>
);

export default FallbackPreview;
