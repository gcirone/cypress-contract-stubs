import { configVars, RemoteStub, stubCoordinate } from '../stubs/stubs-config';
import { logger } from '../utils/debug';
import { nexus3Url, nexusDownloadUrl, nexusUrl } from './nexus-url';
import { filePattern, workdir } from '../utils/file-pattern';
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
    const response = await got(url, { json: true, retries: 0 });

    if (response.body?.data?.repositoryPath) {
      const path = response.body.data.repositoryPath;
      const downloadUrl = nexusDownloadUrl(path, config).toString();
      return { path, downloadUrl };
    } else {
      return response.body?.items?.shift();
    }
  } catch (err: any) {
    logger.debug('stubs:remote:error', err.message);
    return;
  }
}

/**
 * Download remote artifact
 *
 * @param config
 */
export async function downloadArtifact(config: RemoteStub): Promise<string | void> {
  const stubUrl = config.type === 'nexus' ? nexusUrl(config) : nexus3Url(config);
  const { artifactId } = stubCoordinate(config.id);

  logger.debug('stubs:remote', `Search remote stub ${stubUrl} (${config.type || 'nexus3'})`);
  const stubItem = await stubItemSearch(stubUrl.toString(), config);

  const stubPattern = filePattern(
    stubItem?.path
      ? resolve(workdir(), `${configVars.cachePath}/${stubItem.path}`)
      : resolve(workdir(), `${configVars.cachePath}/**/*${artifactId}*`)
  );

  const stubPath = (await globby(stubPattern, { objectMode: true, stats: true }))
    .sort((a: any, b: any) => b.stats.ctime - a.stats.ctime) // eslint-disable-line
    .shift();

  if (stubPath) {
    logger.debug('stubs:remote', `Stub available at ${stubPath.path}`);
    return stubPath.path;
  }

  if (stubItem?.downloadUrl) {
    logger.debug('stubs:remote', `Download remote stub ${config.id} ${stubItem.downloadUrl}`);
    const downloadConfig = { directory: dirname(stubPattern), filename: basename(stubPattern), retries: 0 };
    await download(stubItem.downloadUrl, downloadConfig.directory, downloadConfig);

    logger.debug('stubs:remote', `Stub downloaded at ${stubPattern}`);
    return stubPattern;
  }
}
