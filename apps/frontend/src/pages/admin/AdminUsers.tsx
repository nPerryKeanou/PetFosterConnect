import { useState } from "react";
import { Trash2, Search, RotateCcw } from "lucide-react";
import Badge from "../../components/ui/Badge";

// TYPES & MOCK
type User = {
  id: number;
  email: string;
  role: "individual" | "shelter" | "admin";
  created_at: string;
  deleted_at: string | null;
};

const mockUsers: User[] = [
  { id: 1, email: "admin@pfc.com", role: "admin", created_at: "2024-01-01", deleted_at: null },
  { id: 2, email: "refuge@spa.com", role: "shelter", created_at: "2024-01-10", deleted_at: null },
  { id: 3, email: "jean.dupont@gmail.com", role: "individual", created_at: "2024-02-14", deleted_at: null },
  { id: 4, email: "marie.curie@science.fr", role: "individual", created_at: "2024-02-15", deleted_at: null },
  { id: 5, email: "spammer@evil.com", role: "individual", created_at: "2024-02-15", deleted_at: "2024-02-16" },
];

export default function AdminUsers() {
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  // LOGIQUE DE FILTRAGE
  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // ACTIONS
  const handleDelete = (id: number) => {
    if (confirm("Bannir cet utilisateur ?")) {
      setUsers(users.map(u => u.id === id ? { ...u, deleted_at: new Date().toISOString() } : u));
    }
  };

  const handleRestore = (id: number) => {
    setUsers(users.map(u => u.id === id ? { ...u, deleted_at: null } : u));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 font-montserrat">Gestion des Utilisateurs</h1>
      </div>

      {/* BARRE D'OUTILS */}
      <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col sm:flex-row gap-4">
        
        {/* Recherche */}
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

        {/* Filtre */}
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
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                        user.role === 'shelter' ? 'bg-blue-100 text-blue-800' : 
                        'bg-gray-100 text-gray-800'
                      }
                    />
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell text-gray-500">{user.created_at}</td>
                  <td className="px-6 py-4">
                    {user.deleted_at ? (
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
                        Banni
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                        Actif
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {user.deleted_at ? (
                      <button type="button"
                        onClick={() => handleRestore(user.id)}
                        className="text-primary hover:bg-orange-50 p-2 rounded-full transition-colors"
                        title="Restaurer"
                      >
                        <RotateCcw className="w-5 h-5" />
                      </button>
                    ) : (
                      <button type="button"
                        onClick={() => handleDelete(user.id)}
                        className="text-gray-400 hover:text-error hover:bg-red-50 p-2 rounded-full transition-colors"
                        title="Bannir"
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