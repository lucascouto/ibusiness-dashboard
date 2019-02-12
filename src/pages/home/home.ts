import { Component, ViewChild } from "@angular/core";
import { NavController, ToastController, NavParams } from "ionic-angular";
import { BarcodeScanner } from "@ionic-native/barcode-scanner";

/* IMPORTS TO WORK WITH FIREBASE */
import {
  AngularFirestore,
  AngularFirestoreCollection
} from "angularfire2/firestore";
import * as firebase from "firebase";

/* IMPORT TO WORK WITH EXCEL FILE */
import * as XLSX from "xlsx";
import { AngularFireAuth } from "@angular/fire/auth";
import { LoginPage } from "../login/login";

import $ from "jquery";
import { StorageProvider } from "../../providers/storage/storage";

type AOA = any[][];

/* IMPORT TO CONVERT URL IMAGE TO BASE64 BINARY */
var imageToBinary = require("imageurl-base64");

@Component({
  selector: "page-home",
  templateUrl: "home.html",
  providers: [StorageProvider]
})
export class HomePage {
  dataExcel: any[][];
  barcode_found: AngularFirestoreCollection;
  collection = this.fireStore.collection<any>("products");

  @ViewChild("barcode") barcode;
  @ViewChild("description") description;
  @ViewChild("name") name;
  @ViewChild("excelFile") excelFile;

  file: File = null;

  handleFileInput(files: FileList) {
    if (files.length != 0) {
      this.file = files.item(0);
    }
  }

  constructor(
    public navCtrl: NavController,
    public fireStore: AngularFirestore,
    public toastCtrl: ToastController,
    public fireAuth: AngularFireAuth,
    public navParams: NavParams,
    private barcodeScanner: BarcodeScanner,
    public storage: StorageProvider
  ) {}

  registerProduct() {
    var toast = this.toastCtrl.create({ duration: 3000, position: "bottom" });
    this.storage
      .uploadProduct(this.barcode, this.description, this.name, this.file)
      .then(message => {
        toast.setMessage(message);
        toast.present();
      });
  }

  read(bstr: string) {
    let errorMessage: string = "";

    let toast = this.toastCtrl;
    let toastFailure = toast.create({
      position: "bottom",
      cssClass: "toastStyleDanger",
      showCloseButton: true,
      closeButtonText: "OK"
    });

    let collection = this.collection;

    /* read workbook */
    const wb: XLSX.WorkBook = XLSX.read(bstr, { type: "binary" });

    /* grab first sheet */
    const wsname: string = wb.SheetNames[0];
    const ws: XLSX.WorkSheet = wb.Sheets[wsname];
    let storage = firebase.storage().ref();

    /* save data */
    this.dataExcel = <AOA>XLSX.utils.sheet_to_json(ws, { header: 1 });
    console.log(this.dataExcel);
    let rowNumber = 1;
    for (let row of this.dataExcel) {
      this.barcode_found = this.fireStore.collection("products", ref =>
        ref.where("barcode", "==", row[0])
      );
      this.barcode_found
        .get()
        .toPromise()
        .then(function(querySnapshot) {
          //CHECKS THE BARCODE!
          if (!querySnapshot.empty) {
            errorMessage +=
              "- The product with the barcode " +
              row[0] +
              " in the row " +
              rowNumber +
              " already exists\n\n";
          }
          //THEN, CHECKS IF THE NAME IS EMPTY
          else if (row[1] == undefined) {
            errorMessage +=
              "- The product name in row " + rowNumber + " is empty!\n\n";
          }
          //THEN CHECKS IF THE DESCRIPTION IS EMPTY
          else if (row[2] == undefined) {
            errorMessage +=
              "- The product description in row " +
              rowNumber +
              " is empty!\n\n";
          }
          //THEN CHECKS IF THE IMAGE LINK EXISTS
          else if (row[3] == undefined) {
            errorMessage +=
              "- The product in row " +
              rowNumber +
              " doesn't have a link to an image!\n\n";
          }
          //IF EVERYTHING IS OKAY, UPLOAD THE EXCEL FILE
          else {
            collection.add({
              barcode: row[0],
              name: row[1],
              description: row[2]
            });
            imageToBinary(row[3], function(err, data) {
              console.log(data);
              storage
                .child("barcodes/" + row[0] + ".jpg")
                .putString(data.dataUri, "data_url")
                .then(function(snapshot) {
                  console.log("upload a file!");
                });
            });
            let toastSuccess = toast.create({
              duration: 3000,
              position: "bottom",
              cssClass: "toastStyleSuccess"
            });
            toastSuccess.setMessage("Excel file succesfully uploaded!");
            toastSuccess.present();
          }
          toastFailure.setMessage(errorMessage);
          toastFailure.present();
        })
        .then(function() {
          rowNumber = rowNumber + 1;
        });
    }
  }

  /* File Input element for browser */
  onFileChange(evt: any) {
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>evt.target;
    console.log("Before get excel file");
    this.excelFile = target.files[0];
    console.log("After get excel file");

    //if (target.files.length !== 1) throw new Error("Cannot use multiple files");
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      this.read(bstr);
    };
    if (target.files[0] != undefined)
      reader.readAsBinaryString(target.files[0]);
  }

  readBarcode() {
    this.barcodeScanner
      .scan()
      .then(barcodeData => {
        console.log("Barcode data", barcodeData);
      })
      .catch(err => {
        console.log("Error", err);
      });
  }

  logoutApp() {
    $(".tabbar").hide();

    this.fireAuth.auth.signOut().then(data => {
      this.navCtrl.setRoot(LoginPage);
    });
  }
}
