export default function Navbar() {
  return (
    <nav className="absolute top-0 w-full flex justify-between items-center p-6 z-20">
      <div className="text-white text-lg font-semibold flex items-center gap-2">
        <img src="/logo.svg" className="w-6" /> Coffee Shop
      </div>

      <button className="px-4 py-1 bg-black/70 text-white rounded-lg">
        Coffees
      </button>
    </nav>
  );
}
