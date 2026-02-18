export default function ErrorAlert({ message }) {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded text-sm sm:text-base mb-4">
      {message}
    </div>
  );
}