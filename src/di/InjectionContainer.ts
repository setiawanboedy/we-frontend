type ServiceFactory<T = unknown> = () => T
type ServiceInstance<T = unknown> = T

export class InjectionContainer {
  private services = new Map<string, ServiceInstance>()
  private factories = new Map<string, ServiceFactory>()

  register<T>(name: string, factory: ServiceFactory<T>): void {
    this.factories.set(name, factory)
  }

  registerSingleton<T>(name: string, instance: T): void {
    this.services.set(name, instance)
  }

  get<T>(name: string): T {
    if (this.services.has(name)) {
      return this.services.get(name) as T
    }

    const factory = this.factories.get(name)
    if (factory) {
      const instance = factory()
      return instance as T
    }

    throw new Error(`Service '${name}' not found`)
  }

  getSingleton<T>(name: string): T {
    if (this.services.has(name)) {
      return this.services.get(name) as T
    }

    const factory = this.factories.get(name)
    if (factory) {
      const instance = factory()
      this.services.set(name, instance)
      return instance as T
    }

    throw new Error(`Service '${name}' not found`)
  }

    clear(): void {
    this.services.clear()
    this.factories.clear()
  }
}
