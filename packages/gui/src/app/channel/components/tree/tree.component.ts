import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { TreeBranch } from '../../interfaces/tree-branch';

@Component({
  selector: 'app-channel-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
})
export class TreeComponent implements OnInit {
  @Input()
  set tree(value: TreeBranch[]) {
    // Folder first, then alphabetically
    value.sort((a, b) => {
      if (a.children.length === 0 && b.children.length > 0) {
        return 1;
      }
      if (a.children.length > 0 && b.children.length === 0) {
        return -1;
      }
      return a.name.localeCompare(b.name);
    });
    this.treeValue = value;
    this.treeValue.map((branch) => {
      this.isOpen[branch.path] = this.isOpen[branch.path] || false;
      this.types[branch.path] =
        this.types[branch.path] || TreeComponent.getType(branch); // Avoid re-compute
    });
  }

  get tree(): TreeBranch[] {
    return this.treeValue;
  }

  constructor() {}

  @Input() rootPath = '';

  @Input() selectedPath = '';

  @Input() addTemplateDisabled = false;

  @Output() selectBranch = new EventEmitter<TreeBranch>();

  @Output() addTemplate = new EventEmitter<string>();

  @Output() removeTemplate = new EventEmitter<TreeBranch>();

  newTemplatePath = '';

  private treeValue: TreeBranch[];

  isOpen: { [key: string]: boolean } = {};

  types: { [key: string]: string } = {};

  confirmDeletion = false;

  /** Get File extension */
  private static getType(branch: TreeBranch): string {
    if (branch.children.length) {
      return 'folder';
    }
    const parts = branch.name
      .replace(/{[a-z]+\.[a-z]+}/gi, 'DYN') // Replace dynamic paths
      .split('.');
    if (parts.length < 2) {
      return 'file';
    }
    return parts[parts.length - 1];
  }

  ngOnInit(): void {
    if (this.selectedPath.length) {
      this.treeValue.map((branch) => {
        this.isOpen[branch.path] = this.selectedPath.startsWith(branch.path);
      });
    }
  }

  isSelected(branch: TreeBranch): boolean {
    if (this.selectedPath.endsWith('/')) {
      return this.selectedPath === `${branch.path}/`;
    }
    return this.selectedPath === branch.path;
  }

  onAddTemplate(): void {
    if (this.addTemplateDisabled || this.newTemplatePath.length === 0) {
      return;
    }
    const path = this.rootPath.length
      ? `${this.rootPath}/${this.newTemplatePath}`
      : this.newTemplatePath;
    this.addTemplate.emit(path);
    this.newTemplatePath = '';
  }
}
