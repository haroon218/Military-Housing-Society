import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerComplaintsComponent } from './owner-complaints.component';

describe('OwnerComplaintsComponent', () => {
  let component: OwnerComplaintsComponent;
  let fixture: ComponentFixture<OwnerComplaintsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnerComplaintsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnerComplaintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
