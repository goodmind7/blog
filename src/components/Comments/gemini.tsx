// This is a self-contained React component demonstrating a full-stack comment system using TypeScript.
// In a real Next.js application, you would separate this into multiple files.
// I'll use comments to indicate where each piece of code should go.

//==============================================================================
// STEP 1: Environment Variables
// File: .env.local
// In a real project, create this file in your root directory.
// DO NOT commit this file to Git.
//==============================================================================

/*
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority
*/

//==============================================================================
// STEP 2: TypeScript Type Definitions
// File: types/index.ts (or a similar shared location)
// It's good practice to define shared types in a central file.
//==============================================================================
/*
import { ObjectId } from 'mongodb';

export interface Comment {
  _id: ObjectId | string; // ObjectId from DB, string for mock data
  author: string;
  text: string;
  createdAt: Date | string; // Date from DB, string for JSON
}
*/

//==============================================================================
// STEP 3: MongoDB Connection Utility
// File: lib/mongodb.ts
// This utility handles connecting to your MongoDB database with TypeScript.
//==============================================================================

/*
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

// In development mode, use a global variable so that the value
// is preserved across module reloads caused by HMR (Hot Module Replacement).
declare global {
  var _mongoClientPromise: Promise<MongoClient>;
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
*/

//==============================================================================
// STEP 4: The API Route
// File: pages/api/comments.ts
// This file handles GET and POST requests with Next.js API route types.
//==============================================================================

/*
import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';
import { Comment } from '../../types'; // Assuming types are in `types/index.ts`
import { ObjectId } from 'mongodb';

type ResponseData = Comment[] | { message: string } | Comment;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const client = await clientPromise;
  const db = client.db("your_database_name"); // Replace with your DB name

  switch (req.method) {
    case 'POST':
      try {
        const { author, text }: { author: string; text: string } = req.body;

        if (!author || !text) {
          return res.status(400).json({ message: 'Author and text are required.' });
        }

        const newComment = {
          author,
          text,
          createdAt: new Date(),
        };

        const result = await db.collection('comments').insertOne(newComment);
        
        const insertedComment = await db.collection<Comment>('comments').findOne({ _id: result.insertedId });
        
        if (!insertedComment) {
            return res.status(500).json({ message: 'Error retrieving inserted comment' });
        }
        
        res.status(201).json(insertedComment);
      } catch (error) {
        console.error('Failed to post comment:', error);
        res.status(500).json({ message: 'Error posting comment' });
      }
      break;
      
    case 'GET':
      try {
        const comments = await db
          .collection('comments')
          .find({})
          .sort({ createdAt: -1 })
          .toArray();

        res.status(200).json(comments as unknown as Comment[]);
      } catch (error) {
        console.error('Failed to fetch comments:', error);
        res.status(500).json({ message: 'Error fetching comments' });
      }
      break;
      
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
*/

//==============================================================================
// STEP 5: The Frontend Component
// File: components/CommentSection.tsx
// The React component, now fully typed with TypeScript.
//==============================================================================

import React, { useState, useEffect, FC, FormEvent } from 'react';

// --- Type Definition for this Demo ---
// This would typically be imported from `types/index.ts`
interface Comment {
  _id: string;
  author: string;
  text: string;
  createdAt: string;
}
// --- End of Type Definition ---


// --- Mock Data & Functions for this Demo ---
const initialComments: Comment[] = [
    { _id: '1', author: 'Alice', text: 'This is a fantastic post!', createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
    { _id: '2', author: 'Bob', text: 'Thanks for sharing, this was very helpful.', createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString() },
];

async function mockFetch(url: string, options: RequestInit = {}): Promise<Response> {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (options.method === 'POST') {
                const newCommentData = JSON.parse(options.body as string);
                const newComment: Comment = {
                    _id: Math.random().toString(36).substr(2, 9),
                    author: newCommentData.author,
                    text: newCommentData.text,
                    createdAt: new Date().toISOString(),
                };
                initialComments.unshift(newComment);
                resolve(new Response(JSON.stringify(newComment), { status: 201, headers: {'Content-Type': 'application/json'} }));
            } else { // GET request
                resolve(new Response(JSON.stringify([...initialComments]), { status: 200, headers: {'Content-Type': 'application/json'} }));
            }
        }, 500);
    });
}
// --- End of Mock Data & Functions ---

const SendIcon: FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
);


const CommentSection: FC = () => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [author, setAuthor] = useState<string>('');
    const [text, setText] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    useEffect(() => {
        const fetchComments = async () => {
            setIsLoading(true);
            try {
                // In real app: const res = await fetch('/api/comments');
                const res = await mockFetch('/api/comments'); 
                if (!res.ok) throw new Error('Failed to fetch comments');
                const data: Comment[] = await res.json();
                setComments(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchComments();
    }, []);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!author.trim() || !text.trim()) {
            // Using a simple alert for demo purposes. Consider a custom modal.
            alert("Please fill in both your name and comment.");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            // In real app: const res = await fetch('/api/comments', { ... });
            const res = await mockFetch('/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ author, text }),
            });

            if (!res.ok) throw new Error('Failed to submit comment');

            const newComment: Comment = await res.json();
            setComments(prevComments => [newComment, ...prevComments]);
            setText('');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-slate-50 font-sans p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg max-w-2xl mx-auto w-full">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-6 border-b-2 border-slate-200 pb-3">
                Join the Discussion
            </h2>

            <form onSubmit={handleSubmit} className="mb-8">
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Your Name"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200"
                        required
                    />
                    <textarea
                        placeholder="Write your comment here..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200"
                        required
                    />
                </div>
                <div className="mt-4 flex justify-end items-center">
                    {error && <p className="text-red-500 text-sm mr-4">{error}</p>}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-300"
                    >
                        {isSubmitting ? 'Submitting...' : 'Post Comment'}
                        {!isSubmitting && <SendIcon />}
                    </button>
                </div>
            </form>

            <div className="space-y-6">
                {isLoading ? (
                    <p className="text-slate-500 text-center">Loading comments...</p>
                ) : comments.length > 0 ? (
                    comments.map(comment => (
                        <div key={comment._id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
                            <div className="flex items-center mb-3">
                                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 mr-4">
                                    {comment.author.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800">{comment.author}</p>
                                    <p className="text-xs text-slate-500">
                                        {new Date(comment.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <p className="text-slate-700 leading-relaxed">{comment.text}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-slate-500 text-center">No comments yet. Be the first to post!</p>
                )}
            </div>
        </div>
    );
}

//==============================================================================
// STEP 6: The Main Page
// File: pages/index.tsx
// This page imports and displays your CommentSection component.
//==============================================================================

export default function App() {
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
        {/* The component is self-contained for this demo */}
        <CommentSection />
    </div>
  );
}
