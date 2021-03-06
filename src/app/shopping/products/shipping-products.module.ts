import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule, JsonpModule} from '@angular/http';
import {CommonModule} from '@angular/common';
import {DataService} from '../data.service';
import {ShippingProductsComponent} from './shipping-products.component';
import {CartService} from '../cart.service';
import {FiltersComponent} from './components/filters/filters.component';
import {SearchBarComponent} from './components/search-bar/search-bar.component';
import {ShowcaseComponent} from './components/showcase/showcase.component';
import {SortFiltersComponent} from './components/sort-filters/sort-filters.component';
import {MiniCartComponent} from './components/mini-cart/cart.component';
import {ProductThumbnailComponent} from './components/product-thumbnail/product-thumbnail.component';
import {AddresseeBarComponent} from './components/addressee-bar/addressee-bar.component'
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    JsonpModule,
  ],
  declarations: [
    ShippingProductsComponent,
    FiltersComponent,
    SearchBarComponent,
    ShowcaseComponent,
    SortFiltersComponent,
    MiniCartComponent,
    ProductThumbnailComponent,
    AddresseeBarComponent,
  ],
  providers: [
    DataService,
    CartService
  ],
  exports: [ShippingProductsComponent]
})
export class ShippingProductsModule {
}
