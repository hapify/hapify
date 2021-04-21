import { Component, Input, OnInit } from '@angular/core';

import { IChannel } from '../../interfaces/channel';

@Component({
  selector: 'app-channel-channel-card',
  templateUrl: './channel-card.component.html',
  styleUrls: ['./channel-card.component.scss'],
})
export class ChannelCardComponent implements OnInit {
  /** Constructor */
  constructor() {}

  /** Channel instance */
  @Input() channel: IChannel;

  ngOnInit(): void {}
}
