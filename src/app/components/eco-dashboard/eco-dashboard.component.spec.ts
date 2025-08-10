import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EcoDashboardComponent } from './eco-dashboard.component';
import { ProfileService } from '../../services/profile.service';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { signal } from '@angular/core';
import { of } from 'rxjs';

describe('EcoDashboardComponent', () => {
  let component: EcoDashboardComponent;
  let fixture: ComponentFixture<EcoDashboardComponent>;


  const mockProfileService = {
    user$: signal({ points: 150 }),
    getUserInfoSignal: jasmine.createSpy('getUserInfoSignal')
  };


  const mockAuthService = {
    getUser: jasmine.createSpy('getUser').and.returnValue({ name: 'Test User' })
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcoDashboardComponent],
      providers: [
        { provide: ProfileService, useValue: mockProfileService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: ActivatedRoute, useValue: {} }, 
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EcoDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse correctamente y ejecutar ngOnInit', () => {
    expect(component).toBeTruthy();
    expect(mockProfileService.getUserInfoSignal).toHaveBeenCalled();
    expect(component.userName).toBe('Test User');
    expect(component.coins()).toBe(150);
  });

  it('debería ejecutar métodos de consola correctamente', () => {
    spyOn(console, 'log');
    component.playGame('Trivia');
    expect(console.log).toHaveBeenCalledWith('Iniciando juego: Trivia');

    component.viewRewards();
    expect(console.log).toHaveBeenCalledWith('Ver recompensas');

    component.viewChallenges();
    expect(console.log).toHaveBeenCalledWith('Ver retos');
  });
});
