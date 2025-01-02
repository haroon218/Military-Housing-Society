import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaignListComponent } from './compaign-list.component';

describe('CompaignListComponent', () => {
  let component: CompaignListComponent;
  let fixture: ComponentFixture<CompaignListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompaignListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompaignListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
