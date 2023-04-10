import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { IDeliveryMethod } from 'src/app/shared/models/deliveryMethod';
import { DeliveryMethodService } from '../delivery-method.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-delivery-method-details',
  templateUrl: './delivery-method-details.component.html',
  styleUrls: ['./delivery-method-details.component.scss']
})
export class DeliveryMethodDetailsComponent implements OnInit {
  form: UntypedFormGroup;
  deliveryMethod: IDeliveryMethod;

  constructor(
    public dialogRef: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private fb: UntypedFormBuilder,
    private deliveryMethodService: DeliveryMethodService,
    private http: HttpClient,
  ) { }

  ngOnInit() {
    const deliveryMethodId : string = this.route.snapshot.paramMap.get('id');

    if (deliveryMethodId) {
      this.getDeliveryMethod(deliveryMethodId);
      this.form = this.fb.group({
        shortName: ['', [Validators.required]],
        deliveryTime: ['', [Validators.required]],
        description: ['', [Validators.required]],
        price: ['', [Validators.required]],
      });
    }
    else {
      this.form = this.fb.group({
        shortName: ['', [Validators.required]],
        deliveryTime: ['', [Validators.required]],
        description: ['', [Validators.required]],
        price: ['', [Validators.required]],
      });
    }
  }

  getDeliveryMethod(deliveryMethodId: string) {
    this.deliveryMethodService.getDeliveryMethod(deliveryMethodId)
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.deliveryMethod = data;
          this.prefillForm();
        },
        error: (err: any) => {
          console.log(err);
        },
        complete: () => {
          console.log('get by id completed');
        }
      });
  }

  updateDeliveryMethod(id: number, form: UntypedFormGroup) {
    if (form.valid) {
      const deliveryMethod: IDeliveryMethod = form.value;
      deliveryMethod.id = id;
      console.log(deliveryMethod);
      this.deliveryMethodService.updateDeliveryMethod(id, deliveryMethod)
        .subscribe({
          next: (data: any) => {
            console.log(data);
          },
          error: (err: any) => {
            console.log(err);
          },
          complete: () => {
            console.log('delivery method update completed');
          }
        })
    }
  }

  saveDeliveryMethod(form: UntypedFormGroup) {
    if (form.valid) {
      console.log(form.value)
      let deliveryMethod: IDeliveryMethod = form.value;
      this.deliveryMethodService.createDeliveryMethod(deliveryMethod)
        .subscribe({
          next: (data: any) => {
            console.log(data);
            this.router.navigate(['/delivery-method']);
          },
          error: (err: any) => {
            console.log(err);
          },
          complete: () => {
            console.log('delivery method add completed');
          }
        })
    }
  }

  handleSaveButton(form: UntypedFormGroup) {
    console.log(form.value);
    if (this.deliveryMethod) {
      this.updateDeliveryMethod(this.deliveryMethod.id, form);
    } else {
      this.saveDeliveryMethod(form);
    }
  }

  prefillForm(): void {
    this.shortName.setValue(this.deliveryMethod.shortName);
    this.deliveryTime.setValue(this.deliveryMethod.deliveryTime);
    this.description.setValue(this.deliveryMethod.description);
    this.price.setValue(this.deliveryMethod.price);
  }

  get shortName(): any {
    return this.form.get('shortName');
  }
  get deliveryTime(): any {
    return this.form.get('deliveryTime');
  }

  get description(): any {
    return this.form.get('description');
  }

  get price(): any {
    return this.form.get('price');
  }

}
