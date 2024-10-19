import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list'; 
import { RouterOutlet } from '@angular/router';
import { SidenavHeaderComponent } from '../sidenav-header/sidenav-header.component';


@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule,MatButtonModule,MatIconModule,MatSidenavModule,MatToolbarModule,MatListModule,RouterOutlet,SidenavHeaderComponent],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent {

}
