import { useState } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { toast } from "react-toastify";
import api from "../../../api/api"; // ✅ Import par défaut correct

type Props = {
  userId: number;
};

export default function PasswordForm({ userId }: Props) {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Petit check rapide côté client avant d'envoyer
    if (!formData.oldPassword || !formData.newPassword) {
      toast.warning("Veuillez remplir tous les champs.");
      return;
    }

    try {
      // ✅ Utilisation de l'instance api centralisée
      await api.put(`/users/${userId}/password`, formData);

      toast.success("Mot de passe modifié avec succès ! ✨");
      setFormData({ oldPassword: "", newPassword: "" });
      setShowPassword(false);
      setShowOldPassword(false);
    } catch (error: any) {
      console.error("Erreur changement password:", error);
      // ✅ On récupère le message précis du backend (ex: "Ancien mot de passe incorrect")
      const message = error.response?.data?.message || "Erreur lors de la modification";
      toast.error(message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
      {/* Ancien mot de passe */}
      <div className="relative"> 
        <label className="block text-sm font-semibold text-gray-700">Ancien mot de passe</label> 
        <div className="relative mt-1">
          <input 
            type={showOldPassword ? "text" : "password"} 
            value={formData.oldPassword} 
            onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value }) }
            className="border border-gray-300 rounded-lg p-2.5 w-full pr-10 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
            placeholder="••••••••"
          /> 
          <button type="button" 
            onClick={() => setShowOldPassword(!showOldPassword)} 
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors" 
          > 
            {showOldPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />} 
          </button>
        </div>
      </div> 

      {/* Nouveau mot de passe */}
      <div className="relative">
        <label className="block text-sm font-semibold text-gray-700">Nouveau mot de passe</label>
        <div className="relative mt-1">
          <input
            type={showPassword ? "text" : "password"}
            value={formData.newPassword}
            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
            className="border border-gray-300 rounded-lg p-2.5 w-full pr-10 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
            placeholder="Nouveau mot de passe"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        className="bg-primary hover:bg-primary-dark text-white font-bold px-6 py-2.5 rounded-lg w-full transition shadow-md transform active:scale-95"
      >
        Mettre à jour le mot de passe
      </button>
    </form>
  );
}