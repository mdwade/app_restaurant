import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { CommandePage } from './commande.page';

describe('Tab3Page', () => {
  let component: CommandePage;
  let fixture: ComponentFixture<CommandePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CommandePage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(CommandePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
