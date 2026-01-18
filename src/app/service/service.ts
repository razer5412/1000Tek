import { Component } from '@angular/core';
  @Component({
  selector: 'app-service',
  templateUrl: './service.html',
  styleUrls: [  './service.css',          // your custom CSS
    '../../assets/css/style.css']
})
export class Service {
  contactInfo = {
    phone: '50 813 034',
    email: ' commercial@1000tek.tn',
    address: {
      street: '38 RUE DE NIGER MONTPLAISIR , TUNIS',
      city: 'tunis Tunisie 1002'
    }
}
}


