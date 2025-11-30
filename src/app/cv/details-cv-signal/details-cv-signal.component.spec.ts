import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsCvSignalComponent } from './details-cv-signal.component';

describe('DetailsCvSignalComponent', () => {
  let component: DetailsCvSignalComponent;
  let fixture: ComponentFixture<DetailsCvSignalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsCvSignalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsCvSignalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
