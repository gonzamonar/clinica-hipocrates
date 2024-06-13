import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormViewerService } from '../../services/form-viewer.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-form-data-usuario',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  templateUrl: './form-data-usuario.component.html',
  styleUrl: '../form-styles.css'
})

export class FormDataUsuarioComponent {
  @Input() formGroup!: FormGroup;
  userInfo!: FormGroup;
  hide = true;

  constructor(
    public formViewer: FormViewerService
  ) {}

  ngOnInit(): void {
    this.userInfo = new FormGroup({
      nombre: new FormControl(null, [Validators.required, Validators.pattern(this.formViewer.namesRegex), Validators.minLength(3), Validators.maxLength(20)]),
      apellido: new FormControl(null, [Validators.required, Validators.pattern(this.formViewer.namesRegex), Validators.minLength(2), Validators.maxLength(25)]),
      edad: new FormControl(null, [Validators.required, Validators.pattern(this.formViewer.numberRegex), Validators.min(18), Validators.max(99)]),
      dni: new FormControl(null, [Validators.required, Validators.pattern(this.formViewer.numberRegex), Validators.min(1000000)]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
    })

    this.formGroup.addControl('userInfo', this.userInfo);
  }

  controlHasErrors(control: string){
    return this.formViewer.controlHasErrors(this.userInfo, control);
  }

  getControlErrorMessage(control: string){
    return this.formViewer.getControlErrorMessage(this.userInfo, control);
  }
}
