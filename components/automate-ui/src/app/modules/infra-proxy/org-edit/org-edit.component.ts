import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Subject, combineLatest } from 'rxjs';
import { NgrxStateAtom } from 'app/ngrx.reducers';
import { LayoutFacadeService, Sidebar } from 'app/entities/layout/layout.facade';
import { filter, takeUntil } from 'rxjs/operators';
import { isNil } from 'lodash/fp';
import { EntityStatus, allLoaded, pending } from 'app/entities/entities';
import { Org } from 'app/entities/orgs/org.model';
import {
  getStatus, updateStatus, orgFromRoute
} from 'app/entities/orgs/org.selectors';
import { GetOrg, UpdateOrg } from 'app/entities/orgs/org.actions';

@Component({
  selector: 'app-org-edit',
  templateUrl: './org-edit.component.html',
  styleUrls: ['./org-edit.component.scss']
})

export class OrgEditComponent implements OnInit, OnDestroy {
  @Input() serverId: string;
  @Input() orgId: string;

  public org: Org;
  public saveSuccessful = false;
  public saveInProgress = false;
  public isLoading = true;
  public updateOrgForm: FormGroup;
  private isDestroyed = new Subject<boolean>();


  constructor(
    private fb: FormBuilder,
    private store: Store<NgrxStateAtom>,
    private layoutFacade: LayoutFacadeService
  ) {
      this.updateOrgForm = this.fb.group({
        name: new FormControl({value: ''}, [Validators.required]),
        admin_user: new FormControl({value: ''}, [Validators.required]),
        admin_key: new FormControl({value: ''})
      });
   }

  ngOnInit() {
    this.layoutFacade.showSidebar(Sidebar.Infrastructure);

    this.store.dispatch(new GetOrg({ server_id: this.serverId, id: this.orgId }));

    combineLatest([
      this.store.select(getStatus),
      this.store.select(updateStatus)
    ]).pipe(
      takeUntil(this.isDestroyed)
    ).subscribe(([getOrgSt, updateSt]) => {
      this.isLoading =
        !allLoaded([getOrgSt]) || updateSt === EntityStatus.loading;
    });

    combineLatest([
      this.store.select(getStatus),
      this.store.select(orgFromRoute)
    ]).pipe(
      filter(([getOrgSt, orgState]) => getOrgSt ===
        EntityStatus.loadingSuccess && !isNil(orgState)),
      takeUntil(this.isDestroyed)
    ).subscribe(([_getOrgSt, orgState]) => {
      this.org = { ...orgState };
      this.updateOrgForm.controls['name'].setValue(this.org.name);
      this.updateOrgForm.controls['admin_user'].setValue(this.org.admin_user);
      this.updateOrgForm.controls['admin_key'].setValue(this.org.admin_key);
    });

    this.store.select(updateStatus).pipe(
      takeUntil(this.isDestroyed),
      filter(state => this.saveInProgress && !pending(state)))
      .subscribe((state) => {
        this.saveInProgress = false;
        this.saveSuccessful = (state === EntityStatus.loadingSuccess);
        if (this.saveSuccessful) {
          this.updateOrgForm.markAsPristine();
        }
      });
  }

  saveOrg(): void {
    this.saveSuccessful = false;
    this.saveInProgress = true;
    const name: string = this.updateOrgForm.controls.name.value.trim();
    const admin_user: string = this.updateOrgForm.controls.admin_user.value.trim();
    const admin_key: string = this.updateOrgForm.controls.admin_key.value.trim();
    this.store.dispatch(new UpdateOrg({
      org: {...this.org, name, admin_user, admin_key}
    }));
  }

  ngOnDestroy(): void {
    this.isDestroyed.next(true);
    this.isDestroyed.complete();
  }
}
