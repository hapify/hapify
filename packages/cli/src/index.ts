#!/usr/bin/env node
import 'reflect-metadata';
import { Container } from 'typedi';
import { LoggerService } from './service/Logger';
import { Program } from './class/Program';

// ############################################
// Get services
const logger = Container.get(LoggerService);

// ############################################
// Start program
async function run() {
	try {
		await new Program().run(process.argv);
		logger.time();
	} catch (error) {
		if (error.code !== 'commander.help') {
			logger.handleAndExit(error);
		}
	}
}
run().catch((error) => logger.handleAndExit(error));
