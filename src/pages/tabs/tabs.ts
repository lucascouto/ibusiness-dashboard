import { Component } from "@angular/core";
import { HomePage } from "../home/home";
import { ProductsPage } from "../products/products";
import { UsersPage } from "../users/users";
import { RequestsPage } from "../requests/requests";

@Component({
  selector: "page-tabs",
  templateUrl: "tabs.html"
})
export class TabsPage {
  homePage = HomePage;
  productsPage = ProductsPage;
  usersPage = UsersPage;
  requestsPage = RequestsPage;
}
