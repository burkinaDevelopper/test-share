import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import axios from "axios";


export const authOptions:NextAuthOptions = {
    // Configure one or more authentication providers
    providers: [
      
      CredentialsProvider({
        name: 'credentials',
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" }
        },
        async authorize(credentials:Record<"email"|"password",string> | undefined, req) {
          console.log('🔐 Tentative de connexion avec:', credentials);
          
          if(!credentials){
            console.log('❌ Pas de credentials fournis');
            return null
          }
          try {
            const baseUrl= process.env.NEXT_PUBLIC_API_URL;
            console.log('🌐 API URL:', baseUrl);
            
            // Configuration pour Laravel Sanctum
            console.log('🍪 Récupération du cookie CSRF...');
            await axios.get(`${baseUrl}/sanctum/csrf-cookie`, {
              withCredentials: true
            });
            
            console.log('📤 Envoi de la requête de login...');
            const response = await axios.post(
              `${baseUrl}/api/login`,
              {
                email: credentials.email,
                password: credentials.password
              },
              {
                headers: {
                  "Accept": "application/json",
                  "Content-Type": "application/json"
                },
                withCredentials: true
              }
            );

            console.log('✅ Réponse API reçue:', response.data);
            
            const user = response.data.user;
            const token = response.data.token;
            
            if (!user) {
              console.log('❌ Aucun utilisateur dans la réponse');
              return null;
            }
            
            console.log('✅ Utilisateur authentifié:', user);
            return {
              id: user.id.toString(),
              email: user.email,
              name: user.name,
              role: user.role,
              accessToken: token, // Stocker le token Laravel
            };
          } catch (error: any) {
            console.error('❌ Erreur d\'authentification:', {
              message: error.message,
              response: error.response?.data,
              status: error.response?.status
            });
            return null;
          }
        }
      })
    ],
    callbacks: {
      async jwt({ token, user, trigger, session }) {
        // Lors de la première connexion, ajouter les données utilisateur et le token
        if (user) {
          token.id = user.id as string;
          token.email = user.email as string;
          token.name = user.name as string;
          token.role = (user as any).role;
          token.accessToken = (user as any).accessToken;
        }
        
        if(trigger === "update" && session){
          return {...token, ...session.user}
        }
        
        return token;
      },
      async session({ session, token }) {
        // Ajouter les données du token à la session
        if (token && session.user) {
          session.user.id = token.id;
          session.user.email = token.email;
          session.user.name = token.name;
          session.user.role = token.role;
          session.accessToken = token.accessToken;
        }
        return session;
      }
    },
    pages: {
      signIn: "/login", // Page de connexion personnalisée
    },
    session: {
      strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
  }