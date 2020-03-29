import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PlatsPage } from './plats.page';

describe('PlatsPage', () => {
  let component: PlatsPage;
  let fixture: ComponentFixture<PlatsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlatsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PlatsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
