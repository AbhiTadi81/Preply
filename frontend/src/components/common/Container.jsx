export const Container = ({
  children,
  className = "",
  size = "lg"
}) => {
  const sizeClasses = {
    sm: "max-w-4xl",
    md: "max-w-5xl",
    lg: "max-w-6xl",
    full: "max-w-7xl"
  };
  return <div className={`w-full mx-auto px-4 sm:px-6 lg:px-8 ${sizeClasses[size]} ${className}`}>
      {children}
    </div>;
};
