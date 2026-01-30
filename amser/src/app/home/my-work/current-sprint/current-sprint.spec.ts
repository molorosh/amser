import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CurrentSprint } from './current-sprint';

describe('CurrentSprint', () => {
  let component: CurrentSprint;
  let fixture: ComponentFixture<CurrentSprint>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentSprint],
    }).compileComponents();

    fixture = TestBed.createComponent(CurrentSprint);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('sprint', {
      id: '1',
      name: 'Test Sprint',
      startDate: new Date(),
      endDate: new Date(),
      isCurrent: true,
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
