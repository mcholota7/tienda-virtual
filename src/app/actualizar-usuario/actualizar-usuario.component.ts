import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,  ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common'; 
import Swal from 'sweetalert2';

@Component({
  selector: 'app-actualizar-usuario',
  standalone: true,
  imports: [CommonModule,  ReactiveFormsModule],
  templateUrl: './actualizar-usuario.component.html',
  styleUrls: ['./actualizar-usuario.component.css'],
})
export class ActualizarUsuarioComponent implements OnInit {
  updateForm: FormGroup;
  showSuccessMessage: boolean = false;
  userId: number = 0;

  provinces: { [key: string]: string[] } = {
    'ESMERALDAS': ['Esmeraldas', 'Atacames', 'Eloy Alfaro', 'Muisne', 'Quinindé', 'Rioverde', 'San Lorenzo'],
    'MANABÍ': ['Portoviejo', '24 de Mayo', 'Bolívar', 'Chone', 'El Carmen', 'Flavio Alfaro', 'Jama', 'Jaramijó', 'Jipijapa', 'Junín', 'Manta', 'Montecristi', 'Olmedo', 'Paján', 'Pedernales', 'Pichincha', 'Puerto López', 'Rocafuerte', 'San Vicente', 'Santa Ana', 'Sucre', 'Tosagua'],
    'GUAYAS': ['Guayaquil', 'Alfredo Baquerizo', 'Balao', 'Balzar', 'Colimes', 'Daule', 'Durán', 'El Empalme', 'El Triunfo', 'General Antonio Elizalde', 'Isidro Ayora', 'Lomas de Sargentillo', 'Marcelino Maridueña', 'Milagro', 'Naranjal', 'Naranjito', 'Nobol', 'Palestina', 'Pedro Carbo', 'Playas', 'Salitre', 'Samborondón', 'Santa Lucía', 'Simón Bolívar', 'Yaguachi'],
    'STO. DOMINGO DE LOS TSÁCHILAS': ['Santo Domingo', 'La Concordia'],
    'SANTA ELENA': ['Santa Elena', 'La Libertad', 'Salinas'],
    'LOS RÍOS': ['Babahoyo', 'Baba', 'Buena Fé', 'Mocache', 'Montalvo', 'Palenque', 'Pueblo Viejo', 'Quevedo', 'Quinsaloma', 'Urdaneta', 'Valencia', 'Ventanas', 'Vinces'],
    'EL ORO': ['Machala', 'Arenillas', 'Atahualpa', 'Balsas', 'Chilla', 'El Guabo', 'Huaquillas', 'Las Lajas', 'Marcabelí', 'Pasaje', 'Piñas', 'Portovelo', 'Santa Rosa', 'Zaruma'],
    'ORELLANA': ['Francisco de Orellana', 'Aguarico', 'La Joya de los Sachas', 'Loreto'],
    'PASTAZA': ['Pastaza', 'Arajuno', 'Mera', 'Santa Clara'],
    'NAPO': ['Tena', 'Archidona', 'Carlos Julio Arosemena Tola', 'El Chaco', 'Quijos'],
    'SUCUMBÍOS': ['Lago Agrio', 'Cascales', 'Cuyabeno', 'Gonzalo Pizarro', 'Putumayo', 'Shushufindi', 'Sucumbíos'],
    'MORONA SANTIAGO': ['Morona', 'Gualaquiza', 'Huamboya', 'Limón Indanza', 'Logroño', 'Pablo Sexto', 'Palora', 'San Juan Bosco', 'Santiago de Méndez', 'Sucúa', 'Taisha', 'Tiwintza'],
    'ZAMORA CHINCHIPE': ['Zamora', 'Centinela del Cóndor', 'Chinchipe', 'El Pangui', 'Nangaritza', 'Palanda', 'Paquisha', 'Yacuambi', 'Yantzaza'],
    'PICHINCHA': ['Quito', 'Cayambe', 'Mejía', 'Pedro Moncayo', 'Pedro Vicente Maldonado', 'Puerto Quito', 'Rumiñahui', 'San Miguel de los Bancos'],
    'IMBABURA': ['Ibarra', 'Antonio Ante', 'Cotacachi', 'Otavalo', 'Pimampiro', 'San Miguel de Urcuquí'],
    'CHIMBORAZO': ['Riobamba', 'Alausí', 'Chambo', 'Chunchi', 'Colta', 'Cumandá', 'Guamote', 'Guano', 'Pallatanga', 'Penipe'],
    'CARCHI': ['Tulcán', 'Bolívar', 'Espejo', 'Mira', 'Montúfar', 'Huaca'],
    'COTOPAXI': ['Latacunga', 'La Maná', 'Pangua', 'Pujilí', 'Salcedo', 'Saquisilí', 'Sigchos'],
    'TUNGURAHUA': ['Ambato', 'Baños de Agua Santa', 'Cevallos', 'Mocha', 'Patate', 'Quero', 'San Pedro de Pelileo', 'Santiago de Píllaro', 'Tisaleo'],
    'BOLÍVAR': ['Guaranda', 'Caluma', 'Chillanes', 'Chimbo', 'Echeandía', 'Las Naves', 'San Miguel'],
    'CAÑAR': ['Azogues', 'Biblián', 'Cañar', 'Déleg', 'El Tambo', 'La Troncal', 'Suscal'],
    'AZUAY': ['Cuenca', 'Camilo Ponce Enríquez', 'Chordeleg', 'El Pan', 'Girón', 'Guachapala', 'Gualaceo', 'Nabón', 'Oña', 'Paute', 'Pucará', 'San Fernando', 'Santa Isabel', 'Sevilla de Oro', 'Sígsig'],
    'LOJA': ['Loja', 'Calvas', 'Catamayo', 'Celica', 'Chaguarpamba', 'Espíndola', 'Gonzanamá', 'Macará', 'Olmedo', 'Paltas', 'Pindal', 'Puyango', 'Quilanga', 'Saraguro', 'Sozoranga', 'Zapotillo'],
    'GALÁPAGOS': ['San Cristóbal', 'Isabela', 'Santa Cruz']
  };

  provinceKeys: string[] = Object.keys(this.provinces);
  cantons: string[] = []; 

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.updateForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      documentType: ['', Validators.required],
      documentNumber: ['', Validators.required],
      province: ['', Validators.required],
      canton: ['', Validators.required],
      address: ['', Validators.required],
    });
  }

  ngOnInit() {
    const id = this.authService.getUserId();
    if (id !== null && id !== undefined) {
      this.userId = id;
      this.cargarDatosUsuario();
    } else {
      console.error('Error: el usuario no tiene un ID válido.');
    }

    this.updateForm.get('province')?.valueChanges.subscribe((province) => {
      this.cantons = this.provinces[province] || [];
      this.updateForm.get('canton')?.setValue('');
    });
  }

  cargarDatosUsuario() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token'),
    });

    const url = `http://localhost:5000/api/auth/persona/${this.userId}`;
    this.http.get<any>(url, { headers }).subscribe((response) => {
      const persona = response.persona;
      this.updateForm.patchValue({
        firstName: persona.nombres,
        lastName: persona.apellidos,
        phone: persona.telefono,
        documentType: persona.tipo_documento,
        documentNumber: persona.numero_documento,
        province: persona.provincia,
        canton: persona.ciudad,
        address: persona.direccion,
      });
      this.cantons = this.provinces[persona.provincia] || [];
    });
  }

  onSubmit() {
    if (this.updateForm.invalid) {
      return;
    }
    const formData = {
      idusuario: this.userId,
      nombres: this.updateForm.get('firstName')?.value,
      apellidos: this.updateForm.get('lastName')?.value,
      telefono: this.updateForm.get('phone')?.value,
      tipo_documento: this.updateForm.get('documentType')?.value,
      numero_documento: this.updateForm.get('documentNumber')?.value,
      provincia: this.updateForm.get('province')?.value,
      ciudad: this.updateForm.get('canton')?.value,
      direccion: this.updateForm.get('address')?.value,
    };

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token'),
    });
    
    this.http.put('http://localhost:5000/api/auth/actualizar-datos-personales', formData, { headers })
      .subscribe(
        response => {
          console.log('Datos actualizados exitosamente', response);
          Swal.fire({
            icon: 'success',
            title: '¡Actualización exitosa!',
            text: 'Tus datos han sido actualizados correctamente.',
            confirmButtonText: 'Aceptar'
          });
        },
        error => {
          console.error('Error al actualizar los datos', error);
          Swal.fire({
            icon: 'error',
            title: 'Error al actualizar',
            text: 'Hubo un error al intentar actualizar tus datos. Por favor, inténtalo de nuevo.',
            confirmButtonText: 'Aceptar'
          });
        }
      );
  }
}

