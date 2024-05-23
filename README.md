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

## Installation

1. **From Visual Studio Code Marketplace**:
   - Go to the Extensions view (`Ctrl+Shift+X`).
   - Search for "File Groups for VS Code".
   - Click "Install".

2. **From .vsix File**:
   - Download the latest `.vsix` file from the [Releases](https://github.com/charlpcronje/File-Groups-for-VSCode/releases) page.
   - Open Visual Studio Code.
   - Go to the Extensions view (`Ctrl+Shift+X`).
   - Click on the three dots (`...`) in the upper right corner and select "Install from VSIX...".
   - Select the downloaded `.vsix` file.

## Usage

### Commands

You can access all the commands provided by this extension through the Command Palette (`Ctrl+Shift+P`) by searching for `File Group Manager:`. Here are the available commands:

- **File Group Manager: Create File Group**
- **File Group Manager: Add Files to Group**
- **File Group Manager: Toggle File Group**
- **File Group Manager: Duplicate Group**
- **File Group Manager: Rename Group**
- **File Group Manager: Combine Files to Markdown**
- **File Group Manager: Export File Groups**
- **File Group Manager: Import File Groups**
- **File Group Manager: Delete File Group**

### Context Menu

You can also add files to groups directly from the file explorer context menu:

- Right-click on a file or multiple selected files in the explorer.
- Choose **Add File to Group** or **Add Files to Group**.

### Combining Files to Markdown

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

## Contributing

Contributions are welcome! If you have any suggestions or find any issues, please create a new issue or submit a pull request on the [GitHub repository](https://github.com/charlpcronje/File-Groups-for-VSCode).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- Thanks to the Visual Studio Code team for providing such a powerful and extensible editor.

---

For more details and the latest updates, visit the [GitHub repository](https://github.com/charlpcronje/File-Groups-for-VSCode)