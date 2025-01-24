
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-600">403</h1>
        <h2 className="mt-4 text-3xl font-semibold text-gray-800">
          Unauthorized Access
        </h2>
        <p className="mt-2 text-lg text-gray-600">
          Sorry, you don’t have permission to view this page.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="px-6 py-3 text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 transition-all"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
      {/* <div className="mt-10">
        <img
          src="https://via.placeholder.com/400x300" // Replace this with your actual image link
          alt="Unauthorized"
          className="rounded-lg shadow-lg"
        />
      </div> */}
    </div>
  );
};

export default Unauthorized;
