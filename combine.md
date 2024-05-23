# Combined Files

## Index
1. [esbuild.config.js]("esbuild.config.js")
2. [package.json]("package.json")
3. [tsconfig.json]("tsconfig.json")
4. [extension.ts]("src/extension.ts")
5. [fileGroupProvider.ts]("src/fileGroupProvider.ts")
6. [types.ts]("src/types.ts")

## esbuild.config.js
```ts
// esbuild.config.js
// esbuild.config.js
const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['src/extension.ts'],
  bundle: true,
  outdir: 'out',
  platform: 'node',
  target: 'node14', // Adjust based on your target Node.js version
  external: ['vscode'],
  sourcemap: true, // Optional: for debugging
}).catch(() => process.exit(1));

```

## package.json
```ts
// package.json
// package.json
{
    "name": "file-group-manager",
    "displayName": "File Group Manager",
    "description": "Manage groups of files and perform operations on them",
    "version": "0.0.1",
    "publisher": "your-publisher",
    "engines": {
        "vscode": "^1.50.0"
    },
    "repository": {
        "type": "git",
        "url": "https://github.com/charlpcronje/File-Groups-for-VSCode.git"
    },
    "activationEvents": [
        "onCommand:fileGroupManager.createFileGroup",
        "onCommand:fileGroupManager.addFilesToGroup",
        "onCommand:fileGroupManager.toggleFileGroup",
        "onCommand:fileGroupManager.duplicateGroup",
        "onCommand:fileGroupManager.renameGroup",
        "onCommand:fileGroupManager.combineFilesToMarkdown",
        "onCommand:fileGroupManager.deleteFileGroup",
        "onCommand:fileGroupManager.exportFileGroups",
        "onCommand:fileGroupManager.importFileGroups",
        "onCommand:fileGroupManager.refreshEntry",
        "onCommand:fileGroupManager.addFileToGroupFromExplorer",
        "onCommand:fileGroupManager.addFilesToGroupFromExplorer"
    ],
    "main": "./out/extension.js",
    "contributes": {
        "commands": [{
                "command": "fileGroupManager.createFileGroup",
                "title": "Create File Group"
            },
            {
                "command": "fileGroupManager.addFilesToGroup",
                "title": "Add Files to Group"
            },
            {
                "command": "fileGroupManager.toggleFileGroup",
                "title": "Toggle File Group"
            },
            {
                "command": "fileGroupManager.duplicateGroup",
                "title": "Duplicate Group"
            },
            {
                "command": "fileGroupManager.renameGroup",
                "title": "Rename Group"
            },
            {
                "command": "fileGroupManager.combineFilesToMarkdown",
                "title": "Combine Files to Markdown"
            },
            {
                "command": "fileGroupManager.deleteFileGroup",
                "title": "Delete File Group"
            },
            {
                "command": "fileGroupManager.exportFileGroups",
                "title": "Export File Groups"
            },
            {
                "command": "fileGroupManager.importFileGroups",
                "title": "Import File Groups"
            },
            {
                "command": "fileGroupManager.refreshEntry",
                "title": "Refresh File Groups"
            },
            {
                "command": "fileGroupManager.addFileToGroupFromExplorer",
                "title": "Add File to Group"
            },
            {
                "command": "fileGroupManager.addFilesToGroupFromExplorer",
                "title": "Add Files to Group"
            }
        ],
        "views": {
            "explorer": [{
                "id": "fileGroupManagerView",
                "name": "File Groups"
            }]
        },
        "menus": {
            "explorer/context": [{
                    "command": "fileGroupManager.addFileToGroupFromExplorer",
                    "when": "resourceLangId == markdown",
                    "group": "navigation"
                },
                {
                    "command": "fileGroupManager.addFilesToGroupFromExplorer",
                    "when": "resourceLangId == markdown",
                    "group": "navigation"
                }
            ]
        }
    },
    "scripts": {
        "vscode:prepublish": "tsc -p ./",
        "compile": "tsc -watch -p ./",
        "postinstall": "node ./node_modules/@vscode/test-electron/bin/install"
    },
    "devDependencies": {
        "typescript": "^4.4.3",
        "@types/node": "^16.0.0",
        "@types/vscode": "^1.50.0",
        "@vscode/test-electron": "^1.6.0"
    }
}
```

## tsconfig.json
```ts
// tsconfig.json
// tsconfig.json
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "es6",
    "outDir": "out",
    "lib": ["es6"],
    "sourceMap": true,
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "exclude": ["node_modules", ".vscode-test"]
}

```

## extension.ts
```ts
// extension.ts
// src/extension.ts
import * as vscode from 'vscode';
import * as path from 'path';
import { FileGroupProvider, FileGroupItem } from './fileGroupProvider';
import { FileGroup } from './types';

let fileGroups: FileGroup[] = [];

export function activate(context: vscode.ExtensionContext) {
  const fileGroupProvider = new FileGroupProvider(fileGroups);
  vscode.window.registerTreeDataProvider('fileGroupManagerView', fileGroupProvider);

  context.subscriptions.push(
    vscode.commands.registerCommand('fileGroupManager.createFileGroup', async () => {
      const groupName = await vscode.window.showInputBox({ prompt: 'Enter the name for the new file group' });
      if (groupName) {
        fileGroups.push({ name: groupName, files: [] });
        vscode.window.showInformationMessage(`File group '${groupName}' created.`);
        fileGroupProvider.refresh();
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('fileGroupManager.addFilesToGroup', async () => {
      const groupName = await vscode.window.showQuickPick(fileGroups.map(group => group.name), { placeHolder: 'Select a group to add files to' });
      if (groupName) {
        const uris = await vscode.window.showOpenDialog({ canSelectMany: true, openLabel: 'Select files to add' });
        if (uris) {
          const group = fileGroups.find(group => group.name === groupName);
          if (group) {
            uris.forEach(uri => group.files.push(uri.fsPath));
            vscode.window.showInformationMessage(`Files added to group '${groupName}'.`);
            fileGroupProvider.refresh();
          }
        }
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('fileGroupManager.toggleFileGroup', async () => {
      const groupName = await vscode.window.showQuickPick(fileGroups.map(group => group.name), { placeHolder: 'Select a group to view files' });
      if (groupName) {
        const group = fileGroups.find(group => group.name === groupName);
        if (group) {
          const fileUris = group.files.map(file => vscode.Uri.file(file));
          vscode.commands.executeCommand('revealInExplorer', { uris: fileUris });
          vscode.window.showInformationMessage(`Toggled to show files in group '${groupName}'.`);
        }
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('fileGroupManager.duplicateGroup', async () => {
      const groupName = await vscode.window.showQuickPick(fileGroups.map(group => group.name), { placeHolder: 'Select a group to duplicate' });
      if (groupName) {
        const group = fileGroups.find(group => group.name === groupName);
        if (group) {
          const newGroupName = await vscode.window.showInputBox({ prompt: 'Enter the name for the new duplicated group', value: `${groupName}-copy` });
          if (newGroupName) {
            fileGroups.push({ name: newGroupName, files: [...group.files] });
            vscode.window.showInformationMessage(`Group '${groupName}' duplicated as '${newGroupName}'.`);
            fileGroupProvider.refresh();
          }
        }
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('fileGroupManager.renameGroup', async () => {
      const groupName = await vscode.window.showQuickPick(fileGroups.map(group => group.name), { placeHolder: 'Select a group to rename' });
      if (groupName) {
        const newGroupName = await vscode.window.showInputBox({ prompt: 'Enter the new name for the group', value: groupName });
        if (newGroupName) {
          const group = fileGroups.find(group => group.name === groupName);
          if (group) {
            group.name = newGroupName;
            vscode.window.showInformationMessage(`Group '${groupName}' renamed to '${newGroupName}'.`);
            fileGroupProvider.refresh();
          }
        }
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('fileGroupManager.combineFilesToMarkdown', async () => {
      const groupName = await vscode.window.showQuickPick(fileGroups.map(group => group.name), { placeHolder: 'Select a group to combine files' });
      if (groupName) {
        const group = fileGroups.find(group => group.name === groupName);
        if (group) {
          const combinedContent = await combineFilesToMarkdown(group);
          const uri = await vscode.window.showSaveDialog({ saveLabel: 'Save combined markdown file' });
          if (uri) {
            await vscode.workspace.fs.writeFile(uri, Buffer.from(combinedContent, 'utf8'));
            vscode.window.showInformationMessage(`Combined markdown file saved as '${uri.fsPath}'.`);
          }
        }
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('fileGroupManager.deleteFileGroup', async () => {
      const groupName = await vscode.window.showQuickPick(fileGroups.map(group => group.name), { placeHolder: 'Select a group to delete' });
      if (groupName) {
        const groupIndex = fileGroups.findIndex(group => group.name === groupName);
        if (groupIndex !== -1) {
          fileGroups.splice(groupIndex, 1);
          vscode.window.showInformationMessage(`Group '${groupName}' deleted.`);
          fileGroupProvider.refresh();
        }
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('fileGroupManager.exportFileGroups', async () => {
      const uri = await vscode.window.showSaveDialog({ saveLabel: 'Export File Groups as JSON' });
      if (uri) {
        const content = JSON.stringify(fileGroups, null, 2);
        await vscode.workspace.fs.writeFile(uri, Buffer.from(content, 'utf8'));
        vscode.window.showInformationMessage(`File groups exported to '${uri.fsPath}'.`);
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('fileGroupManager.importFileGroups', async () => {
      const uris = await vscode.window.showOpenDialog({ canSelectMany: false, openLabel: 'Import File Groups from JSON' });
      if (uris && uris[0]) {
        const fileContent = (await vscode.workspace.fs.readFile(uris[0])).toString();
        const importedGroups: FileGroup[] = JSON.parse(fileContent);
        fileGroups.push(...importedGroups);
        vscode.window.showInformationMessage(`File groups imported from '${uris[0].fsPath}'.`);
        fileGroupProvider.refresh();
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('fileGroupManager.refreshEntry', () => fileGroupProvider.refresh())
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('fileGroupManager.addFileToGroupFromExplorer', async (uri: vscode.Uri) => {
      const groupName = await vscode.window.showQuickPick(fileGroups.map(group => group.name), { placeHolder: 'Select a group to add file' });
      if (groupName) {
        const group = fileGroups.find(group => group.name === groupName);
        if (group) {
          group.files.push(uri.fsPath);
          vscode.window.showInformationMessage(`File '${uri.fsPath}' added to group '${groupName}'.`);
          fileGroupProvider.refresh();
        }
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('fileGroupManager.addFilesToGroupFromExplorer', async (uris: vscode.Uri[]) => {
      const groupName = await vscode.window.showQuickPick(fileGroups.map(group => group.name), { placeHolder: 'Select a group to add files' });
      if (groupName) {
        const group = fileGroups.find(group => group.name === groupName);
        if (group) {
          uris.forEach(uri => group.files.push(uri.fsPath));
          vscode.window.showInformationMessage(`Files added to group '${groupName}'.`);
          fileGroupProvider.refresh();
        }
      }
    })
  );
}

async function combineFilesToMarkdown(group: FileGroup): Promise<string> {
  let combinedContent = `START OF COMBINED FILES\n# ${group.name}\n\n`;
  const fileEntries = group.files.map((file, index) => `${index + 1}. [${file}](${file})`).join('\n');
  combinedContent += `${fileEntries}\n\n`;

  for (const file of group.files) {
    const fileUri = vscode.Uri.file(file);
    const fileContent = (await vscode.workspace.fs.readFile(fileUri)).toString();
    const fileExtension = path.extname(file).slice(1);
    combinedContent += `## ${file}\n\`\`\`${fileExtension}\n// ${file}\n${fileContent}\n\`\`\`\n\n`;
  }

  combinedContent += 'END OF COMBINED FILES';
  return combinedContent;
}

export function deactivate() { }

```

## fileGroupProvider.ts
```ts
// fileGroupProvider.ts
// src/fileGroupProvider.ts
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

```

## types.ts
```ts
// types.ts
// src/types.ts
export interface FileGroup {
    name: string;
    files: string[];
}

```

