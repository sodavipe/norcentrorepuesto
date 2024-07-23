import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


declare function sideOffcanvasToggle ([],[]):any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    public router:Router
  ) { }

  ngOnInit(): void {
  }
  isHome(){
    return this.router.url == "" || this.router.url == "/" ? true : false;
  }
}
