import * as assert from "assert";
import * as vscode from "vscode";

import { getDecorations } from "../extension";

suite("Extension Test Suite", () => {
    vscode.window.showInformationMessage("Start all tests.");

    test("Should apply decorations for rem units", async () => {
        const text = "font-size: 1.5rem;\nmargin: 0.5rem;";
        const document = await vscode.workspace.openTextDocument({
            content: text
        });

        const decorations = getDecorations(text, document);

        assert.strictEqual(decorations.length, 2);

        // First decoration
        const firstDecoration = decorations[0];
        assert.strictEqual(firstDecoration.range.start.line, 0);
        assert.strictEqual(firstDecoration.range.start.character, 12);
        assert.strictEqual(firstDecoration.range.end.character, 18);
        assert.strictEqual(firstDecoration.renderOptions?.after?.contentText, " = 24px");

        // Second decoration
        const secondDecoration = decorations[1];
        assert.strictEqual(secondDecoration.range.start.line, 1);
        assert.strictEqual(secondDecoration.range.start.character, 8);
        assert.strictEqual(secondDecoration.range.end.character, 14);
        assert.strictEqual(secondDecoration.renderOptions?.after?.contentText, " = 8px");
    });

    test("Should handle negative rem units", async () => {
        const text = "transform: translateX(-1rem);";
        const document = await vscode.workspace.openTextDocument({
            content: text
        });

        const decorations = getDecorations(text, document);

        assert.strictEqual(decorations.length, 1);

        const decoration = decorations[0];
        assert.strictEqual(decoration.range.start.line, 0);
        assert.strictEqual(decoration.range.start.character, 24);
        assert.strictEqual(decoration.range.end.character, 29);
        assert.strictEqual(decoration.renderOptions?.after?.contentText, " = -16px");
    });

    test("Should handle zero and decimal rem units", async () => {
        const text = "padding: 0rem;\nborder-width: 0.25rem;";
        const document = await vscode.workspace.openTextDocument({
            content: text
        });

        const decorations = getDecorations(text, document);

        assert.strictEqual(decorations.length, 2);

        // Zero rem
        const zeroDecoration = decorations[0];
        assert.strictEqual(zeroDecoration.renderOptions?.after?.contentText, " = 0px");

        // Decimal rem
        const decimalDecoration = decorations[1];
        assert.strictEqual(decimalDecoration.renderOptions?.after?.contentText, " = 4px");
    });

    test("Should not apply decorations when no rem units are present", async () => {
        const text = "font-size: 16px;";
        const document = await vscode.workspace.openTextDocument({
            content: text
        });

        const decorations = getDecorations(text, document);

        assert.strictEqual(decorations.length, 0);
    });

    test("Extension should activate without errors", async () => {
        const extensionId = "your.extension.id"; // Replace with your actual extension ID
        const extension = vscode.extensions.getExtension(extensionId);
        assert.ok(extension);

        await extension?.activate();
        assert.ok(extension.isActive);
    });
});
