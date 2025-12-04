export default function CoffeeCard({ item }) {
  return (
    <div className="bg-white rounded-xl shadow p-3">
      <img
        src={item.image}
        className="w-full h-48 object-cover rounded-lg"
      >

        <div className="mt-3 flex justify-between items-center">
          <div>
            <h3 className="font-semibold">{item.name}</h3>
            <p className="text-sm text-gray-500">${item.price}</p>
          </div>

          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9x5W43cYUfDmh01blJETvJVGuayMdFgdH3Q&s" className="w-6 h-6" />

        </div>
      </img>
    </div>
  );
}
