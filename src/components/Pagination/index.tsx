// components/Pagination.tsx
// import React from 'react';
// import ReactTooltip from 'react-tooltip';
import Link from 'next/link';
import { allPosts } from "contentlayer/generated";


allPosts.sort((a, b) => {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
});

interface PaginationProps {
  currentPageTitle: string;
  currentPage: number;
  totalPages: number;
  //basePath: string; // e.g., "/blog" or "/products"
}



export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  const prevPage = currentPage - 1;
  const nextPage = currentPage + 1;

  const nextPageTitle: string = allPosts[currentPage + 1]?.title || '';
  const prevPageTitle: string = allPosts[currentPage - 1]?.title || '';
  const prevPagesubTitle: string = allPosts[currentPage - 1]?.subtitle || '';
  const nextPageSubTitle: string = allPosts[currentPage + 1]?.subtitle || '';


  return (
    <>
    <span className="text-xs py-2 text-gray-700"> {currentPage +1} / {totalPages} </span>
    <div className="flex justify-center mt-8 space-x-4">
            <Link
        href={allPosts[prevPage]?.slug ? `/${allPosts[prevPage]?.slug}` : '/'}
        className={`px-4 py-2 rounded-md border ${
          currentPage === 0
            ? 'bg-gray-200 text-gray-400'
            : 'bg-white border-gray-600 hover:bg-blue-100'
        }`}
        aria-disabled={currentPage === 1}
        title= {prevPagesubTitle ? prevPagesubTitle : ''}
      >
       ◀️ {prevPageTitle}

      </Link>
      
      {/* <Link href="/">Home</Link> */}

      <Link
        href={allPosts[nextPage]?.slug ? `/${allPosts[nextPage]?.slug}` : '/'}
        className={`px-4 py-2 rounded-md border ${
          currentPage  === totalPages - 1
            ? 'bg-gray-200 text-gray-400'
            : 'bg-white border-gray-600 hover:bg-blue-100'
        }`}
        aria-disabled={currentPage === totalPages - 1}
        title= {nextPageSubTitle ? nextPageSubTitle : ''}
      >
         {nextPageTitle} ▶️

      </Link>

    </div>
    </>
  );
}
