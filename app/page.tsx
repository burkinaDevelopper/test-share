"use client";
import {app} from "./utilis/firebase";
import { getDatabase, ref, set, onValue, remove } from "firebase/database";
import { useState, useEffect } from "react";
import copy from "copy-to-clipboard";


interface TextData {
  content: string;
  createdAt: number;
  id: string;
}

export default function Home() {

  const [content,setContent]=useState<string>("")
  const [texts, setTexts] = useState<TextData[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [search, setSearch] = useState<string>("")
  const db = getDatabase(app);
  
  useEffect(() => {
    const textsRef = ref(db, 'texts/');
    const unsubscribe = onValue(textsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const textsArray: TextData[] = Object.keys(data).map(key => ({
          id: key,
          content: data[key].content,
          createdAt: data[key].createdAt
        }));
        // Trier par date décroissante (plus récent en premier)
        textsArray.sort((a, b) => b.createdAt - a.createdAt);
        setTexts(textsArray);
      } else {
        setTexts([]);
      }
    });

    return () => unsubscribe();
  }, [db]);
  
  const submit = () => {
    const timestamp = Date.now();
    set(ref(db, 'texts/' + timestamp), {
      content: content,
      createdAt: timestamp
    });
    setContent(""); // Réinitialiser le champ après l'envoi
  }

  const deleteText = (id: string) => {
    remove(ref(db, 'texts/' + id));
  }

  const copyToClipboard = (text: string, id: string) => {
    copy(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="flex min-h-screen justify-center bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 px-3 sm:px-4 ">
      <div className="mx-auto w-full max-w-3xl">
        {/* En-tête */}
        <div className="text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-800 sm:text-4xl">📝 Partage de texte</h1>
          <p className="text-gray-600">Partagez et gérez vos textes facilement</p>
        </div>

        {/* Formulaire d'ajout */}
        <div className="mb-2 rounded-2xl bg-white p-2 shadow-xl ">
          <textarea 
            className="w-full p-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors resize-none text-black"
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Entrez votre texte ici..."
          />
          <button 
            onClick={submit}
            className="w-full rounded-xl bg-linear-to-r from-blue-500 to-purple-600 px-6  text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:from-blue-600 hover:to-purple-700 hover:shadow-xl sm:py-1 sm:text-base cursor-pointer"
          >
            ✨ Envoyer
          </button>
        </div>
        <div className="search">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Rechercher un texte..."
            className="w-full p-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors text-black"
          />
        </div>

        {/* Liste des textes */}
        <div>
          <h2 className="text-center text-xl font-bold text-gray-800  sm:text-2xl">Textes enregistrés</h2>
          {texts.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 text-center shadow-lg sm:p-12">
              <p className="text-gray-400 text-lg">📭 Aucun texte enregistré</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4 sm:gap-6">
              {texts.filter((t) => t.content.toLowerCase().includes(search.toLowerCase())).map((text) => (
                <div key={text.id} className="rounded-xl bg-white p-2 shadow-lg transition-shadow duration-200 hover:shadow-xl ">
                  <div className="flex flex-col  sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex min-w-0 flex-1 flex-col">
                      <p className="whitespace-pre-wrap wrap-break-word text-gray-800">{text.content}</p>
                      <p className="flex items-center gap-1 text-xs text-gray-400 sm:text-sm">
                        🕒 {new Date(text.createdAt).toLocaleString('fr-FR')}
                      </p>
                    </div>
                    <div className="flex w-full shrink-0 gap-2 sm:w-auto sm:flex-col">
                      <button
                        onClick={() => copyToClipboard(text.content, text.id)}
                        className="min-w-0 flex-1 rounded-lg bg-linear-to-r from-green-500 to-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-all duration-200 hover:from-green-600 hover:to-emerald-700 hover:shadow-lg sm:min-w-25 sm:flex-none cursor-pointer"
                      >
                        {copiedId === text.id ? '✓ Copié !' : '📋 Copier'}
                      </button>
                      <button
                        onClick={() => deleteText(text.id)}
                        className="min-w-0 flex-1 rounded-lg bg-linear-to-r from-red-500 to-rose-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-all duration-200 hover:from-red-600 hover:to-rose-700 hover:shadow-lg sm:min-w-25 sm:flex-none cursor-pointer"
                      >
                        🗑️ Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
