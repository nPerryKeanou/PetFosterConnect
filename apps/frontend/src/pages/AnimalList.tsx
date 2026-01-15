import AnimalCard from "../components/AnimalCard";
import { mockAnimalList } from "../mocks/animalList.mock";

const animals = mockAnimalList;

const AnimalList = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Nos animaux à adopter
          </h1>
          <p className="text-gray-600">
            Découvrez tous nos compagnons qui attendent une famille aimante
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {animals.map((animal) => (
            <AnimalCard key={animal.id} {...animal} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnimalList;
