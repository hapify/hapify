import * as Path from 'path';

import { Server } from '@hapi/hapi';
import Inert from '@hapi/inert';
import DetectPort from 'detect-port';
import Open from 'open';
import pkgDir from 'pkg-dir';
import { Service } from 'typedi';

import { LoggerService } from './Logger';
import { OptionsService } from './Options';
import { WebSocketServerService } from './WebSocketServer';

const RootDir = pkgDir.sync(__dirname);

@Service()
export class HttpServerService {
  /** WebApp root */
  private rootPath: string = Path.join(RootDir, 'dist', 'html');

  /** Start port number */
  private minPortValue = 4800;

  /** Start port getter */
  get minPort(): number {
    return this.minPortValue;
  }

  /** Maximum port number */
  private maxPortValue = 4820;

  /** Maximum port getter */
  get maxPort(): number {
    return this.maxPortValue;
  }

  /** Current port number */
  private portValue: number = this.minPortValue;

  /** Current port getter */
  get port(): number {
    return this.portValue;
  }

  /** The server instance */
  private server: Server;

  /** Denotes if the server is started */
  private serverStarted: boolean;

  constructor(
    private optionsService: OptionsService,
    private webSocketServerService: WebSocketServerService,
    private loggerService: LoggerService,
  ) {}

  /**
   * Starts the http server
   * Check if running before starting
   */
  public async serve(): Promise<void> {
    if (this.started()) return;

    // Choose port
    this.portValue = this.optionsService.port()
      ? this.optionsService.port()
      : await this.findAvailablePort();

    // Create server
    this.server = new Server({
      port: this.portValue,
      routes: {
        cors: { credentials: true },
        files: {
          relativeTo: this.rootPath,
        },
      },
    });

    // Create static files handler
    await this.server.register(Inert);
    this.server.route({
      method: 'GET',
      path: '/{param*}',
      handler: {
        directory: {
          path: '.',
          redirectToSlash: true,
          index: true,
        },
      },
    });

    // Create catch-all fallback
    this.server.ext('onPreResponse', (request: any, h: any) => {
      const { response } = request;
      if (response.isBoom && response.output.statusCode === 404) {
        return h.file('index.html').code(200);
      }
      return h.continue;
    });

    // Start server
    await this.server.start();
    this.serverStarted = true;

    // Bind events
    this.server.listener.on('close', () => {
      this.webSocketServerService
        .stop()
        .catch((error) => this.loggerService.handle(error));
    });

    this.webSocketServerService.serve(this.server.listener);
  }

  /**
   * Stops the http server
   * Check if running before stop
   */
  public async stop(): Promise<void> {
    if (!this.started()) return;
    this.serverStarted = false;
    // Stop self server
    await this.server.stop();
    this.server = null;
  }

  /** Denotes if the HTTP server is running */
  public started(): boolean {
    return this.server && this.serverStarted;
  }

  /**
   * Open the browser for the current server
   * Do not open if not started
   */
  public async open(): Promise<void> {
    const url = this.url();
    if (url) {
      await Open(url);
    }
  }

  /**
   * Get the URL of the current session
   * Returns null if not started
   */
  public url(): string | null {
    return this.started()
      ? `http://${this.optionsService.hostname()}:${this.portValue}`
      : null;
  }

  /** Test ports and returns the first one available */
  private async findAvailablePort(increment = 0): Promise<number> {
    if (this.portValue > this.maxPortValue) {
      throw new Error(
        `Reached maximum port number ${this.maxPortValue} to start HTTP server`,
      );
    }
    const requiredPort = this.portValue + increment;
    const possiblePort = await DetectPort(requiredPort);
    return requiredPort !== possiblePort
      ? this.findAvailablePort(increment + 1)
      : requiredPort;
  }
}
