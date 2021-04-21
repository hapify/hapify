import {
  Component,
  EventEmitter,
  Injector,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { IInfo } from '@app/interfaces/info';
import { InfoService } from '@app/services/info.service';

import { IChannel } from '../../interfaces/channel';
import { ITemplate } from '../../interfaces/template';
import { TreeBranch } from '../../interfaces/tree-branch';
import { GeneratorService } from '../../services/generator.service';


@Component({
  selector: 'app-channel-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss'],
})
export class ChannelComponent implements OnInit {
  /** The generator service */
  generatorService: GeneratorService;

  /** Channel instance */
  @Input() channel: IChannel;

  /** On save event */
  @Output() save = new EventEmitter<ITemplate | null>();

  syncing = false;

  /** Current edited template */
  currentEditedTemplate: ITemplate;

  showValidatorEditor = false;

  /** Denotes if the user has unsaved changes (to prevent reload) */
  unsavedChanges = false;

  tree: TreeBranch[];

  selectedPath = '';

  templatesToDisplay: { [key: string]: boolean } = {};

  info: IInfo;

  /** Constructor */
  constructor(private injector: Injector, private infoService: InfoService) {
    // Avoid circular dependency
    this.generatorService = this.injector.get(GeneratorService);
    this.infoService.info().then((info) => {
      this.info = info;
    });
  }

  ngOnInit(): void {
    this.updateTree();
  }

  /** Update the tree and filters */
  updateTree(): void {
    this.tree = this.buildTree();
    this.filterTemplates();
  }

  /** Get the tree */
  private buildTree(): TreeBranch[] {
    const tree = [];

    this.channel.templates.forEach((template) => {
      const pathParts = template.splitPath();

      let currentLevel = tree;
      let parentPath = '';
      pathParts.forEach((pathPart) => {
        if (currentLevel) {
          const existingPathPart = currentLevel.filter(
            (level) => level.name === pathPart,
          );
          if (existingPathPart.length) {
            parentPath = parentPath
              ? `${parentPath}/${existingPathPart[0].name}`
              : existingPathPart[0].name;
            currentLevel = existingPathPart[0].children;
          } else {
            const rootPath = parentPath;
            parentPath = parentPath ? `${parentPath}/${pathPart}` : pathPart;
            const newPathPart = {
              name: pathPart,
              path: parentPath,
              root: rootPath,
              children: [],
            };
            currentLevel.push(newPathPart);
            currentLevel = newPathPart.children;
          }
        }
      });
    });
    return tree;
  }

  /** Filters templates to display */
  filterTemplates(): void {
    this.templatesToDisplay = {};
    for (const template of this.channel.templates) {
      this.templatesToDisplay[template.path] = template.path.startsWith(
        this.selectedPath,
      );
    }
  }

  /** Called when a branch is selected */
  onSelectBranch(branch: TreeBranch): void {
    this.selectedPath = branch.children.length
      ? `${branch.path}/`
      : branch.path;
    this.filterTemplates();
  }

  /** Called when the user click on "save" */
  onSave(toGenerate: ITemplate | null): void {
    this.save.emit(toGenerate);
    this.unsavedChanges = false;
  }

  /** Will sync all templates of the channel */
  async onGenerate(): Promise<void> {
    this.syncing = true;
    await this.generatorService.compileChannel(this.channel);
    this.syncing = false;
  }

  /** Called when the user click on "add template" */
  onAddTemplate(path: string): void {
    const template = this.channel.newTemplate();
    template.path = path;
    template.content = '';
    this.channel.addTemplate(template);
    this.unsavedChanges = true;
    this.updateTree();
  }

  /** Called when a template is edited */
  onTemplateChanged(): void {
    this.unsavedChanges = true;
  }

  /** Called when the user click on "remove templates" */
  onRemoveTemplate(branch: TreeBranch): void {
    const template = this.channel.templates.find((t) => t.path === branch.path);
    if (template) {
      this.channel.removeTemplate(template);
      this.unsavedChanges = true;
      // Force selected path to parent path
      this.selectedPath = branch.root;
      this.updateTree();
    }
  }

  /** Called when the ValidatorEditor is saved */
  onValidatorEditorClose(): void {
    this.showValidatorEditor = false;
  }

  /** Called when the user click on "Open Editor" button */
  onShowEditor(template: ITemplate): void {
    this.currentEditedTemplate = template;
  }

  /** Called when the editor is saved */
  onEditorClose(): void {
    this.currentEditedTemplate = null;
  }
}
