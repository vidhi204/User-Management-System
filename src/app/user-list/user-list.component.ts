import { Component, EventEmitter, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  providers:[BsModalService]
})
export class UserListComponent {
  @Output() closeEvent = new EventEmitter<boolean>();
  public form!: FormGroup;
  public modalRef!: BsModalRef;
  @ViewChild('templatePopup', { static: true }) templatePopup!: TemplateRef<any>;
  constructor(private modalService: BsModalService,private userService:UserService) {}

  showPopup(data?:any){
    this.form = new FormGroup({
      id: new FormControl(data?.id),
      name: new FormControl(data?.name, [Validators.required]),
      email: new FormControl(data?.email, [Validators.required, Validators.email]),
      role: new FormControl(data?.role, [Validators.required]),
    });
    this.modalRef = this.modalService.show(this.templatePopup, { backdrop: true, ignoreBackdropClick: false});
  }

  save(): void {
    if (this.form.valid) {
      const user = {
        ...this.form.value,
        id: this.form.value.id || Date.now().toString(),
      };
      if (this.form.value.id) {
        this.userService.editUser(user);
      } else {
        this.userService.addUser(user); 
      }
      this.closeEvent.emit(true)
      this.modalRef.hide();
    }
  }
}
