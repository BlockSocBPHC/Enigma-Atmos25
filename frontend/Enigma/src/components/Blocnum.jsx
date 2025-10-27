import React from 'react';

const Blocnum = ({ blocks }) => {
  return (
    <div className="flex justify-center items-center space-x-0">
      {blocks.map((b, i) => (
        <React.Fragment key={b.id}>
          <div
            className={`w-20 h-20 text-white font-bold shadow-md flex items-center justify-center
              ${b.status === 'pending' ? 'bg-gray-600' : ''}
              ${b.status === 'success' ? 'bg-green-600' : ''}
              ${b.status === 'failed' ? 'bg-red-600' : ''}
            `}
          >
            {i + 1}
          </div>

          {i !== blocks.length - 1 && (
            <div className="flex items-center">
              <svg
                className="w-12 h-14 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Blocnum;
