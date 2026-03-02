import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/api"; // ✅ Import par défaut correct
import IndividualProfileForm from "../profile/components/IndividualProfilForm";
import PasswordForm from "../profile/components/PasswordForm";
import ShelterProfileForm from "../profile/components/ShelterProfilForm";
import UserCard from "../profile/components/UserCard";
import { toast } from "react-toastify"; // ✅ Pour les retours utilisateurs

export default function UserProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;
      try {
        const res = await api.get(`/users/${id}/profil`);
        const data = res.data;
        setUser(data);

        // Pré-remplissage des formulaires selon le rôle
        if (data.role === "individual") {
          const profile = data.individualProfile || {};
          setFormData({
            email: data.email ?? "",
            phoneNumber: data.phoneNumber ?? "",
            address: data.address ?? "",
            surface: profile.surface ?? 0,
            housingType: profile.housingType ?? "other",
            haveGarden: profile.haveGarden ?? false,
            haveAnimals: profile.haveAnimals ?? false,
            haveChildren: profile.haveChildren ?? false,
            availableFamily: profile.availableFamily ?? false,
            availableTime: profile.availableTime ?? "",
          });
        } else if (data.role === "shelter") {
          const profile = data.shelterProfile || {};
          setFormData({
            email: data.email ?? "",
            phoneNumber: data.phoneNumber ?? "",
            address: data.address ?? "",
            shelterName: profile.shelterName ?? "",
            siret: profile.siret ?? "",
            description: profile.description ?? "",
          });
        }
      } catch (err) {
        console.error("Erreur API fetchUser:", err);
        toast.error("Impossible de charger le profil.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // ✅ Sélection dynamique de l'URL selon le rôle
    const endpoint = user.role === "individual" 
      ? `/users/${user.id}/individual-profile` 
      : `/users/${user.id}/shelter-profile`;

    try {
      // On retire le password des données de profil s'il existe
      const { password, ...profileData } = formData;

      // ✅ Utilisation de l'instance api (plus propre et sécurisé)
      const res = await api.put(endpoint, profileData);
      
      setUser({ ...user, ...res.data });
      setIsEditing(false);
      toast.success("Profil mis à jour avec succès ! ✨");
    } catch (err: any) {
      console.error("Erreur lors de la mise à jour:", err);
      const errorMsg = err.response?.data?.message || "Erreur lors de la sauvegarde";
      toast.error(errorMsg);
    }
  };

  if (loading) return <div className="p-10 text-center italic">Chargement du profil...</div>;
  if (!user) return <div className="p-10 text-center text-error font-bold">Utilisateur introuvable</div>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg border border-gray-100">
        {!isEditing ? (
          <>
            <UserCard user={user} />
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="mt-6 w-full bg-primary hover:bg-primary-dark text-white font-bold px-4 py-3 rounded-xl transition shadow-md"
            >
              Modifier mes informations
            </button>

            <div className="mt-8 border-t border-gray-100 pt-6">
              <h2 className="text-xl font-bold font-montserrat text-secondary mb-4">
                Sécurité
              </h2>
              <PasswordForm userId={user.id} />
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold text-secondary font-montserrat">
              Édition du profil
            </h2>
            
            {user.role === "individual" ? (
              <IndividualProfileForm formData={formData} onChange={handleChange} />
            ) : (
              <ShelterProfileForm formData={formData} onChange={handleChange} />
            )}

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold px-4 py-3 rounded-xl transition"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="flex-1 bg-primary hover:bg-primary-dark text-white font-bold px-4 py-3 rounded-xl transition shadow-md"
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