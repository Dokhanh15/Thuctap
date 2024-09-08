import React from "react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const createPaginationButtons = () => {
    let buttons = [];

    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`px-4 py-2 border rounded ${
            i === currentPage
              ? "bg-black text-white"
              : "bg-white text-black"
          } hover:bg-gray-200`}
        >
          {i}
        </button>
      );
    }

    return buttons;
  };

  return <div className="flex gap-2">{createPaginationButtons()}</div>;
};

export default Pagination;
