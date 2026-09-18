import { useEffect, useRef, useState } from "react";

import { EditorContent, useEditor } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";

import Link from "@tiptap/extension-link";

import { Placeholder } from "@tiptap/extension-placeholder";

import Highlight from "@tiptap/extension-highlight";

const App = () => {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [boldActive, setBoldActive] = useState(false);
  const [italicActive, setItalicActive] = useState(false);
  const [strikeActive, setStrikeActive] = useState(false);
  const [highlightActive, setHighlightActive] = useState(false);

  const [h1Active, setH1Active] = useState(false);
  const [h2Active, setH2Active] = useState(false);
  const [h3Active, setH3Active] = useState(false);

  const [bulletListActive, setBulletListActive] = useState(false);
  const [orderedListActive, setOrderedListActive] = useState(false);

  const [blockquoteActive, setBlockquoteActive] = useState(false);

  const [codelineActivate, setCodelineActivate] = useState(false);
  const [codeblockActivate, setCodeblockActivate] = useState(false);
  useEffect(() => {
    return () => {
      clearTimeout(timer.current!);
    };
  }, []);
  const editor = useEditor({
    extensions: [
      StarterKit,

      Link,

      Placeholder.configure({
        placeholder: "Commencer à écrire...",
      }),

      Highlight,
    ],

    content: `Aucune note`,

    onCreate: ({ editor }) => {
      const request = indexedDB.open("CosyNoteDB", 1);

      request.onsuccess = () => {
        const db = request.result;

        const transaction = db.transaction("notes", "readonly");

        const store = transaction.objectStore("notes");

        const requestNote = store.get(1);

        requestNote.onsuccess = () => {
          const note = requestNote.result;

          if (note) {
            editor.commands.setContent(note.content);
          }
        };
      };
    },

    onSelectionUpdate: ({ editor }) => {
      setBoldActive(editor.isActive("bold"));

      setItalicActive(editor.isActive("italic"));

      setStrikeActive(editor.isActive("strike"));

      setHighlightActive(editor.isActive("highlight"));

      setH1Active(
        editor.isActive("heading", {
          level: 1,
        }),
      );

      setH2Active(
        editor.isActive("heading", {
          level: 2,
        }),
      );

      setH3Active(
        editor.isActive("heading", {
          level: 3,
        }),
      );

      setBulletListActive(editor.isActive("bulletList"));

      setOrderedListActive(editor.isActive("orderedList"));

      setBlockquoteActive(editor.isActive("blockquote"));

      setCodelineActivate(editor.isActive("code"));

      setCodeblockActivate(editor.isActive("codeBlock"));
    },

    onUpdate: ({ editor }) => {
      clearTimeout(timer.current!);

      timer.current = setTimeout(() => {
        const request = indexedDB.open("CosyNoteDB", 1);

        request.onsuccess = () => {
          const db = request.result;

          const transaction = db.transaction("notes", "readwrite");

          const store = transaction.objectStore("notes");

          const note = {
            title: "Ma première note",
            content: editor.getJSON(),
            updatedAt: new Date(),
          };

          store.put(note, 1);

          console.log("💾 Note sauvegardée !");
        };
      }, 1000);
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold">Mon éditeur</h1>

      <button
        className={boldActive ? "btn btn-secondary" : "btn"}
        onClick={() => {
          editor?.chain().focus().toggleBold().run();
        }}
      >
        Gras
      </button>

      <button
        className={italicActive ? "mx-2 btn btn-secondary" : "mx-2 btn"}
        onClick={() => {
          editor?.chain().focus().toggleItalic().run();
        }}
      >
        Italique
      </button>

      <button
        className={strikeActive ? "mx-2 btn btn-secondary" : "mx-2 btn"}
        onClick={() => {
          editor?.chain().focus().toggleStrike().run();
        }}
      >
        Barré
      </button>

      <button
        className={highlightActive ? "mx-2 btn btn-secondary" : "mx-2 btn"}
        onClick={() => {
          editor?.chain().focus().toggleHighlight().run();
        }}
      >
        Surligner
      </button>

      <button
        className={h1Active ? "mx-2 btn btn-secondary" : "mx-2 btn"}
        onClick={() => {
          editor?.chain().focus().toggleHeading({ level: 1 }).run();
        }}
      >
        H1
      </button>

      <button
        className={h2Active ? "mx-2 btn btn-secondary" : "mx-2 btn"}
        onClick={() => {
          editor?.chain().focus().toggleHeading({ level: 2 }).run();
        }}
      >
        H2
      </button>

      <button
        className={h3Active ? "mx-2 btn btn-secondary" : "mx-2 btn"}
        onClick={() => {
          editor?.chain().focus().toggleHeading({ level: 3 }).run();
        }}
      >
        H3
      </button>

      <button
        className={bulletListActive ? "mx-2 btn btn-secondary" : "mx-2 btn"}
        onClick={() => {
          editor?.chain().focus().toggleBulletList().run();
        }}
      >
        Liste
      </button>

      <button
        className={orderedListActive ? "mx-2 btn btn-secondary" : "mx-2 btn"}
        onClick={() => {
          editor?.chain().focus().toggleOrderedList().run();
        }}
      >
        OL
      </button>

      <button
        className={blockquoteActive ? "mx-2 btn btn-secondary" : "mx-2 btn"}
        onClick={() => {
          editor?.chain().focus().toggleBlockquote().run();
        }}
      >
        Citation
      </button>

      <button
        className={codelineActivate ? "mx-2 btn btn-secondary" : "mx-2 btn"}
        onClick={() => {
          editor?.chain().focus().toggleCode().run();
        }}
      >
        CodeLine
      </button>

      <button
        className={codeblockActivate ? "mx-2 btn btn-secondary" : "mx-2 btn"}
        onClick={() => {
          editor?.chain().focus().toggleCodeBlock().run();
        }}
      >
        CodeBlock
      </button>

      <button
        className="mx-2 btn"
        onClick={() => {
          editor?.chain().focus().setHorizontalRule().run();
        }}
      >
        Ligne
      </button>

      <button
        className="mx-2 btn btn-active"
        onClick={() => {
          editor?.chain().focus().undo().run();
        }}
      >
        Annuler
      </button>

      <button
        className="mx-2 btn btn-active"
        onClick={() => {
          editor?.chain().focus().redo().run();
        }}
      >
        Rétablir
      </button>

      <button
        className="mx-2 btn btn-active"
        onClick={() => {
          editor
            ?.chain()
            .focus()
            .setLink({
              href: "https://youtube.com",
            })
            .run();
        }}
      >
        Lien
      </button>

      <button
        className="mx-2 btn btn-active"
        onClick={() => {
          editor?.chain().focus().unsetLink().run();
        }}
      >
        retrait
      </button>

      <EditorContent editor={editor} className="border-2 m-4 rounded-sm" />
    </div>
  );
};

export default App;
