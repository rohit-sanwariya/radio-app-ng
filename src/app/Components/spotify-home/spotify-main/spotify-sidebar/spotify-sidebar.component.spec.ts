import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotifySidebarComponent } from './spotify-sidebar.component';

describe('SpotifySidebarComponent', () => {
  let component: SpotifySidebarComponent;
  let fixture: ComponentFixture<SpotifySidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpotifySidebarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpotifySidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
