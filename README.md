# File Groups for VS Code

[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/your-publisher.file-group-manager)](https://marketplace.visualstudio.com/items?itemName=your-publisher.file-group-manager)
[![GitHub issues](https://img.shields.io/github/issues/charlpcronje/File-Groups-for-VSCode)](https://github.com/charlpcronje/File-Groups-for-VSCode/issues)
[![GitHub license](https://img.shields.io/github/license/charlpcronje/File-Groups-for-VSCode)](https://github.com/charlpcronje/File-Groups-for-VSCode/blob/main/LICENSE)

## Introduction

File Groups for VS Code is a Visual Studio Code extension that allows you to create, manage, and manipulate groups of files. This extension provides functionalities to:
- Create and rename file groups
- Add files to groups
- Toggle the visibility of files in groups
- Duplicate groups
- Combine files in a group into a single markdown file
- Export and import file groups as JSON
- Delete file groups

## Features

- **Create File Group**: Create a new file group.
- **Add Files to Group**: Add selected files to a specific group.
- **Toggle File Group**: Toggle the file explorer to only show files in the selected group.
- **Duplicate Group**: Duplicate an existing file group.
- **Rename Group**: Rename an existing file group.
- **Combine Files to Markdown**: Combine all files in a group into a single markdown file.
- **Export File Groups**: Export all file groups to a JSON file.
- **Import File Groups**: Import file groups from a JSON file.
- **Delete File Group**: Delete an existing file group.
- **Add File(s) to Group from Explorer**: Add selected file(s) to a specific group directly from the file explorer context menu.

### 1. **Installation**

#### **From .vsix File**

1. **Download the .vsix File**:
   - If you've packaged the extension as a `.vsix` file, make sure it's available on your local machine.

2. **Install the Extension**:
   - Open Visual Studio Code.
   - Go to the Extensions view by clicking on the Extensions icon in the Activity Bar on the side of the window or by pressing `Ctrl+Shift+X`.
   - Click on the ellipsis `...` in the top right corner of the Extensions view.
   - Select `Install from VSIX...`.
   - Navigate to and select the `.vsix` file you downloaded or packaged.

#### **From the Visual Studio Code Marketplace**

1. **Search for the Extension**:
   - Open Visual Studio Code.
   - Go to the Extensions view by clicking on the Extensions icon in the Activity Bar on the side of the window or by pressing `Ctrl+Shift+X`.
   - In the search bar, type "File Group Manager".
   - Find the extension in the list and click the `Install` button.

### 2. **Using the Extension**

#### **Commands**

You can access the commands provided by the extension via the Command Palette (`Ctrl+Shift+P`). Here are the available commands:

- **File Group Manager: Create File Group**: Create a new file group.
- **File Group Manager: Add Files to Group**: Add selected files to a specific group.
- **File Group Manager: Toggle File Group**: Toggle the visibility of files in the selected group.
- **File Group Manager: Duplicate Group**: Duplicate an existing file group.
- **File Group Manager: Rename Group**: Rename an existing file group.
- **File Group Manager: Combine Files to Markdown**: Combine all files in a group into a single markdown file.
- **File Group Manager: Export File Groups**: Export all file groups to a JSON file.
- **File Group Manager: Import File Groups**: Import file groups from a JSON file.
- **File Group Manager: Delete File Group**: Delete an existing file group.
- **File Group Manager: Refresh File Groups**: Refresh the list of file groups.

#### **Context Menu**

You can also add files to groups directly from the file explorer context menu:

1. **Add File to Group**:
   - Right-click on a file in the explorer.
   - Choose **Add File to Group** from the context menu.
   - Select the group you want to add the file to.

2. **Add Files to Group**:
   - Right-click on multiple selected files in the explorer.
   - Choose **Add Files to Group** from the context menu.
   - Select the group you want to add the files to.

#### **Combining Files to Markdown**

When combining files in a group to a markdown file, the format will be as follows:

```markdown
START OF COMBINED FILES
# Group name

1. [Relative path to file 1](relative path to file 1)
2. [Relative path to file 2](relative path to file 2)
3. [Relative path to file 3](relative path to file 3)

## Relative path to file 1
`\`\`{file extension of file 1}
// {relative path to file 1}
{File content of file 1}
`\`\`

## Relative path to file 2
`\`\`{file extension of file 2}
// {relative path to file 2}
{File content of file 2}
`\`\`

## Relative path to file 3
`\`\`{file extension of file 3}
// {relative path to file 3}
{File content of file 3}
`\`\`
END OF COMBINED FILES
```

### 3. **Example Workflow**

1. **Creating a File Group**:
   - Open the Command Palette (`Ctrl+Shift+P`).
   - Type `File Group Manager: Create File Group` and press `Enter`.
   - Enter the name of the new file group and press `Enter`.

2. **Adding Files to a Group**:
   - Open the Command Palette (`Ctrl+Shift+P`).
   - Type `File Group Manager: Add Files to Group` and press `Enter`.
   - Select the group you want to add files to.
   - Select the files from the open dialog and press `Enter`.

3. **Toggling File Group Visibility**:
   - Open the Command Palette (`Ctrl+Shift+P`).
   - Type `File Group Manager: Toggle File Group` and press `Enter`.
   - Select the group whose files you want to view.

4. **Combining Files into Markdown**:
   - Open the Command Palette (`Ctrl+Shift+P`).
   - Type `File Group Manager: Combine Files to Markdown` and press `Enter`.
   - Select the group whose files you want to combine.
   - Save the combined markdown file to the desired location.

### 4. **Contributing**

If you want to contribute to the extension or report issues, visit the [GitHub repository](https://github.com/charlpcronje/File-Groups-for-VSCode).

### 5. **License**

This extension is licensed under the MIT License. See the [LICENSE](https://github.com/charlpcronje/File-Groups-for-VSCode/blob/main/LICENSE) file for details.

### 6. **Acknowledgements**

- Thanks to the Visual Studio Code team for providing such a powerful and extensible editor.

---

For more details and the latest updates, visit the [GitHub repository](https://github.com/charlpcronje/File-Groups-for-VSCode).

Let me know if you need further assistance or if there's anything else I can help you with!