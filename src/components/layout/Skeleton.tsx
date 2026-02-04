type Props = {
  width?: number;
  height?: number;
};
const Skeleton = ({ width, height }: Props) => {
  return (
    <div
      className="flex h-full"
      style={width && width > 640 ? { height: height } : { height: "fit" }}
    >
      <div className="flex-1 container mx-auto p-4 h-full">
        <div className="flex items-center space-x-4 p-4 border-b border-gray-200">
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-100 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-100 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-100 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="flex items-center space-x-4 p-4 border-b border-gray-200">
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-100 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-100 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-100 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="flex items-center space-x-4 p-4 border-b border-gray-200">
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-100 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-100 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-100 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="flex items-center space-x-4 p-4 border-b border-gray-200">
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-100 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-100 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-100 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Skeleton;
