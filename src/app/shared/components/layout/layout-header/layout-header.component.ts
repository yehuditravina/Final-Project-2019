import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router, Routes, Params} from '@angular/router';
import {CurrentUser} from '../../../currentUser';
import {AuthService} from '../../../services/auth.service';
import {SiteUserService} from '../../../services/siteUser.service';
import {CookieService} from 'ngx-cookie-service';


@Component({
  selector: 'app-layout-header',
  templateUrl: './layout-header.component.html',
  styleUrls: ['./layout-header.component.scss'],
})
export class LayoutHeaderComponent implements OnInit {

  @ViewChild('navbarCollapseButton') navbarCollapseButton: ElementRef;

  loginPage = false;
  userName: string = null;
  thisPage: Params;
  // @Input
  // routes: Routes;
  routes: Routes;
  routesOfHost: Routes = [
    {path: '/shopping/products', data: ['מוצרים'], children: []},
    {path: '/shopping/cart', data: ['עגלה'], children: []},
    {path: '/shopping/myorders', data: ['הזמנות'], children: []},
    {path: '/about', data: ['אודות'], children: []},
    {path: '/contact', data: ['צור קשר'], children: []}
  ];

  routesOfAdmin: Routes = [
    {path: '/', data: ['צפייה במלאי'], children: []},
    {
      path: 'purchase', data: ['קניה'], children: [
        {path: '1', data: ['הזמן מספק']},
        {path: '2', data: ['קבל מספק']},
        {path: 'sort-etrogs', data: ['מיון אתרוגים']},
      ]
    },
    {
      path: '/sale', data: ['מכירה'], children: [
        {path: 'temp', data: ['הזמן ללקוח']},
        {path: '2', data: ['אשר אספקה']},
        {path: '3', data: ['החזר סחורה']},
        {path: '4', data: ['צפי המכירות להיום']}
      ]
    },
    {path: '/', data: ['תקבול'], children: []},
    {
      path: '/entities-managment', data: ['בסיס נתונים'], children: [
        {path: '/admin/entities-managment/customers', data: ['לקוחות']},
        {path: '/admin/entities-managment/providers', data: ['ספקים']},
        {path: '/admin/entities-managment/employees', data: ['עובדים']},
        {path: '/admin/entities-managment/products', data: ['מוצרים']}
      ]
    },
    {
      path: '/', data: ['דוחות'], children: [
        {path: '1', data: ['בסיסי נתונים']},
        {path: '2', data: ['קניה']},
        {path: '3', data: ['מכירה']}
      ]
    },
    {
      path: '/', data: ['סטטיסטיקה'], children: []
    }
  ];

  customerRoutes = [
    {path: '/shopping/products', data: ['מוצרים'], children: []},
    {path: '/shopping/cart', data: ['עגלה'], children: []},
    {path: '/about', data: ['אודות'], children: []},
    {path: '/contact', data: ['צור קשר'], children: []},
    {
      path: '/contact', data: ['userName'], children: [///'ניהול חשבון'
        {path: '1', data: ['פרטים אישיים']},
        {path: '2', data: ['הזמנות']},
        {path: '2', data: ['דוחות']}
      ]
    }

  ];

  constructor(private router: Router,
              private currentUser: CurrentUser,
              private authService: AuthService,
              private siteUserServicde: SiteUserService,
              private cookieService: CookieService) {

    this.authService.listen().subscribe(() => {
      this.setRoutes();
    });
    if (this.cookieService.get('userName') != '')
      this.goToLoginPage();
  }

  ngOnInit() {
    this.routes = this.routesOfHost;
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.loginPage = event.url === '/login';
      }
    });
  }

  triggerNavBarClick() {

    let el: HTMLElement = this.navbarCollapseButton.nativeElement as HTMLElement;
    el.click();
  }

  // דרך נכונה?
   goToLoginPage() {
    //yyy   this.triggerNavBarClick();
     this.router.navigate(['/login'], {queryParams: {thisPage: window.location.pathname}});
   }

  // זמני לשם נוחות
  switchRoutes() {
    this.routes = this.routes == this.routesOfAdmin ? this.routesOfHost : this.routesOfAdmin;
  }

  logout() {
    this.triggerNavBarClick();
    this.siteUserServicde.logout().subscribe();
  }

  setRoutes() {
    if (this.currentUser.isUserLogin()) {
      if (this.currentUser.isCustomer()) {
        this.routes = this.customerRoutes;
      } else {
        this.routes = this.routesOfAdmin;
      }
      this.userName = this.currentUser.get().FirstName + ' ' + this.currentUser.get().LastName;
    } else {
      this.routes = this.routesOfHost;
      this.userName = null;
    }
  }

}
