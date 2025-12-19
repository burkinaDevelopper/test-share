import { create } from 'zustand'
import axios from "axios";

// Define types for state & actions
interface PostState {
  baseUrl?: string
  posts: any[]
  loading: boolean

  getPosts: () => void
}

const useStorePost = create<PostState>((set, get) => ({
  baseUrl: process.env.NEXT_PUBLIC_API_URL+'/api',
  loading: false,
  posts: [],
  
  getPosts() {
      set({ loading: true });
      const { baseUrl } = get();
      axios.get(baseUrl+'/posts')
      .then((response) => {
        if (response.status == 200) {
          set({ posts: response.data.posts });
          console.log(response);
        }
      })
      .catch((error) => {
        
        console.log(error);
      }).finally(() => {
        set({ loading: false });
      });
  },
}))

export default useStorePost;