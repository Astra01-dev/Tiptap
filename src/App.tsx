import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const App = () => {
  const editor = useEditor({
    extensions: [StarterKit],

    content: `
      <p>Premiere note</p>
      <p>Aujourd'hui, j'ai commencé mon projet CosyNote.</p>
    `,

    onCreate: ({ editor }) => {
      console.log("Tiptap est prêt !");
      console.log(editor.getJSON());
    },

    onUpdate: ({ editor }) => {
      console.log("Le contenu a changé :");
      console.log(editor.getJSON());
    },
  });

  const creerBase = () => {
    const request = indexedDB.open("CosyNoteDB", 1);

    request.onupgradeneeded = () => {
      const db = request.result;

      db.createObjectStore("notes");

      console.log("Base CosyNoteDB créée !");
    };

    request.onsuccess = () => {
      console.log("Connexion à CosyNoteDB réussie !");
    };

    request.onerror = () => {
      console.log("Erreur avec IndexedDB");
    };
  };

  const sauvegarderNote = () => {
    const request = indexedDB.open("CosyNoteDB", 1);

    request.onsuccess = () => {
      const db = request.result;

      const transaction = db.transaction("notes", "readwrite");

      const store = transaction.objectStore("notes");

      const note = {
        title: "Ma première note",
        content: "Bonjour CosyNote !",
        updatedAt: new Date(),
      };

      store.put(note, 1);

      console.log("Note sauvegardée !");
    };
  };
  const chargerNote = () => {
    const request = indexedDB.open("CosyNoteDB", 1);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction("notes", "readonly");
      const store = transaction.objectStore("notes");
      const requestNote = store.get(1);
      requestNote.onsuccess = () => {
        console.log("Note récupérée :");
        console.log(requestNote.result);
      };
    };
  };
  const mettreEditeur = () => {};
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

      <button className="mx-2 btn btn-active" onClick={creerBase}>
        Créer la base
      </button>

      <button className="mx-2 btn btn-active" onClick={sauvegarderNote}>
        Sauvegarder
      </button>
      <button className="mx-2 btn btn-active" onClick={chargerNote}>
        Charger
      </button>
      <EditorContent editor={editor} className="border-2 m-4 rounded-sm" />
    </div>
  );
};

export default App;
