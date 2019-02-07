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
import { UpdateProductPage } from "../update-product/update-product";

import { Product } from "./products.model";
import * as firebase from "firebase";

@IonicPage()
@Component({
  selector: "page-products",
  templateUrl: "products.html"
})
export class ProductsPage {
  productsArray = [];
  storage = firebase.storage().ref();
  img: HTMLImageElement;

  products: Observable<Product[]>;
  productsCollectionRef: AngularFirestoreCollection<Product>;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public fireAuth: AngularFireAuth,
    public fireStore: AngularFirestore
  ) {
    //var storage = this.storage;
    this.productsCollectionRef = this.fireStore.collection("products");
    this.products = this.productsCollectionRef.valueChanges();
    /*
    this.products.forEach(function(product) {
      product.forEach(singleProduct => {
        console.log(singleProduct["barcode"]);
        storage
          .child("barcodes/" + singleProduct["barcode"] + ".jpg")
          .getDownloadURL()
          .then(function(url) {
            var img = <HTMLImageElement>document.getElementById("productImage");
            img.src = url;
          });
      });
    });
    */
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad ProductsPage");
  }

  getItems(event: any) {}

  deleteProduct(product: Product) {
    var deleteRef = this.storage.child("barcodes/" + product.barcode + ".jpg");
    deleteRef
      .delete()
      .then(function() {
        console.log("Image ", product.barcode, "deleted!");
      })
      .catch(function(error) {
        console.log("Error deleting image ", product.barcode);
      });

    this.productsCollectionRef = this.fireStore.collection("products", ref =>
      ref.where("barcode", "==", product.barcode)
    );
    var productsCollection = this.productsCollectionRef;
    this.productsCollectionRef
      .get()
      .toPromise()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          productsCollection.doc(doc.id).delete();
        });
      });
    console.log(product.barcode);
  }

  editProduct(product: Product) {
    this.navCtrl.push(UpdateProductPage, { data: product });
  }

  logoutApp() {
    $(".tabbar").hide();

    this.fireAuth.auth.signOut().then(data => {
      this.navCtrl.setRoot(LoginPage);
    });
  }
}
