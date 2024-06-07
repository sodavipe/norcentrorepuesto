import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-new-variedad',
  templateUrl: './edit-new-variedad.component.html',
  styleUrls: ['./edit-new-variedad.component.scss']
})
export class EditNewVariedadComponent implements OnInit {

  @Input() variedad:any;


  isLoading$:any;
  variedad_multiple:any = null;
  constructor(
    public modal:NgbActiveModal
  ) { }

  ngOnInit(): void {
  }

}
