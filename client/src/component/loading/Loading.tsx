import { useLoading } from "src/contexts/loading";

const Loading = () => {
  const { loading } = useLoading();
  return (
    <div>
      {loading && (
        <div className=" flex justify-center">
          <div>
            <div className="spinner-border text-danger" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <div className="spinner-border text-warning" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <div className="spinner-border text-info" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Loading;
