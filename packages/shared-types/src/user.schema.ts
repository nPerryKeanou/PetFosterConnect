import { z } from "zod";

// ENUM
// Définit les rôles possibles
export const UserRoleEnum = z.enum(["individual", "shelter", "admin"], {
  error: "Veuillez choisir un type de compte valide",
});
export type UserRole = z.infer<typeof UserRoleEnum>; // Export du type TS

// SCHÉMA PRINCIPAL (Entité BDD)
// Représente un utilisateur complet tel qu'il est stocké en base
export const UserSchema = z.object({
  id: z.int().positive().optional(), // Optionnel car auto-incrémenté
  email: z.email({ error: "Format d'email invalide" }).max(255),
  password: z
    .string()
    .min(12, { error: "Le mot de passe doit faire au moins 12 caractères" })
    .regex(/[A-Z]/, { error: "Une majuscule requise" })
    .regex(/[0-9]/, { error: "Un chiffre requis" })
    .regex(/[^a-zA-Z0-9]/, { error: "Un caractère spécial requis" }),
  role: UserRoleEnum,
  phone_number: z
    .string()
    .regex(/^\+?[0-9]{10,15}$/, { error: "Numéro de téléphone invalide" })
    .optional()
    .nullable(),
  address: z.string().max(255).optional().nullable(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  deleted_at: z.date().nullable().optional(), // Archivage (Soft Delete)
});

export type User = z.infer<typeof UserSchema>;

// DTOs (Data Transfer Objects)

// REGISTER : Données envoyées par le formulaire d'inscription
export const RegisterSchema = UserSchema.pick({
  email: true,
  password: true,
  role: true,
  phone_number: true,
  address: true,
});

export type RegisterDto = z.infer<typeof RegisterSchema>;

// LOGIN : Données envoyées pour la connexion
export const LoginSchema = z.object({
  email: z.email({ error: "Email invalide" }),
  password: z.string().min(1, { error: "Mot de passe requis" }),
});

export type LoginDto = z.infer<typeof LoginSchema>;
