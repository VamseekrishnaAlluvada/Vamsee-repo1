/**
 * Contract validation via AJV against the OpenAPI component schemas.
 *
 * MANDATE: on every 2xx response, the body is validated against its declared
 * schema BEFORE any functional assertions. A mismatch fails the test.
 *
 * OpenAPI 3.0 uses a JSON-Schema-adjacent dialect. We register every
 * component schema under `#/components/schemas/<Name>` so `$ref`s resolve,
 * and enable ajv-formats for `date`, etc.
 */

import Ajv, { ValidateFunction, ErrorObject } from 'ajv';
import addFormats from 'ajv-formats';
import * as fs from 'fs';
import * as path from 'path';

interface OpenApiDoc {
  components: {
    schemas: Record<string, object>;
  };
}

export interface SchemaValidationResult {
  valid: boolean;
  errors: string[];
}

class SchemaValidator {
  private static instance: SchemaValidator | undefined;
  private readonly ajv: Ajv;
  private readonly cache = new Map<string, ValidateFunction>();
  private readonly doc: OpenApiDoc;

  private constructor() {
    this.ajv = new Ajv({
      allErrors: true,
      strict: false, // OpenAPI keywords like `nullable`/`example` are non-standard
      coerceTypes: false, // do NOT coerce — we want to catch string-vs-number drift
    });
    addFormats(this.ajv);

    const specPath = path.resolve(process.cwd(), 'spec', 'openapi.json');
    this.doc = JSON.parse(fs.readFileSync(specPath, 'utf-8')) as OpenApiDoc;

    // Register each component schema by its canonical $ref id so refs resolve.
    for (const [name, schema] of Object.entries(this.doc.components.schemas)) {
      const id = `#/components/schemas/${name}`;
      if (!this.ajv.getSchema(id)) {
        this.ajv.addSchema(schema, id);
      }
    }
  }

  static get(): SchemaValidator {
    if (!SchemaValidator.instance) {
      SchemaValidator.instance = new SchemaValidator();
    }
    return SchemaValidator.instance;
  }

  private compile(schemaName: string): ValidateFunction {
    const cached = this.cache.get(schemaName);
    if (cached) {
      return cached;
    }
    const id = `#/components/schemas/${schemaName}`;
    const validate = this.ajv.getSchema(id);
    if (!validate) {
      throw new Error(
        `[schema-validator] Unknown component schema "${schemaName}". ` +
          `Check spec/openapi.json #/components/schemas.`,
      );
    }
    this.cache.set(schemaName, validate);
    return validate;
  }

  validate(schemaName: string, data: unknown): SchemaValidationResult {
    const validate = this.compile(schemaName);
    const valid = validate(data) as boolean;
    if (valid) {
      return { valid: true, errors: [] };
    }
    return {
      valid: false,
      errors: (validate.errors ?? []).map(formatError),
    };
  }
}

function formatError(err: ErrorObject): string {
  const at = err.instancePath === '' ? '(root)' : err.instancePath;
  const params = JSON.stringify(err.params);
  return `${at} ${err.message ?? 'invalid'} ${params}`;
}

export function validateSchema(
  schemaName: string,
  data: unknown,
): SchemaValidationResult {
  return SchemaValidator.get().validate(schemaName, data);
}
