import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryMethodDetailsComponent } from './delivery-method-details.component';

describe('DeliveryMethodDetailsComponent', () => {
  let component: DeliveryMethodDetailsComponent;
  let fixture: ComponentFixture<DeliveryMethodDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveryMethodDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveryMethodDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
