import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list'; 
import { RouterOutlet } from '@angular/router';
import { SidenavHeaderComponent } from '../sidenav-header/sidenav-header.component';
import { AccessService } from '../../../services/access.service';
import {MatCardModule} from '@angular/material/card'
import {MatChipsModule} from '@angular/material/chips';
@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule,MatButtonModule,MatIconModule,MatSidenavModule,MatToolbarModule,MatListModule,MatChipsModule,MatCardModule,RouterOutlet,SidenavHeaderComponent],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent implements OnInit{
  dataUser:any = {}
  userData: any = {}
  
  constructor(private access: AccessService) {}
  ngOnInit(): void {
    this.userData = localStorage.getItem('user')
    if(this.userData !== null){
      this.dataUser = JSON.parse(this.userData)
       
    }else{
      this.access.currentUser$.subscribe(data=>{
        this.dataUser = data
         
      })
    }
    
  }
}
