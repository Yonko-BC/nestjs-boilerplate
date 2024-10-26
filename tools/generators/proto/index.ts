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
    await execAsync(
      `protoc --proto_path=${protoDir} --plugin=protoc-gen-ts_proto=./node_modules/.bin/protoc-gen-ts_proto --ts_proto_opt=nestJs=true --ts_proto_out=${outputPath} ${protoPath}`,
    );
    console.log(`Generated TypeScript files for ${protoPath}`);
  } catch (error) {
    console.error(`Error generating TypeScript files for ${protoPath}:`, error);
  }
}

async function main() {
  const protoDir = path.join(__dirname, '../../../proto');
  const outputDir = path.join(__dirname, '../../../libs/proto');

  const protoFiles = fs
    .readdirSync(protoDir)
    .filter((file) => file.endsWith('.proto'));

  for (const protoFile of protoFiles) {
    const protoPath = path.join(protoDir, protoFile);
    const serviceName = path.basename(protoFile, '.proto');
    const serviceOutputDir = path.join(outputDir, serviceName, 'generated');

    if (!fs.existsSync(serviceOutputDir)) {
      fs.mkdirSync(serviceOutputDir, { recursive: true });
    }

    await generateProto(protoPath, serviceOutputDir, protoDir);
  }
}

main();
