import { Component, ViewChild } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController
} from "ionic-angular";
import { AngularFireAuth } from "@angular/fire/auth";
import { HomePage } from "../home/home";

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-login",
  templateUrl: "login.html"
})
export class LoginPage {
  @ViewChild("user") user;
  @ViewChild("password") password;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public fire: AngularFireAuth,
    public toastCtrl: ToastController
  ) {}

  login() {
    let toast = this.toastCtrl.create({ duration: 3000, position: "bottom" });
    this.fire.auth
      .signInWithEmailAndPassword(this.user.value, this.password.value)
      .then(data => {
        console.log("login data: ", data);
        this.navCtrl.setRoot(HomePage);
      })
      .catch((error: any) => {
        console.log("error = ", error);
        if (error.code == "auth/invalid-email") {
          toast.setMessage("Invalid email");
        } else if (error.code == "auth/user-disabled") {
          toast.setMessage("Disabled user");
        } else if (error.code == "auth/wrong-password") {
          toast.setMessage("Incorrect Password");
        } else if (error.code == "auth/user-not-found") {
          toast.setMessage("User not found");
        }
        toast.present();
      });
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad LoginPage");
  }
}
