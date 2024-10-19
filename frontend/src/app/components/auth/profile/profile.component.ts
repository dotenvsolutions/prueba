
import { Component, OnInit,inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccessService } from '../../../services/access.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list'; 
import {MatCardModule} from '@angular/material/card'
import {MatChipsModule} from '@angular/material/chips';
import {MatTable, MatTableModule} from '@angular/material/table';
import { SidenavHeaderComponent } from '../../pages/sidenav-header/sidenav-header.component';
import * as XLSX from 'xlsx';
import {FormBuilder,FormGroup, ReactiveFormsModule, Validators} from '@angular/forms'
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { fakerES_MX as faker  } from '@faker-js/faker';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule,SidenavHeaderComponent,MatFormField,MatSelectModule, MatInputModule,MatLabel,ReactiveFormsModule, MatTableModule, MatButtonModule,MatIconModule,MatSidenavModule,MatToolbarModule,MatListModule,MatCardModule,MatChipsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
  dataUser:any = {}
  userData: any = {}
  excelData: any[] = [];
  generateExcel: any[] = [];
  fileName: string = 'prueba.xlsx'
  getListUsers: Array<any>[] = []
  errorSession: boolean = false
  errorMsg: string = ''
  displayedColumns: string[] = ['nombres','apellidos','identificacion','usuario','email','movil','fijo','rol'];
  listaRoles = [
    { id: 1, label: 'Male' },
    { id: 2, label: 'Female' },
    { id: 3, label: 'Other' },
    { id: 4, label: 'Female' },
    { id: 5, label: 'Female' },
  ];
  constructor(private access: AccessService, private fb: FormBuilder) {}
  public formBuild = inject(FormBuilder)
  public formProfile: FormGroup = this.formBuild.group({
    nombre: ['',Validators.required],
    apellido: ['',Validators.required],
    cedula: ['',Validators.required],
    movil: [''],
    fijo: [''],
    direccion: [''],
    rol: [''],
  })

  ngOnInit(): void {
    this.userData = localStorage.getItem('user')
    this.access.getAllUsers().subscribe(d=>{
      const {success,data} = d
      this.getListUsers = data
    })
    if(this.userData !== null){
      this.dataUser = JSON.parse(this.userData)
       
    }else{
      this.access.currentUser$.subscribe(data=>{
        this.dataUser = data
         
      })
    }

     

    this.formProfile = this.fb.group({
      nombre: this.dataUser.name,
      apellido: !this.dataUser.lastname ? '' : this.dataUser.lastname,
      cedula: !this.dataUser.dni ? '' : this.dataUser.dni,
      movil: this.dataUser.movil,
      fijo: this.dataUser.fijo,
      direccion : this.dataUser.direccion,
      rol: this.dataUser.rol
    })
   

  }

  updatedata() {
    const prifileData:any = {
      nombre: this.formProfile.value.nombre,
      apellido: this.formProfile.value.apellido,
      cedula: this.formProfile.value.cedula,
      movil: this.formProfile.value.movil,
      fijo: this.formProfile.value.fijo,
      direccion: this.formProfile.value.direccion,
      rol: this.formProfile.value.rol
    }
     
    this.access.updateDatauser(this.dataUser.id, prifileData).subscribe({
      next: response=>{
        const {success,msg} = response
        if(success){
          
          localStorage.setItem('user', JSON.stringify({
            id:this.userData.id,
            name:prifileData.nombre,
            lastname: prifileData.apellido,
            dni:prifileData.cedula,
            movil:prifileData.movil,
            fijo:prifileData.fijo,
            direccion:prifileData.direccion,
            rol: prifileData.rol,
            rolName: this.userData.rolName,
            email:this.userData.email,
            username: this.userData.username
          }))
          this.formProfile = this.fb.group({
            nombre: this.dataUser.name,
            apellido: !this.dataUser.lastname ? '' : this.dataUser.lastname,
            cedula: !this.dataUser.dni ? '' : this.dataUser.dni,
            movil: this.dataUser.movil,
            fijo: this.dataUser.fijo,
            direccion : this.dataUser.direccion,
            rol: this.dataUser.rol
          })
        } 
      },error: (error) => {
        this.errorSession = true
        this.errorMsg = error.error.msg
      }
    })
  }

  logOutUser() {
    this.access.logOutUser(this.dataUser.id,this.dataUser.sessionId).subscribe({
      next: (data) => {
        console.log(data)
      },
      error: (error) => {

      }
    })
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const workbook = XLSX.read(e.target.result, { type: 'binary' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      this.excelData = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      this.access.createMasiveUsers(this.excelData).subscribe({
        next: (data)=>{
          console.log(data)
        },
        error:(error)=>{

        }
      })
    };
    reader.readAsBinaryString(file);
  }

  generarRolAleatorio(roles: any[]) {
    const rolAleatorio = faker.helpers.arrayElement(roles);
      return rolAleatorio;
  }

  exportExcel() {
    this.generateExcel = []
    
    for(let i = 1; i <= 500; i++){
      this.generateExcel.push({
        'nombre': faker.person.firstName(),
        'apellido': faker.person.lastName(),
        'cedula': faker.string.numeric({ length: { min: 10, max: 10 } }),
        'movil': faker.phone.number({ style: 'human' }),
        'fijo': faker.phone.number({ style: 'human' }),
        'username': faker.internet.userName(),
        'password': faker.internet.password(),
        'email': faker.internet.email(),
        'status': 'A',
        'rol': this.generarRolAleatorio(['ADMINISTRADOR', 'SECRETARIA', 'OPERADOR'])
      })
    }
    
    //console.log(this.generateExcel)
    const ws: XLSX.WorkSheet =XLSX.utils.json_to_sheet(this.generateExcel);
 
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
  
    XLSX.utils.book_append_sheet(wb, ws, "Carga de Informacion");
    XLSX.utils.sheet_add_aoa(ws, [["NOMBRE", "APELLIDO", "CEDULA", "MOVIL", "FIJO","USUARIO","PASSWORD","EMAIL","STATUS","ROL"]], { origin: "A1" });
    XLSX.writeFile(wb, this.fileName);
  }
}

