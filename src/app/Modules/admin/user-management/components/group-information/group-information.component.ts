import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../../../../services/auth.service';
import { SecureStorageService } from '../../../secure-storage.service';
import { CommonModule } from '@angular/common';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { ActivatedRoute } from '@angular/router';
import { UserManagementService } from '../../../../../services/user-management.service';
import { group } from '@angular/animations';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';
import { LocationService } from '../../../../../services/location.service';

@Component({
  selector: 'app-group-information',
  standalone: true,
  imports: [TabViewModule,ButtonModule,TableModule, CommonModule, InputTextModule, TagModule, FormsModule,BreadcrumbModule,TranslateModule,
    DropdownModule, MultiSelectModule, ProgressBarModule,ReactiveFormsModule,CommonModule,DialogModule],  templateUrl: './group-information.component.html',
  styleUrl: './group-information.component.css'
})
export class GroupInformationComponent {
  regions: any[] = [];
  isDeleting:boolean=false // Array to store regions fetched from the API
  groupIdToDelete:any
  groupNameToDelete:any
  showDetails:boolean=false
    companyDetail:any
    items: MenuItem[] | undefined;
    display = false;
    delete:boolean=false
    giveawayForm!: FormGroup;
    fields = [
      { label: 'Label', name: 'field1' },
      { label: 'Label', name: 'field2' },
      { label: 'Label', name: 'field3' },
      { label: 'Label', name: 'field4' },
      { label: 'Label', name: 'field3' },
      { label: 'Label', name: 'field4' }
    ];
    rowFields = [
      [this.fields[0], this.fields[1]],
      [this.fields[2], this.fields[3]],
      [this.fields[4], this.fields[5]]
    
    ];
    editMode = false;
    home: MenuItem | undefined;
    giveAwayList:any=[
      {
        type:'National Day',
        date:'24-10-2024',
        null:'null',
        nullList:'null'
      }
    ]
    customersData: any[] = [
    {
      id: 1,
      name: 'Rana Haroon',
      company: { code: 'us', name: '03044372368' },
      representative: { name: 'John Doe', image: 'amyelsner.png' },
      customerName:'Haroon',
      balance: 1200.5,
      activity: 80,
      verified: true,
    },
    {
      id: 2,
      name: 'Rana Haroon',
      company: { code: 'us', name: '03044372368' },
      representative: { name: 'Jane Smith', image: 'annafali.png' },
      customerName:'Haroon',
      balance: 900.0,
      activity: 60,
      verified: false,
    },
    {
      id: 3,
      name: 'Rana Haroon',
      company: { code: 'us', name: '03044372368' },
      representative: { name: 'Pierre Dupont', image: 'bernardodominic.png' },
      customerName:'Haroon',
      balance: 4500.75,
      activity: 95,
      verified: true,
    },
    {
      id: 4,
      name: 'Rana Haroon',
      company: { code: 'us', name: '03044372368' },
      representative: { name: 'Hans Müller', image: 'elwinsharvill.png' },
      customerName:'Haroon',
      balance: 320.0,
      activity: 50,
      verified: false,
    },
    {
      id: 5,
      name: 'Rana Haroon',
      company: { code: 'us', name: '03044372368' },
      representative: { name: 'Yuki Yamamoto', image: 'ivanmagalhaes.png' },
      customerName:'Haroon',
      balance: 7800.25,
      activity: 70,
      verified: true,
    }
    ];
    addGroup!:FormGroup
    Cities:any
    companyId: string | null = null;
      loading: boolean = false;
      branches:any
      customers: any[] = [];
      currentPage: number = 1;
      perPage: number = 10; // Adjust as needed
      totalRecords: number = 0; 
      groupName:any
      decryptedId:any
      addCompanyForm!:FormGroup
      constructor(private locationService:LocationService ,private toastr: ToastrService ,private userService:UserManagementService,private secureStorageService: SecureStorageService,private fb:FormBuilder,private authservice:AuthService,private route:ActivatedRoute) {

      }
    
      ngOnInit(): void {
        this.addCompanyForm = this.fb.group({
          name: ['', Validators.required], // Name field
          category: ['', [Validators.required]], // Mobile field (10 digits)
          cr_number: ['', [Validators.required]], // Email field
          city_id: ['',], // Address field
          website_url: ['', ], // Address field
          number_branches: ['',], // Address field
          group_id:[''],
          user_id:[''],
          adminEmail:['']
        });
        this.initializeForm();

        // Call async function to handle loading of regions and group details
        this.loadRegionsAndGroupDetail();
        this.fetchCities()

      }
      initializeForm() {
      
        this.addGroup = this.fb.group({
          id:[''],
          name: [{ value: '', disabled: true }, Validators.required],
          cr_number: [{ value: '', disabled: true }, Validators.required],
          business_category: [{ value: '', disabled: true }, ],
          region_id: [{ value: '', disabled: true }, ],
          _method:['PUT'],
          adminName: [{ value: '', disabled: true }, ],
          adminEmail: [{ value: '', disabled: true },]
        });
      }
      async loadRegionsAndGroupDetail() {
        try {
          await this.fetchRegions();
    
          this.route.paramMap.subscribe(async (params) => {
            const encryptedId = params.get('id'); // Get the encrypted ID from the route
            if (encryptedId) {
              this.decryptedId = this.secureStorageService.decryptId(encryptedId); // Decrypt the ID
              await this.getGroupsDetail(this.decryptedId);
              // this.loadCompanies()

            }
          });
        } catch (error) {
          console.error('Error loading regions or group details:', error);
        }

      }
      fetchRegions() {
        this.userService.fetchRegions().subscribe({
          next: (result) => {
            this.regions = result.data.data; // Assuming API returns regions in `result.data`
          },
          error: (error) => {
            console.error('Error fetching regions:', error);
          }
        });
      }
      onView(customer:any): void {
        this.addCompanyForm.patchValue(customer)
        this.loadBanches(customer.id)
        this.showDetails = true; 
      } 
      getGroupsDetail(GroupId: any) {
        this.userService.getGroupDetailById(GroupId).subscribe({
          next: (result) => {
            debugger
            this.companyDetail=result.data.companies
            this.groupName = result.data.row.name;
            this.addGroup.patchValue(result.data.row);
      
            // Ensure that regions are loaded before setting the selected region
            if (this.regions && this.regions.length > 0) {
              debugger
              // Find and set the selected region by matching the region ID
              const selectedRegion = this.regions.find(region => region.id === result.data.region_id);
              if (selectedRegion) {
                this.addGroup.get('region_id')?.setValue(selectedRegion.id);
              }
            }
      
            console.log(result);
          },
          error: (error) => {
            console.error('Error fetching group details:', error);
          }
        });
      }
      
      
    enableEditMode() {
      this.editMode = true;
      this.addGroup.enable(); // Enable all form controls
    }
  
    cancelEdit() {
      this.editMode = false;
      this.addGroup.disable(); // Disable all form controls
    }
  
    onUpdateGroup() {
      debugger
      if (this.addGroup.valid) {
        this.userService.updateGroup(this.addGroup.value).subscribe({
          next:(result)=>{
            debugger
            this.toastr.success('Group added Successfully', 'Success');
            this.addGroup.disable(); // Disable fields after updating
          }
        })
        // Perform your update operation here
       
      }
    }
      onAddgroupSubmit(){
    
      }
      openDialog() {
        this.display = true;
      }
      onCancel() {
        this.display = false;
        this.addCompanyForm.reset();
      }
    
      onAddGiveaway() {
        if (this.giveawayForm.valid) {
          console.log('Giveaway Form Data:', this.giveawayForm.value);
          this.display = false;
          this.giveawayForm.reset();
        }
      }
    //   getCompanyInformation(){
    // this.authservice.getCompanyInformation(this.companyId).subscribe({
    //   next:(response:any)=>{
    // debugger
    // console.log(response.data)
    //     this.addCompanyForm.patchValue(response.data);
    //     debugger
    //     this.authservice.companyId=response.data.id
    //   }
    // })
    //   }
    fetchCities() {
      debugger
      this.locationService.getCities().subscribe({
        next: (data) => {
          debugger
          this.Cities = data.data.data;
        },
        error: (error) => {
          console.error('Error fetching groups:', error);
        }
      });
    }
      loadBanches(CompanyId:any): void {
        this.loading = true;
        const queryParams: any = {
          per_page: this.perPage,
          page: this.currentPage,
          company_id: CompanyId || undefined // Only add branch_id if defined
      };
        this.authservice.getBranches(queryParams).subscribe({
        
          next: (response: any) => {
            debugger
            this.branches = response.data.data; 
            console.log(this.customers)
            this.loading = false;
          },
          error: (error: any) => {
            console.error('Error fetching customers:', error);
            this.loading = false;
          },
        });
      }
      loadCompanies(): void {
        this.loading = true;
        debugger
        this.userService.getCustomers(this.decryptedId).subscribe({
          next: (response: any) => {
            debugger
            this.customers = response.data; 
            this.loading = false;
          },
          error: (error: any) => {
            console.error('Error fetching customers:', error);
            this.loading = false;
          },
        });
      }
      onPageChange(event: any): void {
        this.currentPage = event.page + 1; // PrimeNG uses 0-based indexing
        // this.loadCustomers(this.companyId);
      }
   
     
      onSubmit(): void {
        debugger
        if (this.addCompanyForm.valid) {
          this.addCompanyForm.patchValue({
            group_id: this.decryptedId,
          });
          // Call the API to add the company
          this.authservice.addCompany(this.addCompanyForm.value).subscribe({
            next: (response: any) => {
              this.display = false;
           this.getGroupsDetail(this.decryptedId);

              // Navigate to the companies list
      // this.loadCustomers()
              // Reset the form after navigation
              this.addCompanyForm.reset();
            },
            error: (error: any) => {
            },
          });
        } 
      }
      onDelete(id: number, name: string) {
        this.groupIdToDelete = id;
        this.groupNameToDelete = name;
        this.delete = true;
      }
    
      // Method to handle the confirmation of deletion
      confirmDelete() {
        if (this.groupIdToDelete !== null) {
          this.isDeleting = true; // Start loader
          this.authservice.deleteCompany(this.groupIdToDelete).subscribe({
            next: () => {
              this.toastr.success('Group deleted Successfully', 'Success');
    
              this.companyDetail = this.companyDetail.filter((group:any) => group.id !== this.groupIdToDelete);
              this.totalRecords = this.companyDetail.length;
              this.delete = false;
              this.isDeleting = false; // Stop loader
              this.groupIdToDelete = null;
              this.groupNameToDelete = null;
            },
            error: (error) => {
              console.error('Error deleting group:', error);
              this.isDeleting = false; // Stop loader even if there's an error
            }
          });
        }
      }
    
      // Method to handle the cancellation of deletion
      onDeleteCancel() {
        this.delete = false;
        this.groupIdToDelete = null;
        this.groupNameToDelete = null;
      }
    }
    
