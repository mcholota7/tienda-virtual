export interface Marca {
    _id: number;
    nombre_marca: string;
  }
  
  export interface Modelo {
    _id: number;
    nombre_modelo: string;
  }
  
  export interface Repuesto {
    idrepuesto: number | null; // Permitir null
    nombre_repuesto: string;
    precio: number | null; // Permitir null
    idmodelo: number | null; // Permitir null
    cantidad: number | null; // Permitir null
    imagen_url: string | null; // Permitir null
    marca?: Marca; // Opcional
  }
  
  export interface Pedido {
    idencabezado_pedido: number;
    fecha_pedido: string;
    fecha_actualizacion: string;
    observacion: string;
    usuario: {
      nombre_usuario: string;
      persona: {
        nombres: string;
        apellidos: string;
      };
    };
    estado: {
      idestado:number;
      nombre_estado: string;
    };
    selectedEstado?: number;
  }