import { Link, useParams } from "react-router-dom";
import { mockShelters } from "../mocks/Shelter.mock";
import { mockAnimalList } from "../mocks/animalList.mock";
import _AnimalCard from "../components/AnimalCard";
import BackBanner from "../components/ui/BackBanner";

// TODO connecter à la BDD

const ShelterAnimalsPage = () => {
  const { id } = useParams(); // récupère l'id de l'URL
  const shelter = mockShelters.find((s) => s.pfc_user_id.toString() === id);

  return (
  <div className="bg-bgapp font-openSans text-gray-800">
    <BackBanner to="/refuges" />
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        {shelter
          ? `Animaux du ${shelter.shelter_name}`
          : "Animaux du refuge"}
      </h1>

      <div className="grid grid-cols-3 gap-6">
        {mockAnimalList
          .filter((animal) => animal.pfc_user_id.toString() === id)
          .map((animal) => (
            < Link key={animal.id} to={`/animaux/${animal.id}`}>
            <_AnimalCard {...animal} />
            </Link>
          ))}
      </div>
    </div>
  </div> 
  );
};

export default ShelterAnimalsPage;
