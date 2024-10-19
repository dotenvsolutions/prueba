import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AccessService } from '../../../services/access.service';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent implements OnInit {
  dataUser:any = {}
  userData: any = {}
  constructor(private access: AccessService, ) {}
  ngOnInit(): void {
    this.userData = localStorage.getItem('user')
     
    if(this.userData !== null){
      this.dataUser = JSON.parse(this.userData)
       
    }else{
      this.access.currentUser$.subscribe(data=>{
        this.dataUser = data
         
      })
    }

    this.access.logOutUser(this.dataUser.id,this.dataUser.sessionId).subscribe({
      next: (data) => {
        console.log(data)
      },
      error: (error) => {
        console.log(error)
      }
    })
  }
}
