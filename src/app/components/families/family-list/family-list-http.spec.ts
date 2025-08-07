import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FamilyListComponent } from './family-list.component';
import { FamilyService } from '../../../services/family.service';
import { AuthService } from '../../../services/auth.service';
import { ConfirmationModalService } from '../../../services/confirmation-modal.service';
import { IFamily } from '../../../interfaces';
import { of } from 'rxjs';

describe('FamilyListComponentHttp', () => {
  let component: FamilyListComponent;
  let fixture: ComponentFixture<FamilyListComponent>;
  let familyServiceSpy: jasmine.SpyObj<FamilyService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let confirmationModalSpy: jasmine.SpyObj<ConfirmationModalService>;

  beforeEach(async () => {
    familyServiceSpy = jasmine.createSpyObj('FamilyService', ['someMethod']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getUser']);
    confirmationModalSpy = jasmine.createSpyObj('ConfirmationModalService', ['confirmDeleteFamilyMember']);

    authServiceSpy.getUser.and.returnValue({ id: 1, name: 'Test User' });

    await TestBed.configureTestingModule({
      imports: [FamilyListComponent],
      providers: [
        { provide: FamilyService, useValue: familyServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ConfirmationModalService, useValue: confirmationModalSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FamilyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it(' Se crea el componente', () => {
    expect(component).toBeTruthy();
  });

  it('llamar al método del servicio', () => {
    expect(component.user).toEqual({ id: 1, name: 'Test User' });
    expect(authServiceSpy.getUser).toHaveBeenCalled();
  });

  it(' callDeleteAction cuando confirmDelete es confirmado', async () => {
    const testFamily: IFamily = { id: 123, son: { name: 'Juan' } } as any;
    confirmationModalSpy.confirmDeleteFamilyMember.and.returnValue(Promise.resolve(true));

    spyOn(component.callDeleteAction, 'emit');

    await component.confirmDelete(testFamily);

    expect(confirmationModalSpy.confirmDeleteFamilyMember).toHaveBeenCalledWith('Juan');
    expect(component.callDeleteAction.emit).toHaveBeenCalledWith(testFamily);
  });

  it('no debería emitir callDeleteAction cuando se cancela la eliminación', async () => {
    const testFamily: IFamily = { id: 456, son: { name: 'Ana' } } as any;
    confirmationModalSpy.confirmDeleteFamilyMember.and.returnValue(Promise.resolve(false));

    spyOn(component.callDeleteAction, 'emit');

    await component.confirmDelete(testFamily);

    expect(confirmationModalSpy.confirmDeleteFamilyMember).toHaveBeenCalledWith('Ana');
    expect(component.callDeleteAction.emit).not.toHaveBeenCalled();
  });

  it('usar este miembro si no hay nombre del hijo', async () => {
    const testFamily: IFamily = { id: 789 } as any; 
    confirmationModalSpy.confirmDeleteFamilyMember.and.returnValue(Promise.resolve(true));

    spyOn(component.callDeleteAction, 'emit');

    await component.confirmDelete(testFamily);

    expect(confirmationModalSpy.confirmDeleteFamilyMember).toHaveBeenCalledWith('este miembro');
    expect(component.callDeleteAction.emit).toHaveBeenCalledWith(testFamily);
  });
});
