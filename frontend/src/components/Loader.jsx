import React from 'react';

const Loader = ({ fullScreen = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-gold/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-gold rounded-full border-t-transparent animate-spin"></div>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-dark z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return <div className="py-20 flex justify-center">{content}</div>;
};

export default Loader;
