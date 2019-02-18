import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { AngularFireAuth } from "@angular/fire/auth";
import { LoginPage } from "../login/login";

import $ from "jquery";
import { Observable } from "rxjs";
import { StorageProvider } from "../../providers/storage/storage";
import { ProductRequest } from "./requests.model";

@IonicPage()
@Component({
  selector: "page-requests",
  templateUrl: "requests.html"
})
export class RequestsPage {
  request_type: string = "pending";
  requests: Observable<ProductRequest[]>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private fireAuth: AngularFireAuth,
    private storage: StorageProvider
  ) {
    this.requests = this.storage.requests;
  }

  getBidValues(map) {
    this.requests.forEach(requests => {
      requests.forEach(request => {
        request.bids.forEach(bid => {
          console.log(bid.values());
          return Array.from(map.values());
        });
      });
    });
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad RequestsPage");
  }

  logoutApp() {
    $(".tabbar").hide();

    this.fireAuth.auth.signOut().then(data => {
      this.navCtrl.setRoot(LoginPage);
    });
  }
}
