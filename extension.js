const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

let apiDefinition = null;

/**
 * Load the CARLA API definition from the utils folder
 * @param {string} extensionPath 
 * @returns {Object|null}
 */
function loadApiDefinition(extensionPath) {
    try {
        const jsonPath = path.join(extensionPath, 'utils', 'carla_api.json');
        const jsonContent = fs.readFileSync(jsonPath, 'utf8');
        return JSON.parse(jsonContent);
    } catch (error) {
        console.error('Failed to load CARLA API definition:', error);
        vscode.window.showErrorMessage('Failed to load CARLA API definition file');
        return null;
    }
}

/**
 * Parse method signature to extract parameter details
 * @param {string} signature 
 * @returns {Array<{name: string, type?: string, default?: string}>}
 */
function parseMethodSignature(signature) {
    const match = signature.match(/\((.*?)\)/);
    if (match && match[1]) {
        return match[1].split(',')
            .map(param => param.trim())
            .filter(param => param && !param.includes('self'))
            .map(param => {
                const result = { name: '', type: undefined, default: undefined };
                
                // Handle type hints
                const typeMatch = param.match(/(\w+)\s*:\s*([^=]+?)(?:\s*=\s*(.+))?$/);
                if (typeMatch) {
                    result.name = typeMatch[1];
                    result.type = typeMatch[2].trim();
                    if (typeMatch[3]) {
                        result.default = typeMatch[3].trim();
                    }
                } else {
                    // Handle parameters without type hints
                    const parts = param.split('=').map(p => p.trim());
                    result.name = parts[0].split(':')[0].trim();
                    if (parts[1]) {
                        result.default = parts[1];
                    }
                }
                
                return result;
            });
    }
    return [];
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    console.log('CARLA API Completion extension is now active!');

    apiDefinition = loadApiDefinition(context.extensionPath);
    if (!apiDefinition) {
        return;
    }

    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    statusBarItem.text = "CARLA API Ready";
    statusBarItem.tooltip = "CARLA API completion is active";
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);

    // Register completion provider with context awareness
    const completionProvider = vscode.languages.registerCompletionItemProvider(
        'python',
        {
            provideCompletionItems(document, position) {
                if (!apiDefinition) return [];

                const linePrefix = document.lineAt(position).text.substring(0, position.character);
                const completionItems = [];

                // Check if we're typing after a dot
                const dotMatch = linePrefix.match(/(\w+)\.\s*$/);
                if (dotMatch) {
                    const className = dotMatch[1];
                    const classData = apiDefinition.classes[className];

                    if (classData) {
                        // Add methods for this specific class
                        for (const methodName in classData.methods) {
                            const methodData = classData.methods[methodName];
                            const methodItem = new vscode.CompletionItem(
                                methodName,
                                vscode.CompletionItemKind.Method
                            );

                            // Add method documentation
                            methodItem.documentation = new vscode.MarkdownString()
                                .appendCodeblock(methodData.signature || methodName + '()', 'python')
                                .appendMarkdown('\n\n' + (methodData.docstring || 'No documentation available'));

                            // Add parameter snippets
                            if (methodData.signature) {
                                const params = parseMethodSignature(methodData.signature);
                                if (params.length > 0) {
                                    methodItem.insertText = new vscode.SnippetString(
                                        `${methodName}(${params.map((p, i) => `\${${i + 1}:${p.name}}`).join(', ')})`
                                    );
                                }
                            }

                            methodItem.sortText = '1' + methodName;
                            completionItems.push(methodItem);
                        }

                        // Add properties for this specific class
                        for (const propName in classData.properties) {
                            const propData = classData.properties[propName];
                            const propItem = new vscode.CompletionItem(
                                propName,
                                vscode.CompletionItemKind.Property
                            );

                            const access = [];
                            if (propData.readable) access.push('Read');
                            if (propData.writable) access.push('Write');
                            
                            propItem.documentation = new vscode.MarkdownString()
                                .appendMarkdown(`**${access.join('/')} Property**\n\n`)
                                .appendMarkdown(propData.docstring || 'No documentation available');

                            propItem.sortText = '2' + propName;
                            completionItems.push(propItem);
                        }
                    }
                } else {
                    // Only show class completions when not typing after a dot
                    for (const className in apiDefinition.classes) {
                        const classData = apiDefinition.classes[className];
                        const item = new vscode.CompletionItem(className, vscode.CompletionItemKind.Class);
                        item.documentation = new vscode.MarkdownString(classData.docstring || `CARLA ${className} class`);
                        item.sortText = '0' + className;
                        completionItems.push(item);
                    }
                }

                return completionItems;
            }
        },
        '.' // Trigger completion on dot
    );

    // Register signature help provider
    const signatureProvider = vscode.languages.registerSignatureHelpProvider(
        'python',
        {
            provideSignatureHelp(document, position) {
                const lineText = document.lineAt(position).text;
                const linePrefix = lineText.substring(0, position.character);
                
                // Find the method call being typed
                const methodMatch = linePrefix.match(/(\w+)\.(\w+)\s*\(/);
                if (!methodMatch) return null;

                const [_, className, methodName] = methodMatch;
                const classData = apiDefinition.classes[className];
                if (!classData || !classData.methods[methodName]) return null;

                const methodData = classData.methods[methodName];
                const params = parseMethodSignature(methodData.signature);

                const signatureHelp = new vscode.SignatureHelp();
                const signature = new vscode.SignatureInformation(
                    methodData.signature,
                    new vscode.MarkdownString(methodData.docstring)
                );

                // Add parameter information
                signature.parameters = params.map(param => {
                    const label = param.type ? 
                        `${param.name}: ${param.type}` : 
                        param.name;
                    
                    const documentation = new vscode.MarkdownString()
                        .appendMarkdown(`Parameter: \`${param.name}\`\n\n`)
                        .appendMarkdown(param.type ? `Type: \`${param.type}\`\n\n` : '')
                        .appendMarkdown(param.default ? `Default: \`${param.default}\`\n\n` : '');

                    return new vscode.ParameterInformation(label, documentation);
                });

                signatureHelp.signatures = [signature];
                signatureHelp.activeSignature = 0;
                signatureHelp.activeParameter = Math.max(0, 
                    (linePrefix.match(/,/g) || []).length
                );

                return signatureHelp;
            }
        },
        '(', ','
    );

    // Register hover provider
    const hoverProvider = vscode.languages.registerHoverProvider(
        'python',
        {
            provideHover(document, position) {
                if (!apiDefinition) return null;

                const range = document.getWordRangeAtPosition(position);
                if (!range) return null;

                const word = document.getText(range);
                
                if (apiDefinition.classes[word]) {
                    const classData = apiDefinition.classes[word];
                    return new vscode.Hover(
                        new vscode.MarkdownString()
                            .appendMarkdown(`**CARLA Class: ${word}**\n\n`)
                            .appendMarkdown(classData.docstring || 'No documentation available')
                            .appendMarkdown('\n\nBase classes: ' + classData.base_classes.join(', '))
                    );
                }

                const lineText = document.lineAt(position.line).text;
                const dotIndex = lineText.lastIndexOf('.', position.character);
                if (dotIndex > 0) {
                    const className = lineText.substring(0, dotIndex).trim().split(' ').pop();
                    const classData = apiDefinition.classes[className];
                    
                    if (classData) {
                        if (classData.methods[word]) {
                            const methodData = classData.methods[word];
                            return new vscode.Hover(
                                new vscode.MarkdownString()
                                    .appendMarkdown(`**Method: ${className}.${word}**\n\n`)
                                    .appendCodeblock(methodData.signature || '', 'python')
                                    .appendMarkdown('\n\n' + (methodData.docstring || 'No documentation available'))
                            );
                        }
                        
                        if (classData.properties[word]) {
                            const propData = classData.properties[word];
                            return new vscode.Hover(
                                new vscode.MarkdownString()
                                    .appendMarkdown(`**Property: ${className}.${word}**\n\n`)
                                    .appendMarkdown(propData.docstring || 'No documentation available')
                            );
                        }
                    }
                }

                return null;
            }
        }
    );

    context.subscriptions.push(completionProvider, signatureProvider, hoverProvider);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
}