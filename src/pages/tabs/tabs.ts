import { Component } from "@angular/core";
import { HomePage } from "../home/home";
import { ProductsPage } from "../products/products";

@Component({
  selector: "page-tabs",
  templateUrl: "tabs.html"
})
export class TabsPage {
  homePage = HomePage;
  productsPage = ProductsPage;
}
