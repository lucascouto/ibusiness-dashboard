import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { AngularFireAuth } from "@angular/fire/auth";
import { LoginPage } from "../login/login";
import $ from "jquery";
import {
  AngularFirestore,
  AngularFirestoreCollection
} from "angularfire2/firestore";
import { Observable } from "rxjs";

interface Product {
  barcode: string;
  name: string;
  description: string;
}

@IonicPage()
@Component({
  selector: "page-products",
  templateUrl: "products.html"
})
export class ProductsPage {
  items = [];
  products: Observable<Product[]>;
  productsCollectionRef: AngularFirestoreCollection<Product>;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public fireAuth: AngularFireAuth,
    public fireStore: AngularFirestore
  ) {
    this.productsCollectionRef = this.fireStore.collection("products");
    this.products = this.productsCollectionRef.valueChanges();
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad ProductsPage");
    console.log(this.products);
  }

  getItems(event: any) {
    const value = event.target.value;

    if (value && value.trim() != "") {
    }
  }

  logoutApp() {
    $(".tabbar").hide();

    this.fireAuth.auth.signOut().then(data => {
      this.navCtrl.setRoot(LoginPage);
    });
  }
}
