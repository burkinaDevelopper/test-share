'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';


export default function Home() {

    const [data, setData] = useState([]);
    const [personnes, setPersonnes] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Fonction pour regrouper les données par index
    const regrouperDonnees = (profile: any) => {
        const noms = profile.Nom.tops;
        const prenoms = profile.Prenom.tops;
        const adresses = profile.Adresse.tops;
        const mails = profile.email.tops;
        const tels1 = profile.Tel1.tops;
        const tels2 = profile.Tel2.tops;
        const certificats = profile["Type de certificat"].tops;
        const debut = profile["Date début validité"].tops;
        const fin = profile["Date fin validité"].tops;
        const ville = profile.Ville.tops;

        // Créer un tableau d'objets en regroupant par index
        const resultat = noms.map((nom: any, index: number) => ({
            nom: nom?.value || '',
            prenom: prenoms[index]?.value || '',
            adresse: adresses[index]?.value || '',
            email: mails[index]?.value || '',
            tel1: tels1[index]?.value || '',
            tel2: tels2[index]?.value || '',
            certificat: certificats[index]?.value || '',
            dateDebut: debut[index]?.value || '',
            dateFin: fin[index]?.value || '',
            ville: ville[index]?.value || '',
        }));

        return resultat;
    };

    const fetchData = async () => {
        setLoading(true);
        // Appeler votre API route Next.js au lieu de l'API externe directement
        await axios.get('/api/tabulaire/profile')
        .then(function (response) {
            console.log(response);
            console.log(response.data.profile.profile);
            setData(response.data);
            
            // Regrouper les données en objets
            const personnesGroupees = regrouperDonnees(response.data.profile.profile);
            setPersonnes(personnesGroupees);
            console.log('Personnes groupées:', personnesGroupees);
        })
        .catch(function (error) {
            console.log(error);
        })
        .finally(function () {
            setLoading(false);
        });
    }

    useEffect(() => {
        fetchData();
    }, []);

  return (
    <div className="container py-5">
      <h1 className="mb-4">Données Tabulaires</h1>
      
      {loading && (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      )}
      
      {!loading && personnes.length > 0 && (
        <div className="row">
          {personnes.map((personne, index) => (
            <div key={index} className="col-md-6 mb-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{personne.nom} {personne.prenom}</h5>
                  <hr />
                  <p className="mb-2"><strong>Email:</strong> {personne.email}</p>
                  <p className="mb-2"><strong>Téléphone 1:</strong> {personne.tel1}</p>
                  <p className="mb-2"><strong>Téléphone 2:</strong> {personne.tel2}</p>
                  <p className="mb-2"><strong>Adresse:</strong> {personne.adresse}</p>
                  <p className="mb-2"><strong>Ville:</strong> {personne.ville}</p>
                  <p className="mb-2"><strong>Certificat:</strong> {personne.certificat}</p>
                  <p className="mb-2"><strong>Date début:</strong> {personne.dateDebut}</p>
                  <p className="mb-0"><strong>Date fin:</strong> {personne.dateFin}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
