// @flow
import fs from 'fs-extra';
import { validateProjectName } from './validate';
import DirectoryAlreadyExistsError from './errors/DirectoryAlreadyExistsError';
import {
  prepareExternalTemplate,
  prepareReactNativeTemplate,
} from './prepareTemplate';
import printRunInstructions from './printRunInstructions';

type Options = {|
  template?: string,
  rnVersion?: string,
|};

type ExternalTemplateOptions = $Diff<Options, { template: string }> & {
  template: string,
};

function createFromExternalTemplate(
  projectName: string,
  options: ExternalTemplateOptions
) {
  prepareExternalTemplate(projectName, options.template);
}

function createFromReactNativeTemplate(projectName: string, options: Options) {
  prepareReactNativeTemplate(projectName, options.rnVersion);
}

function createProject(projectName: string, options: Options): void {
  fs.mkdirSync(projectName);
  process.chdir(projectName);

  if (options.template) {
    return createFromExternalTemplate(projectName, options);
  }

  return createFromReactNativeTemplate(projectName, options);
}

export default async function initialize(
  projectName: string,
  options: Options
): Promise<void> {
  validateProjectName(projectName);

  if (fs.existsSync(projectName)) {
    throw new DirectoryAlreadyExistsError(projectName);
  }

  await createProject(projectName, options);

  printRunInstructions(process.cwd(), projectName);
}
