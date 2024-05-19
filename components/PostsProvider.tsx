'use client'
import React, { createContext,useState, useEffect } from 'react';
import { getSortedPostsData, Post } from '../lib/post';

// Define the type for the context value
interface PostsContextValue {
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
}

export const PostsContext = createContext<PostsContextValue>({
  posts: [],
  setPosts: () => {},
});




const PostsProvider =({ children }: {children: any}) => {
  const [posts, setPosts] =  useState<Post[]>([])

  useEffect(() => {
      getSortedPostsData().then(posts => {
        setPosts(posts)
      })
  }, []);

  return (
    <PostsContext.Provider value={{posts, setPosts}}>
      {children}
    </PostsContext.Provider>
  );
};



export default PostsProvider;