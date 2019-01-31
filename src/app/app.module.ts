/* IMPORT DEFAULT MODULES */
import { BrowserModule } from "@angular/platform-browser";
import { ErrorHandler, NgModule } from "@angular/core";
import { IonicApp, IonicErrorHandler, IonicModule } from "ionic-angular";
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";

/* IMPORT INTERNAL COMPONENTS */
import { MyApp } from "./app.component";
import { HomePage } from "../pages/home/home";
import { LoginPage } from "../pages/login/login";

/* IMPORT ANGULARFIRE MODULES */
import { AngularFireModule } from "@angular/fire";
import {
  AngularFireDatabaseModule,
  AngularFireDatabase
} from "@angular/fire/database";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFirestoreModule } from "angularfire2/firestore";

import { FormsModule } from "@angular/forms";

/* ENVIROMENT VARIABLE TO FIREBASE INSTANCE */
export const firebaseConfig = {
  apiKey: "AIzaSyBthU9q7uf48uH3_P0pMDEThgbE98PR-DA",
  authDomain: "ibusiness-test-fe6c7.firebaseapp.com",
  databaseURL: "https://ibusiness-test-fe6c7.firebaseio.com",
  projectId: "ibusiness-test-fe6c7",
  storageBucket: "ibusiness-test-fe6c7.appspot.com",
  messagingSenderId: "1001140091098"
};

@NgModule({
  declarations: [MyApp, HomePage, LoginPage],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    FormsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [MyApp, HomePage, LoginPage],
  providers: [
    StatusBar,
    SplashScreen,
    AngularFireDatabase,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule {}
