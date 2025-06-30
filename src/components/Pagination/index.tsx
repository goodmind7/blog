// components/Pagination.tsx
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
  const prevPage = currentPage + 1;
  const nextPage = currentPage - 1;

  const nextPageTitle: string = allPosts[currentPage - 1]?.title || '';
  const prevPageTitle: string = allPosts[currentPage + 1]?.title || '';
  const currentPageTitle: string = allPosts[currentPage]?.title || '';
  console.log(currentPage, nextPageTitle, prevPageTitle, currentPageTitle);


  return (
    <div className="flex justify-center mt-8 space-x-4">
      <Link
        href={`${allPosts[nextPage]?.slugAsParams[1]}`}
        className={`px-4 py-2 rounded-md border ${
          currentPage === 0
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-100'
        }`}
        aria-disabled={currentPage === totalPages + 1}
      >
         {nextPageTitle}
        
      </Link>

      <span className="px-4 py-2 text-gray-700">
        Page {currentPage +1} of {totalPages}
      </span>

      <Link
        href={`${allPosts[prevPage]?.slugAsParams[1]}`}
        className={`px-4 py-2 rounded-md border ${
          currentPage === totalPages
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-100'
        }`}
        aria-disabled={currentPage === -1}
      >
       {prevPageTitle}
        
      </Link>
    </div>
  );
}
