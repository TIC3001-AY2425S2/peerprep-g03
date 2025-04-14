import { Link } from "react-router";

export default function HomeContent() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gradient-to-r from-gray-800 to-gray-900 text-white">
      <div className="w-full max-w-md flex flex-col items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mt-4 text-center">
          Welcome to PeerPrep
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-md text-center mt-2">
          Your go-to platform for coding practice, interview preparation, and
          collaboration.
        </p>

        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <Link to="/question">
            <button className="px-5 py-2 text-md font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Start Practicing
            </button>
          </Link>
          <a href="https://react.dev/" target="_blank" rel="noreferrer">
            <button className="px-5 py-2 text-md font-semibold bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
              Learn More
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}
