import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RewardListComponent } from './reward-list.component';
import { ConfirmationModalService } from '../../../services/confirmation-modal.service';
import { RewardService } from '../../../services/reward.service';
import { AuthService } from '../../../services/auth.service';
import { IReward } from '../../../interfaces';
import { of } from 'rxjs';

describe('RewardListComponent', () => {
  let component: RewardListComponent;
  let fixture: ComponentFixture<RewardListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RewardListComponent],
      providers: [
        {
          provide: ConfirmationModalService,
          useValue: {
            confirmDelete: () => Promise.resolve(true),
          },
        },
        {
          provide: RewardService,
          useValue: {},
        },
        {
          provide: AuthService,
          useValue: {
            getUser: () => ({ id: 1, name: 'Test User' }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RewardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('El componente se crea sin errores', () => {
    expect(component).toBeTruthy();
  });

  it('Retornar el nombre del hijo si existe', () => {
    const reward: IReward = {
      id: 1,
      description: 'Premio 1',
      family: {
        son: {
          name: 'Carlos',
          lastname: 'Carlos',
        },
      },
    } as any;

    const result = component.getSonName(reward);
    expect(result).toBe('Carlos');
  });
});
