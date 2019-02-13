/* IMPORT DEFAULT MODULES */
import { BrowserModule } from "@angular/platform-browser";
import { ErrorHandler, NgModule } from "@angular/core";
import { IonicApp, IonicErrorHandler, IonicModule } from "ionic-angular";
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";

import { BarcodeScanner } from "@ionic-native/barcode-scanner";

/* IMPORT INTERNAL COMPONENTS */
import { MyApp } from "./app.component";
import { HomePage } from "../pages/home/home";
import { LoginPage } from "../pages/login/login";
import { UpdateProductPage } from "../pages/update-product/update-product";

/* IMPORT ANGULARFIRE MODULES */
import { AngularFireModule } from "@angular/fire";
import {
  AngularFireDatabaseModule,
  AngularFireDatabase
} from "@angular/fire/database";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFirestoreModule } from "angularfire2/firestore";

import { FormsModule } from "@angular/forms";
import { ProductsPage } from "../pages/products/products";
import { TabsPage } from "../pages/tabs/tabs";
import { StorageProvider } from "../providers/storage/storage";
import { firebaseConfig } from "./firebase.config";
import { UsersPage } from "../pages/users/users";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    ProductsPage,
    TabsPage,
    UpdateProductPage,
    UsersPage
  ],
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
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    ProductsPage,
    TabsPage,
    UpdateProductPage,
    UsersPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AngularFireDatabase,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    BarcodeScanner,
    StorageProvider
  ]
})
export class AppModule {}
