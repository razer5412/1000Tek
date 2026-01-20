import { TestBed } from '@angular/core/testing';

import {MenuComponent } from './menu/menu';

describe('Menu', () => {
  let service: MenuComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenuComponent);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
