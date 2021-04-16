import { Service } from 'typedi';
import chalk from 'chalk';
import { OptionsService } from './Options';
import { RichError } from '../class/RichError';

type LogType = 'stderr' | 'stdout';
type LoggerOutput = { [key in LogType]: string };

@Service()
export class LoggerService {
	private output: LoggerOutput = {
		stdout: '',
		stderr: '',
	};

	constructor(private optionsService: OptionsService) {}

	/** Handle an error */
	handle(error: Error): this {
		let message = '✖ ';
		if ((<RichError>error).data) {
			const data = (<RichError>error).data;
			message += `[${data.type}:${data.code}] `;
			message += data.details ? data.details : error.message;
		} else {
			message += error.message;
		}
		if (this.optionsService.debug()) {
			message += `\n${error.stack.toString()}`;
		}
		this.log(chalk.red(message), 'stderr');
		return this;
	}
	/** Handle an error */
	handleAndExit(error: Error, code = 1): this {
		this.handle(error);
		process.exit(code);
		return this;
	}

	/** Display a message */
	raw(message: string): this {
		this.log(message, 'stdout');
		return this;
	}

	/** Display a success message */
	success(message: string): this {
		this.log(`${chalk.green('✓')} ${message}`, 'stdout');
		return this;
	}

	/** Display an info */
	info(message: string): this {
		this.log(`${chalk.blueBright('•')} ${message}`, 'stdout');
		return this;
	}

	/** Display an info if in debug mode */
	debug(message: string): this {
		if (this.optionsService.debug()) {
			this.log(`${chalk.cyan('*')} ${message}`, 'stdout');
		}
		return this;
	}

	/** Display an error */
	error(message: string): this {
		this.log(`${chalk.red('✖')} ${message}`, 'stdout');
		return this;
	}

	/** Add new lines */
	newLine(count: number = 1): this {
		this.log(`\n`.repeat(count - 1), 'stdout');
		return this;
	}

	/** Display an error */
	warning(message: string): this {
		this.log(`${chalk.yellow('!')} ${message}`, 'stdout');
		return this;
	}

	/** Display ascii art */
	art(): this {
		this.log(this.getArt(), 'stdout');
		return this;
	}

	/** Get ascii art */
	getArt(): string {
		return chalk.magentaBright(
			'  _    _             _  __       \n' +
				' | |  | |           (_)/ _|      \n' +
				' | |__| | __ _ _ __  _| |_ _   _ \n' +
				" |  __  |/ _` | '_ \\| |  _| | | |\n" +
				' | |  | | (_| | |_) | | | | |_| |\n' +
				' |_|  |_|\\__,_| .__/|_|_|  \\__, |\n' +
				'              | |           __/ |\n' +
				'              |_|          |___/ '
		);
	}

	/** Display the running time */
	time(): this {
		if (this.optionsService.debug()) {
			const message = `Process ran in ${process.uptime()}`;
			this.log(message, 'stdout');
		}
		return this;
	}

	private log(message: string, type: LogType): void {
		if (!this.optionsService.silent()) {
			console.log(message);
		}
		this.output[type] += message;
	}

	getOutput(): LoggerOutput {
		return this.output;
	}
}
