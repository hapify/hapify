import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IChannel } from '../../interfaces/channel';
import { ITemplate } from '../../interfaces/template';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { GeneratorService } from '../../services/generator.service';

@Component({
  selector: 'app-channel-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit, OnDestroy {
  /** The generator service */
  generatorService: GeneratorService;
  /** Route params subscription */
  private paramsSubcription: Subscription;
  /** Channel instance */
  public channel: IChannel;
  /** Constructor */
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private storageService: StorageService,
    private injector: Injector,
  ) {
    // Avoid circular dependency
    this.generatorService = this.injector.get(GeneratorService);
  }

  ngOnInit(): void {
    this.paramsSubcription = this.route.params.subscribe(async (params) => {
      // Get channel id
      const id = params.id;
      // Load channel
      const channel = await this.storageService.find(id);
      // Bind the channel if any
      if (channel) {
        this.channel = channel;
      }
    });
  }

  /** On destroy */
  ngOnDestroy(): void {
    this.paramsSubcription.unsubscribe();
  }

  /** Called when the user update the channel */
  async onSave(toGenerate: ITemplate | null): Promise<void> {
    // Store the channel
    await this.storageService.update(this.channel);
    // Generate the template
    if (toGenerate) {
      await this.generatorService.compileTempate(toGenerate);
    }
  }
}
