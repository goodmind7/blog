'use client';
import React, { useState, useEffect } from 'react';
import { allPosts } from 'contentlayer/generated';
// Assume allPosts is an array of post objects fetched from an API or defined locally
import type { Post } from 'contentlayer/generated';
import { Link } from '@sjoleee/react-cmdk/dist/components/ListItem';

// const allPosts: Post[] = [
//   { id: 1, title: 'First Post', content: 'This is the content of the first post.' },
//   { id: 2, title: 'Second Post', content: 'This is the content of the second post.' },
//   { id: 3, title: 'Third Post', content: 'This is the content of the third post.' },
//   { id: 4, title: 'Fourth Post', content: 'This is the content of the fourth post.' },
//   { id: 5, title: 'Fifth Post', content: 'This is the content of the fifth post.' },
// ];

const RandomPost = () => {
  const [randomPost, setRandomPost] = useState<Post | null>(null);

  const selectRandomPost = () => {
    const randomIndex = Math.floor(Math.random() * allPosts.length);
    setRandomPost(allPosts[randomIndex]);
  };

  // Select a random post when the component first mounts
  useEffect(() => {
    selectRandomPost();
  }, []); // The empty dependency array ensures this runs only once on mount

  if (!randomPost) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 rounded shadow-md bg-white my-20">
      <p className='text-sm text-gray-500 flex justify-between'>More for you 📌
      <button onClick={selectRandomPost}>🔄</button></p>
      <hr className='my-2' />
      <Link href={`/${randomPost.slug}`} className='hover:text-blue-800' index={0} title={randomPost.subtitle}>
        <span className='font-bold'>{randomPost.title}</span> &nbsp;
        <span>{randomPost.quote ? `- ${randomPost.quote}` : ''}</span>
      </Link>

    </div>
  );
};

export default RandomPost;