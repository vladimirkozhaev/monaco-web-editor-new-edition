export interface ILanguageError {
	startLineNumber: number;
	startColumn: number;
	endLineNumber: number;
	endColumn: number;
	message: string;

	//expectedTokens: Array<string>;
}