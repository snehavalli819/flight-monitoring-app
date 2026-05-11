import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertPanelComponent } from './alert-panel.component';


describe('AlertPanel', () => {
  let component: AlertPanelComponent;
  let fixture: ComponentFixture<AlertPanelComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AlertPanelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AlertPanelComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });
 

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
