import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController
} from "ionic-angular";
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
  storage = firebase.storage().ref();

  products: Observable<Product[]>;
  productsCollectionRef: AngularFirestoreCollection<Product>;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public fireAuth: AngularFireAuth,
    public fireStore: AngularFirestore,
    public alertCtrl: AlertController
  ) {
    this.productsCollectionRef = this.fireStore.collection("products");
    this.products = this.productsCollectionRef.valueChanges();
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

  confirmDelete(product: Product) {
    const confirm = this.alertCtrl.create({
      title: "Delete product?",
      message: "Are you sure you want to delete this product?",
      buttons: [
        {
          text: "cancel",
          handler: () => {
            console.log("Delete canceled...");
          }
        },
        {
          text: "delete",
          handler: () => {
            this.deleteProduct(product);
            console.log("Product deleted!");
          },
          cssClass: "delete-button"
        }
      ]
    });
    confirm.present();
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
