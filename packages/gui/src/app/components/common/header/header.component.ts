import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  /** Title to display */
  @Input() title: string;

  /** Constructor */
  constructor() {}

  /** On init */
  ngOnInit(): void {}
}
