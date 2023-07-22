import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, observable} from "rxjs";
import {ProductService} from "../services/product.service";
import {Product} from "../model/product.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  public products:Array<Product>=[];
  public keyword:string="";
  totalPages:number=0;
  pageSize:number=3;
  currentPage:number=1;

  constructor(private productService:ProductService,private router:Router) {

  }
   ngOnInit() {
    this.searchProducts();
   }

  searchProducts() {

    this.productService.searchProducts(this.keyword,this.currentPage,this.pageSize)
      .subscribe({
        next: (resp )=> {
          this.products= resp.body as Product[];
          let totalProducts:number=parseInt(resp.headers.get('x-total-count')!);
          this.totalPages=Math.floor(totalProducts/this.pageSize);
         if (totalProducts% this.pageSize !=0){
           this.totalPages=this.totalPages+1;
         }

        }, error: err => {
          console.log(err);
        }

      })
  }


  handleCheckProduct(product: Product) {
    this.productService.checkProduct(product).subscribe({
      next: updatedProduct => {
        product.checked = !product.checked;
      }
    })
  }

  HandleDelete(product: Product) {
   if (confirm("Etes vous sure?"))
    this.productService.deleteProduct(product).subscribe({
      next:value => {
        this.products.filter(p=>p.id!=product.id);
      }
    })

  }


  handleGotoPage(page: number) {
    this.currentPage=page;
      this.searchProducts();

  }

  Handledit(product: Product) {
    this.router.navigateByUrl(`/editProduct/${product.id}`)
  }
}
