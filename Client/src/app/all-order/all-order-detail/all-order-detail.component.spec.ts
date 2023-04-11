import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllOrderDetailComponent } from './all-order-detail.component';

describe('AllOrderDetailComponent', () => {
  let component: AllOrderDetailComponent;
  let fixture: ComponentFixture<AllOrderDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllOrderDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllOrderDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
