import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoustomerInformationComponent } from './coustomer-information.component';

describe('CoustomerInformationComponent', () => {
  let component: CoustomerInformationComponent;
  let fixture: ComponentFixture<CoustomerInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoustomerInformationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoustomerInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
