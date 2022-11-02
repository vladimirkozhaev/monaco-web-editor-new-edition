import * as monaco from "monaco-editor-core";

import IWorkerContext = monaco.worker.IWorkerContext;
import TodoLangLanguageService from "../language-service/LanguageService";
import { ILanguageError } from "../lang-util/ILanguageError";



export class TodoLangWorker {

    private _ctx: IWorkerContext;
    private languageService: TodoLangLanguageService;
    constructor(ctx: IWorkerContext) {
        this._ctx = ctx;
        this.languageService = new TodoLangLanguageService();
        alert("TodoLangWorker  constructor")
    }

    doValidation(): Promise<ILanguageError[]> {
        const code = this.getTextDocument();
        return Promise.resolve(this.languageService.validate(code));
    }
    format(code: string): Promise<string>{
        return Promise.resolve(this.languageService.format(code));
    }
    
    
	autoSuggest(code: string, pos: monaco.Position): Promise<monaco.languages.CompletionItem[]> {
		return Promise.resolve(this.languageService.autoSuggest(code, pos))
	}
    private getTextDocument(): string {
        const model = this._ctx.getMirrorModels()[0];// When there are multiple files open, this will be an array
        return model.getValue();
    }

}
