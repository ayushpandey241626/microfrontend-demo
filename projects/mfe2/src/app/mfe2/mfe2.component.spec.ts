import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mfe2Component } from './mfe2.component';

describe('Mfe2Component', () => {
  let component: Mfe2Component;
  let fixture: ComponentFixture<Mfe2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Mfe2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Mfe2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
