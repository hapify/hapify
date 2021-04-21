import { IStorable } from '../interfaces/storable';
import { WebSocketService } from './websocket.service';
import { Injectable } from '@angular/core';

@Injectable()
export abstract class StorageService<T extends IStorable> {
  /** Cached instances */
  private instances: T[] = null;
  /** Pending reading */
  private locked = false;

  /** Constructor */
  constructor(protected websocketService: WebSocketService) {}

  /** Returns the current instances */
  async list(): Promise<T[]> {
    // If the instances are loaded, returns directly
    if (this.instances) {
      return this.instances;
    }
    // Wait for other process to be finished and recheck if it is still necessary to get instances
    await this.lock();
    // Create the cached instances if not created
    if (this.instances === null) {
      const result = await this.websocketService
        .send(this.getMessageId())
        .catch(() => []);
      // If the instances are not created yet, use []
      const objects = result instanceof Array ? result : [];
      // Create instances from objects
      this.instances = objects.map((object) => {
        const instance = this.instance();
        instance.fromObject(object);
        return instance;
      });
      // Sort the instances
      this.sort(this.instances);
    }
    // Release the lock
    this.release();
    // Returns instances
    return this.instances;
  }

  /** Save current instances to storage */
  protected async save(instances: T[]): Promise<void> {
    // Sort the instances
    this.sort(instances);
    // Convert instances
    const objects = instances.map((instance) => instance.toObject());
    // Store
    await this.websocketService.send(this.setMessageId(), objects);
    // Clear cache
    this.instances = null;
  }

  /** Push a instance into the storage */
  async add(instance: T | T[]): Promise<void> {
    // Add the instance to the list
    const instances = await this.list();
    if (instance instanceof Array) {
      await this.save(instances.concat(instance));
    } else {
      instances.push(instance);
      await this.save(instances);
    }
  }

  /** Find a instance and remove it */
  async remove(instance: T | T[]): Promise<void> {
    // Remove the instance from the list
    const instances =
      instance instanceof Array
        ? (await this.list()).filter(
            (m) => !instance.some((i) => m.id === i.id),
          )
        : (await this.list()).filter((m) => m.id !== instance.id);
    // Find instance
    await this.save(instances);
  }

  /** Find a instance and replace it with its new version */
  async update(instance: T | T[]): Promise<void> {
    // Remove the instance from the list
    const instances =
      instance instanceof Array
        ? (await this.list()).filter(
            (m) => !instance.some((i) => m.id === i.id),
          )
        : (await this.list()).filter((m) => m.id !== instance.id);
    // Add the instance to the list
    if (instance instanceof Array) {
      await this.save(instances.concat(instance));
    } else {
      instances.push(instance);
      await this.save(instances);
    }
  }

  /** Find a instance with its id */
  async find(id: string): Promise<T> {
    // Add the instance to the list
    const instances = await this.list();
    // Find instance
    return instances.find((instance) => instance.id === id);
  }

  /** Clear all the storage */
  async clear(): Promise<void> {
    await this.save([]);
  }

  /** Resolves when the client is ready */
  private async lock(): Promise<void> {
    if (!this.locked) {
      this.locked = true;
      return;
    }
    await new Promise((resolve) => {
      setTimeout(() => resolve(this.lock()), 10);
    });
  }
  /** Resolves when the client is ready */
  private release(): void {
    this.locked = false;
  }

  /** Returns a new instance */
  protected abstract instance(): T;

  /** Returns the name of the websocket set message id */
  protected abstract setMessageId(): string;

  /** Returns the name of the websocket set message id */
  protected abstract getMessageId(): string;

  /** Sort the instances */
  protected abstract sort(instances: T[]): void;
}
