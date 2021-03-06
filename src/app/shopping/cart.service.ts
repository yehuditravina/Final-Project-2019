import {Injectable, OnInit, Injector} from '@angular/core';
import {Subject, Observable} from 'rxjs';
import {Product} from '../shared/models/Product.class';
import {OrderProduct} from '../shared/models/OrderProduct.class';
import {SaleOrderService} from '../shared/services/saleOrder.service';
import {PurchaseOrderService} from '../shared/services/purchaseOrder.service';
import {CurrentUser} from '../shared/currentUser';
import {error} from '@angular/compiler/src/util';
import {SaleOrder} from '../admin/sale/sale/models/SaleOrder.class';
import {parseAndResolve} from '../shared/services/CommonMethods';

export const OrderServiceMap = {
  sale: SaleOrderService,
  purchase: PurchaseOrderService
};

@Injectable()
export class CartService {

  orderProducts: OrderProduct[] = [];
  cartTotal: number = 0;
  initF: boolean = true;
  numProducts: number = 0;
  private productAddedSource = new Subject<any>();
  productAdded$ = this.productAddedSource.asObservable();

  type: string = 'sale';
  owerId: number = null;
  orderService;

  constructor(private injector: Injector,
              private currentUser: CurrentUser
  ) {
    let curUser = this.currentUser.get();
    this.owerId = curUser ? curUser.ID : null;

  }

  init() {
    if (this.orderProducts == [])
      if (localStorage.getItem('products') !== null) {
        let products = localStorage.getItem('products');
        this.orderProducts = JSON.parse(products);
        this.orderProducts.forEach(prod => {
          this.cartTotal += prod.Product.SellingPrice * prod.Amount;
        });
        this.numProducts = this.orderProducts.reduce((acc, product) => {
          acc += product.Amount;
          return acc;
        }, 0);
        this.productAddedSource.next({products: this.orderProducts, cartTotal: this.cartTotal, numProducts: this.numProducts});
      }

    //  if (OrderServiceMap.hasOwnProperty(this.type))
    //     this.orderService=this.injector.get<any>(OrderServiceMap[this.type]);
    if (this.type == null || this.type == 'sale') {
      this.orderService = this.injector.get<any>(SaleOrderService);
    } else {
      if (this.type == 'purchase')
        this.orderService = this.injector.get<any>(PurchaseOrderService);
    }

    console.log('type=' + this.type);

  }

  getCart() {
    return {
      products: this.orderProducts,
      cartTotal: this.cartTotal,
      numProducts: this.numProducts
    };
  }

  removeProductFromCart(product: Product) {
    let exists = true;
    let parsedPrice = parseFloat(product.SellingPrice.toString().replace(/\./g, '').replace(',', '.'));
    this.cartTotal -= parsedPrice;
    //Search this product on the cart and increment the quantity
    this.orderProducts = this.orderProducts.map(_product => {
      if (_product.Product.ID == product.ID) {
        _product.Amount--;
        this.numProducts--;
        if (_product.Amount === 0)
          exists = false;
      }
      return _product;
    });

    //Add a new product to the cart if it's a new product
    if (!exists) {
      console.log(this.orderProducts);
      // delete this.orderProducts
      // this.orderProducts.pop();
    }

    console.log('product', this.orderProducts);
    console.log('cartTotal', this.cartTotal);
    this.saveCartLocaly();
    this.productAddedSource.next({products: this.orderProducts, cartTotal: this.cartTotal, numProducts: this.numProducts});
  }

  async addProductToCart(product: Product) {
    let exists = false;
    let parsedPrice = parseFloat(product.SellingPrice.toString().replace(/\./g, '').replace(',', '.'));
    this.cartTotal += parsedPrice;
    //Search this product on the cart and increment the quantity
    this.orderProducts = await this.orderProducts.map(_product => {
      if (_product.Product.ID == product.ID) {
        _product.Amount++;
        this.numProducts++;
        exists = true;
      }
      return _product;
    });
    //Add a new product to the cart if it's a new product
    if (!exists) {
      //?product.parsedPrice = parsedPrice
      this.orderProducts.push({
        Product: product,
        Amount: 1,
      });
    }

    console.log('product', this.orderProducts);
    console.log('cartTotal', this.cartTotal);
    this.saveCartLocaly();
    this.productAddedSource.next({products: this.orderProducts, cartTotal: this.cartTotal, numProducts: this.numProducts});
  }

  deleteProductFromCart(product: Product) {
    this.orderProducts = this.orderProducts.filter(_product => {
      if (_product.Product.ID === product.ID) {
        this.cartTotal -= _product.Product.SellingPrice * _product.Amount;
        this.numProducts -= _product.Amount;
        return false;
      }
      return true;
    });
    this.productAddedSource.next({products: this.orderProducts, cartTotal: this.cartTotal, numProducts: this.numProducts});
    this.saveCartLocaly();
  }

  flushCart() {
    this.orderProducts = [];
    this.cartTotal = 0;
    this.numProducts = 0;
    this.productAddedSource.next({products: this.orderProducts, cartTotal: this.cartTotal, numProducts: this.numProducts});
    this.saveCartLocaly();
  }

  saveCartLocaly() {
    localStorage.setItem('products', JSON.stringify(this.orderProducts));
  }

  public saveCartOnServer(): Observable<SaleOrder> {
    debugger;
    const productsToSubmit: any[] = [];
    this.orderProducts.forEach(prod =>
      productsToSubmit.push({productId: prod.Product.ID, Amount: prod.Amount}));
    if (this.type != null) {
      if (this.owerId == null) {
        if (this.currentUser.isAdmin()) {
          alert('עליך לבחור נמען');
          return;
        }
      } else {
        if (this.currentUser.isCustomer()) {
          this.owerId = this.currentUser.get().ID; // הזמנה ללקוח נוכחי debugger
        }
        return this.orderService.add(productsToSubmit, this.owerId);
      }
    } else {
      // take id from session on server
      return this.orderService.add(productsToSubmit);
    }

  }
}
