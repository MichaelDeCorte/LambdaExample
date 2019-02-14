import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterRedirectComponent } from './router-redirect.component';

describe('RouterRedirectComponent', () => {
  let component: RouterRedirectComponent;
  let fixture: ComponentFixture<RouterRedirectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RouterRedirectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RouterRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
