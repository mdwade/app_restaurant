import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { IncriptionPage } from './incription.page';

describe('IncriptionPage', () => {
  let component: IncriptionPage;
  let fixture: ComponentFixture<IncriptionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncriptionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(IncriptionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
