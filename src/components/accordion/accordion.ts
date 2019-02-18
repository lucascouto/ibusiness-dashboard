import { Component, ViewChild, OnInit, Renderer, Input } from "@angular/core";

/**
 * Generated class for the AccordionComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: "accordion",
  templateUrl: "accordion.html"
})
export class AccordionComponent implements OnInit {
  accordionExpanded = false;
  @ViewChild("cardcontent") cardContent: any;
  @Input("title") title: string;
  @Input("bids") bids: string;

  icon: string = "arrow-forward";

  constructor(public rendered: Renderer) {}

  ngOnInit() {
    this.rendered.setElementStyle(
      this.cardContent.nativeElement,
      "webkitTransition",
      "max-height 500ms, padding 500ms"
    );
  }

  toggleAccordion() {
    if (this.accordionExpanded) {
      this.rendered.setElementStyle(
        this.cardContent.nativeElement,
        "max-height",
        "0px"
      );
      this.rendered.setElementStyle(
        this.cardContent.nativeElement,
        "padding",
        "0px 16px"
      );
    } else {
      this.rendered.setElementStyle(
        this.cardContent.nativeElement,
        "max-height",
        "500px"
      );
      this.rendered.setElementStyle(
        this.cardContent.nativeElement,
        "padding",
        "13px 16px"
      );
    }
    this.accordionExpanded = !this.accordionExpanded;
    this.icon = this.icon == "arrow-forward" ? "arrow-down" : "arrow-forward";
  }
}
