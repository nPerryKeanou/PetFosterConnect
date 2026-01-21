import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import UserCard from "../profile/components/UserCard";
import IndividualProfileForm from "../profile/components/IndividualProfilForm";
import ShelterProfileForm from "../profile/components/ShelterProfilForm";

const API_URL = import.meta.env.VITE_API_URL;

export default function UserProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;
      const res = await fetch(`${API_URL}/users/${id}/profile`);
      const data = await res.json();
      setUser(data);

      if (data.role === "individual" && data.individualProfile) {
        setFormData({
          email: data.email ?? "",
          phoneNumber: data.phoneNumber ?? "",
          address: data.address ?? "",
          surface: data.individualProfile.surface ?? 0,
          housingType: data.individualProfile.housingType ?? "other",
          haveGarden: data.individualProfile.haveGarden ?? false,
          haveAnimals: data.individualProfile.haveAnimals ?? false,
          haveChildren: data.individualProfile.haveChildren ?? false,
        });
      } else if (data.role === "shelter" && data.shelterProfile) {
        setFormData({
          email: data.email ?? "",
          phoneNumber: data.phoneNumber ?? "",
          address: data.address ?? "",
          shelterName: data.shelterProfile.shelterName ?? "",
          siret: data.shelterProfile.siret ?? "",
          description: data.shelterProfile.description ?? "",
        });
      }
      setLoading(false);
    };
    fetchUser();
  }, [id]);

  if (loading) return <p>Chargement...</p>;
  if (!user) return <p>Utilisateur introuvable</p>;

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let endpoint = "";

    if (user.role === "individual") {
      endpoint = `${API_URL}/users/${user.id}/individual-profile`;
    } else {
      endpoint = `${API_URL}/users/${user.id}/shelter-profile`;
    }

    await fetch(endpoint, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    setIsEditing(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
        {!isEditing ? (
          <>
            <UserCard user={user} />
            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 bg-primary text-white px-4 py-2 rounded"
            >
              Modifier
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {user.role === "individual" ? (
              <IndividualProfileForm formData={formData} onChange={handleChange} />
            ) : (
              <ShelterProfileForm formData={formData} onChange={handleChange} />
            )}

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded"
              >
                Sauvegarder
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
