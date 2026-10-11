// @vitest-environment node
import { afterEach, expect, it } from "vitest";
import {
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { gzipSync, gunzipSync } from "node:zlib";

const root = process.cwd();
const bash =
  process.platform === "win32" ? "C:/Program Files/Git/bin/bash.exe" : "bash";
const folders: string[] = [];
function workspace() {
  const folder = mkdtempSync(join(root, ".zenoba-backup-test-"));
  folders.push(folder);
  return folder;
}
afterEach(() => {
  for (const folder of folders.splice(0)) {
    if (!resolve(folder).startsWith(join(root, ".zenoba-backup-test-")))
      throw new Error("Unsafe test cleanup");
    rmSync(folder, { recursive: true });
  }
});

it("backs up the retained legacy database by default into its existing naming scheme", () => {
  const folder = workspace();
  const result = spawnSync(
    bash,
    [
      "-c",
      'docker() { if [ "$*" != "exec -t netloka-db pg_dump -U netloka netloka" ]; then return 97; fi; printf "fixture-dump"; }; export -f docker; bash "$1"',
      "compatibility-test",
      join(root, "scripts/backup-db.sh"),
    ],
    {
      cwd: folder,
      encoding: "utf8",
      timeout: 10000,
      env: {
        ...process.env,
        BACKUP_DIR: folder,
        DB_CONTAINER: "",
        POSTGRES_USER: "",
        POSTGRES_DB: "",
      },
    },
  );
  expect(result.status, result.stderr).toBe(0);
  const files = readdirSync(folder);
  expect(files).toHaveLength(1);
  expect(files[0]).toMatch(/^netloka_backup_\d{8}_\d{6}\.sql\.gz$/);
  expect(gunzipSync(readFileSync(join(folder, files[0]))).toString()).toBe(
    "fixture-dump",
  );
});

it("restores a retained backup to the same legacy database after explicit confirmation", () => {
  const folder = workspace();
  const backup = join(folder, "netloka_backup_test.sql.gz");
  writeFileSync(backup, gzipSync("fixture-dump"));
  const result = spawnSync(
    bash,
    [
      "-c",
      'docker() { if [ "$*" != "exec -i netloka-db psql -U netloka -d netloka" ]; then return 97; fi; cat; }; export -f docker; bash "$1" "$2"',
      "compatibility-test",
      join(root, "scripts/restore-db.sh"),
      backup,
    ],
    {
      cwd: folder,
      encoding: "utf8",
      timeout: 10000,
      input: "y\n",
      env: {
        ...process.env,
        DB_CONTAINER: "",
        POSTGRES_USER: "",
        POSTGRES_DB: "",
      },
    },
  );
  expect(result.status, result.stderr).toBe(0);
  expect(result.stdout).toContain("fixture-dump");
});
