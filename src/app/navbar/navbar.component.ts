import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TuiTabBarComponent, TuiTabBarItem } from '@taiga-ui/addon-mobile';
// Taiga UI components are used in the template; treat as custom elements
// to avoid needing the actual runtime imports during authoring.

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, TuiTabBarComponent, TuiTabBarItem],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  // single tab for now; TabBar handles selection via routerLink
}
