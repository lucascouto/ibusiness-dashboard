import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { AngularFireAuth } from "@angular/fire/auth";
import { LoginPage } from "../login/login";

@IonicPage()
@Component({
  selector: "page-requests",
  templateUrl: "requests.html"
})
export class RequestsPage {
  request_type: string = "pending";
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private fireAuth: AngularFireAuth
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad RequestsPage");
  }

  logoutApp() {
    $(".tabbar").hide();

    this.fireAuth.auth.signOut().then(data => {
      this.navCtrl.setRoot(LoginPage);
    });
  }
}
