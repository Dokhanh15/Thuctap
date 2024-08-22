import { useStatus } from "src/contexts/Status";

const Loading = () => {
  const { loading } = useStatus();
  return (
    <div>
      {loading && (
        <div className=" flex justify-center">
          <div>
            <div className="spinner-border text-danger" role="status">
            </div>
            <div className="spinner-border text-warning" role="status">
            </div>
            <div className="spinner-border text-info" role="status">
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Loading;
