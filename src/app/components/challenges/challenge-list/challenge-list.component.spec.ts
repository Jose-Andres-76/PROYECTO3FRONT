import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChallengeListComponent } from './challenge-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ChallengeListComponent', () => {
  let component: ChallengeListComponent;
  let fixture: ComponentFixture<ChallengeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ChallengeListComponent,
        HttpClientTestingModule 
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChallengeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería retornar "Arrastrador ecológico" para ECO_DRAG_DROP', () => {
    const challengeMock = {
      description: 'Desafío de prueba',
      game: {
        typesOfGames: 'ECO_DRAG_DROP'
      }
    } as any;

    const result = component.getGameType(challengeMock);
    expect(result).toBe('Arrastrador ecológico');
  });
});
