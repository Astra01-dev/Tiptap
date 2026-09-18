import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useRef } from "react";

const App = () => {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const editor = useEditor({
    extensions: [StarterKit],
    content: `Aucune note`,

    onCreate: ({ editor }) => {
      const request = indexedDB.open("CosyNoteDB", 1);

      request.onsuccess = () => {
        const db = request.result;

        const transaction = db.transaction("notes", "readonly");

        const store = transaction.objectStore("notes");

        const requestNote = store.get(1);

        requestNote.onsuccess = () => {
          console.log("Note récupérée :");
          console.log(requestNote.result);

          editor?.commands.setContent(requestNote.result.content);
        };
        requestNote.onsuccess = () => {
          const note = requestNote.result;

          if (note) {
            editor.commands.setContent(note.content);
          }
        };
      };
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

          console.log("Note sauvegardée !");
        };
      }, 1000);
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold">Mon éditeur</h1>

      <button
        className="btn btn-active"
        onClick={() => {
          editor?.chain().focus().toggleBold().run();
        }}
      >
        Gras
      </button>

      <button
        className="mx-2 btn btn-active"
        onClick={() => {
          editor?.chain().focus().toggleItalic().run();
        }}
      >
        Italique
      </button>

      <button
        className="mx-2 btn btn-active"
        onClick={() => {
          editor?.chain().focus().toggleHeading({ level: 1 }).run();
        }}
      >
        H1
      </button>

      <button
        className="mx-2 btn btn-active"
        onClick={() => {
          editor?.chain().focus().toggleHeading({ level: 2 }).run();
        }}
      >
        H2
      </button>

      <button
        className="mx-2 btn btn-active"
        onClick={() => {
          editor?.chain().focus().toggleHeading({ level: 3 }).run();
        }}
      >
        H3
      </button>

      <button
        className="mx-2 btn btn-active"
        onClick={() => {
          editor?.chain().focus().toggleBulletList().run();
        }}
      >
        Liste
      </button>

      <button
        className="mx-2 btn btn-active"
        onClick={() => {
          editor?.chain().focus().toggleOrderedList().run();
        }}
      >
        OL
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

      <EditorContent editor={editor} className="border-2 m-4 rounded-sm" />
    </div>
  );
};

export default App;
