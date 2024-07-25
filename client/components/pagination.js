import { useRouter } from 'next/router';
import { memo } from 'react';

const Pagination = memo(({ totalPages, currentPage, onPageChange }) => {
  const router = useRouter();

  const handlePageChange = (page) => {
    onPageChange(page);
    router.push(`/?page=${page}`, undefined, { shallow: true });
  };

  return (
    <nav className="flex items-center justify-between py-4 px-6 bg-white shadow-md rounded-lg">
      <button
        className={`text-gray-700 cursor-pointer ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'} px-4 py-2 border rounded-md`}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      <ul className="pagination flex space-x-2">
        {Array.from({ length: totalPages }, (_, index) => (
          <li key={index + 1}>
            <button
              className={`px-4 py-2 border rounded-md ${index + 1 === currentPage ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200'} transition-colors duration-300`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          </li>
        ))}
      </ul>
      <button
        className={`text-gray-700 cursor-pointer ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'} px-4 py-2 border rounded-md`}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </nav>
  );
});

Pagination.displayName = 'Pagination';

export default Pagination;
