import * as vscode from "vscode";

export function getDecorations(text: string, document: vscode.TextDocument): vscode.DecorationOptions[] {
    const ONE_REM_IN_PIXEL = 16;

    const regex = /([-+]?[0-9]*\.?[0-9]+)rem/g;
    const decorationsArray: vscode.DecorationOptions[] = [];

    let match: RegExpExecArray | null = null;

    while ((match = regex.exec(text))) {
        const remValue = parseFloat(match[1]);
        const pxValue = remValue * ONE_REM_IN_PIXEL;

        const startPos = document.positionAt(match.index);
        const endPos = document.positionAt(match.index + match[0].length);

        const decoration = {
            range: new vscode.Range(startPos, endPos),
            renderOptions: {
                after: {
                    contentText: ` = ${pxValue}px`,
                    color: "gray",
                    margin: "0 0 0 5px"
                }
            }
        };

        decorationsArray.push(decoration);
    }

    return decorationsArray;
}

export function activate(context: vscode.ExtensionContext) {
    let activeEditor = vscode.window.activeTextEditor;

    const remDecorationType = vscode.window.createTextEditorDecorationType({});

    const updateDecorations = () => {
        if (!activeEditor) return void 0;

        const text = activeEditor.document.getText();
        const decorationsArray = getDecorations(text, activeEditor.document);

        activeEditor.setDecorations(remDecorationType, decorationsArray);
    };

    if (activeEditor) updateDecorations();

    vscode.window.onDidChangeActiveTextEditor(
        (editor) => {
            activeEditor = editor;
            if (editor) updateDecorations();
        },
        null,
        context.subscriptions
    );

    vscode.workspace.onDidChangeTextDocument(
        (event) => {
            if (activeEditor && event.document === activeEditor.document) updateDecorations();
        },
        null,
        context.subscriptions
    );
}

export function deactivate() {}
