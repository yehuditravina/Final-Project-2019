import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Customer} from '../../../../../../shared/models/Customer.class';
import {CustomerService} from '../../../../../../shared/services/customer.service';

@Component({
  selector: 'app-customer-delete',
  templateUrl: './customer-delete.component.html',
  styleUrls: ['./customer-delete.component.css']
})
export class CustomerDeleteComponent implements OnInit {

  customer: Customer;

  // customer$;
  constructor(public _customerService: CustomerService,
              private _activateRout: ActivatedRoute,
              private _router: Router) {
  }

  async ngOnInit() {
    let id: number = this._activateRout.snapshot.params['id'];
   await this._customerService.getCustomer(id).subscribe((cust: Customer) => this.customer = cust);
  }

  deleteCustomer() {
    this._customerService.deleteCustomer(this.customer.ID).subscribe((cust: Customer) => {
      this.customer = cust;
      this._router.navigate(['./admin/entities-managment/customers/view']);
    });
  }

}
