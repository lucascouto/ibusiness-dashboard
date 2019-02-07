import { Component, ViewChild } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController
} from "ionic-angular";
import { Product } from "../products/products.model";
import {
  AngularFirestore,
  AngularFirestoreCollection
} from "angularfire2/firestore";

/**
 * Generated class for the UpdateProductPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-update-product",
  templateUrl: "update-product.html"
})
export class UpdateProductPage {
  product: Product;
  productsCollectionRef: AngularFirestoreCollection<Product>;

  @ViewChild("barcode") barcode;
  @ViewChild("name") name;
  @ViewChild("description") description;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public fireStore: AngularFirestore,
    public toastCtrl: ToastController
  ) {
    this.product = navParams.get("data");
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad UpdateProductPage");
  }

  updateProduct(product: Product) {
    var barcode = this.barcode.value;
    var name = this.name.value;
    var description = this.description.value;
    let toast = this.toastCtrl.create({ duration: 3000, position: "bottom" });
    if (barcode == "" || name == "" || description == "") {
      toast.setMessage("All the fields are required!");
    } else {
      this.productsCollectionRef = this.fireStore.collection("products", ref =>
        ref.where("barcode", "==", product.barcode)
      );
      var productsCollection = this.productsCollectionRef;
      this.productsCollectionRef
        .get()
        .toPromise()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            productsCollection.doc(doc.id).update({
              name: name,
              description: description,
              barcode: barcode
            });
          });
        });
      toast.setMessage("Product successfully updated!");
    }
    toast.present();
    this.navCtrl.pop();
  }

  cancelUpdate() {
    this.navCtrl.pop();
  }
}
