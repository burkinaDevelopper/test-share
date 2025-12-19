'use client';
import axios from "axios";
import { use, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from 'next/navigation';
import useStorePost from "@/app/stores/post";
import { log } from "console";

export default function Home() {
 
  const {posts, getPosts}=useStorePost();
  useEffect(()=>{
    getPosts()
  },[])
  
  const router = useRouter();
  const { data: session } = useSession();
  console.log(session?.user);
  

  const handleSignOut = async () => {
    try {
      const baseUrl= process.env.NEXT_PUBLIC_API_URL;
      // Déconnexion de Laravel
      await axios.post(baseUrl+"/api/logout");
    } catch (error) {
      console.error("Erreur lors de la suppression du token Laravel :", error);
    } finally {
      // Déconnexion NextAuth et redirection vers login
      signOut({ callbackUrl: '/login',redirect: false, });
    }
  };

  return (
    <div className="">
      dashboard {session?.user?.name}
      <Button onClick={handleSignOut}>Logout</Button>

      <div>
        {posts && posts.map((post:any)=>(
          <div key={post.id}>
            <h3>{post.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
