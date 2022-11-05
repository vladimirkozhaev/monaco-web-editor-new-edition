import * as monaco from "monaco-editor-core";

import IWorkerContext = monaco.worker.IWorkerContext;
import TodoLangLanguageService from "../language-service/LanguageService";
import { ILanguageError } from "../todo-lang/ILanguageError";




export class TodoLangWorker {

	private _ctx: IWorkerContext;
	private languageService: TodoLangLanguageService;
	constructor(ctx: IWorkerContext) {
		this._ctx = ctx;
		this.languageService = new TodoLangLanguageService();
	}

	doValidation(): Promise<ILanguageError[]> {
		const code = this.getTextDocument();
		return Promise.resolve(this.languageService.validate(code));
	}
	format(code: string): Promise<string> {
		return Promise.resolve(this.languageService.format(code));
	}

//	suggest(code: string, line: number, charPosInLine: number) {
//		return Promise.resolve(this.languageService.autoSuggest(code, line, charPosInLine))
//	}

	private getTextDocument(): string {
		const model = this._ctx.getMirrorModels()[0];// When there are multiple files open, this will be an array
		return model.getValue();
	}

}
