import { Component, ViewChild } from "@angular/core";
import { NavController, ToastController } from "ionic-angular";

import { AngularFireDatabase } from "@angular/fire/database";
import { AngularFirestore } from "angularfire2/firestore";

import * as firebase from "firebase";
import { FirebaseAuth } from "@angular/fire";
import { LoginPage } from "../login/login";

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  userDoc: any;

  @ViewChild("barcode") barcode;
  @ViewChild("description") description;
  @ViewChild("name") name;

  file: File = null;

  handleFileInput(files: FileList) {
    this.file = files.item(0);
  }

  constructor(
    public navCtrl: NavController,
    public afDB: AngularFireDatabase,
    private fireStore: AngularFirestore,
    public toastCtrl: ToastController,
    private fireAuth: FirebaseAuth
  ) {}

  register() {
    let toast = this.toastCtrl.create({ duration: 3000, position: "bottom" });

    console.log(this.barcode.value);

    var storage = firebase.storage().ref();

    var barcodeImages = storage.child(
      "barcodes/" + this.barcode.value + ".jpg"
    );

    barcodeImages.put(this.file).then(function(snapshot) {
      console.log("upload a file!");
    });

    this.userDoc = this.fireStore.collection<any>("products").add({
      barcode: this.barcode.value,
      description: this.description.value,
      name: this.name.value
    });

    toast.setMessage("Cadastrado com sucesso!");

    toast.present();
  }

  logout() {
    this.navCtrl.setRoot(LoginPage);
  }
}
