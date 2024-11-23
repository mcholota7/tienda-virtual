export interface Model {
    _id: number;
    idmarca: number;
    nombre_modelo: string;
    __v: number;
  }
  
  export interface ResponseModels {
    message: string;
    modelosMongo: Model[];
  }