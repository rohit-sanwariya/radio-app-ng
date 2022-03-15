import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotifyMainComponent } from './spotify-main.component';

describe('SpotifyMainComponent', () => {
  let component: SpotifyMainComponent;
  let fixture: ComponentFixture<SpotifyMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpotifyMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpotifyMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
