import { mockShelters } from "../mocks/Shelter.mock";
import ShelterCard from "../components/ShelterCard";

// TODO connecter à la BDD

const SheltersPage = () => (
    <div className="p-8">
        <h1 className="text-3xl font-bold mb-6 text-center font-montserrat">Nos refuges partenaires</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
        {mockShelters.map((shelter) => (
        <ShelterCard key={shelter.pfc_user_id} {...shelter} />
            ))}
        </div>
    </div>
);

export default SheltersPage;
