import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EcoChallengesComponent } from './eco-challenges.component';
import { ChallengeService } from '../../services/challenge.service';
import { ProfileService } from '../../services/profile.service';
import { ActivatedRoute } from '@angular/router';
import { signal } from '@angular/core';

describe('EcoChallengesComponent', () => {
  let component: EcoChallengesComponent;
  let fixture: ComponentFixture<EcoChallengesComponent>;

  const mockChallengeService = {
    challenges$: signal([]),
    getAllActiveChallenges: () => {}
  };

  const mockProfileService = {
    user$: () => signal({ points: 0 }),
    getUserInfoSignal: () => {}
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcoChallengesComponent],
      providers: [
        { provide: ChallengeService, useValue: mockChallengeService },
        { provide: ProfileService, useValue: mockProfileService },
        { provide: ActivatedRoute, useValue: {} }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EcoChallengesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });
});
