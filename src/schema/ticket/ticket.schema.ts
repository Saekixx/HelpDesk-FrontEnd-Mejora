import { z } from "zod";

export const ticketSchema = z.object({
  asunto: z.string().min(1, "El asunto es obligatorio"), //[cite: 4]
  detalle: z.string().min(1, "El detalle es obligatorio"), //[cite: 4]
  id_equipo: z.coerce
    .number({ message: "Selecciona un equipo" })
    .min(1, "Debes seleccionar un equipo válido"),
  es_software: z.boolean({ message: "Selecciona si es software o hardware" }), //[cite: 4]
});

export type TicketFormValues = z.infer<typeof ticketSchema>;
