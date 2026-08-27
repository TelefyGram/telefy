import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as vscode from 'vscode';

type JsonObject = { [key: string]: unknown };

let values: JsonObject = {};
let configPath: vscode.Uri | undefined;
let translationDecoration: vscode.TextEditorDecorationType | undefined;

export function activate(context: vscode.ExtensionContext): void {
  const selector: vscode.DocumentSelector = [{ language: 'dart' }];
  translationDecoration = vscode.window.createTextEditorDecorationType({
    after: {
      backgroundColor: '#2d2d2d',
      color: '#f5f5f5',
      border: '1px solid #555',
      margin: '0 0 0 8px',
    },
  });
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      selector,
      { provideCompletionItems },
      "'",
      '"',
      '.',
    ),
    vscode.commands.registerCommand('translationPreview.selectConfig', selectConfig),
    vscode.commands.registerCommand('translationPreview.reload', loadConfig),
    translationDecoration,
  );

  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument(event => {
      updateDecorations(event.document);
    }),
    vscode.window.onDidChangeActiveTextEditor(editor => {
      if (editor) updateDecorations(editor.document);
    }),
  );
  const watcher = vscode.workspace.createFileSystemWatcher('**/*.json');
  watcher.onDidChange(uri => {
    if (configPath?.fsPath === uri.fsPath) void loadConfig();
  });
  context.subscriptions.push(watcher);
  void loadConfig();
  for (const editor of vscode.window.visibleTextEditors) {
    updateDecorations(editor.document);
  }
}

function provideCompletionItems(
  document: vscode.TextDocument,
  position: vscode.Position,
): vscode.CompletionItem[] | undefined {
  const line = document.lineAt(position.line).text;
  const beforeCursor = line.slice(0, position.character);
  const callStart = beforeCursor.lastIndexOf('tr(');
  if (callStart < 0) return undefined;

  const quoteStart = beforeCursor.search(/['"][^'"]*$/);
  if (quoteStart < callStart) return undefined;
  const typed = beforeCursor.slice(quoteStart + 1);
  if (typed.includes("'") || typed.includes('"') || /\s/.test(typed)) {
    return undefined;
  }

  const start = new vscode.Position(position.line, quoteStart + 1);
  const keys = flattenKeys(values);
  const prefix = typed.toLowerCase();
  const lastDot = typed.lastIndexOf('.');
  const parent = lastDot < 0 ? '' : typed.slice(0, lastDot + 1);
  const segmentPrefix = typed.slice(lastDot + 1).toLowerCase();
  const segmentStart = new vscode.Position(
    position.line,
    quoteStart + 1 + lastDot + 1,
  );
  const range = new vscode.Range(segmentStart, position);
  const candidates = new Set<string>();
  for (const key of keys) {
    if (!key.toLowerCase().startsWith(prefix)) continue;
    const remainder = key.slice(parent.length);
    if (!remainder.toLowerCase().startsWith(segmentPrefix)) continue;
    const dot = remainder.indexOf('.');
    candidates.add(dot < 0 ? remainder : remainder.slice(0, dot));
  }

  return [...candidates].map(candidate => {
    const value = lookup(`${parent}${candidate}`);
    const item = new vscode.CompletionItem(
      {
        label: candidate,
        detail: value ? `  ${value}` : '',
      },
      vscode.CompletionItemKind.Value,
    );
    item.range = range;
    item.insertText = candidate;
    item.filterText = candidate;
    return item;
  });
}

async function selectConfig(): Promise<void> {
  const file = await vscode.window.showOpenDialog({
    canSelectMany: false,
    openLabel: 'Use translation config',
    filters: { JSON: ['json'] },
  });
  if (!file?.[0]) return;

  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  const relative = workspaceFolder
    ? path.relative(workspaceFolder.uri.fsPath, file[0].fsPath)
    : file[0].fsPath;
  await vscode.workspace.getConfiguration('translationPreview').update(
    'configFiles',
    [relative],
    vscode.ConfigurationTarget.Workspace,
  );
  await loadConfig();
}

async function loadConfig(): Promise<void> {
  const configured = vscode.workspace
    .getConfiguration('translationPreview')
    .get<string[]>('configFiles', []);
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) return;

  for (const relative of configured) {
    const candidate = vscode.Uri.file(path.resolve(workspaceFolder.uri.fsPath, relative));
    try {
      const content = await fs.readFile(candidate.fsPath, 'utf8');
      const parsed: unknown = JSON.parse(content);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        values = parsed as JsonObject;
        configPath = candidate;
        updateAllDecorations();
        return;
      }
    } catch {
      // Try the next configured translation file.
    }
  }
  values = {};
  configPath = undefined;
  updateAllDecorations();
}

function updateAllDecorations(): void {
  for (const editor of vscode.window.visibleTextEditors) {
    updateDecorations(editor.document);
  }
}

function updateDecorations(document: vscode.TextDocument): void {
  const decoration = translationDecoration;
  if (!decoration || document.languageId !== 'dart') return;

  const options: vscode.DecorationOptions[] = [];
  const expression = /\btr\(\s*(['"])([^'"]+)\1\s*\)/g;
  for (let lineNumber = 0; lineNumber < document.lineCount; lineNumber++) {
    const line = document.lineAt(lineNumber);
    let match: RegExpExecArray | null;
    while ((match = expression.exec(line.text)) !== null) {
      const value = lookup(match[2]);
      if (value === undefined) continue;
      const end = match.index + match[0].length;
      options.push({
        range: new vscode.Range(
          new vscode.Position(lineNumber, end),
          new vscode.Position(lineNumber, end),
        ),
        renderOptions: { after: { contentText: value } },
      });
    }
  }
  const editor = vscode.window.visibleTextEditors.find(
    candidate => candidate.document.uri.toString() === document.uri.toString(),
  );
  editor?.setDecorations(decoration, options);
}

function flattenKeys(object: JsonObject, prefix = ''): string[] {
  const keys: string[] = [];
  for (const [key, value] of Object.entries(object)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      keys.push(...flattenKeys(value as JsonObject, fullKey));
    } else if (typeof value === 'string') {
      keys.push(fullKey);
    }
  }
  return keys;
}

function lookup(key: string): string | undefined {
  let current: unknown = values;
  for (const part of key.split('.')) {
    if (!current || typeof current !== 'object' || Array.isArray(current)) return undefined;
    current = (current as JsonObject)[part];
  }
  return typeof current === 'string' ? current : undefined;
}

export function deactivate(): void {}
