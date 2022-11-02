
import { parseAndGetASTRoot, parseAndGetSyntaxErrors } from "./Parser";

import { ExpressionContext } from "../ANTLR/ExpressionsParserGrammarParser";
import { calcFormatted } from './../lang-util/FormatterVisitor'
import { ILanguageError } from "../lang-util/ILanguageError";
import * as monaco from "monaco-editor-core";

export default class TodoLangLanguageService {
	validate(code: string): ILanguageError[] {
		const syntaxErrors: ILanguageError[] = parseAndGetSyntaxErrors(code);
		const ast: ExpressionContext = parseAndGetASTRoot(code);
		return syntaxErrors;//.concat(checkSemanticRules(ast));
	}
	format(code: string): string {
		return calcFormatted(code).value
	}

	autoSuggest(code: string, pos: monaco.Position): Array<monaco.languages.CompletionItem> {

		const syntaxErrors: ILanguageError[] = parseAndGetSyntaxErrors(code);
		let completeonItems: Array<monaco.languages.CompletionItem> = syntaxErrors.filter(err => err.startLineNumber == pos.lineNumber && err.startColumn == pos.column).map(e => {
			let ci: monaco.languages.CompletionItem = {

				label: e.message,
				/**
				 * The kind of this completion item. Based on the kind
				 * an icon is chosen by the editor.
				 */
				kind: monaco.languages.CompletionItemKind.Field,

				insertText: e.expectedTokens[0],
				range: {
					/**
					 * Line number on which the range starts (starts at 1).
	 				*/
					startLineNumber: e.startLineNumber,
					/**
					 * Column on which the range starts in line `startLineNumber` (starts at 1).
					 */
					startColumn: e.startColumn,
					/**
					 * Line number on which the range ends.
					 */
					endLineNumber: e.endLineNumber,
					/**
					 * Column on which the range ends in line `endLineNumber`.
					 */
					endColumn: e.endColumn
				}
			}
			return ci;
		})

		return completeonItems;
	}
}

// function checkSemanticRules(ast: TodoExpressionsContext): ITodoLangError[] {
//     const errors: ITodoLangError[] = [];
//     const definedTodos: string[] = [];
//     ast.children.forEach(node => {
//         if (node instanceof AddExpressionContext) {
//             // if a Add expression : ADD TODO "STRING"
//             const todo = node.STRING().text;
//             // If a TODO is defined using ADD TODO instruction, we can re-add it.
//             if (definedTodos.some(todo_ => todo_ === todo)) {
//                 // node has everything to know the position of this expression is in the code
//                 errors.push({
//                     code: "2",
//                     endColumn: node.stop.charPositionInLine + node.stop.stopIndex - node.stop.stopIndex,
//                     endLineNumber: node.stop.line,
//                     message: `Todo ${todo} already defined`,
//                     startColumn: node.stop.charPositionInLine,
//                     startLineNumber: node.stop.line
//                 });
//             } else {
//                 definedTodos.push(todo);
//             }
//         }else if(node instanceof CompleteExpressionContext) {
//             const todoToComplete = node.STRING().text;
//             if(definedTodos.every(todo_ => todo_ !== todoToComplete)){
//                 // if the the todo is not yet defined, here we are only checking the predefined todo until this expression
//                 // which means the order is important
//                 errors.push({
//                     code: "2",
//                     endColumn: node.stop.charPositionInLine + node.stop.stopIndex - node.stop.stopIndex,
//                     endLineNumber: node.stop.line,
//                     message: `Todo ${todoToComplete} is not defined`,
//                     startColumn: node.stop.charPositionInLine,
//                     startLineNumber: node.stop.line
//                 });
//             }
//         }

//     })
//     return errors;
// }