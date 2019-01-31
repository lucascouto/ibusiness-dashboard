import { Component, ViewChild, OnInit } from "@angular/core";
import { NavController, ToastController } from "ionic-angular";

import { AngularFireDatabase } from "@angular/fire/database";
import {
  AngularFirestore,
  AngularFirestoreCollection
} from "angularfire2/firestore";

import * as firebase from "firebase";
import { LoginPage } from "../login/login";

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage implements OnInit {
  barcode_found: AngularFirestoreCollection;
  userDoc: any;

  @ViewChild("barcode") barcode;
  @ViewChild("description") description;
  @ViewChild("name") name;

  file: File = null;

  ngOnInit() {}

  handleFileInput(files: FileList) {
    if (files.length != 0) {
      this.file = files.item(0);
    }
  }

  constructor(
    public navCtrl: NavController,
    public afDB: AngularFireDatabase,
    public fireStore: AngularFirestore,
    public toastCtrl: ToastController
  ) {}

  register() {
    //SET TOAST FOR SHOWING MESSAGE
    let toast = this.toastCtrl.create({ duration: 3000, position: "bottom" });

    /*
    CREATE A REFERENCE TO:
    - THE STORAGE 
    - "BARCODES/{barcode}.jpg" PATH
    - COLLECTION
    */
    var storage = firebase.storage().ref();
    var barcodeImage = storage.child("barcodes/" + this.barcode.value + ".jpg");
    let collection = this.fireStore.collection<any>("products");

    var barcode = this.barcode;
    var description = this.description;
    var name = this.name;
    var file = this.file;

    if (file == null) {
      toast.setMessage("Please add a file!");
      toast.present();
    } else if (
      barcode.value == "" ||
      name.value == "" ||
      description.value == ""
    ) {
      toast.setMessage("All the fields are required!");
      toast.present();
    } else {
      //CHECKS IF THE BARCODE ALREADY EXISTS
      this.barcode_found = this.fireStore.collection("products", ref =>
        ref.where("barcode", "==", this.barcode.value)
      );
      this.barcode_found
        .get()
        .toPromise()
        .then(function(querySnapshot) {
          if (querySnapshot.empty) {
            console.log("THIS IS A NEW CODE!");

            //IF A NEW CODE, ADDS INFO TO THE COLLECTION
            collection
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

            //AND UPLOADS THE PICTURE
            barcodeImage.put(file).then(function(snapshot) {
              console.log("upload a file!");
            });

            toast.setMessage("succesfully uploaded!");

            //CLEARS THE FORM
            barcode.value = "";
            name.value = "";
            description.value = "";
          } else {
            console.log("THIS IS CODE ALREADY EXISTS!");
            toast.setMessage("This product already exists!");
          }
          toast.present();
        });
    }
  }

  logout() {
    this.navCtrl.setRoot(LoginPage);
  }
}
