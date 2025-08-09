import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FamilyListComponent } from './family-list.component';
import { ConfirmationModalService } from '../../../services/confirmation-modal.service';
import { AuthService } from '../../../services/auth.service';
import { FamilyService } from '../../../services/family.service';
import { IFamily } from '../../../interfaces';
import { signal } from '@angular/core';

describe('FamilyListComponent', () => {
  let component: FamilyListComponent;
  let fixture: ComponentFixture<FamilyListComponent>;

  const mockConfirmationModalService = {
    confirmDeleteFamilyMember: jasmine.createSpy().and.resolveTo(true)
  };

  const mockAuthService = {
    getUser: jasmine.createSpy().and.returnValue({ name: 'Test User' })
  };

  const mockFamilyService = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FamilyListComponent],
      providers: [
        { provide: ConfirmationModalService, useValue: mockConfirmationModalService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: FamilyService, useValue: mockFamilyService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FamilyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('El componente se crea sin errores', () => {
    expect(component).toBeTruthy();
  });

  it('Se elimina el miembro de la famalia correctamente', async () => {
    const mockFamily: IFamily = { id: 1, son: { name: 'Neymar' } } as IFamily;
    spyOn(component.callDeleteAction, 'emit');

    await component.confirmDelete(mockFamily);

    expect(mockConfirmationModalService.confirmDeleteFamilyMember).toHaveBeenCalledWith('Neymar');
    expect(component.callDeleteAction.emit).toHaveBeenCalledWith(mockFamily);
  });
});
