import { Injectable } from "@angular/core";
import {
  AngularFirestoreCollection,
  AngularFirestore
} from "angularfire2/firestore";
import { Product } from "../../pages/products/products.model";
import { Users } from "../../pages/users/users.model";
import * as firebase from "firebase";
import { Observable } from "rxjs";

@Injectable()
export class StorageProvider {
  productsCollectionRef: AngularFirestoreCollection<Product>;
  usersCollectionRef: AngularFirestoreCollection<Users>;
  users: Observable<Users[]>;
  storage: any = firebase.storage().ref();

  errorMessage: string;
  successMessage: string;

  constructor(public fireStore: AngularFirestore) {
    this.productsCollectionRef = this.fireStore.collection("products");
    this.usersCollectionRef = this.fireStore.collection("users");

    this.users = this.usersCollectionRef.valueChanges();
  }

  private barcodeExists(barcode: any) {
    var search_barcode = this.fireStore.collection("products", ref =>
      ref.where("barcode", "==", parseInt(barcode.value))
    );
    return search_barcode
      .get()
      .toPromise()
      .then(function(querySnapshot) {
        if (!querySnapshot.empty) {
          return true;
        } else {
          return false;
        }
      })
      .catch(error => {
        console.log(error);
        return false;
      });
  }

  validateInputFields(barcode: any, description: any, name: any, file?: any) {
    return this.barcodeExists(barcode).then(barcode_found => {
      if (barcode.value == "") {
        this.errorMessage = "Please, enter a valid barcode!";
        console.log("Please, enter a valid barcode!");
        return false;
      } else if (barcode_found) {
        this.errorMessage = "This barcode already exists!";
        console.log("This barcode already exists!");
        return false;
      } else if (description.value == "" || name.value == "") {
        this.errorMessage = "All fields are required!";
        console.log("All fields are required!");
        return false;
      } else if (file == null) {
        this.errorMessage = "Please, upload a file!";
        console.log("Please, upload a file!");
        return false;
      } else {
        return true;
      }
    });
  }

  uploadProduct(barcode: any, description: any, name: any, file: any) {
    return this.validateInputFields(barcode, description, name, file).then(
      fieldsValidated => {
        if (fieldsValidated) {
          this.productsCollectionRef
            .add({
              barcode: barcode.value,
              description: description.value,
              name: name.value
            })
            .then(docRef => {
              console.log(docRef);
            })
            .catch(error => {
              console.log(error);
            });

          var barcodeImage = this.storage.child(
            "barcodes/" + barcode.value + ".jpg"
          );
          barcodeImage.put(file).then(function(snapshot) {
            console.log("Uploaded product image!");
          });
          console.log("Product uploaded with success");
          this.successMessage = "Product uploaded with success!";
          return this.successMessage;
        } else {
          return this.errorMessage;
        }
      }
    );
  }
}
