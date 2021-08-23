import { configVars, RemoteStub } from '../stubs/stubs-config';
import { debug } from '../utils/debug';
import { nexus3Url } from './nexus3-url';
import { basename, dirname, resolve } from 'path';
import download from 'download';
import globby from 'globby';
import got from 'got';

/**
 * Stub item request
 *
 * @param url
 */
async function stubItemRequest(url: string): Promise<{ path: string; downloadUrl: string } | void> {
  try {
    const response = await got(url.toString(), { json: true });
    return response.body.items.shift();
  } catch (err) {
    return;
  }
}

/**
 * Download remote artifact
 *
 * @param config
 */
export async function downloadArtifact(config: RemoteStub): Promise<string | void> {
  const stubURL = nexus3Url(config);
  debug('stubs:remote', `Search remote stub ${stubURL}`);

  const stubItem = await stubItemRequest(stubURL.toString());

  const stubPattern = stubItem?.path
    ? resolve(`${configVars.cachePath}/${stubItem.path}`)
    : resolve(`${configVars.cachePath}/**/*${stubURL.searchParams.get('name')}*`);

  const stubPath: any = (await globby(stubPattern, { stats: true }))
    .sort((a: any, b: any) => b.stats.ctime - a.stats.ctime)
    .shift();

  if (stubPath) {
    debug('stubs:remote', `Stub available at ${stubPath.path}`);
    return stubPath.path;
  } else if (stubItem?.downloadUrl) {
    debug('stubs:remote', `Download remote stub ${config.id} ${stubItem.downloadUrl}`);
    const downloadConfig = {
      directory: dirname(stubPattern),
      filename: basename(stubPattern)
    };
    await download(stubItem.downloadUrl, downloadConfig.directory, downloadConfig);

    debug('stubs:remote', `Stub downloaded at ${stubPattern}`);
    return stubPattern;
  }
}
