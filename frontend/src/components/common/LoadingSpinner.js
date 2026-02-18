export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-6 sm:py-8">
      <div className="animate-spin rounded-full h-8 sm:h-10 w-8 sm:w-10 border-b-2 border-primary"></div>
    </div>
  );
}