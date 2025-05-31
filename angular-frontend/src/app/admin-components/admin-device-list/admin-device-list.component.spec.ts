import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDeviceListComponent } from './admin-device-list.component';

describe('AdminDeviceListComponent', () => {
  let component: AdminDeviceListComponent;
  let fixture: ComponentFixture<AdminDeviceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDeviceListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDeviceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
