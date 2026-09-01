/** Pretty-prints the Planner manifest + topology for quick inspection. */
import * as fs from 'fs';
import * as path from 'path';

const ROOT = process.cwd();

interface Manifest {
  service: string;
  suites: { id: string; priority: string; categories: string[]; file: string }[];
}
interface Topology {
  criticalPath: string[];
}

const manifest = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'planner-output', 'plan-manifest.json'), 'utf-8'),
) as Manifest;
const topology = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'planner-output', 'topology.json'), 'utf-8'),
) as Topology;

console.log(`\nService: ${manifest.service}`);
console.log(`Critical DAG path: ${topology.criticalPath.join(' -> ')}\n`);
console.log('Suites:');
for (const s of manifest.suites) {
  console.log(`  [${s.priority}] ${s.id.padEnd(20)} ${s.categories.join(',').padEnd(30)} ${s.file}`);
}
console.log('');
