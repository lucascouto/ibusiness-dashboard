import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, Platform } from "ionic-angular";
import {
  AngularFirestore,
  AngularFirestoreCollection
} from "angularfire2/firestore";
import { Observable } from "rxjs";
import { Users } from "./users.model";
import { Product } from "../products/products.model";
import { StorageProvider } from "../../providers/storage/storage";

/**
 * Generated class for the UsersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-users",
  templateUrl: "users.html"
})
export class UsersPage {
  users: Observable<Users[]>;
  selected_user: string = "retailers";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private fireStore: AngularFirestore,
    private storage: StorageProvider
  ) {
    this.users = this.storage.users;
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad UsersPage");
  }
}
