import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserListAddComponent } from './user-list-add.component';

describe('UserListAddComponent', () => {
  let component: UserListAddComponent;
  let fixture: ComponentFixture<UserListAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserListAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserListAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
