import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentHistoryComponent } from './incident-history.component';

describe('IncidentHistoryComponent', () => {
  let component: IncidentHistoryComponent;
  let fixture: ComponentFixture<IncidentHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidentHistoryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IncidentHistoryComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
