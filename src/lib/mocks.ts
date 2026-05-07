export const professionals = [
  { id: 1, name: "Juliana", role: "Cabeleireira", avatar: "https://i.pravatar.cc/150?u=juliana", color: "#8D5AE2" },
  { id: 2, name: "Carlos", role: "Barbeiro", avatar: "https://i.pravatar.cc/150?u=carlos", color: "#3B82F6" },
  { id: 3, name: "Amanda", role: "Manicure", avatar: "https://i.pravatar.cc/150?u=amanda", color: "#EC4899" },
  { id: 4, name: "Beatriz", role: "Esteticista", avatar: "https://i.pravatar.cc/150?u=beatriz", color: "#10B981" },
]

export const appointments = [
  // Juliana
  { id: 1, professionalId: 1, time: "09:00", duration: "1h", service: "Corte Feminino", client: "Mariana Silva", status: "confirmed" },
  { id: 2, professionalId: 1, time: "10:30", duration: "1h", service: "Coloração", client: "Fernanda Lima", status: "confirmed" },
  { id: 3, professionalId: 1, time: "14:00", duration: "1.5h", service: "Mechas", client: "Juliana Alves", status: "confirmed" },
  { id: 4, professionalId: 1, time: "16:00", duration: "1h", service: "Escova", client: "Patrícia Santos", status: "confirmed" },
  
  // Carlos
  { id: 5, professionalId: 2, time: "09:30", duration: "1h", service: "Corte Masculino", client: "Rafael Souza", status: "confirmed" },
  { id: 6, professionalId: 2, time: "11:00", duration: "1h", service: "Barba", client: "Lucas Martins", status: "confirmed" },
  { id: 7, professionalId: 2, time: "15:00", duration: "1h", service: "Corte + Barba", client: "Bruno Ferreira", status: "confirmed" },
  { id: 8, professionalId: 2, time: "17:00", duration: "1h", service: "Corte Masculino", client: "Daniel Costa", status: "confirmed" },

  // Amanda
  { id: 9, professionalId: 3, time: "08:30", duration: "1h", service: "Manicure Completa", client: "Carla Oliveira", status: "confirmed" },
  { id: 10, professionalId: 3, time: "10:00", duration: "1h", service: "Esmaltação em Gel", client: "Tatiane Rocha", status: "confirmed" },
  { id: 11, professionalId: 3, time: "13:30", duration: "1h", service: "Manicure Completa", client: "Aline Teixeira", status: "confirmed" },
  { id: 12, professionalId: 3, time: "15:30", duration: "1h", service: "Esmaltação em Gel", client: "Beatriz Mello", status: "confirmed" },

  // Beatriz
  { id: 13, professionalId: 4, time: "09:00", duration: "1h", service: "Limpeza de Pele", client: "Gabriela Noara", status: "confirmed" },
  { id: 14, professionalId: 4, time: "11:00", duration: "1.5h", service: "Massagem Relaxante", client: "Vanessa Pereira", status: "confirmed" },
  { id: 15, professionalId: 4, time: "14:00", duration: "1h", service: "Drenagem Linfática", client: "Michelle Andrade", status: "confirmed" },
  { id: 16, professionalId: 4, time: "16:00", duration: "1h", service: "Peeling", client: "Isabela Santos", status: "confirmed" },
]

export const clients = [
  { id: 1, name: "Mariana Silva", email: "mariana.silva@email.com", phone: "(11) 98765-4321", appointmentsCount: 12, lastAppointment: "20/05/2024", status: "Ativo", avatar: "https://i.pravatar.cc/150?u=mariana" },
  { id: 2, name: "Rafael Souza", email: "rafael.souza@email.com", phone: "(11) 91234-5678", appointmentsCount: 5, lastAppointment: "18/05/2024", status: "Ativo", avatar: "https://i.pravatar.cc/150?u=rafael" },
  { id: 3, name: "Carla Oliveira", email: "carla.oliveira@email.com", phone: "(11) 97777-8888", appointmentsCount: 8, lastAppointment: "20/05/2024", status: "Ativo", avatar: "https://i.pravatar.cc/150?u=carla" },
  { id: 4, name: "Lucas Martins", email: "lucas.martins@email.com", phone: "(11) 95555-4444", appointmentsCount: 3, lastAppointment: "15/05/2024", status: "Inativo", avatar: "https://i.pravatar.cc/150?u=lucas" },
  { id: 5, name: "Fernanda Lima", email: "fernanda.lima@email.com", phone: "(11) 93333-2222", appointmentsCount: 15, lastAppointment: "20/05/2024", status: "Ativo", avatar: "https://i.pravatar.cc/150?u=fernanda" },
]

export const services = [
  { id: 1, name: "Corte Feminino", duration: "45 min", price: "R$ 70,00", category: "Cabelo", status: "Ativo" },
  { id: 2, name: "Escova", duration: "60 min", price: "R$ 80,00", category: "Cabelo", status: "Ativo" },
  { id: 3, name: "Coloração", duration: "90 min", price: "R$ 180,00", category: "Cabelo", status: "Ativo" },
  { id: 4, name: "Manicure Completa", duration: "60 min", price: "R$ 60,00", category: "Manicure e Pedicure", status: "Ativo" },
  { id: 5, name: "Limpeza de Pele", duration: "60 min", price: "R$ 120,00", category: "Estética", status: "Ativo" },
  { id: 6, name: "Corte Masculino", duration: "45 min", price: "R$ 50,00", category: "Barbearia", status: "Ativo" },
]
