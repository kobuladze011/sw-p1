import CoffeeCard from "./CoffeeCard";
import { coffees } from "../data/coffees";

export default function CoffeeGrid() {
  return (
    <div className="py-14 px-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold">All Coffees</h2>
        <button className="px-3 py-1 bg-black text-white rounded">USD</button>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {coffees.map((item) => (
          <CoffeeCard key={item.id} item={item}/>
        ))}
      </div>
    </div>
  );
}
