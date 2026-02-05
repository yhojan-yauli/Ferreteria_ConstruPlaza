// Datos mock realistas del mercado peruano de ferretería

export interface Producto {
  id: number;
  sku: string;
  nombre: string;
  marca: string;
  precio: number;
  stock: number;
  categoria: string;
  imagen: string;
}

export interface Usuario {
  id: number;
  usuario: string;
  password: string;
  nombre: string;
  dni: string;
  rol: 'ADMIN' | 'VENDEDOR';
}

export interface Venta {
  id: number;
  fecha: string;
  total: number;
  items: number;
}

export const productos: Producto[] = [
  { 
    id: 1, 
    sku: 'CP-0055',
    nombre: 'Cemento Sol Tipo I (42.5kg)', 
    marca: 'Sol',
    precio: 28.50, 
    stock: 500, 
    categoria: 'Construcción',
    imagen: '/placeholder.svg'
  },
  { 
    id: 2, 
    sku: 'CP-0112',
    nombre: 'Ladrillo King Kong 18 Huecos', 
    marca: 'Pirámide',
    precio: 1.20, 
    stock: 1500, 
    categoria: 'Construcción',
    imagen: '/placeholder.svg'
  },
  { 
    id: 3, 
    sku: 'CP-0203',
    nombre: 'Fierro Corrugado 1/2" x 9m', 
    marca: 'Aceros Arequipa',
    precio: 34.00, 
    stock: 5, 
    categoria: 'Fierros',
    imagen: '/placeholder.svg'
  },
  { 
    id: 4, 
    sku: 'CP-0304',
    nombre: 'Tubo PVC 4" Desagüe x 3m', 
    marca: 'Pavco',
    precio: 18.50, 
    stock: 40, 
    categoria: 'Gasfitería',
    imagen: '/placeholder.svg'
  },
  { 
    id: 5, 
    sku: 'CP-0415',
    nombre: 'Pintura Látex Blanco (Balde 4L)', 
    marca: 'Vencedor',
    precio: 65.00, 
    stock: 12, 
    categoria: 'Acabados',
    imagen: '/placeholder.svg'
  },
  { 
    id: 6, 
    sku: 'CP-0520',
    nombre: 'Alambre Negro Recocido #16', 
    marca: 'Prodac',
    precio: 8.50, 
    stock: 200, 
    categoria: 'Fierros',
    imagen: '/placeholder.svg'
  },
  { 
    id: 7, 
    sku: 'CP-0621',
    nombre: 'Tubo PVC 1/2" Agua Fría x 5m', 
    marca: 'Pavco',
    precio: 12.00, 
    stock: 150, 
    categoria: 'Gasfitería',
    imagen: '/placeholder.svg'
  },
  { 
    id: 8, 
    sku: 'CP-0722',
    nombre: 'Clavos 2 1/2" (Kg)', 
    marca: 'Prodac',
    precio: 6.50, 
    stock: 80, 
    categoria: 'Fierros',
    imagen: '/placeholder.svg'
  },
  { 
    id: 9, 
    sku: 'CP-0833',
    nombre: 'Thinner Acrílico (Galón)', 
    marca: 'Tekno',
    precio: 22.00, 
    stock: 8, 
    categoria: 'Acabados',
    imagen: '/placeholder.svg'
  },
  { 
    id: 10, 
    sku: 'CP-0944',
    nombre: 'Taladro Percutor 650W', 
    marca: 'Bosch',
    precio: 249.00, 
    stock: 15, 
    categoria: 'Herramientas',
    imagen: '/placeholder.svg'
  },
  { 
    id: 11, 
    sku: 'CP-1055',
    nombre: 'Martillo Carpintero 16oz', 
    marca: 'Stanley',
    precio: 35.00, 
    stock: 3, 
    categoria: 'Herramientas',
    imagen: '/placeholder.svg'
  },
  { 
    id: 12, 
    sku: 'CP-1166',
    nombre: 'Arena Gruesa (m³)', 
    marca: 'Cantera Lima',
    precio: 45.00, 
    stock: 25, 
    categoria: 'Construcción',
    imagen: '/placeholder.svg'
  }
];

export const usuariosMock: Usuario[] = [
  {
    id: 1,
    usuario: 'admin',
    password: 'admin123',
    nombre: 'Carlos Mendoza',
    dni: '12345678',
    rol: 'ADMIN'
  }
];

export const ventasMock: Venta[] = [
  { id: 1, fecha: '2024-01-15', total: 1250.50, items: 8 },
  { id: 2, fecha: '2024-01-16', total: 890.00, items: 5 },
  { id: 3, fecha: '2024-01-17', total: 2100.75, items: 12 },
  { id: 4, fecha: '2024-01-18', total: 1560.25, items: 9 },
  { id: 5, fecha: '2024-01-19', total: 3200.00, items: 15 },
  { id: 6, fecha: '2024-01-20', total: 2800.50, items: 11 },
  { id: 7, fecha: '2024-01-21', total: 1950.00, items: 7 },
];

export const categorias = ['Todos', 'Construcción', 'Fierros', 'Gasfitería', 'Acabados', 'Herramientas'];

export const ventasPorCategoria = [
  { name: 'Construcción', value: 40, color: '#1e3a5f' },
  { name: 'Fierros', value: 25, color: '#2563eb' },
  { name: 'Gasfitería', value: 15, color: '#60a5fa' },
  { name: 'Acabados', value: 12, color: '#93c5fd' },
  { name: 'Herramientas', value: 8, color: '#dbeafe' },
];

export const ventasSemana = [
  { dia: 'Lun', ventas: 2500, gastos: 800 },
  { dia: 'Mar', ventas: 3200, gastos: 950 },
  { dia: 'Mie', ventas: 2800, gastos: 700 },
  { dia: 'Jue', ventas: 4100, gastos: 1200 },
  { dia: 'Vie', ventas: 3800, gastos: 1100 },
  { dia: 'Sáb', ventas: 5200, gastos: 1400 },
  { dia: 'Dom', ventas: 2100, gastos: 500 },
];

export const topProductos = [
  { ranking: 1, producto: 'Cemento Sol Tipo I (42.5kg)', cantidad: 850, ingresos: 24225 },
  { ranking: 2, producto: 'Fierro Corrugado 1/2" x 9m', cantidad: 620, ingresos: 21080 },
  { ranking: 3, producto: 'Pintura Látex Blanco (Balde 4L)', cantidad: 415, ingresos: 26975 },
  { ranking: 4, producto: 'Ladrillo King Kong 18 Huecos', cantidad: 2420, ingresos: 2904 },
  { ranking: 5, producto: 'Tubo PVC 4" Desagüe x 3m', cantidad: 180, ingresos: 3330 },
];

// Interfaces y datos de Clientes
export interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  tipoDocumento: 'DNI' | 'RUC';
  numeroDocumento: string;
  direccion: string;
  telefono: string;
  email: string;
  tipoCliente: 'PERSONA' | 'EMPRESA';
  fechaRegistro: string;
}

export const clientesMock: Cliente[] = [
  {
    id: 1,
    nombre: 'Juan',
    apellido: 'Pérez García',
    tipoDocumento: 'DNI',
    numeroDocumento: '45678912',
    direccion: 'Av. Los Pinos 123, Lima',
    telefono: '987654321',
    email: 'juan.perez@gmail.com',
    tipoCliente: 'PERSONA',
    fechaRegistro: '2024-01-10',
  },
  {
    id: 2,
    nombre: 'María',
    apellido: 'López Rodríguez',
    tipoDocumento: 'DNI',
    numeroDocumento: '78912345',
    direccion: 'Jr. Las Flores 456, Miraflores',
    telefono: '912345678',
    email: 'maria.lopez@hotmail.com',
    tipoCliente: 'PERSONA',
    fechaRegistro: '2024-01-12',
  },
  {
    id: 3,
    nombre: 'Constructora ABC',
    apellido: 'S.A.C.',
    tipoDocumento: 'RUC',
    numeroDocumento: '20123456789',
    direccion: 'Av. Industrial 789, Ate',
    telefono: '016543210',
    email: 'ventas@constructoraabc.com',
    tipoCliente: 'EMPRESA',
    fechaRegistro: '2024-01-15',
  },
  {
    id: 4,
    nombre: 'Carlos',
    apellido: 'Mendoza Torres',
    tipoDocumento: 'DNI',
    numeroDocumento: '12378945',
    direccion: 'Calle Sol 321, San Isidro',
    telefono: '945612378',
    email: 'carlos.mendoza@gmail.com',
    tipoCliente: 'PERSONA',
    fechaRegistro: '2024-01-18',
  },
  {
    id: 5,
    nombre: 'Ferretería El Constructor',
    apellido: 'E.I.R.L.',
    tipoDocumento: 'RUC',
    numeroDocumento: '20987654321',
    direccion: 'Av. Grau 567, Callao',
    telefono: '014567890',
    email: 'contacto@elconstructor.pe',
    tipoCliente: 'EMPRESA',
    fechaRegistro: '2024-01-20',
  },
];

// Interfaces y datos de Historial de Acciones
export interface AccionVendedor {
  id: number;
  fecha: string;
  hora: string;
  vendedorId: number;
  vendedorNombre: string;
  tipoAccion: 'VENTA' | 'CREAR_CLIENTE' | 'EDITAR_CLIENTE';
  descripcion: string;
  detalles: string;
}

export const historialAccionesMock: AccionVendedor[] = [
  {
    id: 1,
    fecha: '2024-01-21',
    hora: '09:15:32',
    vendedorId: 2,
    vendedorNombre: 'Pedro Ramírez',
    tipoAccion: 'VENTA',
    descripcion: 'Venta realizada',
    detalles: 'Boleta B001-1234 - Total: S/ 450.50 - 5 productos',
  },
  {
    id: 2,
    fecha: '2024-01-21',
    hora: '10:30:45',
    vendedorId: 3,
    vendedorNombre: 'Ana Gutiérrez',
    tipoAccion: 'CREAR_CLIENTE',
    descripcion: 'Cliente creado',
    detalles: 'Cliente: Juan Pérez García - DNI: 45678912',
  },
  {
    id: 3,
    fecha: '2024-01-21',
    hora: '11:45:20',
    vendedorId: 2,
    vendedorNombre: 'Pedro Ramírez',
    tipoAccion: 'EDITAR_CLIENTE',
    descripcion: 'Cliente editado',
    detalles: 'Cliente: María López - Actualizado: teléfono, dirección',
  },
  {
    id: 4,
    fecha: '2024-01-21',
    hora: '14:20:10',
    vendedorId: 3,
    vendedorNombre: 'Ana Gutiérrez',
    tipoAccion: 'VENTA',
    descripcion: 'Venta realizada',
    detalles: 'Boleta B001-1235 - Total: S/ 1,250.00 - 12 productos',
  },
  {
    id: 5,
    fecha: '2024-01-20',
    hora: '09:00:15',
    vendedorId: 2,
    vendedorNombre: 'Pedro Ramírez',
    tipoAccion: 'VENTA',
    descripcion: 'Venta realizada',
    detalles: 'Boleta B001-1230 - Total: S/ 890.00 - 8 productos',
  },
  {
    id: 6,
    fecha: '2024-01-20',
    hora: '11:30:00',
    vendedorId: 3,
    vendedorNombre: 'Ana Gutiérrez',
    tipoAccion: 'CREAR_CLIENTE',
    descripcion: 'Cliente creado',
    detalles: 'Cliente: Constructora ABC S.A.C. - RUC: 20123456789',
  },
  {
    id: 7,
    fecha: '2024-01-19',
    hora: '16:45:30',
    vendedorId: 2,
    vendedorNombre: 'Pedro Ramírez',
    tipoAccion: 'EDITAR_CLIENTE',
    descripcion: 'Cliente editado',
    detalles: 'Cliente: Carlos Mendoza - Actualizado: email',
  },
  {
    id: 8,
    fecha: '2024-01-19',
    hora: '10:15:45',
    vendedorId: 3,
    vendedorNombre: 'Ana Gutiérrez',
    tipoAccion: 'VENTA',
    descripcion: 'Venta realizada',
    detalles: 'Boleta B001-1228 - Total: S/ 3,200.00 - 25 productos',
  },
];

export const vendedoresMock = [
  { id: 2, nombre: 'Pedro Ramírez' },
  { id: 3, nombre: 'Ana Gutiérrez' },
];
