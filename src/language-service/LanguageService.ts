
import { parseAndGetASTRoot, parseAndGetSyntaxErrors } from "./Parser";

import { ExpressionContext } from "../ANTLR/ExpressionsParserGrammarParser";

import * as monaco from "monaco-editor-core";
import { ILanguageError } from "./ILanguageError";
import { calcFormatted } from "./FormatterVisitor";

export default class TodoLangLanguageService {
	validate(code: string): ILanguageError[] {
		const syntaxErrors: ILanguageError[] = parseAndGetSyntaxErrors(code);
		const ast: ExpressionContext = parseAndGetASTRoot(code);
		return syntaxErrors;//.concat(checkSemanticRules(ast));
	}
	format(code: string): string {
		return calcFormatted(code).value
	}

//	autoSuggest(code: string, line: number, charPosInLine: number): monaco.languages.CompletionList {
//
//		const syntaxErrors: ILanguageError[] = parseAndGetSyntaxErrors(code);
//		let completeonItems: Array<monaco.languages.CompletionItem> = syntaxErrors.filter(err => err.startLineNumber == line && err.startColumn == charPosInLine).map(e => {
//			let ci: monaco.languages.CompletionItem = {
//
//				label: e.message,
//				/**
//				 * The kind of this completion item. Based on the kind
//				 * an icon is chosen by the editor.
//				 */
//				kind: monaco.languages.CompletionItemKind.Field,
//
//				insertText: e.message,
//				range: {
//					/**
//					 * Line number on which the range starts (starts at 1).
//	 				*/
//					startLineNumber: e.startLineNumber,
//					/**
//					 * Column on which the range starts in line `startLineNumber` (starts at 1).
//					 */
//					startColumn: e.startColumn,
//					/**
//					 * Line number on which the range ends.
//					 */
//					endLineNumber: e.endLineNumber,
//					/**
//					 * Column on which the range ends in line `endLineNumber`.
//					 */
//					endColumn: e.endColumn
//				}
//			}
//			return ci;
//		})
//
//		let ci:monaco.languages.CompletionList={
//			suggestions:completeonItems
//		}
//		return ci;
//	}
}

