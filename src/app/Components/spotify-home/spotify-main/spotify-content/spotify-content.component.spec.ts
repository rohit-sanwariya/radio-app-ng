import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotifyContentComponent } from './spotify-content.component';

describe('SpotifyContentComponent', () => {
  let component: SpotifyContentComponent;
  let fixture: ComponentFixture<SpotifyContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpotifyContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpotifyContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
