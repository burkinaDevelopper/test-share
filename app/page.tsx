"use client";
import Image from "next/image";
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
  const db = getDatabase(app);
  
  useEffect(() => {
    const textsRef = ref(db, 'texts/');
    onValue(textsRef, (snapshot) => {
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
    <div className="flex justify-center  bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">📝 Partage de texte</h1>
          <p className="text-gray-600">Partagez et gérez vos textes facilement</p>
        </div>

        {/* Formulaire d'ajout */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <textarea 
            className="w-full p-4 border-2 border-gray-200 rounded-xl mb-4 focus:outline-none focus:border-blue-500 transition-colors resize-none"
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Entrez votre texte ici..."
          />
          <button 
            onClick={submit}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 cursor-pointer text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
          >
            ✨ Envoyer
          </button>
        </div>

        {/* Liste des textes */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Textes enregistrés</h2>
          {texts.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <p className="text-gray-400 text-lg">📭 Aucun texte enregistré</p>
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              {texts.map((text) => (
                <div key={text.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-800 mb-3 whitespace-pre-wrap break-words">{text.content}</p>
                      <p className="text-sm text-gray-400 flex items-center gap-1">
                        🕒 {new Date(text.createdAt).toLocaleString('fr-FR')}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <button
                        onClick={() => copyToClipboard(text.content, text.id)}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 cursor-pointer text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-emerald-700 text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg min-w-[100px]"
                      >
                        {copiedId === text.id ? '✓ Copié !' : '📋 Copier'}
                      </button>
                      <button
                        onClick={() => deleteText(text.id)}
                        className="bg-gradient-to-r from-red-500 to-rose-600 cursor-pointer text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-rose-700 text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg"
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
