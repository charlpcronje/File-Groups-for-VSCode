import * as vscode from 'vscode';
import { FileGroup } from './types';

export class FileGroupProvider implements vscode.TreeDataProvider<FileGroupItem> {

  private _onDidChangeTreeData: vscode.EventEmitter<FileGroupItem | undefined> = new vscode.EventEmitter<FileGroupItem | undefined>();
  readonly onDidChangeTreeData: vscode.Event<FileGroupItem | undefined> = this._onDidChangeTreeData.event;

  constructor(private fileGroups: FileGroup[]) { }

  refresh(): void {
    this._onDidChangeTreeData.fire(undefined);
  }

  getTreeItem(element: FileGroupItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: FileGroupItem): Thenable<FileGroupItem[]> {
    if (element) {
      return Promise.resolve(
        element.group.files.map(file => new FileGroupItem(file, vscode.TreeItemCollapsibleState.None, element.group))
      );
    } else {
      return Promise.resolve(
        this.fileGroups.map(group => new FileGroupItem(group.name, vscode.TreeItemCollapsibleState.Collapsed, group))
      );
    }
  }
}

export class FileGroupItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly group: FileGroup,
    public readonly command?: vscode.Command
  ) {
    super(label, collapsibleState);
    this.tooltip = `${this.label}`;
  }
}
