import { Component, OnInit } from '@angular/core';
import { UsersService } from '../_services/users.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {

  constructor(
    public _userService:UsersService,
    public ModalService:NgbModal,
  ) {}
    
  ngOnInit(): void {
  }

  openCreate(){
    
  }

}
