import { PATHS, type AppPath } from './paths';

type ExtractPathParams<T extends string> =
  T extends `${infer _Prefix}:${infer Param}/${infer Rest}`
    ? { [K in Param | keyof ExtractPathParams<Rest>]: string | number }
    : T extends `${infer _Prefix}:${infer Param}`
      ? { [K in Param]: string | number }
      : // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- empty params for static paths
        {};

type GetPathParams<T extends string> =
  keyof ExtractPathParams<T> extends never
    ? [path: T]
    : [path: T, params: ExtractPathParams<T>];

type RouteBuilder = (args?: Record<string, string | number>) => string;

const pathPattern =
  /^(?:\/$|\/(?:[a-zA-Z0-9_-]+|:[a-zA-Z0-9_-]+)(?:\/(?:[a-zA-Z0-9_-]+|:[a-zA-Z0-9_-]+))*)$/;

function compile(template: string): RouteBuilder {
  if (!pathPattern.test(template)) {
    throw new Error(`Invalid path template: ${template}`);
  }

  const chunkPosByArgName: Record<string, number> = {};
  const chunks = template.split('/').map((chunk, index) => {
    if (!chunk.startsWith(':')) {
      return chunk;
    }

    chunkPosByArgName[chunk.slice(1)] = index;
    return null;
  });

  if (!Object.keys(chunkPosByArgName).length) {
    return () => template;
  }

  return (args?: Record<string, string | number>) => {
    if (!args) {
      throw new Error(`Missing args to build route ${template}`);
    }

    const routeChunks = chunks.slice();

    for (const argName of Object.keys(chunkPosByArgName)) {
      if (!(argName in args)) {
        throw new Error(`Missing arg ${argName} to build route ${template}`);
      }

      routeChunks[chunkPosByArgName[argName]] = String(args[argName]);
    }

    return routeChunks.join('/');
  };
}

const compiled: Record<string, RouteBuilder> = Object.fromEntries(
  Object.values(PATHS).map((path) => [path, compile(path)]),
);

/**
 * Собирает URL из path-шаблона и параметров.
 *
 * @example
 * getPath(PATHS.POSTS)
 * // => '/posts'
 *
 * @example
 * getPath(PATHS.POST_EDIT, { id: 1 })
 * // => '/posts/1/edit'
 */
export function getPath<T extends AppPath>(...args: GetPathParams<T>): string;
export function getPath<T extends string>(...args: GetPathParams<T>): string {
  const [basePath, params] = args;

  if (!compiled[basePath]) {
    compiled[basePath] = compile(basePath);
  }

  return compiled[basePath](params);
}
