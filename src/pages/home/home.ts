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

    var barcodeImage = this.storage.child(
      "barcodes/" + this.barcode.value + ".jpg"
    );
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

  read(bstr: string) {
    /* read workbook */
    const wb: XLSX.WorkBook = XLSX.read(bstr, { type: "binary" });

    /* grab first sheet */
    const wsname: string = wb.SheetNames[0];
    const ws: XLSX.WorkSheet = wb.Sheets[wsname];
    let storage = firebase.storage().ref();

    /* save data */
    this.dataExcel = <AOA>XLSX.utils.sheet_to_json(ws, { header: 1 });
    console.log(this.dataExcel);
    for (let row of this.dataExcel) {
      this.collection.add({
        barcode: row[0],
        name: row[1],
        description: row[2]
      });
      console.log(row[3]);
      imageToBinary(row[3], function(err, data) {
        if (data != undefined) {
          console.log(data);
          storage
            .child("barcodes/" + row[0] + ".jpg")
            .putString(data.dataUri, "data_url")
            .then(function(snapshot) {
              console.log("upload a file!");
            });
        } else {
        }
      });
    }
  }

  /* File Input element for browser */
  onFileChange(evt: any) {
    let toast = this.toastCtrl.create({ duration: 3000, position: "bottom" });
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
    toast.setMessage("Excel file succesfully uploaded!");
    toast.present();
  }
}
