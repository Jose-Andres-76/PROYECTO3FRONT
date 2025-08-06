import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WasteTableComponent } from './waste-table.component';
import { IWaste } from '../../../interfaces';

describe('WasteTableComponent', () => {
  let component: WasteTableComponent;
  let fixture: ComponentFixture<WasteTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WasteTableComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(WasteTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('El componente se crea sin errores', () => {
    expect(component).toBeTruthy();
  });

  it(' la clase correcta para el tipo "plastic"', () => {
    const cssClass = component.getStatusClass('plastic');
    expect(cssClass).toBe('status-plastic');
  });
});
