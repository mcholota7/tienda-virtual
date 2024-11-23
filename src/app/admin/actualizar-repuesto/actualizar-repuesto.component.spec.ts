import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizarRepuestoComponent } from './actualizar-repuesto.component';

describe('ActualizarRepuestoComponent', () => {
  let component: ActualizarRepuestoComponent;
  let fixture: ComponentFixture<ActualizarRepuestoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActualizarRepuestoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActualizarRepuestoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
