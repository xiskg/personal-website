import {
  ArrowClockwise,
  ArrowCounterClockwise,
  ListBullets,
  TextB,
  TextItalic,
} from '@phosphor-icons/react';
import { EditorContent, useEditor, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

function ToolBtn({
  active,
  disabled,
  onClick,
  title,
  children,
}: {
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className="wobbly-subtle flex h-8 w-8 items-center justify-center disabled:opacity-30"
      style={{
        backgroundColor: active ? 'var(--ink)' : 'transparent',
        color: active ? 'var(--paper)' : 'var(--ink)',
      }}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  return (
    <div className="rich-toolbar">
      <ToolBtn
        title="Bold"
        active={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <TextB size={16} weight="bold" />
      </ToolBtn>
      <ToolBtn
        title="Italic"
        active={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <TextItalic size={16} weight="bold" />
      </ToolBtn>
      <ToolBtn
        title="Bullet list"
        active={editor.isActive('bulletList')}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <ListBullets size={16} weight="bold" />
      </ToolBtn>
      <span className="mx-1 self-stretch border-l-2 border-dashed" style={{ borderColor: 'var(--paper-line)' }} />
      <ToolBtn
        title="Undo"
        disabled={!editor.can().undo()}
        onClick={() => editor.chain().focus().undo().run()}
      >
        <ArrowCounterClockwise size={16} weight="bold" />
      </ToolBtn>
      <ToolBtn
        title="Redo"
        disabled={!editor.can().redo()}
        onClick={() => editor.chain().focus().redo().run()}
      >
        <ArrowClockwise size={16} weight="bold" />
      </ToolBtn>
    </div>
  );
}

/** Editor rich-text (TipTap). value/onChange trafegam HTML.
 *  Dê um `key` que mude ao trocar de case para reinicializar o conteúdo. */
export function RichText({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (html: string) => void;
}) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  return (
    <div>
      <span className="field-label">{label}</span>
      <div className="rich-editor">
        {editor && <Toolbar editor={editor} />}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
