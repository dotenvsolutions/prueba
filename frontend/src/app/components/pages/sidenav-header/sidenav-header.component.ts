import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { AccessService } from '../../../services/access.service';
import { User } from '../../../interfaces/Login';
import { RouterLink, RouterOutlet } from '@angular/router';
 

export type MenuItems = {
  icon: string;
  label: string;
  routes: string
} 

@Component({
  selector: 'app-sidenav-header',
  standalone: true,
  imports: [CommonModule,MatListModule,MatIconModule,RouterLink,RouterOutlet],
  templateUrl: './sidenav-header.component.html',
  styleUrl: './sidenav-header.component.css'
})
export class SidenavHeaderComponent implements OnInit {
  dataUser:any = {}
  menuItems: any[] = [
    {
      icon:'dashboard',
      label:'Dashboard',
      'route': '/auth/dashboard'
    },
    {
      icon:'home',
      'label':'Inicio',
      'route':'/auth/welcome'
    },
    {
      icon:'settings',
      'label':'profile',
      'route':'/auth/profile'
    },
    {
      icon:'logout',
      label:'Cerrar Sesion',
      'route': '/auth/logout'
    }
  ]
  filteredMenuItems: any[] = [];
  userData: any = {}
  constructor(private accessService: AccessService) {}

  ngOnInit(): void {
    this.userData = localStorage.getItem('user')
    if(this.userData !== null){
      this.dataUser = JSON.parse(this.userData)
      this.filterMenuItems();
    }else{
      this.accessService.currentUser$.subscribe(data=>{
        this.dataUser = data
        this.filterMenuItems();
      })
    }
  }

  filterMenuItems(): void {
    if (this.accessService.isAdmin()) {
      this.filteredMenuItems = this.menuItems;
    } else {
      this.filteredMenuItems = this.menuItems.filter(item => item.route !== 'dashboard');
    }
  }
}
