export default function Hero() {
  return (
    <section className="relative w-full h-[500px]">
      <img
        src="/hero.jpg"
        className="w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black/40"></div>

      <div className="absolute left-10 top-1/3 text-white space-y-4">
        <p className="text-lg tracking-wide">SIMPLY CLEVER</p>
        <h1 className="text-6xl font-serif">BEST COFFEE</h1>
        <p className="text-sm max-w-sm">
          Lorem ipsum dolor sit amet dolor
        </p>
      </div>
    </section>
  );
}
