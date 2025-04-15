import * as vscode from 'vscode';
import { CONSOLE_GROUP, CONSOLE_GROUP_END } from './constants';

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('extension.pasteLogify', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    const clipboardText = await vscode.env.clipboard.readText();

    const vars = clipboardText
      .split(/[\s,]+/)
      .map(v => v.trim())
      .filter(v => v.length > 0);

    const currentLine = editor.document.lineAt(editor.selection.start.line);
    const indentMatch = currentLine.text.match(/^(\s*)/);
    const indent = indentMatch ? indentMatch[1] : "";
    
    const logLines = [
      CONSOLE_GROUP,
      ...vars.map(v => `console.log("${v}", ${v});`),
      CONSOLE_GROUP_END,
    ];

    const finalText = logLines.map(line => indent + line).join('\n');

    editor.edit(editBuilder => {
      const startLine = editor.selection.start.line;
      const lineRange = editor.document.lineAt(startLine).range;
    
      editBuilder.replace(lineRange, finalText);
    });
    
    // Move the cursor to the line between double quotes in: console.group("")
    const insertLine = editor.selection.start.line;
    const currentColumn = indent.length + (CONSOLE_GROUP.length - 3);
    const newPosition = new vscode.Position(insertLine, currentColumn);
    editor.selection = new vscode.Selection(newPosition, newPosition);
    editor.revealRange(new vscode.Range(newPosition, newPosition));
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
