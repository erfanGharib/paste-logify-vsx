import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('extension.pasteLogify', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    const clipboardText = await vscode.env.clipboard.readText();

    const vars = clipboardText
      .split(/[\s,]+/)
      .map(v => v.trim())
      .filter(v => v.length > 0);

    const logLines = [
      `console.group();`,
      ...vars.map(v => `console.log("${v}", ${v});`),
      `console.groupEnd();`
    ];

    const finalText = logLines.join('\n');

    editor.edit(editBuilder => {
      const selection = editor.selection;
      editBuilder.replace(selection, finalText);
    });
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}