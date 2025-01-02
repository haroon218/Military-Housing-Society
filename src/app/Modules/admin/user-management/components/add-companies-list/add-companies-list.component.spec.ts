import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCompaniesListComponent } from './add-companies-list.component';

describe('AddCompaniesListComponent', () => {
  let component: AddCompaniesListComponent;
  let fixture: ComponentFixture<AddCompaniesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCompaniesListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCompaniesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
