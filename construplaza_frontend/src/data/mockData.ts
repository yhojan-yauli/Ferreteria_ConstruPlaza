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
