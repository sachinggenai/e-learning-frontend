# Option B — Rich Text Content Template (Future Implementation)

**Branch to implement on:** `Democourse` (or a new feature branch from it)  
**Prerequisite:** Option A (`content-text` field fix) must be merged first.

---

## Goal

Add a new template type `content-rich-text` that is identical in purpose to `content-text`
but replaces the plain HTML `<textarea>` with a full WYSIWYG rich-text editor.
Authors paste designed content OR use toolbar formatting — no manual HTML required.
Output is still an HTML string stored in `data.content`, fully SCORM-compatible.

---

## Backend Contract (unchanged from content-text)

```
POST /api/v1/courses/{courseId}/templates
{
  "templateId": "<uuid>",
  "type": "content-rich-text",          // new type alias — backend treats same as content-text
  "title": "Page Title",
  "order": 0,
  "data": {
    "content": "<p>HTML output from editor</p>"
  }
}
```

Ask backend to add `"content-rich-text"` as an alias that maps to the same renderer as
`"content-text"` (i.e. `renderContent` / `contentRenderer`). Or reuse `"content-text"` type
and differentiate only on the frontend by `displayName`.

---

## Frontend Implementation Steps

### 1. Install rich-text editor library

**Recommended: TipTap** (MIT license, React-first, no jQuery)
```
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-link @tiptap/extension-image
```

**Alternative: React-Quill** (simpler but less maintained)
```
npm install react-quill
```

### 2. Create the template file

`src/components/templates/content/ContentRichText.tsx`

Structure mirrors `ContentText.tsx` exactly, except:

- Editor uses `<EditorContent editor={editor} />` (TipTap) instead of `<textarea>`
- Toolbar: Bold, Italic, Underline, H2, H3, Bullet list, Ordered list, Link, Undo/Redo
- `editor.getHTML()` output → `data.content` (same backend field)
- Preview component is **identical** to `ContentTextPreview` — renders `data.content` via
  `dangerouslySetInnerHTML`. No change needed to SCORM export renderer.

### 3. Register in registrations.ts

```typescript
// Add lazy loaders:
const ContentRichTextEditor = React.lazy(() =>
  import('../templates/content/ContentRichText').then(m => ({ default: m.ContentRichTextEditor }))
);
const ContentRichTextPreview = React.lazy(() =>
  import('../templates/content/ContentRichText').then(m => ({ default: m.ContentRichTextPreview }))
);

// Register:
r({
  typeId: 'content-rich-text',
  displayName: 'Rich Text Content',
  description: 'WYSIWYG rich text editor — format content with a toolbar, no HTML required.',
  category: 'content-presentation',
  icon: 'pencil-line',
  tags: ['text', 'content', 'rich-text', 'wysiwyg', 'html'],
  completionCapabilities: ['view'],
  scoringEnabled: false,
  audioSupport: { perComponent: true, perInteraction: false },
  defaultData: { title: '', content: '<p>Start typing your content here...</p>' },
  sortOrder: 2,   // appears after 'Text Content' in the picker
  editorComponent: ContentRichTextEditor,
  previewComponent: ContentRichTextPreview,
});
```

### 4. Add CSS to TemplateStyles.css

Reuse `.tpl-content-text-preview` classes for preview (no change needed).
Add toolbar styles under `.tpl-rich-text-editor__toolbar`.

### 5. SCORM Export

**No changes required** to `contentRenderer.ts`. It already reads `data.content` which
TipTap outputs as an HTML string. The existing `renderRichText()` / `renderRichHTML()`
pipeline handles sanitization on export.

---

## Component Sketch (TipTap)

```tsx
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export const ContentRichTextEditor: React.FC<ComponentEditorProps> = ({ data, onChange, readOnly }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: data.content || '<p></p>',
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      onChange({ data: { ...data, content: editor.getHTML() } });
    },
  });

  return (
    <div className="tpl-editor">
      <div className="tpl-field">
        <label className="tpl-field__label" htmlFor="crt-title">Title</label>
        <input
          id="crt-title"
          type="text"
          className="tpl-field__input"
          value={data.title || ''}
          onChange={(e) => onChange({ data: { ...data, title: e.target.value } })}
          maxLength={200}
          disabled={readOnly}
        />
      </div>
      <div className="tpl-field">
        <label className="tpl-field__label">Content</label>
        {/* Toolbar: Bold | Italic | H2 | H3 | Bullet | Number | Link */}
        <div className="tpl-rich-text-editor__toolbar">
          <button onClick={() => editor?.chain().focus().toggleBold().run()} disabled={readOnly}>B</button>
          <button onClick={() => editor?.chain().focus().toggleItalic().run()} disabled={readOnly}>I</button>
          <button onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} disabled={readOnly}>H2</button>
          <button onClick={() => editor?.chain().focus().toggleBulletList().run()} disabled={readOnly}>• List</button>
          <button onClick={() => editor?.chain().focus().toggleOrderedList().run()} disabled={readOnly}>1. List</button>
        </div>
        <EditorContent editor={editor} className="tpl-rich-text-editor__content" />
      </div>
    </div>
  );
};

// Preview — identical to ContentTextPreview
export const ContentRichTextPreview: React.FC<ComponentPreviewProps> = ({ componentId, data, onComplete }) => {
  React.useEffect(() => {
    const t = setTimeout(() => onComplete?.(componentId), 1000);
    return () => clearTimeout(t);
  }, [componentId, onComplete]);

  return (
    <article className="tpl-preview tpl-content-text-preview">
      {data.title && <h2 className="tpl-content-text-preview__title">{data.title}</h2>}
      <div
        className="tpl-content-text-preview__body"
        dangerouslySetInnerHTML={{ __html: data.content || data.body || '' }}
      />
    </article>
  );
};
```

---

## Files to create / modify

| Action | File |
|--------|------|
| CREATE | `src/components/templates/content/ContentRichText.tsx` |
| MODIFY | `src/components/registry/registrations.ts` — add lazy loaders + registration |
| MODIFY | `src/components/templates/TemplateStyles.css` — add toolbar styles |
| OPTIONAL | `src/export-runtime/renderers/contentRenderer.ts` — add `content-rich-text` alias |
| OPTIONAL | Backend: add `"content-rich-text"` type alias in template model |

---

## Estimated effort: ~2–3 hours
