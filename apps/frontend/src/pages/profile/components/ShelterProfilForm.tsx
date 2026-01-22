type Props = {
  formData: {
    logo: string; // URL renvoyée par le backend
    email: string;
    phoneNumber: string;
    address: string;
    shelterName: string;
    siret: string;
    description: string;
  };
  onChange: (field: keyof Props["formData"], value: any) => void;
};

export default function ShelterProfileForm({ formData, onChange }: Props) {
  const handleLogoUpload = async (file: File) => {
    const data = new FormData();
    data.append("logo", file);

    // ⚡ Appel API vers ton backend
    const res = await fetch(`/api/users/shelter-logo`, {
      method: "PUT",
      body: data,
    });

    if (res.ok) {
      const updated = await res.json();
      // Le backend renvoie l’URL du logo
      onChange("logo", updated.logo);
    } else {
      console.error("Erreur upload logo", await res.text());
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="relative inline-block">
          {formData.logo ? (
            <img
              src={formData.logo}
              alt="Logo du refuge"
              className="h-20 w-20 object-cover rounded"
            />
          ) : (
            <div className="h-20 w-20 bg-gray-200 flex items-center justify-center rounded">
              Non renseigné
            </div>
          )}

          {/* Icône de modification */}
          <label
            htmlFor="logo-upload"
            className="absolute top-0 right-0 bg-white rounded-full p-1 shadow cursor-pointer hover:bg-gray-100"
          >
            📷
          </label>
          <input
            id="logo-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleLogoUpload(file);
              }
            }}
          />
        </div>

        <label>Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => onChange("email", e.target.value)}
          className="border rounded p-2 w-full"
        />
      </div>

      <div>
        <label>Téléphone</label>
        <input
          type="text"
          value={formData.phoneNumber}
          onChange={(e) => onChange("phoneNumber", e.target.value)}
          className="border rounded p-2 w-full"
        />
      </div>

      <div>
        <label>Adresse</label>
        <input
          type="text"
          value={formData.address}
          onChange={(e) => onChange("address", e.target.value)}
          className="border rounded p-2 w-full"
        />
      </div>

      <div>
        <label>Nom du refuge</label>
        <input
          type="text"
          value={formData.shelterName}
          onChange={(e) => onChange("shelterName", e.target.value)}
          className="border rounded p-2 w-full"
        />
      </div>

      <div>
        <label>SIRET</label>
        <input
          type="text"
          value={formData.siret}
          onChange={(e) => onChange("siret", e.target.value)}
          className="border rounded p-2 w-full"
        />
      </div>

      <div>
        <label>Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => onChange("description", e.target.value)}
          className="border rounded p-2 w-full"
        />
      </div>
    </div>
  );
}

