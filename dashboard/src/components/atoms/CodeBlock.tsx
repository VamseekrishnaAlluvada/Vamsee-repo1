import { useMemo } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-bash';
import { cn } from '@/lib/utils';

export type CodeLang = 'json' | 'typescript' | 'python' | 'yaml' | 'bash' | 'text';

const GRAMMARS: Record<CodeLang, Prism.Grammar | undefined> = {
  json: Prism.languages.json,
  typescript: Prism.languages.typescript,
  python: Prism.languages.python,
  yaml: Prism.languages.yaml,
  bash: Prism.languages.bash,
  text: undefined,
};

export function CodeBlock({
  code,
  language = 'json',
  className,
}: {
  code: string;
  language?: CodeLang;
  className?: string;
}) {
  const html = useMemo(() => {
    const grammar = GRAMMARS[language];
    if (!grammar) return null;
    try {
      return Prism.highlight(code, grammar, language);
    } catch {
      return null;
    }
  }, [code, language]);

  return (
    <pre
      className={cn(
        'overflow-auto rounded-xl border border-black/10 bg-base/70 p-4 text-xs leading-relaxed',
        className,
      )}
    >
      {html ? <code dangerouslySetInnerHTML={{ __html: html }} /> : <code>{code}</code>}
    </pre>
  );
}
