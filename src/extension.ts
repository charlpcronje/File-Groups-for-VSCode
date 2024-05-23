import * as vscode from 'vscode';
import { FileGroupProvider, FileGroupItem } from './fileGroupProvider';

interface FileGroup {
  name: string;
  files: string[];
}

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
}

async function combineFilesToMarkdown(group: FileGroup): Promise<string> {
  let combinedContent = `START OF COMBINED FILES\n# ${group.name}\n\n`;
  const fileEntries = group.files.map((file, index) => `${index + 1}. [${file}](${file})`).join('\n');
  combinedContent += `${fileEntries}\n\n`;

  for (const file of group.files) {
    const fileUri = vscode.Uri.file(file);
    const fileContent = (await vscode.workspace.fs.readFile(fileUri)).toString();
    const fileExtension = file.split('.').pop();
    combinedContent += `## ${file}\n```${fileExtension}\n// ${file}\n${fileContent}\n```\n\n`;
  }

  combinedContent += 'END OF COMBINED FILES';
  return combinedContent;
}

export function deactivate() {}
