import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

const execAsync = promisify(exec);

async function generateProto(
  protoPath: string,
  outputPath: string,
  protoDir: string,
) {
  try {
    const projectRoot = path.join(__dirname, '../../..');

    // Add multiple proto paths to help resolve imports
    const command = [
      'protoc',
      `--proto_path=${projectRoot}`, // Add project root to help resolve imports
      `--proto_path=${protoDir}`,
      `--proto_path=${path.join(projectRoot, 'node_modules', 'google-protobuf', 'google')}`,
      '--plugin=protoc-gen-ts_proto=./node_modules/.bin/protoc-gen-ts_proto',
      '--ts_proto_opt=nestJs=true',
      '--ts_proto_opt=esModuleInterop=true',
      `--ts_proto_out=${outputPath}`,
      protoPath,
    ].join(' ');

    console.log('Executing command:', command);

    const { stdout, stderr } = await execAsync(command);

    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);

    console.log(`Generated TypeScript files for ${protoPath}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        `Error generating TypeScript files for ${protoPath}:`,
        error.message,
      );
    }
    throw error;
  }
}

async function main() {
  const protoDir = path.join(__dirname, '../../../proto');
  const outputDir = path.join(__dirname, '../../../libs/proto');

  const protoFiles = fs
    .readdirSync(protoDir)
    .filter((file) => file.endsWith('.proto'))
    .sort((a, b) => {
      if (a === 'user.proto') return -1;
      if (b === 'user.proto') return 1;
      return 0;
    });

  for (const protoFile of protoFiles) {
    const protoPath = path.join(protoDir, protoFile);
    const serviceName = path.basename(protoFile, '.proto');
    const serviceOutputDir = path.join(outputDir, serviceName, 'generated');

    if (!fs.existsSync(serviceOutputDir)) {
      fs.mkdirSync(serviceOutputDir, { recursive: true });
    }

    try {
      await generateProto(protoPath, serviceOutputDir, protoDir);
    } catch (error) {
      console.error(`Failed to generate ${protoFile}:`, error);
      process.exit(1);
    }
  }
}

main().catch((error) => {
  console.error('Failed to generate proto files:', error);
  process.exit(1);
});
