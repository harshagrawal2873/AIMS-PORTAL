import React from 'react';

const Loader = ({ route }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
    <div className="text-white text-lg">
      Loading {route}...
    </div>
  </div>
);

export default Loader;
