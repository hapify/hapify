import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { RichError } from '@app/class/RichError';

type MessageLevel = 'info' | 'success' | 'warning' | 'error';

export interface ErrorHandler {
	name: string;
	/** Must return true if hte error has been handled */
	handle: (error: Error) => boolean;
}

@Injectable()
export class MessageService {
	/** A set of functions that can handle an error and skip the default behavior */
	private errorHandlers: ErrorHandler[] = [];
	/** Display duration */
	defaultDuration = 4000;
	/** Display duration for error */
	errorDuration = 8000;

	/** Constructor */
	constructor(private translateService: TranslateService, public snackBar: MatSnackBar) {}
	/** Push an error handler to the set */
	addErrorHandler(handler: ErrorHandler): void {
		// Avoid conflict
		this.removeErrorHandler(handler.name);
		this.errorHandlers.push(handler);
	}
	/** Remove an error handler to the set */
	removeErrorHandler(name: string): void {
		this.errorHandlers = this.errorHandlers.filter((h) => h.name !== name);
	}
	/** Show info */
	info(message: string): void {
		this.show(message, 'info');
	}
	/** Show success */
	success(message: string): void {
		this.show(message, 'success');
	}
	/** Show warning */
	warning(message: string): void {
		this.show(message, 'warning');
	}
	/** Handle an error */
	error(error: Error, asWarning = false): void {
		// Try handlers first
		for (const handler of this.errorHandlers) {
			if (handler.handle(error)) {
				return;
			}
		}
		// Translate and display error
		if (error instanceof RichError) {
			const key = `error_code-${error.data.code}`;
			this.translateService.get(key).subscribe((errorDetails) => {
				const message = errorDetails !== key && errorDetails.trim().length ? errorDetails : `${error.message}\n${error.data.type}: ${error.data.code}`;
				this.show(message, asWarning ? 'warning' : 'error');
			});
		} else {
			this.show(error.message, asWarning ? 'warning' : 'error');
		}
		// Dump in console anyway
		console.error(error.message);
	}
	/** Log a message */
	log(message: string | any): void {
		console.log(message);
	}

	/** Helper to translate key */
	translateKey(key: string | Array<string>, interpolateParams?: object): Promise<string> {
		return this.translateService.get(key, interpolateParams).toPromise();
	}

	/** Show the snackbar with the message */
	private show(message: string, level: MessageLevel): void {
		this.translateService.get('error_dismiss-action').subscribe((dismissText) => {
			this.snackBar.open(message, dismissText, {
				duration: level === 'error' ? this.errorDuration : this.defaultDuration,
				panelClass: ['messageBar', `${level}Bar`],
				horizontalPosition: 'right',
				verticalPosition: 'top',
			});
		});
	}
}
