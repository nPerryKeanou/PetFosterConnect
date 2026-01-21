

type Props = {
  formData: {
    email: string;
    phoneNumber: string;
    address: string;
    surface: number;
    housingType: string;
    haveGarden: boolean;
    haveAnimals: boolean;
    haveChildren: boolean;
  };
  onChange: (field: keyof Props["formData"], value: any) => void;
};

export default function IndividualProfileForm({ formData, onChange }: Props) {
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
        <label>Surface (m²)</label>
        <input
          type="number"
          value={formData.surface}
          onChange={(e) => onChange("surface", Number(e.target.value))}
          className="border rounded p-2 w-full"
        />
      </div>

      <div>
        <label>Type de logement</label>
        <select
          value={formData.housingType}
          onChange={(e) => onChange("housingType", e.target.value)}
          className="border rounded p-2 w-full"
        >
          <option value="house">Maison</option>
          <option value="apartment">Appartement</option>
          <option value="other">Autre</option>
        </select>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.haveGarden}
            onChange={(e) => onChange("haveGarden", e.target.checked)}
          />
          Jardin
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.haveAnimals}
            onChange={(e) => onChange("haveAnimals", e.target.checked)}
          />
          Animaux
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.haveChildren}
            onChange={(e) => onChange("haveChildren", e.target.checked)}
          />
          Enfants
        </label>
      </div>
    </div>
  );
}
