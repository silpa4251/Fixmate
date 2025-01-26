

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col items-center space-y-4">
        {/* Spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 border-4 border-blue-300 border-b-transparent rounded-full animate-spin reverse-spin"></div>
        </div>
        {/* Text */}
        <h1 className="text-xl font-semibold text-gray-700 animate-pulse">
          Loading...
        </h1>
        <p className="text-gray-500">Please wait while we load your content.</p>
      </div>
    </div>
  );
};

export default Loading;
