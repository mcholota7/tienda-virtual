import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  showSuccessMessage = false;
  passwordFieldType: string = 'password';
  registerForm: FormGroup;

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

 constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
  this.registerForm = this.fb.group({
    username: ['', Validators.required],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    phone: ['', Validators.required],
    documentType: ['', Validators.required],
    documentNumber: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required],
    address: this.fb.group({
      province: ['', Validators.required],
      canton: [{ value: '', disabled: true }, Validators.required],
      exactAddress: ['', Validators.required],
    }),
    userType: ['user', Validators.required]
  }, { validator: this.passwordMatchValidator }); 
}

passwordMatchValidator(formGroup: FormGroup) {
  const password = formGroup.get('password')?.value;
  const confirmPassword = formGroup.get('confirmPassword')?.value;

  return password === confirmPassword ? null : { mismatch: true };
}

togglePasswordVisibility() {
  this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
}


  onProvinceChange(): void {
    const selectedProvince = this.registerForm.get('address.province')?.value;
    if (selectedProvince) {
      this.cantons = this.provinces[selectedProvince] || [];
      this.registerForm.get('address.canton')?.enable(); 
    } else {
      this.cantons = [];
      this.registerForm.get('address.canton')?.disable(); 
    }
    this.registerForm.get('address.canton')?.setValue(''); 
  }

  onSubmit(): void {
    console.log('Estado del formulario:', this.registerForm);

  
    for (const controlName in this.registerForm.controls) {
      const control = this.registerForm.get(controlName);
  
      if (control instanceof FormGroup) {
        
        for (const nestedControlName in control.controls) {
          const nestedControl = control.get(nestedControlName);
          if (nestedControl?.invalid) {
            console.log(`Campo inválido: ${nestedControlName}`, nestedControl.errors);
          }
        }
      } else if (control?.invalid) {
        console.log(`Campo inválido: ${controlName}`, control.errors);
      }
    }
  
    if (this.registerForm.valid) {
      const formValue = this.registerForm.value;

      const userData = {
        nombres: formValue.firstName,
        apellidos: formValue.lastName,
        telefono: formValue.phone,
        tipo_documento: formValue.documentType,
        numero_documento: formValue.documentNumber,
        provincia: formValue.address.province,
        ciudad: formValue.address.canton,
        direccion: formValue.address.exactAddress,
        nombre_usuario: formValue.username,
        contrasena: formValue.password,
        idTipo_usuario: formValue.userType === 'admin' ? 1 : 2 // Asume 1 para admin, 2 para usuario regular
      };
      this.authService.register(userData).subscribe(
        response => {
          console.log('Usuario registrado con éxito:', response);
          Swal.fire({
            icon: 'success',
            title: '¡Registro exitoso!',
            text: 'Tu cuenta ha sido creada con éxito.',
            confirmButtonText: 'Aceptar'
          }).then(() => {
            this.router.navigate(['/login']);
          });
        },
        error => {
          console.error('Error en el registro:', error);
          console.log('Esto: ',error);
          let errorMessage = error.error?.error || error.error?.message || 'Hubo un problema con el registro. Intenta nuevamente.';
          console.log('Esto: ', errorMessage);
          if (errorMessage === 'El nombre de usuario ya está en uso. Intenta con otro.') {
            errorMessage = 'Este nombre de usuario ya está en uso. Por favor, intenta con otro.';
          }

          Swal.fire({
            icon: 'error',
            title: '¡Error!',
            text: errorMessage,
            confirmButtonText: 'Aceptar'
          });
        }
      );
    }
    else{
      Swal.fire({
        icon: 'warning',
        title: '¡Campos incompletos!',
        text: 'Por favor, completa todos los campos requeridos.',
        confirmButtonText: 'Aceptar'
      });
    }
  }

  getError(controlName: string, errorName: string) {
    return this.registerForm.get(controlName)?.hasError(errorName) && (this.registerForm.get(controlName)?.dirty || this.registerForm.get(controlName)?.touched);
  }
}