import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerEventsComponent } from './owner-events.component';

describe('OwnerEventsComponent', () => {
  let component: OwnerEventsComponent;
  let fixture: ComponentFixture<OwnerEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnerEventsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnerEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
