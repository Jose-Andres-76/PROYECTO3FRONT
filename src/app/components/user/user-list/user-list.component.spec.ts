import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserListComponent } from './user-list.component';
import { ConfirmationModalService } from '../../../services/confirmation-modal.service';
import { IUser } from '../../../interfaces';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let confirmationModalSpy: jasmine.SpyObj<ConfirmationModalService>;

  beforeEach(async () => {
    confirmationModalSpy = jasmine.createSpyObj('ConfirmationModalService', ['confirmDelete']);

    await TestBed.configureTestingModule({
      imports: [UserListComponent],
      providers: [
        { provide: ConfirmationModalService, useValue: confirmationModalSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('El componente se crea sin errores', () => {
    expect(component).toBeTruthy();
  });

  it('Ambas confirmaciones son verdaderas', async () => {
    const mockUser: IUser = { name: 'Lamine', lastname: 'Yamal' } as IUser;
    confirmationModalSpy.confirmDelete.and.returnValues(Promise.resolve(true), Promise.resolve(true));

    spyOn(component.callDeleteAction, 'emit');

    await component.confirmDelete(mockUser);

    expect(confirmationModalSpy.confirmDelete).toHaveBeenCalledTimes(2);
    expect(component.callDeleteAction.emit).toHaveBeenCalledWith(mockUser);
  });
});
