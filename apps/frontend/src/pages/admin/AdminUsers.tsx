import { useState, useEffect } from "react";
import { Trash2, Search, RotateCcw } from "lucide-react";
import Badge from "../../components/ui/Badge";
import Loader from "../../components/ui/Loader";
import { api } from "../../api/api";
import type { User } from "@projet/shared-types";

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // Fetch
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get<User[]>("/users");
        setUsers(res.data);
      } catch (error) {
        console.error("Erreur chargement users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // LOGIQUE DE FILTRAGE
  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // ACTION : BANNIR (Soft Delete)
  const handleDelete = async (id: number) => {
    if (confirm("Voulez-vous vraiment bannir cet utilisateur ?")) {
      try {
        await api.delete(`/users/${id}`);
        // Mise à jour
        setUsers(users.map(u => u.id === id ? { ...u, deletedAt: new Date() } : u));
      } catch (error) {
        alert("Erreur lors de la suppression");
      }
    }
  };

  // ACTION : RESTAURER
  const handleRestore = async (id: number) => {
    if (confirm("Restaurer cet utilisateur ?")) {
      try {
        // On envoie deletedAt: null (nécessite que le DTO Back l'autorise)
        await api.patch(`/users/${id}`, { deletedAt: null });
        setUsers(users.map(u => u.id === id ? { ...u, deletedAt: null } : u));
      } catch (error) {
        alert("Erreur lors de la restauration");
      }
    }
  };

  if (loading) return <Loader text="Chargement des utilisateurs..." />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 font-montserrat">Gestion des Utilisateurs</h1>
      </div>

      {/* BARRE D'OUTILS */}
      <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Rechercher par email..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:border-primary cursor-pointer"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">Tous les rôles</option>
          <option value="individual">Particuliers</option>
          <option value="shelter">Refuges</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {/* TABLEAU */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Rôle</th>
              <th className="px-6 py-4 hidden sm:table-cell">Date Inscription</th>
              <th className="px-6 py-4">Statut</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-500">#{user.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{user.email}</td>
                  <td className="px-6 py-4">
                    <Badge 
                      label={user.role} 
                      className={
                        user.role === 'admin' ? 'text-purple-700' :
                        user.role === 'shelter' ? 'text-orange-700' :
                        'text-blue-700'
                      }
                    />
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell text-gray-500">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}
                  </td>
                  <td className="px-6 py-4">
                    <Badge 
                      label={user.deletedAt ? "Banni" : "Actif"} 
                      variant={user.deletedAt ? "error" : "success"}
                    />
                  </td>
                  <td className="px-6 py-4 text-right">
                    {user.deletedAt ? (
                      <button 
                        type="button"
                        onClick={() => user.id && handleRestore(user.id)}
                        className="text-primary hover:bg-orange-50 p-2 rounded-full transition-colors inline-flex items-center gap-1"
                        title="Restaurer l'utilisateur"
                      >
                        <RotateCcw className="w-4 h-4" /> Restaurer
                      </button>
                    ) : (
                      <button 
                        type="button"
                        onClick={() => user.id && handleDelete(user.id)}
                        className="text-gray-400 hover:text-error hover:bg-red-50 p-2 rounded-full transition-colors"
                        title="Bannir l'utilisateur"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  Aucun utilisateur trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}