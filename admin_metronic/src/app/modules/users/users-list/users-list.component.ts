import { Component, OnInit } from '@angular/core';
import { UsersService } from '../_services/users.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddUsersComponent } from '../components/add-users/add-users.component';
import { EditUsersComponent } from '../components/edit-users/edit-users.component';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {

  users:any = [];

  isLoading$:any;
  constructor(
    public _userService:UsersService,
    public ModalService:NgbModal,
  ) {}
    
  ngOnInit(): void {
    this.isLoading$ = this._userService.isLoading$;
    this.allUsers();
  }
  allUsers(){
    this._userService.allUsers().subscribe((resp:any) =>{
      console.log(resp);
      this.users = resp.users;
    })
  }
  openCreate(){
    const modalRef = this.ModalService.open(AddUsersComponent, {centered:true, size: 'md'});
    modalRef.result.then(
      () =>{

      },() => {

      }
    );
      modalRef.componentInstance.UserC.subscribe((resp:any)=>{
        console.log(resp);
        this.users.unshift(resp);
      })
  }
  editUser(users){
    const modalRef = this.ModalService.open(EditUsersComponent, {centered:true, size: 'md'});
    modalRef.componentInstance.user_selected = users;
    modalRef.result.then(
      () =>{

      },() => {

      }
    );
      modalRef.componentInstance.UserE.subscribe((resp:any)=>{
        console.log(resp);
        let INDEX = this.users.findIndex(item => item._id == resp._id);
        if(INDEX != -1){
          this.users[INDEX] = resp;
        }
      })
  }
  delete(users){

  }
   
}
