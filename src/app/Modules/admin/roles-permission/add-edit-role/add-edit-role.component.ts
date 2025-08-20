import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormBuilder, FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../Shared/services/shared.service';
import { TrigerToastService } from '../../Shared/services/triger-toast.service';

@Component({
  selector: 'app-add-edit-role',
  imports: [
    ToolbarModule,
    ButtonModule,
    CheckboxModule,
    ReactiveFormsModule,
    InputTextModule,
    FormsModule
  ],
  templateUrl: './add-edit-role.component.html',
  styleUrl: './add-edit-role.component.scss'
})
export class AddEditRoleComponent {
  permissions:any=[]
    private toastrService=inject(TrigerToastService)
  isLoading:boolean=false
    private router=inject(Router)
  private sharedService=inject(SharedService)
  private location=inject(Location)
private fb=inject(FormBuilder)
  addRoleForm!: FormGroup
  private route=inject(ActivatedRoute)
role_id:any
ngOnInit(){
  this.initForm()
    this.route.params.subscribe(params => {
      this.role_id = params['id'];
      if(this.role_id){
        this.getRoleDetail()
      }
    });
this.getPermissions()
}
  initForm(data?: any) {
    this.addRoleForm = this.fb.group({
      name: [data?.name || '', Validators.required],
      permissionIds: [
        (data?.permissions || []).map((f: any) => f.id),
        Validators.required
      ]
    });
  }
   getRoleDetail() {
    this.sharedService.sendGetRequest<any>('/Role',[this.role_id]).subscribe({
      next: (response: any) => {
        if (response && response.success) {
          this.initForm(response.data)
        } 
      },
      error: (error: any) => {
        
      },
      complete: () => {
      }
    })
  }
 getPermissions() {
    this.sharedService.sendGetRequest<any>('/permission').subscribe({
      next: (respose: any) => {
        if (respose && respose.success) {
          this.permissions = respose.data;
        } 
      },
      error: (error: any) => {
        
      },
      complete: () => {
      }
    })
  }
onPermissionToggle(permissionId: number) {
  const currentPermissions = this.addRoleForm.value.permissionIds as number[];

  if (currentPermissions.includes(permissionId)) {
    this.addRoleForm.patchValue({
      permissionIds: currentPermissions.filter(id => id !== permissionId)
    });
  } else {
    this.addRoleForm.patchValue({
      permissionIds: [...currentPermissions, permissionId]
    });
  }
  this.addRoleForm.get('permissions')?.updateValueAndValidity();
}

isPermissionSelected(id: number): any {
  if(this.addRoleForm.value.permissionIds){
  return this.addRoleForm.value.permissionIds.includes(id);
  }
}

addUpdateRole() {
  if (this.addRoleForm.valid) {
    const payLoad: any = { ...this.addRoleForm.value };

    let apiCall$;
    let apiUrl = '/Role';

    if (this.role_id) {
      // Update flow
      payLoad.role_id = this.role_id;
      apiUrl = `/Role`;
      apiCall$ = this.sharedService.sendPutRequest<any>(apiUrl,this.role_id, payLoad);
    } else {
      // Create flow
      apiCall$ = this.sharedService.sendPostRequest<any>(apiUrl, payLoad);
    }

    this.isLoading = true;

    apiCall$.subscribe({
      next: (response: any) => {
        if (response && response.success) {
          this.router.navigate(['/admin/auth/roles']);
          this.toastrService.showToast({
            type: 'success',
            shortMessage: 'Success!',
            detail: response.message,
          });
        } else {
          this.toastrService.showToast({
            type: 'error',
            shortMessage: 'Error!',
            detail: response.message,
          });
        }
      },
      complete: () => {
        this.isLoading = false;
      },
      error: (error: any) => {
        this.isLoading = false;
      }
    });
  } else {
    this.addRoleForm.markAllAsTouched();
    this.addRoleForm.updateValueAndValidity();
  }
}

 goBack() {
    this.location.back();
  }
}
