import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModifierMenuPage } from './modifier-menu.page';

describe('ModifierMenuPage', () => {
  let component: ModifierMenuPage;
  let fixture: ComponentFixture<ModifierMenuPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModifierMenuPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModifierMenuPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
