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
