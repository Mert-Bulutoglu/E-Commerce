import { Component, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IBrand } from 'src/app/shared/models/brand';
import { IProduct } from 'src/app/shared/models/product';
import { IType } from 'src/app/shared/models/productType';
import { ProductService } from '../product.service';
import { BrandService } from 'src/app/brand/brand.service';
import { TypeService } from 'src/app/type/type.service';
import { HttpClient } from '@angular/common/http';
import { FileUploadOptions } from 'src/app/core/file-upload/file-upload.component';
import { MatDialog } from '@angular/material/dialog';
import { SelectProductImageDialogComponent } from 'src/app/core/select-product-image-dialog/select-product-image-dialog.component';
import { ConfirmationDialog } from 'src/app/shared/models/confirmation-dialog';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  fileUrl: string;
  form: UntypedFormGroup;
  selectedFile: File = null;
  typesList: IType[] = [];
  brandsList: IBrand[] = [];
  product: IProduct;
  constructor(
    public dialogRef: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private fb: UntypedFormBuilder,
    private productService: ProductService,
    private brandService: BrandService,
    private typeService: TypeService,
    private http: HttpClient,

  ) { }

  public onFileUploadSuccess(url: string): void {
    this.fileUrl = url;
    this.pictureUrl.setValue(this.fileUrl);
  }

  ngOnInit() {
    const productId: string = this.route.snapshot.paramMap.get('id');
    this.getAllBrands();
    this.getAllTypes();

    if (productId) {
      this.getProduct(productId);
      this.form = this.fb.group({
        name: ['', [Validators.required]],
        description: [''],
        features: [''],
        nutrientContent: [''],
        price: ['', [Validators.required]],
        stock: ['', [Validators.required]],
        pictureUrl: ['', [Validators.required]],
        productType: ['', [Validators.required]],
        productBrand: ['', [Validators.required]],
      });
    }
    else {
      this.form = this.fb.group({
        name: ['', [Validators.required]],
        description: [''],
        features: [''],
        nutrientContent: [''],
        price: ['', [Validators.required]],
        stock: ['', [Validators.required]],
        pictureUrl: ['', [Validators.required]],
        productType: ['', [Validators.required]],
        productBrand: ['', [Validators.required]],
      });
    }
  }

  getProduct(productId: string) {
    this.productService.getProduct(productId)
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.product = data;
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

  updateProduct(id: number, form: UntypedFormGroup) {
    if (form.valid) {
      const product: IProduct = form.value;
      product.id = id;
      console.log(product);
      this.productService.updateProduct(id, product)
        .subscribe({
          next: (data: any) => {
            console.log(data);
          },
          error: (err: any) => {
            console.log(err);
          },
          complete: () => {
            console.log('product update completed');
          }
        })
    }
  }

  saveProduct(form: UntypedFormGroup) {
    if (form.valid) {
      let product: IProduct = form.value;
      this.productService.createProduct(product)
        .subscribe({
          next: (data: any) => {
            console.log(data);
            this.router.navigate(['/product']);
          },
          error: (err: any) => {
            console.log(err);
          },
          complete: () => {
            console.log('product add completed');
          }
        })
    }
  }

  getAllBrands() {
    this.brandService.getAllBrands()
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.brandsList = data;
          if (this.product) {
            this.prefillForm();
          }
        },
        error: (err: any) => {
          console.log(err);
        },
        complete: () => {
          console.log('get brand completed');
        }
      });
  }

  getAllTypes() {
    this.typeService.getAllTypes()
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.typesList = data;
          if (this.product) {
            this.prefillForm();
          }
        },
        error: (err: any) => {
          console.log(err);
        },
        complete: () => {
          console.log('get brand completed');
        }
      });
  }

  handleSaveButton(form: UntypedFormGroup) {
    console.log(form.value);
    if (this.product) {
      this.updateProduct(this.product.id, form);
    } else {
      this.saveProduct(form);
    }
  }

  @Output() fileUploadOptions: Partial<FileUploadOptions> = {
    action: "upload",
    controller: "products",
    explanation: "Pass files or select files..",
    accept: ".png, .jpg, .jpeg"
  }

  openConfirmation() {
    const selectedProduct: IProduct = this.product
    
    if(selectedProduct != null)
    {
      const data: ConfirmationDialog = {
        message: `Add a photo '${selectedProduct.name}'`,
        data: selectedProduct
      }
    }

    const data: ConfirmationDialog = {
      message: `Add a photo`,
      data: null
    }

    const dialogRef = this.dialogRef.open(SelectProductImageDialogComponent, {
      width: '500px',
      data: data
    }
    );

    dialogRef.componentInstance.fileUrlChanged.subscribe((url: string) => {
      this.fileUrl = url;
      this.pictureUrl.setValue(this.fileUrl);
      dialogRef.close({ success: true });
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result.success) {
        dialogRef.close();
      }
    });
  }




  prefillForm(): void {
    this.name.setValue(this.product.name);
    this.description.setValue(this.product.description);
    this.nutrientContent.setValue(this.product.nutrientContent);
    this.features.setValue(this.product.features);
    this.price.setValue(this.product.price);
    this.pictureUrl.setValue(this.product.pictureUrl);
    this.productType.setValue(this.product.productType);
    this.productBrand.setValue(this.product.productBrand);
    this.stock.setValue(this.product.stock);
  }

  get name(): any {
    return this.form.get('name');
  }
  get description(): any {
    return this.form.get('description');
  }

  get nutrientContent(): any {
    return this.form.get('nutrientContent');
  }

  get features(): any {
    return this.form.get('features');
  }

  get price(): any {
    return this.form.get('price');
  }

  get stock(): any {
    return this.form.get('stock');
  }

  get pictureUrl(): any {
    return this.form.get('pictureUrl');
  }

  get productType(): any {
    return this.form.get('productType');
  }

  get productBrand(): any {
    return this.form.get('productBrand');
  }
}

