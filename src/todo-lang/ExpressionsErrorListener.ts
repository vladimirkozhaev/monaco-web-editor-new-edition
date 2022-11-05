import { ANTLRErrorListener, ParserRuleContext, RecognitionException, Recognizer, Token } from "antlr4ts";
import { Interval } from "antlr4ts/misc/Interval";
import { IntervalSet } from "antlr4ts/misc/IntervalSet";
import { ILanguageError } from "./ILanguageError";
//import { Interval, IntervalSet } from "antlr4";

export class ExpressionsErrorListener implements ANTLRErrorListener<any> {
	private errors: ILanguageError[] = [];
	private _tokens: Array<Token> | undefined
	constructor(tokens?: Array<Token>) {
		this._tokens = tokens;
	}
	syntaxError(
		recognizer: Recognizer<any, any>,
		offendingSymbol: any,
		line: number,
		charPositionInLine: number,
		message: string,
		e: RecognitionException | undefined
	): void {



		let parserRuleContext: ParserRuleContext | undefined = e ? (e.context as ParserRuleContext) : undefined;

		let expectedTokensStr: Array<string> = []

		if (e && (e as RecognitionException).expectedTokens) {
			let intSets: IntervalSet = (e as RecognitionException).expectedTokens as IntervalSet

			let expected: Array<Interval> = intSets.intervals
			let newTokens: Array<string> = expected.map(interval => {
				if (interval.a === Token.EOF) {
					return "";
				}
				if (interval.a === Token.EPSILON) {
					return "";
				}
				else {
					let val = recognizer.vocabulary.getDisplayName(interval.a)
					val = val ? val : "";

					return val;
				}
			}).filter(el => el != "" && el != undefined && !el.endsWith("_LITERAL"))
			expectedTokensStr = expectedTokensStr.concat(newTokens)
		}

		this.errors.push({
			startLineNumber: line,
			startColumn: charPositionInLine,
			endLineNumber: line + 1,
			endColumn: charPositionInLine,
			message,

			//expectedTokens: expectedTokensStr
		});

	}

	getErrors(): ILanguageError[] {
		return this.errors;
	}
}