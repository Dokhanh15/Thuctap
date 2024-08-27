import { useStatus } from "src/contexts/Status";

const Loading = () => {
  const { loading } = useStatus();

  return (
    <div>
      {loading && (
        <div className="flex justify-center">
          <div className="flex space-x-2">
            <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-red-500"></div>
            <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-yellow-500"></div>
            <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Loading;
