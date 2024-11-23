export interface Product {
    _id: number;
    nombre_repuesto: string;
    precio: number;
    imagen_url: string;
    cantidad: number;
    marca: {
      _id: number;
      nombre_marca: string;
    };
    modelo: {
      _id: number;
      nombre_modelo: string;
    };
  }