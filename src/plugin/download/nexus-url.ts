import { configVars, RemoteStub, stubCoordinate } from '../stubs/stubs-config';

/**
 * Nexus Repository Manager 3
 * https://help.sonatype.com/repomanager3/rest-and-integration-api/search-api
 *
 * @param config
 */
export function nexus3Url(config: RemoteStub): URL {
  const { groupId, artifactId, version, classifier } = stubCoordinate(config.id);
  const endpoint = `${configVars.endpointNexus3Context}/${configVars.endpointNexus3}`;

  const url = new URL(endpoint, config.server || configVars.server);
  url.searchParams.append('repository', config.repository || configVars.repository);
  url.searchParams.append('group', groupId);
  url.searchParams.append('name', artifactId);
  url.searchParams.append('maven.classifier', classifier);
  url.searchParams.append('maven.extension', 'jar');

  if (version === '+' || version.toLowerCase() === 'latest') {
    url.searchParams.append('sort', 'version');
  } else {
    url.searchParams.append('version', version);
  }

  return url;
}

/**
 * Nexus Repository Manager 2
 * https://repository.sonatype.org/nexus-restlet1x-plugin/default/docs/path__artifact_maven_content.html
 *
 * @param config
 */
export function nexusUrl(config: RemoteStub): URL {
  const { groupId, artifactId, version, classifier } = stubCoordinate(config.id);
  const endpoint = `${configVars.endpointNexusContext}/${configVars.endpointNexus}`;

  const url = new URL(endpoint, config.server || configVars.server);
  url.searchParams.append('r', config.repository || configVars.repository);
  url.searchParams.append('g', groupId);
  url.searchParams.append('a', artifactId);
  url.searchParams.append('c', classifier);
  url.searchParams.append('p', 'jar');

  if (version === '+' || version.toLowerCase() === 'latest') {
    url.searchParams.append('v', 'LATEST');
  } else {
    url.searchParams.append('v', version);
  }

  return url;
}
