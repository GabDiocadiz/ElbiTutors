
export default function FlowButton({ label, onClick, variant = "primary" }) {
  const baseStyles = "w-full py-3 px-6 rounded-full font-semibold transition-all mb-4";
  const variants = {
    primary: "bg-maroon-800 text-white hover:bg-maroon-900",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    green: "bg-green-700 text-white hover:bg-green-800",
  };

  return (
    <button onClick={onClick} className={`${baseStyles} ${variants[variant]}`}>
      {label}
    </button>
  );
}