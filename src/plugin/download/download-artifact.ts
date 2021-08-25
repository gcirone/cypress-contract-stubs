import { configVars, RemoteStub, stubCoordinate } from '../stubs/stubs-config';
import { debug } from '../utils/debug';
import { nexus3Url, nexusDownloadUrl, nexusUrl } from './nexus-url';
import { basename, dirname, resolve } from 'path';
import download from 'download';
import globby from 'globby';
import got from 'got';

/**
 * Stub item search request
 *
 * @param url
 * @param config
 */
async function stubItemSearch(url: string, config: RemoteStub): Promise<{ path: string; downloadUrl: string } | void> {
  try {
    const response = await got(url.toString(), { json: true, retries: 0 });

    if (response.body?.data?.repositoryPath) {
      const path = response.body.data.repositoryPath;
      const downloadUrl = nexusDownloadUrl(path, config).toString();
      return { path, downloadUrl };
    } else {
      return response.body?.items?.shift();
    }
  } catch (err) {
    debug('stubs:remote:error', err.message);
    return;
  }
}

/**
 * Download remote artifact
 *
 * @param config
 */
export async function downloadArtifact(config: RemoteStub): Promise<string | void> {
  const { artifactId } = stubCoordinate(config.id);

  const stubUrl = config.type === 'nexus' ? nexusUrl(config) : nexus3Url(config);

  debug('stubs:remote', `Search remote stub ${stubUrl} (${config.type})`);
  const stubItem = await stubItemSearch(stubUrl.toString(), config);

  const stubPattern = stubItem?.path
    ? resolve(`${configVars.cachePath}/${stubItem.path}`)
    : resolve(`${configVars.cachePath}/**/*${artifactId}*`);

  const stubPath = (await globby(stubPattern, { objectMode: true, stats: true }))
    .sort((a: any, b: any) => b.stats.ctime - a.stats.ctime) // eslint-disable-line
    .shift();

  if (stubPath) {
    debug('stubs:remote', `Stub available at ${stubPath.path}`);
    return stubPath.path;
  }

  if (stubItem?.downloadUrl) {
    debug('stubs:remote', `Download remote stub ${config.id} ${stubItem.downloadUrl}`);
    const downloadConfig = { directory: dirname(stubPattern), filename: basename(stubPattern), retries: 0 };
    await download(stubItem.downloadUrl, downloadConfig.directory, downloadConfig);

    debug('stubs:remote', `Stub downloaded at ${stubPattern}`);
    return stubPattern;
  }
}
