import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CompletionCertificateEditor, CompletionCertificatePreview, CompletionCertificateData } from './CompletionCertificate';

const mockData: CompletionCertificateData = {
  title: 'Certificate',
  learnerName: 'John Doe',
  courseName: 'TypeScript 101',
  completionDate: '2026-03-10',
  certificateId: 'CERT-1001',
  signatoryName: 'Jane Manager',
  signatoryTitle: 'L&D Lead',
};

describe('CompletionCertificatePreview', () => {
  test('renders certificate fields', () => {
    render(<CompletionCertificatePreview data={mockData} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('TypeScript 101')).toBeInTheDocument();
    expect(screen.getByText(/CERT-1001/)).toBeInTheDocument();
  });

  test('fires interaction on print and download', () => {
    const onInteraction = jest.fn();
    render(<CompletionCertificatePreview data={mockData} onInteraction={onInteraction} />);
    fireEvent.click(screen.getByRole('button', { name: /Print/i }));
    fireEvent.click(screen.getByRole('button', { name: /Download/i }));
    expect(onInteraction).toHaveBeenCalled();
  });
});

describe('CompletionCertificateEditor', () => {
  test('updates learner name', () => {
    const onChange = jest.fn();
    render(<CompletionCertificateEditor data={mockData} onChange={onChange} />);
    fireEvent.change(screen.getByDisplayValue('John Doe'), { target: { value: 'Mary Doe' } });
    expect(onChange).toHaveBeenCalled();
  });
});
