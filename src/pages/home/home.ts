import { Component, ViewChild } from "@angular/core";
import { NavController, ToastController } from "ionic-angular";

/* IMPORTS TO WORK WITH FIREBASE */
import { AngularFireDatabase } from "@angular/fire/database";
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

type AOA = any[][];

/* IMPORT TO CONVERT URL IMAGE TO BASE64 BINARY */
var imageToBinary = require("imageurl-base64");

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  dataExcel: any[][];
  barcode_found: AngularFirestoreCollection;
  userDoc: any;
  collection = this.fireStore.collection<any>("products");
  storage = firebase.storage().ref();

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
    public afDB: AngularFireDatabase,
    public fireStore: AngularFirestore,
    public toastCtrl: ToastController,
    public fireAuth: AngularFireAuth
  ) {}

  register() {
    let toast = this.toastCtrl;
    //SET TOAST FOR SHOWING MESSAGE
    let toastFailure = toast.create({
      duration: 3000,
      position: "bottom",
      cssClass: "toastStyleDanger"
    });

    var barcodeImage = this.storage.child(
      "barcodes/" + this.barcode.value + ".jpg"
    );
    let collection = this.fireStore.collection<any>("products");

    var barcode = this.barcode;
    var description = this.description;
    var name = this.name;
    var file = this.file;

    this.barcode_found = this.fireStore.collection("products", ref =>
      ref.where("barcode", "==", parseInt(this.barcode.value))
    );
    this.barcode_found
      .get()
      .toPromise()
      .then(function(querySnapshot) {
        //VERIFIES IF THE BARCODE ALREADY EXISTS
        //NOTE: HERE WE CAN VALIDATE THE FORMAT OF THE BARCODE
        if (barcode.value == "")
          toastFailure.setMessage("Please, enter a valid barcode!");
        else if (!querySnapshot.empty)
          toastFailure.setMessage("This barcode already exists!");
        //VERIFIES IF ANY FIELD IS EMPTY
        else if (description.value == "" || name.value == "")
          toastFailure.setMessage("All the fields are required!");
        //VERIFIES IF THERE IS A FILE SELECTED
        else if (file == null) toastFailure.setMessage("Please, add a file!");
        //IF EVERYTHING IS OK, UPLOAD THE PRODUCT
        else {
          collection
            .add({
              barcode: parseInt(barcode.value),
              description: description.value,
              name: name.value
            })
            .then(docRef => {
              console.log(docRef);
            })
            .catch(error => {
              console.log(error);
            });

          barcodeImage.put(file).then(function(snapshot) {
            console.log("upload a file!");
          });

          let toastSucess = toast.create({
            duration: 3000,
            position: "bottom",
            cssClass: "toastStyleSuccess"
          });
          toastSucess.setMessage("succesfully uploaded!");
          toastSucess.present();

          //CLEARS THE FORM
          barcode.value = "";
          name.value = "";
          description.value = "";
        }
        toastFailure.present();
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
    this.excelFile = target.files[0];
    //if (target.files.length !== 1) throw new Error("Cannot use multiple files");
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      this.read(bstr);
    };
    reader.readAsBinaryString(target.files[0]);
  }

  logoutApp() {
    $(".tabbar").hide();

    this.fireAuth.auth.signOut().then(data => {
      this.navCtrl.setRoot(LoginPage);
    });
  }
}
