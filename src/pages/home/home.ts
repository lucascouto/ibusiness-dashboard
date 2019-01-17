import { Component, ViewChild } from "@angular/core";
import { NavController, ToastController } from "ionic-angular";

import { AngularFireDatabase } from "@angular/fire/database";
import { Observable } from "rxjs/Observable";
import { AngularFirestore } from "angularfire2/firestore";
import { registerLocaleData } from "@angular/common";
import { INTERNAL_BROWSER_DYNAMIC_PLATFORM_PROVIDERS } from "@angular/platform-browser-dynamic/src/platform_providers";

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  userDoc: any;

  @ViewChild("barcode") barcode;
  @ViewChild("description") description;
  @ViewChild("name") name;



  constructor(public navCtrl: NavController, public afDB: AngularFireDatabase, private fireStore: AngularFirestore, public toastCtrl: ToastController) {

  }

  register() {

    let toast = this.toastCtrl.create({ duration: 3000, position: "bottom" });

    console.log(this.barcode.value);

    this.userDoc = this.fireStore.collection<any>('products').add({
      barcode: this.barcode.value,
      description: this.description.value,
      name: this.name.value,
    });



    toast.setMessage("Cadastrado com sucesso!");

    toast.present();
  }
}
