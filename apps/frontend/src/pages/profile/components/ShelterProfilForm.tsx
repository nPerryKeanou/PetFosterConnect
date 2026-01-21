

type Props = {
  formData: {
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
  return (
    <div className="space-y-4">
      <div>
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
